import PracticeTestTemplate from '../components/PracticeTestTemplate';

const QUESTIONS = [
  {
    topic: 'Federal Aviation Regulations',
    q: 'Under FAR 61.3, when acting as pilot in command you must have which documents readily available?',
    options: ['Pilot certificate and logbook', 'Pilot certificate, current medical certificate, and government-issued photo ID', 'Pilot certificate and current medical certificate only'],
    correct: 1,
    explanation: 'FAR 61.3 requires you to have your pilot certificate, a valid medical certificate (or BasicMed documentation), and a government-issued photo ID on your person when acting as PIC of an aircraft.',
  },
  {
    topic: 'Federal Aviation Regulations',
    q: 'Under FAR 61.57, to act as PIC carrying passengers a pilot must have made how many takeoffs and landings in the preceding 90 days in the same category and class?',
    options: ['1', '3', '5'],
    correct: 1,
    explanation: 'FAR 61.57(a) requires 3 takeoffs and 3 landings (to a full stop for tailwheel aircraft) within the preceding 90 days in the same category and class of aircraft.',
  },
  {
    topic: 'Federal Aviation Regulations',
    q: 'Under FAR 91.17, a pilot may not act as PIC within _____ hours after consuming alcohol, or with a blood alcohol content of _____ or more.',
    options: ['4 hours / 0.04%', '8 hours / 0.04%', '12 hours / 0.08%'],
    correct: 1,
    explanation: 'FAR 91.17: "8 hours from bottle to throttle" — no alcohol within 8 hours of flying. Blood or breath alcohol must be below 0.04%. Being under the influence regardless of time or BAC is always prohibited.',
  },
  {
    topic: 'Airworthiness Requirements',
    q: 'Under FAR 91.409, an aircraft used for private operations must have an annual inspection completed within the preceding:',
    options: ['6 calendar months', '12 calendar months', '24 calendar months'],
    correct: 1,
    explanation: 'FAR 91.409(a) requires an annual inspection within the preceding 12 calendar months for aircraft not operating under an approved inspection program.',
  },
  {
    topic: 'Airworthiness Requirements',
    q: 'Which statement about required VFR day equipment under FAR 91.205 is correct?',
    options: ['Only a magnetic compass and altimeter are required', 'Airspeed indicator, altimeter, magnetic compass, and tachometer are among the required instruments', 'A transponder and ADS-B Out are required for all VFR day flights'],
    correct: 1,
    explanation: 'FAR 91.205(b) lists VFR day equipment using the ATOMATOFLAMES acronym: Airspeed indicator, Tachometer, Oil pressure gauge, Manifold pressure gauge (if applicable), Altimeter, Temperature gauge (liquid-cooled engines), Oil temperature, Fuel gauge, Landing gear indicator (if retractable), Anticollision lights (aircraft certified after 3/11/96), Magnetic direction indicator, ELT, Safety belts.',
  },
  {
    topic: 'Weather',
    q: 'A METAR reporting "BKN014" means the ceiling is:',
    options: ['Broken clouds at 14,000 feet MSL', 'Broken clouds at 1,400 feet AGL', 'Below VFR minimums'],
    correct: 1,
    explanation: 'METAR cloud heights are reported in hundreds of feet AGL. BKN = broken (5/8–7/8 sky coverage). 014 = 1,400 feet above ground level. MSL is never used for METAR cloud heights.',
  },
  {
    topic: 'Weather',
    q: 'Radiation fog is most likely to form when conditions include:',
    options: ['Strong winds, moist air, and overcast skies', 'Calm winds, moist air near the surface, and clear skies overnight', 'Strong surface heating and dry air'],
    correct: 1,
    explanation: 'Radiation fog forms when: (1) the surface cools radiatively under clear skies, (2) moist air near the surface cools to its dew point, and (3) winds are calm enough to keep the cooled layer near the surface. It typically burns off after sunrise.',
  },
  {
    topic: 'Weather',
    q: 'The mature stage of a thunderstorm is characterized by:',
    options: ['Only updrafts — the storm is still building', 'Both updrafts and downdrafts occurring simultaneously', 'Only downdrafts — the storm is dissipating'],
    correct: 1,
    explanation: 'Thunderstorm life cycle: cumulus stage (updraft only) → mature stage (both updraft and downdraft simultaneously — most intense and dangerous) → dissipating stage (downdraft dominant). Heavy rain, hail, lightning, and severe turbulence are most likely during the mature stage.',
  },
  {
    topic: 'Weather',
    q: 'Structural icing is most likely to accumulate on a non-deiced aircraft when flying:',
    options: ['Above 18,000 feet MSL where temperatures are always below freezing', 'In visible moisture at temperatures between 0°C and −20°C', 'In any cloud layer regardless of temperature'],
    correct: 1,
    explanation: 'Structural icing requires two conditions: (1) visible moisture (clouds, freezing rain, drizzle) AND (2) temperatures at or below 0°C. The greatest risk is between 0°C and −20°C where supercooled water droplets are most prevalent.',
  },
  {
    topic: 'Weather',
    q: 'A Terminal Aerodrome Forecast (TAF) differs from a METAR in that a TAF:',
    options: ['Reports current observed conditions at an airport', 'Provides forecast conditions for a specific airport typically within a 5-mile radius', 'Covers a broad geographic area for en-route planning'],
    correct: 1,
    explanation: 'A TAF forecasts conditions at a specific airport for a 24- or 30-hour period within approximately 5 statute miles. A METAR reports current observed conditions. An Area Forecast (FA) covers a broad geographic region for en-route planning.',
  },
  {
    topic: 'National Airspace System',
    q: 'On a sectional chart, Class D airspace is depicted as:',
    options: ['Solid blue lines', 'Dashed blue lines', 'Solid magenta lines'],
    correct: 1,
    explanation: 'Class D airspace (surface to approximately 2,500 AGL around towered airports) is depicted as dashed blue lines. Class B = solid blue. Class C = solid magenta. Class E surface extensions = dashed magenta.',
  },
  {
    topic: 'National Airspace System',
    q: 'Entry into Class B airspace requires:',
    options: ['Two-way radio communication with ATC', 'An explicit ATC clearance', 'A Mode C transponder only'],
    correct: 1,
    explanation: 'Class B airspace requires an explicit ATC clearance — ATC must specifically say words like "Cleared into the Class Bravo." This is stricter than Class C, which only requires establishing radio contact. Without a clearance, entry is a violation.',
  },
  {
    topic: 'National Airspace System',
    q: 'Class E airspace typically begins at _____ in most areas of the contiguous US.',
    options: ['700 feet AGL', '1,200 feet AGL', '18,000 feet MSL'],
    correct: 1,
    explanation: 'In most areas of the US, Class E airspace begins at 1,200 feet AGL. In some transition areas near airports it begins at 700 AGL (fuzzy side of magenta shading on sectional). Class A begins at 18,000 feet MSL.',
  },
  {
    topic: 'Charts & Navigation',
    q: 'On a sectional chart, a dashed magenta circle around a non-towered airport indicates:',
    options: ['Class D airspace', 'Class E airspace that begins at the surface', 'Class C airspace'],
    correct: 1,
    explanation: 'A dashed magenta circle (or extension) indicates Class E airspace beginning at the surface. This is common at airports with instrument approaches but no control tower, providing IFR separation all the way to the ground.',
  },
  {
    topic: 'Charts & Navigation',
    q: 'Isogonic lines on a sectional chart connect points of equal:',
    options: ['Elevation', 'Magnetic variation', 'Atmospheric pressure'],
    correct: 1,
    explanation: 'Isogonic lines connect points of equal magnetic variation (the angular difference between true north and magnetic north). The agonic line has zero variation. East of the agonic line, variation is west; west of it, variation is east.',
  },
  {
    topic: 'Charts & Navigation',
    q: 'Dead reckoning navigation relies on:',
    options: ['Visual identification of landmarks below', 'Known speed, heading, and elapsed time to estimate position', 'VOR station tracking only'],
    correct: 1,
    explanation: 'Dead reckoning uses a known starting position plus aircraft heading, airspeed, and elapsed time to calculate current position. Pilotage, by contrast, uses visual reference to landmarks on the ground. Both techniques are tested on the PAR.',
  },
  {
    topic: 'Federal Aviation Regulations',
    q: 'VFR cruising altitude requirements (odd or even thousands plus 500 feet) apply when flying more than _____ above the surface.',
    options: ['500 feet', '1,000 feet', '3,000 feet'],
    correct: 2,
    explanation: 'FAR 91.159: VFR cruising altitudes apply when flying more than 3,000 feet above the surface on a magnetic course. 0°–179° = odd thousands + 500 ft. 180°–359° = even thousands + 500 ft.',
  },
  {
    topic: 'Federal Aviation Regulations',
    q: 'Under FAR 91.113, when two aircraft are on final approach to land, which has the right of way?',
    options: ['The aircraft at the higher altitude', 'The aircraft at the lower altitude', 'The aircraft that arrived in the pattern first'],
    correct: 1,
    explanation: 'FAR 91.113(g): When two or more aircraft are approaching to land, the aircraft at the lower altitude has the right of way — but may not take advantage of this to cut in front of or overtake another aircraft on approach.',
  },
  {
    topic: 'Navigation Systems',
    q: 'When flying TOWARD a VOR station with the CDI needle centered and a TO flag showing, you are:',
    options: ['Flying away from the station on the selected radial', 'On the selected radial tracking toward the station', 'Abeam the station'],
    correct: 1,
    explanation: 'A centered CDI needle with a TO flag means you are on the selected OBS course and tracking toward the station. As you fly overhead the station, the flag will flip from TO to FROM.',
  },
  {
    topic: 'Navigation Systems',
    q: 'ADS-B Out equipment is required to operate in which airspace?',
    options: ['Class B and C airspace and within 30 NM of Class B airports', 'All airspace above 500 feet AGL', 'Class D airspace only'],
    correct: 0,
    explanation: 'FAR 91.225: ADS-B Out is required in Class B and C airspace, within 30 NM of Class B primary airports (Mode C veil), Class E airspace at or above 10,000 MSL (except below 2,500 AGL), and above the ceiling/within lateral limits of Class B or C.',
  },
  {
    topic: 'Aerodynamics',
    q: 'An aircraft will stall when:',
    options: ['Airspeed drops below a certain value', 'The critical angle of attack is exceeded', 'Bank angle exceeds 45 degrees'],
    correct: 1,
    explanation: 'A stall occurs when the wing\'s angle of attack exceeds the critical angle (typically 15–18°). This can happen at ANY airspeed or flight attitude. At higher weights or bank angles stall speed increases, but the critical AoA remains the same.',
  },
  {
    topic: 'Aerodynamics',
    q: 'In a 60° banked level turn, the load factor is approximately:',
    options: ['1.4 G', '2.0 G', '3.0 G'],
    correct: 1,
    explanation: 'Load factor in a level turn = 1 / cos(bank angle). At 60°: 1 / cos(60°) = 1 / 0.5 = 2.0 G. Stall speed increases with the square root of the load factor, so in a 60° bank stall speed increases approximately 41%.',
  },
  {
    topic: 'Aerodynamics',
    q: 'Left-turning tendency caused by the propeller\'s descending blade producing more thrust at high angles of attack is called:',
    options: ['Torque reaction', 'P-factor (asymmetric propeller loading)', 'Gyroscopic precession'],
    correct: 1,
    explanation: 'P-factor occurs at high angles of attack (takeoff, climb). The descending propeller blade on the right side has a greater effective pitch angle and generates more thrust, causing a left-yawing tendency. Right rudder corrects for it during climbs.',
  },
  {
    topic: 'Airport Operations',
    q: 'Standard traffic pattern altitude at most non-towered airports is:',
    options: ['500 feet AGL', '1,000 feet AGL', '1,500 feet AGL'],
    correct: 1,
    explanation: 'Standard traffic pattern altitude is 1,000 feet AGL. Some airports publish non-standard patterns (check the Chart Supplement or airport diagram). At towered airports, ATC provides pattern altitude instructions.',
  },
  {
    topic: 'Airport Operations',
    q: 'A PAPI showing all four lights red indicates the aircraft is:',
    options: ['On the correct glidepath', 'Above the glidepath', 'Below the glidepath'],
    correct: 2,
    explanation: 'PAPI: 4 white = well above. 3W/1R = slightly high. 2W/2R = on glidepath. 1W/3R = slightly low. 4 red = well below glidepath. A helpful memory aid: "White, you\'re high — red, you\'re dead."',
  },
  {
    topic: 'Federal Aviation Regulations',
    q: 'Under FAR 91.155, the minimum flight visibility for VFR flight in Class G airspace below 1,200 feet AGL during the day is:',
    options: ['1 statute mile', '3 statute miles', '5 statute miles'],
    correct: 0,
    explanation: 'FAR 91.155: In Class G airspace below 1,200 feet AGL during the day, only 1 statute mile visibility and "clear of clouds" is required. At night in Class G below 1,200 AGL, the requirement increases to 3 statute miles.',
  },
  {
    topic: 'Emergency Procedures',
    q: 'Immediately following an engine failure in flight, the pilot\'s first action should be to:',
    options: ['Transmit a MAYDAY on 121.5 MHz', 'Establish best glide speed (Vglide)', 'Turn toward the nearest airport'],
    correct: 1,
    explanation: 'After engine failure: (1) Immediately establish best glide speed to maximize range and time aloft. (2) Troubleshoot/attempt restart while gliding. (3) Select a landing area. (4) Communicate (MAYDAY). Losing airspeed control wastes precious altitude.',
  },
  {
    topic: 'Aeromedical Factors',
    q: 'At night, a pilot should look slightly to the side of an object rather than directly at it because:',
    options: ['Night vision goggles focus better at angles', 'The rods of the eye — used for low-light vision — are concentrated in the peripheral retina, not the center', 'Central vision is impaired by cockpit instrument lighting'],
    correct: 1,
    explanation: 'The fovea (center of vision) is dense with cones that need bright light to function. Rods — responsible for low-light vision — are concentrated in the periphery. Off-center viewing (averted vision) places the target on the rod-rich area, making dim objects much easier to detect.',
  },
  {
    topic: 'Aircraft Performance',
    q: 'Exceeding the aircraft\'s maximum gross weight will:',
    options: ['Only affect fuel consumption', 'Increase stall speed and reduce climb performance', 'Have no effect in smooth air'],
    correct: 1,
    explanation: 'Overloading raises wing loading, which increases stall speed, reduces climb rate, degrades maneuverability, and increases structural stress on every component. Operating above max gross weight is illegal under FAR 91.9 and dangerous at all phases of flight.',
  },
  {
    topic: 'Aircraft Performance',
    q: 'At higher density altitude, aircraft performance:',
    options: ['Improves because the air is thinner and creates less drag', 'Decreases because less air mass is available to produce lift and engine power', 'Is unaffected if the engine is fuel-injected'],
    correct: 1,
    explanation: 'Higher density altitude (caused by high elevation, high temperature, or high humidity) reduces air density. This decreases engine power output, propeller efficiency, and lift generation — all of which degrade takeoff distance, climb rate, and cruise performance.',
  },
];

