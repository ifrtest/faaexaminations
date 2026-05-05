// server/src/routes/cheatsheet.js
const express = require('express');
const crypto  = require('crypto');
const db      = require('../config/db');
const { sendEmail, cheatsheetVerifyEmail, cheatsheetDeliveryEmail } = require('../utils/email');

const router = express.Router();

const SITE = () => process.env.CLIENT_URL || 'https://faaexaminations.com';
const VALID_PLANS = ['par', 'ira', 'cax', 'uag'];

// POST /api/cheatsheet/request
// Body: { email, plan }
// Saves lead, sends verification email
router.post('/request', async (req, res) => {
  try {
    let { email, plan = 'par' } = req.body;
    email = (email || '').trim().toLowerCase();
    plan  = VALID_PLANS.includes(plan) ? plan : 'par';

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    // Upsert: reset token if they request again
    const token = crypto.randomBytes(24).toString('hex');
    await db.query(
      `INSERT INTO cheatsheet_leads (email, plan, token, verified, cheatsheet_sent, created_at)
       VALUES ($1, $2, $3, false, false, NOW())
       ON CONFLICT (email, plan) DO UPDATE
         SET token = EXCLUDED.token,
             verified = false,
             cheatsheet_sent = false,
             created_at = NOW()`,
      [email, plan, token]
    );

    const verifyUrl = `${SITE()}/cheatsheet/verify/${token}`;
    const html = cheatsheetVerifyEmail(plan, verifyUrl);
    const PLAN_NAMES = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', uag: 'Part 107 Remote Pilot' };
    await sendEmail({
      to: email,
      subject: `Confirm your email — ${PLAN_NAMES[plan] || 'FAA'} Cheat Sheet`,
      html,
      allowUnsubscribed: true,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error('[cheatsheet/request]', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

// GET /api/cheatsheet/verify/:token
// Marks lead verified, sends delivery email, returns plan for redirect
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const { rows } = await db.query(
      `SELECT id, email, plan, verified, cheatsheet_sent
       FROM cheatsheet_leads
       WHERE token = $1
         AND created_at > NOW() - INTERVAL '24 hours'`,
      [token]
    );

    if (!rows.length) {
      return res.status(404).json({ error: 'This link has expired or is invalid. Please request the cheat sheet again.' });
    }

    const lead = rows[0];

    // Mark verified
    await db.query(
      `UPDATE cheatsheet_leads SET verified = true WHERE id = $1`,
      [lead.id]
    );

    // Send delivery email if not already sent
    if (!lead.cheatsheet_sent) {
      const PLAN_NAMES = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', uag: 'Part 107 Remote Pilot' };
      const html = cheatsheetDeliveryEmail(lead.plan);
      await sendEmail({
        to: lead.email,
        subject: `Your ${PLAN_NAMES[lead.plan] || 'FAA'} Cheat Sheet`,
        html,
        allowUnsubscribed: true,
      });
      await db.query(
        `UPDATE cheatsheet_leads SET cheatsheet_sent = true WHERE id = $1`,
        [lead.id]
      );
    }

    res.json({ ok: true, plan: lead.plan });
  } catch (err) {
    console.error('[cheatsheet/verify]', err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

module.exports = router;
