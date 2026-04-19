import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const navRef = useRef(null);

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
          <img src="/plane-hero.jpeg" alt="" />
        </div>
        <div className="lp-hero-grid" />
        <div className="lp-hero-content">
          <div className="lp-hero-badge">✈ FAA KNOWLEDGE TEST PREP · 2026 UPDATED</div>
          <h1>Pass Your <span className="lp-accent">FAA Written</span><br />Exam First Try</h1>
          <p className="lp-hero-sub">
            2,826 authentic FAA practice questions for Private Pilot, Instrument Rating, and Commercial Pilot certificates.
            Timed exam simulator, full explanations, and AI instructor support — everything you need to pass.
          </p>
          <div className="lp-hero-btns">
            <Link to="/register" className="lp-btn-hero">▶ Start Free Today</Link>
            <a href="#products" className="lp-btn-outline">View Packages</a>
          </div>
          <div className="lp-hero-stats">
            <div><div className="lp-hs-val">2,826</div><div className="lp-hs-lbl">Practice Questions</div></div>
            <div><div className="lp-hs-val">3</div><div className="lp-hs-lbl">Exam Certificates</div></div>
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
                <img src="/plane-card.jpeg" alt="Private Pilot" />
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
                <img src="/plane-hero.jpeg" alt="Instrument Rating" />
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
                <img src="/plane-cpl.webp" alt="Commercial Pilot" />
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
                <img src="/plane-pass.webp" alt="Bundle" />
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

          </div>
          <div style={{ textAlign: 'center', marginTop: 22, fontSize: 14, color: 'var(--lp-text3)' }}>
            All packages include a pass guarantee. Questions? <a href="mailto:info@faaexaminations.com" style={{ color: 'var(--lp-blue)', textDecoration: 'none' }}>Contact us</a>
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
          <a href="mailto:info@faaexaminations.com" className="lp-footer-link">Contact</a>
        </div>
        <div className="lp-footer-copy">© 2026 FAAExaminations.com · Not affiliated with the FAA · For educational purposes only</div>
      </footer>
    </div>
  );
}
