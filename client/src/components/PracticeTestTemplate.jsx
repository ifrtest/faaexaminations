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

  // demo param drops new signups straight into the real QuizRunner
  const registerPath = `/register?demo=${planParam}`;

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

      {/* SCORE BAR */}
      {answered > 0 && (
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

          {shuffledQuestions.map((q, qi) => {
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

          {/* FINAL SCORE */}
          {allDone && (
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

          {/* Mid-quiz CTA — shown after Q10 if not done */}
          {!allDone && answered >= 10 && (
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
