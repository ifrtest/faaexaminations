// client/src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { users } from '../../api/client';
import { Spinner } from '../../components/ProtectedRoute';

const TARGET = 100; // email blast threshold

export default function AdminDashboard() {
  const [stats,      setStats]      = useState(null);
  const [emailCount, setEmailCount] = useState(null);
  const [err,        setErr]        = useState('');

  useEffect(() => {
    users.adminStats()
      .then(setStats)
      .catch((ex) => setErr(ex.response?.data?.error || 'Could not load stats.'));

    // Fetch email list count (just peek at the CSV headers)
    fetch('/api/users/admin/email-export', {
      headers: { Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
    })
      .then(r => r.text())
      .then(csv => {
        const lines = csv.trim().split('\n');
        setEmailCount(Math.max(0, lines.length - 1)); // subtract header row
      })
      .catch(() => {});
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

      {/* Email blast tracker */}
      <div className="card" style={{ marginTop: 24 }}>
        <div className="card-header">
          <div>
            <div className="card-title">Email List</div>
            <div className="card-sub">Registered users + verified cheat sheet leads (unsubscribed excluded)</div>
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: '2rem', fontWeight: 800 }}>{emailCount ?? '—'}</span>
              <span style={{ color: 'var(--muted)', fontSize: '.9rem', marginLeft: 8 }}>/ {TARGET} to blast</span>
            </div>
            <a
              href="/api/users/admin/email-export"
              download
              onClick={(e) => {
                // Inject auth token into the download
                e.preventDefault();
                fetch('/api/users/admin/email-export', {
                  headers: { Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
                })
                  .then(r => r.blob())
                  .then(blob => {
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `faaexaminations-emails-${new Date().toISOString().slice(0,10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  });
              }}
              style={{ background: emailCount >= TARGET ? 'var(--blue)' : 'var(--surface)', border: '1px solid var(--border)', color: emailCount >= TARGET ? '#fff' : 'var(--muted)', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontSize: '.88rem', fontWeight: 600, cursor: 'pointer' }}
            >
              ⬇ Download CSV
            </a>
          </div>
          <div style={{ background: 'var(--border)', borderRadius: 99, height: 8, overflow: 'hidden' }}>
            <div style={{ width: `${Math.min(100, ((emailCount || 0) / TARGET) * 100)}%`, height: '100%', background: emailCount >= TARGET ? '#16A34A' : 'var(--blue)', borderRadius: 99, transition: 'width .5s ease' }} />
          </div>
          <div style={{ fontSize: '.75rem', color: 'var(--muted)', marginTop: 6 }}>
            {emailCount >= TARGET ? '🎉 Ready to blast!' : `${TARGET - (emailCount || 0)} more emails until blast-ready`}
          </div>
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
