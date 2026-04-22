// client/src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, CartesianGrid, ReferenceLine,
} from 'recharts';
import { results as resultsApi, quizzes as quizApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/ProtectedRoute';

function ReadinessRing({ score = 0 }) {
  const size = 180;
  const stroke = 14;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;

  const color =
    score >= 85 ? '#F7C948' :
    score >= 70 ? '#3B82F6' :
    score >= 55 ? '#F59E0B' : '#EF4444';

  return (
    <div className="readiness-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
                stroke="rgba(255,255,255,.18)" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={radius} fill="none"
                stroke={color} strokeWidth={stroke} strokeLinecap="round"
                strokeDasharray={`${dash} ${circumference}`}
                transform={`rotate(-90 ${size/2} ${size/2})`}
                style={{ transition: 'stroke-dasharray .6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
        flexDirection: 'column', textAlign: 'center',
      }}>
        <div>
          <div style={{fontSize:'3rem',fontWeight:800,color:'#F7C948',lineHeight:1}}>{score}</div>
          <div style={{fontSize:'.75rem',letterSpacing:'.08em',opacity:.7,textTransform:'uppercase'}}>
            readiness
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData]   = useState(null);
  const [resume, setResume] = useState(null); // first in-progress session
  const [err, setErr]     = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [d, s] = await Promise.all([resultsApi.dashboard(), quizApi.mySessions()]);
        setData(d);
        const inProg = (s.sessions || []).find((x) => x.status === 'in_progress');
        if (inProg) setResume(inProg);
      } catch (ex) {
        setErr(ex.response?.data?.error || 'Could not load dashboard.');
      }
    })();
  }, []);

  if (err)  return <div className="container page"><div className="alert alert-err">{err}</div></div>;
  if (!data) return <div className="container page"><Spinner /></div>;

  const { totals, perExam, trend, weakTopics, readiness, examStats } = data;

  const chartData = (trend || []).map((t, i) => ({
    n: `#${i + 1}`,
    score: Number(t.score),
    exam: t.exam_code,
  }));

  return (
    <div className="container page">
      <div className="dash-header">
        <div>
          <h1 style={{marginBottom:4}}>Hi, {user?.full_name?.split(' ')[0] || 'pilot'} 👋</h1>
          <p style={{color:'var(--muted)',margin:0}}>Here's where you stand in your FAA exam prep.</p>
        </div>
        <Link to="/exams" className="btn btn-primary">Start new exam</Link>
      </div>

      {resume && (
        <div className="alert alert-info" style={{alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap',marginBottom:4}}>
              <span style={{
                background:'var(--blue)',color:'#fff',padding:'2px 8px',
                borderRadius:6,fontSize:'.72rem',fontWeight:700,letterSpacing:'.5px',
              }}>
                {resume.exam_code}
              </span>
              <strong style={{fontSize:'.95rem'}}>
                {resume.topic_name || 'Full practice exam'}
              </strong>
              <span style={{
                marginLeft:4,padding:'2px 8px',borderRadius:6,
                background:'rgba(245,166,35,.15)',color:'var(--amber)',
                fontSize:'.72rem',fontWeight:600,textTransform:'uppercase',letterSpacing:'.5px',
              }}>
                {resume.mode === 'exam' ? 'Exam' : 'Study'}
              </span>
            </div>
            <div style={{fontSize:'.88rem'}}>
              In progress — <strong>question {resume.current_index + 1} of {resume.question_ids.length}</strong>
            </div>
          </div>
          <Link to={`/quiz/${resume.id}`} className="btn btn-primary btn-sm">Resume</Link>
        </div>
      )}

      {/* ---------- stat tiles ---------- */}
      <div className="stat-grid">
        <div className="stat">
          <div className="label">Tests taken</div>
          <div className="value">{totals.total_tests}</div>
          <div className="sub">Total attempts</div>
        </div>
        <div className="stat">
          <div className="label">Average score</div>
          <div className="value">{Number(totals.overall_avg).toFixed(1)}%</div>
          <div className="sub">All exams combined</div>
        </div>
        <div className="stat">
          <div className="label">Questions answered</div>
          <div className="value">{totals.total_questions_answered}</div>
          <div className="sub">{totals.total_correct} correct</div>
        </div>
        <div className="stat">
          <div className="label">Readiness</div>
          <div className="value" style={{color:'var(--navy)'}}>{readiness.score}</div>
          <div className="sub">{readiness.label}</div>
        </div>
      </div>

      {/* ---------- readiness card + trend ---------- */}
      <div className="dash-grid">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Score trend</div>
              <div className="card-sub">Your last {chartData.length} exams</div>
            </div>
          </div>
          {chartData.length === 0 ? (
            <div className="empty">
              <div className="icon">📈</div>
              <div>No exam history yet.</div>
              <Link to="/exams" className="btn btn-primary" style={{marginTop:10}}>Take your first exam</Link>
            </div>
          ) : (
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="n" stroke="#64748B" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="#64748B" fontSize={12} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }}
                    formatter={(v, _n, p) => [`${v}%`, p?.payload?.exam || 'Score']}
                  />
                  <ReferenceLine y={70} stroke="#F7C948" strokeDasharray="4 4"
                                 label={{ value: 'Passing', position: 'insideRight', fill: '#D4A017', fontSize: 11 }} />
                  <Line type="monotone" dataKey="score" stroke="#0B3D91" strokeWidth={3}
                        dot={{ r: 4, fill: '#0B3D91' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card readiness">
          <div style={{textAlign:'center'}}>
            <ReadinessRing score={readiness.score} />
            <div className="label">{readiness.label}</div>
            <div className="advice">{readiness.advice}</div>
            <div className="conf">Confidence: {readiness.confidence}</div>
          </div>
          <hr style={{border:0,borderTop:'1px solid rgba(255,255,255,.15)',margin:'18px 0'}} />
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem'}}>
            <span>Recent avg</span>
            <strong>{readiness.breakdown?.recent_avg}%</strong>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',marginTop:4}}>
            <span>Coverage bonus</span>
            <strong>+{readiness.breakdown?.coverage}</strong>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',marginTop:4}}>
            <span>Weak topic penalty</span>
            <strong>−{readiness.breakdown?.weak_penalty}</strong>
          </div>
        </div>
      </div>

      {/* ---------- per-exam + weak topics ---------- */}
      <div className="dash-grid" style={{marginTop:20}}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Performance by exam</div>
          </div>
          <table className="data">
            <thead>
              <tr>
                <th>Exam</th>
                <th>Attempts</th>
                <th>Avg</th>
                <th>Best</th>
                <th>Passes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {perExam.map((e) => (
                <tr key={e.code}>
                  <td>
                    <strong>{e.code}</strong>
                    <div style={{color:'var(--muted)',fontSize:'.82rem'}}>{e.name}</div>
                  </td>
                  <td>{e.attempts}</td>
                  <td>{Number(e.avg_score).toFixed(1)}%</td>
                  <td>{Number(e.best_score).toFixed(1)}%</td>
                  <td>{e.passes}</td>
                  <td><Link className="btn btn-ghost btn-sm" to={`/exams?exam=${e.code}`}>Practice</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Weak topics</div>
          </div>
          {weakTopics.length === 0 ? (
            <div className="empty" style={{padding:20}}>
              <div>Take more exams to identify weak topics.</div>
            </div>
          ) : (
            weakTopics.map((t) => (
              <div key={t.topic} className="weak-topic-row">
                <div style={{flex:1}}>
                  <div className="name">{t.topic}</div>
                  <div className="bar"><div style={{width:`${t.accuracy}%`,
                    background: t.accuracy < 60 ? '#EF4444' : t.accuracy < 75 ? '#F59E0B' : '#16A34A'}} /></div>
                </div>
                <div className="acc" style={{marginLeft:12}}>
                  <strong style={{color:'var(--ink)'}}>{t.accuracy}%</strong>
                  <div style={{fontSize:'.75rem'}}>{t.correct}/{t.total}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ---------- full exams completed (site-wide) ---------- */}
      {examStats && (
        <div className="card" style={{marginTop:20}}>
          <div className="card-header">
            <div>
              <div className="card-title">Full Exams Completed</div>
              <div className="card-sub">All students — site-wide totals</div>
            </div>
          </div>
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',
            gap:16, marginTop:8,
          }}>
            {examStats.map((e) => {
              const passRate = e.total_completed > 0
                ? Math.round((e.total_passed / e.total_completed) * 100)
                : 0;
              const color = passRate >= 75 ? '#16A34A' : passRate >= 50 ? '#F59E0B' : '#EF4444';
              return (
                <div key={e.code} style={{
                  background:'var(--surface)',
                  border:'1px solid var(--border)',
                  borderRadius:12,
                  padding:'18px 20px',
                }}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                    <span style={{
                      background:'var(--navy)',color:'#fff',
                      borderRadius:6,padding:'2px 9px',
                      fontSize:'.72rem',fontWeight:700,letterSpacing:'.5px',
                    }}>{e.code}</span>
                    <span style={{fontSize:'.85rem',color:'var(--muted)',fontWeight:500}}>{e.name}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
                    <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Exams completed</span>
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
                    <div style={{
                      width:`${passRate}%`,height:'100%',
                      background:color,borderRadius:99,
                      transition:'width .5s ease',
                    }} />
                  </div>
                  <div style={{
                    textAlign:'right',fontSize:'.75rem',
                    color:color,fontWeight:700,marginTop:4,
                  }}>{passRate}% pass rate</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
