import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const TOPICS = [
  'Pilot Qualifications & Certification',
  'Aircraft Performance',
  'Weight & Balance',
  'Flight Planning & Navigation',
  'Federal Aviation Regulations (14 CFR)',
  'Meteorology & Weather Services',
  'Airspace & ATC Procedures',
  'Emergency Operations',
  'Night Operations',
  'High Altitude Operations',
  'Commercial Flight Operations',
];

const FAQS = [
  {
    q: 'How many questions are on the FAA Commercial Pilot written exam?',
    a: '100 questions. You need a score of 70% or higher to pass. The CAX covers advanced topics like aircraft performance, weight & balance, and complex flight operations.',
  },
  {
    q: 'Do I need my Instrument Rating before taking the CAX written?',
    a: 'No — you can take the written at any time. However, you must hold an Instrument Rating before you can take the Commercial Pilot checkride for an airplane single-engine land certificate.',
  },
  {
    q: 'How is the CAX different from the PAR written?',
    a: 'The CAX goes deeper into aircraft performance, weight & balance, 14 CFR commercial operating rules, and advanced flight planning. If you passed your PAR, you already know the basics — the CAX builds on top of that.',
  },
  {
    q: 'How long does it take to study for the CAX?',
    a: 'Most students with a Private Pilot background need 3–5 weeks of focused study. Our 536 questions cover every topic the FAA tests on the CAX.',
  },
  {
    q: 'Are the practice questions up to date?',
    a: 'Yes. Our question bank is current for 2026 and reflects the latest FAA Commercial Pilot knowledge test content, including updated performance tables, weight & balance procedures, and 14 CFR commercial regulations. We update whenever the FAA revises the test.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click.',
  },
];

const checkSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" />
    <path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CAXLanding() {
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
        <title>FAA Commercial Pilot Written Test Prep — 536 Questions | FAAExaminations.com</title>
        <meta name="description" content="Pass your FAA Commercial Pilot knowledge test first try. 536 practice questions covering performance, weight & balance, 14 CFR, and advanced operations. $24.99/month." />
        <link rel="canonical" href="https://faaexaminations.com/cax" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/cax" />
        <meta property="og:title" content="FAA Commercial Pilot Written Test Prep — Pass First Try" />
        <meta property="og:description" content="536 practice questions covering performance, weight & balance, and advanced operations. Pass your FAA Commercial Pilot written exam. $24.99/month." />
        <meta property="og:image" content="https://faaexaminations.com/plane-cax-hero.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Commercial Pilot FAA exam prep — FAAExaminations.com" />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://faaexaminations.com/plane-cax-hero.jpg" />
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
              <Link to="/register?plan=cax" className="lp-nav-cta">Start Free →</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero lp-hero-cax" style={{ backgroundImage: 'url(/faa-commercial-pilot-written-test-prep.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.42) 0%,rgba(8,14,20,0.38) 55%,rgba(8,14,20,0.18) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-split">
          {/* LEFT */}
          <div className="lp-hero-content">
            <div className="lp-hero-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
              COMMERCIAL PILOT · FAA KNOWLEDGE TEST PREP · 2026
            </div>
            <h1>Pass Your <span className="lp-accent">Commercial Pilot</span><br />Written Exam<br />First Try</h1>
            <p className="lp-hero-sub">
              536 authentic FAA practice questions covering all commercial pilot topics. Performance, weight & balance, 14 CFR operations, and advanced flight planning — with full explanations and AI instructor support.
            </p>
            <div className="lp-hero-btns">
              <Link to="/register?plan=cax" className="lp-btn-hero">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
                Start 3 Days Free
              </Link>
              <a href="#includes" className="lp-btn-outline">See What's Included</a>
            </div>
            <div className="lp-hero-stats">
              <div><div className="lp-hs-val">536</div><div className="lp-hs-lbl">CAX Questions</div></div>
              <div><div className="lp-hs-val">11</div><div className="lp-hs-lbl">Study Modules</div></div>
              <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
              <div><div className="lp-hs-val">14 CFR</div><div className="lp-hs-lbl">Fully Covered</div></div>
            </div>
          </div>

          {/* RIGHT — pricing card (desktop only) */}
          <div className="lp-hero-pricing-card">
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 3–5 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, textAlign: 'center', marginTop: 8 }}>Commercial Pilot Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1, textAlign: 'center' }}>$24.99</div>
            <div style={{ fontSize: 13, marginBottom: 24, textAlign: 'center', color: 'var(--lp-text3)' }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['536 Commercial Pilot practice questions', 'Performance & weight/balance questions', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI flight instructor support', '14 CFR commercial regulations covered', 'Access on any device', 'Cancel anytime — no contracts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--lp-text)', fontSize: 14 }}>
                  {checkSvg}{item}
                </li>
              ))}
            </ul>
            <Link to="/register?plan=cax" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 16, padding: '15px 28px' }}>Start 3 Days Free →</Link>
            <Link to="/register?plan=cax" style={{ display: 'block', textAlign: 'center', marginTop: 10, padding: '13px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>Start 3-Day Free Trial — $24.99/mo →</Link>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)', textAlign: 'center' }}>No credit card required · Upgrade when you're ready</div>
          </div>
        </div>
      </section>

      {/* PRICING — mobile only (desktop sees hero card) */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="pricing" className="lp-pricing-section">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>One price. Everything included. Cancel the moment you pass.</p>
          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 3–5 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Commercial Pilot Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$24.99</div>
            <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 36 }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {['536 Commercial Pilot practice questions', 'Performance & weight/balance questions', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI flight instructor support', '14 CFR commercial regulations covered', 'Access on any device', 'Cancel anytime — no contracts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?plan=cax" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Start 3 Days Free →</Link>
            <Link to="/register?plan=cax" style={{ display: 'block', textAlign: 'center', marginTop: 12, padding: '15px 40px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)', color: '#fff', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>Start 3-Day Free Trial — $24.99/mo →</Link>
            <div style={{ marginTop: 16, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · Card required · Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT YOU GET</div>
          <h2>Everything You Need to Pass the CAX</h2>
          <p className="lp-section-sub">The Commercial Pilot written tests advanced knowledge. We cover every topic — from complex performance calculations to commercial operating regulations.</p>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: '536 CAX Practice Questions', desc: "Built from the FAA's official Airman Knowledge Testing database. Every question the real exam can draw from, with full explanations. Current for 2026." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: 'Performance & Weight/Balance', desc: "The CAX is heavy on aircraft performance and W&B calculations. We walk you through every chart, table, and formula the FAA tests." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>, title: '14 CFR Commercial Regulations', desc: "Deep coverage of Part 61, Part 91, and commercial operating rules. Know exactly what you can and can't do as a commercial pilot." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Timed Exam Simulator', desc: "Simulate the real 3-hour, 100-question FAA test. Track your score by topic and drill your weak areas until you're consistently above 80%." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'AI Instructor Support', desc: "Ask our AI flight instructor anything — from complex performance charts to night VFR rules. It explains clearly, not like a regulation." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: 'Study Anywhere', desc: "Fully responsive on phone, tablet, and desktop. Study between flights, in the FBO, or the night before your exam." },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px' }}>
                <span style={{ display: 'block', marginBottom: 16 }}>{item.svg}</span>
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
          <p className="lp-section-sub">Real CAX practice questions, full explanations, and a dashboard that shows exactly where you stand.</p>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 52 }}>

            {/* MOCKUP 1: Question */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>CAX · Study Mode · Question 31 of 100</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>CAX</span>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📘 Aircraft Performance</span>
                </div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  What effect does a downhill slope have on takeoff performance?
                </p>
                {[
                  { l: 'A', text: 'Decreases takeoff distance', correct: true },
                  { l: 'B', text: 'Increases takeoff distance' },
                  { l: 'C', text: 'Has no effect on takeoff performance' },
                ].map(({ l, text, correct }) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, marginBottom: 8, border: `1px solid ${correct ? 'rgba(48,172,226,0.5)' : 'var(--lp-border)'}`, background: correct ? 'rgba(48,172,226,0.08)' : 'rgba(255,255,255,0.03)' }}>
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
                    A <strong style={{ color: '#fff' }}>downhill slope decreases takeoff distance</strong> because gravity assists the aircraft in accelerating down the runway. The aircraft reaches rotation speed sooner. Conversely, an uphill slope increases takeoff distance.
                  </p>
                </div>
                <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#F7C948', letterSpacing: 1 }}>AI INSTRUCTOR</span>
                  </div>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    Think of slope like a free tailwind or headwind — except vertical. Downhill = gravity helps you accelerate = shorter roll. The CAX loves slope + density altitude combo questions. Know both effects cold, because they'll stack them.
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
                        strokeDasharray={`${0.76 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>76</span>
                      <span style={{ fontSize: 9, color: 'var(--lp-text3)', letterSpacing: 1 }}>READY</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Almost there — keep drilling</div>
                    <div style={{ color: 'var(--lp-text3)', fontSize: 13 }}>284 questions answered · 8 days streak</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>WEAK TOPICS TO REVIEW</div>
                {[
                  { topic: 'Weight & Balance', pct: 60 },
                  { topic: 'Aircraft Performance', pct: 65 },
                  { topic: 'High Altitude Operations', pct: 69 },
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
            <Link to="/register?plan=cax" className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>Start 3 Days Free →</Link>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="topics">
        <div className="lp-section-inner">
          <div className="lp-badge">ALL TOPICS COVERED</div>
          <h2>Every Topic the FAA Tests on the CAX</h2>
          <p className="lp-section-sub">The CAX covers 11 subject areas. We cover every single one — no surprises on test day.</p>
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

      {/* HOW IT WORKS */}
      <section style={{ padding: '90px 40px' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">HOW IT WORKS</div>
          <h2>Pass in 3 Simple Steps</h2>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginTop: 52 }}>
            {[
              { n: '1', title: 'Create Your Free Account', desc: 'Sign up in 30 seconds. Get 10 free CAX practice questions instantly — no credit card required. See exactly how the platform works before you commit.' },
              { n: '2', title: 'Work Through the Modules', desc: 'Study topic by topic — performance charts, W&B, regulations, advanced operations. Every wrong answer has a full explanation. Ask the AI instructor anything you don\'t understand.' },
              { n: '3', title: 'Pass Your CAX Written', desc: 'When you\'re consistently scoring above 80% on our 100-question simulator, you\'re ready. Walk into your testing appointment confident — you\'ve already seen everything they\'ll ask.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 20px' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(48,172,226,0.12)', border: '2px solid var(--lp-border2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontFamily: 'Barlow Condensed, sans-serif', fontSize: 28, fontWeight: 800, color: 'var(--lp-blue)' }}>{s.n}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{s.title}</div>
                <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>{s.desc}</div>
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
            YOUR COMMERCIAL CERTIFICATE STARTS HERE
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 620, margin: '0 auto 20px' }}>
            Your <span className="lp-accent">Commercial Certificate</span> Starts Here
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>536 questions. Every CAX topic. Everything the FAA will ask you. Start free today — no credit card needed.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?plan=cax" className="lp-btn-hero" style={{ fontSize: 18, padding: '18px 44px' }}>
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Start 3 Days Free
            </Link>
            <Link to="/#products" className="lp-btn-outline" style={{ fontSize: 16 }}>View All Packages</Link>
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
