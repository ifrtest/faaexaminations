// client/src/pages/CancelPolicy.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function CancelPolicy() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirm, setConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const handleCancel = async () => {
    setBusy(true);
    setErr('');
    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('faa_token')}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Could not cancel subscription.');
      setCancelled(true);
      setConfirm(false);
    } catch (ex) {
      setErr(ex.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page" style={{ maxWidth: 760 }}>
      <Helmet>
        <title>Cancellation &amp; Refund Policy | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <h1>Cancellation &amp; Refund Policy</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32 }}>
        Last updated: April 2026
      </p>

      {/* Policy cards */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Cancel Anytime</div>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          You can cancel your subscription at any time — no questions asked. Once cancelled,
          your access continues until the end of your current billing period. You will not be
          charged again after that date.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Refund Policy</div>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          We do not offer refunds for the current billing period that has already been paid.
          All subscription charges are final for the month in which they are billed. If you
          cancel before your next renewal date, you will not be charged for the following month.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">What Happens When You Cancel</div>
        <ul style={{ color: 'var(--text2)', lineHeight: 2, paddingLeft: 20 }}>
          <li>Your subscription is cancelled immediately</li>
          <li>You keep full access until the end of your current billing period</li>
          <li>No further charges will be made to your card</li>
          <li>Your account and exam history are saved — you can resubscribe anytime</li>
        </ul>
      </div>

      <div className="card" style={{ marginBottom: 32 }}>
        <div className="card-title">📧 Questions?</div>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
          If you have any questions about your subscription or billing, contact us at{' '}
          <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)' }}>
            support@faaexaminations.com
          </a>. We typically respond within 24 hours.
        </p>
      </div>

      {/* Cancel subscription section — only shown to logged-in users */}
      {user && (
        <div className="card" style={{ borderColor: 'var(--red)', marginBottom: 32 }}>
          <div className="card-title" style={{ color: 'var(--red)' }}>Cancel My Subscription</div>

          {cancelled ? (
            <div className="alert alert-ok">
              Your subscription has been cancelled. You'll have access until the end of your current billing period.
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginBottom: 16 }}>
                You are currently subscribed. Cancelling will stop future charges — your access
                continues until the end of your billing period.
              </p>
              {err && <div className="alert alert-err" style={{ marginBottom: 12 }}>{err}</div>}

              {!confirm ? (
                <button
                  className="btn"
                  style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)' }}
                  onClick={() => setConfirm(true)}>
                  Cancel Subscription
                </button>
              ) : (
                <div style={{ background: 'var(--panel2)', borderRadius: 10, padding: 20 }}>
                  <p style={{ color: 'var(--text)', fontWeight: 600, marginBottom: 12 }}>
                    Are you sure you want to cancel?
                  </p>
                  <p style={{ color: 'var(--text2)', fontSize: '.9rem', marginBottom: 16 }}>
                    You'll lose access to all practice exams at the end of your billing period.
                  </p>
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button className="btn btn-ghost" onClick={() => setConfirm(false)} disabled={busy}>
                      Keep my subscription
                    </button>
                    <button
                      className="btn"
                      style={{ background: 'var(--red)', color: '#fff' }}
                      onClick={handleCancel}
                      disabled={busy}>
                      {busy ? 'Cancelling…' : 'Yes, cancel'}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <button className="btn btn-ghost" onClick={() => navigate(-1)}>← Go back</button>
    </div>
  );
}
