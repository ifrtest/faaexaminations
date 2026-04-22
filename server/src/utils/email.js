// server/src/utils/email.js
const crypto = require('crypto');
const { Resend } = require('resend');
const db = require('../config/db');

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.EMAIL_FROM || 'support@faaexaminations.com';
const SITE = () => process.env.CLIENT_URL || 'https://faaexaminations.com';

function unsubToken(userId) {
  const secret = process.env.JWT_SECRET || process.env.UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return crypto.createHmac('sha256', secret).update(String(userId)).digest('hex').slice(0, 32);
}

function unsubUrl(userId) {
  return `${SITE()}/api/unsubscribe?u=${userId}&t=${unsubToken(userId)}`;
}

/**
 * Send email. If userId is provided and the user is unsubscribed,
 * the email is skipped — UNLESS `allowUnsubscribed` is true
 * (use for password resets, etc. that are security-critical).
 */
async function sendEmail({ to, subject, html, userId = null, allowUnsubscribed = false }) {
  try {
    if (userId && !allowUnsubscribed) {
      const { rows } = await db.query(
        'SELECT email_unsubscribed FROM users WHERE id=$1',
        [userId]
      );
      if (rows[0]?.email_unsubscribed) {
        console.log(`[email] skipped for user ${userId} (unsubscribed)`);
        return;
      }
    }
    await getResend().emails.send({ from: FROM(), to, subject, html });
  } catch (err) {
    console.error('[email] failed to send:', err.message);
  }
}

// ---------- Brand tokens (dark aviation theme) ----------
const FONT = `'Helvetica Neue', Helvetica, Arial, sans-serif`;
const BG = '#080e14';
const PANEL = '#0f1822';
const BORDER = '#1e2a38';
const ACCENT = '#30ace2';
const TEXT = '#e5eef5';
const MUTED = '#93a5b5';

function shell(headline, bodyHtml, userId) {
  const unsubLink = userId
    ? `<a href="${unsubUrl(userId)}" style="color:${MUTED};text-decoration:underline">Unsubscribe</a>`
    : '';
  return `
  <div style="background:${BG};padding:32px 16px;font-family:${FONT};color:${TEXT}">
    <div style="max-width:560px;margin:0 auto;background:${PANEL};border:1px solid ${BORDER};border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg, #0b1622 0%, #132231 100%);padding:28px 32px;border-bottom:1px solid ${BORDER}">
        <div style="font-size:22px;font-weight:800;letter-spacing:.2px;margin-bottom:10px">
          <a href="${SITE()}" style="text-decoration:none;color:${TEXT}">
            <span style="color:${TEXT};text-decoration:none">FAA</span><span style="color:${ACCENT};text-decoration:none">Examinations</span><span style="color:${MUTED};font-size:0.85em;text-decoration:none">.com</span>
          </a>
        </div>
        <h1 style="color:${TEXT};margin:0;font-size:22px;font-weight:700;letter-spacing:-.3px">${headline}</h1>
      </div>
      <div style="padding:32px;color:${TEXT};font-size:15px;line-height:1.6">
        ${bodyHtml}
      </div>
      <div style="background:#0a121b;padding:18px 32px;border-top:1px solid ${BORDER};text-align:center">
        <div style="color:${MUTED};font-size:12px;margin-bottom:6px">FAAExaminations.com · FAA practice exams for student pilots</div>
        ${unsubLink ? `<div style="color:${MUTED};font-size:12px">${unsubLink} from marketing emails · <a href="mailto:support@faaexaminations.com" style="color:${MUTED};text-decoration:underline">Contact support</a></div>` : ''}
      </div>
    </div>
  </div>`;
}

function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:${ACCENT};color:#041018;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;letter-spacing:.3px;margin:20px 0;font-size:15px">${label}</a>`;
}

function welcomeEmail(name, userId) {
  return shell('Welcome aboard ✈', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">Your account is ready. Start practising for your FAA written exam with real question banks, timed simulations, and an AI Instructor when you get stuck.</p>
    ${button(`${SITE()}/exams`, 'Start Practising →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions? Reply to this email or contact <a href="mailto:support@faaexaminations.com" style="color:${ACCENT};text-decoration:none">support@faaexaminations.com</a></p>
  `, userId);
}

function subscriptionEmail(name, plan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle' };
  return shell('Subscription Confirmed ✅', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You're now subscribed to <strong style="color:${ACCENT}">${planNames[plan] || plan}</strong>. Full access is unlocked: all practice exams, timed simulations, and AI Instructor support.</p>
    ${button(`${SITE()}/exams`, 'Start Your Exam →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Manage or cancel your subscription anytime at <a href="${SITE()}/cancel-policy" style="color:${ACCENT};text-decoration:none">${SITE()}/cancel-policy</a></p>
  `, userId);
}

function cancellationEmail(name, userId) {
  return shell('Subscription Cancelled', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 12px">Your subscription has been cancelled. You'll keep access until the end of your current billing period — no further charges will be made.</p>
    <p style="margin:0 0 16px">Your account and exam history are saved. You can resubscribe anytime.</p>
    ${button(`${SITE()}/exams`, 'Resubscribe →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions? Contact <a href="mailto:support@faaexaminations.com" style="color:${ACCENT};text-decoration:none">support@faaexaminations.com</a></p>
  `, userId);
}

function passwordResetEmail(name, resetUrl, userId) {
  return shell('Reset Your Password', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">We received a request to reset your password. Click the button below — this link expires in <strong style="color:${ACCENT}">1 hour</strong>.</p>
    ${button(resetUrl, 'Reset My Password →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 12px">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
    <p style="color:${MUTED};font-size:12px;word-break:break-all;margin:0">Or copy this link: <a href="${resetUrl}" style="color:${ACCENT};text-decoration:none">${resetUrl}</a></p>
  `, userId);
}

module.exports = {
  sendEmail,
  welcomeEmail,
  subscriptionEmail,
  cancellationEmail,
  passwordResetEmail,
  unsubToken,
  unsubUrl,
};
