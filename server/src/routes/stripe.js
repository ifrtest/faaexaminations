// server/src/routes/stripe.js
const express = require('express');
const Stripe  = require('stripe');
const db      = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { sendEmail, subscriptionEmail, cancellationEmail } = require('../utils/email');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  par:    process.env.STRIPE_PRICE_PAR,
  ira:    process.env.STRIPE_PRICE_IRA,
  cax:    process.env.STRIPE_PRICE_CAX,
  bundle: process.env.STRIPE_PRICE_BUNDLE,
};

// Which exams does each price unlock?
const PRICE_EXAMS = {
  [process.env.STRIPE_PRICE_PAR]:    [1],
  [process.env.STRIPE_PRICE_IRA]:    [2],
  [process.env.STRIPE_PRICE_CAX]:    [3],
  [process.env.STRIPE_PRICE_BUNDLE]: [1, 2, 3],
};

// POST /api/stripe/checkout
// Creates a Stripe Checkout session and returns the URL
router.post('/checkout', requireAuth, async (req, res) => {
  const { plan } = req.body; // 'par' | 'ira' | 'cax' | 'bundle'
  const priceId = PRICE_MAP[plan?.toLowerCase()];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan.' });

  try {
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];

    // Create or reuse Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.full_name || user.email,
        metadata: { user_id: String(user.id) },
      });
      customerId = customer.id;
      await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, user.id]);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?subscribed=1`,
      cancel_url:  `${process.env.CLIENT_URL}/exams`,
      metadata: { user_id: String(user.id), plan },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout]', err.message);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

// POST /api/stripe/webhook
// Stripe sends events here
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[webhook] signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        if (session.mode === 'subscription') {
          await activateSubscription(session.customer, session.subscription);
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object;
        await updateSubscription(sub);
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await deactivateSubscription(sub.customer);
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await db.query(
          "UPDATE users SET subscription_status = 'past_due' WHERE stripe_customer_id = $1",
          [invoice.customer]
        );
        break;
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('[webhook] handler error:', err.message);
    res.status(500).json({ error: 'Webhook handler failed.' });
  }
});

async function activateSubscription(customerId, subscriptionId) {
  const sub = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = sub.items.data[0].price.id;
  const endsAt = new Date(sub.current_period_end * 1000);

  await db.query(
    `UPDATE users SET
       stripe_subscription_id = $1,
       subscription_status    = 'active',
       subscription_price_id  = $2,
       subscription_ends_at   = $3,
       subscription           = $4
     WHERE stripe_customer_id = $5`,
    [subscriptionId, priceId, endsAt, priceId, customerId]
  );

  // Send subscription confirmation email
  const userRes = await db.query('SELECT id, email, full_name FROM users WHERE stripe_customer_id = $1', [customerId]);
  const user = userRes.rows[0];
  if (user) {
    const plan = getPlanName(priceId);
    sendEmail({
      to: user.email,
      subject: 'Your FAAExaminations.com Subscription is Active ✅',
      html: subscriptionEmail(user.full_name || user.email.split('@')[0], plan, user.id),
      userId: user.id,
      allowUnsubscribed: true,
    });
  }
}

async function updateSubscription(sub) {
  const priceId = sub.items.data[0].price.id;
  const endsAt  = new Date(sub.current_period_end * 1000);
  const status  = sub.status; // active, past_due, canceled, etc.

  await db.query(
    `UPDATE users SET
       subscription_status   = $1,
       subscription_price_id = $2,
       subscription_ends_at  = $3,
       subscription          = $4
     WHERE stripe_subscription_id = $5`,
    [status, priceId, endsAt, priceId, sub.id]
  );
}

async function deactivateSubscription(customerId) {
  await db.query(
    `UPDATE users SET
       subscription_status   = 'cancelled',
       subscription          = NULL
     WHERE stripe_customer_id = $1`,
    [customerId]
  );

  // Send cancellation email
  const userRes = await db.query('SELECT id, email, full_name FROM users WHERE stripe_customer_id = $1', [customerId]);
  const user = userRes.rows[0];
  if (user) {
    sendEmail({
      to: user.email,
      subject: 'Your FAAExaminations.com Subscription Has Been Cancelled',
      html: cancellationEmail(user.full_name || user.email.split('@')[0], user.id),
      userId: user.id,
      allowUnsubscribed: true,
    });
  }
}

// POST /api/users/cancel-subscription
router.post('/cancel-subscription', requireAuth, async (req, res) => {
  try {
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];
    if (!user.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription found.' });
    }
    // Cancel at period end so they keep access until billing period ends
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    await db.query(
      "UPDATE users SET subscription_status = 'cancelling' WHERE id = $1",
      [user.id]
    );
    res.json({ success: true, message: 'Subscription will cancel at end of billing period.' });
  } catch (err) {
    console.error('[cancel-subscription]', err.message);
    res.status(500).json({ error: 'Could not cancel subscription.' });
  }
});

// GET /api/stripe/subscription
// Returns current user's subscription status
router.get('/subscription', requireAuth, async (req, res) => {
  try {
    const userRes = await db.query(
      'SELECT subscription_status, subscription_price_id, subscription_ends_at FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userRes.rows[0];
    res.json({
      status:   user.subscription_status || 'inactive',
      price_id: user.subscription_price_id,
      ends_at:  user.subscription_ends_at,
      plan:     getPlanName(user.subscription_price_id),
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch subscription.' });
  }
});

function getPlanName(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PAR)    return 'par';
  if (priceId === process.env.STRIPE_PRICE_IRA)    return 'ira';
  if (priceId === process.env.STRIPE_PRICE_CAX)    return 'cax';
  if (priceId === process.env.STRIPE_PRICE_BUNDLE) return 'bundle';
  return null;
}

module.exports = router;
module.exports.PRICE_EXAMS = PRICE_EXAMS;
