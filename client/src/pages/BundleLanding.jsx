import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Helmet } from 'react-helmet-async';

const FAQS = [
  {
    q: 'What\'s included in the Bundle?',
    a: 'Private Pilot (PAR), Instrument Rating (IRA), and Commercial Pilot (CAX) — all three pilot certificate exams in one subscription. 2,826 practice questions, all study modules, timed simulators, and AI instructor support across all three exams.',
  },
  {
    q: 'Are the practice questions up to date for 2026?',
    a: 'Yes. The question bank is current for 2026 and reflects the latest FAA Airman Certification Standards (ACS). We update content whenever the FAA revises its testing standards.',
  },
  {
    q: 'Is the bundle cheaper than buying separately?',
    a: 'Yes. Individual packages are $24.99/month each. PAR + IRA + CAX separately would cost $74.97/month. The bundle gives you all three for $39.99/month — saving you $35 every month.',
  },
  {
    q: 'Do I have to take all three exams right away?',
    a: 'No. Subscribe and study at your own pace. Most students start with PAR, then move to IRA after earning their Private certificate. You get access to everything from day one — use what you need, when you need it.',
  },
  {
    q: 'What if I only need one exam right now?',
    a: 'If you\'re only focused on one exam, an individual package at $24.99/month is the better value. The bundle makes sense if you\'re working toward multiple certificates or want everything available without switching plans.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click. Your access continues until the end of your billing period.',
  },
];

