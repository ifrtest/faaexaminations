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
    q: 'Are the practice questions up to date?',
    a: 'Yes. Our question bank is current for 2026 and reflects the latest FAA Instrument Rating knowledge test content, including updated IFR procedures, approach formats, and regulations. We update whenever the FAA revises the test.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Yes. No contracts, no commitments. Cancel from your dashboard in one click. Most students complete their prep in 4–6 weeks.',
  },
];

const checkSvg = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
    <circle cx="12" cy="12" r="12" fill="rgba(48,172,226,0.15)" />
    <path d="M7 12l4 4 6-6" stroke="#30ace2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function IRALanding() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    if (window.fbq) fbq('track', 'ViewContent', { content_name: 'Instrument Rating (IRA)', content_ids: ['ira'], content_type: 'product', value: 24.99, currency: 'USD' });
    import('./IRAPracticeTest').catch(() => {});
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
        <title>FAA Instrument Rating Written Test Prep — 821 Questions | FAAExaminations.com</title>
        <meta name="description" content="Pass your FAA Instrument Rating knowledge test first try. 821 practice questions, IFR charts, approach procedures, and AI instructor support. $24.99/month. Cancel anytime." />
        <link rel="canonical" href="https://faaexaminations.com/ira" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/ira" />
        <meta property="og:title" content="FAA Instrument Rating Written Test Prep — Pass First Try" />
        <meta property="og:description" content="821 IFR practice questions, approach procedures, charts, and AI instructor. Pass your FAA Instrument Rating written exam. $24.99/month." />
        <meta property="og:image" content="https://faaexaminations.com/plane-ira.jpg" />
        <meta property="og:image:width" content="2400" />
        <meta property="og:image:height" content="1792" />
        <meta property="og:image:alt" content="Instrument Rating FAA exam prep — FAAExaminations.com" />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://faaexaminations.com/plane-ira.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://faaexaminations.com" },
            { "@type": "ListItem", "position": 2, "name": "Instrument Rating (IRA)", "item": "https://faaexaminations.com/ira" }
          ]
        })}</script>
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
              <Link to="/register?plan=ira" className="lp-nav-cta">Subscribe →</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero lp-hero-ira" style={{ backgroundImage: 'url(/plane-ira.webp)', backgroundSize: 'cover', backgroundPosition: 'center 40%' }}>
        <div className="lp-hero-bg" style={{ background: 'linear-gradient(135deg,rgba(5,88,102,0.42) 0%,rgba(8,14,20,0.38) 55%,rgba(8,14,20,0.18) 100%)', position: 'absolute', inset: 0 }} />
        <div className="lp-hero-grid" />
        <div className="lp-hero-split">
          {/* LEFT */}
          <div className="lp-hero-content">
            <div className="lp-hero-badge">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>
              INSTRUMENT RATING · FAA KNOWLEDGE TEST PREP · 2026
            </div>
            <h1>Pass Your <span className="lp-accent">IFR Written</span><br />Exam<br />First Try</h1>
            <p className="lp-hero-sub">
              821 questions covering every IFR topic the FAA tests. Built for pilots who already fly and just need the written out of the way — full explanations, timed simulator, and AI instructor support.
            </p>
            <div className="lp-hero-btns">
              <Link to="/register?plan=ira" className="lp-btn-hero">
                <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
                Subscribe — $24.99/mo
              </Link>
              <a href="#includes" className="lp-btn-outline">See What's Included</a>
            </div>
            <div style={{ marginTop: 14 }}>
              <Link to="/register" style={{ color: 'var(--lp-blue)', fontSize: 14, opacity: 0.85 }}>Try 30 free questions — just enter your email →</Link>
            </div>
            <div className="lp-hero-stats">
              <div><div className="lp-hs-val">821</div><div className="lp-hs-lbl">IRA Questions</div></div>
              <div><div className="lp-hs-val">11</div><div className="lp-hs-lbl">Study Modules</div></div>
              <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
              <div><div className="lp-hs-val">IFR</div><div className="lp-hs-lbl">Charts Included</div></div>
            </div>
          </div>

          {/* RIGHT — pricing card (desktop only) */}
          <div className="lp-hero-pricing-card">
            <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lp-blue)', color: '#fff', padding: '5px 18px', borderRadius: 20, fontSize: 11, fontWeight: 700, fontFamily: 'Share Tech Mono, monospace', letterSpacing: 1, whiteSpace: 'nowrap' }}>MOST STUDENTS PASS IN 3–6 WEEKS</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 6, textAlign: 'center', marginTop: 8 }}>Instrument Rating Package</div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 58, fontWeight: 900, color: '#fff', lineHeight: 1, textAlign: 'center' }}>$24.99</div>
            <div style={{ fontSize: 13, marginBottom: 24, textAlign: 'center', color: 'var(--lp-text3)' }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
              {['821 Instrument Rating practice questions', 'IFR charts & approach plate questions', 'Timed FAA exam simulator', 'Full explanations on every question', 'AI CFII instructor support', 'All FAA IFR references included', 'Access on any device', 'Cancel anytime — no contracts'].map((item, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, color: 'var(--lp-text)', fontSize: 14 }}>
                  {checkSvg}{item}
                </li>
              ))}
            </ul>
            <Link to="/register?plan=ira" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 16, padding: '15px 28px' }}>Subscribe — $24.99/mo →</Link>
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)', textAlign: 'center' }}>Or <Link to="/register" style={{ color: 'var(--lp-blue)', textDecoration: 'underline' }}>try 30 free questions</Link> — just enter your email</div>
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
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>Not ready to commit? Try 30 real IRA questions first.</div>
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
              { quote: "The IRA written is no joke. I'd tried studying with books and kept losing track. This question bank forced me to actually understand the material. Passed with a 79%.", name: 'Chris M.', role: 'Instrument-rated pilot, Georgia' },
              { quote: "Failed my first attempt at the IRA written elsewhere. Found this, focused on my weak areas for two weeks, passed with an 84%. Night and day difference.", name: 'Tyler J.', role: 'Instrument-rated pilot, Arizona' },
              { quote: "Hold entries, approach plates, weather minimums — it's a lot. The topic breakdown let me drill exactly what I was weak on instead of redoing everything.", name: 'Sarah K.', role: 'IFR student pilot, Illinois' },
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

      {/* PRICING — mobile only (desktop sees hero card) */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="pricing" className="lp-pricing-section">
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
            <Link to="/register?plan=ira" className="lp-btn-hero" style={{ display: 'block', textAlign: 'center', fontSize: 18, padding: '18px 40px' }}>Subscribe — $24.99/mo →</Link>
            <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: 12, color: 'var(--lp-blue)', fontSize: 14, textDecoration: 'underline' }}>Try 30 free questions — just enter your email</Link>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}><Link to="/cancel-policy" style={{ color: 'inherit', textDecoration: 'underline', opacity: 0.75 }}>Pass guarantee</Link> · Cancel anytime</div>
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
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>, title: '821 IRA Practice Questions', desc: "Built from the FAA's official Airman Knowledge Testing database. Every question the real exam can draw from — with full explanations on every answer. Current for 2026." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>, title: 'IFR Charts & Approach Plates', desc: "Navigate IFR en route charts, SIDs, STARs, and instrument approach procedures. We cover the chart reading skills the FAA tests directly." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z"/></svg>, title: 'Weather & Meteorology', desc: "METARs, TAFs, PIREPs, SIGMETs, AIRMETs, and weather charts. The IRA tests weather extensively — we make sure you know it cold." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Timed Exam Simulator', desc: "Simulate the real 2.5-hour, 60-question FAA test. Track your score by topic and keep drilling your weak areas until you're consistently above 80%." },
              { svg: <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, title: 'AI CFII Instructor Support', desc: "Ask our AI instrument instructor anything. From hold entries to partial panel flying — it explains like a real CFII, not a textbook." },
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
          <p className="lp-section-sub">Real IRA practice questions, full explanations, and a dashboard that shows exactly where you stand.</p>
          <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28, marginTop: 52 }}>

            {/* MOCKUP 1: Question */}
            <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 16, overflow: 'hidden' }}>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 16px', borderBottom: '1px solid var(--lp-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>IRA · Study Mode · Question 14 of 60</span>
              </div>
              <div style={{ padding: '24px 24px 28px' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ background: 'var(--lp-blue)', color: '#fff', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, letterSpacing: 1 }}>IRA</span>
                  <span style={{ background: 'rgba(48,172,226,0.12)', color: 'var(--lp-blue)', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600 }}>📘 Instrument Approaches</span>
                </div>
                <p style={{ color: '#fff', fontSize: 15, fontWeight: 600, lineHeight: 1.6, marginBottom: 20 }}>
                  When executing a missed approach, climb is initiated at what point on a precision approach?
                </p>
                {[
                  { l: 'A', text: 'When the runway environment is not in sight at DA', correct: true },
                  { l: 'B', text: 'At the missed approach point (MAP)' },
                  { l: 'C', text: 'When the runway centerline is not visible' },
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
                <span style={{ marginLeft: 8, fontSize: 12, color: 'var(--lp-text3)', fontFamily: 'Share Tech Mono, monospace' }}>Full Explanation + AI CFII</span>
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ background: 'rgba(48,172,226,0.08)', border: '1px solid rgba(48,172,226,0.25)', borderRadius: 10, padding: '16px 18px', marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-blue)', letterSpacing: 1, marginBottom: 8 }}>EXPLANATION</div>
                  <p style={{ color: 'var(--lp-text)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    On a precision approach (ILS/GLS), the missed approach is initiated at the <strong style={{ color: '#fff' }}>Decision Altitude (DA)</strong> if the runway environment is not in sight. DA replaces DH in modern terminology — it's a point, not a height above touchdown.
                  </p>
                </div>
                <div style={{ background: 'rgba(247,201,72,0.06)', border: '1px solid rgba(247,201,72,0.2)', borderRadius: 10, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <span style={{ fontSize: 16 }}>🤖</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#F7C948', letterSpacing: 1 }}>AI CFII</span>
                  </div>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    Think of DA as your "go/no-go" decision point on a precision approach. If you hit DA and can't see the runway environment — lights, threshold, anything — you immediately execute the missed approach. Don't wait. Hesitation at DA kills.
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
                        strokeDasharray={`${0.71 * 2 * Math.PI * 32} ${2 * Math.PI * 32}`}
                        transform="rotate(-90 40 40)" />
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 800, color: '#3B82F6', lineHeight: 1 }}>71</span>
                      <span style={{ fontSize: 9, color: 'var(--lp-text3)', letterSpacing: 1 }}>READY</span>
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Almost there — keep drilling</div>
                    <div style={{ color: 'var(--lp-text3)', fontSize: 13 }}>412 questions answered · 12 days streak</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>WEAK TOPICS TO REVIEW</div>
                {[
                  { topic: 'Instrument Approaches', pct: 58 },
                  { topic: 'IFR En Route Charts', pct: 63 },
                  { topic: 'Weather Services', pct: 67 },
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
            <Link to="/register?plan=ira" className="lp-btn-hero" style={{ fontSize: 17, padding: '16px 40px' }}>Subscribe — $24.99/mo →</Link>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section style={{ padding: '90px 40px', background: 'rgba(5,88,102,0.10)', borderTop: '1px solid var(--lp-border)', borderBottom: '1px solid var(--lp-border)' }} id="topics">
        <div className="lp-section-inner">
          <div className="lp-badge">ALL 11 TOPICS COVERED</div>
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
              { n: '1', title: 'Create Your Free Account', desc: 'Sign up in 30 seconds. Try 30 free IRA practice questions instantly — no credit card required. See exactly how the platform works before you commit.' },
              { n: '2', title: 'Work Through the Modules', desc: 'Study topic by topic — IFR charts, weather, regulations, approaches. Every wrong answer has a full explanation. Ask the AI CFII anything you don\'t understand.' },
              { n: '3', title: 'Pass Your IRA Written', desc: 'When you\'re consistently scoring above 80% on our simulator, you\'re ready. Walk into your testing appointment confident — you\'ve already seen everything they\'ll ask.' },
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
            YOUR IFR TICKET STARTS HERE
          </div>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 54px)', maxWidth: 600, margin: '0 auto 20px' }}>
            Your <span className="lp-accent">Instrument Rating</span> Starts Here
          </h2>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>821 questions. Every IFR topic. Everything the FAA will ask you. Try 30 free questions first — subscribe when ready.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?plan=ira" className="lp-btn-hero" style={{ fontSize: 18, padding: '18px 44px' }}>
              <svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>
              Subscribe — $24.99/mo
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
