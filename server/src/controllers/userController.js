// server/src/controllers/userController.js
const bcrypt = require('bcryptjs');
const db     = require('../config/db');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

// GET /api/users  (admin)
exports.list = async (req, res, next) => {
  try {
    const search = req.query.search || '';
    const page     = Math.max(parseInt(req.query.page, 10)     || 1, 1);
    const pageSize = Math.min(parseInt(req.query.pageSize, 10) || 25, 100);
    const offset   = (page - 1) * pageSize;

    const params = [];
    let where = '';
    if (search) {
      params.push(`%${search}%`);
      where = `WHERE email ILIKE $${params.length} OR full_name ILIKE $${params.length}`;
    }

    const [list, count] = await Promise.all([
      db.query(
        `SELECT id, email, full_name, role, subscription, is_active, created_at
           FROM users ${where}
          ORDER BY created_at DESC
          LIMIT ${pageSize} OFFSET ${offset}`,
        params
      ),
      db.query(`SELECT COUNT(*)::int AS total FROM users ${where}`, params),
    ]);

    res.json({ users: list.rows, total: count.rows[0].total, page, pageSize });
  } catch (err) { next(err); }
};

// GET /api/users/:id  (admin)
exports.get = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT id, email, full_name, role, subscription, is_active, created_at
         FROM users WHERE id=$1`,
      [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });

    const stats = await db.query(
      `SELECT COUNT(*)::int AS tests,
              COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS avg_score
         FROM exam_results WHERE user_id=$1`,
      [req.params.id]
    );
    res.json({ user: rows[0], stats: stats.rows[0] });
  } catch (err) { next(err); }
};

// PUT /api/users/:id  (admin - update role/active/subscription)
exports.update = async (req, res, next) => {
  try {
    const { role, is_active, subscription } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET
         role         = COALESCE($1, role),
         is_active    = COALESCE($2, is_active),
         subscription = COALESCE($3, subscription),
         updated_at   = NOW()
       WHERE id=$4
       RETURNING id, email, full_name, role, subscription, is_active`,
      [role, is_active, subscription, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

// PUT /api/users/me  (update own profile)
exports.updateMe = async (req, res, next) => {
  try {
    const { full_name, password, current_password } = req.body;
    const updates = [];
    const params  = [];
    let p = 1;

    if (full_name !== undefined) { updates.push(`full_name=$${p++}`); params.push(full_name); }

    if (password) {
      if (!current_password) {
        return res.status(400).json({ error: 'Current password required to set a new one' });
      }
      const existing = await db.query('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
      const ok = await bcrypt.compare(current_password, existing.rows[0].password_hash);
      if (!ok) return res.status(401).json({ error: 'Current password is incorrect' });
      if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
      const hash = await bcrypt.hash(password, ROUNDS);
      updates.push(`password_hash=$${p++}`); params.push(hash);
    }

    if (!updates.length) return res.json({ user: req.user });
    params.push(req.user.id);

    const { rows } = await db.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at=NOW()
       WHERE id=$${p} RETURNING id, email, full_name, role, subscription, is_active`,
      params
    );
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

// GET /api/users/admin/stats  (admin dashboard tiles)
exports.adminStats = async (_req, res, next) => {
  try {
    const [users, tests, questions] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS new_week,
                       COUNT(*) FILTER (WHERE subscription='pro')::int AS pro
                  FROM users`),
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE passed)::int AS passed,
                       COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS avg_score
                  FROM exam_results`),
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE is_active)::int AS active
                  FROM questions`),
    ]);

    res.json({
      users:     users.rows[0],
      tests:     tests.rows[0],
      questions: questions.rows[0],
    });
  } catch (err) { next(err); }
};
