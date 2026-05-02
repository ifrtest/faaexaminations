import PracticeTestTemplate from '../components/PracticeTestTemplate';

const QUESTIONS = [
  {
    topic: 'IFR Regulations',
    q: 'Under FAR 91.177, the minimum IFR altitude over non-mountainous terrain when on an airway is _____ above the highest obstacle within 4 NM of the course.',
    options: ['500 feet', '1,000 feet', '2,000 feet'],
    correct: 1,
    explanation: 'FAR 91.177(a)(1): In non-mountainous areas, IFR minimum altitude on an airway is 1,000 feet above the highest obstacle within 4 NM of the course centerline. In designated mountainous areas, this increases to 2,000 feet.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'An ILS approach consists of which two components?',
    options: ['Localizer and DME', 'Localizer and glide slope', 'VOR and glide slope'],
    correct: 1,
    explanation: 'An ILS (Instrument Landing System) consists of: (1) the localizer — providing lateral (left/right) guidance aligned with the runway, and (2) the glide slope — providing vertical guidance at a standard 3° angle. Together they define the precision approach path.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'A precision approach is defined as one that provides:',
    options: ['Lateral guidance only', 'Both lateral and vertical electronic guidance', 'GPS guidance only'],
    correct: 1,
    explanation: 'A precision approach provides both lateral AND vertical electronic guidance and uses a Decision Altitude (DA). Examples include ILS and RNAV (GPS) with LPV minimums. Non-precision approaches provide lateral guidance only and use a Minimum Descent Altitude (MDA).',
  },
  {
    topic: 'Instrument Approaches',
    q: 'When flying a non-precision approach, the Minimum Descent Altitude (MDA) is:',
    options: ['The altitude at which you begin final approach descent', 'The lowest altitude to which you may descend without the required visual references', 'The decision height on an ILS approach'],
    correct: 1,
    explanation: 'MDA is the lowest altitude on a non-precision approach to which you may descend without acquiring the required visual references (runway environment). If visual references are not established at or before the MDA, a missed approach must be executed.',
  },
  {
    topic: 'IFR Planning',
    q: 'The "1-2-3 rule" for filing an alternate airport states you need an alternate when destination weather is forecast to be less than _____ within 1 hour before or after your ETA.',
    options: ['1,000-foot ceiling or 1 SM visibility', '2,000-foot ceiling or 3 SM visibility', '3,000-foot ceiling or 5 SM visibility'],
    correct: 1,
    explanation: 'FAR 91.167: File an alternate if destination weather is forecast (from 1 hour before to 1 hour after ETA) to be below 2,000 feet ceiling OR 3 statute miles visibility. This is the "1-2-3 rule" — 1 hour, 2,000 ceiling, 3 SM visibility.',
  },
  {
    topic: 'IFR Planning',
    q: 'The fuel required for an IFR flight under FAR 91.167 must be enough to fly to the destination, then to the alternate, and then for at least:',
    options: ['30 minutes at normal cruise', '45 minutes at normal cruise', '60 minutes at normal cruise'],
    correct: 1,
    explanation: 'FAR 91.167(a): IFR fuel = destination + alternate + 45 minutes at normal cruising speed. This 45-minute reserve goes beyond the alternate, ensuring a safety buffer. VFR day reserve is only 30 minutes — IFR has a higher requirement.',
  },
  {
    topic: 'Holding Procedures',
    q: 'Standard holding pattern turns are made:',
    options: ['To the left at standard rate', 'To the right at standard rate', 'Either direction — pilot\'s choice'],
    correct: 1,
    explanation: 'Standard holding patterns use right turns at standard rate (3°/second). Non-standard holds use left turns and are specifically noted on charts with "LT" or "left turns." If a hold is published without a turn direction, assume right turns.',
  },
  {
    topic: 'Holding Procedures',
    q: 'The maximum holding airspeed in the IFR environment at or below 6,000 feet MSL is:',
    options: ['175 KIAS', '200 KIAS', '230 KIAS'],
    correct: 1,
    explanation: 'FAA holding airspeed limits: at or below 6,000 feet = 200 KIAS; 6,001–14,000 feet = 230 KIAS; above 14,000 feet = 265 KIAS. Exceeding these limits causes the aircraft to fly outside protected airspace boundaries.',
  },
  {
    topic: 'En Route Charts',
    q: 'On an IFR low-altitude en route chart, a MEA (Minimum Enroute Altitude) ensures:',
    options: ['IFR separation from terrain/obstacles within 4 NM and reliable VOR signal', 'GPS accuracy along the route', 'VFR conditions above the clouds'],
    correct: 0,
    explanation: 'MEA ensures: (1) obstacle clearance (1,000 ft non-mountainous, 2,000 ft mountainous, within 4 NM of centerline) and (2) reliable VOR navigation signal along the entire route. MOCA provides obstacle clearance but only guarantees VOR signal within 22 NM.',
  },
  {
    topic: 'IFR Communications',
    q: 'An ATIS broadcast is updated:',
    options: ['Every 30 minutes on the half-hour', 'Whenever a significant weather change occurs, or at least once per hour', 'Only at the top of each hour'],
    correct: 1,
    explanation: 'ATIS is updated when a significant meteorological change occurs or at least once per hour. Each update gets a new phonetic letter (Information Alpha, Bravo, etc.). Pilots must report the current ATIS code on initial ATC contact.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'On an instrument approach plate, "NA" in the alternate minimums section means:',
    options: ['This airport may not be used as an IFR alternate', 'Night Approach only', 'Non-standard alternate minimums apply'],
    correct: 0,
    explanation: '"NA" in the alternate minimums section means the airport is not authorized for use as an IFR alternate — typically because it lacks suitable weather reporting or an instrument approach. "A" (triangle with A) means non-standard alternate minimums apply.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'Localizer-only (LOC) approaches without a glide slope are classified as:',
    options: ['Precision approaches', 'Non-precision approaches', 'APV (Approach with Vertical Guidance)'],
    correct: 1,
    explanation: 'Without a glide slope, a LOC-only approach is non-precision and uses an MDA rather than a DA. The full ILS with both localizer AND glide slope is a precision approach using a DA. APV approaches (like LPV) have vertical guidance but don\'t meet precision approach standards.',
  },
  {
    topic: 'IFR Currency',
    q: 'To act as PIC under IFR, FAR 61.57(c) requires that within the preceding 6 calendar months the pilot must have accomplished:',
    options: ['3 instrument approaches and 1 hold', '6 instrument approaches, holding procedures, and intercepting/tracking courses', 'An instrument proficiency check with a CFII'],
    correct: 1,
    explanation: 'FAR 61.57(c): IFR currency requires 6 instrument approaches, holding procedures, and intercepting/tracking courses within the preceding 6 calendar months. If currency has lapsed, an Instrument Proficiency Check (IPC) with a CFII is required before acting as PIC in IMC.',
  },
  {
    topic: 'IFR Regulations',
    q: 'A clearance void time means:',
    options: ['The clearance expires and the flight must not depart after that time', 'ATC will no longer provide radar service after that time', 'The clearance expires 30 minutes after departure'],
    correct: 0,
    explanation: 'A clearance void time (given at non-radar airports) means the IFR clearance is valid only if you depart before that time. If you don\'t depart by the void time, the clearance expires and you must obtain a new one. ATC may initiate SAR if no departure occurs and you haven\'t advised.',
  },
  {
    topic: 'Weather Products',
    q: 'A SIGMET (WS) is significant for all aircraft and is issued for:',
    options: ['Light to moderate turbulence and light icing', 'Severe/extreme turbulence, severe icing, volcanic ash, or tropical cyclones', 'Low IFR conditions at major airports'],
    correct: 1,
    explanation: 'SIGMETs are issued for conditions hazardous to ALL aircraft: severe or extreme turbulence, severe icing not associated with thunderstorms, widespread dust/sand storms at 6,000+ feet, volcanic ash, and tropical cyclones. AIRMETs (G, S, Z) cover lesser hazards for lighter aircraft.',
  },
  {
    topic: 'IFR Operations',
    q: 'VFR-on-top is a clearance that allows an IFR flight to:',
    options: ['Cancel IFR and proceed entirely under VFR rules', 'Fly in VFR conditions while remaining on an IFR flight plan with ATC separation', 'Fly between cloud layers regardless of visibility'],
    correct: 1,
    explanation: 'VFR-on-top allows IFR pilots to fly in actual VFR conditions while remaining on their IFR flight plan. The pilot must comply with VFR cloud clearance/visibility minimums AND IFR altitudes. ATC still provides separation — the IFR flight plan is not cancelled.',
  },
  {
    topic: 'Weather Products',
    q: 'Pilots are expected to file PIREPs (pilot weather reports) when they encounter:',
    options: ['Only when specifically requested by ATC', 'Unexpected IMC, turbulence, icing, or other significant weather', 'Only during cruise flight, not on approaches'],
    correct: 1,
    explanation: 'Pilots are strongly encouraged (and ATC may request) PIREPs whenever significant weather is encountered — particularly unexpected IMC, moderate or severe turbulence, icing, or wind shear. PIREPs are a critical real-time weather data source for other pilots and forecasters.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'A missed approach must be initiated when visual references are not established at or before:',
    options: ['The final approach fix (FAF)', 'The Decision Altitude (DA) or Minimum Descent Altitude (MDA)', '200 feet above the runway threshold'],
    correct: 1,
    explanation: 'On precision approaches, execute the missed approach at or before reaching the DA if required visual references aren\'t established. On non-precision approaches, execute missed approach if visual references aren\'t established at or before the MDA — you may not descend below it.',
  },
  {
    topic: 'En Route Charts',
    q: 'A changeover point (COP) on an IFR en route chart indicates:',
    options: ['Where you switch from one ATC center to the next', 'The point where you switch VOR navigation from one station to the next along an airway', 'Where the MEA changes on an airway'],
    correct: 1,
    explanation: 'A changeover point (COP) marks the recommended point to switch navigation reference from one VOR to the next along an airway. It\'s typically at the midpoint between stations but may be offset when signal reception or station geometry requires it.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'When ATC issues "cleared for the approach," this authorizes you to:',
    options: ['Fly any approach to any runway', 'Fly the published instrument approach to the specified runway', 'Execute a visual approach immediately'],
    correct: 1,
    explanation: '"Cleared for the approach" authorizes you to fly the published instrument approach procedure to the runway ATC specified. You select and fly the specific approach type (ILS, RNAV, VOR, etc.). It does not authorize a visual approach or deviating from published procedures.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'On a non-precision approach, the FAF (Final Approach Fix) marks:',
    options: ['The point where the glide slope intercepts the approach path', 'The point where final descent to MDA begins', 'The missed approach point'],
    correct: 1,
    explanation: 'The FAF marks the beginning of the final approach segment on non-precision approaches — where you initiate descent to MDA. On ILS approaches, glide slope intercept serves this function. The missed approach point (MAP) is at the runway threshold or a specific fix/distance.',
  },
  {
    topic: 'IFR Regulations',
    q: 'All operations in Class A airspace (18,000 feet MSL to FL600) must be conducted:',
    options: ['Under IFR only', 'Under VFR with a transponder', 'Under SVFR with ATC clearance'],
    correct: 0,
    explanation: 'All operations in Class A airspace must be conducted under IFR. VFR is not permitted at any time. Pilots must have an instrument rating, be on an IFR flight plan, and comply with all IFR procedures.',
  },
  {
    topic: 'Instrument Approaches',
    q: 'During an ILS approach, the localizer needle is deflected to the right. The aircraft should:',
    options: ['Turn left to return to centerline', 'Turn right toward the needle to intercept the localizer', 'Maintain heading — the needle will self-correct'],
    correct: 1,
    explanation: 'A localizer needle deflected to the right means the runway centerline is to the right of the aircraft. Turn right to intercept. Remember: fly toward the needle. This is the same principle as a VOR CDI — the needle points toward the course.',
  },
  {
    topic: 'Weather Products',
    q: 'A weather radar return showing a "hook echo" pattern most likely indicates:',
    options: ['Light rain and low turbulence', 'A possible tornado or supercell thunderstorm', 'Normal convective activity at cruise altitude'],
    correct: 1,
    explanation: 'A hook echo on weather radar is a classic radar signature of a supercell thunderstorm, often associated with tornado activity. Pilots should avoid any thunderstorm by at least 20 NM — hook echoes and bow echoes indicate the most intense and dangerous cells.',
  },
  {
    topic: 'IFR Operations',
    q: 'The "decision altitude" (DA) on a precision approach is:',
    options: ['The altitude at which the pilot decides whether to divert to the alternate', 'The altitude at which a missed approach must be initiated if visual references are not acquired', 'The minimum altitude for the intermediate approach segment'],
    correct: 1,
    explanation: 'DA (formerly called Decision Height/DH) is the altitude on a precision approach at which the pilot must either have the required visual references to continue OR execute a missed approach. DA is expressed in MSL; DH was in AGL. At DA, no further descent is authorized without visual references.',
  },
  {
    topic: 'IFR Regulations',
    q: 'Standard alternate airport minimums for an airport with a precision approach are:',
    options: ['400-foot ceiling and 1 SM visibility', '600-foot ceiling and 2 SM visibility', '1,000-foot ceiling and 3 SM visibility'],
    correct: 1,
    explanation: 'Standard alternate minimums: airport with a precision approach = 600-foot ceiling and 2 SM visibility; airport with only non-precision approaches = 800-foot ceiling and 2 SM. Non-standard alternates are marked with an "A" symbol on approach plates.',
  },
  {
    topic: 'IFR Operations',
    q: 'During a radar vector for an instrument approach, terrain/obstacle clearance is the responsibility of:',
    options: ['ATC — they issue the vectors', 'The pilot in command — always', 'Shared equally between ATC and the pilot'],
    correct: 1,
    explanation: 'Even when accepting radar vectors, the PIC is always responsible for terrain and obstacle clearance. If a vector appears to conflict with terrain or an obstacle, the pilot must advise ATC and request a different vector or altitude. ATC provides separation, not guaranteed terrain clearance.',
  },
  {
    topic: 'IFR Planning',
    q: 'An IFR alternate airport requirement is waived if the destination has a standard instrument approach AND weather is forecast to be at or above what minimums?',
    options: ['VFR minimums (3 SM and 1,000 feet)', 'Ceiling at least 2,000 feet and visibility at least 3 SM from 1 hour before to 1 hour after ETA', 'Ceiling at least 3,000 feet and visibility at least 5 SM'],
    correct: 1,
    explanation: 'No alternate is required (using the 1-2-3 rule) if the destination is forecast to have at least a 2,000-foot ceiling AND 3 SM visibility from 1 hour before to 1 hour after the ETA. If either condition is forecast to be below those values, an alternate must be filed.',
  },
  {
    topic: 'Weather Products',
    q: 'A prog chart (Prognostic Chart) is used for:',
    options: ['Reporting current surface conditions', 'Forecasting future weather patterns and frontal positions', 'Showing actual radar returns along a route'],
    correct: 1,
    explanation: 'Prognostic charts (prog charts) show forecast weather conditions — frontal positions, pressure systems, and precipitation areas — at a specified future time (12, 24, 36, or 48 hours). They are essential preflight planning tools for cross-country IFR flights.',
  },
  {
    topic: 'IFR Operations',
    q: 'If you accept an IFR clearance and then cannot comply with part of it, you should:',
    options: ['Continue as filed and inform ATC after landing', 'Advise ATC immediately and request an amended clearance', 'Deviate from the clearance and file a NASA ASRS report'],
    correct: 1,
    explanation: 'FAR 91.123: If unable to comply with an ATC clearance, advise ATC immediately. Request an amended clearance. The PIC is the final authority for safety, but must communicate any inability to comply as soon as possible so ATC can provide an alternative.',
  },
];

