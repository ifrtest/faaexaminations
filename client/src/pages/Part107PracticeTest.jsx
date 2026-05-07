import PracticeTestTemplate from '../components/PracticeTestTemplate';

const QUESTIONS = [
  {
    topic: 'Part 107 Regulations',
    q: 'A Remote Pilot Certificate under Part 107 is required when operating a small UAS (under 55 lbs) for:',
    options: ['Any flight, including recreational flying', 'Commercial purposes — real estate photography, inspections, film, etc.', 'Only flights over 400 feet AGL'],
    correct: 1,
    explanation: 'Part 107 applies to small UAS (under 55 lbs) operated for commercial purposes — any operation where you receive compensation. Purely recreational flying falls under the Exception for Recreational Flyers (49 USC 44809) and follows different rules.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'The maximum altitude for Part 107 operations without a waiver is:',
    options: ['400 feet MSL', '400 feet AGL, or 400 feet above a structure if flying within 400 feet of it', '500 feet AGL'],
    correct: 1,
    explanation: 'Part 107.51: Maximum altitude is 400 feet AGL. Exception: if the drone is within 400 feet of a structure, it may fly up to 400 feet above that structure\'s highest point. This allows operations on towers, buildings, and bridges at higher altitudes.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Under Part 107, the remote pilot in command must yield right of way to:',
    options: ['Other drones only', 'All other aircraft — manned and unmanned', 'Manned aircraft only, not other drones'],
    correct: 1,
    explanation: 'Part 107.37: Small UAS must give way to ALL other aircraft. Manned aircraft always have priority in all airspace, regardless of Part 107 certification. If a manned aircraft is approaching, maneuver the drone immediately to avoid conflict.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Night UAS operations under Part 107 are:',
    options: ['Prohibited under any circumstances without a waiver', 'Permitted if the UAS is equipped with anti-collision lighting visible for 3 statute miles', 'Permitted only with ATC clearance'],
    correct: 1,
    explanation: 'Since 2021, night UAS operations are permitted under Part 107 without a waiver provided the drone is equipped with anti-collision lighting visible for at least 3 statute miles. All other Part 107 rules still apply (altitude, VLOS, airspace authorization, etc.).',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'A Part 107 remote pilot must report an accident to the FAA within _____ if the accident results in serious injury or property damage exceeding $500.',
    options: ['24 hours', '10 calendar days', '30 calendar days'],
    correct: 1,
    explanation: 'Part 107.9: Report UAS accidents to the FAA within 10 calendar days if they result in serious injury to any person, loss of consciousness, or property damage exceeding $500 (excluding damage to the UAS itself). Reporting is required regardless of fault.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'Which weather condition requires a Part 107 waiver to operate in?',
    options: ['Winds over 15 knots', 'Visibility below 3 statute miles from the control station', 'Light rain or drizzle'],
    correct: 1,
    explanation: 'Part 107.51 requires minimum 3 statute miles visibility from the control station. Operating below 3 SM visibility requires a Part 107.205 waiver. Operations in clouds or above clouds (losing VLOS) are also prohibited without a waiver.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'The remote pilot in command (RPIC) must be able to:',
    options: ['Always have a licensed visual observer present', 'Directly manipulate the controls or direct the person at the controls', 'Hold both a Part 107 and a manned aircraft certificate'],
    correct: 1,
    explanation: 'The RPIC is responsible for the flight and must be capable of directly controlling the UAS or immediately directing the person at the controls. A visual observer is optional — not required. Only a Part 107 certificate (not a manned certificate) is needed to be RPIC.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'Part 107 operations in Class G airspace require:',
    options: ['LAANC authorization or FAA DroneZone approval', 'No airspace authorization — Class G is uncontrolled', 'Notification to the nearest airport within 5 miles'],
    correct: 1,
    explanation: 'Class G airspace is uncontrolled, so no ATC authorization is required for Part 107 operations there. However, all other Part 107 rules still apply: 400 AGL altitude limit, VLOS, daylight/twilight operations, etc. Class B, C, D, and E surface areas require LAANC or DroneZone authorization.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'LAANC (Low Altitude Authorization and Notification Capability) provides:',
    options: ['Automatic approval for all airspace up to 400 feet AGL', 'Near-real-time authorization to operate in controlled airspace up to FAA-approved altitude ceilings', 'A replacement for the Remote Pilot Certificate'],
    correct: 1,
    explanation: 'LAANC gives remote pilots near-real-time authorization to fly in controlled airspace at or below FAA-approved altitude ceilings for each facility map grid. Not all controlled airspace is available via LAANC — some areas require a manual FAA DroneZone application.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Before each Part 107 flight, the remote pilot must:',
    options: ['Submit a flight plan to the FAA', 'Inspect the UAS for airworthiness and assess the operating environment', 'Obtain a weather briefing from a Flight Service Station'],
    correct: 1,
    explanation: 'Part 107.49: Pre-flight inspection requirements include checking the aircraft (airframe, propellers, battery, control links) and assessing the operating environment (weather, obstacles, people, airspace). There is no FAA flight plan requirement for Part 107 — but airspace authorization may be needed.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'Cloud clearance requirements for Part 107 operations in Class E airspace (above 1,200 AGL) are:',
    options: ['Clear of clouds — no specific distances required', '500 feet below, 1,000 feet above, and 2,000 feet horizontal from clouds', '1,000 feet below, 1,000 feet above, and 1 SM horizontal'],
    correct: 1,
    explanation: 'In Class E airspace (and B, C, D), cloud clearance is 500 feet below, 1,000 feet above, and 2,000 feet horizontal — same as for manned VFR aircraft. In Class G airspace below 1,200 AGL, only "clear of clouds" is required.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'After passing the knowledge test at a testing center, a Remote Pilot Certificate applicant initially receives:',
    options: ['A permanent certificate mailed within 3 days', 'A temporary airman certificate valid for 120 days', 'A digital certificate via the FAA\'s IACRA system'],
    correct: 1,
    explanation: 'After passing the knowledge test, the testing center issues a temporary airman certificate valid for 120 days. The permanent certificate is mailed by the FAA. The remote pilot must carry the certificate (or temporary) and have it accessible during UAS operations.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Operating a small UAS from a moving vehicle is:',
    options: ['Permitted anywhere with Part 107 certification', 'Prohibited in populated areas unless over a controlled/restricted site, or with a waiver', 'Permitted with ATC approval only'],
    correct: 1,
    explanation: 'Part 107.25: Operating from a moving vehicle or aircraft is prohibited unless over a sparsely populated area or within a controlled/restricted-access site. A waiver may authorize it in other circumstances. This prevents unsafe launch/recovery conditions from moving platforms.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'A Part 107 knowledge test (or online AKTR) must be renewed every:',
    options: ['12 months', '24 months', '36 months'],
    correct: 1,
    explanation: 'Part 107.65: A remote pilot must complete recurrent aeronautical knowledge training (AKTR online or a knowledge test at a testing center) every 24 calendar months to maintain currency. If currency lapses, a new initial knowledge test is required at a testing center.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'Operations in Class B, C, D, and surface-area Class E airspace require:',
    options: ['No authorization — VLOS is sufficient in all airspace', 'ATC authorization via LAANC or FAA DroneZone before each flight', 'A written waiver from the local FSDO'],
    correct: 1,
    explanation: 'Part 107.41: Operations in Class B, C, D, and E surface area airspace require ATC authorization before each flight. LAANC provides near-real-time approval at participating facilities. FAA DroneZone handles manual applications for airspace not covered by LAANC.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Visual line of sight (VLOS) under Part 107 means:',
    options: ['The pilot can track the drone using binoculars or a camera feed', 'The remote pilot (or visual observer) maintains unaided visual contact with the UAS at all times', 'A first-person-view (FPV) camera feed satisfies VLOS requirements'],
    correct: 1,
    explanation: 'VLOS requires unaided visual contact at all times — corrective lenses are permitted, but binoculars, camera feeds, and FPV goggles do NOT satisfy VLOS. A visual observer with unaided VLOS may assist the RPIC, but does not enable BVLOS (Beyond Visual Line of Sight) operations.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'A Temporary Flight Restriction (TFR) over a wildfire area:',
    options: ['Allows drones below 400 feet AGL to operate freely', 'Prohibits ALL drone operations in the restricted area', 'Applies only to manned aircraft, not drones'],
    correct: 1,
    explanation: 'TFRs over wildfire areas strictly prohibit ALL aircraft operations — including drones — in the restricted airspace. Drones interfere with firefighting aircraft operating at low altitudes. Violators have faced criminal charges. Always check NOTAMs and B4UFLY before flying near fire operations.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'The FAA\'s Remote ID rule requires most drones to:',
    options: ['File a flight plan before each operation', 'Broadcast the drone\'s identity and location in real time during flight', 'Register with the local airport authority'],
    correct: 1,
    explanation: 'Remote ID (required since September 2023) requires drones to broadcast identification, location, and control station location information in real time during flight. This allows the FAA, law enforcement, and others to identify drones and their operators. Standard Remote ID or an approved module is required.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'The maximum groundspeed for a small UAS under Part 107 is:',
    options: ['55 knots (63 mph)', '87 knots (100 mph)', '100 knots (115 mph)'],
    correct: 1,
    explanation: 'Part 107.51: Maximum groundspeed is 87 knots (100 mph). This applies regardless of wind conditions. The RPIC must also ensure the drone remains within visual line of sight at all operating speeds.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'A sectional chart showing a solid blue circle around an airport indicates:',
    options: ['Class D airspace', 'Class B airspace (or a portion of it)', 'Class C airspace'],
    correct: 1,
    explanation: 'Sectional chart airspace: Class B = solid blue lines (multiple shelves). Class C = solid magenta. Class D = dashed blue. Class E surface area = dashed magenta. Remote pilots must understand airspace depictions because Part 107 requires authorization in Class B, C, D, and E surface areas.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'The FAA\'s B4UFLY app helps remote pilots by:',
    options: ['Filing LAANC authorizations automatically', 'Displaying airspace restrictions, TFRs, and nearby airports for any location', 'Providing live ATC communications for drone operators'],
    correct: 1,
    explanation: 'B4UFLY is an FAA app showing nearby airspace, airports, controlled airspace boundaries, TFRs, and special use airspace for any location. It\'s a planning and awareness tool — it does not replace a full preflight briefing or substitute for obtaining LAANC authorization.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Recreational UAS flying (purely for fun, no compensation) is governed by:',
    options: ['Part 107 regulations — same as commercial', 'The Exception for Recreational Flyers rules (49 USC 44809), not Part 107', 'No FAA regulations — recreational flying is unregulated'],
    correct: 1,
    explanation: 'Purely recreational drone flying falls under 49 USC 44809 (Exception for Recreational Flyers), not Part 107. Recreational flyers must: register drones over 0.55 lbs, follow CBO (Community Based Organization) guidelines, comply with airspace authorization, and pass TRUST — but don\'t need a Part 107 certificate.',
  },
  {
    topic: 'Weather',
    q: 'For Part 107 operations, a pilot weather report (PIREP) is:',
    options: ['Not relevant to drone operations below 400 feet', 'Useful for understanding actual conditions aloft, especially wind and turbulence', 'Required before any commercial UAS flight'],
    correct: 1,
    explanation: 'While drones fly at low altitudes, PIREPs provide valuable real-world weather data — especially for wind and turbulence that may affect UAS operations. Upper-level winds can indicate gusty surface conditions. Reviewing available PIREPs is part of good preflight weather assessment.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'Even at 0 feet altitude (surface level), operations inside Class D airspace require:',
    options: ['No authorization if the drone stays below 10 feet', 'ATC authorization — Class D begins at the surface', 'Only a phone call to the tower'],
    correct: 1,
    explanation: 'Class D airspace begins at the surface. Any Part 107 operation within Class D airspace — at any altitude — requires ATC authorization via LAANC or FAA DroneZone before flight. There is no "below X feet" exemption within controlled airspace.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'A visual observer (VO) under Part 107 is used to:',
    options: ['Replace the RPIC when unavailable', 'Supplement the RPIC\'s situational awareness — the VO must also maintain unaided VLOS', 'Enable BVLOS (beyond visual line of sight) operations'],
    correct: 1,
    explanation: 'A VO assists the RPIC by maintaining visual contact with the UAS and communicating relevant information. The VO must also maintain unaided VLOS — using a VO does not enable BVLOS operations. The RPIC remains responsible for the flight at all times.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'A swollen or puffy lithium battery (LiPo) on a UAS should be:',
    options: ['Used normally if it still shows correct voltage', 'Removed from service immediately — swollen batteries are a fire/explosion hazard', 'Stored fully charged and used within 48 hours'],
    correct: 1,
    explanation: 'Swollen, damaged, or punctured LiPo batteries can undergo thermal runaway — a dangerous fire and explosion hazard. They must be removed from service immediately. Best practices: store at partial charge (3.7–3.8V/cell), inspect before each flight, never overcharge, and use a fireproof bag for storage.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Operations over moving vehicles on public roads under Part 107 are:',
    options: ['Permitted anywhere with a Part 107 certificate', 'Restricted — prohibited over moving vehicles except over controlled/restricted sites or with a waiver', 'Permitted if the vehicles are moving at less than 35 mph'],
    correct: 1,
    explanation: 'Part 107.145: Operations over moving vehicles on public roads are prohibited unless over a controlled or restricted-access site (where access is limited and non-participants are excluded) or authorized via waiver. This protects uninvolved people in and around vehicles.',
  },
  {
    topic: 'Weather',
    q: 'Surface winds of 15 knots gusting to 25 knots would most directly affect a Part 107 operation by:',
    options: ['Requiring a waiver since winds exceed 15 knots', 'Creating turbulence and stability challenges that may exceed the UAS\'s wind rating', 'Automatically triggering a SIGMET for the area'],
    correct: 1,
    explanation: 'Part 107 has no specific wind speed limit — but the remote pilot must ensure the UAS can safely operate in existing conditions. Gusts create turbulence and unpredictable handling. Each UAS has a rated maximum wind speed; operating near or beyond this rating is unsafe and the RPIC is responsible for that judgment.',
  },
  {
    topic: 'Airspace & Authorization',
    q: 'A pilot sees a yellow circle on the B4UFLY app for a location. This typically indicates:',
    options: ['The area is completely unrestricted', 'There are airspace restrictions or requirements that apply — review before flying', 'The area is a no-fly zone requiring a full waiver'],
    correct: 1,
    explanation: 'In B4UFLY, colored indicators show airspace status. Yellow typically indicates restrictions or requirements that apply (controlled airspace, TFR, etc.) — review details before flying. Green = likely no restrictions. Red = no-fly or highly restricted. Always verify with official sources before operating.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'When a remote pilot sees a manned helicopter approaching the drone\'s operating area, the correct action is to:',
    options: ['Maintain current altitude — the helicopter should fly around the drone', 'Immediately maneuver the drone to avoid the helicopter and yield right of way', 'Ascend above the helicopter\'s expected altitude'],
    correct: 1,
    explanation: 'Part 107.37: Always yield to manned aircraft. If a helicopter is approaching, maneuver the drone away immediately — descend, move horizontally, or land. Never ascend toward an approaching aircraft. The remote pilot bears full responsibility for collision avoidance with manned aircraft.',
  },
  {
    topic: 'Part 107 Regulations',
    q: 'Which statement about Part 107 operations over people is correct?',
    options: ['Drones may fly over any person at any time with Part 107 certification', 'Operations over people are restricted by category based on the drone\'s injury potential — many require FAA authorization or a declaration of compliance', 'Operations over people are completely prohibited without a waiver'],
    correct: 1,
    explanation: 'The FAA\'s operations over people rules categorize drones by injury potential (Categories 1–4). Category 1 (lightest, slowest) may fly over people without additional authorization. Category 2 and 3 require a Declaration of Compliance. Category 4 requires airworthiness certification. The specifics depend on the drone\'s FAA-accepted category.',
  },
];

