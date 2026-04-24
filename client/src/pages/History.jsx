// client/src/pages/History.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { results as resultsApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';

export default function History() {
  const [items, setItems] = useState(null);
  const [err, setErr]     = useState('');

  useEffect(() => {
    resultsApi.mine()
      .then((d) => setItems(d.results || []))
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load history.'));
  }, []);

  if (err) return <div className="container page"><div className="alert alert-err">{err}</div></div>;
  if (items === null) return <div className="container page"><Spinner /></div>;

  return (
    <div className="container page">
      <h1>Exam history</h1>
      <p style={{color:'var(--muted)'}}>All your completed exam attempts.</p>

      {items.length === 0 ? (
        <div className="empty">
          <div className="icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></div>
          <div>No exams completed yet.</div>
          <Link to="/exams" className="btn btn-primary" style={{marginTop:10}}>
            Take your first exam
          </Link>
        </div>
      ) : (
        <div className="card">
          <table className="data">
            <thead>
              <tr>
                <th>Date</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Result</th>
                <th>Correct</th>
                <th>Duration</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id}>
                  <td>{new Date(r.created_at).toLocaleString()}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                      <span style={{
                        background:'var(--blue)',color:'#fff',padding:'2px 8px',
                        borderRadius:6,fontSize:'.72rem',fontWeight:700,letterSpacing:'.5px',
                      }}>
                        {r.exam_code}
                      </span>
                      <strong>{r.topic_name || 'Mixed practice'}</strong>
                      {r.session_mode && (
                        <span style={{
                          padding:'2px 8px',borderRadius:6,
                          background:'rgba(245,166,35,.15)',color:'var(--amber)',
                          fontSize:'.7rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px',
                        }}>
                          {r.session_mode === 'exam' ? 'Exam' : 'Study'}
                        </span>
                      )}
                    </div>
                    {!r.topic_name && r.topic_breakdown && (
                      <div style={{color:'var(--muted)',fontSize:'.78rem',marginTop:4,lineHeight:1.4}}>
                        {summarizeTopics(r.topic_breakdown)}
                      </div>
                    )}
                  </td>
                  <td>{Number(r.score).toFixed(1)}%</td>
                  <td>
                    <span className={`badge ${r.passed ? 'badge-ok' : 'badge-err'}`}>
                      {r.passed ? 'Passed' : 'Failed'}
                    </span>
                  </td>
                  <td>{r.correct_count}/{r.total_questions}</td>
                  <td>{formatDuration(r.duration_sec)}</td>
                  <td><Link to={`/results/${r.id}`} className="btn btn-ghost btn-sm">Review</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function summarizeTopics(breakdown) {
  try {
    const bd = typeof breakdown === 'string' ? JSON.parse(breakdown) : breakdown;
    const names = Object.keys(bd || {}).filter((n) => n && n !== 'Uncategorized');
    if (!names.length) return null;
    if (names.length <= 3) return names.join(' · ');
    return `${names.slice(0, 3).join(' · ')} +${names.length - 3} more`;
  } catch { return null; }
}

function formatDuration(sec) {
  if (!sec) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
