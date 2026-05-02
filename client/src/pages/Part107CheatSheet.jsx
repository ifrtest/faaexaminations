import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const SEO_TITLE = 'FAA Part 107 Cheat Sheet — Key Rules, Airspace & Numbers (2026)';
const SEO_DESC = 'Free FAA Part 107 drone license exam cheat sheet. Altitude limits, airspace authorization, Remote ID, weather minimums, waivers, and key regulations. Printable reference.';

const SECTIONS = [
  { id: 'limits', label: 'Operational Limits' },
  { id: 'airspace', label: 'Airspace' },
  { id: 'remoteid', label: 'Remote ID' },
  { id: 'waivers', label: 'Waivers' },
  { id: 'cert', label: 'Certificate Rules' },
  { id: 'weather', label: 'Weather' },
  { id: 'charts', label: 'Sectional Charts' },
  { id: 'reporting', label: 'Reporting & Emergencies' },
];

export default function Part107CheatSheet() {
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
        <link rel="canonical" href="https://faaexaminations.com/part-107-cheat-sheet" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://faaexaminations.com/part-107-cheat-sheet" />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESC} />
        <meta property="og:site_name" content="FAAExaminations.com" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: SEO_TITLE,
          description: SEO_DESC,
          url: 'https://faaexaminations.com/part-107-cheat-sheet',
        })}</script>
      </Helmet>

      {/* NAV */}
      <nav className="lp-nav" ref={navRef}>
        <Link to="/" className="lp-nav-logo">FAA<span>Examinations</span>.com</Link>
        <div className="lp-nav-links">
          <Link to="/part-107" className="lp-nav-link">Full Part 107 Package</Link>
          <Link to="/part-107-practice-test" className="lp-nav-link">Practice Test</Link>
          <Link to="/blog" className="lp-nav-link">Blog</Link>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" className="lp-nav-link">Login</Link>
          <Link to="/register?plan=part107" className="lp-btn-hero" style={{ padding: '8px 18px', fontSize: 14 }}>Start Free →</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ padding: '120px 40px 70px', background: 'var(--lp-dark)', borderBottom: '1px solid var(--lp-border)', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <div className="lp-hero-badge" style={{ display: 'inline-flex', marginBottom: 24 }}>PART 107 · FREE REFERENCE</div>
          <h1 style={{ fontSize: 'clamp(30px, 5vw, 54px)', lineHeight: 1.1, marginBottom: 20 }}>
            Part 107 Drone License <span className="lp-accent">Cheat Sheet</span>
          </h1>
          <p style={{ color: 'var(--lp-text2)', fontSize: 18, lineHeight: 1.7, maxWidth: 620, margin: '0 auto 32px' }}>
            Every key number, rule, and airspace requirement tested on the FAA Part 107 knowledge exam — organized for fast review. Bookmark or print before test day.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#content" className="lp-btn-hero">Jump to Cheat Sheet ↓</a>
            <Link to="/part-107-practice-test" className="lp-btn-outline">Free 30-Question Practice Test</Link>
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

          {/* OPERATIONAL LIMITS */}
          <div id="limits" className="fade-up">
            <SectionHeader number="01" title="Operational Limits (14 CFR Part 107)" />
            <Table
              heads={['Rule', 'Limit']}
              rows={[
                ['Maximum altitude', '400 ft AGL — or within 400 ft of a structure (can fly higher alongside it)'],
                ['Maximum groundspeed', '87 knots (100 mph)'],
                ['Maximum weight (including payload)', '55 lbs (24.9 kg)'],
                ['Minimum flight visibility', '3 statute miles from control station'],
                ['Minimum cloud clearance', '500 ft below clouds · 2,000 ft horizontal from clouds'],
                ['Operating hours', 'Daylight and civil twilight (30 min before sunrise to 30 min after sunset)'],
                ['Civil twilight operations', 'Anti-collision lighting required — must be visible 3 SM'],
                ['Visual Line of Sight (VLOS)', 'Remote PIC or visual observer must maintain unaided VLOS at all times'],
                ['Operations over people', 'Prohibited unless waiver or operating under Category 1–4 rules'],
                ['Operations over moving vehicles', 'Prohibited in non-controlled/restricted-access sites without waiver'],
                ['Operations from moving vehicle', 'Only allowed in sparsely populated areas'],
                ['Operations from moving aircraft', 'Prohibited'],
                ['Alcohol — bottle to throttle', '8 hours (§107.27 / §91.17)'],
                ['Maximum BAC', '0.04%'],
                ['Minimum operator age', '16 years old'],
                ['Daylight registration requirement', 'Any drone > 0.55 lbs (250g) must be registered with FAA'],
              ]}
            />
          </div>

          {/* AIRSPACE */}
          <div id="airspace" className="fade-up">
            <SectionHeader number="02" title="Airspace Authorization" />
            <Table
              heads={['Airspace Class', 'Part 107 Requirement']}
              rows={[
                ['Class A (18,000+ MSL)', 'Prohibited without waiver — essentially no UAS operations'],
                ['Class B', 'FAA authorization required — use LAANC or FAA DroneZone'],
                ['Class C', 'FAA authorization required — use LAANC or FAA DroneZone'],
                ['Class D', 'FAA authorization required — use LAANC or FAA DroneZone'],
                ['Class E (surface)', 'FAA authorization required'],
                ['Class E (non-surface)', 'No authorization needed below 400 ft AGL'],
                ['Class G', 'No authorization needed — most Part 107 ops happen here'],
              ]}
            />
            <div style={{ marginTop: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                <Card title="Special Use Airspace">
                  {[
                    ['Prohibited Areas (P-)', 'No UAS operations permitted (e.g. P-56 over Washington D.C.)'],
                    ['Restricted Areas (R-)', 'Operations require authorization from controlling agency'],
                    ['MOAs', 'Military Operations Areas — check NOTAMs, contact ATC'],
                    ['TFRs', 'Temporary Flight Restrictions — check before every flight (FAA TFR website or app)'],
                    ['National Parks', 'UAS operations prohibited by NPS policy (separate from FAA rules)'],
                    ['Stadiums', '3 NM, 3,000 ft AGL TFR 1 hour before / after major events'],
                    ['Wildfires', 'TFR automatically activated — never fly near active firefighting'],
                  ].map(([type, rule]) => (
                    <div key={type} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{type}</div>
                      <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{rule}</div>
                    </div>
                  ))}
                </Card>
                <Card title="LAANC — Low Altitude Authorization & Notification Capability">
                  <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                    LAANC provides near real-time airspace authorization for operations in controlled airspace at or below FAA-established ceiling grids.
                  </div>
                  {[
                    ['Where to get it', 'FAA-approved apps: AirMap, Aloft, Kittyhawk, SkyVector, and others'],
                    ['Authorization ceiling', 'Varies by grid — shown on UAS Facility Maps (UASFM)'],
                    ['Response time', 'Usually seconds — automated authorization'],
                    ['When LAANC isn\'t available', 'Use FAA DroneZone for manual authorization (may take days)'],
                    ['What it doesn\'t cover', 'Prohibited/Restricted areas, TFRs, or above published grid ceilings'],
                  ].map(([item, detail]) => (
                    <div key={item} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                      <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                    </div>
                  ))}
                </Card>
              </div>
            </div>
          </div>

          {/* REMOTE ID */}
          <div id="remoteid" className="fade-up">
            <SectionHeader number="03" title="Remote ID" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Remote ID Requirements">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 12 }}>
                  As of September 16, 2023, most drones operating in US airspace must broadcast Remote ID — a digital identifier transmitting location, speed, altitude, and operator location.
                </div>
                {[
                  ['Standard Remote ID', 'Built into the drone — broadcasts automatically during flight'],
                  ['Remote ID Broadcast Module', 'External device attached to drones without built-in Remote ID'],
                  ['FAA-recognized ID Area (FRIA)', 'Designated locations where drones without Remote ID can fly'],
                  ['Who is exempt', 'Drones < 0.55 lbs · FAA-approved recreational flyers flying within FRIA'],
                ].map(([type, desc]) => (
                  <div key={type} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{type}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{desc}</div>
                  </div>
                ))}
                <Note>Remote ID is required for Part 107 operations — no exemption based on weight alone</Note>
              </Card>
              <Card title="Drone Registration">
                {[
                  ['Required if weight >', '0.55 lbs (250 grams) including payload'],
                  ['Registration fee', '$5 — valid 3 years'],
                  ['Where to register', 'FAA DroneZone (faadronezone.faa.gov)'],
                  ['Registration number', 'Must be displayed on exterior of drone — legibly visible'],
                  ['Recreational vs Part 107', 'Separate registration not required — one registration covers both'],
                  ['Commercial operations', 'Must register under Part 107 (not recreational)'],
                  ['Model aircraft clubs (CBO)', 'Can register fleet under org — individual hobbyists use club registration'],
                ].map(([item, detail]) => (
                  <div key={item} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* WAIVERS */}
          <div id="waivers" className="fade-up">
            <SectionHeader number="04" title="Waivers & Operations Over People" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Waivable Operations (§107.200)">
                <div style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>The following Part 107 rules can be waived by the FAA with a submitted safety case:</div>
                {[
                  'Operations from a moving vehicle or aircraft',
                  'Operations at night (pre-2021 — now allowed with anti-collision lights)',
                  'Operations beyond visual line of sight (BVLOS)',
                  'Operations over moving vehicles in populated areas',
                  'Operations with multiple drones by one Remote PIC',
                  'Operations with a visual observer instead of direct VLOS',
                  'Operations in certain airspace classes',
                  'Yielding right-of-way (not applicable in most ops)',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--lp-blue)', flexShrink: 0, marginTop: 2 }}>→</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </Card>
              <Card title="Operations Over People — Categories">
                {[
                  ['Category 1', 'Under 0.55 lbs — no exposed rotating parts that could lacerate — no waiver needed'],
                  ['Category 2', 'No waiver needed — must meet FAA-accepted means of compliance — max transfer energy limits'],
                  ['Category 3', 'No waiver needed — additional operational restrictions (no sustained flight over open-air assemblies)'],
                  ['Category 4', 'Airworthiness certificate required — no sustained flight over open-air assemblies unless further restricted'],
                ].map(([cat, desc]) => (
                  <div key={cat} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--lp-blue)', fontSize: 13, marginBottom: 3 }}>{cat}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{desc}</div>
                  </div>
                ))}
                <Note>Apply for waivers at FAA DroneZone — processing can take weeks or months</Note>
              </Card>
            </div>
          </div>

          {/* CERTIFICATE */}
          <div id="cert" className="fade-up">
            <SectionHeader number="05" title="Remote Pilot Certificate Rules" />
            <Table
              heads={['Requirement', 'Details']}
              rows={[
                ['Minimum age', '16 years old'],
                ['Knowledge test passing score', '70% or higher (60 questions, 120 minutes)'],
                ['Test topics', 'Airspace, weather, regulations, loading, emergency procedures, crew resource management'],
                ['Recurrent training', 'Every 24 calendar months — online FAA WINGS course OR recurrent knowledge test'],
                ['Medical certificate', 'Not required — no medical standard for Part 107'],
                ['Government-issued ID', 'Required at test site and when operating commercially'],
                ['Certificate on person', 'Remote PIC must have certificate (physical or digital) during operations'],
                ['Foreign remote pilots', 'Must obtain FAA Part 107 certificate — foreign certificates not accepted'],
                ['Drug & alcohol', '8-hour bottle to throttle · BAC < 0.04% (§107.27)'],
              ]}
            />
          </div>

          {/* WEATHER */}
          <div id="weather" className="fade-up">
            <SectionHeader number="06" title="Weather for Drone Operations" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Part 107 Weather Minimums">
                {[
                  ['Minimum visibility', '3 statute miles from control station'],
                  ['Minimum cloud clearance', '500 ft below clouds · 2,000 ft horizontal'],
                  ['Wind limits', 'No regulatory limit — Remote PIC judges aircraft capability'],
                  ['Night operations', 'Allowed with anti-collision lights visible 3 SM — no waiver since 2021 rule change'],
                  ['Fog / low visibility', 'If visibility drops below 3 SM, operation must cease'],
                ].map(([item, rule]) => (
                  <div key={item} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{rule}</div>
                  </div>
                ))}
              </Card>
              <Card title="Reading METARs for UAS Ops">
                {[
                  ['Ceiling', 'BKN or OVC — heights in hundreds of feet AGL'],
                  ['Wind', 'In knots — first 3 digits = direction, next 2-3 = speed (e.g. 27015KT = 270° at 15 kt)'],
                  ['Gusts', '"G" in wind field — e.g. 15G25KT = 15 kt with gusts to 25 kt'],
                  ['Visibility', 'In statute miles — e.g. "3SM" = 3 statute miles'],
                  ['CAVOK', 'Ceiling and Visibility OK — no ceiling below 5,000 ft, visibility 6+ SM, no precip'],
                  ['RVR', 'Runway Visual Range — in feet — for when SM visibility is less than 1 SM'],
                ].map(([code, meaning]) => (
                  <div key={code} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{code}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{meaning}</div>
                  </div>
                ))}
              </Card>
              <Card title="Density Altitude & Performance">
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-blue)', background: 'rgba(48,172,226,0.08)', padding: '10px 14px', borderRadius: 8, marginBottom: 10, lineHeight: 1.8 }}>
                  DA = Pressure Altitude<br />
                  + (120 × (OAT − ISA Temp))
                </div>
                {[
                  ['High temperature', 'Reduces air density — drone works harder, shorter flight time'],
                  ['High elevation', 'Less air density — reduced lift from propellers'],
                  ['High humidity', 'Water vapor displaces air — further reduces density'],
                  ['Effect on batteries', 'High temps reduce battery performance and capacity'],
                  ['Effect on motors', 'Motors run hotter and less efficiently in thin air'],
                ].map(([factor, effect]) => (
                  <div key={factor} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{factor}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{effect}</div>
                  </div>
                ))}
              </Card>
              <Card title="Hazardous Weather to Know">
                {[
                  ['Thunderstorms', 'Never fly near — severe turbulence, lightning, hail, wind shear. Stay clear.'],
                  ['Wind shear', 'Sudden change in wind speed/direction — can cause loss of control'],
                  ['Thermal turbulence', 'Common on hot sunny days over paved surfaces — bumpy, unpredictable air'],
                  ['Mountain wave', 'Severe turbulence downwind of mountains — can extend hundreds of miles'],
                  ['Freezing precipitation', 'Ice accumulation on propellers — immediate emergency'],
                  ['Fog', 'Reduces visibility below 3 SM — must cease operations'],
                ].map(([hazard, detail]) => (
                  <div key={hazard} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{hazard}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{detail}</div>
                  </div>
                ))}
              </Card>
            </div>
          </div>

          {/* SECTIONAL CHARTS */}
          <div id="charts" className="fade-up">
            <SectionHeader number="07" title="Reading Sectional Charts for Part 107" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Airspace Boundaries on Sectional Charts">
                {[
                  ['Class B', 'Solid blue line — solid blue shading'],
                  ['Class C', 'Solid magenta line'],
                  ['Class D', 'Dashed blue line'],
                  ['Class E (surface)', 'Dashed magenta line'],
                  ['Class E (700 ft AGL)', 'Fuzzy/fading magenta shading'],
                  ['Class E (1,200 ft AGL)', 'No depiction — default in most areas'],
                  ['Class G', 'Everything not otherwise classified'],
                  ['Prohibited (P-)', 'Solid blue with "P-" and number'],
                  ['Restricted (R-)', 'Hatched blue with "R-" and number'],
                  ['MOA', 'Hatched magenta with name'],
                ].map(([symbol, meaning]) => (
                  <div key={symbol} style={{ display: 'flex', gap: 10, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--lp-blue)', minWidth: 130, flexShrink: 0 }}>{symbol}</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)' }}>{meaning}</span>
                  </div>
                ))}
              </Card>
              <Card title="Airport Information on Sectional Charts">
                {[
                  ['Blue airport symbol', 'Controlled airport (has control tower)'],
                  ['Magenta airport symbol', 'Uncontrolled airport (no tower)'],
                  ['Hard-surface runway, >8,069 ft', 'Large symbol with tick marks'],
                  ['MSA elevation', 'Shown in large bold number (e.g. "45" = 4,500 ft MSL)'],
                  ['Airport traffic pattern altitude', 'Usually 1,000 ft AGL (800 ft for helicopters)'],
                  ['Class D floor/ceiling box', 'Shown in brackets — e.g. [SFC–2500]'],
                  ['Obstacle (under 1,000 ft AGL)', 'Small symbol with MSL and AGL elevation'],
                  ['Obstacle (1,000+ ft AGL)', 'Larger symbol with bold elevations'],
                ].map(([symbol, meaning]) => (
                  <div key={symbol} style={{ padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{symbol}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{meaning}</div>
                  </div>
                ))}
                <Note>For Part 107, always check UAS Facility Maps (UASFM) — not just sectional charts — to find approved LAANC altitude ceilings</Note>
              </Card>
            </div>
          </div>

          {/* REPORTING & EMERGENCIES */}
          <div id="reporting" className="fade-up">
            <SectionHeader number="08" title="Accident Reporting & Emergencies" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <Card title="Accident Reporting (§107.9)">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  Remote PIC must report to FAA within <strong style={{ color: '#fff' }}>10 calendar days</strong> of any accident that results in:
                </div>
                {[
                  'Serious injury to any person (requires hospitalization)',
                  'Loss of consciousness to any person',
                  'Property damage (other than the UAS itself) exceeding $500 to repair or replace — whichever is lower',
                ].map((item) => (
                  <div key={item} style={{ display: 'flex', gap: 8, padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'flex-start' }}>
                    <span style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }}>!</span>
                    <span style={{ fontSize: 13, color: 'var(--lp-text2)', lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
                <Note>Report via the FAA Drone Zone portal or written notice to your local FSDO within 10 days</Note>
              </Card>
              <Card title="Emergency Deviation (§107.21)">
                <div style={{ fontSize: 14, color: 'var(--lp-text2)', lineHeight: 1.7, marginBottom: 10 }}>
                  Remote PIC may deviate from Part 107 rules <strong style={{ color: '#fff' }}>to the extent necessary</strong> to respond to an emergency that threatens life or property.
                </div>
                {[
                  ['After deviation', 'Must send written report to FAA if requested'],
                  ['Careless/reckless ops', 'Prohibited even in emergencies — §107.23'],
                  ['Right of way', 'Must always yield to manned aircraft — no exception'],
                ].map(([item, rule]) => (
                  <div key={item} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{item}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{rule}</div>
                  </div>
                ))}
              </Card>
              <Card title="Right of Way Rules (§107.37)">
                {[
                  ['Manned aircraft', 'UAS must always yield — no exceptions'],
                  ['Air traffic pattern', 'UAS must not create hazard to aircraft in pattern'],
                  ['Emergency aircraft', 'Yield immediately to any aircraft displaying emergency signals'],
                  ['Other UAS', 'No formal right-of-way rule — avoid collision via good judgment'],
                ].map(([who, rule]) => (
                  <div key={who} style={{ padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 700, color: '#fff', fontSize: 13 }}>{who}</div>
                    <div style={{ fontSize: 12, color: 'var(--lp-text2)' }}>{rule}</div>
                  </div>
                ))}
                <Note>Remote PIC is responsible for seeing and avoiding all other aircraft — manned or unmanned</Note>
              </Card>
              <Card title="Key Part 107 Reference Numbers">
                <Table
                  heads={['Item', 'Value']}
                  rows={[
                    ['Max altitude', '400 ft AGL'],
                    ['Max speed', '87 knots (100 mph)'],
                    ['Max weight', '55 lbs'],
                    ['Min visibility', '3 SM'],
                    ['Cloud clearance (below)', '500 ft'],
                    ['Cloud clearance (horizontal)', '2,000 ft'],
                    ['Accident report deadline', '10 days'],
                    ['Certificate recurrency', '24 calendar months'],
                    ['Min operator age', '16 years'],
                    ['Registration threshold', '0.55 lbs (250g)'],
                    ['Registration validity', '3 years'],
                    ['Bottle to throttle', '8 hours'],
                    ['Max BAC', '0.04%'],
                    ['Test passing score', '70%'],
                    ['Test time limit', '120 minutes'],
                    ['Number of test questions', '60'],
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
              Try 30 free Part 107 practice questions — or get the full question bank with timed simulator and AI instructor.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/part-107-practice-test" className="lp-btn-outline">Free 30-Question Test</Link>
              <Link to="/register?plan=part107" className="lp-btn-hero" style={{ fontSize: 17, padding: '14px 32px' }}>Get Full Question Bank →</Link>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--lp-text3)' }}>$37.99 one-time · Lifetime access</div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: 'var(--lp-charcoal)', borderTop: '1px solid var(--lp-border)', padding: '40px 40px 28px', textAlign: 'center' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Link to="/" className="lp-nav-logo" style={{ marginBottom: 16, display: 'inline-block' }}>FAA<span>Examinations</span>.com</Link>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', marginBottom: 20, marginTop: 8 }}>
            {[
              ['/part-107', 'Part 107 Package'],
              ['/par', 'PAR Package'],
              ['/ira', 'IRA Package'],
              ['/cax', 'CAX Package'],
              ['/part-107-practice-test', 'Part 107 Practice Test'],
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
