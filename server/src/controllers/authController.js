// server/src/controllers/authController.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db     = require('../config/db');
const { sign } = require('../middleware/auth');
const { randomToken } = require('../utils/helpers');
const { sendEmail, welcomeEmail, passwordResetEmail } = require('../utils/email');
const { capiLead } = require('../utils/metaCapi');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

// Canonicalize an email so alias tricks map to one identity.
// Gmail ignores dots and everything after "+" in the local part — fraud bots
// abuse this to spin up many "unique" accounts from one inbox. Normalize those
// so a single Gmail can only register once.
function canonicalEmail(email) {
  const lower = String(email || '').trim().toLowerCase();
  const at = lower.lastIndexOf('@');
  if (at < 1) return lower;
  let local = lower.slice(0, at);
  const domain = lower.slice(at + 1);
  local = local.split('+')[0];               // drop +tags for every provider
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return local.replace(/\./g, '') + '@gmail.com';
  }
  return local + '@' + domain;
}

exports.register = async (req, res, next) => {
  try {
    const { email, password, full_name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const existing = await db.query('SELECT id FROM users WHERE email=$1', [email.toLowerCase()]);
    if (existing.rows.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Block alias-trick duplicates (e.g. Gmail dot/plus variations of an existing account)
    const canon = canonicalEmail(email);
    const domain = email.toLowerCase().split('@')[1] || '';
    if (domain === 'gmail.com' || domain === 'googlemail.com') {
      const gmails = await db.query(
        `SELECT email FROM users WHERE lower(email) LIKE '%@gmail.com' OR lower(email) LIKE '%@googlemail.com'`
      );
      if (gmails.rows.some((r) => canonicalEmail(r.email) === canon)) {
        return res.status(409).json({ error: 'Email already registered' });
      }
    }

    const password_hash = await bcrypt.hash(password, ROUNDS);
    const { rows } = await db.query(
      `INSERT INTO users (email, password_hash, full_name)
       VALUES ($1,$2,$3)
       RETURNING id, email, full_name, role, subscription`,
      [email.toLowerCase(), password_hash, full_name || null]
    );
    const user = rows[0];

    // Apply a comp code (free-access promo) if one was supplied and is still valid.
    // Grants full access for N days with status 'cancelling' so it auto-revokes at the end date.
    let compApplied = null;
    const rawCode = (req.body.comp_code || '').trim();
    if (rawCode) {
      const cc = await db.query(
        `SELECT code, plan, days, max_uses, used_count FROM comp_codes
           WHERE lower(code) = lower($1) AND active = true`,
        [rawCode]
      );
      const code = cc.rows[0];
      if (code && code.used_count < code.max_uses) {
        const endsAt = new Date(Date.now() + code.days * 86400000).toISOString();
        const uag = ['bundle', 'all', 'uag'].includes(code.plan);
        await db.query(
          `UPDATE users
             SET subscription = $1, subscription_status = 'cancelling',
                 subscription_ends_at = $2, uag_access = $3
           WHERE id = $4`,
          [code.plan, endsAt, uag, user.id]
        );
        await db.query(
          `UPDATE comp_codes SET used_count = used_count + 1 WHERE lower(code) = lower($1)`,
          [code.code]
        );
        user.subscription = code.plan;
        compApplied = { plan: code.plan, days: code.days, ends_at: endsAt };
      }
    }

    const token = sign({ id: user.id, role: user.role });
    // Send welcome email (non-blocking)
    sendEmail({
      to: user.email,
      subject: 'Welcome to FAAExaminations.com ✈',
      html: welcomeEmail(user.full_name || user.email.split('@')[0], user.id),
      userId: user.id,
    });
    // Fire CAPI Lead event (non-blocking)
    const leadEventId = crypto.randomUUID();
    capiLead({
      eventId:   leadEventId,
      email:     user.email,
      firstName: user.full_name?.split(' ')[0],
      userId:    user.id,
      userAgent: req.headers['user-agent'],
    });
    res.status(201).json({ user, token, leadEventId, compApplied });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const { rows } = await db.query(
      'SELECT id, email, full_name, role, subscription, uag_access, password_hash, is_active FROM users WHERE email=$1',
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

    const clientUrl = process.env.CLIENT_URL || 'https://faaexaminations.com';
    const resetUrl = `${clientUrl}/reset?token=${token}`;

    // Get user's name for the email
    const { rows: nameRows } = await db.query('SELECT full_name FROM users WHERE id=$1', [user.id]);
    const name = nameRows[0]?.full_name || email.split('@')[0];

    await sendEmail({
      to: email.toLowerCase(),
      subject: 'Reset your FAAExaminations.com password',
      html: passwordResetEmail(name, resetUrl, user.id),
      userId: user.id,
      allowUnsubscribed: true,
    });

    res.json({ message: 'If that email is registered, a reset link has been sent.' });
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
