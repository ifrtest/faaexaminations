// client/src/pages/Register.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

// Maps the demo param (exam code, lowercase) to the exam code used by the API
const DEMO_EXAM_MAP = { par: 'PAR', ira: 'IRA', cax: 'CAX', uag: 'UAG' };

async function startDemoSession(token, examCode) {
  const res = await fetch('/api/quiz/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ exam_code: examCode, demo: true }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Could not start demo session');
  return data.session.id;
}

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');
  const demo = searchParams.get('demo');   // e.g. "par", "ira", "cax", "uag"
  const next = searchParams.get('next');

  useEffect(() => {
    if (!user) return;
    if (plan) navigate(`/exams?buy=${plan}`, { replace: true });
    else if (next) navigate(next, { replace: true });
    else navigate('/dashboard', { replace: true });
  }, [user]); // eslint-disable-line

  const [form, setForm] = useState({ full_name: '', email: '', password: '', confirm: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (form.password.length < 6) return setErr('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setErr('Passwords do not match.');
    setBusy(true);
    try {
      const data = await register(form.email, form.password, form.full_name);
      if (window.fbq) fbq('track', 'Lead', {}, data?.leadEventId ? { eventID: data.leadEventId } : {});
      if (window.gtag) gtag('event', 'sign_up', { method: 'email' });

      // Demo flow: start a real quiz session so they experience the product immediately
      const examCode = demo && DEMO_EXAM_MAP[demo.toLowerCase()];
      if (examCode) {
        try {
          const token = localStorage.getItem('faa_token');
          const sessionId = await startDemoSession(token, examCode);
          navigate(`/quiz/${sessionId}`, { replace: true });
          return;
        } catch {
          // Demo session failed — fall through to plan/dashboard
        }
      }

      if (plan) navigate(`/checkout?plan=${plan}`, { replace: true });
      else if (next) navigate(next, { replace: true });
      else navigate('/dashboard', { replace: true });
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not create account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page center-col">
      <Helmet>
        <title>Create Your Account | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="card auth-card">
        <h2>Create Your Account</h2>
        <p className="sub">Free to join · No credit card required to register</p>
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <li style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.92rem', color: 'var(--text2, #cbd5e1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Every official FAA handbook &amp; ACS — free
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.92rem', color: 'var(--text2, #cbd5e1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            30 free practice questions — no credit card needed
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.92rem', color: 'var(--text2, #cbd5e1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            Full TRUST recreational drone test — free
          </li>
          <li style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.92rem', color: 'var(--text2, #cbd5e1)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            PAR · IRA · CAX from $24.99/mo · Part 107 $57.99 one-time
          </li>
        </ul>
        {err && <div className="alert alert-err">{err}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Full name</label>
            <input name="full_name" value={form.full_name} onChange={onChange} autoComplete="name" />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" required autoComplete="email"
                   value={form.email} onChange={onChange} />
          </div>
          <div className="row-2">
            <div className="field">
              <label>Password</label>
              <input type="password" name="password" required autoComplete="new-password"
                     value={form.password} onChange={onChange} />
            </div>
            <div className="field">
              <label>Confirm password</label>
              <input type="password" name="confirm" required autoComplete="new-password"
                     value={form.confirm} onChange={onChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Creating…' : 'Create Account →'}
          </button>
        </form>
        <div className="alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
