// client/src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { auth } from '../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg]     = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg(''); setBusy(true);
    try {
      const res = await auth.forgot(email);
      setMsg(res.message);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Unable to send reset email.');
    } finally { setBusy(false); }
  };

  return (
    <div className="container page center-col">
      <Helmet>
        <title>Forgot Password | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div className="card auth-card">
        <h2>Forgot password</h2>
        <p className="sub">Enter your email and we'll send a reset link.</p>
        {err && <div className="alert alert-err">{err}</div>}
        {msg && <div className="alert alert-ok">{msg}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Sending…' : 'Send reset link'}
          </button>
        </form>
        <div className="alt"><Link to="/login">Back to sign in</Link></div>
      </div>
    </div>
  );
}
