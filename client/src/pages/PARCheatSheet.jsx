import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SEO_TITLE = 'FAA Private Pilot Exam Cheat Sheet (PAR) — Key Numbers, Rules & Formulas (2026)';
const SEO_DESC = 'Free FAA Private Pilot written exam cheat sheet. Key FARs, airspace minimums, METAR codes, density altitude, weight & balance formulas, and more. Printable reference for PAR exam prep.';

const SECTIONS = [
  { id: 'fars', label: 'Key FAR Numbers' },
  { id: 'equipment', label: 'Required Equipment' },
  { id: 'airspace', label: 'Airspace Minimums' },
  { id: 'weather', label: 'Weather & METARs' },
  { id: 'aero', label: 'Aerodynamics' },
  { id: 'performance', label: 'Performance & W&B' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'human', label: 'Human Factors' },
  { id: 'lights', label: 'Light Signals' },
];

export default function PARCheatSheet() {
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ?print=1 → trigger print dialog automatically (used by email PDF link)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('print') === '1') {
      setTimeout(() => window.print(), 800);
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.05 }
    );
    document.querySelectorAll('.fade-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="lp">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESC} />
        <link rel="canonical" href="https://faaexaminations.com/par-cheat-sheet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/par-cheat-sheet" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <meta property="og:image" content="https://faaexaminations.com/plane-par-desktop.jpg" />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1280" />
        <meta property="og:image:alt" content="FAA Private Pilot exam cheat sheet — FAAExaminations.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESC} />
        <meta name="twitter:image" content="https://faaexaminations.com/plane-par-desktop.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: SEO_TITLE,
          description: SEO_DESC,
          url: 'https://faaexaminations.com/par-cheat-sheet',
        })}</script>
      </Helmet>

      {/* NAV */}
      <nav className="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <Link to="/par" className="lp-nav-link">Full PAR Package</Link>
          <Link to="/par-practice-test" className="lp-nav-link">Practice Test</Link>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="lp-nav-link">Login</Link>
          <Link to="/register?plan=par" className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>Start Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 40px 70px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>PAR EXAM · FREE REFERENCE</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: 1.1, marginBottom: 20 }}>
            Private Pilot Exam <span className="lp-accent">Cheat Sheet</span>
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            Every key number, rule, formula, and acronym tested on the FAA Private Pilot written exam (PAR) — organized by topic. Bookmark or print before you study.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#content" className="lp-btn-hero">Jump to Cheat Sheet ↓</a>
            <button onClick={() => window.print()} className="lp-btn-outline no-print" style={{ cursor: 'pointer' }}>⬇ Download PDF</button>
            <Link to="/par-practice-test" className="lp-btn-outline">Free Practice Test</Link>
          </div>
        </div>
      </section>

      {/* TABLE OF CONTENTS */}
      <section style={{ padding: '32px 40px', background: 'var(--lp-charcoal)', borderBottom: '1px solid var(--lp-border)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--lp-text3)', marginBottom: 14, textTransform: 'uppercase' }}>Jump to section</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} style={{ color: 'var(--lp-blue)', fontSize: 13, padding: '6px 14px', border: '1px solid rgba(48,172,226,0.3)', borderRadius: 7, textDecoration: 'none', background: 'rgba(48,172,226,0.05)', whiteSpace: 'nowrap' }}>
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section id="content" style={{ padding: '60px 24px 80px', background: 'var(--lp-dark)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* KEY FAR NUMBERS */}
          <div id="fars" className="fade-up">
            <SectionHeader number="01" title="Key FAR Numbers" />
            <Table rows={[
              ['Alcohol — bottle to throttle', '8 hours (FAR 91.17)'],
              ['Alcohol — max BAC', '0.04% (FAR 91.17)'],
              ['Passenger currency — takeoffs & landings', '3 in preceding 90 days, same category/class (FAR 61.57)'],
              ['Night passenger currency', '3 full-stop landings at night in preceding 90 days (FAR 61.57)'],
              ['Flight review', 'Every 24 calendar months (FAR 61.56)'],
              ['Annual inspection', 'Every 12 calendar months (FAR 91.409)'],
              ['100-hour inspection (for-hire only)', 'Every 100 hours (FAR 91.409)'],
              ['ELT battery replacement / inspection', 'Every 12 calendar months, or after 1 hr cumulative use, or 50% battery life (FAR 91.207)'],
              ['VOR check (IFR)', 'Every 30 days (FAR 91.171)'],
              ['Transponder check', 'Every 24 calendar months (FAR 91.413)'],
              ['Student solo endorsement', 'Valid 90 days (FAR 61.87)'],
              ['Medical — 3rd class, under 40', '60 calendar months'],
              ['Medical — 3rd class, 40 and over', '24 calendar months'],
            ]} heads={['Rule', 'Requirement']} />
          </div>

          {/* REQUIRED EQUIPMENT */}
          <div id="equipment" className="fade-up">
            <SectionHeader number="02" title="Required Equipment" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="VFR Day — ATOMATOFLAMES">
                {[
                  ['A', 'Airspeed indicator'],
                  ['T', 'Tachometer'],
                  ['O', 'Oil pressure gauge'],
                  ['M', 'Manifold pressure (if applicable)'],
                  ['A', 'Altimeter'],
                  ['T', 'Temperature gauge (liquid-cooled)'],
                  ['O', 'Oil temperature gauge'],
                  ['F', 'Fuel gauge (each tank)'],
                  ['L', 'Landing gear indicator (retractable)'],
                  ['A', 'Anti-collision lights'],
                  ['M', 'Magnetic direction indicator'],
                  ['E', 'ELT'],
                  ['S', 'Safety belts'],
                ].map(([letter, item]) => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </Card>
              <Card title="VFR Night adds — FLAPS">
                {[
                  ['F', 'Fuses or circuit breakers'],
                  ['L', 'Landing light (if for hire)'],
                  ['A', 'Anti-collision lights'],
                  ['P', 'Position lights (nav lights)'],
                  ['S', 'Source of power (alternator/generator)'],
                ].map(([letter, item]) => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <Note>Day + Night items combined = everything required for night VFR</Note>
              </Card>
            </div>
          </div>

          {/* AIRSPACE */}
          <div id="airspace" className="fade-up">
            <SectionHeader number="03" title="Airspace VFR Minimums & Entry Requirements" />
            <Table
              heads={['Class', 'Visibility', 'Cloud Clearance', 'Entry Requirement']}
              rows={[
                ['A', 'N/A (IFR only)', 'N/A', 'IFR clearance + rating'],
                ['B', '3 SM', 'Clear of clouds', 'ATC clearance'],
                ['C', '3 SM', '500 below · 1,000 above · 2,000 horiz', '2-way radio contact established'],
                ['D', '3 SM', '500 below · 1,000 above · 2,000 horiz', '2-way radio contact established'],
                ['E (below 10,000)', '3 SM', '500 below · 1,000 above · 2,000 horiz', 'None (VFR)'],
                ['E (at/above 10,000)', '5 SM', '1,000 below · 1,000 above · 1 SM horiz', 'None (VFR)'],
                ['G (day, below 1,200 AGL)', '1 SM', 'Clear of clouds', 'None'],
                ['G (night, below 1,200 AGL)', '3 SM', '500 below · 1,000 above · 2,000 horiz', 'None'],
                ['G (day, 1,200–10,000 AGL)', '1 SM', '1,000 below · 1,000 above · 2,000 horiz', 'None'],
                ['G (night, 1,200–10,000 AGL)', '3 SM', '1,000 below · 1,000 above · 2,000 horiz', 'None'],
              ]}
            />
            <div style={{ marginTop: 20 }}>
              <Table
                heads={['Speed Limit', 'Rule']}
                rows={[
                  ['250 KIAS', 'Below 10,000 ft MSL (FAR 91.117)'],
                  ['200 KIAS', 'Within Class C or D airspace'],
                  ['200 KIAS', 'Within 4 NM of a Class B primary airport, at or below 2,500 AGL'],
                ]}
              />
            </div>
          </div>

          {/* WEATHER */}
          <div id="weather" className="fade-up">
            <SectionHeader number="04" title="Weather & METARs" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 20 }}>
              <Card title="METAR Sky Coverage">
                {[
                  ['SKC / CLR', 'Clear — 0/8'],
                  ['FEW', '1–2/8 (not a ceiling)'],
                  ['SCT', '3–4/8 (not a ceiling)'],
                  ['BKN', '5–7/8 — CEILING'],
                  ['OVC', '8/8 — CEILING'],
                  ['VV', 'Vertical visibility — CEILING'],
                ].map(([code, meaning]) => (
                  <div key={code} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--lp-blue)', fontSize: 14 }}>{code}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', textAlign: 'right' }}>{meaning}</span>
                  </div>
                ))}
                <Note>Cloud heights in METARs are in hundreds of feet AGL</Note>
              </Card>
              <Card title="Common METAR Weather Codes">
                {[
                  ['TS', 'Thunderstorm'],
                  ['RA', 'Rain'],
                  ['SN', 'Snow'],
                  ['FG', 'Fog (visibility < 5/8 SM)'],
                  ['BR', 'Mist (5/8–6 SM visibility)'],
                  ['HZ', 'Haze'],
                  ['DZ', 'Drizzle'],
                  ['GR', 'Hail (≥ 1/4 inch)'],
                  ['–', 'Light intensity prefix'],
                  ['+', 'Heavy intensity prefix'],
                  ['VC', 'In vicinity (5–10 SM)'],
                ].map(([code, meaning]) => (
                  <div key={code} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--lp-blue)', fontSize: 14 }}>{code}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', textAlign: 'right' }}>{meaning}</span>
                  </div>
                ))}
              </Card>
            </div>
            <Table
              heads={['Product', 'Covers', 'Issued for']}
              rows={[
                ['SIGMET (WS)', 'Severe turbulence, severe icing, dust storms, volcanic ash', 'All aircraft'],
                ['Convective SIGMET (WST)', 'Thunderstorms ≥ severe, embedded TS, lines of TS, hail ≥ 3/4 inch', 'All aircraft'],
                ['AIRMET Sierra (WAS)', 'IFR conditions, mountain obscuration', 'Light aircraft primarily'],
                ['AIRMET Tango (WAT)', 'Moderate turbulence, surface winds > 30 kt, low-level wind shear', 'Light aircraft primarily'],
                ['AIRMET Zulu (WAZ)', 'Moderate icing, freezing level', 'Light aircraft primarily'],
                ['TAF', 'Terminal aerodrome forecast — 24 to 30 hours', 'Single airport area'],
                ['Winds Aloft (FB)', 'Forecast winds & temps aloft at various altitudes', 'Enroute planning'],
              ]}
            />
            <div style={{ marginTop: 20 }}>
              <Card title="Thunderstorm Stages">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    ['Cumulus', 'Updraft only — building phase'],
                    ['Mature', 'Both updraft AND downdraft — most dangerous — heavy rain, hail, lightning, severe turbulence'],
                    ['Dissipating', 'Downdraft dominant — rain decreases — storm weakening'],
                  ].map(([stage, desc]) => (
                    <div key={stage} style={{ display: 'flex', gap: 12, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--lp-blue)', fontSize: 13, minWidth: 90, flexShrink: 0 }}>{stage}</span>
                      <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{desc}</span>
                    </div>
                  ))}
                </div>
                <Note>Never penetrate or fly under a thunderstorm. Stay 20 NM away from severe cells.</Note>
              </Card>
            </div>
          </div>

          {/* AERODYNAMICS */}
          <div id="aero" className="fade-up">
            <SectionHeader number="05" title="Aerodynamics" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="4 Forces of Flight">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[
                    ['Lift', 'Opposes Weight — acts perpendicular to relative wind'],
                    ['Weight', 'Opposes Lift — acts toward center of earth'],
                    ['Thrust', 'Opposes Drag — acts forward along flight path'],
                    ['Drag', 'Opposes Thrust — acts rearward along flight path'],
                  ].map(([force, desc]) => (
                    <div key={force} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, marginBottom: 2 }}>{force}</div>
                      <div style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{desc}</div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card title="Load Factor in Turns">
                <Table
                  heads={['Bank Angle', 'Load Factor']}
                  rows={[
                    ['0°', '1.0 G'],
                    ['30°', '1.15 G'],
                    ['45°', '1.41 G'],
                    ['60°', '2.0 G'],
                    ['75°', '3.86 G'],
                    ['90°', 'Infinite (impossible in steady flight)'],
                  ]}
                  compact
                />
                <Note>Stall speed increases with bank angle — Vs in a 60° bank is 41% higher than wings level</Note>
              </Card>
              <Card title="Stall & AOA">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    An aircraft stalls when the <strong style={{ color: '#fff' }}>critical angle of attack</strong> (~15–18°) is exceeded — regardless of airspeed, attitude, or power setting.
                  </p>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    Stall speed <strong style={{ color: '#fff' }}>increases</strong> with: higher weight, steeper bank, higher load factor, ice/frost on wings, forward CG.
                  </p>
                  <p style={{ color: 'var(--lp-text2)', fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                    <strong style={{ color: 'var(--lp-blue)' }}>P-factor</strong> (asymmetric thrust) occurs at high AOA — descending blade produces more thrust. Results in left-turning tendency on takeoff.
                  </p>
                </div>
              </Card>
              <Card title="Left-Turning Tendencies">
                {[
                  ['Torque', 'Engine rotation pushes aircraft left'],
                  ['P-factor', 'Descending blade at high AOA — left yaw'],
                  ['Spiraling slipstream', 'Strikes left side of tail — left yaw'],
                  ['Gyroscopic precession', 'In tailwheel aircraft, raising tail causes left yaw'],
                ].map(([cause, effect]) => (
                  <div key={cause} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{cause}</div>
                    <div style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{effect}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* PERFORMANCE & WEIGHT & BALANCE */}
          <div id="performance" className="fade-up">
            <SectionHeader number="06" title="Performance & Weight & Balance" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Density Altitude">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.8 }}>
                  DA = Pressure Altitude<br />
                  + (120 × (OAT − ISA Temp))<br /><br />
                  ISA Temp = 15°C − 2°C per 1,000 ft PA
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7 }}>
                  Higher DA → longer takeoff roll, reduced climb, reduced engine power. High temperature + high elevation + high humidity = highest DA.
                </div>
                <Note>On a hot day at a high-elevation airport, treat performance charts conservatively</Note>
              </Card>
              <Card title="Weight & Balance">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.8 }}>
                  Moment = Weight × Arm<br />
                  CG = Total Moment ÷ Total Weight
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7 }}>
                  CG must remain within limits at takeoff AND landing (fuel burn shifts CG).
                </div>
                {[
                  ['Forward CG', 'More stable, higher stall speed, more back pressure needed, better spin recovery'],
                  ['Aft CG', 'Less stable, lower stall speed, reduced control effectiveness, poor spin recovery'],
                ].map(([pos, effect]) => (
                  <div key={pos} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginTop: 4 }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{pos}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{effect}</div>
                  </div>
                ))}
              </Card>
              <Card title="Runway Performance Factors">
                {[
                  ['Uphill runway', 'Longer takeoff roll'],
                  ['Downhill runway', 'Shorter takeoff roll, longer landing roll'],
                  ['Wet/grass runway', 'Longer takeoff roll (~15%)'],
                  ['Tailwind (10 kt)', 'Approx. 21% longer takeoff roll'],
                  ['Higher density altitude', 'Longer ground roll — reduced lift & thrust'],
                  ['Higher gross weight', 'Longer takeoff roll, slower climb'],
                ].map(([factor, effect]) => (
                  <div key={factor} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 13, color: '#fff', minWidth: 130, flexShrink: 0 }}>{factor}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{effect}</span>
                  </div>
                ))}
              </Card>
              <Card title="Fuel Facts">
                {[
                  ['Avgas 100LL', 'Blue — most common piston fuel'],
                  ['Avgas 100', 'Green — used in high-compression engines'],
                  ['Jet-A', 'Clear/straw — turbine fuel only'],
                  ['Fuel weight', '6 lbs per gallon (avgas)'],
                  ['Fuel contamination check', 'Drain sumps before each flight — check for water (blue color correct)'],
                  ['Carb ice', 'Most likely: high humidity + 20–70°F OAT with power reduced'],
                ].map(([item, fact]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{fact}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* NAVIGATION */}
          <div id="navigation" className="fade-up">
            <SectionHeader number="07" title="Navigation" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Heading Conversion — TVMDC">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.8 }}>
                  TC ± WCA = TH<br />
                  TH ± Variation = MH<br />
                  MH ± Deviation = CH
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  <strong style={{ color: '#fff' }}>"True Virgins Make Dull Company"</strong> — True Course, Variation, Magnetic, Deviation, Compass
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7 }}>
                  <strong style={{ color: '#fff' }}>East is Least, West is Best</strong> — East variation: subtract. West variation: add. (Converting True → Magnetic)
                </div>
              </Card>
              <Card title="VFR Cruising Altitudes (above 3,000 AGL) — FAR 91.159">
                <Table
                  heads={['Magnetic Course', 'Altitude']}
                  rows={[
                    ['0° – 179°', 'Odd thousands + 500 ft (3,500 · 5,500 · 7,500…)'],
                    ['180° – 359°', 'Even thousands + 500 ft (4,500 · 6,500 · 8,500…)'],
                  ]}
                  compact
                />
                <Note>Applies only above 3,000 ft AGL. Below 3,000 AGL no altitude rule applies.</Note>
              </Card>
              <Card title="Sectional Chart — Key Facts">
                {[
                  ['Scale', '1:500,000 (1 inch = ~7 NM)'],
                  ['Contour interval', 'Varies — typically 200 ft in mountains'],
                  ['MEF (Maximum Elevation Figure)', 'Highest obstacle in that quadrant + 100 ft (200 ft if manmade)'],
                  ['MSA (Minimum Safe Altitude)', 'Provides 1,000 ft obstacle clearance within 25 NM of a fix'],
                  ['Magnetic variation', 'Shown as isogonic lines — dashed lines with degree values'],
                  ['Class B boundary', 'Solid blue line'],
                  ['Class C boundary', 'Solid magenta line'],
                  ['Class D boundary', 'Dashed blue line'],
                  ['Class E (to surface)', 'Dashed magenta line'],
                  ['Class E (700 AGL)', 'Fuzzy/shaded magenta'],
                ].map(([item, fact]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{fact}</div>
                  </div>
                ))}
              </Card>
              <Card title="Radio Navigation">
                {[
                  ['VOR', 'VHF Omni-directional Range — 108.0–117.95 MHz — line of sight'],
                  ['VOR accuracy', '±4° course accuracy'],
                  ['VOR check methods', 'VOT, ground checkpoint, airborne checkpoint, dual VOR check'],
                  ['NDB', 'Non-Directional Beacon — 190–535 kHz — ADF needle points TO the station'],
                  ['GPS', 'RAIM required for IFR — satisfactory for VFR navigation'],
                  ['DME', 'Distance Measuring Equipment — gives slant range distance to station'],
                ].map(([nav, desc]) => (
                  <div key={nav} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{nav}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{desc}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* HUMAN FACTORS */}
          <div id="human" className="fade-up">
            <SectionHeader number="08" title="Human Factors & ADM" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="IMSAFE Preflight Checklist">
                {[
                  ['I', 'Illness — any symptoms affecting performance?'],
                  ['M', 'Medication — any Rx or OTC drugs with side effects?'],
                  ['S', 'Stress — psychological pressure affecting focus?'],
                  ['A', 'Alcohol — within 8 hours? BAC below 0.04%?'],
                  ['F', 'Fatigue — adequately rested?'],
                  ['E', 'Emotion / Eating — emotionally stable? Last meal?'],
                ].map(([letter, item]) => (
                  <div key={letter} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </Card>
              <Card title="5 Hazardous Attitudes & Antidotes">
                {[
                  ['Antiauthority', '"Don\'t tell me!"', 'Follow the rules — they\'re there for a reason'],
                  ['Impulsivity', '"Do something — now!"', 'Not so fast — think first'],
                  ['Invulnerability', '"It won\'t happen to me"', 'It could happen to me'],
                  ['Macho', '"I can do it"', 'Taking chances is foolish'],
                  ['Resignation', '"What\'s the use?"', 'I\'m not helpless — I can make a difference'],
                ].map(([attitude, thought, antidote]) => (
                  <div key={attitude} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{attitude} <span style={{ color: 'var(--lp-text3)', fontWeight: 400, fontSize: 12 }}>{thought}</span></div>
                    <div style={{ fontSize: 12, color: 'var(--lp-blue)' }}>→ {antidote}</div>
                  </div>
                ))}
              </Card>
              <Card title="DECIDE Model">
                {[
                  ['D', 'Detect — recognize that a change has occurred'],
                  ['E', 'Estimate — estimate the need to react to the change'],
                  ['C', 'Choose — choose a desirable outcome for the flight'],
                  ['I', 'Identify — identify actions to successfully control the outcome'],
                  ['D', 'Do — take the necessary actions'],
                  ['E', 'Evaluate — evaluate the effect of the actions'],
                ].map(([letter, step], i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{step}</span>
                  </div>
                ))}
              </Card>
              <Card title="Hypoxia & Hyperventilation">
                {[
                  ['Hypoxia onset (no O₂)', 'Noticeable above 10,000 ft day, 5,000 ft night'],
                  ['O₂ required (FAR 91.211)', 'Flight crew above 12,500 MSL > 30 min; all occupants above 14,000 MSL'],
                  ['Hypoxia symptoms', 'Euphoria, tingling, headache, poor judgment — victim rarely self-diagnoses'],
                  ['Hyperventilation', 'Too much CO₂ exhaled — dizziness, tingling, spasms — breathe into bag or slow breathing'],
                  ['Carbon monoxide', 'Colorless, odorless — headache, drowsiness — open fresh air vents immediately'],
                ].map(([item, fact]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{fact}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* LIGHT SIGNALS */}
          <div id="lights" className="fade-up">
            <SectionHeader number="09" title="ATC Light Signals" />
            <Table
              heads={['Signal', 'Aircraft in Flight', 'Aircraft on Ground']}
              rows={[
                ['Steady Green', 'Cleared to land', 'Cleared for takeoff'],
                ['Flashing Green', 'Return for landing (not cleared yet)', 'Cleared to taxi'],
                ['Steady Red', 'Give way — continue circling', 'Stop'],
                ['Flashing Red', 'Airport unsafe — do not land', 'Taxi clear of runway in use'],
                ['Flashing White', 'N/A', 'Return to starting point on airport'],
                ['Alternating Red/Green', 'Exercise extreme caution', 'Exercise extreme caution'],
              ]}
            />
          </div>

          {/* CTA */}
          <div className="fade-up" style={{ background: 'rgba(5,88,102,0.15)', border: '1px solid var(--lp-border2)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>READY TO TEST YOURSELF?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Put the cheat sheet to the test</h2>
            <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
              Try 30 free PAR practice questions — or get the full 1,400+ question bank with timed simulator and AI instructor.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/par-practice-test" className="lp-btn-outline">Free 30-Question Test</Link>
              <Link to="/register?plan=par" className="lp-btn-hero" style={{ fontSize: 17, padding: '14px 32px' }}>Get Full 1,400+ Question Bank →</Link>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · $24.99/month · Cancel anytime</div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)', padding: '40px 40px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Link to="/" className="lp-nav-logo" style={{ marginBottom: 16, display: 'inline-block' }}>FAA<span>Examinations</span>.com</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 20, marginTop: 8 }}>
            {[
              ['/par', 'PAR Package'],
              ['/ira', 'IRA Package'],
              ['/cax', 'CAX Package'],
              ['/part-107', 'Part 107'],
              ['/par-practice-test', 'PAR Practice Test'],
              ['/part-107-practice-test', 'Part 107 Practice Test'],
              ['/blog', 'Blog'],
            ].map(([path, label]) => (
              <Link key={path} to={path} style={{ color: 'var(--lp-text3)', fontSize: 13 }}>{label}</Link>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--lp-text3)', opacity: 0.5 }}>
            © {new Date().getFullYear()} FAAExaminations.com · Not affiliated with the FAA
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeader({ number, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
      <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.1)', padding: '4px 8px', borderRadius: 6, flexShrink: 0 }}>{number}</span>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: 0 }}>{title}</h2>
      <div style={{ flex: 1, height: 1, background: 'var(--lp-border)' }} />
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: 'var(--lp-charcoal)', border: '1px solid var(--lp-border)', borderRadius: 12, padding: '20px 20px' }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--lp-blue)', marginBottom: 14, letterSpacing: '0.04em' }}>{title}</div>
      {children}
    </div>
  );
}

function Table({ heads, rows, compact }) {
  const pad = compact ? '6px 10px' : '10px 14px';
  return (
    <div style={{ overflowX: 'auto', borderRadius: 10, border: '1px solid var(--lp-border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: 'rgba(48,172,226,0.08)' }}>
            {heads.map((h) => (
              <th key={h} style={{ padding: pad, textAlign: 'left', color: 'var(--lp-blue)', fontWeight: 700, fontSize: 12, letterSpacing: '0.05em', borderBottom: '1px solid var(--lp-border)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
              {row.map((cell, j) => (
                <td key={j} style={{ padding: pad, color: j === 0 ? '#fff' : 'var(--lp-text2)', borderBottom: i < rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', lineHeight: 1.5 }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children }) {
  return (
    <div style={{ marginTop: 10, fontSize: 12, color: 'var(--lp-text3)', background: 'rgba(255,255,255,0.03)', borderLeft: '2px solid rgba(48,172,226,0.4)', padding: '6px 10px', borderRadius: '0 6px 6px 0', lineHeight: 1.6 }}>
      {children}
    </div>
  );
}
