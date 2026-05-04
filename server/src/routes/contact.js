const express      = require('express');
const router       = express.Router();
const { Resend }   = require('resend');

router.post('/', async (req, res) => {
  const { email, message } = req.body;
  if (!email || !email.includes('@') || !message || message.trim().length < 3) {
    return res.status(400).json({ error: 'Email and message required.' });
  }
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:     'FAAExaminations.com <noreply@faaexaminations.com>',
      to:       'support@faaexaminations.com',
      reply_to: email.trim(),
      subject:  `Checkout help request from ${email.trim()}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#080e14;color:#e5eef5;border-radius:8px;">
          <h2 style="color:#30ace2;margin:0 0 16px;">Checkout Help Request</h2>
          <p style="margin:0 0 8px;color:rgba(200,210,230,0.6);font-size:13px;">From: <strong style="color:#e5eef5;">${email.trim()}</strong></p>
          <div style="background:#0a121b;border:1px solid #1e2a38;border-radius:6px;padding:16px;margin-top:16px;font-size:15px;line-height:1.7;color:#e5eef5;">
            ${message.trim().replace(/\n/g, '<br>')}
          </div>
          <p style="margin:20px 0 0;color:rgba(200,210,230,0.35);font-size:12px;">Hit reply to respond directly to the customer.</p>
        </div>`,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact]', err.message);
    res.status(500).json({ error: 'Could not send message.' });
  }
});

module.exports = router;
