// client/src/pages/admin/AdminReengage.jsx
import { useEffect, useState } from 'react';
import { users as usersApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

export default function AdminReengage() {
  const [count, setCount]   = useState(null);
  const [days, setDays]     = useState(3);
  const [busy, setBusy]     = useState(false);
  const [results, setResults] = useState(null);
  const [err, setErr]       = useState('');

  useEffect(() => {
    usersApi.reengagePreview()
      .then((d) => setCount(d.count))
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load count.'));
  }, []);

  const send = async () => {
    setErr('');
    if (!window.confirm(`Email ${count} signed-up non-buyers a ${days}-day free-access offer? This sends immediately.`)) return;
    setBusy(true);
    setResults(null);
    try {
      const data = await usersApi.reengage({ days: Number(days) || 3 });
      setResults(data);
      setCount(0);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not send. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={{ margin: '0 0 6px' }}>Re-engage Free Users</h2>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', margin: '0 0 20px' }}>
        Emails everyone who signed up but never purchased a personalized free-access offer — from support@faaexaminations.com,
        replies to <strong>faaexaminations@gmail.com</strong>. They log in and their free days start <strong>when they click</strong> (not now),
        so nobody's window is wasted. Access auto-expires after the free period. Bots, owners, and current subscribers are excluded automatically.
      </p>

      {err && <div className="alert alert-err">{err}</div>}

      <div className="card" style={{ padding: 22, marginBottom: 20 }}>
        {count === null ? <Spinner /> : (
          <>
            <div style={{ fontSize: '1.05rem', marginBottom: 18 }}>
              <strong style={{ fontSize: '1.6rem', color: 'var(--blue, #30ace2)' }}>{count}</strong> people signed up but never purchased.
            </div>
            <div className="field" style={{ width: 160, marginBottom: 18 }}>
              <label>Free days</label>
              <input type="number" min="1" max="90" value={days} onChange={(e) => setDays(e.target.value)} />
            </div>
            <button className="btn btn-primary" onClick={send} disabled={busy || count === 0}>
              {busy ? 'Sending…' : count === 0 ? 'No one to email' : `Send ${days}-day offer to ${count} people →`}
            </button>
          </>
        )}
      </div>

      {results && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border, #223)', fontWeight: 600 }}>
            Sent {results.sent} of {results.total}
          </div>
          <table className="data">
            <thead><tr><th>Email</th><th>Status</th></tr></thead>
            <tbody>
              {results.results.map((r, i) => (
                <tr key={i}>
                  <td>{r.email}</td>
                  <td>
                    <span className={`badge ${r.ok ? 'badge-ok' : 'badge-err'}`}>
                      {r.ok ? '✓ Sent' : `✗ ${r.error || 'Failed'}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
