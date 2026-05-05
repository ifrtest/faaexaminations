// client/src/pages/Profile.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { users } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
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
      {/* Cheat Sheets */}
      {(() => {
        const sub = user?.subscription;
        const sheets = [];
        if (['par', 'bundle', 'all', 'pro'].includes(sub)) sheets.push({ label: 'Private Pilot (PAR) Cheat Sheet', url: '/par-cheat-sheet' });
        if (['ira', 'bundle', 'all', 'pro'].includes(sub)) sheets.push({ label: 'Instrument Rating (IRA) Cheat Sheet', url: '/ira-cheat-sheet' });
        if (['cax', 'bundle', 'all', 'pro'].includes(sub)) sheets.push({ label: 'Commercial Pilot (CAX) Cheat Sheet', url: '/cax-cheat-sheet' });
        if (['uag', 'all', 'pro'].includes(sub) || user?.uag_access) sheets.push({ label: 'Part 107 Remote Pilot Cheat Sheet', url: '/part-107-cheat-sheet' });
        if (!sheets.length) return null;
        return (
          <div className="card">
            <div className="card-title">Your Cheat Sheets</div>
            <p style={{ color: 'var(--text2)', marginBottom: 16, fontSize: '.9rem' }}>
              Key numbers, rules, formulas, and acronyms for your FAA written exam — view online or save as PDF.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sheets.map(s => (
                <div key={s.url} style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--text)', fontSize: '.9rem', flex: 1, minWidth: 200 }}>{s.label}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 13, padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', textDecoration: 'none' }}>
                      View HTML
                    </a>
                    <a href={`${s.url}?print=1`} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 13, padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)', textDecoration: 'none' }}>
                      ⬇ Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      <div className="card" style={{ borderColor: 'var(--red)' }}>
        <div className="card-title" style={{ color: 'var(--red)' }}>Subscription</div>
        <p style={{ color: 'var(--text2)', marginBottom: 14 }}>
          Cancel, update your payment method, or view invoices — all from one place.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn"
            style={{ background: 'transparent', border: '1px solid var(--red)', color: 'var(--red)' }}
            onClick={async () => {
              try {
                const res = await fetch('/api/stripe/portal', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
                });
                const data = await res.json();
                if (data.url) window.location.href = data.url;
                else alert(data.error || 'Could not open billing portal.');
              } catch {
                alert('Something went wrong. Please try again.');
              }
            }}
          >
            Manage Subscription →
          </button>
          <Link to="/cancel-policy" style={{ color: 'var(--text2)', fontSize: '.85rem', alignSelf: 'center' }}>
            Cancellation &amp; Refund Policy
          </Link>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Sign out</div>
        <p style={{ color: 'var(--text2)', marginBottom: 14 }}>
          Using a shared or public device? Sign out to keep your account secure.
        </p>
        <button className="btn" onClick={handleLogout}
          style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text2)' }}>
          Log out of this device
        </button>
      </div>
    </div>
  );
}
