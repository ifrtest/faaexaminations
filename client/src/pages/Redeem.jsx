// client/src/pages/Redeem.jsx
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { auth as authApi } from '../api/client';
import { Helmet } from 'react-helmet-async';

export default function Redeem() {
  const [params] = useSearchParams();
  const code = params.get('code');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const ran = useRef(false);
  const [status, setStatus] = useState('working');   // working | done | error
  const [days, setDays]     = useState(null);
  const [plan, setPlan]     = useState(null);
  const [msg, setMsg]       = useState('');

  useEffect(() => {
    if (loading || ran.current) return;
    if (!code) { setStatus('error'); setMsg('This link is missing its code.'); return; }
    if (!user) {
      // Send them to log in, then bounce straight back here to claim
      navigate('/login', { state: { from: { pathname: '/redeem', search: `?code=${code}` } }, replace: true });
      return;
    }
    ran.current = true;
    (async () => {
      try {
        const d = await authApi.claim({ code });
        setDays(d.days);
        setPlan(d.plan);
        setStatus('done');
      } catch (ex) {
        setStatus('error');
        setMsg(ex.response?.data?.error || 'Could not apply this offer.');
      }
    })();
  }, [loading, user, code, navigate]);

  return (
    <div className="container page" style={{ maxWidth: 520 }}>
      <Helmet><title>Redeem Your Free Access | FAAExaminations.com</title></Helmet>
      <div className="card" style={{ textAlign: 'center', padding: '40px 28px' }}>
        {status === 'working' && (
          <>
            <h2 style={{ margin: '0 0 8px' }}>Unlocking your access…</h2>
            <p style={{ color: 'var(--muted)' }}>One moment.</p>
          </>
        )}
        {status === 'done' && (
          <>
            <div style={{ fontSize: 44, marginBottom: 8 }}>🎉</div>
            <h2 style={{ margin: '0 0 8px' }}>You're in — {days} day{days === 1 ? '' : 's'} of full access unlocked</h2>
            <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>
              Every exam (PAR, IRA, CAX, Part 107), the timed simulator, and the AI instructor are all yours. No charge.
            </p>
            <Link to="/exams" className="btn btn-primary btn-block">Start Studying →</Link>
            {plan && plan !== 'bundle' && plan !== 'all' && (
              <Link to="/checkout?plan=bundle" style={{ display: 'inline-block', marginTop: 16, color: 'var(--blue, #30ace2)', fontWeight: 600, fontSize: '.92rem', textDecoration: 'none' }}>
                Want all four exams? Upgrade to full access →
              </Link>
            )}
          </>
        )}
        {status === 'error' && (
          <>
            <h2 style={{ margin: '0 0 8px' }}>Hmm — that didn't work</h2>
            <p style={{ color: 'var(--muted)', margin: '0 0 24px' }}>{msg}</p>
            <Link to="/exams" className="btn btn-primary btn-block">Go to My Exams →</Link>
          </>
        )}
      </div>
    </div>
  );
}
