// client/src/pages/Checkout.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
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

const CARD_STYLE = {
  style: {
    base: {
      color: '#e5eef5',
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: '#4a6a85' },
      iconColor: '#30ace2',
    },
    invalid: { color: '#f87171', iconColor: '#f87171' },
  },
};

function CheckoutForm({ plan, intentData, onSuccess }) {
  const stripe   = useStripe();
  const elements = useElements();
  const [busy, setBusy]   = useState(false);
  const [err, setErr]     = useState('');
  const [ready, setReady] = useState(false);

  const info = PLAN_INFO[plan];
  const trialEnd = new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const submit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setErr('');

    const card = elements.getElement(CardElement);

    try {
      if (intentData.type === 'setup') {
        const { error, setupIntent } = await stripe.confirmCardSetup(intentData.clientSecret, {
          payment_method: { card },
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
        onSuccess();
      } else {
        const { error, paymentIntent } = await stripe.confirmCardPayment(intentData.clientSecret, {
          payment_method: { card },
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

      {/* Card input */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', color: '#94b8d4', fontSize: '.85rem', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '.06em' }}>
          Card Details
        </label>
        <div style={{
          background: '#0a121b',
          border: `1px solid ${ready ? '#30ace2' : '#1e2a38'}`,
          borderRadius: 10,
          padding: '14px 16px',
          transition: 'border-color 0.2s',
        }}>
          <CardElement options={CARD_STYLE} onReady={() => setReady(true)} />
        </div>
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
        }}>
        {busy ? 'Processing…' : info.trial ? 'Start 3-Day Free Trial →' : `Pay ${info.price} →`}
      </button>

      {info.trial && (
        <p style={{ color: '#4a6a85', fontSize: '.8rem', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          No charge until {trialEnd}. Cancel anytime at{' '}
          <Link to="/cancel-policy" style={{ color: '#30ace2' }}>faaexaminations.com/cancel-policy</Link>.
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, color: '#4a6a85', fontSize: '.8rem' }}>
        <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="1" y="5" width="10" height="8" rx="1.5" stroke="#4a6a85" strokeWidth="1.2"/><path d="M3.5 5V3.5a2.5 2.5 0 0 1 5 0V5" stroke="#4a6a85" strokeWidth="1.2" strokeLinecap="round"/></svg>
        Secured by Stripe · 256-bit SSL encryption
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
          <Elements stripe={stripePromise}>
            <CheckoutForm plan={plan} intentData={intentData} onSuccess={onSuccess} />
          </Elements>
        )}
      </div>

      <div style={{ marginTop: 20, color: '#2a3f54', fontSize: '.8rem' }}>
        <Link to="/exams" style={{ color: '#2a3f54' }}>← Back to exams</Link>
      </div>
    </div>
  );
}
