import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SEO_TITLE = 'FAA Instrument Rating Exam Cheat Sheet (IRA) — IFR Rules, Approaches & Minimums (2026)';
const SEO_DESC = 'Free FAA Instrument Rating written exam cheat sheet. IFR equipment, weather minimums, approach categories, holding procedures, alternate requirements, and currency rules.';

const SECTIONS = [
  { id: 'currency', label: 'IFR Currency' },
  { id: 'equipment', label: 'IFR Equipment' },
  { id: 'weather', label: 'Weather Minimums' },
  { id: 'approaches', label: 'Approach Types' },
  { id: 'alternates', label: 'Alternate Requirements' },
  { id: 'holds', label: 'Holding Procedures' },
  { id: 'charts', label: 'Chart Reading' },
  { id: 'clearances', label: 'IFR Clearances' },
];

export default function IRACheatSheet() {
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

  return (
    <div className="lp">
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESC} />
        <link rel="canonical" href="https://faaexaminations.com/ira-cheat-sheet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/ira-cheat-sheet" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: SEO_TITLE,
          description: SEO_DESC,
          url: 'https://faaexaminations.com/ira-cheat-sheet',
        })}</script>
      </Helmet>

      <nav className="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <Link to="/ira" className="lp-nav-link">Full IRA Package</Link>
          <Link to="/ira-practice-test" className="lp-nav-link">Practice Test</Link>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="lp-nav-link">Login</Link>
          <Link to="/register?plan=ira" className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>Start Free →</Link>
        </div>
      </nav>

      <section style={{ padding: '120px 40px 70px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>IRA EXAM · FREE REFERENCE</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: 1.1, marginBottom: 20 }}>
            Instrument Rating Exam <span className="lp-accent">Cheat Sheet</span>
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            Every key number, minimums table, procedure, and acronym tested on the FAA Instrument Rating written exam (IRA) — organized by topic. Bookmark or print before you study.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#content" className="lp-btn-hero">Jump to Cheat Sheet ↓</a>
            <Link to="/ira-practice-test" className="lp-btn-outline">Free 30-Question Practice Test</Link>
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

          {/* IFR CURRENCY */}
          <div id="currency" className="fade-up">
            <SectionHeader number="01" title="IFR Currency Requirements (FAR 61.57)" />
            <Table
              heads={['Requirement', 'Details']}
              rows={[
                ['IFR currency period', 'Preceding 6 calendar months'],
                ['Approaches required', '6 instrument approaches'],
                ['Other tasks required', 'Holding procedures + intercepting and tracking courses through nav systems'],
                ['Where performed', 'In actual IMC, sim/ATD, or with a safety pilot under foggles/hood'],
                ['If currency lapses (6–12 months)', 'Must complete IPC (Instrument Proficiency Check) with CFII'],
                ['If lapsed > 12 months', 'Must complete IPC — same requirement'],
                ['Instrument Proficiency Check (IPC)', 'Conducted by CFII or check airman — restores full IFR currency'],
                ['Logging requirement', 'Log each approach with type, location, date, and conditions'],
              ]}
            />
            <div style={{ marginTop: 16 }}>
              <Note>Currency ≠ Proficiency. You can be current and still not be safe to fly hard IFR. The IPC exists for a reason.</Note>
            </div>
          </div>

          {/* IFR EQUIPMENT */}
          <div id="equipment" className="fade-up">
            <SectionHeader number="02" title="IFR Equipment — GRABCARD" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Required IFR Equipment — GRABCARD (FAR 91.205)">
                {[
                  ['G', 'Generator or alternator'],
                  ['R', 'Radios (nav and comm appropriate for route)'],
                  ['A', 'Altimeter (sensitive, adjustable)'],
                  ['B', 'Ball (slip/skid indicator)'],
                  ['C', 'Clock (hours, minutes, seconds)'],
                  ['A', 'Attitude indicator'],
                  ['R', 'Rate-of-turn indicator'],
                  ['D', 'Directional gyro (heading indicator)'],
                ].map(([letter, item]) => (
                  <div key={item} style={{ display: 'flex', gap: 10, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <Note>Add VFR day equipment (ATOMATOFLAMES) — all of that is also required</Note>
              </Card>
              <Card title="Pitot-Static System Instruments">
                {[
                  ['Airspeed indicator', 'Pitot pressure vs static pressure'],
                  ['Altimeter', 'Static pressure only'],
                  ['VSI (Vertical Speed)', 'Rate of static pressure change'],
                  ['Alternate static source', 'Inside cabin — slightly lower pressure — airspeed/altimeter read slightly high'],
                  ['Pitot heat', 'Required for IFR flight in visible moisture (FAR 91.207)'],
                  ['Blocked pitot (static ok)', 'Airspeed reads zero (or freezes at current speed)'],
                  ['Blocked static (pitot ok)', 'Altimeter freezes, VSI reads zero, airspeed erratic'],
                  ['Both blocked', 'All pitot-static instruments unreliable'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Gyroscopic Instruments">
                {[
                  ['Attitude indicator', 'Gyro — vacuum/suction driven (or electric) — shows pitch and bank'],
                  ['Heading indicator (DI)', 'Gyro — precesses — must be set to magnetic compass every 15 min'],
                  ['Turn coordinator', 'Gyro — electric — shows rate of turn AND bank tendency (miniature aircraft)'],
                  ['Turn-and-slip indicator', 'Gyro — shows rate of turn only (not bank) + inclinometer ball'],
                  ['Vacuum system failure', 'AI and HI fail — compass and TC (electric) remain'],
                  ['Gyro precession', 'Apparent drift due to earth rotation and real precession — re-set HI regularly'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* IFR WEATHER MINIMUMS */}
          <div id="weather" className="fade-up">
            <SectionHeader number="03" title="IFR Weather Minimums & Filing" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="When IFR Flight is Required">
                {[
                  ['IMC (below VFR minimums)', 'Must be IFR rated and on IFR flight plan'],
                  ['Class A airspace', 'Always IFR — no VFR in Class A'],
                  ['In clouds', 'Always IFR — even if VFR on top'],
                  ['VFR on top', 'Must be on IFR clearance if in controlled airspace'],
                  ['MVFR conditions', 'Can still fly VFR if at or above minimums — IFR not required but advisable'],
                ].map(([condition, rule]) => (
                  <div key={condition} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{condition}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{rule}</div>
                  </div>
                ))}
              </Card>
              <Card title="IFR Filing Requirements">
                {[
                  ['Flight plan required', 'For IFR flight in controlled airspace'],
                  ['When to file', 'Before departure — file at least 30 min before departure for ATCSCC routing'],
                  ['Fuel requirements', 'Enough to fly to destination + alternate (if required) + 45 min reserve (FAR 91.167)'],
                  ['Alternate fuel', 'Destination + alternate + 45 min at normal cruise'],
                  ['IFR clearance void time', 'If not airborne by void time, clearance expires — call ATC before departing'],
                  ['Pop-up IFR clearance', 'Request in flight — not guaranteed, especially in busy airspace'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* APPROACHES */}
          <div id="approaches" className="fade-up">
            <SectionHeader number="04" title="Instrument Approach Types & Minimums" />
            <Table
              heads={['Approach Type', 'Guidance', 'Decision Point', 'Minimums']}
              rows={[
                ['ILS (Precision)', 'Lateral + vertical (glideslope)', 'DA (Decision Altitude)', 'As low as 200 ft / ½ SM'],
                ['LPV (WAAS GPS)', 'Lateral + vertical (WAAS)', 'DA', 'As low as 200 ft / ½ SM'],
                ['LNAV/VNAV', 'Lateral + advisory vertical', 'DA', 'Typically 250–350 ft / ¾ SM'],
                ['LNAV (non-precision)', 'Lateral only (GPS)', 'MDA (Minimum Descent Alt)', 'Typically 300–500 ft / 1 SM'],
                ['VOR', 'Lateral only (VOR radial)', 'MDA', 'Typically 300–600 ft / 1 SM'],
                ['NDB', 'Lateral only (ADF bearing)', 'MDA', 'Typically 400–700 ft / 1 SM'],
                ['LOC (Localizer only)', 'Lateral only (no glideslope)', 'MDA', 'Higher than ILS — no GS'],
                ['Circling', 'Maneuvering to land on different runway', 'MDA', 'Based on aircraft category'],
              ]}
            />
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Aircraft Approach Categories (speed at 1.3 Vso)">
                <Table
                  heads={['Category', 'Speed']}
                  rows={[
                    ['A', 'Under 91 knots'],
                    ['B', '91–120 knots'],
                    ['C', '121–140 knots'],
                    ['D', '141–165 knots'],
                    ['E', 'Over 166 knots'],
                  ]}
                  compact
                />
                <Note>Category is based on 1.3× stall speed in landing configuration (Vso) — not aircraft type</Note>
              </Card>
              <Card title="DA vs MDA — Key Difference">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  <strong style={{ color: '#fff' }}>DA (Decision Altitude)</strong> — precision approach. At DA, you decide: land or go missed. You cannot descend below DA unless you have the required visual references.
                </div>
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  <strong style={{ color: '#fff' }}>MDA (Minimum Descent Altitude)</strong> — non-precision approach. You level off at MDA and fly level until you see the runway environment or reach the missed approach point (MAP).
                </div>
                <Note>You may not descend below MDA unless you have required visual reference AND can make a normal landing. If not, execute missed approach immediately at MAP.</Note>
              </Card>
              <Card title="Required Visual References to Land (FAR 91.175)">
                {[
                  'Approach light system (ALS)',
                  'Threshold or threshold markings',
                  'Threshold lights',
                  'REIL (Runway End Identifier Lights)',
                  'VASI or PAPI',
                  'Touchdown zone or markings',
                  'Touchdown zone lights',
                  'Runway or runway markings',
                  'Runway lights',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--lp-blue)', flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{item}</span>
                  </div>
                ))}
                <Note>Must maintain visual reference continuously from DA/MDA to touchdown</Note>
              </Card>
            </div>
          </div>

          {/* ALTERNATE REQUIREMENTS */}
          <div id="alternates" className="fade-up">
            <SectionHeader number="05" title="Alternate Airport Requirements" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="When an Alternate is Required — 1-2-3 Rule (FAR 91.169)">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 12 }}>
                  No alternate required if, for <strong style={{ color: '#fff' }}>1 hour before to 1 hour after</strong> your ETA, the destination forecast shows:
                </div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '12px 16px', borderRadius: 8, marginBottom: 12, lineHeight: 1.8 }}>
                  Ceiling ≥ 2,000 ft AGL<br />
                  Visibility ≥ 3 SM
                </div>
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7 }}>
                  If either is below those values, you <strong style={{ color: '#fff' }}>must</strong> file an alternate.
                </div>
                <Note>"1-2-3 Rule" — 1 hour, 2,000 ft ceiling, 3 SM visibility</Note>
              </Card>
              <Card title="Alternate Minimums">
                {[
                  ['Standard alternate minimums (precision)', 'Ceiling 600 ft · Visibility 2 SM'],
                  ['Standard alternate minimums (non-precision)', 'Ceiling 800 ft · Visibility 2 SM'],
                  ['Non-standard alternates', 'Published in the "A" symbol on approach charts — must use those values'],
                  ['NA alternate', 'Airport listed as NA (not authorized) — cannot be filed as alternate'],
                  ['No instrument approach at alternate', 'Ceiling must allow VFR descent from MEA and landing'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* HOLDING */}
          <div id="holds" className="fade-up">
            <SectionHeader number="06" title="Holding Procedures" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Standard Hold">
                {[
                  ['Direction', 'Right turns (standard) — left turns only if specified'],
                  ['Inbound leg', '1 minute (at/below 14,000 MSL) · 1.5 min (above 14,000 MSL)'],
                  ['Outbound timing', 'Begin timing when abeam the fix, or wings level (whichever is later)'],
                  ['Adjust outbound', 'Add time if inbound leg is too short, subtract if too long'],
                  ['Speed limits (FAR 91.117)', 'At/below 6,000 MSL: 200 KIAS · 6,001–14,000 MSL: 230 KIAS · Above 14,000: 265 KIAS'],
                  ['EFC (Expect Further Clearance)', 'Always get EFC before entering hold — needed if comms fail'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
              <Card title="Hold Entries">
                {[
                  ['Direct entry', 'Fly directly to fix and turn in holding direction'],
                  ['Teardrop entry', 'Fly ~30° into protected airspace, then turn back to intercept inbound'],
                  ['Parallel entry', 'Fly parallel outbound, turn away from holding side, intercept inbound'],
                ].map(([entry, desc]) => (
                  <div key={entry} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--lp-blue)', fontSize: 13, marginBottom: 3 }}>{entry}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
                <Note>Entry type depends on your heading relative to the holding course — the 70°/110° sector method is taught universally</Note>
              </Card>
              <Card title="Lost Comms in IFR (FAR 91.185) — AVEF">
                {[
                  ['A — Assigned', 'Fly last assigned altitude'],
                  ['V — Vectored', 'Altitude assigned for vectoring'],
                  ['E — Expected', 'Altitude in flight plan or ATC expected altitude'],
                  ['F — Filed', 'Altitude filed in flight plan'],
                ].map(([letter, detail]) => (
                  <div key={letter} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 20 }}>{letter.split(' ')[0]}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{detail}</span>
                  </div>
                ))}
                <Note>Squawk 7600 immediately. Fly the highest of AVEF altitudes. Proceed via route, EFC time, or flight plan. Descend for approach at filed/expected ETA.</Note>
              </Card>
            </div>
          </div>

          {/* CHART READING */}
          <div id="charts" className="fade-up">
            <SectionHeader number="07" title="IFR Chart Reading" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Minimum Altitudes on En Route Charts">
                {[
                  ['MEA (Minimum Enroute Altitude)', 'Guarantees obstacle clearance + nav signal reception along airway'],
                  ['MOCA (Min Obstacle Clearance Alt)', 'Guarantees obstacle clearance — nav signal only within 22 NM of VOR'],
                  ['MRA (Minimum Reception Altitude)', 'Minimum altitude to receive a specific fix or navaid'],
                  ['MAA (Maximum Authorized Altitude)', 'Upper limit of usable airspace on that airway segment'],
                  ['MCA (Minimum Crossing Altitude)', 'Must be at or above this when crossing a fix (steep terrain ahead)'],
                  ['OROCA (Off Route Obstruction Clearance Alt)', 'Obstacle clearance off published airways — 1,000 ft (2,000 in mountains)'],
                ].map(([abbrev, meaning]) => (
                  <div key={abbrev} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{abbrev}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{meaning}</div>
                  </div>
                ))}
              </Card>
              <Card title="Approach Chart Key Symbols">
                {[
                  ['MSA circle', 'Minimum Safe Altitude — 1,000 ft obstacle clearance within 25 NM of the fix'],
                  ['Zigzag line on profile', 'Procedure turn — must be completed within depicted distance'],
                  ['NoPT notation', 'No procedure turn — fly straight-in from that direction'],
                  ['Bold T in box', 'Takeoff minimums not standard — see published takeoff minimums'],
                  ['Bold A in box', 'Alternate minimums not standard — see alternate minimums section'],
                  ['Fix/FAF on profile', 'Final approach fix (FAF) — where final descent begins'],
                  ['Maltese cross', 'Final approach fix on profile view'],
                  ['X on profile', 'Missed approach point (MAP) on non-precision approach'],
                ].map(([symbol, meaning]) => (
                  <div key={symbol} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{symbol}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{meaning}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* IFR CLEARANCES */}
          <div id="clearances" className="fade-up">
            <SectionHeader number="08" title="IFR Clearances & Procedures" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Reading Your Clearance — CRAFT">
                {[
                  ['C', 'Clearance limit (usually destination airport)'],
                  ['R', 'Route (as filed, or amended)'],
                  ['A', 'Altitude (initial, and expect altitude in X minutes)'],
                  ['F', 'Frequency (departure control)'],
                  ['T', 'Transponder code (squawk)'],
                ].map(([letter, item]) => (
                  <div key={letter} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontWeight: 700, color: 'var(--lp-blue)', minWidth: 16 }}>{letter}</span>
                    <span style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <Note>Always read back clearance in full. Altitudes and transponder codes must be read back.</Note>
              </Card>
              <Card title="IFR Transponder Codes">
                {[
                  ['1200', 'VFR — general aviation under VFR'],
                  ['7500', 'Hijacking in progress'],
                  ['7600', 'Lost communications (radio failure)'],
                  ['7700', 'Emergency'],
                  ['ATC assigned', 'Use assigned code in IFR — 1200 only for VFR'],
                ].map(([code, meaning]) => (
                  <div key={code} style={{ display: 'flex', gap: 12, padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--lp-blue)', fontWeight: 700, minWidth: 50 }}>{code}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{meaning}</span>
                  </div>
                ))}
              </Card>
              <Card title="Key IFR Numbers to Know Cold">
                <Table
                  heads={['Item', 'Value']}
                  rows={[
                    ['IFR currency period', '6 calendar months'],
                    ['Approaches for currency', '6 instrument approaches'],
                    ['Alternate: ceiling min (precision)', '600 ft / 2 SM'],
                    ['Alternate: ceiling min (non-precision)', '800 ft / 2 SM'],
                    ['1-2-3 rule: ceiling', '2,000 ft AGL'],
                    ['1-2-3 rule: visibility', '3 SM'],
                    ['1-2-3 rule: time window', '1 hour before/after ETA'],
                    ['Fuel reserve (IFR)', '45 minutes at normal cruise'],
                    ['VOR check (IFR)', 'Every 30 days'],
                    ['Transponder check', 'Every 24 calendar months'],
                    ['Hold speed — at/below 6,000', '200 KIAS max'],
                    ['Hold speed — 6,001–14,000', '230 KIAS max'],
                    ['Hold speed — above 14,000', '265 KIAS max'],
                    ['ILS minimums (best)', '200 ft DA / ½ SM'],
                    ['Standard hold leg time', '1 min (below 14,000 MSL)'],
                  ]}
                  compact
                />
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="fade-up" style={{ background: 'rgba(5,88,102,0.15)', border: '1px solid var(--lp-border2)', borderRadius: 16, padding: '40px 32px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-text3)', letterSpacing: 1, marginBottom: 10 }}>READY TO TEST YOURSELF?</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Put the cheat sheet to the test</h2>
            <p style={{ color: 'var(--lp-text2)', fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 28px' }}>
              Try 30 free IRA practice questions — or get the full 722-question bank with timed simulator and AI instructor.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/ira-practice-test" className="lp-btn-outline">Free 30-Question Test</Link>
              <Link to="/register?plan=ira" className="lp-btn-hero" style={{ fontSize: 17, padding: '14px 32px' }}>Get Full 722-Question Bank →</Link>
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
              ['/ira', 'IRA Package'],
              ['/par', 'PAR Package'],
              ['/cax', 'CAX Package'],
              ['/part-107', 'Part 107'],
              ['/ira-practice-test', 'IRA Practice Test'],
              ['/par-cheat-sheet', 'PAR Cheat Sheet'],
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