const FAQS = [
  {
    q: 'How many questions are on the FAA Part 107 knowledge test?',
    a: '60 questions drawn from the FAA\'s Airman Knowledge Testing database. You need a score of 70% or higher (42 correct) to pass. The test is administered at FAA-approved testing centers (PSI/CATS locations) nationwide.',
  },
  {
    q: 'How long does it take to study for the Part 107 exam?',
    a: 'Most people with no aviation background pass in 2–3 weeks of focused study (1–2 hours per day). The test covers airspace, weather, regulations, and chart reading — topics that are new to most drone operators. Full question bank practice is the fastest path to passing.',
  },
  {
    q: 'Do I need to take a flying test to get a Part 107 certificate?',
    a: 'No. The Part 107 certification process requires only a knowledge test (written exam) at an FAA-approved testing center. There is no practical flight test. You must also be at least 16 years old and able to read, speak, and understand English.',
  },
  {
    q: 'How often do I need to renew my Part 107 certificate?',
    a: 'Every 24 calendar months. You can renew by passing a recurrent knowledge test at a testing center or by completing the FAA\'s free online Aeronautical Knowledge and Safety Test (AKST). If currency lapses, a new initial knowledge test is required.',
  },
];

export default function Part107PracticeTest() {
  return (
    <PracticeTestTemplate
      seoTitle="Part 107 Practice Test — 30 Free Questions (2026) | FAA Drone Exam"
      seoDescription="Free Part 107 practice test. 30 FAA remote pilot knowledge test questions covering airspace, regulations, weather, and drone operations. No login required. Pass your Part 107 exam."
      canonicalPath="/part-107-practice-test"
      examBadge="🚁 PART 107 · FAA REMOTE PILOT · FREE PRACTICE TEST"
      examName="Part 107 Remote Pilot"
      h1Line1="FAA Part 107"
      h1Accent="Practice Test"
      h1Line2="30 Free Questions — No Login Required"
      heroSub="The Part 107 knowledge test has 60 questions covering airspace, regulations, weather, chart reading, and drone operations. This free test spans all major topics — find your gaps before test day."
      productPath="/part-107"
      planParam="uag"
      price="$37.99"
      questionCount="265"
      questions={QUESTIONS}
      faqs={FAQS}
      relatedLinks={[
        { path: '/par-practice-test', label: 'PAR Practice Test (Free)' },
        { path: '/ira-practice-test', label: 'IRA Practice Test (Free)' },
        { path: '/cax-practice-test', label: 'CAX Practice Test (Free)' },
        { path: '/blog/part-107-study-guide-2026', label: 'Part 107 Study Guide 2026' },
        { path: '/blog/part-107-drone-test-study-guide', label: 'How to Pass Part 107 First Try' },
        { path: '/blog/part-107-vs-private-pilot-license', label: 'Part 107 vs Private Pilot License' },
        { path: '/part-107', label: 'Full Part 107 Package — 265 Questions' },
      ]}
      schemaFaqs={FAQS}
    />
  );
}
