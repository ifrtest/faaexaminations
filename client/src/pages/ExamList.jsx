// client/src/pages/ExamList.jsx
const UAG_PROMO_ACTIVE = Date.now() < new Date('2026-06-01T04:00:00Z').getTime();
import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { quizzes as quizApi } from '../api/client';
import { Spinner } from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';

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

const EXAM_LANDING = {
  PAR: '/par#products',
  IRA: '/ira#products',
  CAX: '/cax#products',
  UAG: '/part-107#products',
};

const EXAM_META = {
  PAR:    { label: 'Private Pilot',        short: 'Your first FAA written exam.',          color: '#0B3D91', img: '/card-par.jpg',   imgPos: 'center 30%' },
  IRA:    { label: 'Instrument Rating',    short: 'Required for IFR flying.',              color: '#0e4f8f', img: '/card-ira.jpg',   imgPos: 'center 40%' },
  CAX:    { label: 'Commercial Pilot',     short: 'For professional-track pilots.',        color: '#0a3060', img: '/card-cax.jpg',   imgPos: 'center 35%' },
  UAG:    { label: 'Part 107 Drone',       short: 'Required to fly drones commercially.',  color: '#064e3b', img: '/card-uag.webp',  imgPos: 'center 50%' },
  TRUST:  { label: 'TRUST Safety Test',   short: 'Required for hobbyist drone flyers.',   color: '#1e3a5f', img: '/card-trust.jpg', imgPos: 'center 60%' },
  ATP:    { label: 'Airline Transport',    short: 'Required to fly for the airlines.',     color: '#3b2f5e', img: '/card-atp.jpg',   imgPos: 'center 40%' },
  BUNDLE: { label: 'PAR · IRA · CAX Bundle', short: 'All 3 manned aircraft exams — best value.', color: '#1a3a6b', img: '/card-par.jpg', imgPos: 'center 30%' },
};

