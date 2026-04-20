// server/src/controllers/quizController.js
const db = require('../config/db');
const { shuffle } = require('../utils/helpers');

// GET /api/quizzes/exams  ->  list of exam categories
exports.listExams = async (_req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT e.*,
             (SELECT COUNT(*) FROM questions q WHERE q.exam_id=e.id AND q.is_active) AS question_count
      FROM exams e
      ORDER BY e.id
    `);
    res.json({ exams: rows });
  } catch (err) { next(err); }
};

// GET /api/quizzes/exams/:code/topics
exports.listTopics = async (req, res, next) => {
  try {
    const { code } = req.params;
    // Hide sub-section topics (names starting with a digit, like "1.1 Compass Errors",
    // "91.103 Preflight Action") — show only top-level Topics + Appendices.
    // Sort Topic 1, Topic 2, ... 10, 11, 12 numerically, then Appendix A after.
    const { rows } = await db.query(`
      SELECT t.id, t.name, t.slug,
             (SELECT COUNT(*) FROM questions q WHERE q.topic_id=t.id AND q.is_active) AS question_count
      FROM topics t
      JOIN exams e ON e.id=t.exam_id
      WHERE e.code=$1
        AND t.name !~ '^[0-9]'
      ORDER BY
        CASE WHEN t.name ~ '^Topic ([0-9]+)' THEN 0
             WHEN t.name ~ '^Appendix'       THEN 1
             ELSE 2 END,
        COALESCE(NULLIF(substring(t.name from '^Topic ([0-9]+)'), '')::int, 0),
        t.name
    `, [code.toUpperCase()]);
    res.json({ topics: rows });
  } catch (err) { next(err); }
};

// POST /api/quizzes/start
// body: { exam_code, mode: 'exam' | 'study', num_questions, topic_id?, time_limit? }
exports.startSession = async (req, res, next) => {
  try {
    const {
      exam_code,
      mode = 'exam',
      num_questions,
      topic_id,
      time_limit,
      demo = false,
    } = req.body;

    if (!exam_code) return res.status(400).json({ error: 'exam_code is required' });
    if (!['exam', 'study'].includes(mode)) return res.status(400).json({ error: 'Invalid mode' });

    const { rows: examRows } = await db.query(
      'SELECT * FROM exams WHERE code=$1',
      [exam_code.toUpperCase()]
    );
    const exam = examRows[0];
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Demo mode: free users get 10 PAR questions in study mode, no subscription needed
    if (demo) {
      if (exam.code !== 'PAR') {
        return res.status(403).json({ error: 'Free sample is only available for the PAR exam.' });
      }
      const { rows: demoPool } = await db.query(
        `SELECT id FROM questions WHERE exam_id=$1 AND is_active ORDER BY RANDOM() LIMIT 10`,
        [exam.id]
      );
      if (!demoPool.length) return res.status(400).json({ error: 'No questions available' });
      const { rows: sessRows } = await db.query(
        `INSERT INTO exam_sessions (user_id, exam_id, mode, question_ids, time_limit)
         VALUES ($1,$2,'study',$3,0) RETURNING *`,
        [req.user.id, exam.id, demoPool.map((r) => r.id)]
      );
      return res.status(201).json({ session: sessRows[0] });
    }

    // Subscription access check
    const { rows: userRows } = await db.query(
      'SELECT subscription_status, subscription_price_id FROM users WHERE id=$1',
      [req.user.id]
    );
    const user = userRows[0];
    const PRICE_EXAMS = require('../routes/stripe').PRICE_EXAMS;
    const allowedExamIds = PRICE_EXAMS[user?.subscription_price_id] || [];
    if (user?.subscription_status !== 'active' || !allowedExamIds.includes(exam.id)) {
      return res.status(403).json({ error: 'A subscription is required to access this exam.' });
    }

    const limit = Math.max(1, Math.min(parseInt(num_questions, 10) || exam.num_questions, 200));

    // Find questions this user has already seen in completed sessions for this exam
    const { rows: seenRows } = await db.query(
      `SELECT DISTINCT unnest(question_ids) AS qid
       FROM exam_sessions
       WHERE user_id=$1 AND exam_id=$2 AND status='completed'`,
      [req.user.id, exam.id]
    );
    const seenIds = seenRows.map((r) => r.qid);

    // Build base filter
    const baseParams = [exam.id];
    let baseWhere = 'q.exam_id=$1 AND q.is_active';
    if (topic_id) {
      baseParams.push(topic_id);
      baseWhere += ` AND q.topic_id=$${baseParams.length}`;
    }

    // Try unseen questions first; fall back to full pool if not enough
    let poolRows = [];
    if (seenIds.length > 0) {
      const unseenParams = [...baseParams, seenIds];
      const { rows } = await db.query(
        `SELECT id FROM questions q WHERE ${baseWhere} AND q.id <> ALL($${unseenParams.length}::int[]) ORDER BY RANDOM() LIMIT ${limit}`,
        unseenParams
      );
      poolRows = rows;
    }

    // If we don't have enough unseen questions, top up from the full pool
    if (poolRows.length < limit) {
      const exclude = poolRows.map((r) => r.id);
      const topUpParams = [...baseParams, exclude.length ? exclude : [-1]];
      const { rows: topUp } = await db.query(
        `SELECT id FROM questions q WHERE ${baseWhere} AND q.id <> ALL($${topUpParams.length}::int[]) ORDER BY RANDOM() LIMIT ${limit - poolRows.length}`,
        topUpParams
      );
      poolRows = [...poolRows, ...topUp];
    }

    if (!poolRows.length) return res.status(400).json({ error: 'No questions available' });

    const question_ids = poolRows.map((r) => r.id);
    const resolvedLimit = mode === 'exam'
      ? (parseInt(time_limit, 10) || exam.time_limit)
      : 0;

    const { rows: sessRows } = await db.query(
      `INSERT INTO exam_sessions
          (user_id, exam_id, mode, question_ids, time_limit)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [req.user.id, exam.id, mode, question_ids, resolvedLimit]
    );
    res.status(201).json({ session: sessRows[0] });
  } catch (err) { next(err); }
};

