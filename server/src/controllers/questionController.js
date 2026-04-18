// server/src/controllers/questionController.js
const path   = require('path');
const fs     = require('fs');
const multer = require('multer');
const db     = require('../config/db');
const { slugify } = require('../utils/helpers');

// ----- file uploads --------------------------------------------------
const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename:    (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});
exports.upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = /^image\/(png|jpe?g|gif|webp|svg\+xml)$/.test(file.mimetype);
    ok ? cb(null, true) : cb(new Error('Only image files allowed'));
  },
});

// POST /api/questions/upload
exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.status(201).json({ url });
};

// ----- question CRUD -------------------------------------------------
// GET /api/questions?exam=PAR&topic_id=1&search=&page=1&pageSize=25
exports.list = async (req, res, next) => {
  try {
    const { exam, topic_id, search } = req.query;
    const page     = Math.max(parseInt(req.query.page, 10)     || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 25, 100);
    const offset   = (page - 1) * pageSize;

    const params = [];
    const where  = [];

    if (exam) {
      params.push(exam.toUpperCase());
      where.push(`e.code=$${params.length}`);
    }
    if (topic_id) {
      params.push(topic_id);
      where.push(`q.topic_id=$${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      where.push(`q.question_text ILIKE $${params.length}`);
    }

    const whereSql = where.length ? 'WHERE ' + where.join(' AND ') : '';

    const listSql = `
      SELECT q.*, e.code AS exam_code, t.name AS topic_name
      FROM questions q
      JOIN exams e ON e.id=q.exam_id
      LEFT JOIN topics t ON t.id=q.topic_id
      ${whereSql}
      ORDER BY q.id DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const countSql = `
      SELECT COUNT(*)::int AS total
      FROM questions q
      JOIN exams e ON e.id=q.exam_id
      ${whereSql}
    `;

    const [list, count] = await Promise.all([
      db.query(listSql, params),
      db.query(countSql, params),
    ]);

    res.json({
      questions: list.rows,
      total: count.rows[0].total,
      page, pageSize,
    });
  } catch (err) { next(err); }
};

// GET /api/questions/:id
exports.get = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT q.*, e.code AS exam_code, t.name AS topic_name
         FROM questions q
         JOIN exams e   ON e.id=q.exam_id
         LEFT JOIN topics t ON t.id=q.topic_id
        WHERE q.id=$1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Question not found' });
    res.json({ question: rows[0] });
  } catch (err) { next(err); }
};

async function resolveTopic(exam_id, topic_name) {
  if (!topic_name) return null;
  const slug = slugify(topic_name);
  const { rows } = await db.query(
    'SELECT id FROM topics WHERE exam_id=$1 AND slug=$2', [exam_id, slug]);
  if (rows[0]) return rows[0].id;
  const ins = await db.query(
    'INSERT INTO topics (exam_id, name, slug) VALUES ($1,$2,$3) RETURNING id',
    [exam_id, topic_name, slug]);
  return ins.rows[0].id;
}

// POST /api/questions
exports.create = async (req, res, next) => {
  try {
    const {
      exam_code, topic_name,
      question_text, choice_a, choice_b, choice_c, choice_d,
      correct_answer, explanation, image_url, difficulty,
    } = req.body;

    if (!exam_code || !question_text || !correct_answer) {
      return res.status(400).json({ error: 'exam_code, question_text, correct_answer are required' });
    }
    const examRes = await db.query('SELECT id FROM exams WHERE code=$1', [exam_code.toUpperCase()]);
    if (!examRes.rows[0]) return res.status(400).json({ error: 'Invalid exam_code' });
    const exam_id  = examRes.rows[0].id;
    const topic_id = await resolveTopic(exam_id, topic_name);

    const { rows } = await db.query(
      `INSERT INTO questions
         (exam_id, topic_id, question_text, choice_a, choice_b, choice_c, choice_d,
          correct_answer, explanation, image_url, difficulty)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       RETURNING *`,
      [exam_id, topic_id, question_text, choice_a, choice_b, choice_c, choice_d,
       correct_answer.toUpperCase(), explanation || null, image_url || null,
       difficulty || 'medium']
    );
    res.status(201).json({ question: rows[0] });
  } catch (err) { next(err); }
};

// PUT /api/questions/:id
exports.update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      exam_code, topic_name,
      question_text, choice_a, choice_b, choice_c, choice_d,
      correct_answer, explanation, image_url, difficulty, is_active,
    } = req.body;

    const existing = await db.query('SELECT * FROM questions WHERE id=$1', [id]);
    if (!existing.rows[0]) return res.status(404).json({ error: 'Question not found' });
    const cur = existing.rows[0];

    let exam_id = cur.exam_id;
    if (exam_code) {
      const er = await db.query('SELECT id FROM exams WHERE code=$1', [exam_code.toUpperCase()]);
      if (!er.rows[0]) return res.status(400).json({ error: 'Invalid exam_code' });
      exam_id = er.rows[0].id;
    }
    let topic_id = cur.topic_id;
    if (topic_name !== undefined) topic_id = await resolveTopic(exam_id, topic_name);

    const { rows } = await db.query(
      `UPDATE questions SET
         exam_id=$1, topic_id=$2,
         question_text=$3, choice_a=$4, choice_b=$5, choice_c=$6, choice_d=$7,
         correct_answer=$8, explanation=$9, image_url=$10,
         difficulty=$11, is_active=$12, updated_at=NOW()
       WHERE id=$13 RETURNING *`,
      [
        exam_id, topic_id,
        question_text ?? cur.question_text,
        choice_a ?? cur.choice_a, choice_b ?? cur.choice_b,
        choice_c ?? cur.choice_c, choice_d ?? cur.choice_d,
        (correct_answer || cur.correct_answer).toUpperCase(),
        explanation ?? cur.explanation,
        image_url   ?? cur.image_url,
        difficulty  ?? cur.difficulty,
        typeof is_active === 'boolean' ? is_active : cur.is_active,
        id,
      ]
    );
    res.json({ question: rows[0] });
  } catch (err) { next(err); }
};

// DELETE /api/questions/:id  (soft-deactivate)
exports.remove = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      'UPDATE questions SET is_active=FALSE, updated_at=NOW() WHERE id=$1 RETURNING id',
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Question not found' });
    res.json({ message: 'Question deactivated', id: rows[0].id });
  } catch (err) { next(err); }
};
