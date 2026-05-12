// server/src/routes/stripe.js
const crypto  = require('crypto');
const express = require('express');
const Stripe  = require('stripe');
const db      = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { sendEmail, subscriptionEmail, cancellationEmail, trialStartEmail, trialEndingEmail } = require('../utils/email');
const { capiPurchase } = require('../utils/metaCapi');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Part 107 intro promo ($37.99) ends 2026-06-01 00:00 EST.
// After that date, new buyers are charged $57.99 via STRIPE_PRICE_UAG_FULL.
// Existing $37.99 buyers (STRIPE_PRICE_UAG) keep access forever — see PRICE_EXAMS + getPlanName.
const UAG_PROMO_END_MS = new Date('2026-06-01T04:00:00Z').getTime();
const isUagPromoActive = () => Date.now() < UAG_PROMO_END_MS;

const PRICE_MAP = {
  par:    process.env.STRIPE_PRICE_PAR,
  ira:    process.env.STRIPE_PRICE_IRA,
  cax:    process.env.STRIPE_PRICE_CAX,
  bundle: process.env.STRIPE_PRICE_BUNDLE,
};
Object.defineProperty(PRICE_MAP, 'uag', {
  get() { return isUagPromoActive() ? process.env.STRIPE_PRICE_UAG : process.env.STRIPE_PRICE_UAG_FULL; },
  enumerable: true,
});

// Plans that use one-time payment instead of subscription
const ONE_TIME_PLANS = new Set(['uag']);

