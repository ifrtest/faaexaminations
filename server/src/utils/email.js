// server/src/utils/email.js
const { Resend } = require('resend');

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = () => process.env.EMAIL_FROM || 'support@faaexaminations.com';
const SITE = () => process.env.CLIENT_URL || 'https://faaexaminations.com';

async function sendEmail({ to, subject, html }) {
  try {
    await getResend().emails.send({ from: FROM(), to, subject, html });
  } catch (err) {
    console.error('[email] failed to send:', err.message);
  }
}

function welcomeEmail(name) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#0b3d91;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Welcome to FAAExaminations.com ✈</h1>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <p style="font-size:16px">Hi ${name},</p>
        <p>Your account is ready. Start practising for your FAA written exam today.</p>
        <a href="${SITE()}/exams" style="display:inline-block;background:#0b3d91;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Start Practising →</a>
        <p style="color:#6b7280;font-size:14px">Questions? Reply to this email or contact <a href="mailto:support@faaexaminations.com">support@faaexaminations.com</a></p>
      </div>
    </div>`;
}

function subscriptionEmail(name, plan) {
  const planNames = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle' };
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#0b3d91;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Subscription Confirmed ✅</h1>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <p style="font-size:16px">Hi ${name},</p>
        <p>You're now subscribed to <strong>${planNames[plan] || plan}</strong>. You have full access to all practice exams, timed simulations, and AI Instructor support.</p>
        <a href="${SITE()}/exams" style="display:inline-block;background:#0b3d91;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Start Your Exam →</a>
        <p style="color:#6b7280;font-size:14px">You can manage or cancel your subscription anytime at <a href="${SITE()}/cancel-policy">${SITE()}/cancel-policy</a></p>
      </div>
    </div>`;
}

function cancellationEmail(name) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#6b7280;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Subscription Cancelled</h1>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <p style="font-size:16px">Hi ${name},</p>
        <p>Your subscription has been cancelled. You'll keep access until the end of your current billing period — no further charges will be made.</p>
        <p>Your account and exam history are saved. You can resubscribe anytime.</p>
        <a href="${SITE()}/exams" style="display:inline-block;background:#0b3d91;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Resubscribe →</a>
        <p style="color:#6b7280;font-size:14px">Questions? Contact <a href="mailto:support@faaexaminations.com">support@faaexaminations.com</a></p>
      </div>
    </div>`;
}

function passwordResetEmail(name, resetUrl) {
  return `
    <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#1a1a2e">
      <div style="background:#0b3d91;padding:24px 32px;border-radius:12px 12px 0 0">
        <h1 style="color:#fff;margin:0;font-size:22px">Reset Your Password ✈</h1>
      </div>
      <div style="background:#f9fafb;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e5e7eb">
        <p style="font-size:16px">Hi ${name},</p>
        <p>We received a request to reset your password. Click the button below — this link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#0b3d91;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:700;margin:16px 0">Reset My Password →</a>
        <p style="color:#6b7280;font-size:14px">If you didn't request this, you can safely ignore this email. Your password won't change.</p>
        <p style="color:#6b7280;font-size:13px;word-break:break-all">Or copy this link: <a href="${resetUrl}" style="color:#0b3d91">${resetUrl}</a></p>
      </div>
    </div>`;
}

module.exports = { sendEmail, welcomeEmail, subscriptionEmail, cancellationEmail, passwordResetEmail };
