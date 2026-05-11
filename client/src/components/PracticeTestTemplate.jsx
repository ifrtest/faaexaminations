import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function shuffleQuestion(q) {
  const indices = [0, 1, 2];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return {
    ...q,
    options: indices.map((i) => q.options[i]),
    correct: indices.indexOf(q.correct),
  };
}

export default function PracticeTestTemplate({
  seoTitle,
  seoDescription,
  canonicalPath,
  examBadge,
  examName,
  h1Line1,
  h1Accent,
  h1Line2,
  heroSub,
  productPath,
  planParam,
  price,
  questionCount,
  questions,
  faqs,
  relatedLinks,
  schemaFaqs,
}) {
  const [shuffledQuestions] = useState(() => questions.map(shuffleQuestion));
  const [answers, setAnswers] = useState({});
  const [counts, setCounts] = useState({ questions: 0, topics: 0 });
  const [quizMode, setQuizMode] = useState('study'); // 'study' | 'exam'
  // Exam mode state
  const [examIdx, setExamIdx] = useState(0);
  const [examAnswers, setExamAnswers] = useState({});  // { idx: optionIndex }
  const [examDone, setExamDone] = useState(false);
  const examCardRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.08 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Counting animation for hero stats
  useEffect(() => {
    const rawCount = parseInt((questionCount || '0').replace(/,/g, ''), 10);
    const targets = { questions: rawCount, topics: 11 };
    const steps = 60;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const t = step / steps;
      const ease = 1 - Math.pow(1 - t, 3);
      setCounts({
        questions: Math.round(ease * targets.questions),
        topics: Math.round(ease * targets.topics),
      });
      if (step >= steps) clearInterval(timer);
    }, 25);
    return () => clearInterval(timer);
  }, [questionCount]);

  function pick(qIndex, optIndex) {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(([i, a]) => shuffledQuestions[i].correct === a).length;
  const allDone = answered === shuffledQuestions.length;
  const scorePct = answered === 0 ? 0 : Math.round((correct / answered) * 100);

  function scoreLabel() {
    if (answered === 0) return null;
    if (scorePct >= 80) return { text: 'Strong — keep it up', color: '#22c55e' };
    if (scorePct >= 70) return { text: 'Getting there — review explanations', color: '#f59e0b' };
    return { text: 'More practice needed', color: '#ef4444' };
  }
  const label = scoreLabel();

  const registerPath = `/register?plan=${planParam}`;

  return (
    <div className="lp">
      {/* CSS ANIMATIONS */}
      <style>{`
        @keyframes radarRing {
          0%   { transform: scale(0.3); opacity: 0.5; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes radarSweep {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes shimmerBadge {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes statFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes guaranteePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.25); }
          50%       { box-shadow: 0 0 0 10px rgba(34,197,94,0); }
        }
        .radar-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid rgba(48,172,226,0.5);
          animation: radarRing 4s ease-out infinite;
          pointer-events: none;
        }
        .hero-stat {
          animation: statFadeUp 0.6s ease both;
        }
        .hero-stat:nth-child(1) { animation-delay: 0.8s; }
        .hero-stat:nth-child(2) { animation-delay: 1.0s; }
        .hero-stat:nth-child(3) { animation-delay: 1.2s; }
        .guarantee-badge {
          animation: guaranteePulse 2.5s ease-in-out infinite;
        }
        .badge-shimmer {
          background: linear-gradient(90deg,
            rgba(48,172,226,0.12) 0%,
            rgba(48,172,226,0.28) 40%,
            rgba(48,172,226,0.12) 100%);
          background-size: 200% auto;
          animation: shimmerBadge 2.5s linear infinite;
        }
      `}</style>

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://faaexaminations.com${canonicalPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://faaexaminations.com${canonicalPath}`} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: seoTitle,
          description: seoDescription,
          url: `https://faaexaminations.com${canonicalPath}`,
        })}</script>
        {schemaFaqs && schemaFaqs.length > 0 && (
          <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: schemaFaqs.map(f => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          })}</script>
        )}
      </Helmet>

      {/* NAV */}
      <nav className="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <Link to={productPath} className="lp-nav-link">Full {examName} Package</Link>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="lp-nav-link">Login</Link>
          <Link to={registerPath} className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>
            {planParam === 'uag' ? 'Get Access →' : 'Subscribe →'}
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '120px 40px 80px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>

        {/* Radar background */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          {/* Static concentric circles */}
          {[180, 300, 420, 540].map((size, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: '50%',
              border: '1px solid rgba(48,172,226,0.22)',
            }} />
          ))}
          {/* Animated pulse rings */}
          <div className="radar-ring" style={{ width: 300, height: 300, animationDelay: '0s' }} />
          <div className="radar-ring" style={{ width: 300, height: 300, animationDelay: '1.3s' }} />
          <div className="radar-ring" style={{ width: 300, height: 300, animationDelay: '2.6s' }} />
          {/* Sweep line */}
          <div style={{
            position: 'absolute',
            width: 260,
            height: 260,
            borderRadius: '50%',
            animation: 'radarSweep 6s linear infinite',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '50%',
              height: 1,
              transformOrigin: '0 50%',
              background: 'linear-gradient(90deg, rgba(48,172,226,0.4), transparent)',
            }} />
          </div>
        </div>

        {/* Hero content */}
        <div style={{ position: 'relative', maxWidth: 760, margin: '0 auto' }}>
          <div className="badge-shimmer lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24, borderRadius: 20, padding: '6px 16px' }}>
            {examBadge}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 58px)', lineHeight: 1.1, marginBottom: 20 }}>
            {h1Line1} <span className="lp-accent">{h1Accent}</span>{h1Line2 ? <><br />{h1Line2}</> : null}
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            {heroSub}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="#questions" className="lp-btn-hero">Take the Free Test ↓</a>
            <Link to={productPath} className="lp-btn-outline">Full {questionCount}+ Question Bank</Link>
          </div>

          {/* Counting stats */}
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', flexWrap: 'wrap', borderTop: '1px solid rgba(48,172,226,0.12)', paddingTop: 32 }}>
            {[
              { value: counts.questions.toLocaleString(), label: 'Total Questions' },
              { value: counts.topics, label: 'Official Topics' },
              { value: 'Full Refund', label: 'Pass Guarantee' },
            ].map((stat, i) => (
              <div key={i} className="hero-stat" style={{
                flex: '1 1 160px',
                padding: '0 24px',
                borderRight: i < 2 ? '1px solid rgba(48,172,226,0.12)' : 'none',
              }}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 40, fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 12, color: 'var(--lp-text3)', letterSpacing: 1, marginTop: 4, textTransform: 'uppercase' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCORE BAR — study mode only */}
      {quizMode === 'study' && answered > 0 && (
        <div style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,14,22,0.97)', borderBottom: '1px solid var(--lp-border)', padding: '12px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: 'var(--lp-text3)' }}>
            {answered}/{questions.length} answered
          </span>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 800, color: label.color }}>
            {correct}/{answered} correct
          </span>
          {label && (
            <span style={{ fontSize: 13, color: label.color, background: `${label.color}18`, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>
              {label.text}
            </span>
          )}
        </div>
      )}

      {/* QUESTIONS */}
      <section id="questions" style={{ padding: '60px 24px 80px', background: 'var(--lp-dark)' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>

          {/* Mode toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '6px', width: 'fit-content' }}>
            {[
              { key: 'study', label: '📖  Study Mode', desc: 'All questions — scroll & learn' },
              { key: 'exam',  label: '🎯  Exam Mode',  desc: 'One at a time — like the real test' },
            ].map(({ key, label, desc }) => (
              <button
                key={key}
                onClick={() => {
                  setQuizMode(key);
                  setExamIdx(0);
                  setExamAnswers({});
                  setExamDone(false);
                }}
                style={{
                  padding: '10px 22px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  background: quizMode === key ? 'rgba(48,172,226,0.18)' : 'transparent',
                  color: quizMode === key ? '#30ace2' : 'var(--lp-text3)',
                  fontWeight: quizMode === key ? 700 : 500,
                  fontSize: '.88rem',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                }}>
                {label}
                <div style={{ fontSize: '.72rem', fontWeight: 400, opacity: 0.7, marginTop: 2 }}>{desc}</div>
              </button>
            ))}
          </div>

          {/* ── EXAM MODE ── one question at a time */}
          {quizMode === 'exam' && (() => {
            const total = shuffledQuestions.length;
            const q = shuffledQuestions[examIdx];
            const picked = examAnswers[examIdx];
            const done = picked !== undefined;
            const isCorrect = picked === q.correct;
            const allAnswered = Object.keys(examAnswers).length === total;
            const correctCount = Object.entries(examAnswers).filter(([i, a]) => shuffledQuestions[+i].correct === a).length;
            const pct = allAnswered ? Math.round((correctCount / total) * 100) : 0;

            if (examDone) {
              // Results screen
              const scoreLabel2 = pct >= 80
                ? { text: 'Strong — keep it up', color: '#22c55e' }
                : pct >= 70
                  ? { text: 'Getting there — review explanations', color: '#f59e0b' }
                  : { text: 'More practice needed', color: '#ef4444' };
              return (
                <div>
                  {/* Per-question review */}
                  {shuffledQuestions.map((rq, ri) => {
                    const rpicked = examAnswers[ri];
                    const rcorrect = rpicked === rq.correct;
                    return (
                      <div key={ri} style={{ marginBottom: 16, background: 'var(--lp-charcoal)', border: `1px solid ${rcorrect ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)'}`, borderRadius: 14, overflow: 'hidden' }}>
                        <div style={{ padding: '16px 20px 12px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                          <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>Q{ri + 1}</span>
                          <span style={{ fontSize: 12, color: 'var(--lp-text3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>{rq.topic}</span>
                          <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: rcorrect ? '#22c55e' : '#ef4444', flexShrink: 0 }}>{rcorrect ? '✓ Correct' : '✗ Wrong'}</span>
                        </div>
                        <div style={{ padding: '0 20px 12px' }}>
                          <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, margin: '0 0 10px' }}>{rq.q}</p>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {rq.options.map((opt, oi) => {
                              const isCorrectOpt = oi === rq.correct;
                              const isPickedOpt = oi === rpicked;
                              return (
                                <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, background: isCorrectOpt ? 'rgba(34,197,94,0.08)' : (isPickedOpt && !isCorrectOpt) ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isCorrectOpt ? 'rgba(34,197,94,0.4)' : (isPickedOpt && !isCorrectOpt) ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}` }}>
                                  <span style={{ width: 24, height: 24, borderRadius: '50%', background: isCorrectOpt ? 'rgba(34,197,94,0.2)' : (isPickedOpt && !isCorrectOpt) ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)', color: isCorrectOpt ? '#22c55e' : (isPickedOpt && !isCorrectOpt) ? '#ef4444' : 'var(--lp-text3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                                    {String.fromCharCode(65 + oi)}
                                  </span>
                                  <span style={{ color: isCorrectOpt ? '#fff' : 'var(--lp-text2)', fontSize: 14 }}>{opt}</span>
                                </div>
                              );
                            })}
                          </div>
                          <div style={{ marginTop: 12, background: 'rgba(48,172,226,0.06)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 8, padding: '12px 16px' }}>
                            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 6 }}>EXPLANATION</div>
                            <p style={{ color: 'var(--lp-text)', fontSize: 13, lineHeight: 1.75, margin: 0 }}>{rq.explanation}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Score summary */}
                  <div style={{ borderRadius: 20, overflow: 'hidden', marginTop: 8 }}>
                    <div style={{ background: pct >= 80 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${pct >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderBottom: 'none', borderRadius: '20px 20px 0 0', padding: '40px 32px 32px', textAlign: 'center' }}>
                      <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)', marginBottom: 8, letterSpacing: 2 }}>FINAL SCORE</div>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 80, fontWeight: 900, lineHeight: 1, color: scoreLabel2.color }}>
                        {correctCount}<span style={{ fontSize: 40, color: 'var(--lp-text3)' }}>/{total}</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 700, color: scoreLabel2.color, marginTop: 4, marginBottom: 12, fontFamily: 'Barlow Condensed, sans-serif' }}>{pct}%</div>
                      <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, maxWidth: 520, margin: '0 auto', lineHeight: 1.4 }}>
                        {pct < 80 ? "You'd fail the real exam right now." : 'Good score — on 30 questions.'}
                      </p>
                    </div>
                    <div style={{ background: 'var(--lp-charcoal)', border: `1px solid ${pct >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderTop: 'none', borderRadius: '0 0 20px 20px', padding: '32px 32px 40px', textAlign: 'center' }}>
                      <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 28px' }}>
                        {pct < 80
                          ? `You missed ${total - correctCount} of ${total} — and this was only 30 of ${questionCount}+ possible questions. The questions you haven't studied will be on your test.`
                          : `Solid. But you just saw 30 of ${questionCount}+ questions — that's 2% of the bank. The real exam pulls 60 questions you've never seen.`}
                      </p>
                      {planParam !== 'uag' && (
                        <div className="guarantee-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 14, padding: '16px 24px', marginBottom: 28, maxWidth: 480, textAlign: 'left' }}>
                          <span style={{ fontSize: 28, flexShrink: 0 }}>🛡️</span>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', letterSpacing: 1, marginBottom: 3 }}>PASS GUARANTEE</div>
                            <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>Complete the full program and still fail your real FAA exam — we refund every dollar. <a href="/cancel-policy" style={{ color: 'var(--lp-accent)', textDecoration: 'none' }}>See terms →</a></div>
                          </div>
                        </div>
                      )}
                      <div style={{ marginBottom: 16 }}>
                        <Link to={`/register?plan=${planParam}`} className="lp-btn-hero" style={{ fontSize: 18, padding: '18px 40px', display: 'inline-block' }}>
                          {pct < 80 ? 'I Need to Pass — Fix This Now →' : 'Lock In That Score →'}
                        </Link>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--lp-text3)' }}>
                        {planParam === 'uag' ? `${price} one-time · Lifetime access` : `${price}/month · Pass guarantee · Cancel anytime`}
                      </div>
                      <button onClick={() => { setExamIdx(0); setExamAnswers({}); setExamDone(false); }} style={{ marginTop: 16, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--lp-text3)', borderRadius: 8, padding: '8px 20px', fontSize: '.82rem', cursor: 'pointer' }}>
                        Retake exam
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div ref={examCardRef}>
                {/* Progress bar */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)' }}>
                      Question {examIdx + 1} of {total}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--lp-text3)' }}>
                      {Object.keys(examAnswers).length} answered
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${((examIdx + 1) / total) * 100}%`, background: 'linear-gradient(90deg, #30ace2, #60c8f0)', borderRadius: 3, transition: 'width 0.3s ease' }} />
                  </div>
                </div>

                {/* Question card */}
                <div style={{ background: 'var(--lp-charcoal)', border: `1px solid ${done ? (isCorrect ? 'rgba(34,197,94,0.45)' : 'rgba(239,68,68,0.45)') : 'rgba(48,172,226,0.25)'}`, borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s', marginBottom: 16 }}>
                  <div style={{ padding: '20px 24px 0', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0 }}>Q{examIdx + 1}</span>
                    <span style={{ fontSize: 12, color: 'var(--lp-text3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6, flexShrink: 0 }}>{q.topic}</span>
                  </div>
                  <div style={{ padding: '14px 24px 20px' }}>
                    <p style={{ color: '#fff', fontSize: 17, fontWeight: 600, lineHeight: 1.65, margin: 0 }}>{q.q}</p>
                  </div>

                  <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {q.options.map((opt, oi) => {
                      const isCorrectOpt = oi === q.correct;
                      const isPickedOpt = oi === picked;
                      let bg = 'rgba(255,255,255,0.03)';
                      let border = 'rgba(255,255,255,0.1)';
                      let textColor = 'var(--lp-text2)';
                      let labelBg = 'rgba(255,255,255,0.08)';
                      let labelColor = 'var(--lp-text2)';
                      if (done) {
                        if (isCorrectOpt) { bg = 'rgba(34,197,94,0.09)'; border = 'rgba(34,197,94,0.5)'; textColor = '#fff'; labelBg = 'rgba(34,197,94,0.22)'; labelColor = '#22c55e'; }
                        else if (isPickedOpt) { bg = 'rgba(239,68,68,0.09)'; border = 'rgba(239,68,68,0.5)'; textColor = '#fff'; labelBg = 'rgba(239,68,68,0.22)'; labelColor = '#ef4444'; }
                      }
                      return (
                        <button
                          key={oi}
                          onClick={() => {
                            if (done) return;
                            setExamAnswers((prev) => ({ ...prev, [examIdx]: oi }));
                          }}
                          disabled={done}
                          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 10, border: `1px solid ${border}`, background: bg, cursor: done ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}
                          onMouseEnter={(e) => { if (!done) { e.currentTarget.style.background = 'rgba(48,172,226,0.07)'; e.currentTarget.style.borderColor = 'rgba(48,172,226,0.35)'; } }}
                          onMouseLeave={(e) => { if (!done) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}
                        >
                          <span style={{ width: 30, height: 30, borderRadius: '50%', background: labelBg, color: labelColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span style={{ color: textColor, fontSize: 15, lineHeight: 1.55 }}>{opt}</span>
                          {done && isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>✓ Correct</span>}
                          {done && isPickedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>✗ Wrong</span>}
                        </button>
                      );
                    })}
                  </div>

                  {done && (
                    <div style={{ margin: '0 20px 20px', background: 'rgba(48,172,226,0.06)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 10, padding: '14px 18px' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 7 }}>EXPLANATION</div>
                      <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{q.explanation}</p>
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setExamIdx((i) => Math.max(0, i - 1)); examCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    disabled={examIdx === 0}
                    style={{ padding: '11px 22px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: examIdx === 0 ? 'rgba(255,255,255,0.2)' : 'var(--lp-text2)', fontSize: '.9rem', cursor: examIdx === 0 ? 'default' : 'pointer' }}>
                    ← Back
                  </button>

                  {/* Dot nav */}
                  <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', justifyContent: 'center' }}>
                    {shuffledQuestions.map((_, di) => {
                      const answered = examAnswers[di] !== undefined;
                      const isCurrent = di === examIdx;
                      return (
                        <button
                          key={di}
                          onClick={() => { setExamIdx(di); examCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                          style={{ width: 10, height: 10, borderRadius: '50%', border: isCurrent ? '2px solid #30ace2' : 'none', background: isCurrent ? '#30ace2' : answered ? 'rgba(48,172,226,0.5)' : 'rgba(255,255,255,0.15)', padding: 0, cursor: 'pointer', transition: 'all 0.15s' }}
                          title={`Question ${di + 1}`}
                        />
                      );
                    })}
                  </div>

                  {examIdx < total - 1 ? (
                    <button
                      onClick={() => { setExamIdx((i) => i + 1); examCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                      style={{ padding: '11px 22px', borderRadius: 9, border: 'none', background: done ? '#30ace2' : 'rgba(48,172,226,0.2)', color: done ? '#fff' : 'rgba(48,172,226,0.6)', fontSize: '.9rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>
                      Next →
                    </button>
                  ) : (
                    <button
                      onClick={() => setExamDone(true)}
                      disabled={Object.keys(examAnswers).length < total}
                      style={{ padding: '11px 22px', borderRadius: 9, border: 'none', background: Object.keys(examAnswers).length === total ? '#22c55e' : 'rgba(34,197,94,0.15)', color: Object.keys(examAnswers).length === total ? '#041018' : 'rgba(34,197,94,0.4)', fontSize: '.9rem', fontWeight: 700, cursor: Object.keys(examAnswers).length === total ? 'pointer' : 'default', transition: 'all 0.2s' }}>
                      See Results →
                    </button>
                  )}
                </div>

                {/* Mid-quiz upsell */}
                {examIdx >= 9 && !done && (
                  <div style={{ background: 'rgba(48,172,226,0.05)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 12, padding: '20px 24px', marginTop: 24, textAlign: 'center' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 5 }}>You're using the 30-question sample.</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text3)', marginBottom: 14 }}>The real exam draws from {questionCount}+ questions. See every possible question before test day.</div>
                    <Link to={`/register?plan=${planParam}`} className="lp-btn-hero" style={{ fontSize: 14, padding: '10px 26px' }}>
                      {planParam === 'uag' ? `Get Full Bank — ${price} one-time →` : `Get Full Bank — ${price}/month →`}
                    </Link>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ── STUDY MODE ── all questions scrollable */}
          {quizMode === 'study' && shuffledQuestions.map((q, qi) => {
            const picked = answers[qi];
            const done = picked !== undefined;
            const isCorrect = picked === q.correct;

            return (
              <div key={qi} className="fade-up" style={{ marginBottom: 36, background: 'var(--lp-charcoal)', border: `1px solid ${done ? (isCorrect ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.35)') : 'var(--lp-border)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>

                <div style={{ padding: '20px 24px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>Q{qi + 1}</span>
                  <span style={{ fontSize: 12, color: 'var(--lp-text3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>{q.topic}</span>
                </div>
                <div style={{ padding: '12px 24px 16px' }}>
                  <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{q.q}</p>
                </div>

                <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oi) => {
                    const isCorrectOpt = oi === q.correct;
                    const isPickedOpt = oi === picked;
                    let bg = 'rgba(255,255,255,0.03)';
                    let border = 'var(--lp-border)';
                    let textColor = 'var(--lp-text2)';
                    let labelBg = 'rgba(255,255,255,0.08)';
                    let labelColor = 'var(--lp-text2)';

                    if (done) {
                      if (isCorrectOpt) {
                        bg = 'rgba(34,197,94,0.08)'; border = 'rgba(34,197,94,0.45)';
                        textColor = '#fff'; labelBg = 'rgba(34,197,94,0.2)'; labelColor = '#22c55e';
                      } else if (isPickedOpt) {
                        bg = 'rgba(239,68,68,0.08)'; border = 'rgba(239,68,68,0.45)';
                        textColor = '#fff'; labelBg = 'rgba(239,68,68,0.2)'; labelColor = '#ef4444';
                      }
                    }

                    return (
                      <button
                        key={oi}
                        onClick={() => pick(qi, oi)}
                        disabled={done}
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 9, border: `1px solid ${border}`, background: bg, cursor: done ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}
                        onMouseEnter={(e) => { if (!done) { e.currentTarget.style.background = 'rgba(48,172,226,0.06)'; e.currentTarget.style.borderColor = 'rgba(48,172,226,0.3)'; } }}
                        onMouseLeave={(e) => { if (!done) { e.currentTarget.style.background = bg; e.currentTarget.style.borderColor = border; } }}
                      >
                        <span style={{ width: 28, height: 28, borderRadius: '50%', background: labelBg, color: labelColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span style={{ color: textColor, fontSize: 15, lineHeight: 1.5 }}>{opt}</span>
                        {done && isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#22c55e', flexShrink: 0 }}>✓ Correct</span>}
                        {done && isPickedOpt && !isCorrectOpt && <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, color: '#ef4444', flexShrink: 0 }}>✗ Wrong</span>}
                      </button>
                    );
                  })}
                </div>

                {done && (
                  <div style={{ margin: '0 20px 20px', background: 'rgba(48,172,226,0.06)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 9, padding: '14px 18px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 7 }}>EXPLANATION</div>
                    <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* FINAL SCORE — study mode only */}
          {quizMode === 'study' && allDone && (
            <div className="fade-up" style={{ borderRadius: 20, overflow: 'hidden', marginTop: 16 }}>

              {/* Score header */}
              <div style={{ background: scorePct >= 80 ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${scorePct >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderBottom: 'none', borderRadius: '20px 20px 0 0', padding: '40px 32px 32px', textAlign: 'center' }}>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)', marginBottom: 8, letterSpacing: 2 }}>FINAL SCORE</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 80, fontWeight: 900, lineHeight: 1, color: label.color }}>
                  {correct}<span style={{ fontSize: 40, color: 'var(--lp-text3)' }}>/{questions.length}</span>
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: label.color, marginTop: 4, marginBottom: 12, fontFamily: 'Barlow Condensed, sans-serif' }}>
                  {scorePct}%
                </div>

                {scorePct < 80 ? (
                  <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, maxWidth: 520, margin: '0 auto', lineHeight: 1.4 }}>
                    You'd fail the real exam right now.
                  </p>
                ) : (
                  <p style={{ color: '#fff', fontSize: 20, fontWeight: 700, maxWidth: 520, margin: '0 auto', lineHeight: 1.4 }}>
                    Good score — on 30 questions.
                  </p>
                )}
              </div>

              {/* CTA block */}
              <div style={{ background: 'var(--lp-charcoal)', border: `1px solid ${scorePct >= 80 ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, borderTop: 'none', borderRadius: '0 0 20px 20px', padding: '32px 32px 40px', textAlign: 'center' }}>

                {scorePct < 80 ? (
                  <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 28px' }}>
                    You missed {answered - correct} of {questions.length} — and this was only 30 of {questionCount}+ possible questions. The FAA pulls from the entire bank. The questions you haven't studied <em>will</em> be on your test.
                  </p>
                ) : (
                  <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.8, maxWidth: 500, margin: '0 auto 28px' }}>
                    Solid. But you just saw 30 of {questionCount}+ questions — that's 2% of the bank. The real exam pulls 60 questions you've never seen. Don't let confidence cost you a retake.
                  </p>
                )}

                {/* Guarantee badge — PAR/IRA/CAX only, not Part 107 */}
                {planParam !== 'uag' && (
                  <div className="guarantee-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.35)', borderRadius: 14, padding: '16px 24px', marginBottom: 28, maxWidth: 480, textAlign: 'left' }}>
                    <span style={{ fontSize: 28, flexShrink: 0 }}>🛡️</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#22c55e', letterSpacing: 1, marginBottom: 3 }}>PASS GUARANTEE</div>
                      <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>Complete the full program and still fail your real FAA exam — we refund every dollar. <a href="/cancel-policy" style={{ color: 'var(--lp-accent)', textDecoration: 'none' }}>See terms →</a></div>
                    </div>
                  </div>
                )}

                <div style={{ marginBottom: 16 }}>
                  <Link
                    to={registerPath}
                    className="lp-btn-hero"
                    style={{ fontSize: 18, padding: '18px 40px', display: 'inline-block' }}
                  >
                    {scorePct < 80 ? 'I Need to Pass — Fix This Now →' : 'Lock In That Score →'}
                  </Link>
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text3)' }}>
                  {planParam === 'uag'
                    ? `${price} one-time · Lifetime access — no subscription`
                    : `${price}/month · Less than one flight lesson · Cancel the moment you pass`}
                </div>
              </div>
            </div>
          )}

          {/* Mid-quiz CTA — study mode, shown after Q10 if not done */}
          {quizMode === 'study' && !allDone && answered >= 10 && (
            <div style={{ background: 'rgba(48,172,226,0.05)', border: '1px solid rgba(48,172,226,0.25)', borderRadius: 14, padding: '28px 32px', margin: '8px 0 36px', textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                You're using the 30-question sample.
              </div>
              <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginBottom: 16 }}>
                The real exam draws from {questionCount}+ questions. See every possible question before test day.
              </div>
              <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 15, padding: '12px 30px' }}>
                {planParam === 'uag'
                  ? `Get Full ${questionCount}+ Question Bank — ${price} one-time →`
                  : `Get Full ${questionCount}+ Question Bank — ${price}/month →`}
              </Link>
              <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)' }}>
                {planParam === 'uag' ? 'Lifetime access — no subscription' : 'Pass guarantee · Cancel anytime'}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* RELATED LINKS */}
      {relatedLinks && relatedLinks.length > 0 && (
        <section style={{ padding: '50px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div className="lp-badge" style={{ marginBottom: 20 }}>RELATED RESOURCES</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {relatedLinks.map((l, i) => (
                <Link key={i} to={l.path} style={{ color: 'var(--lp-blue)', fontSize: 14, padding: '8px 16px', border: '1px solid rgba(48,172,226,0.3)', borderRadius: 8, textDecoration: 'none', background: 'rgba(48,172,226,0.05)' }}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && <FaqSection faqs={faqs} />}

      {/* FINAL CTA */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.15)', borderTop: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>THE REAL EXAM DRAWS FROM {questionCount}+ QUESTIONS</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 46px)', marginBottom: 16 }}>Ready to Study the Full Bank?</h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 17, lineHeight: 1.7, marginBottom: 36 }}>
            Every question the FAA can ask — with full explanations, a timed simulator, and AI instructor support.{' '}
            {planParam === 'uag' ? `${price} one-time. Lifetime access.` : `${price}/month. Cancel the moment you pass.`}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
            <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>
              {planParam === 'uag' ? `Get Full Access — ${price} →` : `Subscribe — ${price}/mo →`}
            </Link>
            <Link to={productPath} className="lp-btn-outline" style={{ fontSize: 15 }}>See What's Included</Link>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#22c55e' }}>
            <span>🛡️</span>
            <span>{planParam === 'uag' ? 'Lifetime access — no subscription' : 'Pass guarantee · Cancel anytime'}</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/" className="lp-nav-logo">FAA<span style={{ color: 'var(--lp-blue)' }}>Examinations</span>.com</Link>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {[['/', 'Home'], ['/par', 'Private Pilot'], ['/ira', 'Instrument Rating'], ['/cax', 'Commercial Pilot'], ['/part-107', 'Part 107'], ['/blog', 'Blog'], ['/about', 'About']].map(([to, label]) => (
            <Link key={to} to={to} style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <div style={{ color: 'var(--lp-text3)', fontSize: 12 }}>© 2026 FAAExaminations.com · All rights reserved</div>
      </footer>
    </div>
  );
}

function FaqSection({ faqs }) {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ padding: '80px 40px', background: 'var(--lp-dark)', borderTop: '1px solid var(--lp-border)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className="lp-badge" style={{ marginBottom: 16 }}>FAQ</div>
        <h2 style={{ marginBottom: 40 }}>Common Questions</h2>
        {faqs.map((f, i) => (
          <div key={i} style={{ borderBottom: '1px solid var(--lp-border)', padding: '22px 0' }}>
            <button onClick={() => setOpen(open === i ? null : i)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', gap: 16 }}>
              <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 16, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{f.q}</span>
              <span style={{ color: 'var(--lp-blue)', fontSize: 22, flexShrink: 0 }}>{open === i ? '−' : '+'}</span>
            </button>
            {open === i && <div style={{ marginTop: 14, color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.8 }}>{f.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
