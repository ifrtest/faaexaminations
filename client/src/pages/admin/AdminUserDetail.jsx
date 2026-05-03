import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { users as usersApi } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser]       = useState(null);
  const [results, setResults] = useState(null);
  const [err, setErr]         = useState('');

  useEffect(() => {
    Promise.all([usersApi.get(id), usersApi.results(id)])
      .then(([ud, rd]) => { setUser(ud.user); setResults(rd.results); })
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load user.'));
  }, [id]);

  if (err) return <div className="alert alert-err">{err}</div>;
  if (!user || !results) return <Spinner />;

  const passed  = results.filter((r) => r.passed).length;
  const avgScore = results.length
    ? (results.reduce((s, r) => s + Number(r.score), 0) / results.length).toFixed(1)
    : '—';

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link to="/admin/users" style={{ color: 'var(--blue)', fontSize: 14 }}>← Back to Users</Link>
      </div>

      {/* User card */}
      <div className="card" style={{ padding: '20px 24px', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{user.full_name || '—'}</div>
            <div style={{ color: 'var(--text2)', fontSize: 14 }}>{user.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginLeft: 'auto' }}>
            <Stat label="Tests taken" value={results.length} />
            <Stat label="Passed" value={passed} />
            <Stat label="Avg score" value={avgScore + '%'} />
            <Stat label="Subscription" value={user.subscription || 'free'} />
            <Stat label="Part 107" value={user.uag_access ? '✓ granted' : '—'} />
            <Stat label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
          </div>
        </div>
      </div>

      {/* Results table */}
      <div className="card" style={{ padding: 0 }}>
        {results.length === 0 ? (
          <div className="empty">No tests taken yet.</div>
        ) : (
          <table className="data">
            <thead>
              <tr>
                <th>Date</th>
                <th>Exam</th>
                <th>Mode</th>
                <th>Score</th>
                <th>Questions</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString()} {new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td>{r.exam_name} <span style={{ color: 'var(--text3)', fontSize: 12 }}>({r.exam_code})</span></td>
                  <td style={{ textTransform: 'capitalize' }}>{r.session_mode || '—'}</td>
                  <td style={{ fontWeight: 700 }}>{Number(r.score).toFixed(1)}%</td>
                  <td>{r.correct_count} / {r.total_questions}</td>
                  <td>
                    <span className={`badge ${r.passed ? 'badge-ok' : 'badge-err'}`}>
                      {r.passed ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}
