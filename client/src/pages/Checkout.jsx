// client/src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PLAN_INFO = {
  par:    { label: 'Private Pilot (PAR)',     price: '$24.99/month', trial: true,  color: '#30ace2' },
  ira:    { label: 'Instrument Rating (IRA)', price: '$24.99/month', trial: true,  color: '#30ace2' },
  cax:    { label: 'Commercial Pilot (CAX)',  price: '$24.99/month', trial: true,  color: '#30ace2' },
  bundle: { label: 'All 3 Exams Bundle',      price: '$39.99/month', trial: true,  color: '#30ace2' },
  uag:    { label: 'Part 107 Remote Pilot',   price: '$37.99 one-time', trial: false, color: '#f5c842' },
};

const ELEMENTS_APPEARANCE = {
  theme: 'night',
  variables: {
    colorPrimary: '#30ace2',
    colorBackground: '#0a121b',
    colorText: '#e5eef5',
    colorTextSecondary: '#94b8d4',
    colorDanger: '#f87171',
    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    borderRadius: '8px',
    spacingUnit: '4px',
  },
  rules: {
    '.Input': { border: '1px solid #1e2a38', padding: '12px 14px' },
    '.Input:focus': { border: '1px solid #30ace2', boxShadow: 'none' },
    '.Label': { color: '#94b8d4', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' },
  },
};

function HelpForm({ email }) {
  const [open, setOpen]   = useState(false);
  const [msg, setMsg]     = useState('');
  const [sent, setSent]   = useState(false);
  const [busy, setBusy]   = useState(false);

  const send = async () => {
    if (!msg.trim()) return;
    setBusy(true);
    try {
      await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email || 'unknown', message: msg }),
      });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #1e2a38', textAlign: 'center' }}>
      {!open && (
        <span style={{ color: '#4a6a85', fontSize: '.8rem' }}>
          Need help?{' '}
          <button onClick={() => setOpen(true)} style={{ background: 'none', border: 'none', color: '#30ace2', fontSize: '.8rem', cursor: 'pointer', padding: 0 }}>
            Send us a message →
          </button>
        </span>
      )}
      {open && !sent && (
        <div style={{ textAlign: 'left' }}>
          <textarea
            value={msg}
            onChange={e => setMsg(e.target.value)}
            placeholder="What do you need help with?"
            rows={3}
            style={{ width: '100%', background: '#0a121b', border: '1px solid #1e2a38', borderRadius: 8, padding: '10px 12px', color: '#e5eef5', fontSize: '13px', fontFamily: 'inherit', resize: 'none', outline: 'none', marginBottom: 8, boxSizing: 'border-box' }}
          />
          <button
            onClick={send}
            disabled={busy}
            style={{ width: '100%', background: 'rgba(48,172,226,0.1)', border: '1px solid rgba(48,172,226,0.25)', borderRadius: 8, padding: 10, color: '#30ace2', fontSize: '13px', fontWeight: 600, cursor: busy ? 'not-allowed' : 'pointer' }}>
            {busy ? 'Sending…' : 'Send Message'}
          </button>
        </div>
      )}
      {sent && <p style={{ color: '#34d399', fontSize: '.8rem', margin: 0 }}>Sent! We'll reply within a few hours.</p>}
    </div>
  );
}

