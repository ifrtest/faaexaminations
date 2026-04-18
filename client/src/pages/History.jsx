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
          <div className="icon">📊</div>
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
                  <td><strong>{r.exam_code}</strong> — {r.exam_name}</td>
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

function formatDuration(sec) {
  if (!sec) return '—';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}
