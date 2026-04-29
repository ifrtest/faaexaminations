require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

const questions = [
  // ---- NIGHT OPERATIONS (§107.29) ----
  {
    topic_id: 263,
    question_text: 'Under 14 CFR Part 107, night operations are permitted without a waiver if the remote pilot-in-command:',
    choice_a: 'Operates before 10:00 PM local time',
    choice_b: 'Has anti-collision lighting on the sUAS visible for at least 3 statute miles and has completed required night training',
    choice_c: 'Files a NOTAM before the operation',
    correct_answer: 'B',
    explanation: 'Following the 2021 Final Rule (effective April 21, 2021), night operations no longer require a waiver. The remote pilot must have anti-collision lighting on the sUAS visible for at least 3 statute miles AND must have completed aeronautical knowledge and recurrency training that includes night operations topics.'
  },
  {
    topic_id: 263,
    question_text: 'For sUAS night operations under 14 CFR §107.29, civil twilight is defined as:',
    choice_a: '30 minutes before official sunrise and 30 minutes after official sunset',
    choice_b: '60 minutes before official sunrise and 60 minutes after official sunset',
    choice_c: '15 minutes before official sunrise and 15 minutes after official sunset',
    correct_answer: 'A',
    explanation: 'Under §107.29, civil twilight is the period from 30 minutes before official sunrise to 30 minutes after official sunset. Operations during civil twilight require anti-collision lighting visible for 3 statute miles.'
  },
  {
    topic_id: 263,
    question_text: 'Anti-collision lighting required for sUAS night operations must be visible for at least:',
    choice_a: '1 statute mile',
    choice_b: '3 statute miles',
    choice_c: '5 nautical miles',
    correct_answer: 'B',
    explanation: 'Under §107.29(b), during night operations the remote pilot must ensure the sUAS has lighted anti-collision lighting visible for at least 3 statute miles. The remote pilot may reduce the lighting intensity if it would be in the interest of safety.'
  },
  {
    topic_id: 263,
    question_text: 'Which of the following correctly describes the 2021 change to Part 107 night operation rules?',
    choice_a: 'Night operations are now completely prohibited without a Certificate of Waiver or Authorization',
    choice_b: 'Night operations no longer require a waiver if the sUAS has anti-collision lighting visible 3 SM and the pilot has completed updated knowledge training',
    choice_c: 'Night operations require a waiver only for operations over people',
    correct_answer: 'B',
    explanation: 'Effective April 21, 2021, the FAA eliminated the waiver requirement for night operations. Remote pilots may now fly at night without a waiver if the sUAS is equipped with anti-collision lighting visible for 3 SM and the remote pilot has completed aeronautical knowledge training that includes a night operations component.'
  },
  // ---- ADS-B / TRANSPONDER (§107.52, §107.53) ----
  {
    topic_id: 263,
    question_text: 'Under 14 CFR §107.53, an sUAS remote pilot is:',
    choice_a: 'Required to activate ADS-B Out equipment when operating in Class B airspace',
    choice_b: 'Prohibited from operating an sUAS that transmits ADS-B Out signals',
    choice_c: 'Permitted to use ADS-B Out equipment with ATC authorization',
    correct_answer: 'B',
    explanation: 'Section 107.53 prohibits sUAS from operating ADS-B Out equipment. ADS-B Out signals from sUAS could overwhelm ATC infrastructure and create hazards for manned aircraft. sUAS are not required to have transponders or ADS-B Out.'
  },
  {
    topic_id: 263,
    question_text: 'According to 14 CFR §107.52, which statement about transponders on sUAS is correct?',
    choice_a: 'sUAS must have Mode C transponders when operating above 1,200 feet AGL',
    choice_b: 'sUAS are prohibited from operating transponders that could interfere with ATC radar systems',
    choice_c: 'Transponders on sUAS are optional and may be used at the pilot discretion',
    correct_answer: 'B',
    explanation: 'Under §107.52, sUAS are prohibited from operating transponders in a way that could interfere with ATC. sUAS are not required to carry transponders, and the FAA prohibits them from transmitting transponder signals that could affect ATC systems. This parallels the ADS-B Out prohibition in §107.53.'
  },
  // ---- KNOWLEDGE RECURRENCY (§107.65) ----
  {
    topic_id: 263,
    question_text: 'Under 14 CFR §107.65, a remote pilot must complete aeronautical knowledge recurrency training or testing every:',
    choice_a: '12 calendar months',
    choice_b: '24 calendar months',
    choice_c: '36 calendar months',
    correct_answer: 'B',
    explanation: 'Under §107.65, remote pilots must complete recurrent aeronautical knowledge training or pass a recurrent knowledge test every 24 calendar months to maintain their remote pilot certificate privileges.'
  },
  {
    topic_id: 263,
    question_text: 'Following the 2021 Part 107 update, a remote pilot can meet the 24-month recurrency requirement by:',
    choice_a: 'Only by passing the FAA recurrent knowledge test at a testing center',
    choice_b: 'Completing an FAA-approved online aeronautical knowledge and recurrency training course OR passing the recurrent knowledge test at a testing center',
    choice_c: 'Logging 10 hours of sUAS flight time in the preceding 24 months',
    correct_answer: 'B',
    explanation: 'The 2021 rule update added an online training option. Remote pilots can meet the 24-month recurrency requirement by completing an FAA-approved online aeronautical knowledge and recurrency training course (available at FAASafety.gov) OR by passing a recurrent knowledge test at an FAA-approved testing center.'
  },
  {
    topic_id: 263,
    question_text: 'The 2021 Part 107 amendment added which topic as a required aeronautical knowledge area for initial and recurrent testing?',
    choice_a: 'Formation flying with other sUAS',
    choice_b: 'Night operations',
    choice_c: 'Parachute recovery system procedures',
    correct_answer: 'B',
    explanation: 'When the FAA amended Part 107 in 2021 to allow night operations without a waiver, it added night operations as a required knowledge area. Training must cover sUAS lighting requirements, effects of darkness on vision, and safe practices for conducting night operations.'
  },
  // ---- REMOTE ID (Subpart F §107.60–§107.75) ----
  {
    topic_id: 263,
    question_text: 'Under Part 107 Subpart F, which sUAS are required to broadcast Remote ID?',
    choice_a: 'Only sUAS weighing more than 55 pounds',
    choice_b: 'All sUAS operated under Part 107 unless operating within an FAA-Recognized Identification Area (FRIA)',
    choice_c: 'Only sUAS operated for commercial purposes above 400 feet AGL',
    correct_answer: 'B',
    explanation: 'Remote ID is required for all sUAS operated under Part 107. The exception is operations within an FAA-Recognized Identification Area (FRIA), where sUAS without Remote ID capability may operate within the FRIA boundaries. Remote ID enables law enforcement and the FAA to identify sUAS in flight.'
  },
  {
    topic_id: 263,
    question_text: 'Standard Remote ID for an sUAS must broadcast which of the following information?',
    choice_a: 'Only the UAS serial number and GPS coordinates',
    choice_b: 'The UAS serial number or session ID, takeoff location, current position and altitude, velocity, and a time mark',
    choice_c: 'Pilot name, certificate number, and destination coordinates',
    correct_answer: 'B',
    explanation: 'Standard Remote ID broadcasts include: the UAS serial number or session ID, takeoff location (latitude/longitude/altitude), current position and altitude, velocity, and a time mark. This information allows authorized parties to identify and locate sUAS in flight.'
  },
  {
    topic_id: 263,
    question_text: 'An FAA-Recognized Identification Area (FRIA) allows:',
    choice_a: 'Commercial operations in Class B airspace without authorization',
    choice_b: 'sUAS without Remote ID capability to operate within its boundaries while remaining within visual line of sight',
    choice_c: 'Operations above 400 feet AGL without a waiver within the designated area',
    correct_answer: 'B',
    explanation: 'A FRIA is a geographic area recognized by the FAA where sUAS without Remote ID capability may operate. FRIAs are typically established at flying club fields, community organizations, and educational institutions. The sUAS must remain within VLOS and within the FRIA boundaries.'
  },
  {
    topic_id: 263,
    question_text: 'What is the purpose of a Remote ID broadcast module?',
    choice_a: 'It is a device that receives Remote ID signals from nearby manned aircraft',
    choice_b: 'It is a separate device attached to an sUAS that was not manufactured with built-in Remote ID, enabling it to meet the Remote ID broadcast requirement',
    choice_c: 'It is an ADS-B Out transmitter required for operations in Class B airspace',
    correct_answer: 'B',
    explanation: 'A Remote ID broadcast module is a separate add-on device that can be attached to an sUAS lacking built-in Remote ID. It broadcasts the required Remote ID messages, allowing older or kit-built sUAS to comply with Remote ID requirements without being rebuilt.'
  },
  // ---- OPERATIONS OVER PEOPLE (Subpart D §107.100–§107.115) ----
  {
    topic_id: 263,
    question_text: 'Under Part 107, which category of operations over people has the least restrictive requirements and does NOT require FAA authorization?',
    choice_a: 'Category 2',
    choice_b: 'Category 1',
    choice_c: 'Category 3',
    correct_answer: 'B',
    explanation: 'Category 1 operations allow flight over people without a waiver if the sUAS weighs 0.55 pounds (250 grams) or less including everything on board, and has no exposed rotating parts that could lacerate skin. No FAA authorization or Declaration of Compliance is required for Category 1.'
  },
  {
    topic_id: 263,
    question_text: 'For Category 2 operations over people under Part 107, the sUAS manufacturer must:',
    choice_a: 'Certify that the sUAS weighs less than 0.55 pounds',
    choice_b: 'Submit a Declaration of Compliance accepted by the FAA showing the sUAS meets injury risk standards (25 ft-lb threshold)',
    choice_c: 'Obtain a Part 107 waiver before each operation',
    correct_answer: 'B',
    explanation: 'Category 2 requires the manufacturer to submit a Declaration of Compliance (DOC) to the FAA demonstrating the sUAS meets an FAA-accepted means of compliance showing it will not cause injury equivalent to a 25 ft-lb impact. Once accepted, the model is listed on the public FAA DOC database, and remote pilots can confirm eligibility before flying.'
  },
  {
    topic_id: 263,
    question_text: 'How does Category 3 operations over people differ from Category 2?',
    choice_a: 'Category 3 requires a 100 ft-lb injury threshold instead of 25 ft-lb',
    choice_b: 'Category 3 allows a higher injury risk but requires additional operational restrictions such as no operations over open-air assemblies of people',
    choice_c: 'Category 3 is the most permissive and has no operational restrictions',
    correct_answer: 'B',
    explanation: 'Category 3 sUAS may present a higher injury risk than Category 2 and are not subject to the 25 ft-lb foot-pound standard, but must comply with stricter operational limits: operations must occur within a controlled or restricted-access site, or people in the area must be notified and able to move away. Operations over open-air assemblies are prohibited for Category 3.'
  },
  {
    topic_id: 263,
    question_text: 'Category 4 operations over people require the sUAS to have:',
    choice_a: 'A maximum weight of 0.55 pounds',
    choice_b: 'An FAA airworthiness certificate and be operated in accordance with its FAA-approved flight manual',
    choice_c: 'A Part 107 waiver issued for each specific flight',
    correct_answer: 'B',
    explanation: 'Category 4 allows operations over people when the sUAS holds an FAA airworthiness certificate (similar to type-certificated manned aircraft) and is operated under the conditions of that certificate, including compliance with any FAA-approved flight manual. This applies to sUAS meeting traditional airworthiness standards.'
  },
  {
    topic_id: 263,
    question_text: 'A Declaration of Compliance (DOC) for Part 107 operations over people is submitted by:',
    choice_a: 'The remote pilot-in-command before each flight over people',
    choice_b: 'The sUAS manufacturer, and must be accepted by the FAA before the aircraft model can be used for Category 2 or 3 operations over people',
    choice_c: 'The local FSDO for each specific geographic area of operation',
    correct_answer: 'B',
    explanation: 'The Declaration of Compliance is a manufacturer responsibility, not a pilot responsibility. The manufacturer submits the DOC to the FAA, and once accepted, the aircraft model appears on the public FAA DOC list. Remote pilots verify their specific model is listed before conducting Category 2 or 3 operations.'
  },
  // ---- OPERATIONS OVER MOVING VEHICLES (§107.145) ----
  {
    topic_id: 263,
    question_text: 'Under 14 CFR §107.145, when are sUAS operations over moving vehicles permitted without a waiver?',
    choice_a: 'Whenever the sUAS stays below 400 feet AGL above moving vehicles',
    choice_b: 'When the operation occurs within a controlled or restricted-access site where access by non-participants is limited',
    choice_c: 'Operations over moving vehicles are prohibited under all circumstances without a COA',
    correct_answer: 'B',
    explanation: 'Section 107.145 permits operations over moving vehicles without a waiver when the operation takes place within a controlled or restricted-access site (for example, a closed track or private facility where access is controlled). Operations over moving vehicles outside such sites require a Part 107 waiver.'
  },
  // ---- RECORD KEEPING ----
  {
    topic_id: 263,
    question_text: 'For sUAS authorized to conduct Category 2 or 3 operations over people, maintenance records must be retained for at least:',
    choice_a: '6 months from the date of the maintenance action',
    choice_b: '1 year from the date of the maintenance action',
    choice_c: '2 years from the date of manufacture',
    correct_answer: 'B',
    explanation: 'Maintenance records for sUAS conducting Category 2 or 3 operations over people must be retained for at least 1 year from the date of the maintenance. This ensures traceability of safety-critical maintenance for aircraft that are authorized to fly over people.'
  },
  {
    topic_id: 263,
    question_text: 'Under Part 107 Remote ID regulations, manufacturers must retain Remote ID compliance records for:',
    choice_a: '1 year from the date of sale to the end user',
    choice_b: '2 years from the date of manufacture of each sUAS',
    choice_c: '5 years after the aircraft is decommissioned by the owner',
    correct_answer: 'B',
    explanation: 'Remote ID regulations require manufacturers to retain records related to each sUAS and its Remote ID compliance for 2 years from the date of manufacture. This supports the FAA ability to trace Remote ID compliance to the point of production.'
  },
  // ---- AIRSPACE AUTHORIZATION / LAANC ----
  {
    topic_id: 264,
    question_text: 'The Low Altitude Authorization and Notification Capability (LAANC) provides remote pilots with:',
    choice_a: 'Automatic approval for operations up to 400 feet AGL anywhere in the United States',
    choice_b: 'Near-real-time airspace authorization for operations in controlled airspace up to the altitudes shown in UAS facility maps',
    choice_c: 'A blanket waiver for night operations in Class E airspace nationwide',
    correct_answer: 'B',
    explanation: 'LAANC is an automated system providing near-real-time airspace authorization for sUAS in controlled airspace (Class B, C, D, and surface Class E). Authorizations are granted up to the altitudes shown in FAA UAS facility maps. Areas showing 0 feet or areas without LAANC coverage require manual authorization through FAA DroneZone.'
  },
  {
    topic_id: 264,
    question_text: 'A remote pilot wants to fly at 100 feet AGL in Class D airspace. The LAANC UAS facility map for that area shows 0 feet. The pilot should:',
    choice_a: 'Fly at 100 feet AGL since it is well below the 400-foot ceiling',
    choice_b: 'Request manual FAA airspace authorization through DroneZone, as LAANC cannot authorize operations in that area at any altitude',
    choice_c: 'Call the control tower by phone and proceed after verbal confirmation',
    correct_answer: 'B',
    explanation: 'A UAS facility map value of 0 feet means LAANC cannot provide automatic authorization for any altitude at that location. The remote pilot must submit a manual authorization request through FAA DroneZone and wait for written approval. Operating without authorization in Class D airspace violates §107.41.'
  },
  // ---- WEATHER (text-only) ----
  {
    topic_id: 265,
    question_text: 'Density altitude is correctly defined as:',
    choice_a: 'The altitude shown on the altimeter when set to 29.92 inHg',
    choice_b: 'Pressure altitude corrected for non-standard temperature',
    choice_c: 'The true altitude above mean sea level',
    correct_answer: 'B',
    explanation: 'Density altitude is pressure altitude corrected for non-standard temperature. High density altitude (hot, high elevation, humid conditions) means less dense air, which reduces thrust and lift from sUAS rotors, degrading performance and reducing flight time.'
  },
  {
    topic_id: 265,
    question_text: 'Which combination of conditions produces the highest density altitude?',
    choice_a: 'Low temperature, low humidity, and low elevation',
    choice_b: 'High temperature, high humidity, and high elevation',
    choice_c: 'Low temperature, high atmospheric pressure, and sea level elevation',
    correct_answer: 'B',
    explanation: 'Density altitude increases with high temperature (air expands and becomes less dense), high humidity (water vapor is less dense than dry air), and high elevation (reduced atmospheric pressure). This combination — sometimes called high-hot-humid — produces the greatest performance degradation for rotary-wing sUAS.'
  },
  {
    topic_id: 265,
    question_text: 'A remote pilot observes surface winds from the south at 5 knots but a forecast winds-aloft report shows winds at 3,000 feet AGL from the north at 40 knots. This indicates:',
    choice_a: 'Normal atmospheric conditions requiring no special concern',
    choice_b: 'Significant wind shear that could cause sudden uncontrolled changes in sUAS performance if the aircraft climbs into that layer',
    choice_c: 'The winds-aloft forecast is unreliable and should be disregarded',
    correct_answer: 'B',
    explanation: 'Wind shear is a rapid change in wind speed or direction over a short distance. A large difference between surface winds (5 kts south) and winds aloft (40 kts north) indicates strong wind shear. An sUAS climbing into the shear layer could experience sudden, uncontrollable changes in airspeed and attitude. Remote pilots should be alert to wind shear, especially near fronts and thermal inversions.'
  },
  {
    topic_id: 265,
    question_text: 'Thermal turbulence is most likely to develop:',
    choice_a: 'At night over large bodies of water',
    choice_b: 'On sunny afternoons over surfaces that absorb heat rapidly such as asphalt or dry sand',
    choice_c: 'During precipitation inside stratiform cloud layers',
    correct_answer: 'B',
    explanation: 'Thermal turbulence results from uneven surface heating. Dark surfaces like asphalt, rock, and dry sand absorb solar radiation and create rising columns of warm air (thermals). These are strongest on clear, sunny afternoons. Thermals can cause erratic sUAS behavior, particularly at low altitudes where the aircraft may be caught in a thermal edge.'
  },
  // ---- LOADING & PERFORMANCE ----
  {
    topic_id: 266,
    question_text: 'What effect does operating an sUAS at maximum gross weight in high-density altitude conditions have on flight performance?',
    choice_a: 'No effect — electric motors are not affected by air density',
    choice_b: 'Reduced thrust, shorter battery life, degraded climb rate, and possible inability to maintain altitude',
    choice_c: 'Increased efficiency because rotors can spin faster in thinner air',
    correct_answer: 'B',
    explanation: 'High density altitude means lower air density. Rotors require higher RPM to generate equivalent lift, drawing more current and draining batteries faster. Operating at gross weight under these conditions reduces maximum thrust, climb rate, and endurance — potentially beyond safe limits. Remote pilots should reduce payload or avoid operations in high-density altitude conditions when performance margins are small.'
  },
  {
    topic_id: 266,
    question_text: 'The manufacturer specifies a maximum wind speed of 20 mph for an sUAS. The remote pilot observes wind gusts to 22 mph at the operating site. The remote pilot should:',
    choice_a: 'Proceed because the sustained wind speed average is below 20 mph',
    choice_b: 'Not fly because gusts exceed the manufacturer maximum wind speed limitation',
    choice_c: 'Fly at lower altitude to avoid the gusty wind layer',
    correct_answer: 'B',
    explanation: 'Operating limitations established by the manufacturer are binding under §107.51. If any wind condition — including gusts — exceeds the stated maximum, the remote pilot must not fly. Gusts are instantaneous and unpredictable; a single gust above the limitation can cause loss of control regardless of average wind speed.'
  },
  // ---- OPERATIONS ----
  {
    topic_id: 267,
    question_text: 'Under 14 CFR §107.33, when a visual observer is used, the remote pilot-in-command must ensure the visual observer:',
    choice_a: 'Is a certificated remote pilot capable of taking over the controls immediately',
    choice_b: 'Can see the sUAS at all times during the operation and can communicate effectively with the remote pilot',
    choice_c: 'Monitors ATC radio frequencies on a handheld radio during the operation',
    correct_answer: 'B',
    explanation: 'When a visual observer (VO) is used, the RPIC must ensure the VO can see the sUAS throughout the operation and can communicate effectively with the RPIC. The VO helps maintain situational awareness. The VO does not need to be a certificated remote pilot or capable of operating the aircraft.'
  },
  {
    topic_id: 267,
    question_text: 'A remote pilot-in-command may allow a non-certificated person to manipulate the flight controls of an sUAS if:',
    choice_a: 'The person holds a sport pilot certificate',
    choice_b: 'The certificated remote pilot-in-command monitors the operation and is capable of immediately taking direct control',
    choice_c: 'The person has logged at least 10 hours of sUAS flight time and passed a ground school course',
    correct_answer: 'B',
    explanation: 'Under §107.12(b), a person without a remote pilot certificate may manipulate sUAS controls if a certificated remote pilot-in-command monitors the operation and is capable of immediately taking over direct control. The RPIC retains full responsibility for the safety of the operation at all times.'
  },
  {
    topic_id: 267,
    question_text: 'Which of the following provisions of Part 107 is NOT waivable by the FAA?',
    choice_a: 'Operations over moving vehicles (§107.145)',
    choice_b: 'Prohibition on careless or reckless operation (§107.23)',
    choice_c: 'Visual line of sight requirement (§107.31)',
    correct_answer: 'B',
    explanation: 'Section 107.200 lists provisions that may be waived. The prohibition on careless or reckless operation (§107.23) is not waivable — no FAA waiver can authorize a remote pilot to operate in a manner that endangers life or property. Waivable provisions include VLOS (§107.31), operations over moving vehicles (§107.145), and several others.'
  }
];

async function run() {
  console.log('Inserting', questions.length, 'questions as is_active = false...\n');
  const ids = [];
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const res = await pool.query(
      `INSERT INTO questions (exam_id, topic_id, question_text, choice_a, choice_b, choice_c, correct_answer, explanation, is_active)
       VALUES (4, $1, $2, $3, $4, $5, $6, $7, false) RETURNING id`,
      [q.topic_id, q.question_text, q.choice_a, q.choice_b, q.choice_c, q.correct_answer, q.explanation]
    );
    ids.push(res.rows[0].id);
    console.log(`[${i+1}/${questions.length}] ID ${res.rows[0].id}: ${q.question_text.substring(0, 70)}...`);
  }
  const counts = await pool.query(
    'SELECT is_active, COUNT(*) FROM questions WHERE exam_id = 4 GROUP BY is_active ORDER BY is_active'
  );
  console.log('\n--- UAG Question Summary ---');
  counts.rows.forEach(r => console.log(`  is_active=${r.is_active}: ${r.count} questions`));
  console.log('\nInserted IDs:', ids.join(', '));
  await pool.end();
}

run().catch(e => { console.error(e.message); pool.end(); });
