// server/src/routes/activity.js
// Lightweight activity tracking for practice test pages.
// Fires when a logged-in user answers their first question on a free practice test.
const express = require('express');
const router  = express.Router();
const db      = require('../config/db');
const jwt     = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/activity/practice
// Body: { exam_code: 'PAR' }
// Auth: optional — silently no-ops for guests
router.post('/practice', async (req, res) => {
  try {
    const header = req.headers.authorization || '';
    const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.sendStatus(204);

    let decoded;
    try { decoded = jwt.verify(token, JWT_SECRET); } catch { return res.sendStatus(204); }

    const examCode = (req.body.exam_code || '').toUpperCase();
    if (!['PAR','IRA','CAX','UAG'].includes(examCode)) return res.sendStatus(204);

    await db.query(
      `UPDATE users
          SET last_practice_at   = NOW(),
              last_practice_exam = $1
        WHERE id = $2`,
      [examCode, decoded.id]
    );
    res.sendStatus(204);
  } catch (err) {
    // Never surface errors to the client — tracking should never break the page
    res.sendStatus(204);
  }
});

module.exports = router;
