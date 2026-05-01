// server/src/utils/nurture.js
// Runs daily via node-cron. Sends nurture + onboarding emails.
// Tracks sent emails in nurture_emails table so nothing sends twice.

const db = require('../config/db');
const { sendEmail, nurtureDay3, nurtureDay7, nurtureDay14, bundleUpsellEmail, onboardDay1, onboardDay3, onboardDay7 } = require('./email');

// Steps 1–4: free-user nurture + bundle upsell (keyed on created_at)
// Steps 5–7: subscriber onboarding drip (keyed on subscription_activated_at)
const STEPS = [
  { step: 1, minDays: 3,  maxDays: 5,  build: nurtureDay3,  subject: 'What the FAA actually tests you on ✈',        filter: 'free' },
  { step: 2, minDays: 7,  maxDays: 10, build: nurtureDay7,  subject: 'How pilots pass the FAA written first try',    filter: 'free' },
  { step: 3, minDays: 14, maxDays: 21, build: nurtureDay14, subject: 'Still studying for your FAA written?',         filter: 'free' },
  { step: 4, minDays: 30, maxDays: 45, build: null,         subject: 'Unlock all three pilot exams for $39.99',      filter: 'single' },
  { step: 5, minDays: 1,  maxDays: 2,  build: onboardDay1,  subject: 'Your first study session for the FAA written', filter: 'paid', needsPlan: true },
  { step: 6, minDays: 3,  maxDays: 5,  build: onboardDay3,  subject: 'The #1 reason people fail the FAA written',    filter: 'paid', needsPlan: true },
  { step: 7, minDays: 7,  maxDays: 10, build: onboardDay7,  subject: 'One week in — how are you tracking?',          filter: 'paid', needsPlan: true },
];

async function ensureTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS nurture_emails (
      id         SERIAL PRIMARY KEY,
      user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      step       INTEGER NOT NULL,
      sent_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (user_id, step)
    )
  `);
  // Add subscription_activated_at if not already present
  await db.query(`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_activated_at TIMESTAMPTZ
  `);
}

async function runNurture() {
  await ensureTable();

  for (const { step, minDays, maxDays, build, subject, filter, needsPlan } of STEPS) {
    let users;

    if (filter === 'paid') {
      // Onboarding drip — keyed on subscription_activated_at
      const { rows } = await db.query(`
        SELECT u.id, u.email, u.full_name, u.subscription
        FROM users u
        WHERE u.subscription_status IN ('active', 'trialing', 'cancelling')
          AND u.subscription IS NOT NULL
          AND u.subscription != 'free'
          AND u.is_active = TRUE
          AND u.subscription_activated_at IS NOT NULL
          AND u.subscription_activated_at <= NOW() - INTERVAL '${minDays} days'
          AND u.subscription_activated_at >= NOW() - INTERVAL '${maxDays} days'
          AND NOT EXISTS (
            SELECT 1 FROM nurture_emails n
            WHERE n.user_id = u.id AND n.step = ${step}
          )
      `);
      users = rows;
    } else {
      const subscriptionClause = filter === 'single'
        ? `u.subscription IN ('par','ira','cax','uag')`
        : `u.subscription = 'free'`;

      const { rows } = await db.query(`
        SELECT u.id, u.email, u.full_name, u.subscription
        FROM users u
        WHERE ${subscriptionClause}
          AND u.is_active = TRUE
          AND u.created_at <= NOW() - INTERVAL '${minDays} days'
          AND u.created_at >= NOW() - INTERVAL '${maxDays} days'
          AND NOT EXISTS (
            SELECT 1 FROM nurture_emails n
            WHERE n.user_id = u.id AND n.step = ${step}
          )
      `);
      users = rows;
    }

    for (const user of users) {
      const name = user.full_name || user.email.split('@')[0];
      let html;
      if (step === 4) {
        html = bundleUpsellEmail(name, user.subscription, user.id);
      } else if (needsPlan) {
        html = build(name, user.subscription, user.id);
      } else {
        html = build(name, user.id);
      }
      await sendEmail({ to: user.email, subject, html, userId: user.id });
      await db.query(
        'INSERT INTO nurture_emails (user_id, step) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        [user.id, step]
      );
      console.log(`[nurture] step ${step} sent to user ${user.id}`);
    }

    console.log(`[nurture] step ${step}: ${users.length} email(s) sent`);
  }
}

module.exports = { runNurture };
