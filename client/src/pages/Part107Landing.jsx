import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

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
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click. Most students are done studying in under 3 weeks.',
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
        <meta name="description" content="Pass your FAA Part 107 Remote Pilot knowledge test and get licensed to fly drones commercially. Practice questions, timed simulator, AI support. $24.99/month. Cancel anytime." />
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
      <section className="lp-hero" style={{ backgroundImage: 'url(/drone-part107-hero.jpg)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.75) 0%,rgba(8,14,20,0.7) 60%,rgba(8,14,20,0.5) 100%)', position: 'absolute', inset: 0 }} />
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
          <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginTop: 14, opacity: 0.8, lineHeight: 2 }}>
            Free account includes 10 practice questions · No credit card required<br />
            Full access from $24.99/month · Cancel anytime
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">60</div><div className="lp-hs-lbl">Exam Questions</div></div>
            <div><div className="lp-hs-val">2–3</div><div className="lp-hs-lbl">Weeks to Pass</div></div>
            <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
            <div><div className="lp-hs-val">NONE</div><div className="lp-hs-lbl">Prior Experience Needed</div></div>
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
              { icon: '🚁', title: 'Part 107-Specific Questions', desc: 'Built from the FAA\'s Remote Pilot Airman Knowledge Testing database. Every question the real exam can draw from — with full explanations on every answer.' },
              { icon: '🗺️', title: 'Airspace & LAANC', desc: 'Understand controlled airspace, TFRs, restricted zones, and how to get authorization to fly where you need to fly. Critical for commercial work.' },
              { icon: '🌤️', title: 'Weather for Drone Pilots', desc: 'METARs, TAFs, wind, visibility, and how weather affects drone operations. The FAA tests this heavily — we make it easy to understand.' },
              { icon: '🎯', title: 'Timed Exam Simulator', desc: 'Simulate the real 2-hour, 60-question FAA test. Drill by topic or take full practice exams. Keep going until you\'re consistently above 80%.' },
              { icon: '🤖', title: 'AI Instructor Support', desc: 'Ask anything — from airspace rules to weather interpretation. Our AI explains drone regulations in plain English, not FAA legalese.' },
              { icon: '💰', title: 'Start Earning Faster', desc: 'The sooner you pass, the sooner you can legally charge for shoots. Real estate, weddings, inspections — all require Part 107. We get you there fast.' },
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
          <h2>Every Topic the FAA Tests on Part 107</h2>
          <p className="lp-section-sub">The Part 107 knowledge test draws from 11 subject areas. We cover every single one.</p>
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

      {/* PRICING */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }} id="pricing">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>One price. Everything included. Cancel the moment you pass.</p>
          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 2–3 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Part 107 Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$24.99</div>
            <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 36 }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {['Part 107-specific practice questions', 'Airspace & LAANC authorization coverage', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI instructor support', 'All FAA Part 107 references included', 'No aviation experience required', 'Cancel anytime — no contracts'].map((item, i) => (
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
