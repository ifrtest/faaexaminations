import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const FAQS = [
  {
    q: 'What\'s included in the Bundle?',
    a: 'Private Pilot (PAR), Instrument Rating (IRA), and Commercial Pilot (CAX) — all three pilot certificate exams in one subscription. 2,826 practice questions, all study modules, and AI instructor support across all three exams.',
  },
  {
    q: 'Do I have to take all four exams?',
    a: 'No. Subscribe to the bundle and study at your own pace. Most students start with PAR, then move to IRA once they have their private certificate. You get access to everything, and use what you need when you need it.',
  },
  {
    q: 'Is the bundle cheaper than buying separately?',
    a: 'Yes. Individual packages are $24.99/month each. PAR + IRA + CAX separately would cost $74.97/month. The bundle gives you all three for $39.99/month — saving you $35/month.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click. Your access continues until the end of your billing period.',
  },
  {
    q: 'What if I only need one exam right now?',
    a: 'If you\'re only focused on one exam right now, an individual package at $24.99/month is the better value. The bundle makes sense if you\'re working toward multiple certificates or want PAR, IRA, and CAX all available.',
  },
];

export default function BundleLanding() {
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
        <title>FAA Pilot Certificate Bundle — PAR, IRA & CAX | FAAExaminations.com</title>
        <meta name="description" content="Get all three FAA pilot certificate exam packages in one bundle. Private Pilot, Instrument Rating, and Commercial Pilot. 2,826 questions. $39.99/month — save $35/month." />
        <link rel="canonical" href="https://faaexaminations.com/bundle" />
      </Helmet>

      {/* NAV */}
      <nav className="lp-nav" id="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <a href="#includes" className="lp-nav-link">What's Included</a>
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
      <section className="lp-hero" style={{ backgroundImage: 'url(/plane-bundle.webp)', backgroundSize: 'cover', backgroundPosition: 'center center' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.42) 0%,rgba(8,14,20,0.38) 55%,rgba(8,14,20,0.18) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
            PILOT CERTIFICATE BUNDLE · PAR + IRA + CAX · 2026
          </div>
          <h1>Three FAA Certificates.<br /><span className="lp-accent">One Subscription.</span></h1>
          <p className="lp-hero-sub">
            PAR, IRA, and CAX — all in one place. 2,826 practice questions, AI instructor support, and timed simulators for every exam on your path to a Commercial Pilot certificate.
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
            Full bundle access from $39.99/month · Cancel anytime
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">2,826</div><div className="lp-hs-lbl">Total Questions</div></div>
            <div><div className="lp-hs-val">3</div><div className="lp-hs-lbl">FAA Exams Covered</div></div>
            <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
            <div><div className="lp-hs-val">$35</div><div className="lp-hs-lbl">Saved vs Individual</div></div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT'S IN THE BUNDLE</div>
          <h2>All Three Pilot Certificate Exams in One</h2>
          <p className="lp-section-sub">Every exam on your path from student pilot to Commercial Pilot certificate — fully covered.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              { icon: '✈️', badge: 'PAR', title: 'Private Pilot', questions: '1,469 questions', desc: 'Complete prep for the FAA Private Pilot Airman Knowledge Test. 11 modules covering the full FAA syllabus.', url: '/par' },
              { icon: '🌧️', badge: 'IRA', title: 'Instrument Rating', questions: '821 questions', desc: 'IFR procedures, charts, approach plates, weather, and regulations. The most challenging FAA written.', url: '/ira' },
              { icon: '🏆', badge: 'CAX', title: 'Commercial Pilot', questions: '536 questions', desc: 'Performance, weight & balance, 14 CFR commercial operations, and advanced flight planning.', url: '/cax' },
            ].map((pkg, i) => (
              <div key={i} style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: 'Share Tech Mono, monospace' }}>{pkg.badge}</div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{pkg.icon}</div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{pkg.title}</div>
                <div style={{ color: 'var(--lp-blue)', fontSize: 13, fontWeight: 600, marginBottom: 12, fontFamily: 'Share Tech Mono, monospace' }}>{pkg.questions}</div>
                <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{pkg.desc}</div>
                <Link to={pkg.url} style={{ color: 'var(--lp-blue)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Learn more →</Link>
              </div>
            ))}
          </div>

          <div className="fade-up" style={{ marginTop: 48, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🤖', title: 'AI Instructor', desc: 'Ask anything across all four exams — one AI CFII covers everything.' },
              { icon: '🎯', title: 'Timed Simulators', desc: 'Separate exam simulators for each certificate. Practice the format that matters.' },
              { icon: '📱', title: 'Study Anywhere', desc: 'Phone, tablet, desktop. No app download. Always up to date.' },
              { icon: '📚', title: 'All FAA References', desc: 'PHAK, AIM, IFH, 14 CFR, ACS — every reference document included.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</div>
                <div>
                  <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 17, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.title}</div>
                  <div style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="pricing">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Bundle vs Individual</h2>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 52, maxWidth: 800, margin: '52px auto 0' }}>

            {/* Individual */}
            <div style={{ background: 'rgba(48,172,226,0.04)', border: '1px solid var(--lp-border)', borderRadius: 20, padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: 'var(--lp-text2)', marginBottom: 8 }}>Individual Packages</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 48, fontWeight: 900, color: 'var(--lp-text2)', lineHeight: 1 }}>$24.99</div>
              <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 24 }}>per exam / per month</div>
              <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 24 }}>All 3 = $74.97/month</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' }}>
                {['Access to 1 exam package', 'All features included', 'Cancel anytime'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, color: 'var(--lp-text2)', fontSize: 14 }}>
                    <span style={{ color: 'var(--lp-blue)' }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="lp-btn-outline" style={{ display: 'block', textAlign: 'center' }}>Choose Individual →</Link>
            </div>

            {/* Bundle */}
            <div style={{ background: 'rgba(48,172,226,0.08)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '40px 32px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>BEST VALUE — SAVE $35/MONTH</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Pilot Certificate Bundle</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$39.99</div>
              <div style={{ color: 'var(--lp-text3)', fontSize: 14, marginBottom: 24 }}>PAR + IRA + CAX / per month</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', textAlign: 'left' }}>
                {['PAR + IRA + CAX included', '2,826 practice questions', 'AI instructor for all exams', 'All timed simulators', 'All FAA references', 'Cancel anytime'].map((item, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Get Bundle Access</Link>
              <div style={{ marginTop: 16, fontSize: 13, color: 'var(--lp-text3)' }}>No credit card required to start</div>
            </div>

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
            YOUR AVIATION CAREER STARTS HERE
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 620, margin: '0 auto 20px' }}>
            Every Written. <span className="lp-accent">One Subscription.</span>
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.7 }}>
            PAR, IRA, and CAX. Start free today — no credit card needed.
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