export default function ExamList() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const autoBuyRef = useRef(location.state?.autoBuy || params.get('buy') || null);
  const [exams, setExams]       = useState([]);
  const [selected, setSelected] = useState(params.get('exam') || null);
  const [topics, setTopics]     = useState([]);
  const [mode, setMode]         = useState('study');
  const [topicId, setTopicId]   = useState('');
  const [numQ, setNumQ]         = useState(200);
  const [err, setErr]           = useState('');
  const [starting, setStarting] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [checkoutLoading] = useState(false);
  const [trialModalPlan, setTrialModalPlan] = useState(null);
  const [upgrading, setUpgrading] = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);
  const [activating, setActivating] = useState(false);
  const [activateErr, setActivateErr] = useState('');
  const configRef = useRef(null);

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

  useEffect(() => {
    if (params.get('subscribed') !== '1') return;
    setJustPurchased(true);
    const purchasedPlan = params.get('plan');
    const eid = params.get('eid');
    const sid = params.get('sid');
    const planPrices = { uag: 37.99, bundle: 39.99 };
    const value = planPrices[purchasedPlan] ?? 24.99;
    if (window.fbq) fbq('track', 'Purchase', { value, currency: 'USD', content_name: purchasedPlan || 'unknown', content_ids: [purchasedPlan || 'unknown'], content_type: 'product' }, eid ? { eventID: eid } : {});
    if (window.gtag) gtag('event', 'purchase', { currency: 'CAD', value });
    // Verify and grant access — retries for ~90s to survive a Render cold start
    if (sid) {
      const token = localStorage.getItem('faa_token');
      setActivating(true);
      const attempt = async (tries) => {
        if (tries <= 0) {
          setActivating(false);
          setActivateErr('Your payment was received — your account will be ready in 1–2 minutes. Please refresh the page. If it still shows no access after refreshing, email us at support@faaexaminations.com and we\'ll sort it out right away.');
          return;
        }
        try {
          const r = await fetch('/api/stripe/verify-checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ session_id: sid }),
          });
          const d = await r.json();
          console.log('[verify-checkout] attempt', 31 - tries, d);
          if (d.success) {
            const s = await fetch('/api/stripe/subscription', { headers: { Authorization: `Bearer ${token}` } });
            const sub = await s.json();
            setSubscription(sub);
            setActivating(false);
            return;
          }
          console.warn('[verify-checkout] not success:', d);
        } catch (ex) {
          console.warn('[verify-checkout] fetch error:', ex.message);
        }
        await new Promise((res) => setTimeout(res, 3000));
        await attempt(tries - 1);
      };
      attempt(30); // 30 × 3s = 90 seconds total
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!autoBuyRef.current || subscription === null) return;
    const plan = autoBuyRef.current;
    autoBuyRef.current = null;
    // Show trial confirmation modal instead of immediately redirecting
    setTrialModalPlan(plan);
  }, [subscription]); // eslint-disable-line

  const current = exams.find((e) => e.code === selected);

  const hasAccess = (examCode) => {
    if (FREE_EXAMS.includes(examCode)) return true;
    if (examCode === 'UAG') return subscription?.uag_access === true || subscription?.plan === 'all';
    if (!subscription || !['active', 'cancelling', 'trialing', 'past_due'].includes(subscription.status)) return false;
    const plan = subscription.plan;
    return plan && PLAN_ACCESS[plan]?.includes(examCode);
  };

  const isSubscribed = ['active', 'cancelling'].includes(subscription?.status);

  const startCheckout = (plan) => {
    navigate(`/checkout?plan=${plan}`);
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

  // Admins see ATP (coming soon); regular users see the Bundle offer instead
  const CARD_ORDER = isAdmin
    ? ['PAR', 'CAX', 'IRA', 'UAG', 'TRUST', 'ATP']
    : ['BUNDLE', 'PAR', 'CAX', 'IRA', 'UAG', 'TRUST'];
  const atpPlaceholder    = { code: 'ATP',    name: 'Airline Transport Pilot (ATP)',       question_count: 1496, num_questions: 80,  time_limit: 240, passing_score: 70, comingSoon: true };
  const bundlePlaceholder = { code: 'BUNDLE', name: 'PAR · IRA · CAX Bundle',             question_count: '',   num_questions: null, time_limit: null, passing_score: 70, isBundle: true };
  const allCards = CARD_ORDER.map((code) => {
    if (code === 'ATP')    return exams.find((e) => e.code === 'ATP') || atpPlaceholder;
    if (code === 'BUNDLE') return bundlePlaceholder;
    return exams.find((e) => e.code === code) || null;
  }).filter(Boolean);

  const PLAN_LABELS = { par: 'Private Pilot (PAR)', ira: 'Instrument Rating (IRA)', cax: 'Commercial Pilot (CAX)', bundle: 'All 3 Exams Bundle', uag: 'Part 107 Drone' };
  const PLAN_PRICES = { par: '$24.99/month', ira: '$24.99/month', cax: '$24.99/month', bundle: '$39.99/month', uag: UAG_PROMO_ACTIVE ? '$37.99 one-time' : '$57.99 one-time' };

  return (
    <div className="container page" style={{ paddingTop: 0 }}>

      {/* ── SUBSCRIPTION CONFIRMATION MODAL ─────────────────────────── */}
      {trialModalPlan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,10,20,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0f1822', border: '1px solid #1e2a38', borderRadius: 16, padding: '36px 32px', maxWidth: 460, width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✈️</div>
            <h2 style={{ color: '#fff', margin: '0 0 8px', fontSize: '1.4rem', fontWeight: 800 }}>Get Full Access</h2>
            <div style={{ color: '#30ace2', fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>{PLAN_LABELS[trialModalPlan]}</div>
            <div style={{ background: '#0a121b', borderRadius: 10, padding: '16px 20px', marginBottom: 24, textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2a38' }}>
                <span style={{ color: '#94b8d4' }}>Price</span>
                <span style={{ color: '#fff', fontWeight: 600 }}>{PLAN_PRICES[trialModalPlan]}</span>
              </div>
              {trialModalPlan !== 'uag' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e2a38' }}>
                  <Link to="/cancel-policy" style={{ color: '#94b8d4', textDecoration: 'underline', opacity: 0.85 }}>Pass guarantee</Link>
                  <span style={{ color: '#34d399', fontWeight: 600 }}>Complete program, fail exam — full refund</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#94b8d4' }}>{trialModalPlan === 'uag' ? 'Access' : 'Cancel'}</span>
                <span style={{ color: '#34d399', fontWeight: 600 }}>{trialModalPlan === 'uag' ? 'Lifetime — one-time payment' : 'Anytime — one click'}</span>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              style={{ fontSize: '1rem', padding: '14px 24px', marginBottom: 12 }}
              onClick={() => { setTrialModalPlan(null); startCheckout(trialModalPlan); }}
              disabled={checkoutLoading}>
              {checkoutLoading ? 'Loading…' : 'Enter Payment Info →'}
            </button>
            <button
              className="btn btn-ghost btn-block"
              style={{ fontSize: '.88rem' }}
              onClick={() => setTrialModalPlan(null)}>
              Not right now
            </button>
          </div>
        </div>
      )}

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

      </div>

      {subscription?.status === 'active' && subscription?.ends_at && (() => {
        const renewDate = new Date(subscription.ends_at);
        const endLabel = renewDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
        return (
          <div style={{ background: 'linear-gradient(90deg, #0c2a1a, #0d3520)', border: '1px solid rgba(52,211,153,0.35)', borderRadius: 12, padding: '16px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '.95rem', marginBottom: 3 }}>
                Subscription active
              </div>
              <div style={{ color: '#6ee7b7', fontSize: '.88rem' }}>
                Full access through <strong style={{ color: '#fff' }}>{endLabel}</strong>.
              </div>
            </div>
            <div style={{ fontSize: '.82rem', color: '#6ee7b7', flexShrink: 0 }}>Cancel from your account anytime →</div>
          </div>
        );
      })()}

      {/* Bundle upsell banner — single-plan paid users only */}
      {isSubscribed && ['par','ira','cax'].includes(subscription?.plan) && subscription?.status !== 'trialing' && (
        <div style={{ background: 'linear-gradient(90deg,#0a1a2e,#0c2240)', border: '1px solid rgba(48,172,226,0.35)', borderRadius: 12, padding: '16px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#30ace2', fontWeight: 700, fontSize: '.95rem', marginBottom: 3 }}>
              Save $35/month — upgrade to the Pilot Certificate Bundle
            </div>
            <div style={{ color: '#94b8d4', fontSize: '.88rem', lineHeight: 1.5 }}>
              You're on {subscription?.plan?.toUpperCase()}. PAR + IRA + CAX together is $39.99/month — less than two individual plans. Your current access carries over.
            </div>
          </div>
          <button
            className="btn btn-primary"
            style={{ flexShrink: 0, padding: '10px 20px', fontSize: '.9rem', whiteSpace: 'nowrap' }}
            onClick={() => startCheckout('bundle')}
            disabled={checkoutLoading}>
            {checkoutLoading ? 'Loading…' : 'Upgrade to Bundle →'}
          </button>
        </div>
      )}

      {activating && (
        <div style={{ background: '#0f1f35', border: '1px solid #1e3a5f', borderRadius: 12, padding: '16px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 20, height: 20, border: '3px solid #30ace2', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />
          <div style={{ color: '#94b8d4', fontSize: '.95rem' }}>Activating your access… please wait.</div>
        </div>
      )}

      {justPurchased && !activating && !activateErr && (
        <div style={{ background: 'linear-gradient(90deg, #064e3b, #065f46)', border: '1px solid #059669', borderRadius: 12, padding: '16px 22px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <div>
            <>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>Payment confirmed — you're all set!</div>
              <div style={{ color: '#6ee7b7', fontSize: '.88rem', marginTop: 3 }}>Your exam is now unlocked. Click the card below to start practising.</div>
            </>
          </div>
        </div>
      )}

      {activateErr && (
        <div style={{ background: '#1a0a0a', border: '1px solid #7f1d1d', borderRadius: 12, padding: '16px 22px', marginBottom: 20 }}>
          <div style={{ color: '#fca5a5', fontWeight: 700, marginBottom: 4 }}>Access activation failed</div>
          <div style={{ color: '#f87171', fontSize: '.88rem' }}>{activateErr}</div>
        </div>
      )}

      {err && <div className="alert alert-err" style={{ marginBottom: 16 }}>{err}</div>}

      {upgrading && (
        <div style={{ background: '#0f1f35', border: '1px solid #1e3a5f', borderRadius: 10, padding: '20px 24px', marginBottom: 24, textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Updating your plan…</div>
          <div style={{ fontSize: '.88rem', color: '#94b8d4' }}>Your payment is being confirmed. You'll be redirected in a moment.</div>
        </div>
      )}

      {/* ── CARDS GRID ───────────────────────────────────────────────── */}
      <div style={{ fontSize: '.8rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', color: '#30ace2', marginBottom: 12, paddingLeft: 2 }}>
        Select a certificate
      </div>
      <div className="exam-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>

          {allCards.map((e) => {
            const isActive = e.code === selected && !e.comingSoon && !e.isBundle;
            const meta = EXAM_META[e.code] || {};
            const free = FREE_EXAMS.includes(e.code);
            const accessible = hasAccess(e.code);
            const bundleOwned = e.isBundle && (subscription?.plan === 'bundle' || subscription?.plan === 'all');
            return (
              <div
                key={e.code}
                onClick={() => {
                  if (e.comingSoon) return;
                  if (e.isBundle) {
                    const bundleOwned = subscription?.plan === 'bundle' || subscription?.plan === 'all';
                    if (!bundleOwned) startCheckout('bundle');
                    return;
                  }
                  if (!accessible && !free) {
                    if (EXAM_PLAN[e.code]) {
                      // Already on an individual plan — select card so upgrade message shows in config panel
                      const needsUpgradePrompt = isSubscribed && e.code !== 'UAG' && subscription?.plan !== 'bundle' && subscription?.plan !== 'all' && subscription?.plan !== 'uag';
                      if (needsUpgradePrompt) {
                        setSelected(e.code);
                        setTimeout(() => configRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                      } else {
                        startCheckout(EXAM_PLAN[e.code]);
                      }
                    } else {
                      navigate(EXAM_LANDING[e.code] || '/exams');
                    }
                  } else {
                    setSelected(e.code);
                    setTimeout(() => configRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
                  }
                }}
                role={e.comingSoon ? 'presentation' : 'button'}
                tabIndex={e.comingSoon ? -1 : 0}
                onKeyDown={(ev) => {
                  if (ev.key !== 'Enter' || e.comingSoon) return;
                  if (!accessible && !free) navigate(EXAM_LANDING[e.code] || '/exams');
                  else { setSelected(e.code); setTimeout(() => configRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); }
                }}
                style={{
                  borderRadius: 12,
                  border: e.isBundle
                    ? `2px solid ${bundleOwned ? 'rgba(74,222,128,.5)' : 'rgba(247,201,72,.7)'}`
                    : `2px solid ${isActive ? '#30ace2' : (e.code === 'UAG' || e.code === 'IRA') ? 'rgba(255,255,255,0.25)' : 'transparent'}`,
                  cursor: e.comingSoon ? 'default' : 'pointer',
                  opacity: e.comingSoon ? 0.55 : 1,
                  transition: 'border-color .15s, box-shadow .15s',
                  overflow: 'hidden',
                  position: 'relative',
                  height: e.isBundle ? 150 : 130,
                  gridColumn: e.isBundle ? '1 / -1' : undefined,
                  boxShadow: e.isBundle && !bundleOwned
                    ? '0 0 0 3px rgba(247,201,72,.18), 0 4px 24px rgba(247,201,72,.12)'
                    : isActive ? '0 0 0 3px rgba(48,172,226,.25)' : 'none',
                  backgroundImage: meta.img ? `url(${meta.img})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: meta.imgPos || 'center',
                }}
              >
                {/* overlay — just enough for text legibility */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: e.isBundle
                    ? 'linear-gradient(90deg, rgba(5,15,35,.78) 0%, rgba(20,10,50,.45) 100%)'
                    : isActive
                      ? 'linear-gradient(90deg, rgba(5,20,45,.62) 0%, rgba(11,40,90,.30) 100%)'
                      : 'linear-gradient(90deg, rgba(5,15,35,.65) 0%, rgba(5,15,35,.38) 100%)',
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
                      {e.isBundle && bundleOwned && (
                        <span style={{ background: 'rgba(74,222,128,.18)', color: '#4ade80', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>OWNED</span>
                      )}
                      {e.isBundle && !bundleOwned && (
                        <span style={{ background: 'rgba(247,201,72,.25)', color: '#f7c948', borderRadius: 5, padding: '2px 9px', fontSize: '.7rem', fontWeight: 700, letterSpacing: '.04em' }}>🏆 MOST POPULAR</span>
                      )}
                      {!free && !e.isBundle && accessible && (
                        <span style={{ background: 'rgba(74,222,128,.18)', color: '#4ade80', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>UNLOCKED</span>
                      )}
                      {!free && !e.isBundle && !accessible && !e.comingSoon && (
                        <span style={{ background: 'rgba(255,255,255,.12)', color: '#fbbf24', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>🔒 SUBSCRIBE</span>
                      )}
                      {e.comingSoon && (
                        <span style={{ background: 'rgba(255,255,255,.12)', color: '#94a3b8', borderRadius: 5, padding: '1px 7px', fontSize: '.65rem', fontWeight: 700 }}>SOON</span>
                      )}
                    </div>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: e.isBundle ? '1.05rem' : '.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {meta.label || e.name}
                    </div>
                    <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.6)', marginTop: 2 }}>
                      {e.isBundle
                        ? <span>PAR + IRA + CAX · <span style={{ color: '#f7c948', fontWeight: 600 }}>$39.99/month</span> <span style={{ opacity: .7 }}>· save $35/month vs buying separately</span></span>
                        : e.code === 'UAG' && UAG_PROMO_ACTIVE
                          ? <span>{e.question_count} questions · <span style={{ color: '#fff', fontWeight: 700 }}>$37.99</span> <span style={{ textDecoration: 'line-through', opacity: .5 }}>$57.99</span> · <span style={{ color: '#a78bfa', fontWeight: 600 }}>intro price · rises June 1</span></span>
                          : `${e.question_count} questions · ${e.passing_score}% to pass`}
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

      {/* ── CHEAT SHEET RESOURCES ───────────────────────────────────── */}
      {(() => {
        const sub  = user?.subscription;
        const uag  = user?.uag_access;
        const sheets = [];
        if (['par', 'bundle', 'all', 'pro'].includes(sub))        sheets.push({ label: 'PAR Cheat Sheet',        url: '/par-cheat-sheet' });
        if (['ira', 'bundle', 'all', 'pro'].includes(sub))        sheets.push({ label: 'IRA Cheat Sheet',        url: '/ira-cheat-sheet' });
        if (['cax', 'bundle', 'all', 'pro'].includes(sub))        sheets.push({ label: 'CAX Cheat Sheet',        url: '/cax-cheat-sheet' });
        if (['uag', 'all', 'pro'].includes(sub) || uag)           sheets.push({ label: 'Part 107 Cheat Sheet',   url: '/part-107-cheat-sheet' });
        if (!sheets.length) return null;
        return (
          <div style={{ margin: '0 0 20px', padding: '14px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: '.85rem', color: 'var(--muted)', fontWeight: 600, marginRight: 4 }}>📋 Study References:</span>
            {sheets.map(s => (
              <span key={s.url} style={{ display: 'inline-flex', gap: 6 }}>
                <a href={s.url} target="_blank" rel="noreferrer" style={{ fontSize: '.83rem', color: 'var(--blue)', textDecoration: 'none', padding: '4px 10px', border: '1px solid rgba(48,172,226,0.3)', borderRadius: 6, background: 'rgba(48,172,226,0.06)' }}>
                  {s.label}
                </a>
                <a href={`${s.url}?print=1`} target="_blank" rel="noreferrer" title="Download PDF" style={{ fontSize: '.83rem', color: 'var(--muted)', textDecoration: 'none', padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6 }}>
                  PDF
                </a>
              </span>
            ))}
          </div>
        );
      })()}

      {/* ── CONFIG PANEL (below cards) ───────────────────────────────── */}
      {current && (
        <div ref={configRef} className="card" style={{ margin: 0 }}>
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
            ) : (isSubscribed && selected !== 'UAG' && subscription?.plan !== 'bundle' && subscription?.plan !== 'all' && subscription?.plan !== 'uag') ? (
              <div>
                <div style={{ background: 'rgba(234,179,8,.08)', border: '1px solid rgba(234,179,8,.45)', borderRadius: 10, padding: '16px 18px', marginBottom: 14 }}>
                  <div style={{ color: '#fde047', fontWeight: 700, fontSize: '.95rem', marginBottom: 6 }}>
                    You already have {subscription?.plan?.toUpperCase()} access.
                  </div>
                  <div style={{ color: '#fef9c3', fontSize: '.88rem', lineHeight: 1.6, opacity: .9 }}>
                    Instead of paying $24.99/month for each exam separately, the <strong style={{ color: '#fff' }}>Bundle gives you PAR + IRA + CAX for just $39.99/month</strong> — that's less than two individual plans ($49.98/month), and you get all three exams included.
                  </div>
                </div>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => startCheckout('bundle')}
                  disabled={checkoutLoading}>
                  {checkoutLoading ? 'Loading…' : 'Upgrade to Bundle — $39.99/month · PAR + IRA + CAX'}
                </button>
              </div>
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
                  {checkoutLoading ? 'Loading…' : selected === 'UAG' ? `Get Part 107 — ${UAG_PROMO_ACTIVE ? '$37.99' : '$57.99'} one-time${UAG_PROMO_ACTIVE ? ' · rises June 1' : ''}` : `Subscribe — ${selected} — $24.99/month`}
                </button>
                {selected !== 'UAG' && (
                  <button
                    className="btn btn-ghost btn-block"
                    onClick={() => startCheckout('bundle')}
                    disabled={checkoutLoading}>
                    {checkoutLoading ? 'Loading…' : 'Subscribe — Bundle (PAR + IRA + CAX) — $39.99/month'}
                  </button>
                )}
                {(selected === 'PAR' || selected === 'UAG') && (
                  <div style={{ textAlign: 'center', marginTop: 14 }}>
                    <Link
                      to={selected === 'UAG' ? '/part-107-practice-test' : '/par-practice-test'}
                      className="btn btn-ghost btn-block"
                      style={{ fontSize: '.88rem', opacity: 0.75 }}>
                      Try 30 free questions first →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      {/* ── FREE PRACTICE TESTS (free accounts only) ────────────────── */}
      {subscription !== null && !['active', 'cancelling', 'trialing'].includes(subscription?.status) && !subscription?.uag_access && (
        <div style={{ background: 'linear-gradient(90deg, #0b1f3a, #0d2849)', border: '1px solid rgba(48,172,226,0.3)', borderRadius: 12, padding: '20px 22px', marginTop: 24 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: '.95rem', marginBottom: 3 }}>Try before you subscribe</div>
            <div style={{ color: '#94b8d4', fontSize: '.88rem' }}>30 free questions for any exam — no credit card needed.</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 10 }}>
            {[
              { label: 'Private Pilot (PAR)', to: '/par-practice-test', plan: 'par', color: '#30ace2', price: '$24.99/mo' },
              { label: 'Instrument Rating (IRA)', to: '/ira-practice-test', plan: 'ira', color: '#a78bfa', price: '$24.99/mo' },
              { label: 'Commercial Pilot (CAX)', to: '/cax-practice-test', plan: 'cax', color: '#fb923c', price: '$24.99/mo' },
              { label: 'Part 107 Drone', to: '/part-107-practice-test', plan: 'uag', color: '#34d399', price: '$37.99' },
            ].map(({ label, to, plan, color, price }) => (
              <div
                key={plan}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${color}44`,
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 8,
                }}>
                <div>
                  <div style={{ color, fontWeight: 700, fontSize: '.78rem', marginBottom: 2 }}>FREE</div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '.85rem', lineHeight: 1.3 }}>{label}</div>
                </div>
                <Link
                  to={to}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.07)',
                    border: `1px solid ${color}55`,
                    borderRadius: 7,
                    padding: '7px 10px',
                    color: '#fff',
                    fontSize: '.78rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}>
                  30 free questions →
                </Link>
                <button
                  onClick={() => startCheckout(plan)}
                  disabled={checkoutLoading}
                  style={{
                    background: color,
                    border: 'none',
                    borderRadius: 7,
                    padding: '7px 10px',
                    color: plan === 'uag' ? '#041018' : '#fff',
                    fontSize: '.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}>
                  {checkoutLoading ? '…' : `Subscribe — ${price} →`}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* mobile: revert to single column — desktop-only change */}
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
