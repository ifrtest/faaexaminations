// client/src/pages/admin/AdminUsers.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { users as usersApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

const PLAN_CHIPS = [
  { key: '',       label: 'All paid', countKey: 'all_paid' },
  { key: 'par',    label: 'PAR',      countKey: 'par' },
  { key: 'ira',    label: 'IRA',      countKey: 'ira' },
  { key: 'cax',    label: 'CAX',      countKey: 'cax' },
  { key: 'bundle', label: 'Bundle',   countKey: 'bundle' },
  { key: 'uag',    label: 'Part 107', countKey: 'uag' },
];

export default function AdminUsers({ paidOnly = false }) {
  const [list, setList]     = useState(null);
  const [total, setTotal]   = useState(0);
  const [breakdown, setBreakdown] = useState(null);
  const [plan, setPlan]     = useState('');
  const [page, setPage]     = useState(1);
  const [search, setSearch] = useState('');
  const [input, setInput]   = useState('');
  const [err, setErr]       = useState('');
  const pageSize = 25;

  const load = () => {
    setList(null);
    usersApi.list({ page, pageSize, search: search || undefined, paidOnly: paidOnly || undefined, plan: plan || undefined })
      .then((d) => { setList(d.users); setTotal(d.total); if (d.breakdown) setBreakdown(d.breakdown); })
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load users.'));
  };

  useEffect(load, [page, search, plan]);

  const selectPlan = (key) => { setPlan(key); setPage(1); };

  const applySearch = (e) => { e.preventDefault(); setSearch(input); setPage(1); };

  const toggleRole = async (u) => {
    const role = u.role === 'admin' ? 'student' : 'admin';
    if (!window.confirm(`Change ${u.email} to ${role}?`)) return;
    await usersApi.update(u.id, { role });
    load();
  };

  const toggleActive = async (u) => {
    await usersApi.update(u.id, { is_active: !u.is_active });
    load();
  };

  const toggleUag = async (u) => {
    const grant = !u.uag_access;
    if (!window.confirm(`${grant ? 'Grant' : 'Revoke'} Part 107 access for ${u.email}?`)) return;
    await usersApi.update(u.id, { uag_access: grant });
    load();
  };

  const deleteUser = async (u) => {
    if (!window.confirm(`Permanently delete ${u.email}? This cannot be undone.`)) return;
    try {
      await usersApi.remove(u.id);
      load();
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not delete user.');
    }
  };

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <>
      <h2 style={{ margin: '0 0 12px' }}>
        {paidOnly ? 'Paid Users' : 'Users'}
        {list !== null && <span style={{ color: 'var(--muted)', fontWeight: 400, fontSize: '.9rem', marginLeft: 10 }}>{total} shown</span>}
      </h2>
      {paidOnly && (
        <>
          <p style={{ color: 'var(--muted)', fontSize: '.85rem', margin: '0 0 12px' }}>
            Paying customers only — active subscriptions, trials, past-due, and Part 107 buyers.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {PLAN_CHIPS.map((c) => {
              const active = plan === c.key;
              const n = breakdown ? breakdown[c.countKey] : null;
              return (
                <button
                  key={c.key || 'all'}
                  onClick={() => selectPlan(c.key)}
                  className="btn btn-sm"
                  style={{
                    background: active ? 'var(--blue, #30ace2)' : 'transparent',
                    color: active ? '#fff' : 'var(--text, #cbd5e1)',
                    border: `1px solid ${active ? 'var(--blue, #30ace2)' : 'var(--border, #334155)'}`,
                    borderRadius: 999,
                    padding: '6px 14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {c.label}
                  {n !== null && (
                    <span style={{ marginLeft: 7, opacity: active ? 0.9 : 0.6, fontWeight: 700 }}>{n}</span>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}

      <div className="admin-toolbar">
        <form onSubmit={applySearch} style={{display:'flex',flex:1,gap:8}}>
          <input placeholder="Search by email or name…" value={input} onChange={(e) => setInput(e.target.value)} />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      {err && <div className="alert alert-err">{err}</div>}

      <div className="card" style={{padding:0}}>
        {list === null ? <Spinner /> :
          list.length === 0 ? <div className="empty">No users found.</div> : (
          <table className="data">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
                <th>Subscription</th>
                <th>Part 107</th>
                <th>Status</th>
                <th>Activity</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.full_name || <em style={{color:'var(--muted)'}}>—</em>}</td>
                  <td>
                    <span className={`badge ${u.role === 'admin' ? 'badge-gold' : ''}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>{u.subscription || <em style={{color:'var(--muted)'}}>free</em>}</td>
                  <td>
                    <span className={`badge ${u.uag_access ? 'badge-ok' : ''}`}>
                      {u.uag_access ? '✓ granted' : '—'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.is_active ? 'badge-ok' : 'badge-err'}`}>
                      {u.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ fontSize: '.8rem', whiteSpace: 'nowrap' }}>
                    {u.session_count > 0
                      ? <span style={{ color: 'var(--ok, #16a34a)', fontWeight: 600 }}>✓ {u.session_count} quiz{u.session_count !== 1 ? 'zes' : ''}</span>
                      : u.last_practice_at
                        ? <span style={{ color: 'var(--blue, #30ace2)' }}>
                            {u.last_practice_exam} · {Math.floor((Date.now() - new Date(u.last_practice_at)) / 86400000)}d ago
                          </span>
                        : <em style={{ color: 'var(--muted)' }}>no activity</em>
                    }
                  </td>
                  <td>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/users/${u.id}`} className="btn btn-ghost btn-sm">History</Link>
                    <button className="btn btn-ghost btn-sm" style={{marginLeft:6}} onClick={() => toggleRole(u)}>
                      {u.role === 'admin' ? 'Revoke admin' : 'Make admin'}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{marginLeft:6}} onClick={() => toggleUag(u)}>
                      {u.uag_access ? 'Revoke 107' : 'Grant 107'}
                    </button>
                    <button className="btn btn-ghost btn-sm" style={{marginLeft:6}} onClick={() => toggleActive(u)}>
                      {u.is_active ? 'Disable' : 'Enable'}
                    </button>
                    {u.role !== 'admin' && (
                      <button className="btn btn-ghost btn-sm" style={{marginLeft:6, color:'var(--err, #dc2626)'}} onClick={() => deleteUser(u)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</button>
        <div className="page-info">Page {page} of {pages} · {total} total</div>
        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
      </div>
    </>
  );
}