// GET /api/quizzes/sessions/:id
exports.getSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      `SELECT s.*, e.code AS exam_code, e.name AS exam_name
       FROM exam_sessions s
       JOIN exams e ON e.id = s.exam_id
       WHERE s.id=$1 AND s.user_id=$2`,
      [id, req.user.id]
    );
    const session = rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });

    // Fetch question payloads. Hide correct_answer & explanation during exam mode
    // until completion. In study mode, return them so the client can reveal.
    const hideAnswers = session.mode === 'exam' && session.status === 'in_progress';
    const baseCols = hideAnswers
      ? 'q.id, q.exam_id, q.topic_id, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.choice_d, q.image_url, q.difficulty'
      : 'q.id, q.exam_id, q.topic_id, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.choice_d, q.image_url, q.difficulty, q.correct_answer, q.explanation';

    const { rows: qRows } = await db.query(
      `SELECT ${baseCols}, t.name AS topic_name
         FROM questions q
         LEFT JOIN topics t ON t.id = q.topic_id
         WHERE q.id = ANY($1::int[])`,
      [session.question_ids]
    );
    // Preserve the original question order.
    const ordered = session.question_ids.map((qid) => qRows.find((q) => q.id === qid)).filter(Boolean);

    res.json({ session, questions: ordered });
  } catch (err) { next(err); }
};

