// server/src/controllers/authController.js
const bcrypt = require('bcryptjs');
const db     = require('../config/db');
const { sign } = require('../middleware/auth');
const { randomToken } = require('../utils/helpers');
const { sendEmail, welcomeEmail } = require('../utils/email');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const password_hash = await bcrypt.hash(password, ROUNDS);
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1,$2,$3)
       RETURNING id, email, full_name, role, subscription`,
      [email.toLowerCase(), password_hash, full_name || null]
    );
    const user = rows[0];
    const token = sign({ id: user.id, role: user.role });
    // Send welcome email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'Welcome to FAAExaminations.com ✈',
      html: welcomeEmail(user.full_name || user.email.split('@')[0]),
    });
    res.status(201).json({ user, token });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { rows } = await db.query(
      'SELECT id, email, full_name, role, subscription, password_hash, is_active FROM users WHERE email=$1',
      [email.toLowerCase()]
    );
    const user = rows[0];
    if (!user || !user.is_active) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' });

    const token = sign({ id: user.id, role: user.role });
    delete user.password_hash;
    res.json({ user, token });
  } catch (err) { next(err); }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};

exports.logout = async (_req, res) => {
  // Stateless JWT: the client just discards the token.
  res.json({ message: 'Logged out' });
};

exports.requestPasswordReset = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    const { rows } = await db.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    const user = rows[0];
    // Always return success to prevent email enumeration.
    if (!user) return res.json({ message: 'If the email exists, a reset link was sent.' });

    const token = randomToken();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h
    await db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1,$2,$3)',
      [user.id, token, expires]
    );
    // In production, email this. For dev we return it.
    res.json({
      message: 'Password reset token generated',
      ...(process.env.NODE_ENV !== 'production' ? { token } : {}),
    });
  } catch (err) { next(err); }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ error: 'Token and password required' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const { rows } = await db.query(
      `SELECT id, user_id, expires_at, used FROM password_resets WHERE token=$1`,
      [token]
    );
    const record = rows[0];
    if (!record || record.used || new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const hash = await bcrypt.hash(password, ROUNDS);
    await db.query('UPDATE users SET password_hash=$1, updated_at=NOW() WHERE id=$2', [hash, record.user_id]);
    await db.query('UPDATE password_resets SET used=TRUE WHERE id=$1', [record.id]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) { next(err); }
};
