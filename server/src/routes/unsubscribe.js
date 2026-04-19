// server/src/routes/unsubscribe.js
const express = require('express');
const db = require('../config/db');
const { unsubToken } = require('../utils/email');

const router = express.Router();

function page(title, body) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body{margin:0;background:#080e14;color:#e5eef5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px}
      .card{max-width:480px;background:#0f1822;border:1px solid #1e2a38;border-radius:14px;padding:36px;text-align:center}
      h1{margin:0 0 12px;font-size:22px}
      p{color:#93a5b5;line-height:1.6;margin:8px 0}
      a{color:#30ace2;text-decoration:none}
      .brand{font-size:14px;font-weight:800;letter-spacing:.3px;margin-bottom:18px}
      .brand .f{color:#e5eef5}.brand .a{color:#30ace2}.brand .c{color:#93a5b5;font-size:.85em}
    </style></head><body>
    <div class="card">
      <div class="brand"><span class="f">FAA</span><span class="a">Examinations</span><span class="c">.com</span></div>
      ${body}
      <p style="margin-top:24px"><a href="https://faaexaminations.com">Return to site →</a></p>
    </div></body></html>`;
}

// GET /api/unsubscribe?u=<id>&t=<token>
router.get('/', async (req, res) => {
  try {
    const userId = parseInt(req.query.u, 10);
    const token = String(req.query.t || '');
    if (!userId || !token || token !== unsubToken(userId)) {
      return res.status(400).send(page('Invalid link',
        `<h1>Invalid unsubscribe link</h1>
         <p>This link is not valid or has been tampered with. Please contact
         <a href="mailto:support@faaexaminations.com">support@faaexaminations.com</a> if you need help.</p>`));
    }
    await db.query('UPDATE users SET email_unsubscribed=TRUE WHERE id=$1', [userId]);
    return res.send(page('Unsubscribed',
      `<h1>You've been unsubscribed ✓</h1>
       <p>You won't receive any more marketing emails from FAAExaminations.com.</p>
       <p>Note: we'll still send you important account emails (password resets, billing notices).</p>
       <p>Changed your mind? Log in to your profile to resubscribe.</p>`));
  } catch (err) {
    console.error('[unsubscribe] error:', err);
    return res.status(500).send(page('Error', `<h1>Something went wrong</h1><p>Please try again later.</p>`));
  }
});

module.exports = router;
