// client/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { users } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [err, setErr]     = useState('');

  useEffect(() => {
    users.adminStats()
      .then(setStats)
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load stats.'));
  }, []);

  if (err) return <div className="alert alert-err">{err}</div>;
  if (!stats) return <Spinner />;

  return (
    <>
      <div className="stat-grid">
        <div className="stat">
          <div className="label">Users</div>
          <div className="value">{stats.users.total}</div>
          <div className="sub">{stats.users.new_week} new this week</div>
        </div>
        <div className="stat">
          <div className="label">Pro users</div>
          <div className="value">{stats.users.pro}</div>
          <div className="sub">Paid subscribers</div>
        </div>
        <div className="stat">
          <div className="label">Exams taken</div>
          <div className="value">{stats.tests.total}</div>
          <div className="sub">{stats.tests.passed} passed · avg {Number(stats.tests.avg_score).toFixed(1)}%</div>
        </div>
        <div className="stat">
          <div className="label">Questions</div>
          <div className="value">{stats.questions.total}</div>
          <div className="sub">{stats.questions.active} active</div>
        </div>
      </div>
    </>
  );
}
