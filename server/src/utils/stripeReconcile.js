// server/src/utils/stripeReconcile.js
// Runs daily. Checks Stripe for any paid customers whose DB record wasn't
// activated by the webhook (network blip, bug, retry window expiry, etc.)
// and fixes them automatically.

const Stripe = require('stripe');
const db     = require('../config/db');
const { sendEmail, subscriptionEmail } = require('./email');

const UAG_PRICE = process.env.STRIPE_PRICE_UAG;

async function reconcileUAG(stripe) {
  // Find all users who have a stripe_customer_id but uag_access = false
  // and subscription != any paid plan — i.e. potentially missed webhook
  const { rows: candidates } = await db.query(`
    SELECT id, email, full_name, stripe_customer_id
    FROM users
    WHERE stripe_customer_id IS NOT NULL
      AND uag_access = FALSE
      AND is_active = TRUE
  `);

  let fixed = 0;
  for (const user of candidates) {
    try {
      // Look for a succeeded PaymentIntent for $37.99 (3799 cents)
      const payments = await stripe.paymentIntents.list({
        customer: user.stripe_customer_id,
        limit: 10,
      });
      const hasPaid = payments.data.some(
        p => p.status === 'succeeded' && p.amount === 3799
      );
      if (!hasPaid) continue;

      // Activate
      await db.query(
        `UPDATE users SET uag_access = TRUE, subscription = 'uag', subscription_status = 'active'
         WHERE id = $1`,
        [user.id]
      );
      sendEmail({
        to: user.email,
        subject: 'Your FAAExaminations.com Access is Active ✅',
        html: subscriptionEmail(user.full_name || user.email.split('@')[0], 'uag', user.id),
        userId: user.id,
        allowUnsubscribed: true,
      });
      console.log(`[reconcile] activated UAG for user ${user.id} (${user.email})`);
      fixed++;
    } catch (err) {
      console.error(`[reconcile] error checking user ${user.id}:`, err.message);
    }
  }
  console.log(`[reconcile] UAG: checked ${candidates.length} candidates, fixed ${fixed}`);
}

async function reconcileSubscriptions(stripe) {
  // Find users with a stripe_customer_id but subscription_status still inactive
  const { rows: candidates } = await db.query(`
    SELECT id, email, full_name, stripe_customer_id, subscription
    FROM users
    WHERE stripe_customer_id IS NOT NULL
      AND subscription_status IN ('inactive', 'free')
      AND subscription != 'uag'
      AND is_active = TRUE
  `);

  let fixed = 0;
  for (const user of candidates) {
    try {
      // Check if they have an active or trialing Stripe subscription
      const [active, trialing] = await Promise.all([
        stripe.subscriptions.list({ customer: user.stripe_customer_id, limit: 1, status: 'active' }),
        stripe.subscriptions.list({ customer: user.stripe_customer_id, limit: 1, status: 'trialing' }),
      ]);
      const sub = active.data[0] || trialing.data[0];
      if (!sub) continue;

      const PRICE_MAP = {
        [process.env.STRIPE_PRICE_PAR]:    'par',
        [process.env.STRIPE_PRICE_IRA]:    'ira',
        [process.env.STRIPE_PRICE_CAX]:    'cax',
        [process.env.STRIPE_PRICE_BUNDLE]: 'bundle',
      };
      const plan = PRICE_MAP[sub.items.data[0]?.price?.id];
      if (!plan) continue;

      const endsAt = new Date(sub.current_period_end * 1000);
      await db.query(
        `UPDATE users SET
           subscription        = $1,
           subscription_status = $2,
           subscription_ends_at = $3,
           stripe_subscription_id = $4,
           subscription_activated_at = COALESCE(subscription_activated_at, NOW())
         WHERE id = $5`,
        [plan, sub.status, endsAt, sub.id, user.id]
      );
      console.log(`[reconcile] activated ${plan}/${sub.status} for user ${user.id} (${user.email})`);
      fixed++;
    } catch (err) {
      console.error(`[reconcile] error checking user ${user.id}:`, err.message);
    }
  }
  console.log(`[reconcile] subscriptions: checked ${candidates.length} candidates, fixed ${fixed}`);
}

async function runReconcile() {
  if (!process.env.STRIPE_SECRET_KEY) {
    console.warn('[reconcile] STRIPE_SECRET_KEY not set — skipping');
    return;
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('[reconcile] starting Stripe reconciliation');
  await reconcileUAG(stripe);
  await reconcileSubscriptions(stripe);
  console.log('[reconcile] done');
}

module.exports = { runReconcile };