const FAQS = [
  {
    q: 'How many questions are on the real FAA Private Pilot written exam?',
    a: '65 questions drawn from the FAA\'s published Airman Knowledge Testing database (60 scored + 5 unscored validation questions), with a 2-hour time limit. You need a score of 70% or higher to pass.',
  },
  {
    q: 'Do I need an instructor endorsement before taking the PAR?',
    a: 'Yes. A certificated flight instructor (CFI) must endorse your logbook or provide a sign-off before you can sit for the official exam. FAAExaminations.com prepares you for the knowledge test itself — your flight instructor handles the endorsement.',
  },
  {
    q: 'How long should I study for the Private Pilot written exam?',
    a: 'Most students pass in 2–4 weeks of focused study (1–2 hours per day). The key is practicing with the full question bank — the real exam draws from 1,469 questions, so exposure to the full bank dramatically improves your score.',
  },
  {
    q: 'Are these the actual FAA questions?',
    a: 'This free test uses representative questions based on the FAA\'s Airman Knowledge Testing database. The full 1,469-question bank on FAAExaminations.com is built directly from the official FAA source — the same questions the real exam draws from.',
  },
];

export default function PARPracticeTest() {
  return (
    <PracticeTestTemplate
      seoTitle="FAA Private Pilot Practice Test (PAR) — 30 Free Questions (2026)"
      seoDescription="Take our free FAA Private Pilot practice test. 30 questions covering all 11 PAR knowledge test topics — regulations, weather, airspace, navigation, and aerodynamics. No login required."
      canonicalPath="/par-practice-test"
      examBadge="✈ PRIVATE PILOT · PAR KNOWLEDGE TEST · FREE PRACTICE"
      examName="Private Pilot (PAR)"
      h1Line1="FAA Private Pilot"
      h1Accent="Practice Test"
      h1Line2="30 Free Questions — No Login Required"
      heroSub="The real PAR exam has 65 questions drawn from a bank of 1,469, with a 2-hour time limit. This free test covers all 11 official topics — regulations, weather, airspace, navigation, aerodynamics, and more. Find your weak areas before test day."
      productPath="/par"
      planParam="par"
      price="$24.99"
      questionCount="1,469"
      questions={QUESTIONS}
      faqs={FAQS}
      relatedLinks={[
        { path: '/ira-practice-test', label: 'IRA Practice Test (Free)' },
        { path: '/cax-practice-test', label: 'CAX Practice Test (Free)' },
        { path: '/part-107-practice-test', label: 'Part 107 Practice Test (Free)' },
        { path: '/blog/how-to-pass-faa-private-pilot-written-exam-first-try', label: 'How to Pass the PAR First Try' },
        { path: '/blog/faa-written-exam-study-guide', label: 'FAA Written Exam Study Guide' },
        { path: '/par', label: 'Full PAR Package — 1,469 Questions' },
      ]}
      schemaFaqs={FAQS}
    />
  );
}
