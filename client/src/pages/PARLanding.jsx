import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const TOPICS = [
  'Pilot Qualifications',
  'Airworthiness Requirements',
  'Weather',
  'Charts & Navigation',
  'Federal Aviation Regulations',
  'National Airspace System',
  'Navigation Systems & Radar',
  'Aerodynamics',
  'Airport Operations',
  'Emergency Procedures',
  'Aeromedical Factors',
];

const FAQS = [
  {
    q: 'How many questions are on the real FAA Private Pilot written exam?',
    a: '60 questions. You need a score of 70% or higher to pass — that means you can miss up to 18 questions. Our simulator is built to match the exact format and difficulty of the real test.',
  },
  {
    q: 'How long does it take to study for the PAR?',
    a: 'Most students pass in 2–4 weeks of focused study. With 1,469 practice questions across all 11 topics, you\'ll see every concept the FAA tests before you walk into the testing center.',
  },
  {
    q: 'Are these the actual FAA questions?',
    a: 'Yes. Our question bank is built from the FAA\'s published Airman Knowledge Testing question database — the same source the real test draws from. We add full explanations and AI instructor support on top.',
  },
  {
    q: 'Do I need a flight instructor endorsement before taking the written?',
    a: 'Yes — a CFI must endorse your logbook or provide a sign-off before you can take the official exam. We prepare you for the knowledge test itself; your flight instructor handles the endorsement.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your account dashboard in one click. Most students are done studying in under a month — you won\'t need to.',
  },
];