// GET /api/quizzes/sessions  (user's in-progress sessions)
exports.listMySessions = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT s.*, e.code AS exam_code, e.name AS exam_name
       FROM exam_sessions s
       JOIN exams e ON e.id=s.exam_id
       WHERE s.user_id=$1
       ORDER BY s.started_at DESC
       LIMIT 50`,
      [req.user.id]
    );
    res.json({ sessions: rows });
  } catch (err) { next(err); }
};

// POST /api/quizzes/sessions/:id/answer
// body: { question_id, answer: 'A'|'B'|'C'|'D'|null, flagged?: bool, current_index?: int }
exports.saveAnswer = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question_id, answer, flagged, current_index } = req.body;

    const { rows } = await db.query(
      'SELECT * FROM exam_sessions WHERE id=$1 AND user_id=$2',
      [id, req.user.id]
    );
    const session = rows[0];
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status !== 'in_progress') {
      return res.status(400).json({ error: 'Session is not in progress' });
    }
    if (!session.question_ids.includes(question_id)) {
      return res.status(400).json({ error: 'Question not part of this session' });
    }

    const answers = { ...(session.answers || {}) };
    if (answer === null || answer === undefined) {
      delete answers[question_id];
    } else {
      if (!['A', 'B', 'C', 'D'].includes(answer)) {
        return res.status(400).json({ error: 'Invalid answer letter' });
      }
      answers[question_id] = answer;
    }

    let flagged_ids = session.flagged_ids || [];
    if (typeof flagged === 'boolean') {
      const set = new Set(flagged_ids);
      if (flagged) set.add(question_id);
      else set.delete(question_id);
      flagged_ids = [...set];
    }

    const updatedIndex =
      typeof current_index === 'number' ? current_index : session.current_index;

    const { rows: updated } = await db.query(
      `UPDATE exam_sessions
         SET answers=$1, flagged_ids=$2, current_index=$3
       WHERE id=$4
       RETURNING *`,
      [answers, flagged_ids, updatedIndex, id]
    );
    res.json({ session: updated[0] });
  } catch (err) { next(err); }
};

// POST /api/quizzes/sessions/:id/submit
exports.submitSession = async (req, res, next) => {
  const client = await db.getClient();
  try {
    const { id } = req.params;
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT * FROM exam_sessions WHERE id=$1 AND user_id=$2 FOR UPDATE',
      [id, req.user.id]
    );
    const session = rows[0];
    if (!session) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Session not found' }); }
    if (session.status === 'completed') {
      await client.query('ROLLBACK');
      // Return existing result if any.
      const { rows: exist } = await db.query(
        'SELECT * FROM exam_results WHERE session_id=$1', [id]);
      return res.json({ session, result: exist[0] || null });
    }

    // Load questions with correct answers.
    const { rows: qRows } = await client.query(
      `SELECT id, correct_answer, topic_id FROM questions WHERE id = ANY($1::int[])`,
      [session.question_ids]
    );
    const byId = new Map(qRows.map((q) => [q.id, q]));

    // Topic names for breakdown
    const topicIds = [...new Set(qRows.map((q) => q.topic_id).filter(Boolean))];
    let topicMap = new Map();
    if (topicIds.length) {
      const { rows: tRows } = await client.query(
        'SELECT id, name FROM topics WHERE id = ANY($1::int[])', [topicIds]);
      topicMap = new Map(tRows.map((t) => [t.id, t.name]));
    }

    const answers = session.answers || {};
    let correct = 0;
    const topicBreakdown = {};        // { topicName: { correct, total } }
    const answerInserts = [];

    for (const qid of session.question_ids) {
      const q = byId.get(qid);
      if (!q) continue;
      const selected = answers[qid] || null;
      const isCorrect = selected !== null && selected === q.correct_answer;
      if (isCorrect) correct += 1;

      const topicName = q.topic_id ? (topicMap.get(q.topic_id) || 'Uncategorized') : 'Uncategorized';
      if (!topicBreakdown[topicName]) topicBreakdown[topicName] = { correct: 0, total: 0 };
      topicBreakdown[topicName].total  += 1;
      topicBreakdown[topicName].correct += isCorrect ? 1 : 0;

      answerInserts.push({ qid, selected, isCorrect });
    }

    const total  = session.question_ids.length;
    const score  = total ? +((correct / total) * 100).toFixed(2) : 0;

    const { rows: examRows } = await client.query(
      'SELECT passing_score FROM exams WHERE id=$1', [session.exam_id]);
    const passing = examRows[0]?.passing_score || 70;
    const passed = score >= passing;

    const startedAt = new Date(session.started_at).getTime();
    const duration  = Math.floor((Date.now() - startedAt) / 1000);

    // Update session
    await client.query(
      `UPDATE exam_sessions
          SET status='completed', completed_at=NOW(), score=$1, passed=$2
        WHERE id=$3`,
      [score, passed, id]
    );

    // Insert per-question rows
    for (const a of answerInserts) {
      await client.query(
        `INSERT INTO exam_answers (session_id, question_id, selected_answer, is_correct)
         VALUES ($1,$2,$3,$4)`,
        [id, a.qid, a.selected, a.isCorrect]
      );
    }

    // Create result
    const { rows: resultRows } = await client.query(
      `INSERT INTO exam_results
         (session_id, user_id, exam_id, total_questions, correct_count,
          score, passed, duration_sec, topic_breakdown)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING *`,
      [id, req.user.id, session.exam_id, total, correct, score, passed, duration, topicBreakdown]
    );

    await client.query('COMMIT');

    // Build review payload
    const { rows: fullQ } = await db.query(
      `SELECT id, question_text, choice_a, choice_b, choice_c, choice_d,
              correct_answer, explanation, image_url, topic_id
       FROM questions WHERE id = ANY($1::int[])`,
      [session.question_ids]
    );
    const review = session.question_ids.map((qid) => {
      const q = fullQ.find((x) => x.id === qid);
      return q ? { ...q, selected: answers[qid] || null } : null;
    }).filter(Boolean);

    res.json({ result: resultRows[0], review });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

// POST /api/quizzes/sessions/:id/abandon
exports.abandonSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query(
      `UPDATE exam_sessions SET status='abandoned'
       WHERE id=$1 AND user_id=$2 AND status='in_progress'`,
      [id, req.user.id]
    );
    res.json({ message: 'Session abandoned' });
  } catch (err) { next(err); }
};
