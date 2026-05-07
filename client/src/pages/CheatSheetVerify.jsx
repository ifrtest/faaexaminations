// client/src/pages/CheatSheetVerify.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const CHEATSHEET_URLS = {
  par:  '/par-cheat-sheet',
  ira:  '/ira-cheat-sheet',
  cax:  '/cax-cheat-sheet',
  uag:  '/part-107-cheat-sheet',
};

export default function CheatSheetVerify() {
  const { token } = useParams();
  const [state, setState] = useState('loading'); // loading | success | error
  const [plan,  setPlan]  = useState('par');
  const [msg,   setMsg]   = useState('');

  useEffect(() => {
    fetch(`/api/cheatsheet/verify/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setPlan(d.plan || 'par');
          setState('success');
        } else {
          setMsg(d.error || 'Something went wrong.');
          setState('error');
        }
      })
      .catch(() => {
        setMsg('Could not connect. Please try again.');
        setState('error');
      });
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', background: '#0b1622', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div style={{ maxWidth: 520, width: '100%', background: '#111e2d', border: '1px solid #1e2d3d', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 32 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: '#fff' }}>FAA<span style={{ color: '#30ace2' }}>Examinations</span><span style={{ color: '#6b8299', fontSize: '0.8em' }}>.com</span></span>
        </Link>

        {state === 'loading' && (
          <>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
            <h1 style={{ color: '#fff', fontSize: 22, marginBottom: 8 }}>Verifying your email…</h1>
            <p style={{ color: '#6b8299' }}>Just a moment.</p>
          </>
        )}

        {state === 'success' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h1 style={{ color: '#fff', fontSize: 24, marginBottom: 12 }}>Email confirmed!</h1>
            <p style={{ color: '#a0b4c8', marginBottom: 32, lineHeight: 1.6 }}>
              Your cheat sheet is on its way — check your inbox. You can also view and download it right now:
            </p>
            <a
              href={CHEATSHEET_URLS[plan] || '/par-cheat-sheet'}
              style={{ display: 'inline-block', background: '#30ace2', color: '#041018', padding: '14px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 16, marginBottom: 20 }}
            >
              View My Cheat Sheet →
            </a>
            <p style={{ color: '#6b8299', fontSize: 13 }}>
              Want to go further?{' '}
              <Link to="/register" style={{ color: '#30ace2' }}>Get started →</Link>
            </p>
          </>
        )}

        {state === 'error' && (
          <>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ color: '#fff', fontSize: 22, marginBottom: 12 }}>Link expired</h1>
            <p style={{ color: '#a0b4c8', marginBottom: 32, lineHeight: 1.6 }}>{msg}</p>
            <Link
              to="/"
              style={{ display: 'inline-block', background: '#30ace2', color: '#041018', padding: '13px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700 }}
            >
              Request Again →
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
