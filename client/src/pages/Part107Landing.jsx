import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const LETTERS = ['A', 'B', 'C', 'D'];

function Part107Demo() {
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx]             = useState(0);
  const [selected, setSelected]   = useState({});
  const [revealed, setRevealed]   = useState({});
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [started, setStarted]     = useState(false);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/demo/part107');
      const data = await res.json();
      if (!data.questions?.length) throw new Error('No questions returned');
      setQuestions(data.questions);
      setIdx(0);
      setSelected({});
      setRevealed({});
      setStarted(true);
    } catch {
      setError('Could not load questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const q = questions[idx];
  const total = questions.length;
  const isRevealed = q && revealed[q.id];
  const chosen = q && selected[q.id];
  const score = Object.keys(revealed).filter(id => selected[id] === questions.find(q => q.id === parseInt(id))?.correct_answer).length;
  const done = started && idx >= total;

  const choose = (letter) => {
    if (isRevealed) return;
    setSelected(s => ({ ...s, [q.id]: letter }));
    setRevealed(r => ({ ...r, [q.id]: true }));
  };

  const next = () => setIdx(i => i + 1);

  if (!started) {
    return (
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">TRY IT FREE</div>
          <h2>Test Yourself — No Account Needed</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 40px' }}>5 real Part 107 questions from the FAA question bank. See exactly what you'll be studying.</p>
          <button onClick={load} disabled={loading} className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 44px', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Loading…' : '▶  Start 5 Free Questions'}
          </button>
          {error && <p style={{ color: '#EF4444', marginTop: 16, fontSize: 14 }}>{error}</p>}
        </div>
      </section>
    );
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    const color = pct >= 70 ? '#22c55e' : pct >= 50 ? '#F59E0B' : '#EF4444';
    return (
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-inner" style={{ textAlign: 'center', maxWidth: 560 }}>
          <div className="lp-badge">RESULTS</div>
          <div style={{ fontSize: 72, fontWeight: 900, color, fontFamily: 'Barlow Condensed, sans-serif', lineHeight: 1, marginBottom: 8 }}>{score}/{total}</div>
          <div style={{ fontSize: 22, color: '#fff', fontWeight: 700, marginBottom: 16 }}>
            {pct >= 70 ? 'Great start!' : pct >= 50 ? 'Room to improve.' : 'More practice needed.'}
          </div>
          <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
            The real Part 107 exam has 60 questions drawn from a 265-question bank. You need 70% to pass. Get access to the full question bank, timed simulator, and AI instructor.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>Get Full Access — $37.99</Link>
            <button onClick={load} style={{ background: 'none', border: '1px solid var(--lp-border)', color: 'var(--lp-text2)', padding: '16px 28px', borderRadius: 10, fontSize: 15, cursor: 'pointer' }}>Try 5 More Questions</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }}>
      <div className="lp-section-inner" style={{ maxWidth: 720 }}>
        <div className="lp-badge">TRY IT FREE</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <h2 style={{ margin: 0 }}>Question {idx + 1} of {total}</h2>
          <div style={{ height: 6, flex: 1, minWidth: 120, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((idx) / total) * 100}%`, background: 'var(--lp-blue)', borderRadius: 3, transition: 'width .3s' }} />
          </div>
        </div>

        <div style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px', marginBottom: 16 }}>
          {q.topic_name && (
            <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, display: 'inline-block', marginBottom: 16 }}>📘 {q.topic_name}</span>
          )}
          <p style={{ color: '#fff', fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 24 }} dangerouslySetInnerHTML={{ __html: q.question_text }} />

          {LETTERS.map((l) => {
            const text = q[`choice_${l.toLowerCase()}`];
            if (!text) return null;
            const isCorrect = l === q.correct_answer;
            const isChosen = chosen === l;
            let bg = 'rgba(255,255,255,0.03)';
            let border = 'var(--lp-border)';
            let labelBg = 'rgba(255,255,255,0.08)';
            let labelColor = 'var(--lp-text2)';
            if (isRevealed) {
              if (isCorrect) { bg = 'rgba(34,197,94,0.1)'; border = 'rgba(34,197,94,0.5)'; labelBg = '#22c55e'; labelColor = '#fff'; }
              else if (isChosen) { bg = 'rgba(239,68,68,0.1)'; border = 'rgba(239,68,68,0.5)'; labelBg = '#EF4444'; labelColor = '#fff'; }
            } else if (isChosen) {
              bg = 'rgba(48,172,226,0.08)'; border = 'rgba(48,172,226,0.5)'; labelBg = 'var(--lp-blue)'; labelColor = '#fff';
            }
            return (
              <div key={l} onClick={() => choose(l)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 8, marginBottom: 8, border: `1px solid ${border}`, background: bg, cursor: isRevealed ? 'default' : 'pointer', transition: 'all .15s' }}>
                <span style={{ width: 28, height: 28, borderRadius: '50%', background: labelBg, color: labelColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{l}</span>
                <span style={{ color: isRevealed && isCorrect ? '#fff' : 'var(--lp-text)', fontSize: 14, flex: 1 }}>{text}</span>
                {isRevealed && isCorrect && <span style={{ color: '#22c55e', fontSize: 13, fontWeight: 700 }}>✓ Correct</span>}
                {isRevealed && isChosen && !isCorrect && <span style={{ color: '#EF4444', fontSize: 13, fontWeight: 700 }}>✗</span>}
              </div>
            );
          })}
        </div>

        {isRevealed && q.explanation && (
          <div style={{ background: 'rgba(48,172,226,0.08)', border: '1px solid rgba(48,172,226,0.25)', borderRadius: 10, padding: '16px 18px', marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 8 }}>EXPLANATION</div>
            <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{q.explanation}</p>
          </div>
        )}

        {isRevealed && (
          <div style={{ textAlign: 'right' }}>
            <button onClick={next} className="lp-btn-hero" style={{ border: 'none', cursor: 'pointer', fontSize: 15, padding: '13px 32px' }}>
              {idx + 1 < total ? 'Next Question →' : 'See My Results →'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

const TOPICS = [
  'FAA Regulations (Part 107)',
  'Airspace Classification & Restrictions',
  'Weather & Meteorology',
  'Loading & Performance',
  'Emergency Procedures',
  'Radio Communications',
  'Airport Operations',
  'Crew Resource Management',
  'Physiological Factors',
  'Night Operations',
  'Aviation Safety',
];

const FAQS = [
  {
    q: 'What is the Part 107 Remote Pilot Certificate?',
    a: 'It\'s the FAA license required to fly drones commercially. If you\'re getting paid to fly — shooting real estate, weddings, inspections, events — you legally need a Part 107 certificate. The knowledge test is the only exam required.',
  },
  {
    q: 'How many questions are on the Part 107 knowledge test?',
    a: '60 questions. You need a score of 70% or higher to pass. The test covers airspace, weather, regulations, and drone operations.',
  },
  {
    q: 'How long does it take to study for Part 107?',
    a: 'Most people pass in 2–3 weeks of focused study. You don\'t need any prior aviation experience. Our question bank walks you through everything from scratch.',
  },
  {
    q: 'Do I need a pilot\'s license to take the Part 107 test?',
    a: 'No. Part 107 is a separate certificate specifically for drone operators. You don\'t need any existing pilot certificates or flight hours. Anyone 16 or older can take the test.',
  },
  {
    q: 'Is this a one-time payment?',
    a: 'Yes. $37.99 one time — no subscription, no recurring charges. Pay once and you have lifetime access to the full question bank, timed simulator, and AI instructor.',
  },
];

export default function Part107Landing() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp">
      <Helmet>
        <title>FAA Part 107 Drone Test Prep — Get Licensed to Fly Commercially | FAAExaminations.com</title>
        <meta name="description" content="Pass your FAA Part 107 Remote Pilot knowledge test and get licensed to fly drones commercially. Practice questions, timed simulator, AI support. $37.99 one-time. Lifetime access." />
        <link rel="canonical" href="https://faaexaminations.com/part-107" />
      </Helmet>

      {/* NAV */}
      <nav className="lp-nav" id="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <a href="#includes" className="lp-nav-link">What's Included</a>
          <a href="#topics" className="lp-nav-link">Topics</a>
          <a href="#pricing" className="lp-nav-link">Pricing</a>
          <a href="#faq" className="lp-nav-link">FAQ</a>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <Link to="/dashboard" className="lp-nav-cta">Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" className="lp-nav-link">Login</Link>
              <Link to="/register" className="lp-nav-cta">Start Free →</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero" style={{ backgroundImage: 'url(/part-107-drone-license-faa-remote-pilot.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.42) 0%,rgba(8,14,20,0.38) 55%,rgba(8,14,20,0.18) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
            PART 107 · FAA REMOTE PILOT CERTIFICATION · 2026
          </div>
          <h1>Get <span className="lp-accent">Licensed</span> to Fly<br />Your Drone<br />Commercially</h1>
          <p className="lp-hero-sub">
            One FAA exam stands between you and legal paid drone work. Practice questions, timed simulator, and AI support — everything you need to pass Part 107 in 2–3 weeks.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-btn-hero">
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Start Free Today
            </Link>
            <a href="#includes" className="lp-btn-outline">See What's Included</a>
          </div>
          <div style={{ fontSize: 16, color: '#fff', marginTop: 18, lineHeight: 2, letterSpacing: 0.3 }}>
            265 practice questions &nbsp;·&nbsp; $37.99 one-time &nbsp;·&nbsp; <strong style={{ color: '#f5c842', fontSize: 17, fontWeight: 800, letterSpacing: 0.5 }}>✦ LIFETIME ACCESS</strong>
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">265</div><div className="lp-hs-lbl">Practice Questions</div></div>
            <div><div className="lp-hs-val">2–3</div><div className="lp-hs-lbl">Weeks to Pass</div></div>
            <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
            <div><div className="lp-hs-val">NONE</div><div className="lp-hs-lbl">Prior Experience Needed</div></div>
          </div>
        </div>
      </section>

      {/* FREE DEMO */}
      <Part107Demo />

      {/* PRICING */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }} id="pricing">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>One price. Everything included. <strong style={{ color: '#f5c842' }}>Lifetime access.</strong></p>
          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 2–3 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Part 107 Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$37.99</div>
            <div style={{ fontSize: 14, marginBottom: 36 }}>
              <span style={{ color: 'var(--lp-text3)' }}>one-time · </span>
              <strong style={{ color: '#f5c842', fontWeight: 800 }}>LIFETIME ACCESS</strong>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {['265 practice questions', 'Airspace & LAANC authorization coverage', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI instructor support', 'All FAA Part 107 references included', 'No aviation experience required', 'Pay once — access forever'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Start Studying Part 107 Now</Link>
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--lp-text3)' }}>Try the free demo above · Pay once, keep access forever</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT YOU GET</div>
          <h2>Everything You Need to Pass Part 107</h2>
          <p className="lp-section-sub">No aviation background required. We start from scratch and walk you through everything the FAA tests drone pilots on.</p>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: 'Part 107-Specific Questions', desc: "Built from the FAA's Remote Pilot Airman Knowledge Testing database. Every question the real exam can draw from — with full explanations on every answer." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title: 'Airspace & LAANC', desc: "Understand controlled airspace, TFRs, restricted zones, and how to get authorization to fly where you need to fly. Critical for commercial work." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>, title: 'Weather for Drone Pilots', desc: "METARs, TAFs, wind, visibility, and how weather affects drone operations. The FAA tests this heavily — we make it easy to understand." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Timed Exam Simulator', desc: "Simulate the real 2-hour, 60-question FAA test. Drill by topic or take full practice exams. Keep going until you're consistently above 80%." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'AI Instructor Support', desc: "Ask anything — from airspace rules to weather interpretation. Our AI explains drone regulations in plain English, not FAA legalese." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: 'Start Earning Faster', desc: "The sooner you pass, the sooner you can legally charge for shoots. Real estate, weddings, inspections — all require Part 107. We get you there fast." },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px' }}>
                <span className="lp-feat-icon" style={{ display: 'block', marginBottom: 16 }}>{item.svg}</span>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{item.title}</div>
                <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEE INSIDE */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-dark)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">SEE INSIDE</div>
          <h2>Here's What Studying Actually Looks Like</h2>
          <p className="lp-section-sub">Real Part 107 questions, full explanations, and a dashboard that shows exactly where you stand.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 52 }}>

            {/* MOCKUP 1: Question */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>Part 107 · Study Mode · Question 14 of 60</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PART 107</span>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📘 Airspace Classification</span>
                </div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  What is the maximum altitude at which a small unmanned aircraft may be operated without a waiver, when flying in uncontrolled airspace?
                </p>
                {[
                  { l: 'A', text: '300 feet AGL' },
                  { l: 'B', text: '400 feet AGL', correct: true },
                  { l: 'C', text: '500 feet AGL' },
                  { l: 'D', text: '600 feet MSL' },
                ].map(({ l, text, correct }) => (
                  <div key={l} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '11px 14px', borderRadius: 8, marginBottom: 8,
                    border: `1px solid ${correct ? 'rgba(48,172,226,0.5)' : 'var(--lp-border)'}`,
                    background: correct ? 'rgba(48,172,226,0.08)' : 'rgba(255,255,255,0.03)',
                    cursor: 'default',
                  }}>
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: correct ? 'var(--lp-blue)' : 'rgba(255,255,255,0.08)', color: correct ? '#fff' : 'var(--lp-text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{l}</span>
                    <span style={{ color: correct ? '#fff' : 'var(--lp-text2)', fontSize: 14 }}>{text}</span>
                    {correct && <span style={{ marginLeft: 'auto', color: 'var(--lp-blue)', fontSize: 13, fontWeight: 700 }}>✓ Correct</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* MOCKUP 2: Explanation */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>Full Explanation + AI Instructor</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ background: 'rgba(48,172,226,0.08)', border: '1px solid rgba(48,172,226,0.25)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 8 }}>EXPLANATION</div>
                  <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    Under 14 CFR Part 107.51, small unmanned aircraft must be flown at or below <strong style={{ color: '#fff' }}>400 feet above ground level (AGL)</strong> in uncontrolled (Class G) airspace. This rule applies unless you have a FAA waiver authorizing operations above that altitude.
                  </p>
                </div>
                <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#F7C948', letterSpacing: 1 }}>AI INSTRUCTOR</span>
                  </div>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    An easy way to remember this: think of 400 ft as your ceiling in open sky. The only exception is when you're within 400 ft of a structure — then you can go up to 400 ft above that structure's height. This comes up on the real exam frequently.
                  </p>
                </div>
              </div>
            </div>

            {/* MOCKUP 3: Dashboard */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>Progress Dashboard</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20 }}>
                  <div style={{ position: 'relative', width: 80, height: 80, flexShrink: 0 }}>
                    <svg width="80" height="80" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={`${0.78 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>78</span>
                      <span style={{ fontSize: 9, color: 'var(--lp-text3)', letterSpacing: 1 }}>READY</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Looking good — keep going</div>
                    <div style={{ color: 'var(--lp-text3)', fontSize: 13 }}>203 questions answered · 14 days streak</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>WEAK TOPICS TO REVIEW</div>
                {[
                  { topic: 'Weather & Meteorology', pct: 58 },
                  { topic: 'Loading & Performance', pct: 63 },
                  { topic: 'Radio Communications', pct: 71 },
                ].map(({ topic, pct }) => (
                  <div key={topic} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ color: 'var(--lp-text2)', fontSize: 13 }}>{topic}</span>
                      <span style={{ color: pct < 65 ? '#EF4444' : '#F59E0B', fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <div style={{ height: 4, width: `${pct}%`, background: pct < 65 ? '#EF4444' : '#F59E0B', borderRadius: 2 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/register" className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>
              Get Full Access — $37.99 →
            </Link>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="topics">
        <div className="lp-section-inner">
          <div className="lp-badge">ALL TOPICS COVERED</div>
          <h2>Every Topic the FAA Tests on Part 107</h2>
          <p className="lp-section-sub">The Part 107 knowledge test draws from these subject areas. We cover every single one.</p>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 48 }}>
            {TOPICS.map((topic, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 10, padding: '14px 18px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span style={{ color: 'var(--lp-text)', fontSize: 14, fontWeight: 500 }}>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '90px 40px' }} id="faq">
        <div className="lp-section-inner" style={{ maxWidth: 720 }}>
          <div className="lp-badge">FAQ</div>
          <h2>Common Questions</h2>
          <div className="fade-up" style={{ marginTop: 48 }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: '1px solid var(--lp-border)', padding: '24px 0' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', gap: 16 }}>
                  <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ color: 'var(--lp-blue)', fontSize: 22, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && <div style={{ marginTop: 16, color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.8 }}>{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.15)', borderTop: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div className="lp-section-inner">
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 28 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
            ONE TEST. FULLY LICENSED.
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 600, margin: '0 auto 20px' }}>
            Stop Flying as a Hobbyist.<br /><span className="lp-accent">Get Your Part 107.</span>
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
            One exam. 2–3 weeks of prep. Fully licensed to charge for every shoot, every contract, every gig.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="lp-btn-hero" style={{ fontSize: 18, padding: '18px 44px' }}>
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Start Free Today
            </Link>
            <Link to="/" className="lp-btn-outline" style={{ fontSize: 16 }}>View All Packages</Link>
          </div>
        </div>
      </section>

      <footer style={{ padding: '40px', borderTop: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}><Link to="/" className="lp-nav-logo">FAA<span style={{ color: 'var(--lp-blue)' }}>Examinations</span>.com</Link></div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {[['/', 'Home'], ['/about', 'About'], ['/blog', 'Blog'], ['/references', 'Free References'], ['/privacy', 'Privacy'], ['/terms', 'Terms']].map(([to, label]) => (
            <Link key={to} to={to} style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>{label}</Link>
          ))}
        </div>
        <div style={{ color: 'var(--lp-text3)', fontSize: 12 }}>© 2026 FAAExaminations.com · All rights reserved</div>
      </footer>
    </div>
  );
}