export default function BundleLanding() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (window.fbq) fbq('track', 'ViewContent', { content_name: 'All 3 Exams Bundle', content_ids: ['bundle'], content_type: 'product', value: 39.99, currency: 'USD' });
    import('./Checkout').catch(() => {});
  }, []);

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
        <meta name="description" content="All three FAA pilot certificate exams in one subscription. Private Pilot, Instrument Rating, and Commercial Pilot. 2,826 questions. $39.99/month — save $35/month." />
        <link rel="canonical" href="https://faaexaminations.com/bundle" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/bundle" />
        <meta property="og:title" content="FAA Pilot Certificate Bundle — PAR + IRA + CAX" />
        <meta property="og:description" content="All three FAA pilot certificate exams in one subscription. 2,826 practice questions, timed simulators, AI instructor. Save $35/month vs individual." />
        <meta property="og:image" content="https://faaexaminations.com/plane-bundle.jpg" />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1792" />
        <meta property="og:image:alt" content="FAA Pilot Certificate Bundle — FAAExaminations.com" />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://faaexaminations.com/plane-bundle.jpg" />
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
              <Link to="/register?plan=bundle" className="lp-nav-cta">Subscribe →</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero lp-hero-bundle" style={{ backgroundImage: 'url(/plane-bundle.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 35%' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,40,80,0.55) 0%,rgba(8,14,20,0.45) 55%,rgba(8,14,20,0.25) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-split">

          {/* LEFT — headline + stats */}
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
              <Link to="/register?plan=bundle" className="lp-btn-hero">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
                Start 3 Days Free
              </Link>
              <a href="#includes" className="lp-btn-outline">See What's Included</a>
            </div>
            <div style={{ marginTop: 14 }}>
              <Link to="/register" style={{ color: 'var(--lp-blue)', fontSize: 14, opacity: 0.85 }}>Try 30 free questions — just enter your email →</Link>
            </div>
            <div className="lp-hero-stats">
              <div><div className="lp-hs-val">2,826</div><div className="lp-hs-lbl">Total Questions</div></div>
              <div><div className="lp-hs-val">3</div><div className="lp-hs-lbl">FAA Exams Covered</div></div>
              <div><div className="lp-hs-val">$35</div><div className="lp-hs-lbl">Saved vs Individual</div></div>
              <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
            </div>
          </div>

          {/* RIGHT — pricing card (desktop only) */}
          <div className="lp-hero-pricing-card">
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>SAVE $35/MONTH VS INDIVIDUAL</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, textAlign: 'center', marginTop: 8 }}>Pilot Certificate Bundle</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$39.99</span>
            </div>
            <div style={{ fontSize: 13, marginBottom: 6, textAlign: 'center', color: 'var(--lp-text3)' }}>per month · Cancel anytime</div>
            <div style={{ fontSize: 12, marginBottom: 22, textAlign: 'center', color: '#16a34a', fontWeight: 700 }}>
              <span style={{ textDecoration: 'line-through', color: 'var(--lp-text3)', fontWeight: 400 }}>$74.97</span> if bought separately
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['PAR + IRA + CAX included', '2,826 practice questions', 'AI instructor for all exams', 'All timed exam simulators', 'All FAA references included', 'Questions current for 2026', 'Cancel anytime'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--lp-text)', fontSize: 14 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?plan=bundle" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 16, padding: '15px 28px' }}>Start 3 Days Free →</Link>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)', textAlign: 'center' }}>Or <Link to="/register" style={{ color: 'var(--lp-blue)', textDecoration: 'underline' }}>try 30 free questions</Link> — just enter your email</div>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--lp-text3)', textAlign: 'center' }}>3-day free trial · Card required · Cancel anytime</div>
          </div>

        </div>
      </section>

      {/* FREE PRACTICE TEST BANNER */}
      <section style={{ background: 'linear-gradient(135deg, #0d2a1f 0%, #0a1f2e 100%)', borderTop: '1px solid rgba(52,211,153,0.25)', borderBottom: '1px solid rgba(52,211,153,0.25)', padding: '36px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.4)', borderRadius: 20, padding: '3px 14px', fontSize: 11, fontWeight: 700, color: '#34d399', letterSpacing: 1, fontFamily: 'Share Tech Mono, monospace' }}>FREE — JUST YOUR EMAIL</div>
            </div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Not ready to commit? Try 30 real PAR questions first.</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>Same questions, same format as the real FAA exam — free, instant, no credit card.</div>
          </div>
          <Link to="/register" style={{ background: '#34d399', color: '#041018', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5 }}>Start Free Practice Test →</Link>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px 24px', background: 'var(--lp-dark)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-inner">
          <div className="lp-badge" style={{ textAlign: 'center', margin: '0 auto 12px' }}>STUDENT RESULTS</div>
          <h2 style={{ textAlign: 'center', marginBottom: 48 }}>Real People. Real Passes.</h2>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { quote: "Got all three done in four months. PAR, IRA, CAX — one subscription the whole way through. Way cheaper than buying them separately and the question banks are excellent.", name: 'Kevin A.', role: 'Commercial pilot, Virginia' },
              { quote: "The bundle made sense for me because I knew I was going all the way to commercial. Knocked out PAR first, then kept the subscription going. Passed all three first try.", name: 'Sophie L.', role: 'Commercial student pilot' },
              { quote: "I compared every prep course out there. This was the most focused on the actual exams and by far the best value. The 3-day free trial sealed it.", name: 'Tom B.', role: 'Flight school student, Washington' },
              { quote: "Studied PAR for 3 weeks, took a month break, came back for IRA. The subscription just kept running and everything was still there. No hassle at all.", name: 'Isabelle R.', role: 'Instrument-rated pilot' },
              { quote: "The AI instructor alone is worth the price. I'd hit a confusing question, ask it to explain, and get a clear answer in seconds. That saved me a ton of time over 3 exams.", name: 'Noah P.', role: 'Commercial pilot candidate' },
              { quote: "Failed PAR once before finding this. Switched, passed PAR, then went straight through IRA and CAX without ever switching platforms. Best decision I made.", name: 'Chloe W.', role: 'Commercial student, Michigan' },
            ].map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--lp-border)', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 3 }}>{[...Array(5)].map((_, s) => <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill="#f5c842"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>)}</div>
                <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.7, margin: 0, flex: 1 }}>"{t.quote}"</p>
                <div><div style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{t.name}</div><div style={{ color: 'var(--lp-text3)', fontSize: 12, marginTop: 2 }}>{t.role}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING — mobile only */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }} id="pricing" className="lp-pricing-section">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">PRICING</div>
          <h2>Simple, Honest Pricing</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto 52px' }}>All three exams. One subscription. <strong style={{ color: '#16a34a' }}>Save $35/month.</strong></p>
          <div className="fade-up" style={{ maxWidth: 440, margin: '0 auto', background: 'rgba(48,172,226,0.06)', border: '2px solid var(--lp-border2)', borderRadius: 20, padding: '48px 40px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)', background: '#16a34a', color: '#fff', padding: '6px 20px', borderRadius: 20, fontSize: 12, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>SAVE $35/MONTH VS INDIVIDUAL</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>Pilot Certificate Bundle</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, justifyContent: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 64, fontWeight: 900, color: '#fff', lineHeight: 1 }}>$39.99</span>
            </div>
            <div style={{ fontSize: 14, marginBottom: 6 }}>
              <span style={{ color: 'var(--lp-text3)' }}>per month · </span>
              <span style={{ color: '#16a34a', fontWeight: 700 }}>Cancel anytime</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginBottom: 32 }}>
              <span style={{ textDecoration: 'line-through' }}>$74.97</span> if bought separately
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 36px', textAlign: 'left' }}>
              {['PAR + IRA + CAX included', '2,826 practice questions', 'AI instructor for all exams', 'All timed exam simulators', 'All FAA references included', 'Questions current for 2026', 'Cancel anytime'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, color: 'var(--lp-text)', fontSize: 15 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" /><path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/register?plan=bundle" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Start 3 Days Free →</Link>
            <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--lp-blue)', fontSize: 14, textDecoration: 'underline' }}>Try 30 free questions — just enter your email</Link>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · Card required · Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }} id="includes">
        <div className="lp-section-inner">
          <div className="lp-badge">WHAT'S IN THE BUNDLE</div>
          <h2>All Three Pilot Certificate Exams in One</h2>
          <p className="lp-section-sub">Every exam on your path from student pilot to Commercial Pilot certificate — fully covered in one subscription.</p>

          {/* Per-exam cards */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginTop: 52 }}>
            {[
              {
                svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>,
                badge: 'PAR', title: 'Private Pilot', questions: '1,469 questions',
                desc: 'Complete prep for the FAA Private Pilot Airman Knowledge Test. 11 modules covering the full FAA syllabus.', url: '/par',
              },
              {
                svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>,
                badge: 'IRA', title: 'Instrument Rating', questions: '821 questions',
                desc: 'IFR procedures, approach charts, weather, and regulations. The most challenging FAA written — mastered here.', url: '/ira',
              },
              {
                svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
                badge: 'CAX', title: 'Commercial Pilot', questions: '536 questions',
                desc: 'Performance, weight & balance, 14 CFR commercial operations, and advanced flight planning.', url: '/cax',
              },
            ].map((pkg, i) => (
              <div key={i} style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 14, padding: '32px 28px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 800, fontFamily: 'Share Tech Mono, monospace' }}>{pkg.badge}</div>
                <span className="lp-feat-icon" style={{ display: 'block', marginBottom: 16 }}>{pkg.svg}</span>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{pkg.title}</div>
                <div style={{ color: 'var(--lp-blue)', fontSize: 13, fontWeight: 600, marginBottom: 12, fontFamily: 'Share Tech Mono, monospace' }}>{pkg.questions}</div>
                <div style={{ color: 'var(--lp-text2)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>{pkg.desc}</div>
                <Link to={pkg.url} style={{ color: 'var(--lp-blue)', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Learn more →</Link>
              </div>
            ))}
          </div>

          {/* Feature grid */}
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginTop: 48 }}>
            {[
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'One AI Instructor for All Exams', desc: 'Ask anything across PAR, IRA, and CAX. One AI CFII covers every topic — from basic aerodynamics to IFR procedures to commercial regulations.' },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Three Timed Simulators', desc: 'Separate exam simulators for each certificate, each timed to match the real exam. Practice under real conditions for every test you\'ll take.' },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, title: 'Progress Tracking Across All Exams', desc: 'Your dashboard shows readiness scores, weak topics, and exam history for every certificate — all in one place.' },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, title: 'All FAA References Included', desc: 'PHAK, AIM, IFH, 14 CFR, and all ACS documents across every exam. No need to hunt down separate PDFs — everything is here.' },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>, title: 'Study Anywhere', desc: 'Fully responsive on phone, tablet, and desktop. Study between flights, on your lunch break, or the night before your exam. No app download needed.' },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Best Value for Career Pilots', desc: 'If your goal is a Commercial certificate, you\'ll need all three exams anyway. The bundle saves you $35/month and keeps everything in one subscription.' },
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
          <p className="lp-section-sub">Real FAA questions, full explanations, and a single dashboard that tracks your progress across all three certificates.</p>

          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 52 }}>

            {/* MOCKUP 1: PAR Question */}
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
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>✈️ Weather</span>
                </div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  What weather phenomenon is always associated with a thunderstorm?
                </p>
                {[
                  { l: 'A', text: 'Heavy rain at the surface' },
                  { l: 'B', text: 'Lightning', correct: true },
                  { l: 'C', text: 'Turbulence above 15,000 ft MSL' },
                ].map(({ l, text, correct }) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 8, marginBottom: 8, border: `1px solid ${correct ? 'rgba(48,172,226,0.5)' : 'var(--lp-border)'}`, background: correct ? 'rgba(48,172,226,0.08)' : 'rgba(255,255,255,0.03)', cursor: 'default' }}>
                    <span style={{ width: 26, height: 26, borderRadius: '50%', background: correct ? 'var(--lp-blue)' : 'rgba(255,255,255,0.08)', color: correct ? '#fff' : 'var(--lp-text2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{l}</span>
                    <span style={{ color: correct ? '#fff' : 'var(--lp-text2)', fontSize: 14 }}>{text}</span>
                    {correct && <span style={{ marginLeft: 'auto', color: 'var(--lp-blue)', fontSize: 13, fontWeight: 700 }}>✓ Correct</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* MOCKUP 2: IRA Explanation */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>IRA · Study Mode · Explanation</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  <span style={{ background: '#16a34a', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>IRA</span>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>🌧️ IFR Charts</span>
                </div>
                <div style={{ background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 10, padding: '14px 16px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#4ade80', fontWeight: 700, marginBottom: 6, fontFamily: 'Share Tech Mono, monospace' }}>✓ CORRECT — NICE WORK</div>
                  <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.6 }}>The DA (Decision Altitude) on a precision approach is the altitude at which you must either see the runway environment or execute the missed approach. It is referenced to MSL, unlike MDA which is used on non-precision approaches.</div>
                </div>
                <div style={{ background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: 12, color: 'var(--lp-blue)', fontWeight: 700, marginBottom: 6, fontFamily: 'Share Tech Mono, monospace' }}>🤖 AI INSTRUCTOR</div>
                  <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.6 }}>Think of DA as a "go/no-go" decision point on ILS approaches. Once you reach DA, if you can't see the approach lights or runway, you climb immediately on the missed approach procedure.</div>
                </div>
              </div>
            </div>

            {/* MOCKUP 3: Bundle dashboard */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>Dashboard · Bundle Progress</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginBottom: 16, fontFamily: 'Share Tech Mono, monospace' }}>YOUR READINESS SCORES</div>
                {[
                  { badge: 'PAR', label: 'Private Pilot', pct: 84, color: '#30ace2' },
                  { badge: 'IRA', label: 'Instrument Rating', pct: 61, color: '#f5c842' },
                  { badge: 'CAX', label: 'Commercial Pilot', pct: 23, color: '#94a3b8' },
                ].map(({ badge, label, pct, color }) => (
                  <div key={badge} style={{ marginBottom: 18 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ background: 'var(--lp-blue)', color: '#fff', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800, fontFamily: 'Share Tech Mono, monospace' }}>{badge}</span>
                        <span style={{ color: 'var(--lp-text2)', fontSize: 13 }}>{label}</span>
                      </div>
                      <span style={{ color, fontSize: 13, fontWeight: 700 }}>{pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, background: 'rgba(48,172,226,0.06)', border: '1px solid var(--lp-border)', borderRadius: 8, padding: '12px 14px' }}>
                  <div style={{ fontSize: 12, color: 'var(--lp-blue)', fontWeight: 700, marginBottom: 4 }}>WEAK TOPIC — PAR</div>
                  <div style={{ fontSize: 13, color: 'var(--lp-text2)' }}>Weather: 58% correct · 12 questions recommended</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">HOW IT WORKS</div>
          <h2>From Sign-Up to All Three Certificates</h2>
          <p className="lp-section-sub">One account. Study at your own pace. Pass each exam when you're ready.</p>
          <div className="lp-steps fade-up" style={{ marginTop: 52 }}>
            {[
              { n: '01', title: 'Create Your Free Account', desc: 'Sign up in under a minute — no credit card required. Try 30 free PAR practice questions immediately to see exactly what studying looks like.', img: '/plane-step1.jpg' },
              { n: '02', title: 'Subscribe to the Bundle', desc: 'Unlock PAR, IRA, and CAX instantly. Start with Private Pilot, work through Instrument Rating, and finish with Commercial — all on your schedule.', img: '/plane-step2.jpg' },
              { n: '03', title: 'Pass All Three Exams', desc: 'Track your readiness score on the dashboard. When you\'re consistently scoring above 80%, you\'re ready to book the real exam. Most students pass first try.', img: '/plane-step3.jpg' },
            ].map((s) => (
              <div key={s.n} className="lp-step">
                <div className="lp-step-num">{s.n}</div>
                <div className="lp-step-content">
                  <div className="lp-step-title">{s.title}</div>
                  <p className="lp-step-desc">{s.desc}</p>
                </div>
                <img src={s.img} alt={s.title} className="lp-step-img" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-dark)', borderTop: '1px solid var(--lp-border)' }} id="faq">
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
            PAR, IRA, and CAX. Try 30 free questions first — subscribe when ready.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?plan=bundle" className="lp-btn-hero" style={{ fontSize: 18, padding: '18px 44px' }}>
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Start 3 Days Free
            </Link>
            <Link to="/register" style={{ background: '#34d399', color: '#041018', fontWeight: 800, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none', whiteSpace: 'nowrap', fontFamily: 'Barlow Condensed, sans-serif', letterSpacing: 0.5 }}>Try 30 Free Questions →</Link>
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
