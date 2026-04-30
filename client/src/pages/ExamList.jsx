// client/src/pages/ExamList.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { quizzes as quizApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';

const PLAN_ACCESS = {
  par:    ['PAR'],
  ira:    ['IRA'],
  cax:    ['CAX'],
  uag:    ['UAG'],
  atp:    ['ATP'],
  bundle: ['PAR', 'IRA', 'CAX'],
  all:    ['PAR', 'IRA', 'CAX', 'UAG', 'ATP'],
};

const FREE_EXAMS = ['TRUST'];

const EXAM_PLAN = {
  PAR: 'par',
  IRA: 'ira',
  CAX: 'cax',
  UAG: 'uag',
  ATP: 'atp',
};

const EXAM_META = {
  PAR:   { label: 'Private Pilot',     short: 'Your first FAA written exam.',           color: '#0B3D91', img: '/plane-par-desktop.jpg',      imgPos: 'center 30%' },
  IRA:   { label: 'Instrument Rating', short: 'Required for IFR flying.',               color: '#0e4f8f', img: '/plane-ira.jpg',               imgPos: 'center 40%' },
  CAX:   { label: 'Commercial Pilot',  short: 'For professional-track pilots.',         color: '#0a3060', img: '/plane-cax-hero.jpg',          imgPos: 'center 35%' },
  UAG:   { label: 'Part 107 Drone',    short: 'Required to fly drones commercially.',   color: '#064e3b', img: '/drone-part107-hero.jpg',      imgPos: 'center 50%' },
  TRUST: { label: 'TRUST Safety Test', short: 'Required for hobbyist drone flyers.',    color: '#1e3a5f', img: '/drone-trust.png',             imgPos: 'center 50%' },
  ATP:   { label: 'Airline Transport', short: 'Required to fly for the airlines.',      color: '#3b2f5e', img: '/plane-atp.jpg',               imgPos: 'center 40%' },
};

