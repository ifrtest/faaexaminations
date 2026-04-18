// client/src/pages/Profile.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { users } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.full_name || '');
  const [cur,  setCur]  = useState('');
  const [pw,   setPw]   = useState('');
  const [pw2,  setPw2]  = useState('');
  const [msg,  setMsg]  = useState('');
  const [err,  setErr]  = useState('');
  const [busy, setBusy] = useState(false);

  const saveName = async () => {
    setErr(''); setMsg(''); setBusy(true);
    try {
      const { user: u } = await users.updateMe({ full_name: name });
      updateUser(u);
      setMsg('Profile updated.');
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Update failed.');
    } finally { setBusy(false); }
  };

  const savePassword = async () => {
    setErr(''); setMsg('');
    if (pw.length < 6)  return setErr('New password must be at least 6 characters.');
    if (pw !== pw2)     return setErr('New passwords do not match.');
    setBusy(true);
    try {
      await users.updateMe({ current_password: cur, password: pw });
      setMsg('Password updated.');
      setCur(''); setPw(''); setPw2('');
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Update failed.');
    } finally { setBusy(false); }
  };

  return (
    <div className="container page" style={{maxWidth:720}}>
      <h1>Profile</h1>
      {err && <div className="alert alert-err">{err}</div>}
      {msg && <div className="alert alert-ok">{msg}</div>}

      <div className="card">
        <div className="card-title">Account details</div>
        <div className="field">
          <label>Email</label>
          <input value={user?.email || ''} disabled />
        </div>
        <div className="field">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={saveName} disabled={busy}>Save name</button>
      </div>

      <div className="card">
        <div className="card-title">Change password</div>
        <div className="field">
          <label>Current password</label>
          <input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
        </div>
        <div className="row-2">
          <div className="field">
            <label>New password</label>
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" />
          </div>
        </div>
        <button className="btn btn-primary" onClick={savePassword} disabled={busy || !cur || !pw}>
          Update password
        </button>
      </div>
      <div className="card" style={{ borderColor: 'var(--red)' }}>
        <div className="card-title" style={{ color: 'var(--red)' }}>Subscription</div>
        <p style={{ color: 'var(--text2)', marginBottom: 14 }}>
          Need to cancel or review our refund policy?
        </p>
        <Link to="/cancel-policy" className="btn" style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)', display: 'inline-block' }}>
          Cancellation &amp; Refund Policy
        </Link>
      </div>
    </div>
  );
}