const FAQS = [
  {
    q: 'How many questions are on the FAA Instrument Rating written exam?',
    a: '60 questions drawn from the FAA\'s Airman Knowledge Testing database. You need a score of 70% or higher to pass. The IRA is widely considered harder than the PAR — it covers IFR procedures, weather, approach charts, and more advanced topics.',
  },
  {
    q: 'What topics does the IRA knowledge test cover?',
    a: 'The IRA covers: IFR regulations, instrument procedures, en route navigation, instrument approaches (ILS, VOR, RNAV), holding patterns, weather interpretation, IFR planning (alternates, fuel), and IFR communications. Weather and approaches typically make up the largest portion.',
  },
  {
    q: 'How long does it take to study for the IRA knowledge test?',
    a: 'Most students with a private pilot background spend 3–6 weeks studying for the IRA. The instrument world introduces a lot of new concepts (approach plates, en route charts, holds) that take time to internalize. Daily practice with the full question bank is the fastest path.',
  },
  {
    q: 'Do I need an instrument rating to take the knowledge test?',
    a: 'No — you can take the knowledge test before completing all flight training. Many students take it early in their instrument training. You need a logbook endorsement from an authorized instructor certifying you are prepared for the test.',
  },
];

export default function IRAPracticeTest() {
  return (
    <PracticeTestTemplate
      seoTitle="FAA Instrument Rating Practice Test (IRA) — 30 Free Questions (2026)"
      seoDescription="Free FAA Instrument Rating practice test. 30 IRA knowledge test questions covering IFR procedures, approaches, weather, holds, and regulations. No login required."
      canonicalPath="/ira-practice-test"
      examBadge="✈ INSTRUMENT RATING · IRA KNOWLEDGE TEST · FREE PRACTICE"
      examName="Instrument Rating (IRA)"
      h1Line1="FAA Instrument Rating"
      h1Accent="Practice Test"
      h1Line2="30 Free Questions — No Login Required"
      heroSub="The IRA knowledge test covers IFR procedures, instrument approaches, weather products, holds, and regulations. This free test spans all major topics — find your gaps before you sit for the real exam."
      productPath="/ira"
      planParam="ira"
      price="$24.99"
      questionCount="722"
      questions={QUESTIONS}
      faqs={FAQS}
      relatedLinks={[
        { path: '/par-practice-test', label: 'PAR Practice Test (Free)' },
        { path: '/cax-practice-test', label: 'CAX Practice Test (Free)' },
        { path: '/part-107-practice-test', label: 'Part 107 Practice Test (Free)' },
        { path: '/blog/faa-instrument-rating-written-test-study-tips-2026', label: 'IRA Written Test Study Tips' },
        { path: '/blog/instrument-rating-knowledge-test-tips', label: 'What Makes the IRA Hard' },
        { path: '/ira', label: 'Full IRA Package — 722 Questions' },
      ]}
      schemaFaqs={FAQS}
    />
  );
}