export default function ExamList() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [exams, setExams]       = useState([]);
  const [selected, setSelected] = useState(params.get('exam') || null);
  const [topics, setTopics]     = useState([]);
  const [mode, setMode]         = useState('study');
  const [topicId, setTopicId]   = useState('');
  const [numQ, setNumQ]         = useState(200);
  const [err, setErr]           = useState('');
  const [starting, setStarting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    quizApi.exams()
      .then((d) => {
        setExams(d.exams || []);
        if (!selected && d.exams?.[0]) setSelected(d.exams[0].code);
      })
      .catch((e) => setErr(e.response?.data?.error || 'Could not load exams.'));

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
    if (FREE_EXAMS.includes(examCode)) return true;
    if (!subscription || subscription.status !== 'active') return false;
    const plan = subscription.plan;
    return plan && PLAN_ACCESS[plan]?.includes(examCode);
  };

  const isSubscribed = subscription?.status === 'active';

  const startCheckout = async (plan) => {
    setCheckoutLoading(true);
    try {
      const alreadySubscribed = subscription?.status === 'active';
      if (alreadySubscribed) {
        const res = await fetch('/api/stripe/upgrade', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (data.success) {
          setUpgrading(true);
          const token = localStorage.getItem('faa_token');
          const deadline = Date.now() + 30000;
          while (Date.now() < deadline) {
            await new Promise((r) => setTimeout(r, 1500));
            const r = await fetch('/api/stripe/plan', { headers: { Authorization: `Bearer ${token}` } });
            const d = await r.json();
            if (d.plan === plan) { window.location.href = '/dashboard?subscribed=1'; return; }
          }
          window.location.href = '/dashboard?subscribed=1';
        } else {
          setErr(data.error || 'Could not upgrade subscription.');
        }
      } else {
        const res = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('faa_token')}` },
          body: JSON.stringify({ plan }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else setErr(data.error || 'Could not start checkout.');
      }
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
      const { session } = await quizApi.start({ exam_code: selected, mode, num_questions: numQ, topic_id: topicId || undefined });
      navigate(`/quiz/${session.id}`);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not start exam.');
    } finally { setStarting(false); }
  };

  const startDemo = async () => {
    setErr(''); setStarting(true);
    try {
      const { session } = await quizApi.start({ exam_code: 'PAR', mode: 'study', demo: true });
      navigate(`/quiz/${session.id}`);
    } catch (ex) {
      setErr(ex.response?.data?.error || 'Could not start free sample.');
    } finally { setStarting(false); }
  };

  if (!exams.length && !err) return <div className="container page"><Spinner /></div>;

  // All exam cards including ATP coming-soon
  const allCards = [
    ...exams,
    ...(!exams.find((e) => e.code === 'ATP') ? [{ code: 'ATP', name: 'Airline Transport Pilot (ATP)', question_count: 1496, num_questions: 80, time_limit: 240, passing_score: 70, comingSoon: true }] : []),
  ];

  return (
    <div className="container page" style={{ paddingTop: 0 }}>

      {/* ── HERO BANNER ─────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #061529 0%, #0b2545 50%, #0d2e58 100%)',
        borderRadius: 18,
        padding: '36px 40px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 24,
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* background glow */}
        <div style={{
          position: 'absolute', top: -60, right: 200,
          width: 300, height: 300,
          background: 'radial-gradient(circle, rgba(48,172,226,.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* left: headline */}
        <div style={{ flex: '1 1 260px' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', color: '#30ace2', textTransform: 'uppercase', marginBottom: 8 }}>
            FAA Written Exam Prep
          </div>
          <h1 style={{ margin: '0 0 10px', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
            Choose Your Exam
          </h1>
          <p style={{ margin: 0, color: '#94b8d4', fontSize: '.95rem', maxWidth: 380 }}>
            Select a certificate below, pick your mode, and start practising. Pass your FAA written exam — first try.
          </p>
        </div>

        {/* right: free challenge card — only for non-subscribers */}
        {!isSubscribed && (
          <div style={{
            background: 'linear-gradient(135deg, #92400e 0%, #b45309 40%, #d97706 100%)',
            borderRadius: 14,
            padding: '22px 26px',
            flex: '0 0 auto',
            maxWidth: 320,
            width: '100%',
            boxShadow: '0 8px 32px rgba(217,119,6,.35)',
            position: 'relative',
          }}>
            <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>✈️</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>
              10-Question Free Challenge
            </div>
            <div style={{ fontSize: '.83rem', color: 'rgba(255,255,255,.8)', marginBottom: 16, lineHeight: 1.4 }}>
              No account needed. Try real PAR questions in Study Mode and see how you score.
            </div>
            <button
              onClick={startDemo}
              disabled={starting}
              style={{
                width: '100%',
                background: '#fff',
                color: '#92400e',
                border: 'none',
                borderRadius: 8,
                padding: '11px 0',
                fontWeight: 800,
                fontSize: '.95rem',
                cursor: 'pointer',
                letterSpacing: '.01em',
              }}>
              {starting ? 'Loading…' : 'Start Free Challenge →'}
            </button>
          </div>
        )}
      </div>

      {err && <div className="alert alert-err" style={{ marginBottom: 16 }}>{err}</div>}

      {upgrading && (
        <div style={{ background: '#0f1f35', border: '1px solid #1e3a5f', borderRadius: 10, padding: '20px 24px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Updating your plan…</div>
          <div style={{ fontSize: '.88rem', color: '#94b8d4' }}>Your payment is being confirmed. You'll be redirected in a moment.</div>
        </div>
      )}

      {/* ── TWO-COLUMN LAYOUT ───────────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)',
        gap: 20,
        alignItems: 'start',
      }}
        className="exam-layout"
      >

        {/* LEFT: exam selector */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#30ace2', marginBottom: 8, paddingLeft: 2 }}>
            Select a certificate
          </div>
          {allCards.map((e) => {
            const isActive = e.code === selected && !e.comingSoon;
            const meta = EXAM_META[e.code] || {};
            const free = FREE_EXAMS.includes(e.code);
            const accessible = hasAccess(e.code);
            return (
              <div
                key={e.code}
                onClick={() => !e.comingSoon && setSelected(e.code)}
                role={e.comingSoon ? 'presentation' : 'button'}
                tabIndex={e.comingSoon ? -1 : 0}
                onKeyDown={(ev) => ev.key === 'Enter' && !e.comingSoon && setSelected(e.code)}
                style={{
                  borderRadius: 12,
                  border: `2px solid ${isActive ? '#30ace2' : 'transparent'}`,
                  cursor: e.comingSoon ? 'default' : 'pointer',
                  opacity: e.comingSoon ? 0.55 : 1,
                  transition: 'border-color .15s, box-shadow .15s',
                  overflow: 'hidden',
                  position: 'relative',
                  height: 130,
                  boxShadow: isActive ? '0 0 0 3px rgba(48,172,226,.25)' : 'none',
                }}
              >
                {/* background image */}
                {meta.img && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${meta.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: meta.imgPos || 'center',
                    transition: 'transform .3s ease',
                  }} />
                )}
                {/* dark overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: isActive
                    ? 'linear-gradient(90deg, rgba(5,20,45,.75) 0%, rgba(11,40,90,.45) 100%)'
                    : 'linear-gradient(90deg, rgba(5,15,35,.80) 0%, rgba(5,15,35,.55) 100%)',
                  transition: 'background .2s',
                }} />

                {/* content */}
                <div style={{ position: 'relative', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, height: '100%', boxSizing: 'border-box' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <span style={{
                        background: isActive ? '#30ace2' : 'rgba(255,255,255,.18)',
                        color: '#fff', borderRadius: 5, padding: '1px 8px',
                        fontSize: '.68rem', fontWeight: 700, letterSpacing: '.05em',
                      }}>{e.code}</span>
                      {free && (
                        <span style={{ background: '#16a34a', color: '#fff', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>FREE</span>
                      )}
                      {!free && accessible && (
                        <span style={{ background: 'rgba(74,222,128,.18)', color: '#4ade80', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>UNLOCKED</span>
                      )}
                      {e.comingSoon && (
                        <span style={{ background: 'rgba(255,255,255,.12)', color: '#94a3b8', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>SOON</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: '.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meta.label || e.name}
                    </div>
                    <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)', marginTop: 2 }}>
                      {e.question_count} questions · {e.passing_score}% to pass
                    </div>
                  </div>

                  {isActive && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: configuration panel */}
        {current && (
          <div className="card" style={{ margin: 0, position: 'sticky', top: 20 }}>
            <div className="card-header">
              <div>
                <div className="card-title">Configure your {current.code} session</div>
                <div className="card-sub">Choose mode, number of questions, and (optionally) a topic.</div>
              </div>
            </div>

            <div className="field">
              <label>Mode</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <ModeOption
                  active={mode === 'study'} onClick={() => setMode('study')}
                  title="Study Mode"
                  desc="Unlimited time. See explanation after every answer."
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
                />
                <ModeOption
                  active={mode === 'exam'} onClick={() => setMode('exam')}
                  title="Exam Simulation"
                  desc="Timed. Explanations shown at the end. Just like the real thing."
                  icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>}
                />
              </div>
            </div>

            <div className="row-2">
              <div className="field">
                <label>Number of questions</label>
                <input type="number" min="1"
                       max={Math.max(1, Number(current.question_count) || 100)}
                       value={numQ} onChange={(e) => setNumQ(parseInt(e.target.value, 10) || 1)} />
                <div className="hint">
                  Up to {current.question_count} questions available. Real exam: {current.num_questions}.
                </div>
              </div>
              <div className="field">
                <label>Topic (optional)</label>
                <select value={topicId} onChange={(e) => setTopicId(e.target.value)}>
                  <option value="">All topics</option>
                  {topics.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.question_count})</option>
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
                <div className="alert" style={{ background: 'var(--panel2)', border: '1px solid var(--blue)', color: 'var(--text2)', marginBottom: 12, fontSize: '.9rem' }}>
                  A subscription is required for full access to {selected} practice exams.
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => startCheckout(EXAM_PLAN[selected])}
                  disabled={checkoutLoading}
                  style={{ marginBottom: 8 }}>
                  {checkoutLoading ? 'Loading…' : selected === 'UAG' ? 'Get Part 107 — $37.99 one-time' : `Subscribe to ${selected} — $24.99/month`}
                </button>
                {selected !== 'UAG' && (
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => startCheckout('bundle')}
                    disabled={checkoutLoading}>
                    {checkoutLoading ? 'Loading…' : 'Get All 3 Manned Exams (Bundle) — $39.99/month'}
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* mobile responsive override */}
      <style>{`
        @media (max-width: 700px) {
          .exam-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

function ModeOption({ active, title, desc, icon, onClick }) {
  return (
    <div className="choice" onClick={onClick}
         style={active ? { borderColor: 'var(--navy)', background: 'var(--sky-light)' } : { cursor: 'pointer' }}>
      <div className="letter" style={{ fontSize: 18, background: 'transparent', width: 32 }}>{icon}</div>
      <div className="text">
        <div style={{ fontWeight: 700, color: 'var(--ink)' }}>{title}</div>
        <div style={{ fontSize: '.85rem', color: 'var(--muted)' }}>{desc}</div>
      </div>
    </div>
  );
}
