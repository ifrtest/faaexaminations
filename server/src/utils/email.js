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

async function sendEmail({ to, subject, html, userId = null, allowUnsubscribed = false, from = null }) {
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
    await getResend().emails.send({ from: from || FROM(), to, subject, html, text: htmlToText(html) });
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
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>
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
  </div></body></html>`;
}

function button(href, label) {
  return `<a href="${href}" style="display:inline-block;background:${ACCENT};color:#041018;padding:13px 28px;border-radius:8px;text-decoration:none;font-weight:700;letter-spacing:.3px;margin:20px 0;font-size:15px">${label}</a>`;
}

function welcomeEmail(name, userId) {
  return shell('Welcome aboard ✈', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">Your account is ready. Whether you're studying for your Private Pilot, Instrument Rating, Commercial Pilot, or Part 107 drone licence — you'll find real FAA practice questions, timed simulations, and an AI Instructor when you get stuck.</p>
    ${button(`${SITE()}/exams`, 'Start Practising →')}

    <div style="margin:32px 0 0;padding:24px;background:#0b1520;border:1px solid ${BORDER};border-radius:10px">
      <p style="margin:0 0 14px;font-weight:700;color:#fff;font-size:15px">📱 &nbsp;Save it to your phone — study anywhere</p>
      <p style="margin:0 0 16px;color:${MUTED};font-size:13px">Add FAAExaminations.com to your home screen and it opens like a native app — no app store required.</p>
      <table style="width:100%;border-collapse:collapse">
        <tr>
          <td style="padding:0 12px 0 0;vertical-align:top;width:33%">
            <div style="font-weight:700;color:${ACCENT};font-size:12px;margin-bottom:6px">iPhone / iPad</div>
            <ol style="margin:0;padding-left:16px;color:${MUTED};font-size:12px;line-height:2">
              <li>Open in <strong style="color:${TEXT}">Safari</strong></li>
              <li>Tap the <strong style="color:${TEXT}">Share</strong> button ⎙</li>
              <li>Tap <strong style="color:${TEXT}">"Add to Home Screen"</strong></li>
              <li>Tap <strong style="color:${TEXT}">Add</strong></li>
            </ol>
          </td>
          <td style="padding:0 12px;vertical-align:top;width:33%;border-left:1px solid ${BORDER}">
            <div style="font-weight:700;color:#16a34a;font-size:12px;margin-bottom:6px">Android</div>
            <ol style="margin:0;padding-left:16px;color:${MUTED};font-size:12px;line-height:2">
              <li>Open in <strong style="color:${TEXT}">Chrome</strong></li>
              <li>Tap the <strong style="color:${TEXT}">⋮</strong> menu</li>
              <li>Tap <strong style="color:${TEXT}">"Add to Home Screen"</strong></li>
              <li>Tap <strong style="color:${TEXT}">Add</strong></li>
            </ol>
          </td>
          <td style="padding:0 0 0 12px;vertical-align:top;width:33%;border-left:1px solid ${BORDER}">
            <div style="font-weight:700;color:#f59e0b;font-size:12px;margin-bottom:6px">Desktop (Chrome / Edge)</div>
            <ol style="margin:0;padding-left:16px;color:${MUTED};font-size:12px;line-height:2">
              <li>Open in <strong style="color:${TEXT}">Chrome or Edge</strong></li>
              <li>Click the <strong style="color:${TEXT}">install icon</strong> in the address bar</li>
              <li>Click <strong style="color:${TEXT}">"Install"</strong></li>
            </ol>
          </td>
        </tr>
      </table>
    </div>

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

function winBackEmail(name, userId) {
  return shell('Don\'t give up on your dream ✈', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 12px">It's Ash and Leila here. We noticed your subscription ended about a week ago and we just wanted to reach out personally.</p>
    <p style="margin:0 0 12px">Becoming a pilot is one of the most rewarding things a person can do — and we know life gets in the way sometimes. But your dream doesn't have an expiry date. We're always here when you're ready to pick it back up.</p>
    <p style="margin:0 0 20px">Your progress and exam history are saved exactly where you left them. Getting back on track takes two minutes.</p>
    <div style="text-align:center;margin:0 0 24px">
      <img src="${SITE()}/about-ash-leila.jpg" alt="Ash and Leila" style="width:100%;max-width:420px;border-radius:12px;display:inline-block" />
      <p style="color:${MUTED};font-size:12px;margin:8px 0 0">Ash &amp; Leila — FAAExaminations.com</p>
    </div>
    ${button(`${SITE()}/exams`, 'Pick Up Where You Left Off →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">If there's anything we could have done better, just reply to this email. We read every single one.</p>
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

function nurtureDay3(name, userId, cheatsheetUrl) {
  const csLink = cheatsheetUrl
    ? `<p style="margin:20px 0 0;padding:16px 20px;background:#0b1622;border:1px solid #1e2d3d;border-radius:10px;font-size:14px">
        📋 <strong style="color:#fff">Free resource:</strong> <a href="${cheatsheetUrl}" style="color:${ACCENT};text-decoration:none">Download the PAR Cheat Sheet</a> — every key number, rule, and formula for the Private Pilot exam, in one page.
       </p>`
    : '';
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
    ${csLink}
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
  return shell('Two weeks in — still on the fence?', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You signed up two weeks ago. I'm not going to pretend you forgot — you probably just haven't pulled the trigger yet.</p>
    <p style="margin:0 0 16px">That's fair. Here's the honest pitch:</p>
    <p style="margin:0 0 16px;padding:16px 20px;background:#0b1622;border-left:3px solid ${ACCENT};border-radius:0 8px 8px 0;font-size:15px;line-height:1.7">The FAA written exam isn't hard if you've seen the questions before. It's brutal if you haven't. Our entire platform is built around that one fact — practice the actual question types, understand why each answer is right, run timed mock exams until 80% feels easy. That's it. Most people are ready in 2–3 weeks.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">What you unlock:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Full question bank for your exam (1,469 for PAR, 265 for Part 107)</li>
      <li>Topic-by-topic breakdown — so you know exactly where you're weak</li>
      <li>Timed exam simulator with real pass/fail scoring</li>
      <li>AI Instructor that explains any question you get wrong</li>
    </ul>
    <p style="margin:0 0 20px">PAR, IRA, and CAX are $24.99/month. Part 107 is $37.99 one-time, lifetime access. Cancel the subscription anytime — no penalty, no questions asked.</p>
    ${button(`${SITE()}/exams`, 'Unlock Full Access →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Still not sure? Reply to this email and tell me which exam you're going for — I'll point you in the right direction.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

// ---------- Subscriber onboarding drip (Day 1 / 3 / 7 after payment) -----

function onboardDay1(name, plan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle', uag: 'Part 107 Remote Pilot' };
  const label = planNames[plan] || 'your exam';
  const examUrl = plan === 'uag' ? `${SITE()}/exams/part-107` : `${SITE()}/exams`;
  return shell(`Your first study session for ${label}`, `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You're in. Here's how to make the most of your first session so you don't waste time on the wrong things.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Start by topic, not by random mode.</p>
    <p style="margin:0 0 16px;color:${MUTED}">Pick one FAA subject area and work through all the questions in it. This builds real understanding instead of pattern-matching to memorized answers. Random mode is for later — once you know the material.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Read every explanation, even when you get it right.</p>
    <p style="margin:0 0 16px;color:${MUTED}">The FAA rewords questions constantly. Understanding the concept behind an answer means you'll recognize it even when it's phrased differently on the real exam.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Your dashboard tracks topic-by-topic readiness.</p>
    <p style="margin:0 0 20px;color:${MUTED}">After a few sessions you'll see exactly where you stand. That's where to focus — most people fail because of two or three weak areas, not overall unpreparedness.</p>
    ${button(examUrl, 'Start Studying →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Reply to this email anytime — we read every one.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

function onboardDay3(name, plan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle', uag: 'Part 107 Remote Pilot' };
  const label = planNames[plan] || 'your exam';
  const examUrl = plan === 'uag' ? `${SITE()}/exams/part-107` : `${SITE()}/exams`;
  return shell(`The #1 reason people fail the FAA written`, `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">Three days in — here's the one thing that separates people who pass from people who have to rebook.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">They stopped studying before they were actually ready.</p>
    <p style="margin:0 0 16px;color:${MUTED}">It sounds obvious, but a lot of students feel prepared after going through questions once. Then they sit the exam and find a whole category they thought they understood — but didn't. The timed mock exam in your dashboard is the best indicator of actual readiness. Don't book the real thing until you're consistently hitting 80%+ on mock exams.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Your AI Instructor is there for anything that doesn't click.</p>
    <p style="margin:0 0 20px;color:${MUTED}">Weather theory, airspace rules, weight and balance calculations — if an explanation doesn't make sense, ask the AI Instructor directly on that question. It's built specifically for ${label} material, not general aviation trivia.</p>
    ${button(examUrl, 'Check Your Progress →')}
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

function onboardDay7(name, plan, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle', uag: 'Part 107 Remote Pilot' };
  const label = planNames[plan] || 'your exam';
  const examUrl = plan === 'uag' ? `${SITE()}/exams/part-107` : `${SITE()}/exams`;
  return shell(`One week in — how are you tracking?`, `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You've had a week with ${label}. Here's a quick checkpoint.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Open your dashboard and look at your topic scores.</p>
    <p style="margin:0 0 16px;color:${MUTED}">Anything below 70% needs focused work before you're ready to run a full mock exam. Pick your two weakest categories this week and work through them question by question — explanations included. Don't move on until you're consistently above 75% in each one.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Aim to run your first full timed mock exam this week.</p>
    <p style="margin:0 0 20px;color:${MUTED}">60 questions, 150 minutes, real pass/fail scoring — just like the actual test. Your score tells you whether you're on track or whether you need another week of topic work. Most people need 2–3 mock exams before they're consistently passing.</p>
    ${button(examUrl, 'Open Your Dashboard →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions about your study plan? Reply to this email.</p>
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

function trialStartEmail(name, plan, trialEnd, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle' };
  const planLabel = planNames[plan] || plan;
  const endDate = trialEnd.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return shell('Your 3-day free trial has started ✅', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">You have <strong style="color:${ACCENT}">full access</strong> to <strong style="color:${ACCENT}">${planLabel}</strong> — all questions, the timed simulator, and AI Instructor — completely free until <strong style="color:#fff">${endDate}</strong>.</p>
    <p style="margin:0 0 16px;color:${MUTED}">After your trial, your card will be charged automatically. Cancel anytime before ${endDate} and you won't be charged a cent.</p>
    ${button(`${SITE()}/exams`, 'Start Practising →')}
    <p style="margin:24px 0 0;font-weight:700;color:#fff">What to study first</p>
    <ul style="margin:8px 0 20px;padding-left:20px;color:${MUTED};line-height:2">
      <li>Start with the topic modules to find your weak areas</li>
      <li>Use explanations on every question — that's where the learning happens</li>
      <li>Run a timed mock exam before your trial ends so you know where you stand</li>
    </ul>
    <p style="color:${MUTED};font-size:13px;margin:0">Cancel from your account dashboard in one click — no emails, no calls, no hassle. Questions? Reply here.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

function trialEndingEmail(name, plan, trialEnd, userId) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle' };
  const planLabel = planNames[plan] || plan;
  const endDate = trialEnd.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  return shell('Your free trial ends tomorrow', `
    <p style="margin:0 0 12px">Hi ${name},</p>
    <p style="margin:0 0 16px">Your free trial for <strong style="color:${ACCENT}">${planLabel}</strong> ends <strong style="color:#fff">tomorrow (${endDate})</strong>. After that, your subscription starts automatically.</p>
    <p style="margin:0 0 20px">If you want to keep access, you don't need to do anything — you're all set.</p>
    ${button(`${SITE()}/exams`, 'Keep Studying →')}
    <p style="margin:24px 0 8px;color:${MUTED};font-size:13px">Not ready to subscribe? Cancel before ${endDate} and you won't be charged. Cancel from your account dashboard in one click.</p>
    <p style="color:${MUTED};font-size:13px;margin:0">Questions? Reply to this email — we read every one.</p>
  `, userId, `${SITE()}/email-banner-plane.jpg`);
}

const CHEATSHEET_META = {
  par:    { name: 'Private Pilot (PAR)', url: '/par-cheat-sheet' },
  ira:    { name: 'Instrument Rating (IRA)', url: '/ira-cheat-sheet' },
  cax:    { name: 'Commercial Pilot (CAX)', url: '/cax-cheat-sheet' },
  uag:    { name: 'Part 107 Remote Pilot', url: '/part-107-cheat-sheet' },
};

function cheatsheetVerifyEmail(plan, verifyUrl) {
  const meta = CHEATSHEET_META[plan] || CHEATSHEET_META.par;
  return shell(
    `Confirm your email to get the ${meta.name} Cheat Sheet`,
    `
    <p style="margin:0 0 16px">You requested the <strong>${meta.name} Exam Cheat Sheet</strong> from FAAExaminations.com.</p>
    <p style="margin:0 0 24px;color:${MUTED}">Click the button below to confirm your email and get instant access to the full cheat sheet — key numbers, rules, formulas, and acronyms for the FAA written exam.</p>
    ${button(verifyUrl, 'Confirm & Get My Cheat Sheet →')}
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED}">This link expires in 24 hours. If you didn't request this, you can safely ignore this email.</p>
    `,
    null
  );
}

function cheatsheetDeliveryEmail(plan) {
  const meta = CHEATSHEET_META[plan] || CHEATSHEET_META.par;
  const fullUrl = `${SITE()}${meta.url}`;
  const pdfUrl  = `${SITE()}${meta.url}?print=1`;

  const parContent = plan === 'par' ? `
    <div style="margin:24px 0;padding:20px;background:#0b1622;border:1px solid #1e2d3d;border-radius:10px">
      <div style="font-size:12px;font-weight:700;letter-spacing:.1em;color:${MUTED};text-transform:uppercase;margin-bottom:14px">Key FAR Numbers</div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        ${[
          ['Bottle to throttle','8 hours (FAR 91.17)'],
          ['Max BAC','0.04% (FAR 91.17)'],
          ['Passenger currency','3 T&Ls in 90 days (FAR 61.57)'],
          ['Flight review','Every 24 calendar months (FAR 61.56)'],
          ['Annual inspection','Every 12 calendar months (FAR 91.409)'],
          ['VOR check (IFR)','Every 30 days (FAR 91.171)'],
          ['Transponder check','Every 24 calendar months (FAR 91.413)'],
          ['Medical – 3rd class, under 40','60 calendar months'],
          ['Medical – 3rd class, 40 and over','24 calendar months'],
        ].map(([rule, req], i) => `
          <tr style="border-bottom:1px solid #1e2d3d">
            <td style="padding:8px 10px 8px 0;color:#c8d8e8">${rule}</td>
            <td style="padding:8px 0;color:${ACCENT};text-align:right;white-space:nowrap">${req}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    <div style="margin:0 0 24px;padding:20px;background:#0b1622;border:1px solid #1e2d3d;border-radius:10px">
      <div style="font-size:12px;font-weight:700;letter-spacing:.1em;color:${MUTED};text-transform:uppercase;margin-bottom:14px">VFR Day Equipment — ATOMATOFLAMES</div>
      <div style="font-size:13px;color:#c8d8e8;line-height:1.8">
        <strong style="color:${ACCENT}">A</strong>irspeed · <strong style="color:${ACCENT}">T</strong>achometer · <strong style="color:${ACCENT}">O</strong>il pressure · <strong style="color:${ACCENT}">M</strong>anifold pressure · <strong style="color:${ACCENT}">A</strong>ltimeter · <strong style="color:${ACCENT}">T</strong>emp gauge · <strong style="color:${ACCENT}">O</strong>il temp · <strong style="color:${ACCENT}">F</strong>uel gauge · <strong style="color:${ACCENT}">L</strong>anding gear indicator · <strong style="color:${ACCENT}">A</strong>nti-collision lights · <strong style="color:${ACCENT}">M</strong>agnetic compass · <strong style="color:${ACCENT}">E</strong>LT · <strong style="color:${ACCENT}">S</strong>afety belts
      </div>
    </div>
  ` : `<p style="color:${MUTED};font-size:14px">The full ${meta.name} cheat sheet is ready — click below to view all sections.</p>`;

  return shell(
    `Your ${meta.name} Cheat Sheet is ready`,
    `
    <p style="margin:0 0 20px">Here's your <strong>${meta.name} Exam Cheat Sheet</strong>. Below is a preview of the key content — click the button to view the complete cheat sheet and save it as a PDF.</p>
    ${parContent}
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin:8px 0 24px">
      ${button(fullUrl, 'View Full Cheat Sheet →')}
    </div>
    <div style="padding:16px 20px;background:#0b1622;border:1px solid #1e2d3d;border-radius:10px;font-size:13px;color:${MUTED}">
      💡 <strong style="color:#c8d8e8">Save as PDF:</strong> Open the full cheat sheet, then use your browser's Print menu (Ctrl+P / Cmd+P) and choose "Save as PDF" — or click the Download PDF button at the top of the page.
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:${MUTED}">Want to go beyond the cheat sheet? FAAExaminations.com has the full ${meta.name} question bank, timed exam simulator, and AI Instructor — <a href="${SITE()}/register" style="color:${ACCENT}">start free →</a></p>
    `,
    null
  );
}

// ---------- Cheatsheet lead nurture (non-registered leads) ---------------

const CHEATSHEET_NURTURE_META = {
  par: { label: 'Private Pilot (PAR)',     qcount: '1,469', price: '$24.99/month',    registerUrl: '/register?plan=par', practiceUrl: '/par-practice-test',       examName: 'PAR written',       banner: 'email-banner-plane.jpg' },
  ira: { label: 'Instrument Rating (IRA)', qcount: '900+',  price: '$24.99/month',    registerUrl: '/register?plan=ira', practiceUrl: '/ira-practice-test',       examName: 'IRA written',       banner: 'email-banner-plane.jpg' },
  cax: { label: 'Commercial Pilot (CAX)',  qcount: '1,000+',price: '$24.99/month',    registerUrl: '/register?plan=cax', practiceUrl: '/cax-practice-test',       examName: 'CAX written',       banner: 'email-banner-plane.jpg' },
  uag: { label: 'Part 107 Remote Pilot',   qcount: '265',   price: '$37.99 one-time', registerUrl: '/register?plan=uag', practiceUrl: '/part-107-practice-test',  examName: 'Part 107 written',  banner: 'email-banner-drone.jpg' },
};

function cheatsheetNurtureDay2(email, plan) {
  const m = CHEATSHEET_NURTURE_META[plan] || CHEATSHEET_NURTURE_META.par;
  const site = SITE();
  const scenarioLine = plan === 'uag'
    ? `The FAA doesn't ask <em>"what's the maximum altitude for a Part 107 flight?"</em> — they put you in a controlled airspace scenario with a LAANC authorization question and four near-identical answer choices. Knowing the limit is step one. Applying it correctly under pressure is the actual exam.`
    : plan === 'ira'
    ? `The FAA doesn't ask <em>"what's the VOR check interval?"</em> — they embed it in a cross-country IFR planning scenario with four near-identical answers. Knowing the rule is step one. Applying it in context is the actual exam.`
    : plan === 'cax'
    ? `The FAA doesn't ask <em>"define complex aircraft"</em> — they put you in a scenario with a specific aircraft and ask which regulations apply. Knowing the definition is step one. Applying it correctly is the actual exam.`
    : `The FAA doesn't ask <em>"what's the bottle-to-throttle rule?"</em> — they describe a PIC, a 1 PM departure, two drinks at 9 AM, and ask which FAR applies. Knowing the number is step one. Applying it under pressure with four plausible choices is the actual exam.`;

  return shell(`The cheat sheet won't pass you. This will.`, `
    <p style="margin:0 0 16px">You downloaded the ${m.label} cheat sheet. Good start.</p>
    <p style="margin:0 0 16px">Here's what nobody says out loud:</p>
    <p style="margin:0 0 20px;padding:16px 20px;background:#0b1622;border-left:3px solid ${ACCENT};border-radius:0 8px 8px 0;font-size:15px;line-height:1.7;color:#e5eef5"><strong style="color:#fff">The cheat sheet tells you the rules. The exam tests whether you can apply them.</strong></p>
    <p style="margin:0 0 20px">${scenarioLine}</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">The math:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2.2">
      <li>The ${m.examName} draws <strong style="color:#fff">60 questions</strong> from a bank of <strong style="color:#fff">${m.qcount} possible questions</strong></li>
      <li>You need <strong style="color:#fff">70% to pass</strong> — that's 42 right answers</li>
      <li>Most people who fail miss by <strong style="color:#fff">3–5 questions in one weak topic area</strong> — not overall unpreparedness</li>
    </ul>
    <p style="margin:0 0 20px">The gap between the cheat sheet and a passing score is practice. Try the free test below — no account, no card. See exactly where you stand by topic.</p>
    ${button(`${site}${m.practiceUrl}`, 'Take the Free Practice Test →')}
    <p style="color:${MUTED};font-size:13px;margin:20px 0 4px">30 free questions · no signup required · instant topic-by-topic scoring</p>
    <p style="color:${MUTED};font-size:12px;margin:0">Reply "unsubscribe" to stop receiving these emails.</p>
  `, null, `${site}/${m.banner}`);
}

function cheatsheetNurtureDay4(email, plan) {
  const m = CHEATSHEET_NURTURE_META[plan] || CHEATSHEET_NURTURE_META.par;
  const site = SITE();
  const isUag = plan === 'uag';
  const offerLine = isUag
    ? `<p style="margin:0 0 20px">Part 107 full access is <strong style="color:${ACCENT}">$37.99 — one payment, no subscription, lifetime access.</strong> That's less than one hour with an aviation ground instructor.</p>`
    : `<p style="margin:0 0 20px">${m.label} full access is <strong style="color:${ACCENT}">$24.99/month — cancel anytime, no penalty.</strong> Most people are exam-ready in 2–3 weeks.</p>`;

  return shell(`How many of the question bank have you seen?`, `
    <p style="margin:0 0 16px">The FAA writes every knowledge test from a fixed question bank.</p>
    <p style="margin:0 0 16px">For the ${m.examName}: <strong style="color:#fff">${m.qcount} questions in the pool. 60 on your exam. 2.5 hours to answer them.</strong></p>
    <p style="margin:0 0 16px;color:${MUTED}">Every question you haven't seen before costs you 10–30 seconds of extra reading. Enough unfamiliar phrasing and you're rushing the last 15. That's how people with solid knowledge still fail — not because they didn't know the material, but because they ran out of runway.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">Exposure is the strategy.</p>
    <p style="margin:0 0 24px;color:${MUTED}">The more questions you've worked through before exam day, the fewer surprises on the real one. Our platform gives you the full bank — sorted by topic, with explanations — so nothing catches you cold.</p>
    <div style="margin:0 0 24px;padding:20px;background:#0b1622;border:1px solid #1e2d3d;border-radius:10px">
      <div style="font-size:12px;font-weight:700;letter-spacing:.08em;color:${MUTED};text-transform:uppercase;margin-bottom:14px">What's included</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${[
          [`Full ${m.qcount}-question bank`,                        '✅'],
          ['Questions sorted by FAA topic area',                    '✅'],
          ['Timed mock exam simulator (60 q · 2.5 hrs)',            '✅'],
          ['Detailed explanations on every answer',                 '✅'],
          ['AI Instructor for anything that doesn\'t click',        '✅'],
          ['Topic-by-topic readiness dashboard',                    '✅'],
        ].map(([feat, check]) => `
          <tr style="border-bottom:1px solid #1e2d3d">
            <td style="padding:9px 10px 9px 0;color:#c8d8e8">${feat}</td>
            <td style="padding:9px 0;text-align:right;color:#22c55e;font-weight:700">${check}</td>
          </tr>
        `).join('')}
      </table>
    </div>
    ${offerLine}
    <p style="margin:0 0 20px;padding:14px 18px;background:#0b1520;border:1px solid #1e2d3d;border-radius:8px;font-size:13px;color:${MUTED}">
      🛡️ <strong style="color:#fff">Pass Guarantee:</strong> Complete the full program and still fail your real FAA exam — we refund every dollar. <a href="${site}/cancel-policy" style="color:${ACCENT};text-decoration:none">See terms →</a>
    </p>
    ${button(`${site}${m.registerUrl}`, `Get Started — ${isUag ? '$37.99 Lifetime' : '$24.99/month'} →`)}
    <p style="color:${MUTED};font-size:12px;margin:20px 0 0">Reply "unsubscribe" to stop receiving these emails.</p>
  `, null, `${site}/${m.banner}`);
}

function cheatsheetNurtureDay7(email, plan) {
  const m = CHEATSHEET_NURTURE_META[plan] || CHEATSHEET_NURTURE_META.par;
  const site = SITE();
  const isUag = plan === 'uag';
  const priceDetail = isUag ? '$37.99 one-time · lifetime access · no subscription.' : `$24.99/month · cancel the month you pass.`;

  return shell(`Complete the program. Fail the exam. Full refund.`, `
    <p style="margin:0 0 16px">One week since you grabbed the cheat sheet. Let me make this simple.</p>
    <p style="margin:0 0 24px;padding:20px 24px;background:#0b1622;border:2px solid ${ACCENT};border-radius:10px;font-size:16px;line-height:1.7;color:#fff">
      Complete every topic module, finish 10 full mock exams scoring 70%+, and if you still fail your real FAA exam — we refund every dollar. No questions asked.
    </p>
    <p style="margin:0 0 16px;color:${MUTED}">We can make that guarantee because the method works when you use it: practice by topic, read the explanations, run mock exams until you're consistently passing. Anyone who puts in the work passes. That's the whole bet.</p>
    <p style="margin:0 0 8px;font-weight:700;color:#fff">What you get:</p>
    <ul style="margin:0 0 20px;padding-left:20px;color:${MUTED};line-height:2.2">
      <li><strong style="color:#fff">${m.qcount} questions</strong> — the full ${m.examName} bank</li>
      <li><strong style="color:#fff">Topic scores</strong> — pinpoint exactly where you're weak</li>
      <li><strong style="color:#fff">Timed mock exams</strong> — real conditions before the real thing</li>
      <li><strong style="color:#fff">AI Instructor</strong> — explains every wrong answer in plain English</li>
    </ul>
    <p style="margin:0 0 8px;color:${MUTED};font-size:14px">${priceDetail}</p>
    <p style="margin:0 0 20px;font-size:13px;color:${MUTED}"><a href="${site}/cancel-policy" style="color:${ACCENT};text-decoration:none">See pass guarantee terms →</a></p>
    ${button(`${site}${m.registerUrl}`, 'Start — Pass Guarantee Included →')}
    <p style="color:${MUTED};font-size:12px;margin:20px 0 0">Reply "unsubscribe" to stop receiving these emails.</p>
  `, null, `${site}/${m.banner}`);
}

function cheatsheetNurtureDay10(email, plan) {
  const m = CHEATSHEET_NURTURE_META[plan] || CHEATSHEET_NURTURE_META.par;
  const site = SITE();
  const isUag = plan === 'uag';
  const closeLine = isUag
    ? `<strong style="color:#fff">265 questions. Timed simulator. AI Instructor. $37.99 once — lifetime access.</strong> Complete the program and still fail your real exam — full refund.`
    : `<strong style="color:#fff">${m.qcount} questions. Timed simulator. AI Instructor. $24.99/month — cancel the month you pass.</strong> Complete the program and still fail your real exam — full refund.`;

  return shell(`Last one. Then I'll leave you alone.`, `
    <p style="margin:0 0 16px">Ten days ago you grabbed the ${m.label} cheat sheet.</p>
    <p style="margin:0 0 16px;color:${MUTED}">Either you've already passed — in which case, congratulations, go fly — or you're still working toward it.</p>
    <p style="margin:0 0 20px;color:${MUTED}">This is the last email either way.</p>
    <p style="margin:0 0 24px;padding:16px 20px;background:#0b1622;border-left:3px solid #22c55e;border-radius:0 8px 8px 0;font-size:15px;line-height:1.7">${closeLine}</p>
    <p style="margin:0 0 16px;color:${MUTED}">The FAA written exam date is set by you. Most people are ready in 2–3 weeks of focused study. The only thing between you and a passing score is starting.</p>
    ${button(`${site}${m.registerUrl}`, 'Start Today →')}
    <p style="color:${MUTED};font-size:13px;margin:24px 0 0">Questions? Reply to this email — we read every one.</p>
    <p style="color:${MUTED};font-size:12px;margin:12px 0 0">This is the last nurture email from us. Reply "unsubscribe" if you'd like to opt out of any future emails.</p>
  `, null, `${site}/${m.banner}`);
}

// Creates a pre-verified cheatsheet token for a known email (used in nurture emails).
// Returns the full verify URL so the recipient skips the "enter email" form.
async function cheatsheetPreverifiedUrl(email, plan) {
  const SITE_URL = process.env.CLIENT_URL || 'https://faaexaminations.com';
  const token = crypto.randomBytes(24).toString('hex');
  const validPlan = ['par','ira','cax','uag'].includes(plan) ? plan : 'par';
  try {
    await db.query(
      `INSERT INTO cheatsheet_leads (email, plan, token, verified, cheatsheet_sent, created_at)
       VALUES ($1, $2, $3, true, false, NOW())
       ON CONFLICT (email, plan) DO UPDATE
         SET token = EXCLUDED.token,
             verified = true,
             created_at = NOW()`,
      [email, validPlan, token]
    );
    return `${SITE_URL}/cheatsheet/verify/${token}`;
  } catch {
    // Fallback to plain cheat sheet URL if DB fails
    const urls = { par: '/par-cheat-sheet', ira: '/ira-cheat-sheet', cax: '/cax-cheat-sheet', uag: '/part-107-cheat-sheet' };
    return `${SITE_URL}${urls[validPlan]}`;
  }
}

module.exports = {
  sendEmail,
  welcomeEmail,
  subscriptionEmail,
  cancellationEmail,
  passwordResetEmail,
  trialStartEmail,
  trialEndingEmail,
  nurtureDay3,
  nurtureDay7,
  nurtureDay14,
  bundleUpsellEmail,
  onboardDay1,
  onboardDay3,
  onboardDay7,
  winBackEmail,
  cheatsheetVerifyEmail,
  cheatsheetDeliveryEmail,
  cheatsheetPreverifiedUrl,
  cheatsheetNurtureDay2,
  cheatsheetNurtureDay4,
  cheatsheetNurtureDay7,
  cheatsheetNurtureDay10,
  unsubToken,
  unsubUrl,
};