export default function PARLanding() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle('scrolled', window.scrollY > 50);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp">
      <Helmet>
        <title>FAA Private Pilot Written Test Prep — 1,469 Questions | FAAExaminations.com</title>
        <meta name="description" content="Pass your FAA Private Pilot written exam first try. 1,469 practice questions, 11 study modules, timed simulator, and AI instructor support. $24.99/month. Cancel anytime." />
        <link rel="canonical" href="https://faaexaminations.com/par" />
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
      <section className="lp-hero lp-hero-par" style={{ backgroundImage: 'url(/Cesna_faa_examinations.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 10%' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.42) 0%,rgba(8,14,20,0.38) 55%,rgba(8,14,20,0.18) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-split">
          {/* LEFT — headline + stats */}
          <div className="lp-hero-content">
            <div className="lp-hero-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
              PRIVATE PILOT · FAA KNOWLEDGE TEST PREP · 2026
            </div>
            <h1>Pass Your <span className="lp-accent">Private Pilot</span><br />Written Exam<br />First Try</h1>
            <p className="lp-hero-sub">
              1,469 authentic FAA practice questions across all 11 exam topics. Timed simulator, full explanations, and an AI flight instructor — everything you need to walk out of the testing center with a passing score.
            </p>
            <div className="lp-hero-btns">
              <Link to="/register" className="lp-btn-hero">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
                Start Free Today
              </Link>
              <a href="#includes" className="lp-btn-outline">See What's Included</a>
            </div>
            <div className="lp-hero-stats">
              <div><div className="lp-hs-val">1,469</div><div className="lp-hs-lbl">PAR Questions</div></div>
              <div><div className="lp-hs-val">11</div><div className="lp-hs-lbl">Study Modules</div></div>
              <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
              <div><div className="lp-hs-val">70%</div><div className="lp-hs-lbl">Passing Score</div></div>
            </div>
          </div>

          {/* RIGHT — pricing card (desktop only) */}
          <div className="lp-hero-pricing-card">
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 2–4 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, textAlign: 'center', marginTop: 8 }}>Private Pilot Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1, textAlign: 'center' }}>$24.99</div>
            <div style={{ fontSize: 13, marginBottom: 24, textAlign: 'center', color: 'var(--lp-text3)' }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['1,469 Private Pilot practice questions', '11 categorized study modules', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI flight instructor support', 'All FAA references included', 'Access on any device', 'Cancel anytime — no contracts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--lp-text)', fontSize: 14 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 16, padding: '15px 28px' }}>Start Free — 10 Questions Now →</Link>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)', textAlign: 'center' }}>No credit card required · Upgrade when you're ready</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT YOU GET</div>
          <h2>Everything You Need to Pass</h2>
          <p className="lp-section-sub">No textbooks. No guesswork. Just the questions the FAA actually tests you on — with full explanations for every single one.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 52 }}>

            {[
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: '1,469 Practice Questions', desc: "Built from the FAA's official Airman Knowledge Testing database — the exact same source the real exam draws from. Updated for 2026." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Timed Exam Simulator', desc: "Simulate the real 2.5-hour, 60-question FAA test. Track your score, identify weak topics, and keep testing until you're consistently above 80%." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'AI Instructor Support', desc: "Every question includes a full explanation. Get confused on a topic? Ask our AI flight instructor anything — it explains like a real CFI, not a textbook." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: '11 Study Modules', desc: "Every topic the FAA tests organized into focused modules. Study one topic at a time or jump straight to your weak areas. You control the pace." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>, title: 'Full FAA References', desc: "PHAK, AIM, 14 CFR, ACS, and all supplemental materials included. No need to hunt down separate PDFs — everything is here." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: 'Study Anywhere', desc: "Fully responsive on phone, tablet, and desktop. Study between flights, on your lunch break, or the night before your exam. No app download needed." },
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
          <p className="lp-section-sub">Real FAA practice questions, full explanations, and a dashboard that shows exactly where you stand.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 52 }}>

            {/* MOCKUP 1: Question */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>PAR · Study Mode · Question 22 of 60</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>PAR</span>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📘 Weather</span>
                </div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  What are the standard temperature and pressure values for sea level in the International Standard Atmosphere?
                </p>
                {[
                  { l: 'A', text: '59°F and 29.92 inches Hg', correct: true },
                  { l: 'B', text: '59°F and 28.86 inches Hg' },
                  { l: 'C', text: '15°F and 29.92 inches Hg' },
                  { l: 'D', text: '15°C and 1013.2 mb' },
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
                    The International Standard Atmosphere (ISA) defines sea level conditions as <strong style={{ color: '#fff' }}>59°F (15°C) and 29.92 inches of mercury (1013.2 mb)</strong>. These values are the baseline from which density altitude and performance charts are calculated.
                  </p>
                </div>
                <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#F7C948', letterSpacing: 1 }}>AI INSTRUCTOR</span>
                  </div>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    Think of ISA as the "average perfect day." 59°F and 29.92 inHg. The FAA tests this constantly because everything — from density altitude to aircraft performance — references these standard values. If conditions differ from ISA, performance changes.
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
                        strokeDasharray={`${0.74 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>74</span>
                      <span style={{ fontSize: 9, color: 'var(--lp-text3)', letterSpacing: 1 }}>READY</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Almost there — keep drilling</div>
                    <div style={{ color: 'var(--lp-text3)', fontSize: 13 }}>318 questions answered · 9 days streak</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>WEAK TOPICS TO REVIEW</div>
                {[
                  { topic: 'Navigation & Charts', pct: 55 },
                  { topic: 'Weather Services', pct: 61 },
                  { topic: 'Airspace', pct: 68 },
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
              Start Studying Free Today →
            </Link>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="topics">
        <div className="lp-section-inner">
          <div className="lp-badge">ALL 11 TOPICS COVERED</div>
          <h2>Every Topic the FAA Tests You On</h2>
          <p className="lp-section-sub">The PAR exam pulls from 11 subject areas. We cover every single one — no surprises on test day.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginTop: 48 }}>
            {TOPICS.map((topic, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 10, padding: '14px 18px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" />
                  <path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: 'var(--lp-text)', fontSize: 14, fontWeight: 500 }}>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '90px 40px' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">HOW IT WORKS</div>
          <h2>Pass in 3 Simple Steps</h2>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginTop: 52 }}>

            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(48,172,226,0.12)', border: '2px solid var(--lp-border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--lp-blue)' }}>1</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Create Your Free Account</div>
              <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>Sign up in 30 seconds. Get 10 free practice questions instantly — no credit card required. See exactly how the platform works before you commit.</div>
            </div>

            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(48,172,226,0.12)', border: '2px solid var(--lp-border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--lp-blue)' }}>2</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Work Through the Modules</div>
              <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>Study topic by topic or take full timed practice exams. Every wrong answer comes with a full explanation. Ask the AI instructor anything you don't understand.</div>
            </div>

            <div style={{ textAlign: 'center', padding: '0 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(48,172,226,0.12)', border: '2px solid var(--lp-border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--lp-blue)' }}>3</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>Pass Your FAA Written</div>
              <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>When you're consistently scoring above 80% on our simulator, you're ready. Walk into your testing appointment confident — you've already seen everything they'll ask.</div>
            </div>

          </div>
        </div>
      </section>

      {/* PRICING — hidden on desktop (card is in hero), shown on mobile only */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="pricing" className="lp-pricing-section">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>One price. Everything included. Cancel the moment you pass.</p>

          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 2–4 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Private Pilot Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$24.99</div>
            <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 36 }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {[
                '1,469 Private Pilot practice questions',
                '11 categorized study modules',
                'Timed FAA exam simulator',
                'Full explanations on every question',
                'AI flight instructor support',
                'All FAA references included',
                'Access on any device',
                'Cancel anytime — no contracts',
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" />
                    <path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>
              Start Free — Get 10 Questions Now
            </Link>
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--lp-text3)' }}>No credit card required to start · Upgrade when you're ready</div>
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
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', textAlign: 'left', gap: 16 }}
                >
                  <span style={{ fontFamily: 'Barlow, sans-serif', fontSize: 17, fontWeight: 600, color: '#fff', lineHeight: 1.4 }}>{faq.q}</span>
                  <span style={{ color: 'var(--lp-blue)', fontSize: 22, flexShrink: 0 }}>{openFaq === i ? '−' : '+'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ marginTop: 16, color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.8 }}>{faq.a}</div>
                )}
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
            YOU'RE CLOSER THAN YOU THINK
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 600, margin: '0 auto 20px' }}>
            Your <span className="lp-accent">Private Pilot Certificate</span> Starts Here
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
            1,469 questions. 11 topics. Everything the FAA will ask you. Start free today — no credit card needed.
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

      {/* FOOTER */}
      <footer style={{ padding: '40px', borderTop: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ marginBottom: 16 }}>
          <Link to="/" className="lp-nav-logo">FAA<span style={{ color: 'var(--lp-blue)' }}>Examinations</span>.com</Link>
        </div>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          <Link to="/" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>Home</Link>
          <Link to="/about" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>About</Link>
          <Link to="/blog" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>Blog</Link>
          <Link to="/references" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>Free References</Link>
          <Link to="/privacy" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>Privacy</Link>
          <Link to="/terms" style={{ color: 'var(--lp-text3)', fontSize: 13, textDecoration: 'none' }}>Terms</Link>
        </div>
        <div style={{ color: 'var(--lp-text3)', fontSize: 12 }}>© 2026 FAAExaminations.com · All rights reserved</div>
      </footer>
    </div>
  );
}
