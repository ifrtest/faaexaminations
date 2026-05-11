import PracticeTestTemplate from '../components/PracticeTestTemplate';

const QUESTIONS = [
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A commercial pilot certificate allows the holder to:',
    options: ['Fly any operation for compensation with no restrictions', 'Act as PIC for compensation or hire — though some operations (e.g., Part 121) require an ATP', 'Fly commercially only in single-engine aircraft'],
    correct: 1,
    explanation: 'A commercial certificate authorizes flying for compensation or hire, but many operations require additional certification. Scheduled airline operations (Part 121) require an ATP. Part 135 air taxi operations have additional requirements. The commercial certificate opens the door — it doesn\'t open all doors.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'The minimum total flight time required for a commercial pilot certificate (airplane) is:',
    options: ['150 hours', '250 hours', '500 hours'],
    correct: 1,
    explanation: 'FAR 61.129(a): 250 total flight hours are required, including 100 hours in powered aircraft, 100 hours PIC time (50 in airplanes), 50 hours cross-country, and 10 hours in a complex or turbine-powered airplane.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A complex airplane is defined as one that has:',
    options: ['A retractable landing gear only', 'Retractable landing gear, flaps, AND a controllable-pitch propeller', 'A turbocharged engine and retractable gear'],
    correct: 1,
    explanation: 'FAR 61.1: A complex airplane must have all three: retractable landing gear, flaps, and a controllable-pitch propeller. A high-performance airplane (200+ HP) is a separate designation requiring its own endorsement. Both are required for the commercial certificate.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A "high-performance airplane" under FAR Part 61 is defined as one with an engine of more than:',
    options: ['150 horsepower', '200 horsepower', '300 horsepower'],
    correct: 1,
    explanation: 'FAR 61.31(f): A high-performance airplane has an engine of more than 200 horsepower. Before acting as PIC, a pilot must receive ground and flight training and a logbook endorsement. This is separate from — and in addition to — the complex airplane endorsement.',
  },
  {
    topic: 'Aerodynamics',
    q: 'An accelerated stall can occur:',
    options: ['Only at speeds below Vs (stall speed)', 'At any airspeed when the critical angle of attack is exceeded', 'Only in steep banked turns exceeding 60°'],
    correct: 1,
    explanation: 'An accelerated stall occurs when abrupt pitch input raises the angle of attack past the critical AoA at a speed above normal stall speed. They can happen in pull-ups, steep turns, or any abrupt pitch change and are often more violent and abrupt than power-off stalls.',
  },
  {
    topic: 'Multi-Engine Operations',
    q: 'VMC (minimum control airspeed with critical engine inoperative) decreases as:',
    options: ['Altitude increases', 'Aircraft weight increases', 'Bank angle toward the inoperative engine increases'],
    correct: 0,
    explanation: 'VMC decreases with increasing altitude because the operating engine produces less power at altitude, reducing the yawing moment that rudder must overcome. As altitude increases and power decreases, VMC decreases. This is why VMC is defined at sea level — it\'s the worst case.',
  },
  {
    topic: 'Aircraft Performance',
    q: 'The service ceiling of an aircraft is the altitude at which the maximum rate of climb equals:',
    options: ['500 FPM', '100 FPM', '0 FPM'],
    correct: 1,
    explanation: 'Service ceiling = altitude where maximum rate of climb equals 100 FPM. Absolute ceiling = where max ROC reaches 0 FPM. Single-engine service ceiling on a twin = altitude where max ROC on one engine equals 50 FPM. Most performance planning uses service ceiling.',
  },
  {
    topic: 'Aircraft Performance',
    q: 'Dynamic hydroplaning speed (knots) is approximately equal to:',
    options: ['7 × square root of tire pressure in PSI', '9 × square root of tire pressure in PSI', '11 × square root of tire pressure in PSI'],
    correct: 1,
    explanation: 'Dynamic hydroplaning speed ≈ 9 × √(tire pressure in PSI). For a tire inflated to 36 PSI: 9 × √36 = 9 × 6 = 54 knots. At or above this speed, a water wedge can lift the tire completely off the runway surface, eliminating braking and directional control.',
  },
  {
    topic: 'Weight & Balance',
    q: 'In weight and balance calculations, moment is defined as:',
    options: ['Weight × arm', 'Weight / arm', 'Arm / weight'],
    correct: 0,
    explanation: 'Moment = Weight × Arm. The arm is the horizontal distance (in inches) from the datum to the weight. Total moments divided by total weight gives the CG location. The CG must fall within the approved CG envelope — both fore and aft limits.',
  },
  {
    topic: 'Weight & Balance',
    q: 'If an aircraft\'s CG is too far aft, the primary danger is:',
    options: ['Nose-heavy control forces making flare difficult', 'Reduced longitudinal stability and potentially unrecoverable stall/spin', 'Excessive speed in a dive'],
    correct: 1,
    explanation: 'Aft CG reduces longitudinal stability (aircraft wants to pitch up), makes stall recovery more difficult or impossible, and can lead to flat spins that are unrecoverable. Forward CG makes aircraft more stable but harder to flare. Aft CG limit is the more safety-critical boundary.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A second-class medical certificate is valid for commercial pilot privileges for:',
    options: ['6 months', '12 months', '24 months'],
    correct: 1,
    explanation: 'A second-class medical certificate is valid for commercial pilot privileges for 12 calendar months. After 12 months it reverts to third-class privileges. After 24 months from issuance, a new medical is required for any FAA medical-required privilege.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'Before acting as PIC of a pressurized aircraft with a service ceiling above 25,000 feet MSL, a pilot must:',
    options: ['Hold an ATP certificate', 'Have received specific high-altitude training and a logbook endorsement', 'Have at least 500 hours total time'],
    correct: 1,
    explanation: 'FAR 61.31(g): A pilot must receive high-altitude aeronautical training and a logbook endorsement before acting as PIC of a pressurized aircraft capable of operating above FL250. Training covers physiological hazards of hypoxia, pressurization systems, and oxygen equipment.',
  },
  {
    topic: 'Physiological Factors',
    q: 'Time of useful consciousness (TUC) at 40,000 feet MSL without supplemental oxygen is approximately:',
    options: ['5 minutes', '60 seconds', '15–20 seconds'],
    correct: 2,
    explanation: 'TUC decreases sharply with altitude: at 40,000 ft ≈ 15–20 seconds; at 35,000 ft ≈ 30–60 seconds; at 25,000 ft ≈ 3–5 minutes. Hypoxia is insidious — performance degrades significantly before the pilot notices any symptoms. Supplemental oxygen is critical.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'Under FAR 91.211, flight crew must use supplemental oxygen continuously when flying above:',
    options: ['10,000 feet MSL', '12,500 feet MSL', '14,000 feet MSL'],
    correct: 2,
    explanation: 'FAR 91.211: (1) Between 12,500 and 14,000 feet for more than 30 minutes → crew must use oxygen. (2) Above 14,000 feet → crew must use oxygen continuously. (3) Above 15,000 feet → passengers must be provided oxygen (but not required to use it).',
  },
  {
    topic: 'Aerodynamics',
    q: 'Which type of drag increases with airspeed?',
    options: ['Induced drag', 'Parasite drag', 'Both increase equally with airspeed'],
    correct: 1,
    explanation: 'Parasite drag increases with the square of airspeed (double the speed = 4× the drag). Induced drag decreases as airspeed increases. Total drag is minimum at the speed where induced and parasite drag are equal — this is L/D max, and the speed for maximum range.',
  },
  {
    topic: 'Aerodynamics',
    q: 'Maximum range for a propeller-driven aircraft is achieved by flying at:',
    options: ['Maximum continuous power setting', 'The speed for minimum total drag (L/D max)', 'Maximum cruise speed with lean mixture'],
    correct: 1,
    explanation: 'Maximum range = maximum distance per unit of fuel = maximum L/D ratio (L/D max). This occurs at the speed where total drag is minimum. Flying faster burns more fuel against parasite drag; flying slower burns more fuel against induced drag. L/D max is the optimal compromise.',
  },
  {
    topic: 'Commercial Operations',
    q: 'During a visual approach, terrain clearance is the responsibility of:',
    options: ['ATC — they issued the visual approach clearance', 'The pilot in command — ATC provides traffic separation only', 'The airport surface traffic control'],
    correct: 1,
    explanation: 'During a visual approach, ATC provides traffic separation but NOT terrain or obstacle clearance. The PIC is always responsible for maintaining safe clearance from terrain, obstacles, and the ground. This is a critical distinction that has been a factor in CFIT (Controlled Flight Into Terrain) accidents.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'Fuel reserve requirements for a Part 91 commercial flight (day VFR) require enough fuel to fly to the destination and then for at least:',
    options: ['30 minutes at normal cruise', '45 minutes at normal cruise', '1 hour at normal cruise'],
    correct: 0,
    explanation: 'FAR 91.151(a): Day VFR fuel reserve = 30 minutes at normal cruise speed. Night VFR = 45 minutes. IFR = destination + alternate + 45 minutes. These are minimums — commercial pilots should plan conservatively beyond regulatory minimums.',
  },
  {
    topic: 'Commercial Operations',
    q: 'A stabilized approach in commercial operations requires the aircraft to be in final landing configuration with stabilized speed, power, and glidepath by:',
    options: ['The outer marker on an ILS approach', '1,000 feet AGL in IMC and 500 feet AGL in VMC', 'The final approach fix on any approach'],
    correct: 1,
    explanation: 'Industry standard: stabilized approach "gates" are 1,000 feet AGL in IMC and 500 feet AGL in VMC. The aircraft must be on speed, on glidepath, in landing configuration, with stable power and sink rate. Non-stabilized approaches are a leading cause of runway excursions and accidents.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A flight review under FAR 61.56 must include at minimum:',
    options: ['2 hours of ground training and 2 hours of flight training', '1 hour of ground training and 1 hour of flight training', 'A written test and 3 hours of flight'],
    correct: 1,
    explanation: 'FAR 61.56: A flight review consists of at least 1 hour of ground training and 1 hour of flight training. These are minimums — the authorized instructor determines if more is needed before signing off. Must be completed within the preceding 24 calendar months.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'After deviating from an ATC clearance in an emergency, the pilot must:',
    options: ['File a written report within 24 hours', 'Notify ATC of the deviation as soon as possible', 'Submit a NASA ASRS report only'],
    correct: 1,
    explanation: 'FAR 91.123(c): If you deviate from an ATC clearance in an emergency, notify ATC of the deviation as soon as possible. ATC may request a written report. A NASA ASRS report is also recommended for immunity from certain enforcement actions, but ATC notification is the regulatory requirement.',
  },
  {
    topic: 'Weather',
    q: 'Mountain wave turbulence is most likely to be encountered:',
    options: ['On the windward side of a mountain range in unstable air', 'On the leeward side of a mountain range with strong, stable winds perpendicular to the ridge', 'Only within 5 NM of mountain peaks in any wind condition'],
    correct: 1,
    explanation: 'Mountain (lee) waves form on the downwind side of ridges when: (1) wind is strong (25+ knots) and roughly perpendicular to the ridge, (2) wind speed increases with altitude, and (3) the atmosphere is stable. Rotor turbulence below the wave crests near the surface can be severe.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'A commercial pilot must refuse a flight assignment if:',
    options: ['Passengers request a different route than planned', 'The flight cannot be conducted in compliance with all applicable regulations and safety standards', 'Weather is below VFR minimums at the departure airport only'],
    correct: 1,
    explanation: 'FAR 91.3: The PIC is directly responsible for and is the final authority on the operation of the aircraft. A commercial pilot must refuse any assignment that cannot be conducted safely and legally — regardless of employer or client pressure. Safety is always the PIC\'s responsibility.',
  },
  {
    topic: 'Aerodynamics',
    q: 'The four left-turning tendencies for a single-engine airplane with a clockwise-rotating propeller include:',
    options: ['Torque, P-factor, spiraling slipstream, and gyroscopic precession', 'Torque, induced drag, spiraling slipstream, and dihedral effect', 'P-factor, wash-out, adverse yaw, and torque'],
    correct: 0,
    explanation: 'The four left-turning tendencies: (1) Torque — reaction to clockwise propeller causes left roll; (2) P-factor — descending right blade has more effective pitch; (3) Spiraling slipstream — hits left side of vertical stabilizer; (4) Gyroscopic precession — pitching down causes yaw.',
  },
  {
    topic: 'Aircraft Performance',
    q: 'Maximum certificated gross weight for an aircraft is established during:',
    options: ['Each annual inspection by the A&P mechanic', 'Type certification and published in the TCDS and AFM/POH', 'FAA approval at the time of aircraft purchase'],
    correct: 1,
    explanation: 'Maximum certificated gross weight is established during type certification testing and published in the Type Certificate Data Sheet (TCDS) and the AFM/POH. Operating above this weight is illegal under FAR 91.9 and voids the airworthiness certificate.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'Before acting as PIC of a tailwheel airplane, a pilot must:',
    options: ['Hold a commercial certificate', 'Have received ground and flight training and a logbook endorsement for tailwheel airplanes', 'Have at least 100 hours in tailwheel aircraft'],
    correct: 1,
    explanation: 'FAR 61.31(i): Before acting as PIC of a tailwheel airplane, a pilot must receive and log flight training from an authorized instructor and obtain a logbook endorsement. There is no minimum hour requirement — only the endorsement from a qualified instructor.',
  },
  {
    topic: 'Weather',
    q: 'A rapidly rising barometer after a cold front passes typically indicates:',
    options: ['More deteriorating weather is on the way', 'Improving weather — the frontal passage is complete and clearing is occurring', 'No change in weather conditions'],
    correct: 1,
    explanation: 'Rapidly rising barometric pressure after a cold front indicates clearing skies and improving conditions. The frontal passage is complete. Steadily falling pressure typically indicates approaching weather. A rapid fall followed by a rapid rise can indicate fast-moving frontal activity.',
  },
  {
    topic: 'Commercial Operations',
    q: 'Preflight action required under FAR 91.103 for a flight not in the vicinity of an airport must include:',
    options: ['Weather reports and forecasts only', 'Weather reports, fuel requirements, alternatives if the flight cannot be completed as planned, and known traffic delays', 'Only a preflight inspection of the aircraft'],
    correct: 1,
    explanation: 'FAR 91.103: Before any flight (cross-country or not in vicinity of an airport), the PIC must become familiar with: all available weather information, fuel requirements, alternatives if the planned route cannot be completed, and known ATC delays and NOTAMs.',
  },
  {
    topic: 'Aerodynamics',
    q: 'Ground effect is most significant when the aircraft is operating at a height less than:',
    options: ['Half the wingspan above the surface', 'One wingspan above the surface', 'Two wingspans above the surface'],
    correct: 0,
    explanation: 'Ground effect becomes significant when the aircraft is within one wingspan of the surface, and most pronounced below half a wingspan. It reduces induced drag by disrupting the wingtip vortex pattern, allowing the aircraft to fly at a lower angle of attack for the same lift — which can delay touchdown.',
  },
  {
    topic: 'Commercial Pilot Regulations',
    q: 'The minimum age to hold a commercial pilot certificate is:',
    options: ['17 years', '18 years', '21 years'],
    correct: 1,
    explanation: 'FAR 61.123: A commercial pilot applicant must be at least 18 years old. This compares to 17 for a private certificate and 23 for an ATP (or 21 with an aviation university degree). The commercial certificate also requires an instrument rating.',
  },
];