// Which exams does each price unlock?
// Both UAG price IDs (intro + full) map to exam 4 so legacy buyers keep access.
const PRICE_EXAMS = {
  [process.env.STRIPE_PRICE_PAR]:      [1],
  [process.env.STRIPE_PRICE_IRA]:      [2],
  [process.env.STRIPE_PRICE_CAX]:      [3],
  [process.env.STRIPE_PRICE_UAG]:      [4],
  [process.env.STRIPE_PRICE_UAG_FULL]: [4],
  [process.env.STRIPE_PRICE_BUNDLE]:   [1, 2, 3, 4],
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
      payment_method_collection: 'always',
      line_items: [{ price: priceId, quantity: 1 }],
      ...(isOneTime ? {} : { subscription_data: { trial_period_days: 3 } }),
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
      case 'customer.subscription.trial_will_end': {
        // Stripe fires this exactly 3 days before trial_end — for a 3-day trial that's
        // the moment of signup, which duplicates the trial-start email. We skip it here
        // and send a "trial ends tomorrow" reminder via the nurture cron on day 2 instead.
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
      default:
        // Unhandled event type — acknowledge so Stripe doesn't retry
        break;
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
    // Check active first, then trialing (new trial users won't be active yet)
    let list = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'active' });
    sub = list.data[0];
    if (!sub) {
      list = await stripe.subscriptions.list({ customer: customerId, limit: 1, status: 'trialing' });
      sub = list.data[0];
    }
    if (!sub) throw new Error('No active or trialing subscription found for customer ' + customerId);
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
       stripe_subscription_id  = $1,
       stripe_customer_id      = COALESCE(stripe_customer_id, $6),
       subscription_status     = $7,
       subscription_price_id   = $2,
       subscription_ends_at    = $3,
       subscription            = $4,
       subscription_activated_at = COALESCE(subscription_activated_at, NOW())
     WHERE ${whereClause}`,
    [sub.id, priceId, endsAt, planName, whereValue, customerId, sub.status]
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
    if (sub.status === 'trialing') {
      const trialEnd = new Date(sub.trial_end * 1000);
      sendEmail({
        to: user.email,
        subject: 'Your 3-day free trial has started ✅',
        html: trialStartEmail(user.full_name || user.email.split('@')[0], plan, trialEnd, user.id),
        userId: user.id,
        allowUnsubscribed: true,
      });
    } else {
      sendEmail({
        to: user.email,
        subject: 'Your FAAExaminations.com Subscription is Active ✅',
        html: subscriptionEmail(user.full_name || user.email.split('@')[0], plan, user.id),
        userId: user.id,
        allowUnsubscribed: true,
      });
    }
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
  const whereClause = userId ? 'id = $1' : 'stripe_customer_id = $1';
  const whereValue  = userId ? userId : customerId;
  await db.query(
    `UPDATE users SET
       stripe_customer_id = COALESCE(stripe_customer_id, $2),
       uag_access         = TRUE,
       subscription       = 'uag'
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
  const endsAt   = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;
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
       subscription          = NULL,
       cancelled_at          = NOW()
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
    // 'no_payment_required' is returned for free trials (card on file, no charge yet)
    if (session.payment_status !== 'paid' && session.payment_status !== 'no_payment_required') {
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
    const activeSub = await stripe.subscriptions.retrieve(user.stripe_subscription_id);
    await stripe.subscriptions.update(user.stripe_subscription_id, {
      cancel_at_period_end: true,
    });
    const endsAt = new Date(activeSub.current_period_end * 1000);
    await db.query(
      "UPDATE users SET subscription_status = 'cancelling', subscription_ends_at = $1 WHERE id = $2",
      [endsAt, user.id]
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
    let effectiveStatus = isUnlimited ? 'active' : (user.subscription_status || 'inactive');
    // If cancelling and the billing period has already ended, revoke access now
    // (handles the case where the subscription.deleted webhook hasn't fired)
    if (effectiveStatus === 'cancelling' && user.subscription_ends_at && new Date(user.subscription_ends_at) < new Date()) {
      effectiveStatus = 'inactive';
    }
    res.json({
      status:     effectiveStatus,
      price_id:   user.subscription_price_id,
      ends_at:    user.subscription_ends_at,
      plan:       isUnlimited ? 'all' : (getPlanName(user.subscription_price_id) || user.subscription || null),
      uag_access: isUnlimited ? true : (user.uag_access || false),
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch subscription.' });
  }
});

// ── EMBEDDED CHECKOUT ──────────────────────────────────────────────────────
// POST /api/stripe/embedded/intent
// Creates a SetupIntent (subscriptions) or PaymentIntent (UAG one-time)
router.post('/embedded/intent', requireAuth, async (req, res) => {
  const { plan } = req.body;
  const userId   = req.user.id;
  const isOneTime = ONE_TIME_PLANS.has(plan);
  const priceId   = PRICE_MAP[plan];
  if (!priceId) return res.status(400).json({ error: 'Invalid plan.' });

  try {
    const userRes = await db.query('SELECT email, full_name, stripe_customer_id FROM users WHERE id = $1', [userId]);
    const user = userRes.rows[0];
    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name:  user.full_name || undefined,
        metadata: { user_id: String(userId) },
      });
      customerId = customer.id;
      await db.query('UPDATE users SET stripe_customer_id = $1 WHERE id = $2', [customerId, userId]);
    }

    if (isOneTime) {
      const pi = await stripe.paymentIntents.create({
        amount:   3799,
        currency: 'usd',
        customer: customerId,
        metadata: { plan, user_id: String(userId) },
        automatic_payment_methods: { enabled: true, allow_redirects: 'always' },
      });
      return res.json({ type: 'payment', clientSecret: pi.client_secret });
    }

    // Cancel any existing incomplete subscription for this price to avoid duplicates
    const existing = await stripe.subscriptions.list({ customer: customerId, status: 'incomplete', limit: 5 });
    for (const s of existing.data) {
      if (s.items.data[0]?.price?.id === priceId) await stripe.subscriptions.cancel(s.id);
    }

    const sub = await stripe.subscriptions.create({
      customer:         customerId,
      items:            [{ price: priceId }],
      trial_period_days: 3,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand:           ['pending_setup_intent', 'latest_invoice.payment_intent'],
      metadata:         { user_id: String(userId), plan },
    });

    // pending_setup_intent can be null — fall back to latest_invoice payment_intent or create one
    let clientSecret = sub.pending_setup_intent?.client_secret;
    if (!clientSecret) {
      clientSecret = sub.latest_invoice?.payment_intent?.client_secret;
    }
    if (!clientSecret) {
      const si = await stripe.setupIntents.create({ customer: customerId, metadata: { subscription_id: sub.id, user_id: String(userId), plan } });
      clientSecret = si.client_secret;
    }

    return res.json({
      type:           'setup',
      clientSecret,
      subscriptionId: sub.id,
    });
  } catch (err) {
    console.error('[embedded/intent]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/embedded/activate
// Called after card is confirmed on the frontend — grants access immediately
router.post('/embedded/activate', requireAuth, async (req, res) => {
  const { subscriptionId, paymentIntentId, plan } = req.body;
  const userId = req.user.id;

  try {
    if (paymentIntentId) {
      // UAG one-time
      const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (pi.status !== 'succeeded') return res.status(402).json({ error: 'Payment not completed.' });

      await db.query(
        'UPDATE users SET uag_access = TRUE, stripe_customer_id = COALESCE(stripe_customer_id, $1) WHERE id = $2',
        [pi.customer, userId]
      );
      const u = await db.query('SELECT email, full_name FROM users WHERE id = $1', [userId]);
      if (u.rows[0]) {
        sendEmail({
          to: u.rows[0].email,
          subject: 'Your Part 107 Access is Active ✅',
          html: subscriptionEmail(u.rows[0].full_name || u.rows[0].email.split('@')[0], 'uag', userId),
          userId,
          allowUnsubscribed: true,
        });
        capiPurchase({
          eventId: crypto.randomUUID(),
          email: u.rows[0].email,
          firstName: (u.rows[0].full_name || '').split(' ')[0] || '',
          userId,
          value: 37.99,
          currency: 'USD',
        });
      }
      return res.json({ success: true });
    }

    // Subscription
    const sub = await stripe.subscriptions.retrieve(subscriptionId);
    if (!['trialing', 'active'].includes(sub.status)) {
      return res.status(402).json({ error: 'Subscription not active. Please check your card details.' });
    }

    const priceId  = sub.items.data[0].price.id;
    const planName = getPlanName(priceId) || plan;
    const endsAt   = new Date(sub.current_period_end * 1000);

    // Cancel any previous subscription so the customer isn't double-billed
    const prevUser = await db.query('SELECT stripe_subscription_id FROM users WHERE id = $1', [userId]);
    const prevSubId = prevUser.rows[0]?.stripe_subscription_id;
    if (prevSubId && prevSubId !== sub.id) {
      try {
        await stripe.subscriptions.cancel(prevSubId);
        console.log(`[embedded/activate] cancelled previous subscription ${prevSubId} for user ${userId}`);
      } catch (cancelErr) {
        console.warn(`[embedded/activate] could not cancel previous subscription ${prevSubId}:`, cancelErr.message);
      }
    }

    await db.query(
      `UPDATE users SET
         stripe_subscription_id    = $1,
         subscription_status       = $2,
         subscription_price_id     = $3,
         subscription_ends_at      = $4,
         subscription              = $5,
         subscription_activated_at = COALESCE(subscription_activated_at, NOW())
       WHERE id = $6`,
      [sub.id, sub.status, priceId, endsAt, planName, userId]
    );

    const u = await db.query('SELECT email, full_name FROM users WHERE id = $1', [userId]);
    if (u.rows[0]) {
      if (sub.status === 'trialing') {
        const trialEnd = new Date(sub.trial_end * 1000);
        sendEmail({
          to: u.rows[0].email,
          subject: 'Your 3-day free trial has started ✅',
          html: trialStartEmail(u.rows[0].full_name || u.rows[0].email.split('@')[0], planName, trialEnd, userId),
          userId,
          allowUnsubscribed: true,
        });
      } else {
        sendEmail({
          to: u.rows[0].email,
          subject: 'Your FAAExaminations.com Subscription is Active ✅',
          html: subscriptionEmail(u.rows[0].full_name || u.rows[0].email.split('@')[0], planName, userId),
          userId,
          allowUnsubscribed: true,
        });
      }
      const PLAN_VALUE = { par: 24.99, ira: 24.99, cax: 24.99, bundle: 39.99 };
      capiPurchase({
        eventId: crypto.randomUUID(),
        email: u.rows[0].email,
        firstName: (u.rows[0].full_name || '').split(' ')[0] || '',
        userId,
        value: PLAN_VALUE[planName] || 24.99,
        currency: 'USD',
      });
    }

    return res.json({ success: true, status: sub.status });
  } catch (err) {
    console.error('[embedded/activate]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /api/stripe/portal
// Returns a Stripe Customer Portal URL for the logged-in user
router.post('/portal', requireAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const userRes = await db.query('SELECT stripe_customer_id FROM users WHERE id = $1', [userId]);
    const customerId = userRes.rows[0]?.stripe_customer_id;
    if (!customerId) return res.status(400).json({ error: 'No billing account found.' });

    const session = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${process.env.CLIENT_URL}/profile`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('[stripe/portal]', err.message);
    res.status(500).json({ error: 'Could not open billing portal.' });
  }
});

function getPlanName(priceId) {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PAR)    return 'par';
  if (priceId === process.env.STRIPE_PRICE_IRA)    return 'ira';
  if (priceId === process.env.STRIPE_PRICE_CAX)    return 'cax';
  if (priceId === process.env.STRIPE_PRICE_UAG)      return 'uag';
  if (priceId === process.env.STRIPE_PRICE_UAG_FULL) return 'uag';
  if (priceId === process.env.STRIPE_PRICE_BUNDLE) return 'bundle';
  return null;
}

module.exports = router;
module.exports.PRICE_EXAMS = PRICE_EXAMS;
