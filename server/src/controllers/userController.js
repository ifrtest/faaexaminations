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
        `SELECT id, email, full_name, role, subscription, uag_access, is_active, created_at
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
    const { role, is_active, subscription, uag_access } = req.body;
    const { rows } = await db.query(
      `UPDATE users SET
         role         = COALESCE($1, role),
         is_active    = COALESCE($2, is_active),
         subscription = COALESCE($3, subscription),
         uag_access   = CASE WHEN $5::boolean IS NOT NULL THEN $5 ELSE uag_access END,
         updated_at   = NOW()
       WHERE id=$4
       RETURNING id, email, full_name, role, subscription, uag_access, is_active`,
      [role, is_active, subscription, req.params.id, uag_access ?? null]
    );
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) { next(err); }
};

// GET /api/users/:id/results  (admin — view any user's test history)
exports.userResults = async (req, res, next) => {
  try {
    const { rows } = await db.query(
      `SELECT r.id, r.score, r.passed, r.total_questions, r.correct_count,
              r.created_at, e.code AS exam_code, e.name AS exam_name,
              s.mode AS session_mode
         FROM exam_results r
         JOIN exams e ON e.id = r.exam_id
         LEFT JOIN exam_sessions s ON s.id = r.session_id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
        LIMIT 100`,
      [req.params.id]
    );
    res.json({ results: rows });
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

// DELETE /api/users/:id  (admin)
exports.remove = async (req, res, next) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ error: 'You cannot delete your own account.' });
    }
    const { rows } = await db.query('SELECT role FROM users WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'User not found' });
    if (rows[0].role === 'admin') {
      return res.status(400).json({ error: 'Cannot delete admin accounts.' });
    }
    await db.query('DELETE FROM users WHERE id=$1', [req.params.id]);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// GET /api/users/admin/stats  (admin dashboard tiles)
exports.adminStats = async (_req, res, next) => {
  try {
    const [users, tests, questions, examStats] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '7 days')::int AS new_week,
                       COUNT(*) FILTER (WHERE subscription_status IN ('active','trialing','past_due') AND subscription IN ('par','ira','cax','bundle','uag'))::int AS pro
                  FROM users`),
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE passed)::int AS passed,
                       COALESCE(ROUND(AVG(score)::numeric, 2), 0) AS avg_score
                  FROM exam_results`),
      db.query(`SELECT COUNT(*)::int AS total,
                       COUNT(*) FILTER (WHERE is_active)::int AS active
                  FROM questions`),
      db.query(`SELECT e.code, e.name,
                       COUNT(r.id)::int AS total_completed,
                       COUNT(*) FILTER (WHERE r.passed = true)::int AS total_passed,
                       COALESCE(ROUND(AVG(r.score)::numeric, 1), 0) AS avg_score
                  FROM exams e
                  LEFT JOIN exam_results r ON r.exam_id = e.id
                  GROUP BY e.id, e.code, e.name
                  ORDER BY e.id`),
    ]);

    res.json({
      users:     users.rows[0],
      tests:     tests.rows[0],
      questions: questions.rows[0],
      examStats: examStats.rows,
    });
  } catch (err) { next(err); }
};

// GET /api/users/admin/email-export  (admin CSV download)
exports.emailExport = async (_req, res, next) => {
  try {
    // Registered users (exclude internal/test accounts by role)
    const { rows: userRows } = await db.query(`
      SELECT email,
             COALESCE(full_name, '') AS name,
             subscription,
             subscription_status,
             COALESCE(to_char(created_at, 'YYYY-MM-DD'), '') AS joined,
             'registered' AS source
      FROM users
      WHERE role != 'admin'
        AND is_active = TRUE
        AND email_unsubscribed = FALSE
      ORDER BY created_at ASC
    `);

    // Cheat sheet leads (verified only, not already registered)
    const userEmails = new Set(userRows.map(r => r.email.toLowerCase()));
    const { rows: leadRows } = await db.query(`
      SELECT email,
             '' AS name,
             plan AS subscription,
             'lead' AS subscription_status,
             COALESCE(to_char(created_at, 'YYYY-MM-DD'), '') AS joined,
             'cheatsheet_lead' AS source
      FROM cheatsheet_leads
      WHERE verified = TRUE
      ORDER BY created_at ASC
    `);

    // Deduplicate — registered users take priority
    const leads = leadRows.filter(r => !userEmails.has(r.email.toLowerCase()));
    const all = [...userRows, ...leads];

    // Build CSV
    const escape = (v) => `"${String(v || '').replace(/"/g, '""')}"`;
    const header = ['Email', 'Name', 'Plan', 'Status', 'Joined', 'Source'].map(escape).join(',');
    const csvRows = all.map(r =>
      [r.email, r.name, r.subscription, r.subscription_status, r.joined, r.source].map(escape).join(',')
    );
    const csv = [header, ...csvRows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="faaexaminations-emails-${new Date().toISOString().slice(0,10)}.csv"`);
    res.send(csv);
  } catch (err) { next(err); }
};
