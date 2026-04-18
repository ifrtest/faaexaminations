// client/src/pages/ResetPassword.jsx
import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { auth } from '../api/client';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(params.get('token') || '');
  const [pw, setPw]       = useState('');
  const [pw2, setPw2]     = useState('');
  const [msg, setMsg]     = useState('');
  const [err, setErr]     = useState('');
  const [busy, setBusy]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (pw.length < 6)     return setErr('Password must be at least 6 characters.');
    if (pw !== pw2)        return setErr('Passwords do not match.');
    setBusy(true);
    try {
      await auth.reset(token, pw);
      setMsg('Password updated. Redirecting to login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Reset failed.');
    } finally { setBusy(false); }
  };

  return (
    <div className="container page center-col">
      <div className="card auth-card">
        <h2>Reset password</h2>
        {err && <div className="alert alert-err">{err}</div>}
        {msg && <div className="alert alert-ok">{msg}</div>}
        <form onSubmit={submit}>
          <div className="field">
            <label>Reset token</label>
            <input required value={token} onChange={(e) => setToken(e.target.value)} />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" required value={pw} onChange={(e) => setPw(e.target.value)} />
          </div>
          <div className="field">
            <label>Confirm password</label>
            <input type="password" required value={pw2} onChange={(e) => setPw2(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Saving…' : 'Update password'}
          </button>
        </form>
        <div className="alt"><Link to="/login">Back to sign in</Link></div>
      </div>
    </div>
  );
}
