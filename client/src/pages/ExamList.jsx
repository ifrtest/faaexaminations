// client/src/pages/ExamList.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { quizzes as quizApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';

const PLAN_ACCESS = {
  par:    ['PAR'],
  ira:    ['IRA'],
  cax:    ['CAX'],
  bundle: ['PAR', 'IRA', 'CAX'],
};

const EXAM_PLAN = {
  PAR: 'par',
  IRA: 'ira',
  CAX: 'cax',
};

const DESCRIPTIONS = {
  PAR: 'The Private Pilot Airplane knowledge test — your first FAA written exam.',
  IRA: 'The Instrument Rating knowledge test — required for IFR flying.',
  CAX: 'The Commercial Pilot Airplane knowledge test — for professional-track pilots.',
};

export default function ExamList() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [exams, setExams]       = useState([]);
  const [selected, setSelected] = useState(params.get('exam') || null);
  const [topics, setTopics]     = useState([]);
  const [mode, setMode]         = useState('exam');
  const [topicId, setTopicId]   = useState('');
  const [numQ, setNumQ]         = useState(60);
  const [err, setErr]           = useState('');
  const [starting, setStarting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    quizApi.exams()
      .then((d) => {
        setExams(d.exams || []);
        if (!selected && d.exams?.[0]) setSelected(d.exams[0].code);
      })
      .catch((e) => setErr(e.response?.data?.error || 'Could not load exams.'));

    // Fetch subscription status
    fetch('/api/stripe/subscription', {
      headers: { Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
    })
      .then((r) => r.json())
      .then((d) => setSubscription(d))
      .catch(() => {});
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!selected) return;
    setTopicId('');
    quizApi.topics(selected).then((d) => setTopics(d.topics || [])).catch(() => {});
    const exam = exams.find((e) => e.code === selected);
    if (exam) setNumQ(Math.min(exam.num_questions, Number(exam.question_count) || exam.num_questions));
  }, [selected, exams]);

  const current = exams.find((e) => e.code === selected);

  const hasAccess = (examCode) => {
    if (!subscription || subscription.status !== 'active') return false;
    const plan = subscription.plan;
    return plan && PLAN_ACCESS[plan]?.includes(examCode);
  };

  const startCheckout = async (plan) => {
    setCheckoutLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('faa_token')}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setErr(data.error || 'Could not start checkout.');
    } catch {
      setErr('Could not start checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const start = async () => {
    if (!selected) return;
    setErr(''); setStarting(true);
    try {
      const payload = {
        exam_code: selected, mode,
        num_questions: numQ,
        topic_id: topicId || undefined,
      };
      const { session } = await quizApi.start(payload);
      navigate(`/quiz/${session.id}`);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not start exam.');
    } finally { setStarting(false); }
  };

  if (!exams.length && !err) return <div className="container page"><Spinner /></div>;

  return (
    <div className="container page">
      <h1>Practice Exams</h1>
      <p style={{color:'var(--muted)'}}>Pick a certificate and a mode to begin.</p>
      {err && <div className="alert alert-err">{err}</div>}

      {/* Exam type picker */}
      <div className="exam-cards" style={{marginBottom:24}}>
        {exams.map((e) => {
          const isActive = e.code === selected;
          return (
            <div key={e.code}
                 className="exam-card"
                 style={isActive ? { borderColor: 'var(--navy)', boxShadow: '0 0 0 3px rgba(11,61,145,.12)' } : {}}
                 onClick={() => setSelected(e.code)}
                 role="button"
                 tabIndex={0}>
              <span className="tag">{e.code}</span>
              <h3>{e.name}</h3>
              <p style={{color:'var(--muted)',fontSize:'.9rem',margin:'0 0 14px'}}>
                {DESCRIPTIONS[e.code] || e.description}
              </p>
              <div style={{display:'flex',justifyContent:'space-between',fontSize:'.85rem',color:'var(--muted)'}}>
                <span>{e.question_count} questions</span>
                <span>{e.time_limit} min · {e.passing_score}% to pass</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mode + configuration */}
      {current && (
        <div className="card" style={{maxWidth:720,margin:'0 auto'}}>
          <div className="card-header">
            <div>
              <div className="card-title">Configure your {current.code} session</div>
              <div className="card-sub">Choose mode, number of questions, and (optionally) a topic.</div>
            </div>
          </div>

          <div className="field">
            <label>Mode</label>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <ModeOption
                active={mode === 'study'} onClick={() => setMode('study')}
                title="Study Mode"
                desc="Unlimited time. See explanation after every answer."
                icon="📚"
              />
              <ModeOption
                active={mode === 'exam'} onClick={() => setMode('exam')}
                title="Exam Simulation"
                desc="Timed. Explanations shown at the end. Just like the real thing."
                icon="⏱️"
              />
            </div>
          </div>

          <div className="row-2">
            <div className="field">
              <label>Number of questions</label>
              <input type="number" min="5"
                     max={Math.max(5, Number(current.question_count) || 100)}
                     value={numQ} onChange={(e) => setNumQ(parseInt(e.target.value, 10) || 5)} />
              <div className="hint">
                Up to {current.question_count} questions available.{' '}
                Real exam: {current.num_questions}.
              </div>
            </div>
            <div className="field">
              <label>Topic (optional)</label>
              <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                <option value="">All topics</option>
                {topics.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.question_count})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasAccess(selected) ? (
            <button className="btn btn-primary btn-block" onClick={start} disabled={starting}>
              {starting ? 'Preparing…' : `Start ${mode === 'exam' ? 'Exam' : 'Study Session'}`}
            </button>
          ) : (
            <div>
              <div className="alert" style={{background:'var(--panel2)',border:'1px solid var(--blue)',color:'var(--text2)',marginBottom:12,fontSize:'.9rem'}}>
                A subscription is required to access {selected} practice exams.
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => startCheckout(EXAM_PLAN[selected])}
                disabled={checkoutLoading}
                style={{marginBottom:8}}>
                {checkoutLoading ? 'Loading…' : `Subscribe to ${selected} — $24.99/month`}
              </button>
              <button
                className="btn btn-ghost btn-block"
                onClick={() => startCheckout('bundle')}
                disabled={checkoutLoading}>
                {checkoutLoading ? 'Loading…' : 'Get All 3 Exams (Bundle) — $39.99/month'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ModeOption({ active, title, desc, icon, onClick }) {
  return (
    <div className="choice" onClick={onClick}
         style={active ? { borderColor: 'var(--navy)', background: 'var(--sky-light)' } : { cursor: 'pointer' }}>
      <div className="letter" style={{fontSize:18,background:'transparent',width:32}}>{icon}</div>
      <div className="text">
        <div style={{fontWeight:700,color:'var(--ink)'}}>{title}</div>
        <div style={{fontSize:'.85rem',color:'var(--muted)'}}>{desc}</div>
      </div>
    </div>
  );
}
