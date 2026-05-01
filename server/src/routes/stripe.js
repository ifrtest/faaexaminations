// server/src/routes/stripe.js
const crypto  = require('crypto');
const express = require('express');
const Stripe  = require('stripe');
const db      = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { sendEmail, subscriptionEmail, cancellationEmail } = require('../utils/email');
const { capiPurchase } = require('../utils/metaCapi');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  par:    process.env.STRIPE_PRICE_PAR,
  ira:    process.env.STRIPE_PRICE_IRA,
  cax:    process.env.STRIPE_PRICE_CAX,
  uag:    process.env.STRIPE_PRICE_UAG,
  bundle: process.env.STRIPE_PRICE_BUNDLE,
};

// Plans that use one-time payment instead of subscription
const ONE_TIME_PLANS = new Set(['uag']);

// Which exams does each price unlock?
const PRICE_EXAMS = {
  [process.env.STRIPE_PRICE_PAR]:    [1],
  [process.env.STRIPE_PRICE_IRA]:    [2],
  [process.env.STRIPE_PRICE_CAX]:    [3],
  [process.env.STRIPE_PRICE_UAG]:    [4],
  [process.env.STRIPE_PRICE_BUNDLE]: [1, 2, 3, 4],
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

    const capiEventId = crypto.randomUUID();
    const isOneTime = ONE_TIME_PLANS.has(plan?.toLowerCase());
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: isOneTime ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/exams?subscribed=1&plan=${plan}&eid=${capiEventId}&sid={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.CLIENT_URL}/exams`,
      metadata: { user_id: String(user.id), plan, capi_event_id: capiEventId },
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/checkout]', err.message);
    res.status(500).json({ error: 'Could not create checkout session.' });
  }
});

// POST /api/stripe/webhook
// Stripe sends events here — raw body parsed globally in index.js, NOT here
router.post('/webhook', async (req, res) => {
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
          await activateSubscription(session);
        } else if (session.mode === 'payment') {
          await activateOneTimePurchase(session);
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

async function activateSubscription(session) {
  const customerId     = session.customer;
  const subscriptionId = session.subscription;
  const capiEventId    = session.metadata?.capi_event_id;
  const userId         = session.metadata?.user_id;

  // Retrieve subscription — if not attached to session yet, look up by customer
  let sub;
  if (subscriptionId) {
    sub = await stripe.subscriptions.retrieve(subscriptionId);
  } else {
    const list = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active' });
    sub = list.data[0];
    if (!sub) throw new Error('No active subscription found for customer ' + customerId);
  }

  const priceId  = sub.items.data[0].price.id;
  const planName = getPlanName(priceId) || priceId;
  const endsAt   = new Date(sub.current_period_end * 1000);

  // Cancel previous Stripe subscription to prevent double-billing
  if (userId) {
    const prevUser = await db.query('SELECT stripe_subscription_id FROM users WHERE id = $1', [userId]);
    const prevSubId = prevUser.rows[0]?.stripe_subscription_id;
    if (prevSubId && prevSubId !== sub.id) {
      try {
        await stripe.subscriptions.cancel(prevSubId);
        console.log(`[activateSubscription] cancelled previous subscription ${prevSubId} for user ${userId}`);
      } catch (cancelErr) {
        console.warn(`[activateSubscription] could not cancel previous subscription ${prevSubId}:`, cancelErr.message);
      }
    }
  }

  // Update by user ID (most reliable — unaffected by Stripe Link customer remapping)
  const whereClause = userId ? 'id = $5' : 'stripe_customer_id = $5';
  const whereValue  = userId ? userId : customerId;
  await db.query(
    `UPDATE users SET
       stripe_subscription_id = $1,
       stripe_customer_id     = COALESCE(stripe_customer_id, $6),
       subscription_status    = 'active',
       subscription_price_id  = $2,
       subscription_ends_at   = $3,
       subscription           = $4
     WHERE ${whereClause}`,
    [sub.id, priceId, endsAt, planName, whereValue, customerId]
  );
  console.log(`[activateSubscription] updated user ${whereValue} plan=${priceId}`);

  // Send subscription confirmation email + fire CAPI Purchase
  // Use user_id when available (Stripe Link remaps customer IDs)
  const userRes = userId
    ? await db.query('SELECT id, email, full_name FROM users WHERE id = $1', [userId])
    : await db.query('SELECT id, email, full_name FROM users WHERE stripe_customer_id = $1', [customerId]);
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
    // Fire CAPI Purchase — server-side so iOS-blocked browsers still report conversions
    if (capiEventId) {
      capiPurchase({
        eventId:   capiEventId,
        email:     user.email,
        firstName: user.full_name?.split(' ')[0],
        userId:    user.id,
      });
    }
  }
}

async function activateOneTimePurchase(session) {
  const customerId  = session.customer;
  const capiEventId = session.metadata?.capi_event_id;
  const plan        = session.metadata?.plan;
  const userId      = session.metadata?.user_id;

  // Retrieve line items to get the price ID
  const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 });
  const priceId   = lineItems.data[0]?.price?.id || PRICE_MAP[plan] || null;
  if (!lineItems.data[0]?.price?.id) {
    console.warn(`[activateOneTimePurchase] listLineItems returned empty for session ${session.id}, falling back to PRICE_MAP[${plan}]=${priceId}`);
  }

  // UAG is a permanent one-time add-on — set uag_access flag only.
  // Never overwrite subscription/subscription_status so it can coexist with any plan.
  const whereClause = userId ? 'id = $2' : 'stripe_customer_id = $2';
  const whereValue  = userId ? userId : customerId;
  await db.query(
    `UPDATE users SET
       stripe_customer_id = COALESCE(stripe_customer_id, $3),
       uag_access         = TRUE
     WHERE ${whereClause}`,
    [whereValue, customerId]
  );
  console.log(`[activateOneTimePurchase] set uag_access=true for user ${whereValue}`);

  const userRes = userId
    ? await db.query('SELECT id, email, full_name FROM users WHERE id = $1', [userId])
    : await db.query('SELECT id, email, full_name FROM users WHERE stripe_customer_id = $1', [customerId]);
  const user = userRes.rows[0];
  if (user) {
    sendEmail({
      to: user.email,
      subject: 'Your FAAExaminations.com Access is Active ✅',
      html: subscriptionEmail(user.full_name || user.email.split('@')[0], plan, user.id),
      userId: user.id,
      allowUnsubscribed: true,
    });
    if (capiEventId) {
      capiPurchase({
        eventId:   capiEventId,
        email:     user.email,
        firstName: user.full_name?.split(' ')[0],
        userId:    user.id,
      });
    }
  }
}

async function updateSubscription(sub) {
  const priceId  = sub.items.data[0].price.id;
  const planName = getPlanName(priceId) || priceId;
  const endsAt   = new Date(sub.current_period_end * 1000);
  const status   = sub.status; // active, past_due, canceled, etc.

  await db.query(
    `UPDATE users SET
       subscription_status   = $1,
       subscription_price_id = $2,
       subscription_ends_at  = $3,
       subscription          = $4
     WHERE stripe_subscription_id = $5`,
    [status, priceId, endsAt, planName, sub.id]
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

// POST /api/stripe/upgrade
// Swaps an existing active subscription to a new plan (no double-charge)
router.post('/upgrade', requireAuth, async (req, res) => {
  const { plan } = req.body;
  const priceId = PRICE_MAP[plan?.toLowerCase()];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan.' });

  try {
    const userRes = await db.query('SELECT * FROM users WHERE id = $1', [req.user.id]);
    const user = userRes.rows[0];

    if (!user.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription to upgrade.' });
    }

    const sub = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    const itemId = sub.items.data[0].id;

    await stripe.subscriptions.update(user.stripe_subscription_id, {
      items: [{ id: itemId, price: priceId }],
      proration_behavior: 'create_prorations',
    });

    // DB update is handled by the customer.subscription.updated webhook
    // once Stripe confirms payment. We do not grant access here.
    res.json({ success: true });
  } catch (err) {
    console.error('[stripe/upgrade]', err.message);
    res.status(500).json({ error: 'Could not upgrade subscription.' });
  }
});

// POST /api/stripe/verify-checkout
// Called by client after Stripe redirect — no auth required.
// The session_id is proof of payment (60-char unguessable Stripe token).
// User identity comes from session metadata set at checkout creation.
router.post('/verify-checkout', async (req, res) => {
  const { session_id } = req.body;
  console.log(`[verify-checkout] session_id=${session_id}`);
  if (!session_id) return res.status(400).json({ error: 'Missing session_id.' });
  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    console.log(`[verify-checkout] payment_status=${session.payment_status} mode=${session.mode} meta_user=${session.metadata?.user_id}`);
    if (session.payment_status !== 'paid') {
      return res.status(402).json({ error: 'Payment not completed.', payment_status: session.payment_status });
    }
    if (!session.metadata?.user_id) {
      return res.status(400).json({ error: 'No user ID in session metadata.' });
    }
    if (session.mode === 'subscription') {
      await activateSubscription(session);
    } else if (session.mode === 'payment') {
      await activateOneTimePurchase(session);
    }
    console.log(`[verify-checkout] SUCCESS user=${session.metadata.user_id}`);
    res.json({ success: true });
  } catch (err) {
    console.error('[verify-checkout] ERROR:', err.message, err.stack?.split('\n')[1]);
    res.status(500).json({ error: 'Could not verify session.', detail: err.message });
  }
});

// GET /api/stripe/plan — returns current plan name, used for upgrade polling
router.get('/plan', requireAuth, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT subscription_price_id, subscription_status FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = rows[0];
    res.json({
      plan: getPlanName(user.subscription_price_id),
      status: user.subscription_status,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch plan.' });
  }
});

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
      'SELECT subscription, subscription_status, subscription_price_id, subscription_ends_at, uag_access FROM users WHERE id = $1',
      [req.user.id]
    );
    const user = userRes.rows[0];
    // Admins and manually-granted "all" users get full plan access
    const isUnlimited = req.user.role === 'admin' || user.subscription === 'all';
    res.json({
      status:     isUnlimited ? 'active' : (user.subscription_status || 'inactive'),
      price_id:   user.subscription_price_id,
      ends_at:    user.subscription_ends_at,
      plan:       isUnlimited ? 'all' : (getPlanName(user.subscription_price_id) || user.subscription || null),
      uag_access: isUnlimited ? true : (user.uag_access || false),
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
  if (priceId === process.env.STRIPE_PRICE_UAG)    return 'uag';
  if (priceId === process.env.STRIPE_PRICE_BUNDLE) return 'bundle';
  return null;
}

module.exports = router;
module.exports.PRICE_EXAMS = PRICE_EXAMS;
