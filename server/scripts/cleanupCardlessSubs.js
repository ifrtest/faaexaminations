// server/scripts/cleanupCardlessSubs.js
//
// One-off cleanup for the Aug 2026 signup-bot wave.
// Cancels every Stripe subscription that is trialing/past_due but whose customer has
// NO card on file (these were created by bots calling /embedded/intent + /activate
// before the card-verification fix), and marks those users inactive in the DB.
//
// Usage (from server/):
//   node scripts/cleanupCardlessSubs.js            # dry run — prints what it would do
//   node scripts/cleanupCardlessSubs.js --apply    # actually cancel + update DB
//
require('dotenv').config();
const Stripe = require('stripe');
const db     = require('../src/config/db');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const APPLY  = process.argv.includes('--apply');

async function main() {
  const targets = [];
  for (const status of ['trialing', 'past_due']) {
    for await (const sub of stripe.subscriptions.list({ status, limit: 100 })) {
      if (sub.default_payment_method) continue;
      const cust = await stripe.customers.retrieve(sub.customer);
      if (cust.deleted) continue;
      if (cust.invoice_settings?.default_payment_method) continue;
      const pms = await stripe.paymentMethods.list({ customer: sub.customer, type: 'card', limit: 1 });
      if (pms.data.length) continue;
      targets.push({ id: sub.id, status, customer: sub.customer, email: cust.email, user_id: sub.metadata?.user_id });
    }
  }

  console.log(`${APPLY ? 'Cancelling' : 'Would cancel'} ${targets.length} card-less subscription(s):`);
  for (const t of targets) console.log(`  ${t.id}  ${t.status.padEnd(9)} user=${t.user_id || '?'}  ${t.email || ''}`);

  if (!APPLY) { console.log('\nDry run. Re-run with --apply to execute.'); process.exit(0); }

  for (const t of targets) {
    await stripe.subscriptions.cancel(t.id);
    await db.query(
      `UPDATE users SET subscription_status = 'inactive', subscription = 'free'
        WHERE stripe_subscription_id = $1`,
      [t.id]
    );
  }
  console.log('Done.');
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
