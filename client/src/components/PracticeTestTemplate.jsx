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

  function pick(qIndex, optIndex) {
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  }

  const answered = Object.keys(answers).length;
  const correct = Object.entries(answers).filter(([i, a]) => shuffledQuestions[i].correct === a).length;
  const allDone = answered === shuffledQuestions.length;

  function scoreLabel() {
    const pct = answered === 0 ? 0 : Math.round((correct / answered) * 100);
    if (answered === 0) return null;
    if (pct >= 80) return { text: 'Strong — keep it up', color: '#22c55e' };
    if (pct >= 70) return { text: 'Getting there — review explanations', color: '#f59e0b' };
    return { text: 'More practice needed', color: '#ef4444' };
  }
  const label = scoreLabel();

  const registerPath = `/register?plan=${planParam}`;

  return (
    <div className="lp">
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
          <Link to={registerPath} className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>Start Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 40px 70px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>
            {examBadge}
          </div>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 58px)', lineHeight: 1.1, marginBottom: 20 }}>
            {h1Line1} <span className="lp-accent">{h1Accent}</span>{h1Line2 ? <><br />{h1Line2}</> : null}
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            {heroSub}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#questions" className="lp-btn-hero">Take the Free Test ↓</a>
            <Link to={productPath} className="lp-btn-outline">Full {questionCount}+ Question Bank</Link>
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

                {/* Question header */}
                <div style={{ padding: '20px 24px 0', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', fontFamily: 'Share Tech Mono, monospace', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>Q{qi + 1}</span>
                  <span style={{ fontSize: 12, color: 'var(--lp-text3)', background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 6, flexShrink: 0, marginTop: 2 }}>{q.topic}</span>
                </div>
                <div style={{ padding: '12px 24px 16px' }}>
                  <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.6, margin: 0 }}>{q.q}</p>
                </div>

                {/* Options */}
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
                        bg = 'rgba(34,197,94,0.08)';
                        border = 'rgba(34,197,94,0.45)';
                        textColor = '#fff';
                        labelBg = 'rgba(34,197,94,0.2)';
                        labelColor = '#22c55e';
                      } else if (isPickedOpt) {
                        bg = 'rgba(239,68,68,0.08)';
                        border = 'rgba(239,68,68,0.45)';
                        textColor = '#fff';
                        labelBg = 'rgba(239,68,68,0.2)';
                        labelColor = '#ef4444';
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

                {/* Explanation */}
                {done && (
                  <div style={{ margin: '0 20px 20px', background: 'rgba(48,172,226,0.06)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 9, padding: '14px 18px' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 7 }}>EXPLANATION</div>
                    <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.75, margin: 0 }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Mid-quiz CTA after Q15 marker — handled via DOM position, shown after all Qs */}

          {/* FINAL SCORE */}
          {allDone && (
            <div className="fade-up" style={{ background: 'rgba(5,88,102,0.15)', border: '1px solid var(--lp-border2)', borderRadius: 16, padding: '40px 32px', textAlign: 'center', marginTop: 16 }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--lp-text3)', marginBottom: 8, letterSpacing: 1 }}>FINAL SCORE</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 72, fontWeight: 900, lineHeight: 1, color: label.color }}>{correct}<span style={{ fontSize: 36, color: 'var(--lp-text3)' }}>/{questions.length}</span></div>
              <div style={{ fontSize: 16, color: label.color, fontWeight: 600, marginBottom: 24 }}>{label.text}</div>
              {correct < questions.length * 0.8 ? (
                <>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
                    The real exam draws from {questionCount}+ questions — you need to have seen them all. Get the full bank with explanations for every question.
                  </p>
                  <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 36px' }}>Get Full {questionCount}+ Question Bank →</Link>
                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · {price}/month · Cancel anytime</div>
                </>
              ) : (
                <>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 28px' }}>
                    Solid start. But this was 30 questions — the real exam draws from {questionCount}+. Make sure you've seen every question in the bank.
                  </p>
                  <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 36px' }}>See the Full Question Bank →</Link>
                  <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · {price}/month · Cancel anytime</div>
                </>
              )}
            </div>
          )}

          {/* Inline mid-quiz CTA (shown when not all done yet) */}
          {!allDone && answered >= 10 && (
            <div style={{ background: 'rgba(48,172,226,0.05)', border: '1px solid rgba(48,172,226,0.2)', borderRadius: 12, padding: '24px 28px', margin: '8px 0 36px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 13, color: 'var(--lp-text3)' }}>You're using the 30-question sample. The full bank has {questionCount}+ questions.</div>
              <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 15, padding: '11px 28px' }}>Start Full Practice — {price}/month →</Link>
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
            Every question the FAA can ask — with full explanations, a timed simulator, and AI instructor support. {price}/month. Cancel the moment you pass.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to={registerPath} className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>Start 3 Days Free →</Link>
            <Link to={productPath} className="lp-btn-outline" style={{ fontSize: 15 }}>See What's Included</Link>
          </div>
          <div style={{ marginTop: 14, fontSize: 13, color: 'var(--lp-text3)' }}>No credit card required for free trial</div>
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
