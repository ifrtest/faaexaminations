import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SEO_TITLE = 'FAA Commercial Pilot Exam Cheat Sheet (CAX) — Key Rules, Performance & Regulations (2026)';
const SEO_DESC = 'Free FAA Commercial Pilot written exam cheat sheet. Commercial privileges, complex/high-performance requirements, performance calculations, regulations, and weight & balance.';

const SECTIONS = [
  { id: 'privileges', label: 'Commercial Privileges' },
  { id: 'regs', label: 'Key Regulations' },
  { id: 'aircraft', label: 'Aircraft Requirements' },
  { id: 'performance', label: 'Performance' },
  { id: 'wb', label: 'Weight & Balance' },
  { id: 'aero', label: 'Aerodynamics' },
  { id: 'weather', label: 'Weather' },
  { id: 'maneuvers', label: 'Commercial Maneuvers' },
];

export default function CAXCheatSheet() {
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
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

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('print') === '1') {
      setTimeout(() => window.print(), 800);
    }
  }, []);

  return (
    <div className="lp">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESC} />
        <link rel="canonical" href="https://faaexaminations.com/cax-cheat-sheet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/cax-cheat-sheet" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <meta property="og:image" content="https://faaexaminations.com/plane-cax-hero.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="FAA Commercial Pilot exam cheat sheet — FAAExaminations.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESC} />
        <meta name="twitter:image" content="https://faaexaminations.com/plane-cax-hero.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: SEO_TITLE,
          description: SEO_DESC,
          url: 'https://faaexaminations.com/cax-cheat-sheet',
        })}</script>
      </Helmet>

      <nav className="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <Link to="/cax" className="lp-nav-link">Full CAX Package</Link>
          <Link to="/cax-practice-test" className="lp-nav-link">Practice Test</Link>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="lp-nav-link">Login</Link>
          <Link to="/register?plan=cax" className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>Start Free →</Link>
        </div>
      </nav>

      <section style={{ padding: '120px 40px 70px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>CAX EXAM · FREE REFERENCE</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: 1.1, marginBottom: 20 }}>
            Commercial Pilot Exam <span className="lp-accent">Cheat Sheet</span>
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            Key numbers, regulations, performance formulas, and aerodynamics concepts for the FAA Commercial Pilot written exam (CAX) — organized by topic for fast review.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#content" className="lp-btn-hero">Jump to Cheat Sheet ↓</a>
            <button onClick={() => window.print()} className="lp-btn-outline no-print" style={{ cursor: 'pointer' }}>⬇ Download PDF</button>
            <Link to="/cax-practice-test" className="lp-btn-outline">Free Practice Test</Link>
          </div>
        </div>
      </section>

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

      <section id="content" style={{ padding: '60px 24px 80px', background: 'var(--lp-dark)' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>

          {/* COMMERCIAL PRIVILEGES */}
          <div id="privileges" className="fade-up">
            <SectionHeader number="01" title="Commercial Pilot Privileges & Limitations" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="What a Commercial Certificate Allows (FAR 61.133)">
                {[
                  ['Pay for hire (ASEL/AMEL)', 'Act as PIC or SIC for compensation or hire'],
                  ['Carry passengers for hire', 'Allowed under Part 135 or with exceptions'],
                  ['Compensation for flights', 'Ferry flights, aerial work, air tours — with limitations'],
                  ['Flight instruction', 'Can give flight instruction if also holds CFI certificate'],
                  ['Tow gliders/banners', 'Allowed for compensation'],
                  ['Aerial photography', 'Allowed commercially'],
                ].map(([priv, detail]) => (
                  <div key={priv} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{priv}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Key Limitations">
                {[
                  ['Night VFR without instrument rating', 'Passengers allowed, but only within 50 NM of departure airport'],
                  ['IFR operations', 'Requires instrument rating — commercial alone does not allow IFR'],
                  ['Part 121/135 operations', 'Require additional certificates, training, and ATP (for Part 121 PIC)'],
                  ['Complex aircraft for hire', 'Must have complex aircraft endorsement (FAR 61.31)'],
                  ['High-performance for hire', 'Must have high-performance endorsement'],
                  ['Pressurized aircraft above 25,000 ft', 'Requires pressurized aircraft endorsement'],
                ].map(([limit, detail]) => (
                  <div key={limit} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{limit}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* KEY REGULATIONS */}
          <div id="regs" className="fade-up">
            <SectionHeader number="02" title="Key Regulations for Commercial Operations" />
            <Table
              heads={['Regulation', 'Requirement']}
              rows={[
                ['FAR 61.129 — Flight experience (ASEL)', '250 total hours · 100 PIC · 50 PIC cross-country · 10 PIC night · 10 instrument · 5 instrument in aircraft (not sim) · 10 hours in complex or turbine'],
                ['FAR 61.133 — Privileges', 'May act as PIC for compensation or hire in appropriate category/class'],
                ['FAR 61.31(e) — Complex aircraft', 'Endorsement required for retractable gear + flaps + controllable prop'],
                ['FAR 61.31(f) — High performance', 'Endorsement required for aircraft with engine > 200 HP'],
                ['FAR 61.31(g) — Pressurized above 25,000', 'Endorsement required for pressurized aircraft above FL250'],
                ['FAR 91.409 — 100-hour inspection', 'Required if aircraft is used for hire or flight instruction for hire'],
                ['FAR 135 — Charter/air taxi', 'Commercial operations carrying passengers for hire — requires Air Carrier Certificate'],
                ['FAR 119 — Certificate requirements', 'Defines who needs an Air Carrier Certificate and what type'],
                ['Alcohol — bottle to throttle', '8 hours (FAR 91.17)'],
                ['Max BAC for commercial ops', '0.04%'],
                ['Flight/duty limits (Part 91)', 'No formal rest requirement — pilot judgment'],
                ['Flight/duty limits (Part 135)', 'Specific limits apply — 8 hrs flight time in 24 hrs, 1,200 hrs/year, etc.'],
              ]}
            />
          </div>

          {/* AIRCRAFT REQUIREMENTS */}
          <div id="aircraft" className="fade-up">
            <SectionHeader number="03" title="Complex, High-Performance & Pressurized Aircraft" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Complex Aircraft (FAR 61.31(e))">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  A complex aircraft has ALL three of:
                </div>
                {[
                  'Retractable landing gear',
                  'Wing flaps',
                  'Controllable-pitch propeller',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--lp-blue)', flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)' }}>{item}</span>
                  </div>
                ))}
                <Note>An aircraft with a FADEC system (full authority digital engine control) may substitute for controllable-pitch prop</Note>
              </Card>
              <Card title="High-Performance Aircraft (FAR 61.31(f))">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  Any aircraft with an engine of <strong style={{ color: '#fff' }}>more than 200 horsepower</strong>.
                </div>
                {[
                  ['Endorsement required', 'Ground and flight training from a CFI — endorsement in logbook'],
                  ['Examples', 'Cessna 182 (230 HP), Beechcraft Bonanza, most twins'],
                  ['Not high-performance', 'Cessna 172 (180 HP), Piper Cherokee 180 — no endorsement needed'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Turbine & Jet Considerations">
                {[
                  ['V speeds — Vmo', 'Maximum operating speed — never exceed in cruise'],
                  ['Mmo', 'Maximum Mach number — applies at altitude where Mach limit is lower than Vmo'],
                  ['Coffin corner', 'High altitude where stall speed and Mmo converge — very narrow safe airspeed range'],
                  ['Jet fuel (Jet-A)', 'Heavier than avgas — 6.7 lbs/gallon vs 6.0 for avgas'],
                  ['Turbine spool time', 'Engines do not respond instantly to throttle — plan ahead'],
                  ['Reverse thrust', 'Available on jets and turboprops for braking after landing'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* PERFORMANCE */}
          <div id="performance" className="fade-up">
            <SectionHeader number="04" title="Performance Calculations" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Density Altitude & Its Effects">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.8 }}>
                  DA = Pressure Altitude<br />
                  + (120 × (OAT − ISA Temp))<br /><br />
                  ISA Temp = 15°C − 2°C/1,000 ft PA
                </div>
                {[
                  ['High DA effect on lift', 'Reduced — longer takeoff roll, slower climb'],
                  ['High DA effect on engine', 'Naturally aspirated engine loses ~3% power per 1,000 ft DA'],
                  ['Turbocharger benefit', 'Maintains sea-level pressure to critical altitude — partially offsets DA'],
                  ['High DA effect on prop', 'Less air to bite — reduced thrust'],
                  ['Humidity effect', 'High humidity increases DA — water vapor displaces air (less dense)'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Takeoff & Landing Performance">
                {[
                  ['Headwind (full)', 'Reduces takeoff/landing distance ~10% per 9 kt headwind'],
                  ['Tailwind (10 kt)', '~21% longer takeoff roll — 10% of V-liftoff added to groundspeed'],
                  ['Uphill slope', 'Increases takeoff roll — reduces landing roll'],
                  ['Downhill slope', 'Decreases takeoff roll — increases landing roll'],
                  ['Wet/contaminated runway', 'Increases landing roll significantly — use POH data'],
                  ['Higher gross weight', 'Higher V speeds — longer ground roll — shallower climb'],
                  ['High density altitude', 'All performance numbers degrade — use POH DA charts'],
                ].map(([factor, effect]) => (
                  <div key={factor} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{factor}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{effect}</div>
                  </div>
                ))}
              </Card>
              <Card title="Key V Speeds">
                <Table
                  heads={['Speed', 'Definition']}
                  rows={[
                    ['Vso', 'Stall speed in landing configuration'],
                    ['Vs1', 'Stall speed in clean (cruise) configuration'],
                    ['Vr', 'Rotation speed — lift off here'],
                    ['Vx', 'Best angle of climb — max altitude per distance'],
                    ['Vy', 'Best rate of climb — max altitude per time'],
                    ['Va', 'Maneuvering speed — max for full control inputs'],
                    ['Vfe', 'Max flap extended speed'],
                    ['Vle', 'Max landing gear extended speed'],
                    ['Vlo', 'Max landing gear operating speed'],
                    ['Vno', 'Max structural cruising speed'],
                    ['Vne', 'Never exceed speed'],
                    ['Vmc', 'Minimum control speed with critical engine out (multi)'],
                    ['Vyse', 'Best rate of climb — one engine inoperative (multi — blue line)'],
                  ]}
                  compact
                />
              </Card>
            </div>
          </div>

          {/* WEIGHT & BALANCE */}
          <div id="wb" className="fade-up">
            <SectionHeader number="05" title="Weight & Balance" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="W&B Formulas">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.9 }}>
                  Moment = Weight × Arm<br />
                  CG = Total Moment ÷ Total Weight<br />
                  New CG after shift:<br />
                  ΔCG = (Weight shifted × Distance) ÷ Total Weight
                </div>
                {[
                  ['Forward CG limits', 'Structural — ensures elevator authority for flare'],
                  ['Aft CG limits', 'Stability — aft CG reduces pitch stability, degrades spin recovery'],
                  ['Fuel weight', 'Avgas = 6.0 lbs/gal · Jet-A = 6.7 lbs/gal'],
                  ['Oil weight', '~7.5 lbs/gallon'],
                  ['Must check at takeoff AND landing', 'Fuel burn shifts CG — may be out of limits at landing even if within limits at takeoff'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="CG Effects on Performance">
                <Table
                  heads={['CG Position', 'Effect']}
                  rows={[
                    ['Forward CG', 'More stable · Higher stall speed · More back pressure needed to flare · Better spin recovery'],
                    ['Aft CG', 'Less stable · Lower stall speed · Less elevator needed · Poor spin recovery · More efficient cruise'],
                    ['CG too far forward', 'May not rotate — elevator authority insufficient'],
                    ['CG too far aft', 'Unstable — may not recover from upset'],
                  ]}
                />
              </Card>
            </div>
          </div>

          {/* AERODYNAMICS */}
          <div id="aero" className="fade-up">
            <SectionHeader number="06" title="Advanced Aerodynamics" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Load Factor & Accelerated Stalls">
                <Table
                  heads={['Bank Angle', 'Load Factor', 'Stall Speed (× Vs)']}
                  rows={[
                    ['0°', '1.0 G', '1.00 × Vs'],
                    ['30°', '1.15 G', '1.07 × Vs'],
                    ['45°', '1.41 G', '1.19 × Vs'],
                    ['60°', '2.0 G', '1.41 × Vs'],
                    ['75°', '3.86 G', '1.97 × Vs'],
                  ]}
                  compact
                />
                <Note>Accelerated stalls can occur at any airspeed if AOA exceeds critical angle due to abrupt control inputs</Note>
              </Card>
              <Card title="Drag Types">
                {[
                  ['Parasite drag', 'Form drag + skin friction + interference drag — increases with speed² — dominant at high speed'],
                  ['Induced drag', 'Byproduct of lift production — decreases as speed increases — dominant at low speed'],
                  ['Total drag', 'Sum of parasite + induced — minimum at best glide speed (L/D max)'],
                  ['L/D max speed', 'Vbg (best glide) — also where total drag is minimum'],
                  ['Propeller efficiency', 'Best at moderate airspeeds — decreases at very low or very high speeds'],
                ].map(([type, detail]) => (
                  <div key={type} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{type}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Ground Effect">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  Ground effect occurs within one wingspan of the ground. It reduces induced drag, which can cause the aircraft to float during landing or become airborne before it has sufficient climb performance.
                </div>
                {[
                  ['Wingspan = 40 ft', 'Ground effect within 40 ft AGL'],
                  ['Within ground effect', 'Reduced induced drag — floats — may not climb once clear'],
                  ['Leaving ground effect', 'Induced drag increases — aircraft may settle — need more power'],
                  ['Landing in ground effect', 'Extended float — don\'t force aircraft on — wait for it to settle'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Wake Turbulence">
                {[
                  ['Cause', 'Wingtip vortices generated by any wing producing lift — worst at slow, heavy, clean config'],
                  ['Most dangerous', 'Heavy aircraft — slow — gear/flaps up — on approach'],
                  ['Vortex behavior', 'Sink at ~300-500 ft/min · Drift downwind · Stay near ground longer near threshold'],
                  ['Takeoff behind heavy', 'Rotate before heavy\'s rotation point — climb above and upwind of its flight path'],
                  ['Landing behind heavy', 'Land beyond threshold — stay above its glide path'],
                  ['Crosswind with vortex', 'Upwind vortex stays near runway — downwind one moves away quickly'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* WEATHER */}
          <div id="weather" className="fade-up">
            <SectionHeader number="07" title="Weather for Commercial Operations" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Icing">
                {[
                  ['Structural icing', 'Forms on airframe in visible moisture at 0°C or below — disrupts airflow'],
                  ['Rime ice', 'Opaque, rough — forms rapidly in supercooled droplets — worst for lift disruption'],
                  ['Clear ice', 'Clear, hard, heavy — forms in large supercooled water drops — most serious type'],
                  ['Mixed ice', 'Combination — worst operational characteristics'],
                  ['Induction icing (carb ice)', 'Can form at temps up to 70°F with high humidity — most likely with power reduced'],
                  ['Most dangerous altitude', 'Near freezing level — just below is often the worst icing zone'],
                  ['Escape route', 'Climb above or descend below — descending into warmer air is usually faster'],
                ].map(([type, detail]) => (
                  <div key={type} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{type}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Turbulence Intensities">
                <Table
                  heads={['Intensity', 'Effect']}
                  rows={[
                    ['Light', 'Slight erratic changes in altitude/attitude — occupants feel strain against belts'],
                    ['Moderate', 'Changes in altitude/attitude — hard to walk — food service difficult'],
                    ['Severe', 'Large abrupt changes — aircraft may be momentarily out of control'],
                    ['Extreme', 'Aircraft is tossed violently — structurally stressed — avoid at all costs'],
                    ['CAT (Clear Air)', 'At altitude — no visual warning — associated with jet streams and mountain waves'],
                  ]}
                />
              </Card>
              <Card title="Weather Hazards to Know Cold">
                {[
                  ['Mountain wave', 'Extends 100+ miles downwind — CAT possible well beyond mountain range'],
                  ['Microbursts', 'Intense localized downdraft — 2 NM across — 15 min duration — severe wind shear'],
                  ['Low-level wind shear (LLWS)', 'Rapid change in wind — especially near thunderstorms or temperature inversions'],
                  ['Frost on wings', 'Disrupts boundary layer — increases stall speed — must be removed before flight'],
                  ['Freezing rain', 'Heaviest icing — originates as rain from warm layer above — rapid accumulation'],
                ].map(([hazard, detail]) => (
                  <div key={hazard} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{hazard}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* COMMERCIAL MANEUVERS */}
          <div id="maneuvers" className="fade-up">
            <SectionHeader number="08" title="Commercial Maneuvers (Knowledge Test Focus)" />
            <Table
              heads={['Maneuver', 'Key Points']}
              rows={[
                ['Chandelle', '180° climbing turn — max performance — begins at Va, ends just above stall at 90° · Bank held constant first 90°, then bank rolled out while pitch maintained'],
                ['Lazy Eight', 'Symmetrical climbing and descending turns — 180° each — coordinated · Points of highest pitch and bank do NOT coincide — bank is max at 90° point'],
                ['Steep spiral', 'Constant radius descending turn — 45°+ bank — throttle idle · Requires crab into wind to maintain constant radius'],
                ['Eights on pylons', 'Pivotal altitude — altitude where line from wingtip to pylon appears stationary · Pivotal altitude (ft) ≈ (groundspeed in kt)² ÷ 11.3'],
                ['Steep turns', '50°+ bank — 360° or 720° — maintain altitude ±100 ft · Load factor at 60° = 2.0 G — stall speed 41% higher'],
                ['Power-off 180°', 'From downwind abeam threshold, land within 200 ft of spot — no power · Tests judgment, energy management, glide performance'],
              ]}
            />
          </div>

          {/* CTA */}
          <div className="fade-up" style={{ background: 'rgba(5,88,102,0.15)', border: '1px solid var(--lp-border2)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>READY TO TEST YOURSELF?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Put the cheat sheet to the test</h2>
            <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
              Try 30 free CAX practice questions — or get the full 536-question bank with timed simulator and AI instructor.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/cax-practice-test" className="lp-btn-outline">Free 30-Question Test</Link>
              <Link to="/register?plan=cax" className="lp-btn-hero" style={{ fontSize: 17, padding: '14px 32px' }}>Get Full 536-Question Bank →</Link>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>3-day free trial · $24.99/month · Cancel anytime</div>
          </div>

        </div>
      </section>

      <footer style={{ background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)', padding: '40px 40px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Link to="/" className="lp-nav-logo" style={{ marginBottom: 16, display: 'inline-block' }}>FAA<span>Examinations</span>.com</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 20, marginTop: 8 }}>
            {[
              ['/cax', 'CAX Package'],
              ['/par', 'PAR Package'],
              ['/ira', 'IRA Package'],
              ['/part-107', 'Part 107'],
              ['/cax-practice-test', 'CAX Practice Test'],
              ['/ira-cheat-sheet', 'IRA Cheat Sheet'],
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
