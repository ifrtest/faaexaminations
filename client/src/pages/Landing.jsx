import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const HERO_IMAGES = ['/plane-pass.webp', '/plane-hero-2.jpg', '/plane-hero.jpeg'];

export default function Landing() {
  const { user } = useAuth();
  const navRef = useRef(null);
  const [heroIdx, setHeroIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroIdx((i) => (i + 1) % HERO_IMAGES.length);
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
            <img key={src} src={src} alt="" style={{ opacity: i === heroIdx ? 0.75 : 0 }} />
          ))}
        </div>
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">✈ FAA KNOWLEDGE TEST PREP · 2026 UPDATED</div>
          <h1>Pass Your <span className="lp-accent">FAA Written</span><br />Exam First Try</h1>
          <p className="lp-hero-sub">
            3,000+ authentic FAA practice questions for Private Pilot, Instrument Rating, Commercial Pilot, Part 107 Remote Pilot, and the free TRUST recreational safety test.
            Timed exam simulator, full explanations, and AI instructor support — everything you need to pass.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-btn-hero">▶ Start Free Today</Link>
            <a href="#products" className="lp-btn-outline">View Packages</a>
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">3,000+</div><div className="lp-hs-lbl">Practice Questions</div></div>
            <div><div className="lp-hs-val">5</div><div className="lp-hs-lbl">Exam Types</div></div>
            <div><div className="lp-hs-val">95%</div><div className="lp-hs-lbl">Pass Rate</div></div>
            <div><div className="lp-hs-val">FAA</div><div className="lp-hs-lbl">Compliant 2026</div></div>
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

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-par.jpg" alt="Private Pilot" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">PAR</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Private Pilot Package</div>
                <div className="lp-product-desc">Complete preparation for the FAA Private Pilot Airman Knowledge Test (PAR). 11 modules covering the full FAA syllabus.</div>
                <ul className="lp-product-features">
                  <li>1,469 Private Pilot questions</li>
                  <li>11 categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full FAA references provided</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Per month · Cancel anytime</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary">Start Free Sample →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-ira.jpg" alt="Instrument Rating" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">IRA</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Instrument Rating Package</div>
                <div className="lp-product-desc">Complete preparation for the FAA Instrument Rating Airman Knowledge Test (IRA). Master IFR procedures, charts, and regulations.</div>
                <ul className="lp-product-features">
                  <li>821 Instrument Rating questions</li>
                  <li>Categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full FAA references provided</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Per month · Cancel anytime</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/plane-cax.jpg" alt="Commercial Pilot" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">CAX</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Commercial Pilot Package</div>
                <div className="lp-product-desc">Targeted prep for the FAA Commercial Pilot Airman Knowledge Test (CAX). FARs, performance, and advanced operations.</div>
                <ul className="lp-product-features">
                  <li>536 Commercial Pilot questions</li>
                  <li>11 categorized study modules</li>
                  <li>Timed exam simulator</li>
                  <li>Full FAR references included</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Per month · Cancel anytime</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card lp-featured lp-product-bundle">
              <div className="lp-product-img">
                <img src="/plane-bundle.jpg" alt="Bundle" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">BEST VALUE</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">All 3 Exams Bundle</div>
                <div className="lp-product-desc">Full access to PAR, IRA, and CAX. Perfect for instructors, license converters, and career-track pilots.</div>
                <ul className="lp-product-features">
                  <li>2,826 total practice questions</li>
                  <li>All PAR, IRA &amp; CAX modules</li>
                  <li>AI Instructor explanations</li>
                  <li>Timed exam simulator</li>
                  <li>Progress dashboard &amp; tracking</li>
                  <li>Best value — save vs. individual</li>
                </ul>
                <div className="lp-product-price">$39.99</div>
                <div className="lp-product-price-sub">Per month · Cancel anytime</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-primary">Get Bundle Access →</Link>
              </div>
            </div>


            <div className="lp-product-card">
              <div className="lp-product-img">
                <img src="/drone-part107.png" alt="Part 107 Remote Pilot" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">UAG</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">Part 107 Remote Pilot Package</div>
                <div className="lp-product-desc">Complete prep for the FAA Part 107 Remote Pilot knowledge test. Drone regulations, airspace, weather, and operations.</div>
                <ul className="lp-product-features">
                  <li>166 Part 107 practice questions</li>
                  <li>5 categorized study modules</li>
                  <li>Timed 60-question simulator</li>
                  <li>Full regulation references</li>
                  <li>AI Instructor explanations</li>
                  <li>FAA compliant · 2026 updated</li>
                </ul>
                <div className="lp-product-price">$24.99</div>
                <div className="lp-product-price-sub">Per month · Cancel anytime</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary">Get Started →</Link>
              </div>
            </div>

            <div className="lp-product-card" style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 16, right: 16, zIndex: 10,
                background: 'linear-gradient(135deg,#F7C948,#D4A017)',
                color: '#0B3D91', fontWeight: 800, fontSize: '.8rem',
                padding: '4px 14px', borderRadius: 999, letterSpacing: '.05em',
                boxShadow: '0 2px 8px rgba(247,201,72,.4)',
              }}>FREE</div>
              <div className="lp-product-img">
                <img src="/drone-trust.png" alt="TRUST Recreational Safety Test" />
                <div className="lp-product-img-overlay"><span className="lp-product-tag">TRUST</span></div>
              </div>
              <div className="lp-product-body">
                <div className="lp-product-name">TRUST Recreational Safety Test</div>
                <div className="lp-product-desc">The FAA-required safety test for all recreational drone hobbyists. Free to practice — covers rules, airspace, and safe flying.</div>
                <ul className="lp-product-features">
                  <li>48 recreational safety questions</li>
                  <li>Required by FAA for all hobbyists</li>
                  <li>Covers 49 USC 44809 rules</li>
                  <li>No subscription needed</li>
                  <li>Instant access — completely free</li>
                  <li>Perfect first step for new pilots</li>
                </ul>
                <div className="lp-product-price" style={{ color: '#16A34A' }}>Free</div>
                <div className="lp-product-price-sub">No credit card required</div>
                <Link to="/register" className="lp-btn-product lp-btn-product-secondary" style={{ background: '#16A34A', borderColor: '#16A34A', color: '#fff' }}>Start Free →</Link>
              </div>
            </div>

          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--lp-text3)' }}>
            All packages include a pass guarantee. Questions? <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--lp-blue)', textDecoration: 'none' }}>Contact us</a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '90px 40px' }}>
        <div className="lp-section-inner">
          <div className="lp-badge">FEATURES</div>
          <h2>Everything You Need to Pass</h2>
          <p className="lp-section-sub">Built by experienced FAA instructors and commercial pilots for how pilots actually study.</p>
          <div className="lp-features-grid fade-up">
            <div className="lp-feat-card"><span className="lp-feat-icon">🧠</span><div className="lp-feat-title">2,826 FAA Questions</div><div className="lp-feat-desc">Authentic PAR, IRA, and CAX questions across all study units. Every question the FAA has tested pilots on, organized by module.</div></div>
            <div className="lp-feat-card"><span className="lp-feat-icon">⏱️</span><div className="lp-feat-title">Exam Simulator</div><div className="lp-feat-desc">Timed 60-question exams matching real FAA conditions. Instant pass/fail scoring at 70%. Full review after each attempt.</div></div>
            <div className="lp-feat-card"><span className="lp-feat-icon">💡</span><div className="lp-feat-title">Full Explanations</div><div className="lp-feat-desc">Every question includes a detailed explanation with the specific FAA regulation or handbook reference.</div></div>
            <div className="lp-feat-card"><span className="lp-feat-icon">🤖</span><div className="lp-feat-title">AI Instructor Mode</div><div className="lp-feat-desc">Get a real-world breakdown of any question — why the answer is correct, a practical scenario, and a memory tip.</div></div>
            <div className="lp-feat-card"><span className="lp-feat-icon">📊</span><div className="lp-feat-title">Progress Dashboard</div><div className="lp-feat-desc">Visual readiness gauge, category performance tracking, exam history, and activity heatmap to guide your prep.</div></div>
            <div className="lp-feat-card"><span className="lp-feat-icon">📱</span><div className="lp-feat-title">Study Anywhere</div><div className="lp-feat-desc">Fully responsive on any device. Study on your phone between flights, on a tablet at the airport, or at your desktop.</div></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how-bg" id="how">
        <div className="lp-section-inner" style={{ textAlign: 'center' }}>
          <div className="lp-badge">HOW IT WORKS</div>
          <h2>Three Steps to Exam Success</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>A proven path used by thousands of student pilots across North America.</p>
          <div className="lp-steps fade-up">
            <div className="lp-step">
              <div className="lp-step-num">01</div>
              <div className="lp-step-title">Choose Your Package</div>
              <p className="lp-step-desc">Select Private Pilot, Commercial Pilot, or the Bundle. Instant access to all questions, modules, and tools.</p>
              <img src="/plane-card.jpeg" alt="Choose package" className="lp-step-img" />
            </div>
            <div className="lp-step">
              <div className="lp-step-num">02</div>
              <div className="lp-step-title">Work Through the Modules</div>
              <p className="lp-step-desc">11 categorized modules per exam, 40 questions each. Track weak areas and use AI Instructor to master tough concepts.</p>
              <img src="/plane-hero.jpeg" alt="Study modules" className="lp-step-img" />
            </div>
            <div className="lp-step">
              <div className="lp-step-num">03</div>
              <div className="lp-step-title">Pass With Confidence</div>
              <p className="lp-step-desc">When your readiness score hits 85%+, you're ready. Walk into the FAA test with everything covered. Guaranteed.</p>
              <img src="/plane-pass.webp" alt="Pass exam" className="lp-step-img" />
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
              <div className="lp-t-author"><div className="lp-t-avatar">SM</div><div><div className="lp-t-name">Sarah M.</div><div className="lp-t-title-sub">Private Pilot, KDEN</div></div></div>
            </div>
            <div className="lp-testi">
              <div className="lp-t-stars">★★★★★</div>
              <p className="lp-t-quote">"Switching my license to FAA was daunting, but this quiz bundle made all the difference. The modules cover everything systematically and the explanations are clear. Highly recommend!"</p>
              <div className="lp-t-author"><div className="lp-t-avatar">RT</div><div><div className="lp-t-name">Robert T.</div><div className="lp-t-title-sub">License Converter, KLAX</div></div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-bg">
          <img src="/plane-hero.jpeg" alt="" />
        </div>
        <div className="lp-cta-content lp-section-inner">
          <div className="lp-badge">GET STARTED</div>
          <h2>Ready to Pass Your FAA Exam?</h2>
          <p style={{ fontSize: 16, color: 'var(--lp-text2)', marginBottom: 36, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
            Join thousands of student pilots who prepared with FAAExaminations.com. Create your free account today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="lp-btn-hero">▶ Create Free Account</Link>
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
            Our Canadian Partner
            <img src="/maple-leaf.png" alt="🍁" style={{ width: 12, height: 12 }} />
            <a href="https://ifrtest.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--lp-text3)' }}>ifrtest.ca</a>
          </span>
        </div>
      </footer>
    </div>
  );
}
