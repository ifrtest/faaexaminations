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

function shell(headline, bodyHtml, userId, bannerUrl = null) {
  const unsubLink = userId
    ? `<a href="${unsubUrl(userId)}" style="color:${MUTED};text-decoration:underline">Unsubscribe</a>`
    : '';
  const banner = bannerUrl
    ? `<img src="${bannerUrl}" alt="" width="560" style="display:block;width:100%;max-height:200px;object-fit:cover;object-position:center" />`
    : '';
  return `
  <div style="background:${BG};padding:32px 16px;font-family:${FONT};color:${TEXT}">
    <div style="max-width:560px;margin:0 auto;background:${PANEL};border:1px solid ${BORDER};border-radius:14px;overflow:hidden">
      <div style="background:linear-gradient(135deg, #0b1622 0%, #132231 100%);padding:24px 32px;border-bottom:1px solid ${BORDER};display:flex;align-items:center;gap:16px">
        <a href="${SITE()}" style="text-decoration:none;flex-shrink:0">
          <img src="${SITE()}/faa-logo-email.png" alt="FAAExaminations.com" width="52" height="52" style="display:block;border-radius:8px" />
        </a>
        <div>
          <div style="font-size:20px;font-weight:800;letter-spacing:.2px;margin-bottom:6px">
            <a href="${SITE()}" style="text-decoration:none;color:${TEXT}">
              <span style="color:${TEXT}">FAA</span><span style="color:${ACCENT}">Examinations</span><span style="color:${MUTED};font-size:0.8em">.com</span>
            </a>
          </div>
          <h1 style="color:${TEXT};margin:0;font-size:19px;font-weight:700;letter-spacing:-.2px">${headline}</h1>
        </div>
      </div>
      ${banner}
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
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

function subscriptionEmail(name, plan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle', uag: 'Part 107 Remote Pilot' };
  const isOneTime = plan === 'uag';
  const headline = isOneTime ? 'Purchase Confirmed ✅' : 'Subscription Confirmed ✅';
  const footer = isOneTime
    ? `This is a one-time payment — your access never expires. Questions? Reply to this email.`
    : `Manage or cancel your subscription anytime at <a href="${SITE()}/cancel-policy" style="color:${ACCENT};text-decoration:none">${SITE()}/cancel-policy</a>`;
  const intro = isOneTime
    ? `Your Part 107 package is unlocked. This is a <strong style="color:${ACCENT}">one-time payment</strong> — you have lifetime access to all 265 practice questions, timed simulator, and AI Instructor support. No subscription, no renewals.`
    : `You're now subscribed to <strong style="color:${ACCENT}">${planNames[plan] || plan}</strong>. Full access is unlocked: all practice exams, timed simulations, and AI Instructor support.`;
  const banner = isOneTime ? `${SITE()}/email-banner-drone.jpg` : `${SITE()}/email-banner-plane.jpg`;
  return shell(headline, `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">${intro}</p>
    ${button(`${SITE()}/exams`, 'Start Your Exam →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">${footer}</p>
  `, userId, banner);
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
    <p style="margin:0 0 16px">You created your FAAExaminations.com account a few days ago. Here's a quick breakdown of what you're actually preparing for — because every FAA exam is a bit different.</p>

    <p style="margin:0 0 6px;font-weight:700;color:#fff">✈ &nbsp;Student pilot (Private, Instrument, or Commercial)?</p>
    <p style="margin:0 0 16px;color:${MUTED}">The PAR, IRA, and CAX knowledge tests are each 60 questions drawn from a large question bank. You need 70% to pass. The FAA tests specific topics in fixed proportions — pilots who fail usually have one or two weak areas, not an overall knowledge problem. Our platform shows you exactly where you stand by topic so you can fix the gaps before exam day.</p>

    <p style="margin:0 0 6px;font-weight:700;color:#fff">🚁 &nbsp;Drone pilot (Part 107)?</p>
    <p style="margin:0 0 16px;color:${MUTED}">The Part 107 Remote Pilot knowledge test is also 60 questions — 70% to pass. It covers airspace, weather, regulations, and safety. No aviation background required. Most people pass in 2–3 weeks of focused study. Our 265-question bank covers the entire FAA question pool.</p>

    <p style="margin:0 0 8px;font-weight:700;color:#fff">Either way, the approach is the same.</p>
    <p style="margin:0 0 20px">Practice by topic, track your scores, and run timed mock exams once you're scoring above 80%. Your dashboard shows readiness by category — so you're never guessing where to focus.</p>
    ${button(`${SITE()}/exams`, 'Start Practising →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Free account includes 10 Private Pilot sample questions &amp; the full TRUST recreational drone test.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

function nurtureDay7(name, userId) {
  return shell('How to pass your FAA exam first try', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">Whether you're going for your Private Pilot certificate or your Part 107 drone licence — the people who pass first try have one thing in common: they didn't just read the handbook. They practiced under exam conditions.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Here's what actually works:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Work through questions by topic first — not in random order</li>
      <li>Use explanations to understand the <em style="color:${TEXT}">why</em>, not just memorize the answer</li>
      <li>Run timed practice exams once your topic scores are above 80%</li>
      <li>Focus extra time on your weakest two or three categories</li>
    </ul>
    <p style="margin:0 0 20px">FAAExaminations.com is built around that exact workflow — questions organized by topic, full explanations on every answer, a timed exam simulator, and an AI Instructor for anything that doesn't click.</p>
    ${button(`${SITE()}/exams`, 'Start Practising →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">PAR · IRA · CAX from $24.99/month &nbsp;·&nbsp; Part 107 $37.99 one-time lifetime access.</p>
  `, userId, `${SITE()}/email-banner-drone.jpg`);
}

function nurtureDay14(name, userId) {
  return shell('Ready to unlock full access?', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You signed up two weeks ago. If you're getting serious about your exam — here's exactly what you get with full access.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Every package includes:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Complete question bank for your exam</li>
      <li>All study modules organized by FAA topic</li>
      <li>Timed exam simulator — real pass/fail scoring</li>
      <li>AI Instructor for any question you want explained</li>
      <li>Progress dashboard showing readiness by category</li>
    </ul>
    <table style="width:100%;border-collapse:collapse;margin:0 0 24px">
      <tr style="border-bottom:1px solid ${BORDER}">
        <td style="padding:10px 0;font-weight:700;color:#fff">Private Pilot (PAR)</td>
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">1,469 questions</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:${ACCENT}">$24.99/mo</td>
      </tr>
      <tr style="border-bottom:1px solid ${BORDER}">
        <td style="padding:10px 0;font-weight:700;color:#fff">Instrument Rating (IRA)</td>
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">821 questions</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:${ACCENT}">$24.99/mo</td>
      </tr>
      <tr style="border-bottom:1px solid ${BORDER}">
        <td style="padding:10px 0;font-weight:700;color:#fff">Commercial Pilot (CAX)</td>
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">536 questions</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:${ACCENT}">$24.99/mo</td>
      </tr>
      <tr style="border-bottom:1px solid ${BORDER}">
        <td style="padding:10px 0;font-weight:700;color:#fff">PAR + IRA + CAX Bundle</td>
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">2,826 questions</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:${ACCENT}">$39.99/mo</td>
      </tr>
      <tr>
        <td style="padding:10px 0;font-weight:700;color:#fff">Part 107 Drone Licence</td>
        <td style="padding:10px 0;color:${MUTED};font-size:.88rem">265 questions</td>
        <td style="padding:10px 0;text-align:right;font-weight:700;color:#f5c842">$37.99 one-time</td>
      </tr>
    </table>
    ${button(`${SITE()}/exams`, 'Unlock Full Access →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions? Reply to this email — we read every one.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
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
