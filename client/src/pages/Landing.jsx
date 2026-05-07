import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const CHEATSHEET_PLANS = [
  { value: 'par', label: 'Private Pilot (PAR)' },
  { value: 'ira', label: 'Instrument Rating (IRA)' },
  { value: 'cax', label: 'Commercial Pilot (CAX)' },
  { value: 'uag', label: 'Part 107 Remote Pilot' },
];

function CheatSheetCapture() {
  const [email, setEmail]   = useState('');
  const [plan,  setPlan]    = useState('par');
  const [state, setState]   = useState('idle'); // idle | loading | done | error
  const [errMsg, setErrMsg] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErrMsg('');
    setState('loading');
    try {
      const res = await fetch('/api/cheatsheet/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), plan }),
      });
      const data = await res.json();
      if (data.ok) {
        setState('done');
      } else {
        setErrMsg(data.error || 'Something went wrong.');
        setState('error');
      }
    } catch {
      setErrMsg('Could not connect. Please try again.');
      setState('error');
    }
  };

  return (
    <section style={{ padding: '80px 40px', background: 'linear-gradient(135deg, #0d1f30 0%, #0b1622 100%)', borderTop: '1px solid #1e2d3d', borderBottom: '1px solid #1e2d3d' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(48,172,226,0.12)', color: '#30ace2', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: 20, marginBottom: 20, border: '1px solid rgba(48,172,226,0.25)' }}>
          FREE DOWNLOAD
        </div>
        <h2 style={{ color: '#fff', fontSize: 'clamp(22px, 4vw, 36px)', marginBottom: 14, fontWeight: 800, lineHeight: 1.2 }}>
          Get Your Free FAA Exam Cheat Sheet
        </h2>
        <p style={{ color: '#7a9ab5', fontSize: 16, lineHeight: 1.7, marginBottom: 36, maxWidth: 520, margin: '0 auto 36px' }}>
          Every key number, rule, formula, and acronym you need for the FAA written — organized by topic. Enter your email and we'll send it to you instantly.
        </p>

        {state === 'done' ? (
          <div style={{ background: 'rgba(48,172,226,0.1)', border: '1px solid rgba(48,172,226,0.3)', borderRadius: 12, padding: '28px 32px' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>✉️</div>
            <div style={{ color: '#fff', fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Check your inbox!</div>
            <div style={{ color: '#7a9ab5', fontSize: 15 }}>We sent a confirmation link to <strong style={{ color: '#a0c4d8' }}>{email}</strong>. Click it to get your cheat sheet.</div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 480, margin: '0 auto' }}>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              style={{ padding: '13px 16px', borderRadius: 10, border: '1px solid #2a3f54', background: '#0f1e2e', color: '#fff', fontSize: 15, outline: 'none' }}
            >
              {CHEATSHEET_PLANS.map(p => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: '13px 16px', borderRadius: 10, border: '1px solid #2a3f54', background: '#0f1e2e', color: '#fff', fontSize: 15, outline: 'none' }}
              />
              <button
                type="submit"
                disabled={state === 'loading'}
                style={{ padding: '13px 24px', borderRadius: 10, background: '#30ace2', color: '#041018', fontWeight: 700, fontSize: 15, border: 'none', cursor: state === 'loading' ? 'not-allowed' : 'pointer', opacity: state === 'loading' ? 0.7 : 1, whiteSpace: 'nowrap' }}
              >
                {state === 'loading' ? 'Sending…' : 'Send My Cheat Sheet →'}
              </button>
            </div>
            {state === 'error' && <div style={{ color: '#f87171', fontSize: 14 }}>{errMsg}</div>}
            <div style={{ color: '#4a6378', fontSize: 12 }}>No spam. Unsubscribe anytime.</div>
          </form>
        )}
      </div>
    </section>
  );
}

const HERO_IMAGES = ['/plane-hero-4.webp', '/plane-hero-2.webp', '/plane-hero-3.webp', '/plane-hero-5.webp'];

export default function Landing() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);
  const [loadedIdx, setLoadedIdx] = useState(new Set([0]));

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((i) => {
        const next = (i + 1) % HERO_IMAGES.length;
        setLoadedIdx((s) => new Set([...s, next]));
        return next;
      });
    }, 7000);
    return () => clearInterval(timer);
  }, []);

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
    if (window.location.hash) {
      const el = document.getElementById(window.location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
    }
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
      {/* NAV */}
      <nav className="lp-nav" id="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <a href="#products" className="lp-nav-link">Products</a>
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#how" className="lp-nav-link">How It Works</a>
          <a href="#testimonials" className="lp-nav-link">Reviews</a>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
          <Link to="/references" className="lp-nav-link">Free References</Link>
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
      <section className="lp-hero">
        <div className="lp-hero-bg">
          {HERO_IMAGES.map((src, i) => (
            <img key={src} src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'low'} decoding={i === 0 ? 'sync' : 'async'} style={{ opacity: i === heroIdx ? 0.75 : 0 }} />
          ))}
        </div>
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" style={{marginRight:5,verticalAlign:'middle'}}><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg> FAA KNOWLEDGE TEST PREP · 2026 UPDATED</div>
          <h1>Pass Your <span className="lp-accent">FAA Written</span><br />Exam First Try</h1>
          <p className="lp-hero-sub">
            Most student pilots study for weeks with the wrong materials and still fail. FAAExaminations.com gives you the exact questions the FAA will ask — with a real explanation for every single one. Pass in 2–4 weeks, not months.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-btn-hero"><svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>Start Free Today</Link>
            <a href="#products" className="lp-btn-outline">View Packages</a>
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 14, lineHeight: 2 }}>
            Pass guarantee · Cancel anytime
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">Est. 2020</div><div className="lp-hs-lbl">Trusted Since</div></div>
            <div><div className="lp-hs-val">3,000+</div><div className="lp-hs-lbl">Practice Questions</div></div>
            <div><div className="lp-hs-val">5</div><div className="lp-hs-lbl">Exam Types</div></div>
            <div><div className="lp-hs-val">AI</div><div className="lp-hs-lbl">Instructor Included</div></div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="lp-products-bg" id="products">
        <div className="lp-section-inner">
          <div className="lp-badge">STUDY PACKAGES</div>
          <h2>Choose Your Package</h2>
          <p className="lp-section-sub">Expertly crafted modules for Private and Commercial certificates. All FAA references included — no textbooks needed.</p>
          <div className="lp-products-grid fade-up">

            <div className="lp-product-card lp-featured lp-product-bundle">
              <div className="lp-product-img">
                <img src="/plane-bundle.webp" alt="Pilot Certificate Bundle — PAR, IRA, and CAX exam prep combined" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Pilot Certificate Bundle — PAR + IRA + CAX</div>
                <div className="lp-product-desc">Full access to all three pilot certificate exams. Perfect for instructors, license converters, and career-track pilots. <Link to="/bundle" style={{ color: 'var(--lp-blue)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more →</Link></div>
                <ul className="lp-product-features">
                  <li>2,826 PAR + IRA + CAX questions</li>
                  <li>All PAR, IRA &amp; CAX modules</li>
                  <li>AI Instructor explanations</li>
                  <li>Timed exam simulator</li>
                  <li>Progress dashboard &amp; tracking</li>
                  <li>Best value — save vs. individual</li>
                </ul>
                <div className="lp-product-price" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ textDecoration: 'line-through', opacity: 0.45, fontSize: '1.2rem' }}>$74.97</span>
                  $39.99
                  <span style={{ fontSize: 13, fontWeight: 400, color: '#16A34A', background: 'rgba(22,163,74,0.12)', padding: '3px 10px', borderRadius: 20 }}>Save $35/month</span>
                </div>
                <div className="lp-product-price-sub">Pass guarantee · Cancel anytime</div>
                <Link to="/register?plan=bundle" className="lp-btn-product lp-btn-product-primary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-par.webp" alt="Private Pilot — FAA Private Pilot Airman Knowledge Test prep" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Private Pilot Package</div>
                <div className="lp-product-desc">1,469 questions across 11 topics — every concept the FAA can test you on. Practice by topic, track your weak areas, and run timed mock exams until 70% feels easy. <Link to="/par" style={{ color: 'var(--lp-blue)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more →</Link></div>
                <ul className="lp-product-features">
                  <li>1,469 Private Pilot questions</li>
                  <li>11 categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full FAA references provided</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Pass guarantee · Cancel anytime</div>
                <Link to="/register?plan=par" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-ira.webp" alt="Instrument Rating — FAA IRA Airman Knowledge Test prep" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Instrument Rating Package</div>
                <div className="lp-product-desc">900+ questions covering every IFR topic — holds, approaches, weather, charts, and regs. Built for pilots who already fly and need to prove it on paper. <Link to="/ira" style={{ color: 'var(--lp-blue)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more →</Link></div>
                <ul className="lp-product-features">
                  <li>821 Instrument Rating questions</li>
                  <li>Categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full FAA references provided</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Pass guarantee · Cancel anytime</div>
                <Link to="/register?plan=ira" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-cax.webp" alt="Commercial Pilot — FAA CAX Airman Knowledge Test prep" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Commercial Pilot Package</div>
                <div className="lp-product-desc">1,000+ questions on performance, advanced regs, and commercial operations. The CAX is the hardest of the three — this bank covers everything they'll throw at you. <Link to="/cax" style={{ color: 'var(--lp-blue)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more →</Link></div>
                <ul className="lp-product-features">
                  <li>536 Commercial Pilot questions</li>
                  <li>11 categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full 14 CFR references included</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Pass guarantee · Cancel anytime</div>
                <Link to="/register?plan=cax" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/drone-part107.webp" alt="Part 107 Remote Pilot" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Part 107 Remote Pilot Package</div>
                <div className="lp-product-desc">265 questions covering everything on the Part 107 test — airspace, weather, regs, and safety. Most people pass in under 2 weeks. One payment, lifetime access. <Link to="/part-107" style={{ color: 'var(--lp-blue)', textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>Learn more →</Link></div>
                <ul className="lp-product-features">
                  <li>265 Part 107 practice questions</li>
                  <li>6 categorized study modules</li>
                  <li>Timed 60-question simulator</li>
                  <li>Full regulation references</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$37.99</div>
                <div className="lp-product-price-sub">One-time · <strong style={{ color: '#f5c842' }}>Lifetime access</strong></div>
                <Link to="/register?plan=uag" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card" style={{ position: 'relative' }}>
              <div className="lp-product-img">
                <img src="/drone-trust.png" alt="TRUST Recreational Safety Test" />
                <div className="lp-product-img-overlay" />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">TRUST Recreational Safety Test</div>
                <div className="lp-product-desc">The FAA-required safety test for all recreational drone hobbyists. Free to practice — covers rules, airspace, and safe flying.</div>
                <ul className="lp-product-features">
                  <li>48 recreational safety questions</li>
                  <li>Required by FAA for all hobbyists</li>
                  <li>Covers all FAA rules for recreational drone flyers</li>
                  <li>No subscription needed</li>
                  <li>Instant access — completely free</li>
                  <li>Perfect first step for new pilots</li>
                </ul>
                <div className="lp-product-price" style={{ color: '#16A34A' }}>Free</div>
                <div className="lp-product-price-sub">No credit card required</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary" style={{ background: '#16A34A', borderColor: '#16A34A', color: '#fff' }}>Start Free →</Link>
              </div>
            </div>

            {/* ATP Coming Soon */}
            <div className="lp-product-card" style={{ position: 'relative', opacity: 0.65 }}>
              <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2, background: 'var(--lp-blue)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: '0.05em' }}>COMING SOON</div>
              <div className="lp-product-img" style={{ overflow: 'hidden', minHeight: 160 }}>
                <img src="/plane-atp.jpg" alt="ATP captain" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }} />
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Airline Transport Pilot (ATP)</div>
                <div className="lp-product-desc">The ATP knowledge test — required to fly for the airlines. The most advanced FAA written exam.</div>
                <ul className="lp-product-features">
                  <li>1,496 practice questions</li>
                  <li>18 study units</li>
                  <li>Timed 80-question simulator</li>
                  <li>Full regulation &amp; systems coverage</li>
                </ul>
                <div className="lp-product-price">Coming Soon</div>
                <div className="lp-product-price-sub">Notify me when available</div>
                <a href="mailto:support@faaexaminations.com?subject=ATP Exam — Notify Me" className="lp-btn-product lp-btn-product-secondary" style={{ opacity: 0.8 }}>Notify Me →</a>
              </div>
            </div>

          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--lp-text3)' }}>
            Questions about a package? <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--lp-blue)', textDecoration: 'none' }}>Contact us</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '90px 40px' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">FEATURES</div>
          <h2>Everything You Need to Pass</h2>
          <p className="lp-section-sub">Built by experienced FAA instructors and commercial pilots for how pilots actually study. <Link to="/about" style={{ color: 'var(--lp-blue)', textDecoration: 'none' }}>Our story →</Link></p>
          <div className="lp-features-grid fade-up">
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></span>
              <div className="lp-feat-title">3,000+ FAA Questions</div>
              <div className="lp-feat-desc">Authentic PAR, IRA, CAX, and Part 107 questions across all study units. Every question the FAA has tested pilots on, organized by module.</div>
            </div>
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></span>
              <div className="lp-feat-title">Exam Simulator</div>
              <div className="lp-feat-desc">Timed exams matching real FAA question counts per exam type. Instant pass/fail scoring at 70%. Full review after each attempt.</div>
            </div>
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></span>
              <div className="lp-feat-title">Full Explanations</div>
              <div className="lp-feat-desc">Every question includes a detailed explanation with the specific FAA regulation or handbook reference.</div>
            </div>
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg></span>
              <div className="lp-feat-title">AI Instructor Mode</div>
              <div className="lp-feat-desc">Get a real-world breakdown of any question — why the answer is correct, a practical scenario, and a memory tip.</div>
            </div>
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg></span>
              <div className="lp-feat-title">Progress Dashboard</div>
              <div className="lp-feat-desc">Visual readiness gauge, category performance tracking, exam history, and activity heatmap to guide your prep.</div>
            </div>
            <div className="lp-feat-card">
              <span className="lp-feat-icon"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#30ace2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg></span>
              <div className="lp-feat-title">Study Anywhere</div>
              <div className="lp-feat-desc">Fully responsive on any device. Study on your phone between flights, on a tablet at the airport, or at your desktop.</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how-bg" id="how">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">HOW IT WORKS</div>
          <h2>Three Steps to Exam Success</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>A straightforward path used by student pilots working toward their FAA certificate.</p>
          <div className="lp-steps fade-up">
            <div className="lp-step">
              <div className="lp-step-num">01</div>
              <div className="lp-step-title">Choose Your Package</div>
              <p className="lp-step-desc">Pick the exam you're preparing for — Private Pilot (PAR), Instrument Rating (IRA), Commercial Pilot (CAX), Part 107, or the full Bundle. Instant access the moment you subscribe.</p>
              <img src="/plane-step1.jpg" alt="Choose package" className="lp-step-img" />
            </div>
            <div className="lp-step">
              <div className="lp-step-num">02</div>
              <div className="lp-step-title">Work Through the Modules</div>
              <p className="lp-step-desc">Every topic organized by category, exactly how the FAA tests it. Track your weak areas and use the AI Instructor to work through anything that isn't clicking.</p>
              <img src="/plane-step2.jpg" alt="Study modules" className="lp-step-img" />
            </div>
            <div className="lp-step">
              <div className="lp-step-num">03</div>
              <div className="lp-step-title">Pass With Confidence</div>
              <p className="lp-step-desc">When your readiness score hits 85%+, you're ready. Walk into the test knowing you've covered every question the FAA is going to ask.</p>
              <img src="/plane-step3.jpg" alt="Pass exam" className="lp-step-img" />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" style={{ padding: '90px 40px' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">REVIEWS</div>
          <h2>Pilots Who Passed</h2>
          <div className="lp-testi-grid fade-up">
            <div className="lp-testi">
              <div className="lp-t-stars">★★★★★</div>
              <p className="lp-t-quote">"The FAA exam quizzes from faaexaminations.com were a game-changer for me! The questions were spot-on and really helped me prepare for both my Private and Commercial exams. Passed with flying colors!"</p>
              <div className="lp-t-author"><div className="lp-t-avatar">JD</div><div><div className="lp-t-name">John D.</div><div className="lp-t-title-sub">Certified Flight Instructor</div></div></div>
            </div>
            <div className="lp-testi">
              <div className="lp-t-stars">★★★★★</div>
              <p className="lp-t-quote">"As a flight instructor, it's crucial that my students are fully prepared. The quiz bundles from faaexaminations.com are the best study tools we've found. Comprehensive, easy to use, and accurate."</p>
              <div className="lp-t-author"><div className="lp-t-avatar">SM</div><div><div className="lp-t-name">Sarah M.</div><div className="lp-t-title-sub">Certified Flight Instructor, KDEN</div></div></div>
            </div>
            <div className="lp-testi">
              <div className="lp-t-stars">★★★★★</div>
              <p className="lp-t-quote">"Switching my license to FAA was daunting, but this quiz bundle made all the difference. The modules cover everything systematically and the explanations are clear. Highly recommend!"</p>
              <div className="lp-t-author"><div className="lp-t-avatar">RT</div><div><div className="lp-t-name">Robert T.</div><div className="lp-t-title-sub">License Converter, KLAX</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '90px 40px', background: 'var(--lp-bg2, #0b1520)' }}>
        <div className="lp-section-inner" style={{ maxWidth: 760 }}>
          <div className="lp-badge">FAQ</div>
          <h2 style={{ marginBottom: 40 }}>Common Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              {
                q: 'Are these the real FAA questions?',
                a: 'Our question bank is sourced from official FAA Airman Knowledge Test materials and study guides. The FAA does not publicly release its exact active question pool, but our questions are drawn from the same source materials used by every major FAA test prep provider.',
              },
              {
                q: 'What\'s actually free? Do I need a credit card to sign up?',
                a: 'No credit card required to create an account. Free accounts include a 10-question Private Pilot (PAR) sample in Study Mode and full access to the TRUST recreational drone safety test. Full exam access (all modules, full question pools, exam simulator) requires a paid subscription.',
              },
              {
                q: 'What\'s included in each package?',
                a: 'Each individual package (PAR, IRA, CAX, or Part 107) gives you full access to that exam\'s complete question pool, all study modules, the timed exam simulator, and AI Instructor support. The Pilot Certificate Bundle gives you PAR + IRA + CAX at a discounted combined price.',
              },
              {
                q: 'Can I cancel anytime?',
                a: <>Yes. Cancel anytime from your account settings — no penalties, no questions asked. You keep access until the end of your current billing period. See our full <Link to="/cancel-policy" style={{ color: 'var(--lp-accent, #30ace2)' }}>Cancellation &amp; Refund Policy</Link> for details.</>,
              },
              {
                q: 'Is this updated for 2026?',
                a: 'Yes. Our question bank reflects current FAA regulations and ACS (Airman Certification Standards) requirements as of 2026. We update content when the FAA revises its testing standards.',
              },
              {
                q: 'Does this work for the Commercial Pilot (CAX) exam?',
                a: 'Yes. The Commercial Pilot package covers all topics on the FAA Commercial Pilot Airplane (CAX) Airman Knowledge Test, including 14 CFR Part 91/119/135 operations, performance, advanced weather, and navigation.',
              },
            ].map(({ q, a }) => (
              <div key={q} style={{ borderBottom: '1px solid var(--lp-border, #1e2d3d)', paddingBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 8, color: '#fff' }}>{q}</div>
                <div style={{ color: 'var(--lp-text2)', lineHeight: 1.7, fontSize: '.95rem' }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHEAT SHEET EMAIL CAPTURE */}
      <CheatSheetCapture />

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-bg">
          <img src="/plane-hero.jpeg" alt="" />
        </div>
        <div className="lp-cta-content lp-section-inner">
          <div className="lp-badge">GET STARTED</div>
          <h2>Ready to Pass Your FAA Exam?</h2>
          <p style={{ fontSize: 16, color: 'var(--lp-text2)', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Join student pilots across North America who are preparing with FAAExaminations.com. Create your free account today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="lp-btn-hero"><svg width="13" height="14" viewBox="0 0 13 14" fill="white" style={{marginRight:7,verticalAlign:'middle',display:'inline-block'}}><polygon points="0,0 13,7 0,14"/></svg>Create Free Account</Link>
            <a href="#products" className="lp-btn-outline">View Packages</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-logo">FAA<span>Examinations</span>.com</div>
        <div style={{ fontSize: 13, color: 'var(--lp-text3)', marginBottom: 16 }}>FAA Practice Exams for Aspiring Pilots and Aviation Professionals</div>
        <div className="lp-footer-links">
          <Link to="/register" className="lp-footer-link">Practice Exams</Link>
          <Link to="/dashboard" className="lp-footer-link">Dashboard</Link>
          <a href="#products" className="lp-footer-link">Packages</a>
          <a href="#features" className="lp-footer-link">Features</a>
          <Link to="/references" className="lp-footer-link">Free FAA References</Link>
          <Link to="/blog" className="lp-footer-link">Blog</Link>
          <Link to="/about" className="lp-footer-link">About</Link>
          <Link to="/privacy" className="lp-footer-link">Privacy Policy</Link>
          <Link to="/terms" className="lp-footer-link">Terms of Service</Link>
          <a href="mailto:support@faaexaminations.com" className="lp-footer-link">Contact</a>
        </div>
        <div className="lp-footer-copy">© 2026 FAAExaminations.com · Not affiliated with the FAA · For educational purposes only</div>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 18px', fontSize: '.75rem', color: 'var(--lp-text3)', opacity: 0.6 }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="https://www.facebook.com/profile.php?id=61550998640330" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--lp-text3)', display: 'flex', alignItems: 'center' }} title="Facebook">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            </a>
            <a href="https://www.instagram.com/faaexaminations" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--lp-text3)', display: 'flex', alignItems: 'center' }} title="Instagram">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            </a>
          </div>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Designed by <a href="https://websitework.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lp-text3)' }}>websitework.ca</a></span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Canadian pilots:
            <img src="/maple-leaf.png" alt="🍁" style={{ width: 12, height: 12 }} />
            <a href="https://ifrtest.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lp-text3)' }}>ifrtest.ca</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