const FAQS = [
  {
    q: 'How many questions are on the FAA Commercial Pilot written exam (CAX)?',
    a: '100 questions drawn from the FAA\'s Airman Knowledge Testing database. You need a score of 70% or higher to pass. The CAX covers a broader range of topics than the PAR — including advanced aerodynamics, performance, weight and balance, and commercial operations.',
  },
  {
    q: 'What is the minimum experience required for a commercial pilot certificate?',
    a: '250 total flight hours, including 100 hours in powered aircraft, 100 hours PIC time (50 in airplanes), 50 hours of cross-country PIC, and 10 hours in a complex or turbine-powered airplane. An instrument rating is also required.',
  },
  {
    q: 'What does a commercial pilot certificate allow you to do?',
    a: 'A commercial certificate allows you to act as PIC for compensation or hire — aerial photography, charter flights, banner towing, agricultural operations, and more. Scheduled airline operations require an ATP certificate. The commercial opens most aviation career doors.',
  },
  {
    q: 'How is the CAX exam different from the PAR?',
    a: 'The CAX is longer (100 questions vs. 60 for PAR) and covers more advanced topics: commercial regulations, multi-engine aerodynamics (VMC), advanced performance, physiological factors at high altitude, weight and balance, and commercial operating requirements.',
  },
];

