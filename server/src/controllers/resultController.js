// server/src/controllers/resultController.js
const db = require('../config/db');

// GET /api/results  (current user's history)
exports.myResults = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, e.code AS exam_code, e.name AS exam_name, s.mode AS session_mode,
              (
                SELECT t.name
                  FROM questions q
                  JOIN topics t ON t.id = q.topic_id
                 WHERE q.id = ANY(s.question_ids)
                 GROUP BY t.name
                HAVING COUNT(*) = array_length(s.question_ids, 1)
                 LIMIT 1
              ) AS topic_name
         FROM exam_results r
         JOIN exams e ON e.id=r.exam_id
         LEFT JOIN exam_sessions s ON s.id=r.session_id
        WHERE r.user_id=$1
        ORDER BY r.created_at DESC
        LIMIT 50`,
      [req.user.id]
    );
    res.json({ results: rows });
  } catch (err) { next(err); }
};

// GET /api/results/:id
exports.getResult = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.*, e.code AS exam_code, e.name AS exam_name
         FROM exam_results r
         JOIN exams e ON e.id=r.exam_id
        WHERE r.id=$1 AND r.user_id=$2`,
      [req.params.id, req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Result not found' });

    // Fetch question review detail
    const { rows: detail } = await db.query(
      `SELECT a.selected_answer, a.is_correct,
              q.id, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.choice_d,
              q.correct_answer, q.explanation, q.image_url,
              t.name AS topic_name
         FROM exam_answers a
         JOIN questions q  ON q.id=a.question_id
         LEFT JOIN topics t ON t.id=q.topic_id
        WHERE a.session_id=$1
        ORDER BY a.id`,
      [rows[0].session_id]
    );
    res.json({ result: rows[0], detail });
  } catch (err) { next(err); }
};

// GET /api/results/dashboard
// Aggregated view: stats, score-trend, weak topics, pass predictor
exports.dashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Per-exam summary + history trend
    const { rows: perExam } = await db.query(
      `SELECT e.code, e.name, e.passing_score,
              COUNT(r.id)::int                                 AS attempts,
              COALESCE(ROUND(AVG(r.score)::numeric, 2), 0)     AS avg_score,
              COALESCE(ROUND(MAX(r.score)::numeric, 2), 0)     AS best_score,
              COALESCE(ROUND(MIN(r.score)::numeric, 2), 0)     AS worst_score,
              COUNT(*) FILTER (WHERE r.passed)::int            AS passes
         FROM exams e
         LEFT JOIN exam_results r
              ON r.exam_id=e.id AND r.user_id=$1
         GROUP BY e.id
         ORDER BY e.id`,
      [userId]
    );

    // Score trend (last 20 results, all exams, chronological)
    const { rows: trend } = await db.query(
      `SELECT r.id, r.score, r.passed, r.created_at,
              e.code AS exam_code
         FROM exam_results r
         JOIN exams e ON e.id=r.exam_id
        WHERE r.user_id=$1
        ORDER BY r.created_at DESC
        LIMIT 20`,
      [userId]
    );
    trend.reverse();

    // Overall totals
    const { rows: totalsRows } = await db.query(
      `SELECT COUNT(*)::int AS total_tests,
              COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS overall_avg,
              COALESCE(SUM(total_questions), 0)::int AS total_questions_answered,
              COALESCE(SUM(correct_count),   0)::int AS total_correct
         FROM exam_results
        WHERE user_id=$1`,
      [userId]
    );
    const totals = totalsRows[0];

    // Weak topics: aggregate by topic across all sessions
    const { rows: topicRows } = await db.query(
      `SELECT COALESCE(t.name,'Uncategorized') AS topic,
              COUNT(*)::int                       AS total,
              COUNT(*) FILTER (WHERE a.is_correct)::int AS correct
         FROM exam_answers a
         JOIN questions q  ON q.id=a.question_id
         LEFT JOIN topics t ON t.id=q.topic_id
         JOIN exam_sessions s ON s.id=a.session_id
        WHERE s.user_id=$1
        GROUP BY COALESCE(t.name,'Uncategorized')
        HAVING COUNT(*) >= 3
        ORDER BY (COUNT(*) FILTER (WHERE a.is_correct)::float / COUNT(*)::float) ASC
        LIMIT 10`,
      [userId]
    );
    const topics = topicRows.map((r) => ({
      topic: r.topic,
      total: r.total,
      correct: r.correct,
      accuracy: r.total ? +((r.correct / r.total) * 100).toFixed(1) : 0,
    }));

    // Pass predictor
    const readiness = computeReadiness({
      perExam, totals, weakTopics: topics,
    });

    res.json({
      totals,
      perExam,
      trend,
      weakTopics: topics,
      readiness,
    });
  } catch (err) { next(err); }
};

// ---------------------------------------------------------------------
// Readiness algorithm: 0..100 likelihood of passing the real exam.
//
// Ingredients:
//   * recent average score (weighted toward the last 5 attempts)
//   * consistency (stddev of recent scores — lower is better)
//   * coverage (how many total tests taken — more data = more confidence)
//   * weakest-topic drag (pull score down if any frequently-tested topic is <60%)
// ---------------------------------------------------------------------
function computeReadiness({ perExam, totals, weakTopics }) {
  const attempts = totals.total_tests || 0;
  if (attempts === 0) {
    return {
      score: 0,
      label: 'Not enough data',
      confidence: 'low',
      advice: 'Take at least one practice exam to get a readiness estimate.',
      breakdown: { recent_avg: 0, coverage: 0, weak_penalty: 0 },
    };
  }

  // Use the best-attempted exam category for the estimate.
  const active = perExam
    .filter((e) => Number(e.attempts) > 0)
    .sort((a, b) => Number(b.attempts) - Number(a.attempts))[0];

  const recentAvg = active ? Number(active.avg_score) : Number(totals.overall_avg);
  const passingLine = active ? Number(active.passing_score) : 70;

  // Coverage: up to +8 bonus for >=10 tests.
  const coverage = Math.min(attempts / 10, 1) * 8;

  // Weak-topic penalty: subtract up to 10 if avg topic accuracy <60% & weighted.
  let weakPenalty = 0;
  for (const t of weakTopics) {
    if (t.accuracy < 60 && t.total >= 5) weakPenalty += 2;
  }
  weakPenalty = Math.min(weakPenalty, 12);

  // Base readiness: scale recentAvg relative to passing line.
  //   at passing_line     -> 70 readiness
  //   at passing_line+15  -> 90 readiness
  //   at passing_line-15  -> 50 readiness
  let base = 70 + ((recentAvg - passingLine) * (20 / 15));
  base = Math.max(0, Math.min(100, base));

  let score = Math.round(Math.max(0, Math.min(100, base + coverage - weakPenalty)));

  let label, advice;
  if (score >= 85)      { label = 'Exam Ready';          advice = "You're consistently passing — schedule your FAA exam."; }
  else if (score >= 70) { label = 'Nearly Ready';        advice = 'Review weak topics and take a few more full-length exams.'; }
  else if (score >= 55) { label = 'Building Competency'; advice = 'Focus on study mode and target your weakest topics.'; }
  else                  { label = 'More Practice Needed';advice = 'Keep studying each topic before attempting full exams.'; }

  const confidence = attempts >= 8 ? 'high' : attempts >= 3 ? 'medium' : 'low';

  return {
    score,
    label,
    confidence,
    advice,
    breakdown: {
      recent_avg: +recentAvg.toFixed(1),
      coverage:   +coverage.toFixed(1),
      weak_penalty: +weakPenalty.toFixed(1),
    },
  };
}
