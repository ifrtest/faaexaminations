// client/src/pages/admin/AdminWinBack.jsx
import { useMemo, useState } from 'react';
import { users as usersApi } from '../../api/client';

const PLANS = [
  { value: 'bundle', label: 'Full access (PAR + IRA + CAX + Part 107)' },
  { value: 'par',    label: 'PAR only' },
  { value: 'ira',    label: 'IRA only' },
  { value: 'cax',    label: 'CAX only' },
  { value: 'uag',    label: 'Part 107 only' },
];

// Parse pasted lines into { email, name }. Accepts:
//   email@x.com
//   email@x.com, Chad Singleton
//   Chad Singleton <email@x.com>
//   email@x.com | Chad
function parseRecipients(text) {
  const out = [];
  const seen = new Set();
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const emailMatch = line.match(/[^\s,<>|]+@[^\s,<>|]+\.[^\s,<>|]+/);
    if (!emailMatch) continue;
    const email = emailMatch[0].toLowerCase();
    if (seen.has(email)) continue;
    seen.add(email);
    // Everything that isn't the email (minus separators/brackets) is the name
    const name = line.replace(emailMatch[0], '').replace(/[<>|,]/g, ' ').trim();
    out.push({ email, name });
  }
  return out;
}

export default function AdminWinBack() {
  const [text, setText]     = useState('');
  const [plan, setPlan]     = useState('bundle');
  const [days, setDays]     = useState(30);
  const [busy, setBusy]     = useState(false);
  const [results, setResults] = useState(null);
  const [err, setErr]       = useState('');

  const recipients = useMemo(() => parseRecipients(text), [text]);

  const send = async () => {
    setErr('');
    if (recipients.length === 0) { setErr('Paste at least one email address.'); return; }
    if (!window.confirm(`Send a free-month invite to ${recipients.length} ${recipients.length === 1 ? 'person' : 'people'}? This emails them immediately.`)) return;
    setBusy(true);
    setResults(null);
    try {
      const data = await usersApi.winback({ recipients, plan, days: Number(days) || 30 });
      setResults(data);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not send. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h2 style={{ margin: '0 0 6px' }}>Win-Back Emails</h2>
      <p style={{ color: 'var(--muted)', fontSize: '.9rem', margin: '0 0 20px' }}>
        Paste old customers below and send each a personalized free-month invite — from support@faaexaminations.com,
        with replies going to <strong>faaexaminations@gmail.com</strong>. Each person gets a unique one-time link;
        access auto-expires after the free period.
      </p>

      {err && <div className="alert alert-err">{err}</div>}

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}>
          Customers <span style={{ color: 'var(--muted)', fontWeight: 400 }}>— one per line (email, or "email, Name")</span>
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder={'chadsingleton24@gmail.com, Chad Singleton\nbuckmarchand13@gmail.com, Buck Marchand\nVe3lmp@bell.net, Mariusz Pental'}
          style={{ width: '100%', fontFamily: 'monospace', fontSize: '.9rem', padding: 12, borderRadius: 8 }}
        />

        <div className="row-2" style={{ marginTop: 16, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label>Offer</label>
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
              {PLANS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
          <div className="field" style={{ width: 140 }}>
            <label>Free days</label>
            <input type="number" min="1" max="365" value={days} onChange={(e) => setDays(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 16 }}>
          <button className="btn btn-primary" onClick={send} disabled={busy || recipients.length === 0}>
            {busy ? 'Sending…' : `Send to ${recipients.length} ${recipients.length === 1 ? 'person' : 'people'} →`}
          </button>
          {recipients.length > 0 && !busy && (
            <span style={{ color: 'var(--muted)', fontSize: '.85rem' }}>{recipients.length} valid email{recipients.length !== 1 ? 's' : ''} detected</span>
          )}
        </div>
      </div>

      {results && (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border, #223)', fontWeight: 600 }}>
            Sent {results.sent} of {results.total}
          </div>
          <table className="data">
            <thead>
              <tr><th>Email</th><th>Status</th><th>Link</th></tr>
            </thead>
            <tbody>
              {results.results.map((r, i) => (
                <tr key={i}>
                  <td>{r.email}</td>
                  <td>
                    <span className={`badge ${r.ok ? 'badge-ok' : 'badge-err'}`}>
                      {r.ok ? '✓ Sent' : `✗ ${r.error || 'Failed'}`}
                    </span>
                  </td>
                  <td style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{r.link || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