function CheckoutForm({ plan, intentData, onSuccess, userEmail }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);
  const [err, setErr]   = useState('');

  const info = PLAN_INFO[plan];
  const trialEnd = new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setErr('');

    try {
      if (intentData.type === 'setup') {
        const { error, setupIntent } = await stripe.confirmSetup({
          elements,
          redirect: 'if_required',
        });
        if (error) { setErr(error.message); setBusy(false); return; }
        if (setupIntent.status !== 'succeeded') { setErr('Card setup failed. Please try again.'); setBusy(false); return; }

        const res = await fetch('/api/stripe/embedded/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
          body: JSON.stringify({ subscriptionId: intentData.subscriptionId, plan }),
        });
        const data = await res.json();
        if (!res.ok) { setErr(data.error || 'Could not activate subscription.'); setBusy(false); return; }
        if (window.fbq) fbq('track', 'Purchase', { value: 0, currency: 'USD', content_name: plan });
        onSuccess();
      } else {
        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          redirect: 'if_required',
        });
        if (error) { setErr(error.message); setBusy(false); return; }
        if (paymentIntent.status !== 'succeeded') { setErr('Payment failed. Please try again.'); setBusy(false); return; }

        const res = await fetch('/api/stripe/embedded/activate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id, plan }),
        });
        const data = await res.json();
        if (!res.ok) { setErr(data.error || 'Could not activate access.'); setBusy(false); return; }
        if (window.fbq) fbq('track', 'Purchase', { value: 37.99, currency: 'USD', content_name: plan });
        onSuccess();
      }
    } catch (ex) {
      setErr(ex.message || 'Something went wrong.');
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      {/* Plan summary */}
      <div style={{ background: '#0a121b', borderRadius: 12, padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{info.label}</div>
          <div style={{ color: info.color, fontWeight: 700, fontSize: '1rem' }}>{info.price}</div>
        </div>
        {info.trial && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #1e2a38' }}>
              <span style={{ color: '#94b8d4', fontSize: '.88rem' }}>Trial period</span>
              <span style={{ color: '#34d399', fontWeight: 600, fontSize: '.88rem' }}>3 days free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #1e2a38' }}>
              <span style={{ color: '#94b8d4', fontSize: '.88rem' }}>First charge</span>
              <span style={{ color: '#fff', fontSize: '.88rem' }}>{trialEnd}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #1e2a38' }}>
              <span style={{ color: '#94b8d4', fontSize: '.88rem' }}>Today's charge</span>
              <span style={{ color: '#34d399', fontWeight: 700, fontSize: '.88rem' }}>$0.00</span>
            </div>
          </>
        )}
        {!info.trial && (
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid #1e2a38' }}>
            <span style={{ color: '#94b8d4', fontSize: '.88rem' }}>Lifetime access</span>
            <span style={{ color: '#34d399', fontWeight: 600, fontSize: '.88rem' }}>No subscription</span>
          </div>
        )}
      </div>

      {/* Payment input — renders card fields + Apple Pay / Google Pay automatically */}
      <div style={{ marginBottom: 20 }}>
        <PaymentElement options={{ layout: 'tabs' }} />
      </div>

      {err && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: '.88rem' }}>
          {err}
        </div>
      )}

      <button
        type="submit"
        disabled={busy || !stripe}
        style={{
          width: '100%',
          background: busy ? '#1a3a5c' : '#30ace2',
          color: busy ? '#94b8d4' : '#041018',
          border: 'none',
          borderRadius: 10,
          padding: '15px 24px',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: busy ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          marginBottom: 12,
          marginTop: 8,
        }}>
        {busy ? 'Processing…' : info.trial ? 'Start 3-Day Free Trial →' : `Pay ${info.price} →`}
      </button>

      {info.trial && (
        <p style={{ color: '#4a6a85', fontSize: '.8rem', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          No charge until {trialEnd}. Cancel anytime at{' '}
          <Link to="/cancel-policy" style={{ color: '#30ace2' }}>faaexaminations.com/cancel-policy</Link>.
        </p>
      )}

      <HelpForm email={userEmail} />

      {/* Trust strip */}
      <div style={{ marginTop: 20, borderTop: '1px solid #1e2a38', paddingTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          {/* Visa */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 4, padding: '2px 4px' }}>
            <text x="4" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="13" fill="#1a1f71">VISA</text>
          </svg>
          {/* Mastercard */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 4 }}>
            <circle cx="14" cy="12" r="7" fill="#EB001B"/>
            <circle cx="24" cy="12" r="7" fill="#F79E1B"/>
            <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00"/>
          </svg>
          {/* Amex */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#2671b2', borderRadius: 4, padding: '2px 3px' }}>
            <text x="2" y="16" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="9" fill="#fff">AMEX</text>
          </svg>
          {/* Discover */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 4, padding: '2px 3px' }}>
            <text x="1" y="11" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7" fill="#231f20">DISC-</text>
            <text x="1" y="19" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7" fill="#231f20">OVER</text>
            <circle cx="30" cy="12" r="6" fill="#F76F20"/>
          </svg>
          {/* Apple Pay */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#000', borderRadius: 4, padding: '3px 5px' }}>
            <text x="4" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#fff">Apple</text>
            <text x="4" y="18" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#fff">Pay</text>
          </svg>
          {/* Google Pay */}
          <svg width="38" height="24" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 4, padding: '3px 4px' }}>
            <text x="1" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#4285F4">G</text>
            <text x="7" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#EA4335">o</text>
            <text x="12" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#FBBC05">o</text>
            <text x="17" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#34A853">g</text>
            <text x="22" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#EA4335">l</text>
            <text x="25" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#4285F4">e</text>
            <text x="4" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#5F6368">Pay</text>
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '.78rem' }}>
            <svg width="13" height="15" viewBox="0 0 13 15" fill="none"><rect x="1" y="5.5" width="11" height="8.5" rx="1.5" stroke="#34d399" strokeWidth="1.2"/><path d="M4 5.5V3.5a2.5 2.5 0 0 1 5 0v2" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round"/><path d="M6.5 9v2" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/><circle cx="6.5" cy="8.5" r=".7" fill="#34d399"/></svg>
            <span style={{ color: '#34d399', fontWeight: 600 }}>SSL Encrypted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4a6a85', fontSize: '.78rem' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L1.5 3.5v4C1.5 10.6 4 13 7 13s5.5-2.4 5.5-5.5v-4L7 1z" stroke="#30ace2" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 7l2 2 3-3" stroke="#30ace2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Powered by <span style={{ color: '#30ace2', fontWeight: 600 }}>Stripe</span></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4a6a85', fontSize: '.78rem' }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5.5" stroke="#4a6a85" strokeWidth="1.2"/><path d="M4 6.5l2 2 3-3" stroke="#4a6a85" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const plan = searchParams.get('plan')?.toLowerCase();

  const [intentData, setIntentData] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [err, setErr]               = useState('');

  useEffect(() => {
    if (plan && PLAN_INFO[plan] && window.fbq) {
      const PLAN_VALUE = { par: 24.99, ira: 24.99, cax: 24.99, bundle: 39.99, uag: 37.99 };
      fbq('track', 'InitiateCheckout', {
        value: PLAN_VALUE[plan] || 24.99,
        currency: 'USD',
        content_name: PLAN_INFO[plan].label,
        content_ids: [plan],
        num_items: 1,
      });
    }
  }, [plan]); // eslint-disable-line

  useEffect(() => {
    if (!user) {
      navigate(`/register?plan=${plan || 'par'}`, { replace: true });
      return;
    }
    if (!plan || !PLAN_INFO[plan]) {
      navigate('/exams', { replace: true });
      return;
    }
    fetch('/api/stripe/embedded/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
      body: JSON.stringify({ plan }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.error) { setErr(d.error); setLoading(false); return; }
        setIntentData(d);
        setLoading(false);
      })
      .catch(() => { setErr('Could not load checkout. Please try again.'); setLoading(false); });
  }, []); // eslint-disable-line

  const onSuccess = () => {
    navigate(`/exams?subscribed=1&plan=${plan}`, { replace: true });
  };

  const info = PLAN_INFO[plan] || PLAN_INFO.par;

  return (
    <div style={{ minHeight: '100vh', background: '#080e14', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 16px', fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>
      <Helmet>
        <title>Checkout | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e5eef5' }}>
          FAA<span style={{ color: '#30ace2' }}>Examinations</span><span style={{ color: '#93a5b5', fontSize: '.8em' }}>.com</span>
        </div>
      </Link>

      <div style={{ width: '100%', maxWidth: 480, background: '#0f1822', border: '1px solid #1e2a38', borderRadius: 16, padding: '36px 32px' }}>
        <div style={{ marginBottom: 28, textAlign: 'center' }}>
          <div style={{ color: info.color, fontWeight: 700, fontSize: '.8rem', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            {info.trial ? '3-Day Free Trial' : 'One-Time Purchase'}
          </div>
          <h1 style={{ color: '#fff', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{info.label}</h1>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <div style={{ width: 32, height: 32, border: '3px solid #30ace2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
            <div style={{ color: '#94b8d4', fontSize: '.9rem' }}>Preparing checkout…</div>
          </div>
        )}

        {err && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', color: '#fca5a5', fontSize: '.9rem', textAlign: 'center' }}>
            {err}
          </div>
        )}

        {!loading && !err && intentData && (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: intentData.clientSecret, appearance: ELEMENTS_APPEARANCE }}
          >
            <CheckoutForm plan={plan} intentData={intentData} onSuccess={onSuccess} userEmail={user?.email} />
          </Elements>
        )}
      </div>

      <div style={{ marginTop: 20, color: '#2a3f54', fontSize: '.8rem' }}>
        <Link to="/exams" style={{ color: '#2a3f54' }}>← Back to exams</Link>
      </div>
    </div>
  );
}