export default function CAXPracticeTest() {
  return (
    <PracticeTestTemplate
      seoTitle="FAA Commercial Pilot Practice Test (CAX) — 30 Free Questions (2026)"
      seoDescription="Free FAA Commercial Pilot practice test. 30 CAX knowledge test questions covering commercial regulations, aerodynamics, performance, weight and balance, and multi-engine operations. No login required."
      canonicalPath="/cax-practice-test"
      examBadge="✈ COMMERCIAL PILOT · CAX KNOWLEDGE TEST · FREE PRACTICE"
      examName="Commercial Pilot (CAX)"
      h1Line1="FAA Commercial Pilot"
      h1Accent="Practice Test"
      h1Line2="30 Free Questions — No Login Required"
      heroSub="The CAX knowledge test is 100 questions covering commercial regulations, advanced aerodynamics, multi-engine operations, aircraft performance, and physiological factors. This free test spans all major topics."
      productPath="/cax"
      planParam="cax"
      price="$24.99"
      questionCount="536"
      questions={QUESTIONS}
      faqs={FAQS}
      relatedLinks={[
        { path: '/par-practice-test', label: 'PAR Practice Test (Free)' },
        { path: '/ira-practice-test', label: 'IRA Practice Test (Free)' },
        { path: '/part-107-practice-test', label: 'Part 107 Practice Test (Free)' },
        { path: '/blog/faa-written-exam-study-guide', label: 'FAA Written Exam Study Guide' },
        { path: '/cax', label: 'Full CAX Package — 536 Questions' },
      ]}
      schemaFaqs={FAQS}
    />
  );
}
