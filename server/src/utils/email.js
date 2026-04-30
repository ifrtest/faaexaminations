// server/src/utils/email.js
const crypto = require('crypto');
const { Resend } = require('resend');
const db = require('../config/db');

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => {
  const addr = process.env.EMAIL_FROM || 'support@faaexaminations.com';
  return `FAA Examinations <${addr}>`;
};
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
function htmlToText(html) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

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
    await getResend().emails.send({ from: FROM(), to, subject, html, text: htmlToText(html) });
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
    <p style="margin:0 0 16px">Your account is ready. Whether you're studying for your Private Pilot, Instrument Rating, Commercial Pilot, or Part 107 drone licence — you'll find real FAA practice questions, timed simulations, and an AI Instructor when you get stuck.</p>
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

// ---------- Nurture sequence -----------------------------------------

function nurtureDay3(name, userId) {
  return shell('What the FAA actually tests you on ✈', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You created your FAAExaminations.com account a few days ago. Here's something useful while you're getting started.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">The FAA written exam is 60 questions. You need a 70% to pass.</p>
    <p style="margin:0 0 16px;color:${MUTED}">But the questions aren't random — the FAA tests specific topics in specific proportions. Private Pilot (PAR) covers 11 subject areas, from regulations to weather to navigation. The pilots who fail aren't underprepared overall — they have one or two weak areas that drag them below 70%.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">That's what our platform is built around.</p>
    <p style="margin:0 0 20px">Every question is organized by topic. Your dashboard tracks your score per category so you can see exactly where you're strong and where you need work — before you sit the real exam.</p>
    ${button(`${SITE()}/exams`, 'See Your Practice Questions →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Your free account includes 10 Private Pilot questions to get started. Full access from $24.99/month.</p>
  `, userId);
}

function nurtureDay7(name, userId) {
  return shell('How pilots pass the FAA written first try', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">The pilots who pass the FAA written first try have one thing in common: they didn't just read the handbook. They practiced under exam conditions.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Here's what actually works:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Work through questions by topic first — not in random order</li>
      <li>Use explanations to understand the <em style="color:${TEXT}">why</em>, not just memorize the answer</li>
      <li>Run timed practice exams once your topic scores are above 80%</li>
      <li>Focus extra time on your weakest two or three categories</li>
    </ul>
    <p style="margin:0 0 20px">FAAExaminations.com is built around that exact workflow — 3,000+ questions organized by topic, full explanations, a timed exam simulator, and an AI Instructor for anything that doesn't click.</p>
    ${button(`${SITE()}/exams`, 'Start Practicing →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">PAR · IRA · CAX from $24.99/month · Part 107 $37.99 one-time · Lifetime access.</p>
  `, userId);
}

function nurtureDay14(name, userId) {
  return shell('Still studying for your FAA written?', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You signed up two weeks ago. If you're still in study mode — or about to get serious — this is a good time to unlock the full question bank.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">What you get with a full subscription:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Complete question bank for your exam (PAR: 1,469 questions · IRA: 821 · CAX: 536)</li>
      <li>All study modules organized by FAA topic</li>
      <li>Timed exam simulator — 60 questions, real pass/fail scoring</li>
      <li>AI Instructor for any question you want explained</li>
      <li>Progress dashboard showing readiness by category</li>
    </ul>
    <p style="margin:0 0 20px">$24.99/month. Cancel anytime from your account — no questions asked.</p>
    ${button(`${SITE()}/exams`, 'Unlock Full Access →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions? Reply to this email — we read every one.</p>
  `, userId);
}

function bundleUpsellEmail(name, currentPlan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', uag: 'Part 107' };
  const current = planNames[currentPlan] || currentPlan;
  return shell('Unlock all three pilot exams for $39.99', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You're currently subscribed to <strong style="color:${ACCENT}">${current}</strong>. If you're planning to go further with your certificates, the Pilot Bundle gives you PAR + IRA + CAX for less than the cost of two individual plans.</p>
    <table style="width:100%;border-collapse:collapse;margin:0 0 20px">
      <tr style="border-bottom:1px solid ${BORDER}">
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">Individual plans (PAR + IRA + CAX)</td>
        <td style="padding:10px 0;text-align:right;text-decoration:line-through;color:${MUTED};font-size:.88rem">$74.97/month</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-weight:700;color:#fff">Pilot Certificate Bundle</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:${ACCENT};font-size:1.1rem">$39.99/month</td>
      </tr>
    </table>
    <p style="margin:0 0 20px;color:${MUTED}">That's 2,826 PAR + IRA + CAX questions, all study modules, the exam simulator, and AI Instructor — everything you need for all three certificates.</p>
    ${button(`${SITE()}/exams`, 'Upgrade to Bundle →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Your current subscription is replaced, not added. Cancel anytime.</p>
  `, userId);
}

module.exports = {
  sendEmail,
  welcomeEmail,
  subscriptionEmail,
  cancellationEmail,
  passwordResetEmail,
  nurtureDay3,
  nurtureDay7,
  nurtureDay14,
  bundleUpsellEmail,
  unsubToken,
  unsubUrl,
};
