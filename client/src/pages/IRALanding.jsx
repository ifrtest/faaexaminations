import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const TOPICS = [
  'Flight Instruments',
  'Attitude Instrument Flying',
  'Navigation Systems',
  'IFR En Route Charts',
  'Instrument Approach Procedures',
  'Weather & Meteorology',
  'Federal Aviation Regulations',
  'Airspace',
  'Emergency Procedures',
  'Aerodynamics',
  'Aircraft Systems',
];

const FAQS = [
  {
    q: 'How many questions are on the real FAA Instrument Rating written exam?',
    a: '60 questions. You need a score of 70% or higher to pass. The IRA is widely considered the most challenging FAA written exam — our 821-question bank covers every topic the FAA tests.',
  },
  {
    q: 'How long does it take to prepare for the IRA written?',
    a: 'Most students take 3–6 weeks of focused study. The IRA covers complex topics like IFR charts, approach procedures, and instrument meteorology. We break it all down into 11 focused modules.',
  },
  {
    q: 'Do I need my Private Pilot certificate before taking the IRA written?',
    a: 'No — you can take the written at any time. However, you must hold a Private Pilot certificate before you can take the IRA checkride. Most students do the written while completing their instrument flight training.',
  },
  {
    q: 'Are the approach chart questions included?',
    a: 'Yes. IFR approach plates, en route charts, and departure procedures are all covered. Our questions walk you through reading and interpreting real FAA chart formats.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click. Most students complete their prep in 4–6 weeks.',
  },
];

export default function IRALanding() {
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
        <title>FAA Instrument Rating Written Test Prep — 821 Questions | FAAExaminations.com</title>
        <meta name="description" content="Pass your FAA Instrument Rating knowledge test first try. 821 practice questions, IFR charts, approach procedures, and AI instructor support. $24.99/month. Cancel anytime." />
        <link rel="canonical" href="https://faaexaminations.com/ira" />
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
      <section className="lp-hero" style={{ backgroundImage: 'url(/plane-ira.webp)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.75) 0%,rgba(8,14,20,0.7) 60%,rgba(8,14,20,0.5) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
            INSTRUMENT RATING · FAA KNOWLEDGE TEST PREP · 2026
          </div>
          <h1>Pass Your <span className="lp-accent">IFR Written</span><br />Exam<br />First Try</h1>
          <p className="lp-hero-sub">
            821 authentic FAA practice questions across all instrument rating topics. IFR charts, approach procedures, weather, and regulations — with full explanations and AI instructor support.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-btn-hero">
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Start Free Today
            </Link>
            <a href="#includes" className="lp-btn-outline">See What's Included</a>
          </div>
          <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginTop: 14, opacity: 0.8, lineHeight: 2 }}>
            Free account includes 10 practice questions · No credit card required<br />
            Full access from $24.99/month · Cancel anytime
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">821</div><div className="lp-hs-lbl">IRA Questions</div></div>
            <div><div className="lp-hs-val">11</div><div className="lp-hs-lbl">Study Modules</div></div>
            <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
            <div><div className="lp-hs-val">IFR</div><div className="lp-hs-lbl">Charts Included</div></div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT YOU GET</div>
          <h2>Everything You Need to Pass the IRA</h2>
          <p className="lp-section-sub">The Instrument Rating written is the hardest FAA knowledge test. We cover every topic — IFR charts, approaches, weather, and regs — so nothing surprises you on test day.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              { icon: '🛩️', title: '821 IRA Practice Questions', desc: 'Built from the FAA\'s official Airman Knowledge Testing database. Every question the real exam can draw from — with full explanations on every answer.' },
              { icon: '🗺️', title: 'IFR Charts & Approach Plates', desc: 'Navigate IFR en route charts, SIDs, STARs, and instrument approach procedures. We cover the chart reading skills the FAA tests directly.' },
              { icon: '🌧️', title: 'Weather & Meteorology', desc: 'METARs, TAFs, PIREPs, SIGMETs, AIRMETs, and weather charts. The IRA tests weather extensively — we make sure you know it cold.' },
              { icon: '🎯', title: 'Timed Exam Simulator', desc: 'Simulate the real 2.5-hour, 60-question FAA test. Track your score by topic and keep drilling your weak areas until you\'re consistently above 80%.' },
              { icon: '🤖', title: 'AI Instructor Support', desc: 'Ask our AI flight instructor anything. From hold entries to partial panel flying — it explains like a CFII, not a textbook.' },
              { icon: '📱', title: 'Study Anywhere', desc: 'Fully responsive on phone, tablet, and desktop. Study between flights, in the FBO, or the night before your exam.' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px' }}>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{item.icon}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 10 }}>{item.title}</div>
                <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="topics">
        <div className="lp-section-inner">
          <div className="lp-badge">ALL TOPICS COVERED</div>
          <h2>Every Topic the FAA Tests on the IRA</h2>
          <p className="lp-section-sub">The IRA draws from 11 subject areas. We cover every single one — no surprises on test day.</p>
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
              { n: '1', title: 'Create Your Free Account', desc: 'Sign up in 30 seconds. Get 10 free practice questions instantly — no credit card required. See exactly how the platform works before you commit.' },
              { n: '2', title: 'Work Through the Modules', desc: 'Study topic by topic — IFR charts, weather, regulations, approaches. Every wrong answer has a full explanation. Ask the AI CFII anything you don\'t understand.' },
              { n: '3', title: 'Pass Your IRA Written', desc: 'When you\'re consistently scoring above 80% on our simulator, you\'re ready. Walk into your testing appointment confident.' },
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

      {/* PRICING */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="pricing">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>One price. Everything included. Cancel the moment you pass.</p>
          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 3–6 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Instrument Rating Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$24.99</div>
            <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 36 }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {['821 Instrument Rating practice questions', 'IFR charts & approach plate questions', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI CFII instructor support', 'All FAA IFR references included', 'Access on any device', 'Cancel anytime — no contracts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Start Free — Get 10 Questions Now</Link>
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
            YOUR IFR TICKET STARTS HERE
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 600, margin: '0 auto 20px' }}>
            Your <span className="lp-accent">Instrument Rating</span> Starts Here
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>821 questions. Every IFR topic. Everything the FAA will ask you. Start free today.</p>
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
