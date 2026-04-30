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

  const { users: u, tests: t, questions: q, examStats } = stats;

  return (
    <>
      <div className="stat-grid">
        <div className="stat">
          <div className="label">Users</div>
          <div className="value">{u.total}</div>
          <div className="sub">{u.new_week} new this week</div>
        </div>
        <div className="stat">
          <div className="label">Pro users</div>
          <div className="value">{u.pro}</div>
          <div className="sub">Paid subscribers</div>
        </div>
        <div className="stat">
          <div className="label">Exams taken</div>
          <div className="value">{t.total}</div>
          <div className="sub">{t.passed} passed · avg {Number(t.avg_score).toFixed(1)}%</div>
        </div>
        <div className="stat">
          <div className="label">Questions</div>
          <div className="value">{q.total}</div>
          <div className="sub">{q.active} active</div>
        </div>
      </div>

      {examStats && examStats.length > 0 && (
        <div className="card" style={{marginTop:24}}>
          <div className="card-header">
            <div>
              <div className="card-title">Full Exams Completed</div>
              <div className="card-sub">All students — site-wide totals</div>
            </div>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:16,marginTop:8}}>
            {examStats.map((e) => {
              const passRate = e.total_completed > 0 ? Math.round((e.total_passed / e.total_completed) * 100) : 0;
              const color = passRate >= 75 ? '#16A34A' : passRate >= 50 ? '#F59E0B' : '#EF4444';
              return (
                <div key={e.code} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px'}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                    <span style={{background:'var(--navy)',color:'#fff',borderRadius:6,padding:'2px 9px',fontSize:'.72rem',fontWeight:700,letterSpacing:'.5px'}}>{e.code}</span>
                    <span style={{fontSize:'.85rem',color:'var(--muted)',fontWeight:500}}>{e.name}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Completed</span>
                    <strong style={{fontSize:'1.1rem'}}>{e.total_completed.toLocaleString()}</strong>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Passed</span>
                    <strong style={{color:'#16A34A'}}>{e.total_passed.toLocaleString()}</strong>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:10}}>
                    <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Avg score</span>
                    <strong>{Number(e.avg_score).toFixed(1)}%</strong>
                  </div>
                  <div style={{background:'var(--border)',borderRadius:99,height:6,overflow:'hidden'}}>
                    <div style={{width:`${passRate}%`,height:'100%',background:color,borderRadius:99,transition:'width .5s ease'}} />
                  </div>
                  <div style={{textAlign:'right',fontSize:'.75rem',color:color,fontWeight:700,marginTop:4}}>{passRate}% pass rate</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
