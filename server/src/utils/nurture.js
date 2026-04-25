// server/src/utils/nurture.js
// Runs daily via node-cron. Sends nurture emails to free users who haven't subscribed.
// Tracks sent emails in nurture_emails table so nothing sends twice.

const db = require('../config/db');
const { sendEmail, nurtureDay3, nurtureDay7, nurtureDay14, bundleUpsellEmail } = require('./email');

const STEPS = [
  { step: 1, minDays: 3,  maxDays: 5,  build: nurtureDay3,  subject: 'What the FAA actually tests you on ✈',     filter: 'free' },
  { step: 2, minDays: 7,  maxDays: 10, build: nurtureDay7,  subject: 'How pilots pass the FAA written first try', filter: 'free' },
  { step: 3, minDays: 14, maxDays: 21, build: nurtureDay14, subject: 'Still studying for your FAA written?',      filter: 'free' },
  // Step 4 (bundle upsell) is built but held — requires upgrade flow to be live first
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
}

async function runNurture() {
  await ensureTable();

  for (const { step, minDays, maxDays, build, subject, filter } of STEPS) {
    // Step 4 targets single-plan paid subscribers (not bundle, not free)
    const subscriptionClause = filter === 'single'
      ? `u.subscription IN ('par','ira','cax','uag')`
      : `u.subscription = 'free'`;

    const { rows: users } = await db.query(`
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

    for (const user of users) {
      const name = user.full_name || user.email.split('@')[0];
      const html = step === 4
        ? bundleUpsellEmail(name, user.subscription, user.id)
        : build(name, user.id);
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
