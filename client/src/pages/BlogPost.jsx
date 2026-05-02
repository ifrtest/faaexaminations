// client/src/pages/BlogPost.jsx
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const tagColors = {
  'Private Pilot':      { bg: 'rgba(48,172,226,0.12)', color: '#30ace2' },
  'Instrument Rating':  { bg: 'rgba(61,214,140,0.12)', color: '#3dd68c' },
  'Study Tips':         { bg: 'rgba(245,166,35,0.12)',  color: '#f5a623' },
  'Resources':          { bg: 'rgba(48,172,226,0.12)', color: '#30ace2' },
  'License Conversion': { bg: 'rgba(93,200,217,0.12)', color: '#5dc8d9' },
  'Part 107':           { bg: 'rgba(61,214,140,0.12)', color: '#3dd68c' },
};

const POSTS = {

  /* ================================================================ */
  'how-to-read-a-metar': {
    title: 'How to Read a METAR (With Real Examples)',
    description: 'METARs show up on every FAA knowledge test. Learn to decode them field by field with real examples — Private Pilot, Instrument Rating, Commercial, and Part 107.',
    date: 'April 25, 2026',
    dateISO: '2026-04-25',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/blog-metar.webp',
    related: ['faa-written-exam-study-guide', 'instrument-rating-knowledge-test-tips', 'how-to-pass-faa-written-exam-first-try'],
    content: (
      <>
        <h2>What is a METAR?</h2>
        <p>A METAR is a routine weather observation for an airport. Pilots use it to understand current conditions before flight. Drone operators need it to check wind, visibility, and precipitation. And if you're taking any FAA knowledge test — Private Pilot, Instrument Rating, Commercial, or Part 107 — you will see METAR questions.</p>
        <p>The format looks confusing at first. It isn't. Once you learn the structure, you can decode one in under a minute.</p>

        <h2>A real METAR, decoded</h2>
        <p>Here's a real-looking METAR:</p>
        <p style={{fontFamily:'monospace', background:'var(--card-bg)', padding:'12px 16px', borderRadius:8, fontSize:'.9rem', overflowX:'auto', display:'block', marginBottom:20}}>METAR KORD 211552Z 27015G22KT 10SM FEW040 SCT080 BKN250 18/06 A2998 RMK AO2 SLP152 T01780061</p>

        <h3>METAR</h3>
        <p>The report type. METAR is a routine observation issued on schedule. SPECI is a special report issued outside the normal schedule — usually because conditions changed fast.</p>

        <h3>KORD</h3>
        <p>The station identifier. K means it's in the contiguous United States. ORD is O'Hare International in Chicago. Four-letter ICAO codes are used here, not the three-letter codes you see on tickets.</p>

        <h3>211552Z</h3>
        <p>The date and time. 21 is the day of the month. 1552Z is the time in Zulu (UTC). This observation was taken on the 21st at 15:52 UTC. Always UTC — never local time.</p>

        <h3>27015G22KT</h3>
        <p>Wind. Direction is 270 degrees — due west. Speed is 15 knots. G22 means gusting to 22 knots. VRB means variable direction. Winds under 3 knots are reported as calm. On the FAA test, wind direction is always magnetic.</p>

        <h3>10SM</h3>
        <p>Visibility in statute miles. 10SM is a good VFR day. The FAA uses statute miles for surface visibility in METARs — not nautical miles. Below 3SM starts to matter for VFR minimums. Below ¼SM is essentially zero-zero.</p>

        <h3>FEW040 SCT080 BKN250</h3>
        <p>Sky condition. Three layers reported here. Add two zeros to get the altitude in feet AGL:</p>
        <ul>
          <li>FEW040 — Few clouds at 4,000 ft AGL</li>
          <li>SCT080 — Scattered at 8,000 ft</li>
          <li>BKN250 — Broken layer at 25,000 ft</li>
        </ul>
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Code</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Coverage</th>
            </tr></thead>
            <tbody>
              {[['SKC or CLR','Clear'],['FEW','1–2 eighths'],['SCT','3–4 eighths'],['BKN','5–7 eighths'],['OVC','8 eighths (overcast)']].map(([c,d],i)=>(
                <tr key={i} style={{ borderBottom:'1px solid var(--border)', background: i%2===0?'var(--card-bg)':'transparent' }}>
                  <td style={{ padding:'9px 12px', color:'var(--text)', fontFamily:'monospace' }}>{c}</td>
                  <td style={{ padding:'9px 12px', color:'var(--text2)' }}>{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>BKN and OVC are ceilings. FEW and SCT are not. That distinction matters for VFR minimums and for the test.</p>

        <h3>18/06</h3>
        <p>Temperature and dewpoint in Celsius. Temp is 18°C, dewpoint is 6°C. When the spread is small — 2°C or less — expect fog or low clouds. Carburetor ice risk increases when temps are between -10°C and +30°C with high humidity.</p>

        <h3>A2998</h3>
        <p>Altimeter setting. A2998 means 29.98 inches of mercury. Set this in your Kollsman window before flight. Altimeter settings change constantly — that's why you get updated METARs.</p>

        <h3>RMK AO2 SLP152 T01780061</h3>
        <p>Remarks. AO2 means the station has a precipitation discriminator — it can tell rain from snow. AO1 cannot. SLP152 is sea level pressure 1015.2 millibars. The T group gives temp and dewpoint to the tenth of a degree.</p>
        <p>Remarks are frequently tested — especially AO1 vs. AO2 and sea level pressure decoding.</p>

        <h2>Common mistakes on the FAA test</h2>

        <h3>Mixing up statute miles and nautical miles</h3>
        <p>Visibility in METARs is always in statute miles. Cloud heights are in feet AGL. Don't convert when you don't need to.</p>

        <h3>Forgetting that cloud heights are AGL</h3>
        <p>METAR cloud heights are above ground level, not above sea level. A field at 3,000 ft MSL with a BKN020 ceiling has clouds at roughly 5,000 ft MSL. Matters for flight planning.</p>

        <h3>Misreading wind direction</h3>
        <p>Wind direction in a METAR is where the wind is coming FROM. 270 degrees means the wind is out of the west, moving east. This trips up a lot of students.</p>

        <h3>Ignoring the timestamp</h3>
        <p>The observation time matters. A METAR from two hours ago may not reflect current conditions. The test will sometimes ask you to evaluate a METAR time relative to a proposed departure.</p>

        <h2>Why this matters beyond the test</h2>
        <p>You'll use METARs before every flight. As a drone operator, Part 107 requires you to verify weather conditions before each flight. Learn to decode one quickly. Pull up a real METAR, work through it yourself, then check with a decoder. Ten minutes of that is worth more than an hour of passive reading.</p>

        <h2>Practice METAR questions before your exam</h2>
        <p><a href="https://faaexaminations.com/register" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has 3,000+ FAA practice questions including weather decoding across the Private Pilot, Instrument Rating, Commercial, and Part 107 exams — with explanations for every answer. Free account, no credit card.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-written-exam-study-guide': {
    title: 'FAA Written Exam Study Guide: What to Study and in What Order',
    description: 'A topic-by-topic breakdown of the FAA written exam — high vs low priority topics, study order, and how long each area actually takes. Start free at FAAExaminations.com.',
    date: 'April 25, 2026',
    dateISO: '2026-04-25',
    readTime: '8 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['how-to-pass-faa-written-exam-first-try', 'how-to-pass-faa-private-pilot-written-exam', 'common-mistakes-private-pilot-written-exam'],
    content: (
      <>
        <p>Most student pilots make the same mistake. They open a thick ground school manual, start on page one, and try to read their way to passing. Weeks later they're deep into aerodynamics theory and still haven't touched airspace or weather — two of the heaviest topics on the actual exam.</p>
        <p>A better approach: know what the test covers, then study in the order that builds on itself.</p>

        <h2>High priority topics first</h2>

        <h3>1. Regulations (FAR)</h3>
        <p>Time: 4–6 hours. Priority: High.</p>
        <p>Know Part 61 and Part 91 cold. Certificate requirements, currency rules, equipment requirements, right-of-way rules. The FAA tests these directly and repeatedly. Don't skip the definitions section — "controlled airspace," "instrument flight rules," and "pilot in command" all have specific FAA definitions that show up in questions.</p>

        <h3>2. Airspace</h3>
        <p>Time: 3–5 hours. Priority: High.</p>
        <p>Class A through G. Memorize the floor, ceiling, and equipment requirements for each class. Know when a transponder is required. Know Mode C veil rules. Draw it if you need to — a hand-drawn airspace diagram sticks better than anything you read.</p>
        <p>Common test mistake: Class B requires an ATC clearance AND a Mode C transponder. Class C just requires establishing radio contact. Students mix these up constantly.</p>

        <h3>3. Weather and weather services</h3>
        <p>Time: 5–7 hours. Priority: High.</p>
        <p>Break it into chunks:</p>
        <ul>
          <li>METARs and TAFs — how to read them</li>
          <li>PIREPs and AIRMETs/SIGMETs</li>
          <li>Winds aloft forecasts</li>
          <li>Weather hazards — thunderstorms, icing, wind shear</li>
        </ul>
        <p>Do METARs first. They're the most tested and they build vocabulary for everything else in aviation weather.</p>

        <h3>4. Navigation</h3>
        <p>Time: 5–8 hours. Priority: High.</p>
        <p>Sectional chart reading, pilotage, dead reckoning, VOR navigation. Know how to read a sectional — airspace depictions, airport symbols, obstruction symbols, chart legend. Practice plotting a course. Know how to compute magnetic course from true course.</p>
        <p>The math isn't hard, but it has to be automatic. Use the E6B until it's second nature.</p>

        <h2>Medium priority topics</h2>

        <h3>5. Aircraft systems and performance</h3>
        <p>Time: 4–6 hours. Priority: Medium-High.</p>
        <p>Pitot-static system, gyroscopic instruments, electrical systems, fuel systems. Know what fails when, and why. Know how to read a POH performance chart — density altitude, takeoff distance, cruise performance. The FAA will give you a chart and ask you to extract a number. Practice with real charts.</p>

        <h3>6. Aerodynamics</h3>
        <p>Time: 3–4 hours. Priority: Medium.</p>
        <p>Four forces of flight, angle of attack, stalls, load factor in turns. You don't need an engineering degree. Know how lift is generated, what causes a stall (AOA, not airspeed), and what load factor does to stall speed.</p>

        <h3>7. Airport operations</h3>
        <p>Time: 2–3 hours. Priority: Medium.</p>
        <p>Runway markings, signs, lighting. Taxiway vs. runway signage. Hot spots. Hold short instructions. LAHSO. This section is smaller but students often skip it and miss easy points.</p>

        <h3>8. Physiological factors</h3>
        <p>Time: 2–3 hours. Priority: Medium.</p>
        <p>Hypoxia, hyperventilation, spatial disorientation, night vision, alcohol and drugs. Most of this is common sense with specific FAA language. The 8-hour bottle-to-throttle rule. Blood alcohol limits. Know the exact numbers.</p>

        <h2>Lower priority (don't skip)</h2>

        <h3>9. Cross-country flight planning</h3>
        <p>Time: 3–4 hours. Priority: Medium-Low.</p>
        <p>Filing a flight plan, fuel requirements, alternates, lost procedures. Most of this ties back to regulations and navigation. Review it after those are locked down.</p>

        <h3>10. Aeromedical and human factors</h3>
        <p>Time: 1–2 hours. Priority: Low.</p>
        <p>IMSAFE checklist, fatigue, decision-making. Short section, easy points. Don't spend too long here — it won't carry the exam, but it's low-hanging fruit.</p>

        <h2>How long does it actually take?</h2>
        <p>Studying 1–2 hours per day, six days a week, you can cover the material in three to four weeks. A practical schedule:</p>
        <ul>
          <li>Week 1 — Regulations and airspace</li>
          <li>Week 2 — Weather and weather services</li>
          <li>Week 3 — Navigation and flight planning</li>
          <li>Week 4 — Systems, aerodynamics, airport ops</li>
          <li>Week 5 — Review, practice tests, weak areas</li>
        </ul>

        <h2>One rule for all of it</h2>
        <p>Don't just read. Answer questions. Passive reading gives you a false sense of readiness. Active recall — answering questions and reviewing explanations when you get them wrong — is how the material actually sticks. Every topic you study, find the corresponding practice questions and do them.</p>

        <h2>Practice questions mapped to every topic</h2>
        <p><a href="https://faaexaminations.com/register" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has 3,000+ official FAA practice questions covering every topic above. Answer them, review the explanations, and track your weak areas by topic. Free account, no credit card.</p>
      </>
    ),
  },

  /* ================================================================ */
  'instrument-rating-knowledge-test-tips': {
    title: 'Instrument Rating Knowledge Test: What Makes It Hard and How to Pass',
    description: 'The IRA has a lower pass rate than the private pilot test. Here\'s what makes it harder — IFR charts, approach plates, holding patterns — and the study order that works.',
    date: 'April 25, 2026',
    dateISO: '2026-04-25',
    readTime: '8 min read',
    tag: 'Instrument Rating',
    image: '/plane-ira.webp',
    related: ['instrument-rating-knowledge-test-study-tips', 'how-to-read-a-metar', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>A lot of instrument students go into the knowledge test expecting something like the Private Pilot exam — just more material. That's not right. The IRA doesn't just have more content. It has harder content that requires you to apply knowledge, not just recognize facts.</p>
        <p>The pass rate for the IRA is lower than the PAR. Students who treat it like the private pilot test often find out the hard way with a 65 or 68 when they needed a 70.</p>

        <h2>The volume is real</h2>
        <p>The private pilot test covers roughly 60 topics. The IRA covers close to 100 — and many go deeper. You're not just adding IFR regulations on top of what you know. You're learning an entirely new operating environment: airways, approach charts, IFR filing, IFR weather minimums, holding patterns, departure and arrival procedures.</p>
        <p>Each of those could be its own exam. Together, they're one.</p>

        <h2>The topics that trip people up most</h2>

        <h3>1. IFR charts — enroute and approach</h3>
        <p>This is the single biggest differentiator between students who pass and students who don't. Enroute low altitude charts look nothing like sectionals. The symbology is different. MEA, MOCA, MAA — minimum enroute altitude, minimum obstruction clearance altitude, maximum authorized altitude. You need to know which applies when and why.</p>
        <p>Approach plates are harder for most students. An ILS plate has procedure notes, minimums, plan view, profile view, and a missed approach procedure — all on one page. The FAA will hand you a plate and ask specific questions about it. You need to be fluent, not just familiar.</p>
        <p>What works: pick one approach type at a time. Start with ILS. Learn what every symbol means before moving to RNAV or VOR. Print plates and mark them up. Take practice questions that require chart interpretation.</p>

        <h3>2. Holding patterns</h3>
        <p>Holding patterns aren't complicated in theory. The questions make them complicated. The FAA will ask you about entry procedures (direct, teardrop, parallel), timing, wind correction, and EFC time requirements.</p>
        <p>The mental picture has to be clear before you can answer these fast. Students who memorize "turn right in a standard hold" without understanding the geometry get confused on non-standard holds and entry type questions from unusual positions.</p>
        <p>Draw holds. Lots of them. From different positions, with different headings. Ten minutes of drawing beats an hour of reading.</p>

        <h3>3. IFR weather minimums</h3>
        <p>IFR weather minimums are layered. Takeoff minimums. Alternate airport minimums. Approach minimums — and those change by aircraft category, approach type, and available equipment. The 1-2-3 rule for alternate planning. What qualifies an airport as an alternate.</p>
        <p>Common mistake: confusing alternate minimums (1 hour before and after ETA) with approach minimums. Different numbers, different purposes.</p>

        <h3>4. Instrument approaches</h3>
        <p>Precision vs. non-precision. ILS vs. RNAV vs. VOR vs. NDB. Each has different minimums and procedures. The FAA tests:</p>
        <ul>
          <li>Decision altitude (DA) vs. minimum descent altitude (MDA)</li>
          <li>What visual references are required to continue below minimums</li>
          <li>When you must execute a missed approach</li>
          <li>Category differences for approach speed</li>
        </ul>
        <p>DA vs. MDA is tested repeatedly. DA applies to precision approaches — you decide at a specific altitude. MDA applies to non-precision — you don't descend below it without required visual references. Know this cold.</p>

        <h3>5. IFR departure and arrival procedures</h3>
        <p>DPs and STARs are on the test. ODP vs. SID. When you're required to fly a DP. What happens when one isn't published. Students skip this area because it seems procedural — but the questions are specific, and the points are real.</p>

        <h3>6. Lost communication procedures</h3>
        <p>Lost comm generates multiple questions and is worth focused study. The rule: fly the highest of the MEA, assigned altitude, or expected altitude. Fly the route you were cleared to, expected, or filed. Begin the approach at the EFC time or your calculated ETA. Know the logic, not just the acronym.</p>

        <h2>Study order for the IRA</h2>
        <p>Don't start with the charts. Start with IFR regulations — get the legal framework clear first. Then weather, which builds on your private pilot knowledge but adds PIREPs, AIRMETs, SIGMETs, and IFR-specific hazards. Then charts — enroute first, approach plates second.</p>
        <ol>
          <li>IFR regulations (Parts 61 and 91)</li>
          <li>IFR weather services and hazards</li>
          <li>Navigation systems (VOR, ILS, RNAV, GPS)</li>
          <li>Enroute chart reading</li>
          <li>Approach procedures and plates</li>
          <li>Holding patterns</li>
          <li>IFR departure, arrival, and flight planning</li>
          <li>Practice tests, full review of weak areas</li>
        </ol>

        <h2>The one thing that separates passers from failures</h2>
        <p>The IRA rewards students who understand why things work, not just what to do. When you understand why a teardrop entry is used in a certain position, you don't have to memorize it — it's obvious. When you understand why DA is used on precision approaches and MDA on non-precision, the minimums questions become logical instead of arbitrary.</p>
        <p>Ask "why" constantly while you study. If you can't explain why a rule exists, you don't own the knowledge yet.</p>

        <h2>Don't walk into this test cold on the charts</h2>
        <p>The number one thing students underestimate is chart fluency. You can read about IFR charts all day. Until you've worked through approach plates and answered questions about specific elements on specific plates, you're not ready. That's a skill that takes practice, not reading.</p>

        <h2>Instrument Rating practice questions</h2>
        <p><a href="https://faaexaminations.com/register" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has a full Instrument Rating question bank covering IFR regulations, chart interpretation, approach minimums, holding patterns, weather, and lost comm procedures — with explanations for every answer. Free account, no credit card.</p>
      </>
    ),
  },

  /* ================================================================ */
  'part-107-drone-test-study-guide': {
    title: 'How to Pass the Part 107 Drone Test First Try',
    description: 'Everything you need to pass the FAA Part 107 Remote Pilot test first try. Study plan, key topics, and 166 practice questions at FAAExaminations.com. Start free.',
    date: 'April 25, 2026',
    dateISO: '2026-04-25',
    readTime: '7 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
    related: ['how-to-read-a-metar', 'faa-written-exam-questions-score-tips', 'best-faa-test-prep-tools'],
    content: (
      <>
        <p>Most drone pilots who want to fly commercially underestimate this test. They assume that because they can fly well, the knowledge side will be easy. It isn't. The FAA Part 107 exam covers airspace, weather, regulations, and emergency procedures — and it doesn't care how smooth your footage is.</p>
        <p>60 questions. 70% to pass. The question bank is public. No surprises if you put in the work.</p>

        <h2>What the Part 107 test actually covers</h2>
        <p>This is not a flying test. The FAA will not ask about gimbal settings or return-to-home altitude.</p>
        <ul>
          <li>Regulations — Part 107 rules on altitude, speed, prohibited operations</li>
          <li>Airspace — Classes B through G, restricted areas, TFRs</li>
          <li>Weather — METARs, TAFs, density altitude, how conditions affect performance</li>
          <li>Loading and performance — how weight changes flight behavior</li>
          <li>Emergency procedures — lost link, fly-away, flying near people</li>
          <li>Radio communications — when to contact ATC and how</li>
          <li>Crew resource management — visual observer duties</li>
        </ul>
        <p>Weather and airspace are where most people lose points. Not because they're hard — because drone pilots skip them, assuming the flying experience covers it. It doesn't.</p>

        <h2>The rules you need to know cold</h2>
        <p>Memorize these before you touch a single practice question:</p>
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Rule</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Requirement</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Maximum altitude', '400 ft AGL'],
                ['Maximum speed', '100 mph (87 knots)'],
                ['Minimum visibility', '3 statute miles from control station'],
                ['Cloud clearance', '500 ft below, 2,000 ft horizontal'],
                ['Daylight operations', '30 min before sunrise to 30 min after sunset'],
                ['Night operations', 'Anti-collision lighting visible 3 miles'],
                ['Over people', 'Prohibited without waiver (Category exceptions apply)'],
                ['Over moving vehicles', 'Prohibited without waiver'],
                ['Certificate renewal', 'Every 24 months'],
              ].map(([rule, req], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)' }}>{rule}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{req}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>These come up constantly. If you have to think through them on test day, that's time you don't need to spend.</p>

        <h2>How to study</h2>

        <h3>Week 1: Regulations and airspace</h3>
        <p>Read Part 107. It's not long — a few hours. Then work through airspace. Get comfortable with the sectional chart legend. Know what each airspace class requires for drone operations and where you need authorization before you fly.</p>

        <h3>Week 2: Weather and practice questions</h3>
        <p>Learn to read a METAR. Know how to pull ceiling, visibility, and wind from one. Understand density altitude — it matters more for drone performance than most people expect, especially in hot weather or at elevation.</p>
        <p>Then start practice questions, by topic. At <a href="https://faaexaminations.com" style={{color:'var(--blue)'}}>FAAExaminations.com</a>, all 265 Part 107 questions are sorted by category. Drill the weak areas instead of cycling through what you already know.</p>

        <h3>Week 3: Full practice exams and booking</h3>
        <p>Run the 60-question timed simulator. Aim for 80%+ before you book. The actual exam gives you 2 hours — most people finish in 45 minutes.</p>
        <p>Once you're consistently at 80%, book it. PSI Services runs the testing centers. Bring a valid government ID. Fee is around $175.</p>

        <h2>The airspace question that gets everyone</h2>
        <p>The most commonly missed question type involves reading a sectional chart to figure out whether you need authorization at a specific location.</p>
        <ul>
          <li>Class G airspace — no authorization needed up to 400 ft AGL</li>
          <li>Class E at surface (dashed magenta line) — authorization required</li>
          <li>Class D, C, B — authorization required, usually through LAANC</li>
          <li>Within 5 miles of an airport — doesn't automatically mean you can't fly; check the class and altitude</li>
        </ul>
        <p>LAANC is the fast-approval system for controlled airspace. Know what it is, what it covers, and where it doesn't apply. It comes up more than once.</p>

        <h2>What happens after you pass</h2>
        <p>Apply for your Remote Pilot Certificate through IACRA, the FAA's online application system. TSA runs a background check, typically a few days to a few weeks. Your temporary certificate arrives by email. The plastic card follows by mail.</p>
        <p>Renewal is every 24 months via a recurrent knowledge test — shorter than the initial, but you still have to pass it.</p>

        <h2>FAQ</h2>

        <h3>How hard is the Part 107 test?</h3>
        <p>Harder than most drone pilots expect. Two to three weeks of focused study is usually enough to pass first try, but you have to actually study the weather and airspace sections.</p>

        <h3>How many questions are on the Part 107 test?</h3>
        <p>60 questions. You need 42 correct (70%) to pass. You have 2 hours.</p>

        <h3>Can I use a sectional chart during the test?</h3>
        <p>Yes. There's a supplement booklet with charts and legends. Practice reading sectionals beforehand — test day is not the time to figure out what the symbols mean.</p>

        <h3>What if I fail?</h3>
        <p>14-day wait, then rebook. No limit on attempts but the $175 fee applies each time. Figure out which sections cost you and drill those before going back.</p>

        <h3>Do I need Part 107 to fly for a client?</h3>
        <p>Yes. Any commercial drone work — photography, inspections, mapping — requires a Part 107 Remote Pilot Certificate. The recreational exception doesn't cover paid work.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-to-pass-faa-written-exam-first-try': {
    title: 'How to Pass the FAA Written Exam First Try',
    description: 'Practical strategies to pass your FAA knowledge test first try. Study smarter with 3,000+ practice questions, timed simulator, and AI Instructor at FAAExaminations.com.',
    date: 'April 25, 2026',
    dateISO: '2026-04-25',
    readTime: '7 min read',
    tag: 'Study Tips',
    image: '/blog-faa-simulator.jpg',
    related: ['faa-written-exam-study-guide', 'how-to-pass-faa-private-pilot-written-exam', 'best-faa-test-prep-tools'],
    content: (
      <>
        <p>Most student pilots stress about the written more than their first solo. Wrong thing to worry about. The knowledge test has a published question bank — you're not guessing what might show up, you're practicing the actual questions. Pass rates are high for people who prepare right.</p>

        <h2>Understand what the FAA is actually testing</h2>
        <p>The FAA isn't trying to trick you. The test covers the fundamentals of safe flight: regulations, weather, navigation, performance, airspace. Stuff you need to know anyway.</p>
        <p>The numbers: Private Pilot (PAR) is 60 questions, 70% to pass. Instrument Rating (IRA) is 60. Commercial Pilot (CAX) is 100. Part 107 is 60.</p>
        <p>The FAA draws from a published test bank. Practice the questions, understand the answers, show up.</p>

        <h2>Step 1: Learn the material before you touch practice questions</h2>
        <p>Most students blow this. They go straight to practice questions and wonder why nothing sticks.</p>
        <p>Spend your first week with the FAA handbooks:</p>
        <ul>
          <li>Pilot's Handbook of Aeronautical Knowledge (PHAK)</li>
          <li>Airplane Flying Handbook</li>
          <li>Aeronautical Information Manual (AIM)</li>
        </ul>
        <p>You don't need to memorize them. You need to understand the logic. Once you know <em>why</em> a regulation exists, the correct answer stops being a guess.</p>

        <h2>Step 2: Practice by topic, not randomly</h2>
        <p>Random drilling feels productive. It isn't. Work through one category at a time:</p>
        <ol>
          <li>Regulations (14 CFR Part 61 and 91)</li>
          <li>Airspace</li>
          <li>Weather</li>
          <li>Navigation and charts</li>
          <li>Aircraft performance and weight &amp; balance</li>
          <li>Aerodynamics</li>
        </ol>
        <p>At <a href="https://faaexaminations.com" style={{color:'var(--blue)'}}>FAAExaminations.com</a>, all 3,000+ questions are sorted by module — same categories the FAA uses. Drill your weak areas instead of repeating what you already know.</p>

        <h3>The topics that show up on almost every exam</h3>
        <p>Where to put your time:</p>
        <ul>
          <li>Weather — METARs, TAFs, SIGMETs, cloud types, fronts</li>
          <li>Airspace — class boundaries, requirements, radio calls</li>
          <li>Regulations — currency requirements, right-of-way rules</li>
          <li>Charts — sectional symbols, runway markings, VOR navigation</li>
          <li>Performance — density altitude, weight &amp; balance</li>
        </ul>
        <p>These five cover a lot of ground on every exam.</p>

        <h2>Step 3: Read the explanations, not just the answers</h2>
        <p>I've seen students drill 1,000 questions and still retake the exam. Usually because they were checking answers without reading why.</p>
        <p>When you get a question wrong — and when you get it right — read the explanation. The FAA reuses the same logic across different phrasings. Understand the concept once and you'll recognize it in a question you've never seen.</p>
        <p>FAAExaminations.com has a full explanation for every question, tied to the specific FAA regulation or handbook section. The AI Instructor lets you ask follow-ups on anything that isn't clicking.</p>

        <h2>Step 4: Simulate the real exam before you book it</h2>
        <p>Two weeks out, start running full timed practice exams — not to study, but to get comfortable with the format.</p>
        <p>You want to know how the time pressure feels, how to keep moving when you're unsure, and how long you can realistically spend per question. Most exams give you about 2.5 hours.</p>
        <p>Hit 80%+ consistently before you book. At 85%, go book it. Stuck below 75%, don't.</p>

        <h3>Stuck below 75%?</h3>
        <p>Stop doing full exams. Find the two or three categories dragging your score down and work through every question in those modules. Most students have one problem area — usually weather or airspace. Fix that and the overall score moves.</p>

        <h2>Step 5: The week before</h2>
        <p>Don't learn new material this week. One practice exam per day, review only the questions you missed. Confirm your ID, testing center, and appointment. Sleep the two nights before.</p>
        <p>Cramming the night before doesn't help. You'll walk in tired and second-guess answers you knew cold.</p>

        <h2>How long does it take to prepare?</h2>
        <p>Two to four weeks for most students who study consistently:</p>
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Week</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Focus</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['1', 'Handbooks and ground school'],
                ['2', 'Topic-by-topic practice questions'],
                ['3', 'Full practice exams, weak area review'],
                ['4', 'Final sims, confirm booking, rest'],
              ].map(([week, focus], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)' }}>Week {week}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{focus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>45 minutes a day beats a six-hour Saturday.</p>

        <h2>FAQ</h2>

        <h3>How many questions are on the FAA private pilot written exam?</h3>
        <p>60 questions. You need 42 correct (70%) to pass.</p>

        <h3>Can I use a calculator?</h3>
        <p>Yes. Bring an approved aviation calculator — and practice with it beforehand. Don't figure out the buttons on test day.</p>

        <h3>How long is the score valid?</h3>
        <p>24 months. Your checkride has to happen within that window.</p>

        <h3>What happens if I fail?</h3>
        <p>14-day wait, then you can retake it. Your instructor signs you off again. Go back and find which topics cost you.</p>

        <h3>Is FAAExaminations.com enough without ground school?</h3>
        <p>A lot of students use it as their only prep and pass. The explanations and AI Instructor cover the same ground as most ground school courses. If you're completely new to aviation, a structured course alongside it will speed things up — but it's not required.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-to-pass-faa-private-pilot-written-exam': {
    title: 'How to Pass the FAA Private Pilot Written Exam',
    description: 'Everything you need to know about the PAR knowledge test — topics covered, question count, passing score, and the most effective study strategies.',
    date: 'April 18, 2026',
    dateISO: '2026-04-18',
    readTime: '8 min read',
    tag: 'Private Pilot',
    related: ['how-to-pass-faa-written-exam-first-try', 'common-mistakes-private-pilot-written-exam', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>The FAA Private Pilot written exam — officially the PAR, or Airman Knowledge Test — is the one written hurdle every student pilot faces before the checkride. It's 60 questions, 2.5 hours, and you need a 70% to pass. Sounds manageable. And it is, if you actually prepare for it.</p>

        <p>The students who struggle aren't the ones who lack the intelligence. They're the ones who studied the wrong things, trusted that skimming the Pilot's Handbook would be enough, or who just memorized answers without understanding what they were memorizing. That last group sometimes passes, then freezes when their DPE asks a follow-up during the oral.</p>

        <p>Here's what the exam actually tests and how to be genuinely ready for it.</p>

        <h2>The numbers</h2>
        <p>You'll get 60 questions drawn randomly from the FAA's published question bank. You have 2 hours and 30 minutes — that's plenty of time, most people finish in under an hour. Passing score is 70%, which means you can miss 18 questions and still walk out with a pass. The result is valid for 24 calendar months from the day you test.</p>
        <p>Miss 70%? You wait 14 days minimum, get a new instructor endorsement, and rebook. The test fee (typically $150–175 depending on the centre) applies every attempt.</p>

        <h2>What they're actually testing</h2>
        <p>The exam covers eight broad areas. Some of them are straightforward. A few will eat your score if you don't give them proper attention.</p>

        <p><strong>Regulations</strong> are the baseline — the rules governing what you can and can't do as a private pilot. Medical requirements, currency requirements, privileges and limitations. Know Part 91 well enough that you can answer questions about it without having to reason through it from first principles.</p>

        <p><strong>Airspace</strong> is where a lot of points get lost. The VFR weather minimums table — different visibility and cloud clearance requirements for Class B, C, D, E, and G at different altitudes — is tested frequently, and the differences between classes are easy to confuse. You need to have this memorized cold, not "kind of remembered."</p>

        <p><strong>Weather</strong> is substantial. METARs, TAFs, PIREPs, SIGMETs, AIRMETs, winds-aloft forecasts. Each one has its own format and its own shorthand. The exam doesn't ask if you understand meteorology conceptually — it gives you a real METAR and asks you to extract specific information from it. If you can't decode one fluently, you'll slow down badly on these questions.</p>

        <p><strong>Performance and weight/balance</strong> require actual math. Takeoff distance charts, landing distance charts, climb performance, density altitude — these are chart-reading exercises with a bit of arithmetic. Weight and balance problems have you calculating center of gravity using moments. Neither is hard, but both require practice. Trying to figure out the method on test day, under time pressure, is where things go sideways.</p>

        <p><strong>Navigation</strong> covers VFR chart reading, VOR, GPS, dead reckoning, and E6B calculations. Know how to read a sectional. Know how to solve a time-speed-distance problem with your flight computer. These questions are usually reasonable if you've actually touched an E6B recently.</p>

        <p><strong>Physiology, airport operations, and emergency procedures</strong> round out the exam. These tend to be more straightforward — the concepts are logical and the questions don't try to trick you.</p>

        <h2>The study method that works</h2>
        <p>There's really one approach that consistently produces high scores, and it's not reading the Handbook cover to cover. It's working through practice questions — authentic FAA questions — with immediate feedback on what you got wrong and why.</p>

        <p>The FAA question bank for the Private Pilot exam has roughly 900 questions. You should see all of them at least once before you test. Not to memorize the answers, but because encountering the questions forces you to engage with the material in the same way the exam will. Passive reading doesn't do that.</p>

        <p>Start with a cold diagnostic. Do 30–40 questions without any preparation and see where you actually are. Most people are surprised — some areas are stronger than expected, a few are weaker. That result should drive your study plan, not a generic study schedule from a textbook.</p>

        <p>Then study by subject area, focused on your weakest spots first. As you work through questions, read every explanation — not just for the questions you got wrong, but for the ones where you guessed correctly. Understanding why an answer is right is what protects you when the question is worded differently.</p>

        <p>In the final week before your test, take several full timed practice exams. 60 questions, 2.5-hour clock running, no notes. Target 85% or better before you book the real thing. If you're consistently hitting 85+ on timed practice, the actual exam will feel easy.</p>

        <h2>How long does it actually take?</h2>
        <p>Most students are genuinely ready after 15–25 hours of focused prep. That's 3–4 weeks at an hour a day, or about a week of serious concentrated study. An accelerated ground school can get you there in 5–7 days if you're fully committed to it.</p>

        <p>The variable isn't hours — it's quality of those hours. An hour of active practice with feedback is worth about four hours of passive reading. If you're highlighting sentences in the Handbook and calling it studying, you're going to be surprised on test day.</p>

        <h2>What you can bring in</h2>
        <p>The testing centre workstation has a built-in calculator. You're allowed to bring your E6B flight computer — mechanical or electronic — and a plotter. The test materials include the chart legends and supplements you'll need. No personal notes, no textbooks, no phone.</p>

        <h2>After you pass</h2>
        <p>Your Airman Test Report is printed at the testing centre. Your instructor will go over any missed questions with you as part of your checkride preparation — this is required. Bring that report to your checkride; your DPE will want to see it. And keep an eye on the 24-month clock. Students who pass their written early in training sometimes end up retesting if their checkride gets delayed.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-written-exam-questions-score-tips': {
    title: 'FAA Written Exam: How Many Questions, What Score to Pass & How to Prepare',
    description: 'A complete breakdown of the FAA Airman Knowledge Test format — number of questions per exam, passing scores, time limits, and what to do if you fail.',
    date: 'April 15, 2026',
    dateISO: '2026-04-15',
    readTime: '6 min read',
    tag: 'Study Tips',
    related: ['how-to-pass-faa-written-exam-first-try', 'faa-written-exam-study-guide', 'best-faa-test-prep-tools'],
    content: (
      <>
        <p>Before you open a study guide or book a testing slot, it helps to know the basic shape of the exam you're preparing for. How long is it? How hard is hard? What happens if you don't make it the first time? Here's everything you need up front.</p>

        <h2>Every FAA knowledge test uses the same passing score</h2>
        <p>It doesn't matter whether you're going for your Private Pilot certificate, Instrument Rating, or Commercial — the passing score for every FAA Airman Knowledge Test is 70%. No exceptions. That said, there's a real difference between passing and being well-prepared, and we'll get to that.</p>

        <h2>Exam formats at a glance</h2>

        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Exam</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Questions</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Time Limit</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Passing</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Private Pilot — Airplane (PAR)', '60', '2.5 hrs', '70%'],
                ['Instrument Rating — Airplane (IRA)', '60', '2.5 hrs', '70%'],
                ['Commercial Pilot — Airplane (CAX)', '100', '3 hrs', '70%'],
                ['Airline Transport Pilot (ATM)', '125', '3 hrs', '70%'],
                ['Flight Instructor — Airplane (FOI + FIA)', '100 + 50', '3 hrs each', '70%'],
                ['Sport Pilot (SPT)', '40', '2 hrs', '70%'],
                ['Remote Pilot (RPA)', '60', '2 hrs', '70%'],
              ].map(([exam, q, time, pass], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)' }}>{exam}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{q}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text2)' }}>{time}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{pass}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>How the questions are actually chosen</h2>
        <p>The FAA publishes its question bank — every question that could possibly appear on your exam is publicly available. On test day, your specific questions are drawn randomly from that pool. Two people taking the same exam on the same morning will likely see completely different questions.</p>

        <p>This is why working through authentic FAA questions is so much more effective than reading a textbook. The bank for the Private Pilot exam has around 900 questions. If you've seen all of them, nothing on test day is a surprise. You're not solving new problems — you're recognizing things you've already worked through.</p>

        <h2>What actually happens if you fail</h2>
        <p>You wait 14 calendar days. Then you go back to your flight instructor, who reviews the areas where you lost points and gives you an endorsement for additional ground training. With that endorsement, you can rebook.</p>

        <p>There's no limit on how many times you can test — keep going until you pass. But the testing fee applies every attempt, and most centres charge $150–175. That adds up fast if you're not properly prepared before booking the first time.</p>

        <p>One thing that catches people off guard: your Airman Test Report (the printout you get after the exam) shows your score by subject area, not by individual question. Your instructor will see exactly which categories tripped you up. Plan for a real study session on those areas, not a quick skim.</p>

        <h2>The 70% trap</h2>
        <p>Technically, 70% is all you need. But a 72 on your test report is a yellow flag to your DPE. They'll know the written was close and will lean harder on those subjects during your oral exam. Students who walk in with 88s and 92s tend to have smoother orals — the DPE can see the preparation.</p>

        <p>If you're hitting 85%+ consistently on full timed practice exams, you're ready. Anything below that, keep going.</p>

        <h2>Booking the exam</h2>
        <p>FAA knowledge tests are administered through PSI Services at testing centres across the country. Book at faa.psiexams.com. You'll need a valid government-issued photo ID and your instructor's endorsement — either a logbook entry or a separate signed document. You cannot walk in without the endorsement.</p>

        <h2>One thing worth knowing about the time limit</h2>
        <p>The time limits listed above are generous. Most students finish the Private Pilot or Instrument Rating exam in 45–60 minutes. The Commercial takes a bit longer because there are 100 questions. You won't be racing the clock — but that doesn't mean you should rush. Slow down on performance charts and E6B questions. Those are where mistakes happen when you're moving too fast.</p>
      </>
    ),
  },

  /* ================================================================ */
  'instrument-rating-knowledge-test-study-tips': {
    title: 'Instrument Rating Knowledge Test: Study Tips That Actually Work',
    description: 'The IRA is the hardest FAA written exam. Here\'s how to tackle the weather, navigation, and regulations topics that trip up most students.',
    date: 'April 10, 2026',
    dateISO: '2026-04-10',
    readTime: '7 min read',
    tag: 'Instrument Rating',
    related: ['instrument-rating-knowledge-test-tips', 'how-to-read-a-metar', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>Ask a group of instrument-rated pilots which FAA written gave them the most trouble and the IRA will win by a significant margin. It's not the hardest written because it's designed to be unfair — it's hard because the material is genuinely more complex. IFR procedures, approach charts, weather you'd never see on a VFR flight, airspace rules that only apply when you're in the clouds. It's a different category of knowledge.</p>

        <p>Here's how to approach it so you're not one of the students who has to rebook.</p>

        <h2>What makes the IRA harder than the PAR</h2>
        <p>The Private Pilot test assumes you know nothing about aviation. The Instrument Rating test assumes you know everything from the Private and adds a whole other layer on top of it. You're not just expected to know what a METAR is — you're expected to know what conditions make an alternate airport legally required, what the ceiling and visibility need to be at your ETA for that alternate to be usable, and what happens if the forecast changes after you're already in the air.</p>

        <p>The topics that get added for the IRA: IFR regulations (Part 91 Subpart B), approach procedure reading, en route IFR charts, instrument system failures and errors, advanced weather products, and navigation systems in far more depth than the PAR ever touches.</p>

        <h2>Study in this sequence — it genuinely matters</h2>
        <p>Random studying works poorly for the IRA because the topics build on each other. If you don't understand how your instruments work, approach charts won't make sense. If you don't know the IFR regs, questions about alternate requirements will feel random. The sequence below is the one that produces the most efficient path to a passing score.</p>

        <p><strong>Start with instrument systems.</strong> Pitot-static system, gyroscopic instruments, how they fail, what the failure looks like in the cockpit. This is the foundation. Once you understand what your instruments are actually doing, the rest of the content — navigation, approaches, weather — starts to fit together logically.</p>

        <p><strong>Move to IFR regulations.</strong> Part 91 IFR rules, equipment requirements, currency requirements, flight plan filing, ATC procedures. Know the 1-2-3 rule for alternate requirements cold. Know what LAHSO is. Know the fuel requirements for IFR flight.</p>

        <p><strong>Then tackle weather.</strong> IFR weather is its own language and it needs dedicated time. SIGMETs vs. AIRMETs — know the specific types (Sierra for IFR/mountain obscuration, Tango for turbulence, Zulu for icing). Winds-aloft forecasts in the old FB format. Prog charts. Freezing levels. Icing types and conditions.</p>

        <p><strong>Finish with approach procedures.</strong> By the time you get here, approach charts will make more sense than they would have at the start. Learn the structure: the plan view, profile view, and minimums section. Practice pulling specific numbers quickly — minimums for a given aircraft category, visibility in RVR vs. statute miles, missed approach point, missed approach procedure. The exam will absolutely test this.</p>

        <h2>The 1-2-3 rule you need to know cold</h2>
        <p>This comes up on almost every IRA. No alternate is required if, for the period from 1 hour before to 1 hour after your estimated time of arrival, the destination forecast shows ceilings of at least 2,000 feet and visibility of at least 3 statute miles. If it's tighter than that, you file an alternate. The alternate itself has its own minimums requirements. This is tested in multiple question variations — know the rule, not just the numbers.</p>

        <h2>The weather section will decide your score</h2>
        <p>More students lose points on weather than any other section of the IRA, and it's usually not because the questions are hard — it's because students underestimate how much the weather content expands beyond what the PAR covers.</p>

        <p>AIRMETs alone trip people up regularly. There are three types: Sierra covers IFR conditions and mountain obscuration, Tango covers turbulence and low-level wind shear, Zulu covers icing and freezing levels. The exam will describe a condition and ask which AIRMET applies. If you've only memorized the names without the details, you'll get it wrong.</p>

        <p>Make a reference card. One page, every weather product and what it covers. Drill it. The investment is maybe an hour but it pays off significantly on test day.</p>

        <h2>Approach charts: less scary than they look</h2>
        <p>The first time you open a Jeppesen approach chart it looks like someone encrypted an instrument procedure. Give it a few hours and the structure becomes completely logical — the same layout every time, same sections in the same places. Plan view on top, profile below, minimums at the bottom.</p>

        <p>What the exam actually tests is your ability to extract specific values quickly: what's the decision altitude for a Category B aircraft on this ILS? What's the visibility required? What do you do on the missed approach? Practice pulling numbers from sample charts until you can find them without hunting. Speed matters because you have other questions to answer.</p>

        <h2>Realistic benchmarks</h2>
        <p>Plan for 25–40 hours of study depending on how much IFR flying you've done alongside your written prep. If you're in the plane flying actual approaches every week, the concepts will click faster. If you're purely studying the written in isolation, allow the higher end of that range.</p>

        <p>Target 85%+ on full timed 60-question practice exams before you book. If you're plateauing in the low-to-mid 70s, it almost always means one or two subject areas are dragging everything down. Look at your results by category — it'll tell you exactly where to spend the next few sessions.</p>
      </>
    ),
  },

  /* ================================================================ */
  'best-faa-test-prep-tools': {
    title: 'Best FAA Test Prep Tools Compared (2026)',
    description: 'We compare the most popular FAA knowledge test prep platforms — question banks, features, pricing, and pass rates — so you can choose the right one.',
    date: 'April 5, 2026',
    dateISO: '2026-04-05',
    readTime: '5 min read',
    tag: 'Resources',
    related: ['how-to-pass-faa-written-exam-first-try', 'faa-written-exam-study-guide', 'faa-written-exam-questions-score-tips'],
    content: (
      <>
        <p>There's no shortage of FAA test prep material out there. Apps, books, video ground schools, flashcard decks, YouTube channels. The problem isn't finding resources — it's figuring out which ones are actually worth your time before you're two weeks deep and realize they weren't.</p>

        <p>Here's an honest look at what's available and what actually moves the needle on exam scores.</p>

        <h2>The floor any serious prep tool must clear</h2>
        <p>Before comparing specific products, there are four things any worthwhile FAA prep tool needs:</p>

        <p><strong>Authentic FAA questions.</strong> The FAA publishes its official question pool for every knowledge test. Any prep tool worth using is built from that database. Not paraphrased. Not "inspired by." The actual questions. If a platform doesn't tell you clearly that their content comes from the FAA question bank, be skeptical.</p>

        <p><strong>Explanations that actually explain.</strong> Not just "the correct answer is B." You need to understand why B is right and specifically why A and C are wrong. The DPE who examines you during your checkride did not prepare a multiple-choice test. If you can only pick the right letter without knowing the reasoning, the oral exam will surface that very quickly.</p>

        <p><strong>Timed exam simulation.</strong> The real test has a clock. Practicing without one is like training for a marathon by only walking. The timer changes how you think and forces you to build the pacing habits you need.</p>

        <p><strong>Progress tracking by subject.</strong> Overall score tells you relatively little. Knowing that you're at 92% in regulations but 61% in weather is the information that should be driving your study sessions.</p>

        <h2>The main options</h2>

        <h3>Online question banks</h3>
        <p>For most students, this is the core of an effective study plan. A good online question bank gives you the full FAA pool, lets you drill by subject area, tracks your progress, and simulates the real exam. FAAExaminations.com covers PAR, IRA, and CAX with 2,826 questions, explanations, and a timed simulator.</p>

        <h3>King Schools and Sporty's</h3>
        <p>Two long-established names in aviation ground school. Both offer video-based courses that walk you through the material thoroughly, and both include a question bank component. The production quality is high and the content is accurate. The trade-off is cost — full ground school packages run $150–$300+ per certificate — and the video format can feel slow if you're a self-directed learner. If you want a structured, paced course with an instructor talking you through every concept, these are worth the money. If you'd rather just get to the questions, there are faster paths.</p>

        <h3>Gleim Aviation</h3>
        <p>Gleim has been publishing FAA test prep books for decades and their content is solid. The question coverage is complete and the explanations are thorough. The limitation is the format — working through a printed book is slow, and you don't get adaptive practice or the kind of analytics that tell you where your study time should go. Useful as a supplement. Harder to use as a primary platform in 2026.</p>

        <h3>Sheppard Air</h3>
        <p>A notable outlier in the market. Sheppard's method is blunt: they tell you exactly which answer to select for each question and tell you to memorize it. That's it. Their pass rate is high, and the product does what it promises. The criticism — and it's a fair one — is that students who study exclusively with Sheppard can pass the written while understanding very little about what they were tested on. That matters when your DPE starts asking follow-up questions during the oral that weren't verbatim from the question bank. For a student who needs to pass quickly and will fill in the conceptual gaps through actual flying: fine. For a student who wants the written to actually teach them something: probably not the right tool.</p>

        <h3>YouTube and free guides</h3>
        <p>Genuinely useful as a supplement. A well-made video explaining how a VOR works, or walking through a weight and balance problem, can click in a way that reading about it can't. But free content is almost never organized around the exam's specific question pool, and it doesn't give you the systematic practice reps and progress tracking you need to walk in genuinely ready.</p>

        <h2>What the data actually shows</h2>
        <p>The clearest predictor of written exam performance isn't which platform you used — it's the number of authentic practice questions you completed with immediate feedback. Students who work through 500+ practice questions consistently outscore students who spent equivalent time reading or watching video, regardless of which product they used.</p>

        <p>Active recall — being forced to retrieve information, getting it wrong, understanding why, and seeing a similar question again later — builds durable knowledge in a way that passive consumption doesn't. That's not an opinion; it's how memory works.</p>

        <h2>The practical recommendation</h2>
        <p>For most student pilots: an online question bank with authentic FAA questions, explanations, and timed simulation is the core. Optional video course if you hit topics that need visual explanation. The FAA Airplane Flying Handbook and Pilot's Handbook of Aeronautical Knowledge are both free at faa.gov and genuinely worth reading for the concepts that underpin the questions.</p>

        <p>You don't need to spend $300 to pass the written. You need quality questions, honest feedback on your weak areas, and enough timed practice to walk in feeling like you've already done this before.</p>
      </>
    ),
  },

  /* ================================================================ */
  'common-mistakes-private-pilot-written-exam': {
    title: 'Common Mistakes on the Private Pilot Written Exam (And How to Avoid Them)',
    description: 'From weather charts to airspace questions, these are the topics where student pilots lose the most points — and how to make sure you don\'t.',
    date: 'March 28, 2026',
    dateISO: '2026-03-28',
    readTime: '6 min read',
    tag: 'Private Pilot',
    related: ['how-to-pass-faa-private-pilot-written-exam', 'how-to-read-a-metar', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>Certain patterns show up in student practice results so consistently that they're worth calling out directly. The same subjects trip people up over and over — not because those topics are uniquely difficult, but because they're easy to skim during studying and brutal to face unprepared on test day. Here's where the points usually go and what to do about it.</p>

        <h2>METARs and TAFs treated as vocabulary to skim</h2>
        <p>Weather questions make up a substantial portion of the PAR, and the most common single failure point is METAR and TAF decoding. Students read through the abbreviation table once, feel like they've got it, and move on. Then they encounter a real METAR on the exam — something like <span style={{ fontFamily: 'monospace', fontSize: '.88rem', color: 'var(--text2)' }}>METAR KDEN 151755Z 28015G25KT 3/4SM +TSRA FEW020CB BKN045 OVC090 22/19 A2981</span> — and the decoding slows them down badly.</p>

        <p>The fix is repetition with actual examples, not re-reading the abbreviation table. Take a real METAR, translate every single element out loud — wind, visibility, weather phenomena, cloud layers, temperature, altimeter — until you can do it without looking anything up. Do this with 10–15 different reports. By the end, the format should feel as readable as plain text.</p>

        <h2>Airspace VFR minimums memorized incompletely</h2>
        <p>Students usually know the bookend cases: Class B (3 miles, clear of clouds) and Class G at the surface in daytime (1 mile, clear of clouds). But the exam doesn't ask about the easy ones. It asks about Class E above 10,000 MSL, or Class G at night above 1,200 AGL, or the difference between E below and above 10,000. Those middle cases are where points disappear.</p>

        <p>Write the full table on an index card and drill it until every cell is automatic. Not "kind of remembered" — genuinely immediate. The exam will present airspace scenarios where the wrong memorization produces the wrong answer and you won't have time to reason through it from first principles.</p>

        <h2>Rushing through performance chart questions</h2>
        <p>Performance charts — takeoff distance, landing distance, climb performance — appear on almost every PAR. They're not conceptually hard. The points get lost because students rush them.</p>

        <p>The typical mistake: misreading an axis, failing to interpolate correctly between two rows, or using the chart for the wrong configuration (flaps up vs. flaps 10, hard surface vs. grass). These are precision tasks. Under time pressure, without enough practice, accuracy drops.</p>

        <p>The fix is deliberate slowdown. On a performance chart question, read the question twice before touching the chart. Identify which chart you need, find the correct pressure altitude, track across to the temperature column, interpolate carefully. Double-check before selecting. Do this in practice until the method becomes a habit you can execute quickly without skipping steps.</p>

        <h2>Weight and balance math under pressure</h2>
        <p>Weight and balance is arithmetic — multiply each weight by its arm, sum the moments, divide by total weight to get CG. It's not complicated. But the math breaks down under test pressure when students haven't established a consistent workflow for it.</p>

        <p>The other common error is misidentifying the moment arm from the loading table the question provides. Read the table carefully. Work through at least 15–20 problems before your exam date, using your calculator the same way you'll use it during the test. You want to be executing a practiced routine, not working out the method from scratch while the clock runs.</p>

        <h2>Confusion between VFR flight plan rules and ATC requirements</h2>
        <p>A VFR flight plan is not required by regulation — it's a voluntary search-and-rescue tool. You file it for safety, not compliance. This fact confuses students who conflate it with ATC authorization requirements, which are a completely different thing and very much required in controlled airspace.</p>

        <p>Class B requires an ATC clearance to enter. Class C requires two-way communication. Class D requires two-way communication before entering. Transponder requirements differ. SVFR has its own requirements. These distinctions are tested specifically and they catch fuzzy understanding every time. Study the ATC authorization rules directly from the FAR/AIM, not from memory of what sounds approximately right.</p>

        <h2>E6B problems without enough hands-on practice</h2>
        <p>Time-speed-distance, fuel calculations, wind correction angle — E6B questions are entirely mechanical once you know how to use the flight computer. But "knowing how" requires your hands to be familiar with the tool, not just your memory of the instructions.</p>

        <p>Students who used their E6B heavily during cross-country training and then waited three weeks to take the written often slow down significantly on these questions. They remember the concept but have to hunt for the function. Bring your E6B to study sessions and work navigation problems with it until every function is immediate. On test day, time is genuinely your enemy on E6B questions if your hands aren't already fast.</p>

        <h2>The deeper mistake behind all of them</h2>
        <p>Every specific mistake above is a symptom of the same underlying problem: studying to pass rather than studying to know. When the goal is just 70%, students find the minimum path — skim the section, recognize some answer patterns, hope the gaps don't show up. They sometimes pass. Then the DPE during the oral asks a question that the written score revealed as weak, and the preparation gap becomes visible.</p>

        <p>The written exam is not just a box to check. It's preparation for the checkride and for actually flying as a private pilot. Students who understand why every answer is right or wrong — rather than just which letter to pick — score higher on the written and perform better when it counts.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-license-conversion-foreign-pilots': {
    title: 'FAA License Conversion: What Foreign Pilots Need to Know',
    description: 'Holding an ICAO or Transport Canada pilot licence and converting to FAA? Here\'s exactly what knowledge tests you need and how to prepare.',
    date: 'March 20, 2026',
    dateISO: '2026-03-20',
    readTime: '7 min read',
    tag: 'License Conversion',
    related: ['faa-written-exam-questions-score-tips', 'best-faa-test-prep-tools', 'how-to-pass-faa-written-exam-first-try'],
    content: (
      <>
        <p>If you hold a pilot licence from another country and want to fly as pilot-in-command in the United States, you'll need an FAA certificate. The conversion process is designed to be accessible for pilots who already have solid training — the FAA isn't asking you to start from scratch. But there are specific steps, and a few things that catch people off guard if they don't know what to expect.</p>

        <h2>The governing regulation: 14 CFR §61.75</h2>
        <p>Foreign-licence holders apply for a corresponding U.S. certificate under Part 61.75. The requirements are: your foreign licence was issued by an ICAO member state, it's currently valid, you meet the medical requirements, and you pass the required FAA knowledge test. That's the short version.</p>

        <p>The certificate you receive carries a limitation noting it's based on a foreign licence. In practical terms, your FAA certificate's privileges stay active only as long as your home country licence remains valid. If it lapses, your U.S. privileges are suspended until you renew it. Plenty of pilots have been surprised by this when their foreign licence expired and they didn't think it mattered anymore.</p>

        <h2>Which knowledge test do you actually need?</h2>

        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Certificate Sought</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>FAA Knowledge Test</th>
                <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Format</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Private Pilot — Airplane', 'PAR', '60 questions / 70% / 2.5 hrs'],
                ['Commercial Pilot — Airplane', 'CAX', '100 questions / 70% / 3 hrs'],
                ['Instrument Rating — Airplane', 'IRA', '60 questions / 70% / 2.5 hrs'],
                ['Airline Transport Pilot', 'ATM', '125 questions / 70% / 3 hrs'],
              ].map(([cert, test, nums], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)' }}>{cert}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{test}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{nums}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>If your foreign licence includes an instrument rating, you can apply for both the FAA certificate and the instrument rating at the same time. Each requires its own separate knowledge test.</p>

        <h2>For Canadian pilots converting from Transport Canada</h2>
        <p>The Canadian-to-FAA conversion is probably the most common foreign conversion, and Canadian pilots tend to find the transition relatively manageable. The regulatory philosophy between the two countries is similar, the airspace structure has overlapping concepts, and the weather products are familiar in principle even when the specifics differ.</p>

        <p>That said, there are real differences to prepare for. U.S. airspace uses Prohibited, Restricted, Warning areas, MOAs, and Alert areas where Canada uses Class F airspace more broadly. The Graphical Forecasts for Aviation (GFA) has replaced the old Area Forecast in the U.S. but the format differs from what Canadian pilots typically see. Part 91 currency requirements differ in specific ways from the CARs — particularly night currency and instrument currency rules. And U.S. sectional charts are formatted differently from VNC charts.</p>

        <p>For most Canadian pilots, 15–20 hours of focused study on the U.S.-specific material is usually enough to be exam-ready.</p>

        <h2>For European pilots converting from EASA</h2>
        <p>European pilots — whether UK CAA, DGAC, LBA, or any other EASA authority — face a steeper learning curve than Canadian pilots because the regulatory frameworks differ more substantially. The underlying aviation concepts are the same, but the specific rules, airspace designations, and chart formats are different enough that careful preparation pays off.</p>

        <p>The areas that need the most attention for EASA-trained pilots: U.S. airspace classification (Class B/C/D behave differently from CTR/TMA), VFR weather minimums (U.S. minimums don't map directly to EASA ones), FAR Part 91 specific rules around documents, equipment, and currency, and U.S. sectional chart reading. The good news is that the underlying weather knowledge and instrument skills transfer completely — it's mainly the regulatory and procedural details that need updating.</p>

        <h2>The medical certificate question</h2>
        <p>Your ICAO medical issued by a foreign CAA is not accepted for U.S. operations as PIC. You'll need an FAA medical from a U.S. Aviation Medical Examiner. Most pilots who hold a current ICAO Class 1 or Class 2 medical qualify without significant issues. Allow some lead time — if your history involves anything medical that needs FAA review, it can take weeks. If you're straightforward, you can often get certified at the appointment.</p>

        <p>BasicMed is an alternative worth knowing about. If you qualify — hold a U.S. driver's licence, had a regular FAA medical at some point since July 2006, complete an online medical course every 24 months — you can fly certain operations without a current FAA medical certificate.</p>

        <h2>The full application process</h2>
        <p>Get your FAA medical. Get your instructor endorsement for the knowledge test. Pass the required exam at a PSI testing centre. Complete FAA Form 8710-1 through the IACRA online system. Submit your foreign licence documentation and test results to the FAA Airmen Certification Branch in Oklahoma City. Your temporary certificate is usually issued within a few weeks; the permanent one comes by mail.</p>

        <p>Nothing about the process is complicated, but you can't skip steps. The knowledge test has to come before the certificate application, and the medical has to be current when you apply.</p>

        <h2>Preparing for the written</h2>
        <p>The most efficient path for foreign pilots is to work directly through the FAA question bank. Seeing the actual questions teaches you the specific phrasing and scenarios the FAA tests — you can't really replicate that by reading Part 91 in the abstract. Most foreign pilots need 15–30 hours of targeted study depending on how similar their home country regulations are to U.S. standards. Canadians typically land at the low end. European pilots often need the full range.</p>

        <p>FAAExaminations.com covers PAR, IRA, and CAX with the complete FAA question pools, explanations for every question, and timed exam simulation. Free to start.</p>
      </>
    ),
  },


  /* ================================================================ */
  'how-to-pass-faa-private-pilot-written-exam-first-try': {
    title: 'How to Pass the FAA Private Pilot Written Exam First Try',
    description: 'A proven study plan for the FAA Private Pilot Airman Knowledge Test. Learn which topics to prioritize, how long to study, and how to hit 80%+ on your first attempt.',
    date: 'April 28, 2026',
    dateISO: '2026-04-28',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/blog-faa-simulator.jpg',
    related: ['faa-written-exam-study-guide', 'common-mistakes-private-pilot-written-exam', 'how-to-pass-faa-written-exam-first-try'],
    content: (
      <>
        <p>The FAA Private Pilot Airman Knowledge Test has 60 questions and a 70% passing score. You can miss up to 18. That sounds forgiving — and for most topics, it is. But students fail this test every day, and almost never because it was too hard. They fail because they spent three weeks studying the wrong things and walked in underprepared on weather and airspace, which together make up roughly half the exam.</p>
        <p>Here's what a study plan that actually works looks like.</p>

        <h2>What the PAR actually tests</h2>
        <p>Here's the thing most people don't realize: the FAA publishes the entire question bank. Every question on the real exam comes from that bank. Nothing is a surprise, nothing is hidden. Your job isn't to get lucky — it's to work through the bank, understand why each answer is correct, and recognize the patterns when you sit down for the real thing.</p>
        <p>The 11 topics on the PAR:</p>
        <ul>
          <li>Pilot Qualifications</li>
          <li>Airworthiness Requirements</li>
          <li>Weather</li>
          <li>Charts &amp; Navigation</li>
          <li>Federal Aviation Regulations</li>
          <li>National Airspace System</li>
          <li>Navigation Systems &amp; Radar Services</li>
          <li>Aerodynamics</li>
          <li>Airport Operations</li>
          <li>Emergency Procedures</li>
          <li>Aeromedical Factors</li>
        </ul>
        <p>They're not equally weighted. Regulations, weather, and airspace together are about half the exam. If you're short on time, those three are where your hours go first.</p>

        <h2>The 3-week study plan</h2>

        <h3>Week 1 — Regulations, airspace, and weather</h3>
        <p>Start here. Part 61 covers pilot certificates — what you need, how to keep current, when your medical expires. Part 91 covers the operating rules: right-of-way, equipment requirements, cloud clearance minimums. Airspace covers the six classes, their dimensions, and what you need to enter each one. Weather covers METARs, TAFs, winds aloft forecasts, and how to read weather products.</p>
        <p>Give these 1–2 hours a day. Don't try to memorize rules cold — try to understand the logic behind them. When you understand why a regulation exists, the question practically answers itself.</p>

        <h3>Week 2 — Navigation, charts, and airport operations</h3>
        <p>Sectional chart reading is a skill you build, not a list of facts you memorize. You need to actually sit with a chart and work through questions with it in front of you. Pull up SkyVector for free and practice identifying airspace, finding airports, reading the legend. Navigation covers dead reckoning, pilotage, and VOR basics. Airport ops covers runway markings, lighting systems, and taxiway procedures — easier than it sounds, but you have to see the diagrams.</p>

        <h3>Week 3 — Aerodynamics, systems, and full practice exams</h3>
        <p>Aerodynamics on the PAR is lighter than most students expect — angle of attack, load factors, stall characteristics. Aircraft systems covers engines, fuel, electrical, and pitot-static instruments. Aeromedical covers hypoxia, spatial disorientation, and the alcohol rules (more tested than people think).</p>
        <p>By Friday of week 3, you should be running full 60-question timed practice exams and consistently scoring above 80%. When you hit that three times in a row, you're ready to book.</p>

        <h2>The mistakes that actually cause failures</h2>

        <h3>Reading instead of doing</h3>
        <p>A ground school manual is not test prep. The FAA test uses specific question phrasing that you need to have seen before. Students who only read — and never practice actual questions — walk into the exam unfamiliar with the format and lose easy points. Start questions early. Read explanations every time you get one wrong.</p>

        <h3>Rushing through weather</h3>
        <p>Weather is the most heavily tested topic on the PAR, and it's the one students most consistently underinvest in. METARs, TAFs, winds aloft, weather chart interpretation — these take time to get comfortable with. Budget at least 4–5 hours here. Students who breeze through weather almost always regret it.</p>

        <h3>Moving on without reviewing wrong answers</h3>
        <p>Every wrong answer is worth stopping for. Read the explanation. Figure out where your thinking went wrong. That's where the real learning happens — not in the questions you already knew.</p>

        <h2>How to actually use practice questions</h2>
        <p>Don't start with random mode. Go topic by topic — study regulations, then do 40–50 regulation questions before moving on. Check your score. Review what you missed. Repeat with each topic. In your final week, switch to full 60-question timed exams with no pausing and no looking things up. Real conditions. If you score 80%+ three times running, book the test.</p>

        <h2>The day before</h2>
        <p>One practice exam in the morning. Review your weakest topic in the afternoon. Do not cram new material the night before — that doesn't work and it adds anxiety you don't need. Sleep. The exam is 2.5 hours. You need to be sharp, not wired.</p>

        <h2>Start with 1,469 real PAR questions</h2>
        <p><a href="https://faaexaminations.com/par" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has the complete FAA Private Pilot question bank — 1,469 questions across all 11 topics, with full explanations on every answer and a timed exam simulator. No credit card required to start.</p>
      </>
    ),
  },

  /* ================================================================ */
  'part-107-study-guide-2026': {
    title: 'Part 107 Study Guide 2026: How to Pass the FAA Drone License Test',
    description: 'Everything you need to know to pass the FAA Part 107 Remote Pilot knowledge test in 2026. Study plan, key topics, and what the exam actually covers.',
    date: 'April 28, 2026',
    dateISO: '2026-04-28',
    readTime: '8 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
    related: ['how-to-read-a-metar', 'part-107-drone-test-study-guide', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>A lot of people discover Part 107 when they realize they need it — usually after they've already started charging clients for drone footage. The fine for commercial drone operations without a Part 107 certificate can hit $11,000 per violation. That tends to focus the mind.</p>
        <p>The good news: you don't need any aviation background to pass this exam. No flight hours, no medical certificate, nothing. Most people are ready to test in 2–3 weeks. Here's what the exam actually covers and how to study it efficiently.</p>

        <h2>What the Part 107 test actually is</h2>
        <p>It's called the Unmanned Aircraft General — Small (UAG) exam. 60 multiple-choice questions, administered at a PSI testing center. You need a 70% to pass (42 correct out of 60). The test fee is $175. Once you pass, your Remote Pilot Certificate is good for 24 months before you need recurrent training.</p>
        <p>Minimum age is 16. No prior experience required. This is genuinely one of the more accessible FAA exams — the challenge is that it covers real aviation concepts that drone pilots have never had to think about before.</p>

        <h2>The 7 topics the FAA tests on Part 107</h2>

        <h3>1. Regulations (Part 107)</h3>
        <p>The core operating rules. Maximum altitude is 400 ft AGL — unless you're within 400 ft of a structure, in which case you can fly up to 400 ft above it. You must maintain visual line of sight. Daylight operations only (unless you have a waiver). Maximum speed 100 mph. No flying over people or moving vehicles without authorization.</p>
        <p>This is the most heavily tested topic on the exam. Read Part 107 front to back at least once. It's shorter than you think — maybe two hours of reading.</p>

        <h3>2. Airspace</h3>
        <p>This is where most people underestimate the exam. You need to understand the six classes of airspace — A through G — what each one requires to enter, and how to read a VFR sectional chart to identify them. Class B, C, and D airspace around airports requires LAANC authorization or a manual FAA waiver before you fly.</p>
        <p>The test will show you a sectional chart and ask what authorization is needed. If you haven't practiced reading charts, this section will hurt you. Spend real time here.</p>

        <h3>3. Weather</h3>
        <p>Part 107 minimum weather conditions are 3 statute miles of visibility and 500 ft below clouds. The test goes deeper than that — you need to decode METARs, interpret TAFs, and understand how wind and temperature affect drone operations. If you've never read a METAR before, budget extra time here. It looks confusing at first and becomes obvious once you learn the structure.</p>

        <h3>4. Loading and performance</h3>
        <p>High altitude and high heat both reduce air density — which reduces lift and shortens battery life. Cold temperatures also hammer batteries. The FAA wants to know you understand how environmental conditions affect your drone's actual performance, not just its specs.</p>

        <h3>5. Emergency procedures</h3>
        <p>Loss of control link, flyaways, operations that go wrong. The FAA is essentially asking: when something unexpected happens, will you make a safe decision or a stupid one? These questions are usually common sense — but they're written carefully, and a few are designed to catch people who aren't paying attention.</p>

        <h3>6. Radio communications</h3>
        <p>The phonetic alphabet, basic ATC phraseology, and when you're required to communicate with ATC. If you plan to operate near controlled airports regularly, this matters beyond the test. For the exam, it's a small section — but don't ignore it.</p>

        <h3>7. Crew resource management and physiological factors</h3>
        <p>Decision-making under pressure, recognizing fatigue, situational awareness. The FAA tests this with judgment scenarios: you're tired, visibility is marginal, the client wants the shot anyway — what do you do? Answer like a professional.</p>

        <h2>A realistic 2-week study plan</h2>

        <h3>Days 1–3: Regulations</h3>
        <p>Read Part 107. Work through practice questions on regulations only. Know the operating limitations well enough that you don't have to think — altitude, speed, visual line of sight, daylight, waivers. This should feel solid before you move on.</p>

        <h3>Days 4–6: Airspace and charts</h3>
        <p>Learn the airspace classes. Practice reading sectional charts with real questions in front of you — don't just read about charts. Pull up SkyVector and actually identify airspace around a few different airports. Know how LAANC works and when you need it.</p>

        <h3>Days 7–9: Weather</h3>
        <p>Decode METARs and TAFs until they feel natural. Learn the Part 107 minimums. Understand how weather conditions translate into go/no-go decisions for drone ops. If you're still confused by METARs after day 9, re-read our <a href="https://faaexaminations.com/blog/how-to-read-a-metar" style={{color:'var(--blue)'}}>METAR decoding guide</a> — it walks through a real example field by field.</p>

        <h3>Days 10–14: Everything else + full practice exams</h3>
        <p>Cover loading/performance, emergency procedures, radio comms, and crew resource management. Then run full 60-question timed practice exams. When you're consistently at 80% or above, you're ready. Book the test.</p>

        <h2>The mistake that trips most people up</h2>
        <p>Airspace. People study the regulations thoroughly and then barely touch the chart-reading section — and they pay for it on exam day. The airspace questions on the Part 107 test require you to look at a sectional chart and interpret it in real time. That's a skill you build through practice, not something you absorb by reading about it. Use a question bank that shows you charts alongside the questions, and actually work through them with the chart in front of you.</p>

        <h2>Ready to start?</h2>
        <p><a href="https://faaexaminations.com/part-107" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has the complete Part 107 question bank with full explanations and a timed exam simulator. No aviation experience needed. No credit card required to start.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-instrument-rating-written-test-study-tips-2026': {
    title: 'FAA Instrument Rating Written Test: Study Tips That Actually Work',
    description: 'The IRA is the hardest FAA knowledge test. Here\'s how to approach IFR charts, approach procedures, and weather so you pass on your first attempt.',
    date: 'April 28, 2026',
    dateISO: '2026-04-28',
    readTime: '7 min read',
    tag: 'Instrument Rating',
    image: '/plane-ira.webp',
    related: ['how-to-read-a-metar', 'instrument-rating-knowledge-test-tips', 'instrument-rating-knowledge-test-study-tips'],
    content: (
      <>
        <p>The IRA has a reputation, and it's earned. Pilots who breezes through the Private Pilot exam and assumed the Instrument Rating would be similar have found out the hard way that it isn't. The IRA covers approach plates, IFR charts, holding patterns, alternate minimums, and instrument meteorology — and it expects you to actually work with charts on the test, not just recall facts about them.</p>
        <p>The students who pass on their first attempt aren't necessarily the most experienced pilots. They're the ones who studied the right things in the right order and put real time into chart practice. Here's what that looks like.</p>

        <h2>What makes the IRA harder than the PAR</h2>
        <p>The Private Pilot exam tests whether you understand basic VFR operations. The IRA assumes that's already in your head — and stacks instrument procedures, IFR charts, holding patterns, approach minimums, alternate requirements, and IFR-specific weather on top of it.</p>
        <p>The trap most students fall into: they try to study for the IRA the same way they studied for the PAR — reading, some practice questions, done. That doesn't work here. The chart reading component is different. The FAA will show you an approach plate and ask you specific questions about it. If you've never practiced reading plates, that question is going to take 4 minutes you don't have.</p>

        <h2>The 5 topics that decide whether you pass</h2>

        <h3>1. IFR charts and approach procedures</h3>
        <p>This is the heaviest section of the IRA, and the one that trips up the most students. You need to read ILS, VOR, RNAV, and NDB approaches. Know where to find the decision altitude, the minimum descent altitude, the missed approach point, the visibility minimums, and what happens on the missed approach.</p>
        <p>The only way to get good at this is to read actual approach plates — not descriptions of approach plates. Go to the FAA's digital products library and pull up a real ILS approach. Work through it. Then do another. The layout becomes familiar fast once you've seen it a dozen times.</p>

        <h3>2. En route navigation and airways</h3>
        <p>IFR en route charts look nothing like a VFR sectional. Low-altitude airways, NAVAIDs, MEAs, MORAs, intersection identification — you need to be comfortable reading an IFR low en route chart and answering questions from it. Same approach as plates: practice with real charts, not diagrams in a textbook.</p>

        <h3>3. Weather and meteorology</h3>
        <p>The IRA goes deeper into weather than any other FAA exam. You're not just reading METARs — you're interpreting PIREPs, SIGMETs, AIRMETs, icing forecasts, thunderstorm avoidance, and weather depiction charts. You need to know the 1-2-3 rule for alternate airports, IFR filing minimums, and how to read freezing level forecasts.</p>
        <p>Budget more time here than you think you need. Students who rush weather consistently underperform on the IRA.</p>

        <h3>4. IFR regulations (Part 91 IFR rules)</h3>
        <p>Equipment requirements for IFR flight (GRABCARD), instrument currency (6 approaches in 6 months with a safety pilot or in an approved sim), logging IFR time, and the alternate airport rules. Once you've read Part 91 Subpart B carefully, these questions are mostly straightforward — but you have to actually read it.</p>

        <h3>5. Holding patterns and procedure turns</h3>
        <p>Holding entries — direct, parallel, teardrop — are tested directly. The question gives you an arrival heading and asks for the correct entry. If you understand the geometry of why each entry works, you can figure it out without memorizing a diagram. Procedure turns get tested too: when they're required, when they're prohibited (NoPT on the plate), when you can skip them on a radar vector.</p>

        <h2>The right way to study approach plates</h2>
        <p>Read real plates. Not a description of a plate — an actual plate. Go to the FAA's digital products library (it's free), find an ILS approach to any major airport, and work through it field by field. Find the decision altitude. Find the missed approach holding fix. Find the visibility requirement for Category B. Then do a VOR approach. Then an RNAV. The formats are similar but not identical — the differences matter on the test.</p>
        <p>Once the layout feels natural, start doing practice questions with a plate in front of you. That's what the real exam looks like.</p>

        <h2>Three mistakes that cost people the exam</h2>

        <h3>Trying to memorize instead of understand</h3>
        <p>The IRA is too detailed to pass through memorization. If you understand the geometry of a holding entry, you can work out any entry question. If you memorized a diagram instead, you'll second-guess it under pressure. Understanding the principle beats remembering the answer every time.</p>

        <h3>Underestimating weather</h3>
        <p>IFR weather is genuinely harder than VFR weather, and the exam reflects that. Budget at least 6–8 hours specifically for weather topics. Students who treat weather as a quick review section tend to leave points on the table they didn't expect to lose.</p>

        <h3>Not timing practice exams</h3>
        <p>60 questions in 2.5 hours is 2.5 minutes per question. That's fine for a regulation question. It's tight when you're reading an approach plate and answering three questions from it. Practice under real time pressure before exam day — not just to build speed, but to learn which questions are worth taking extra time on.</p>

        <h2>How long does IRA prep take?</h2>
        <p>With a Private Pilot background and 1–2 hours a day, most students are ready in 3–6 weeks. Recent ground school knowledge or an active instrument training schedule puts you at the shorter end. Years of flying VFR with no instrument exposure usually means the full 6 weeks, sometimes more.</p>
        <p>The benchmark that works: score 80%+ on three consecutive full practice exams. Not one, not two — three in a row. Then book it.</p>

        <h2>Start with 821 real IRA questions</h2>
        <p><a href="https://faaexaminations.com/ira" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has the complete FAA Instrument Rating question bank — 821 questions with IFR chart references, full explanations on every answer, and a timed exam simulator. No credit card required to start.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-long-to-get-private-pilot-license': {
    title: 'How Long Does It Take to Get a Private Pilot License?',
    description: 'The honest answer to how long it takes to get a Private Pilot License — including the FAA minimums, realistic timelines, and what actually slows people down.',
    date: 'April 28, 2026',
    dateISO: '2026-04-28',
    readTime: '6 min read',
    tag: 'Private Pilot',
    image: '/private-pilot-faa-knowledge-test-prep.jpg',
    related: ['how-to-pass-faa-private-pilot-written-exam-first-try', 'how-to-pass-faa-written-exam-first-try', 'faa-written-exam-study-guide'],
    content: (
      <>
        <p>The honest answer: the FAA minimum is 40 flight hours. Almost nobody finishes at the minimum. The national average is 60–70 hours, and depending on how often you fly and where you train, it can stretch to 18 months or longer.</p>
        <p>Here's what the timeline actually looks like — and what makes the difference between students who finish in 6 months and students who take two years.</p>

        <h2>The FAA minimums (and why they're almost irrelevant)</h2>
        <p>Under 14 CFR Part 61, the legal minimums for a Private Pilot Certificate — airplane, single-engine land — are:</p>
        <ul>
          <li>40 total flight hours</li>
          <li>20 hours of flight training with an instructor</li>
          <li>10 hours of solo flight time</li>
          <li>3 hours of cross-country training</li>
          <li>3 hours of night flight (including a 100+ nm cross-country)</li>
          <li>3 hours of instrument training (flying under the hood)</li>
          <li>3 hours of flight prep within 60 days of the checkride</li>
          <li>5 hours of solo cross-country time</li>
          <li>1 solo cross-country of 150+ nm with full-stop landings at 3 airports</li>
          <li>3 solo takeoffs and landings at a towered airport</li>
          <li>Pass the FAA knowledge test (written exam)</li>
          <li>Pass the FAA practical test (oral + flight with a DPE)</li>
        </ul>
        <p>The minimums look achievable. In practice, only a small percentage of students complete at exactly 40 hours. Most finish between 55 and 75. The minimums describe what the FAA requires — not what most students actually need to feel ready for a checkride.</p>

        <h2>Realistic timeline by training pace</h2>
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Training Pace</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Flights per Week</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Estimated Timeline</th>
            </tr></thead>
            <tbody>
              {[
                ['Accelerated', '4–5 lessons/week', '2–4 months'],
                ['Standard', '2–3 lessons/week', '6–9 months'],
                ['Part-time', '1 lesson/week', '12–18 months'],
                ['Casual', 'Less than 1/week', '18–24+ months'],
              ].map(([pace, freq, time], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i%2===0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)', fontWeight: 600 }}>{pace}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{freq}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>Consistency matters more than pace. A student who flies twice a week builds skills progressively and retains what they learned between lessons. A student who flies once every two weeks spends the first 20 minutes of each lesson getting back to where they were. That adds up to real money and real months.</p>

        <h2>What actually slows people down</h2>

        <h3>Weather cancellations</h3>
        <p>This is the big one that surprises new students. Weather cancels flights constantly — especially in the Midwest, the Northeast, and anywhere with distinct seasons. A student training through a Canadian or northern US winter can lose entire weeks to ceilings, icing, and wind. If you're starting training in the fall, factor this in. Summer is the fastest season for most students.</p>

        <h3>Aircraft availability</h3>
        <p>Popular training aircraft at busy schools get booked up fast. If you can only fly on Saturday mornings and there are 10 students ahead of you on the schedule, you fly once a week at best. Students who have flexibility — weekday afternoons, early mornings — get more flight time and finish faster. It's worth asking a school about their aircraft-to-student ratio before signing up.</p>

        <h3>Putting off the written exam</h3>
        <p>This is the most common self-inflicted delay. Students treat the written as something to tackle at the end, after they're "almost ready" for the checkride. That's backwards. The written exam covers exactly what you're learning in the airplane — weather, regulations, airspace, navigation. Studying for it early makes you a better student and a better pilot. Pass it in your first month or two of training. Having it done removes a scheduling constraint and builds confidence going into the checkride.</p>

        <h3>Switching instructors</h3>
        <p>Changing instructors mid-training almost always adds hours. A new instructor doesn't know where you are, may do things differently, and will often revisit maneuvers your previous instructor already signed you off on. It's not wasted time — but it's extra time. Find someone whose teaching style works for you and stay with them.</p>

        <h2>The written exam: do it early</h2>
        <p>The PAR knowledge test is required before your checkride. Most students are exam-ready in 2–4 weeks of focused study. It covers 11 topics: regulations, weather, airspace, navigation, aerodynamics, airport operations, and more.</p>
        <p>Start studying in your first month of flight training. The ground knowledge compounds with your flight lessons — you'll understand what you're doing in the airplane better, ask better questions, and come into the checkride with stronger fundamentals. And honestly, getting it done early just feels good.</p>

        <h2>The checkride: what to expect</h2>
        <p>The FAA practical test is conducted by a Designated Pilot Examiner. It starts with an oral exam — typically 1–2 hours — followed by a flight. The national first-attempt pass rate hovers around 80%. The most common reason for failure isn't poor flying; it's being caught flat-footed on a knowledge area during the oral. Strong written exam prep directly correlates with checkride performance — the material overlaps significantly.</p>

        <h2>Start your written exam prep now</h2>
        <p><a href="https://faaexaminations.com/par" style={{color:'var(--blue)'}}>FAAExaminations.com</a> has 1,469 Private Pilot practice questions across all 11 exam topics, full explanations on every answer, and a timed exam simulator. No credit card required. Most students pass in 2–4 weeks.</p>
      </>
    ),
  },

  /* ================================================================ */
  'part-107-vs-private-pilot-license': {
    title: 'Part 107 vs Private Pilot License: What\'s the Difference?',
    description: 'Part 107 and the Private Pilot License are two different FAA certificates. Here\'s what each one covers, who needs which, and whether you can use one for the other.',
    date: 'April 28, 2026',
    dateISO: '2026-04-28',
    readTime: '6 min read',
    tag: 'Part 107',
    image: '/part-107-drone-license-faa-remote-pilot.jpg',
    related: ['part-107-study-guide-2026', 'part-107-drone-test-study-guide', 'how-long-to-get-private-pilot-license'],
    content: (
      <>
        <p>People mix these up more than you'd think. They're both FAA certificates. They both involve a written knowledge test. That's where the similarities end.</p>
        <p>Part 107 is for drone pilots. The Private Pilot License is for people who want to fly actual aircraft with people in them. You cannot use one in place of the other. Here's what each one actually gets you — and how to figure out which one you need.</p>

        <h2>Part 107: the commercial drone license</h2>
        <p>Part 107 is the FAA certification required to operate a drone commercially in the US. "Commercially" is defined broadly — it means any operation where you receive compensation, including money, products, services, or anything else of value. Shooting real estate photos for a broker, filming weddings, doing roof inspections, selling footage, mapping land for a developer — all of it requires Part 107.</p>
        <p>The fine for commercial drone work without it can hit $11,000 per violation. The FAA does enforce this.</p>
        <p>To get Part 107:</p>
        <ul>
          <li>Be at least 16 years old</li>
          <li>Pass the FAA UAG knowledge test (60 questions, 70% to pass)</li>
          <li>Complete TSA security vetting</li>
          <li>Apply through the FAA's IACRA system</li>
        </ul>
        <p>No flight hours. No medical. No aviation background required. Most people study for 2–3 weeks and pass.</p>

        <h2>Private Pilot License: the real one</h2>
        <p>The Private Pilot Certificate lets you fly manned aircraft — small planes, typically — as pilot in command. You can carry passengers. You can fly across the country. What you cannot do is get paid for it (with some narrow exceptions). The PPL is for people who love flying and want to do it legally, not commercially.</p>
        <p>To get a PPL:</p>
        <ul>
          <li>Be at least 17 years old (16 for a solo endorsement)</li>
          <li>Hold a valid FAA 3rd class medical certificate</li>
          <li>Log at least 40 flight hours (the national average is 60–70)</li>
          <li>Pass the FAA PAR knowledge test</li>
          <li>Pass the FAA practical test — an oral exam plus a flight with a Designated Pilot Examiner</li>
        </ul>
        <p>Total cost: typically $8,000–$15,000 depending on where you train, what aircraft you fly, and how quickly you progress. Timeline: 6–18 months for most students.</p>

        <h2>Side by side</h2>
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.9rem' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}></th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Part 107</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Private Pilot License</th>
            </tr></thead>
            <tbody>
              {[
                ['Aircraft', 'Drones (UAS)', 'Manned aircraft'],
                ['Minimum age', '16', '17'],
                ['Medical required', 'No', 'Yes (3rd class)'],
                ['Flight hours required', 'None', '40 minimum (avg 60–70)'],
                ['Written exam', 'UAG (60 questions)', 'PAR (60 questions)'],
                ['Practical test', 'None', 'Yes (oral + flight)'],
                ['Paid work allowed', 'Yes (commercial drone ops)', 'No (private use only)'],
                ['Typical cost', '$175 exam fee', '$8,000–$15,000+'],
                ['Typical timeline', '2–3 weeks study', '6–18 months'],
              ].map(([label, p107, ppl], i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)', background: i%2===0 ? 'var(--card-bg)' : 'transparent' }}>
                  <td style={{ padding: '9px 12px', color: 'var(--text)', fontWeight: 600 }}>{label}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{p107}</td>
                  <td style={{ padding: '9px 12px', color: 'var(--text2)' }}>{ppl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Can a Private Pilot skip the Part 107 exam?</h2>
        <p>Almost. If you hold a Private Pilot, Commercial, or ATP certificate, you're exempt from the initial Part 107 knowledge test. But you're not completely off the hook — you still need to complete the FAA's free Part 107 online recurrent training and register your drone through the FAA DroneZone before flying commercially.</p>
        <p>Student pilot certificates and sport pilot certificates don't qualify for the exemption. You still need to take the UAG exam.</p>

        <h2>Can a Part 107 holder fly manned aircraft?</h2>
        <p>No. Part 107 certifies you to operate unmanned aircraft commercially. Full stop. It has nothing to do with manned flight. You still need a Private Pilot Certificate to legally fly a Cessna, regardless of what UAV certs you hold.</p>

        <h2>So which one do you actually need?</h2>
        <p>If your goal is commercial drone work — real estate, events, inspections, mapping — <strong>get Part 107 first.</strong> It takes 2–3 weeks to study, costs $175 to test, and lets you start earning legally right away. It's one of the most accessible professional licenses the FAA offers.</p>
        <p>If you want to fly actual aircraft — carry passengers, travel by air, eventually build toward a commercial pilot certificate — <strong>you need the Private Pilot License.</strong> There's no shortcut. It takes months and real money. But there's nothing else like it.</p>
        <p>If you want both eventually: start with Part 107. Pass it quickly, start working with your drone, and use that income to fund your flight training. A lot of people take exactly this path.</p>

        <h2>Study for either exam — or both</h2>
        <p>FAAExaminations.com has complete question banks for both:</p>
        <ul>
          <li><a href="https://faaexaminations.com/part-107" style={{color:'var(--blue)'}}>Part 107 exam prep</a> — full question bank, timed simulator, pass in 2–3 weeks</li>
          <li><a href="https://faaexaminations.com/par" style={{color:'var(--blue)'}}>Private Pilot (PAR) exam prep</a> — 1,469 questions across all 11 topics, full explanations</li>
        </ul>
        <p>No credit card required to start.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-long-to-study-for-faa-written-exam': {
    title: 'How Long Should You Study for the FAA Written Exam?',
    description: 'Realistic study timelines for the FAA Private Pilot, Instrument Rating, Commercial, and Part 107 written exams — based on how most people actually prepare.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['how-to-pass-faa-written-exam-first-try', 'faa-written-exam-study-guide', 'how-to-pass-faa-private-pilot-written-exam-first-try'],
    content: (
      <>
        <p>The most common answer you'll find online is "2–4 weeks." Which is true in the same way "it takes 2–8 hours to drive across a state" is true. Technically correct, not that useful.</p>
        <p>Here's a more honest breakdown — based on the exam you're taking, how much time you can realistically carve out each day, and what study method you're using.</p>

        <h2>The short version</h2>
        <p>If you're studying with the actual FAA question bank — not flashcard apps, not YouTube videos alone — and putting in 1.5 to 2 hours a day, here's what to expect:</p>
        <ul>
          <li><strong>Private Pilot (PAR):</strong> 3–4 weeks</li>
          <li><strong>Part 107 (drone license):</strong> 2–3 weeks</li>
          <li><strong>Instrument Rating (IRA):</strong> 4–6 weeks</li>
          <li><strong>Commercial Pilot (CAX):</strong> 3–5 weeks</li>
        </ul>
        <p>These assume you're a relatively motivated person who doesn't already have an aviation background. If you're a CFI or already have your instrument rating, you can compress significantly. If you're starting from zero and aviation is genuinely new territory, give yourself the longer end.</p>

        <h2>Why most people take longer than they should</h2>
        <p>The FAA publishes the complete question bank. Every question that could appear on your written exam is in there. Not "questions similar to" or "representative samples of" — the actual questions, word for word.</p>
        <p>This is kind of remarkable. The test is hard to fail if you've genuinely worked through the bank. And yet people fail, and people spend months studying when they could spend weeks. Usually it's one of a few things:</p>

        <h3>Studying the wrong things</h3>
        <p>Reading the Pilot's Handbook of Aeronautical Knowledge cover to cover before touching a practice question is the study equivalent of memorizing a dictionary before writing an essay. It feels productive. It mostly isn't. The PHAK is 500 pages. A lot of it won't appear on your test. Some of what will appear on your test requires very specific knowledge that only clicking through questions and reading explanations will build.</p>
        <p>Use the book as a reference when you don't understand an explanation — not as your starting point.</p>

        <h3>Not tracking weak areas</h3>
        <p>If you're just cycling through questions without paying attention to which topics you keep getting wrong, you're spinning. Weather Theory, Weight & Balance, and Navigation chart questions are where most private pilot candidates lose points. If you're passing those cold, great. If you're not — that's where your study time should go, not the topics you already have.</p>

        <h3>Stopping too soon</h3>
        <p>A lot of people feel ready when they're hitting 80–85% on practice tests. That feels good. The real exam needs 70% to pass, so the math seems fine. But the actual test pulls from the full question bank, which means you'll see questions you haven't practiced as much. Aim to be consistently hitting 85–90% on fresh, randomized sets before you book your appointment.</p>

        <h2>A realistic week-by-week framework (PAR example)</h2>
        <p>Here's roughly how three weeks of focused PAR study looks:</p>
        <p><strong>Week 1:</strong> Work through questions by topic. Don't worry about your score yet — just get exposure. Read every explanation whether you got the question right or wrong. The goal is to build familiarity with what the exam actually tests, not to feel confident.</p>
        <p><strong>Week 2:</strong> Start doing timed mixed-topic sessions. Notice where you're consistently weak and spend extra time there. Weather, airspace, and performance tend to trip people up. VFR weather minimums are worth memorizing cold — they show up constantly.</p>
        <p><strong>Week 3:</strong> Full timed practice exams. Book your real test when you're consistently at 85%+. Don't keep pushing the test date because you feel nervous — by this point you've seen the questions, you know the material, and the nerves are not going to disappear with more study time.</p>

        <h2>Part 107 is faster — but don't underestimate the airspace questions</h2>
        <p>Part 107 is a narrower exam than the private pilot test. There's no weight and balance, no engine systems, no traffic pattern procedures. What does show up heavily: airspace classification, sectional chart reading, and weather. These are the areas where confident drone pilots with zero aviation background get surprised.</p>
        <p>If you can read a sectional chart and decode a METAR before you start the exam, you're ahead of most people who show up on test day. If those are genuinely new to you, budget an extra week.</p>

        <h2>The honest minimum</h2>
        <p>You can pass the PAR in two weeks of hard studying. Some people do it in ten days. I've seen people fail after six weeks of "studying" that was mostly watching YouTube. The time you spend matters less than what you do with it.</p>
        <p>Work through the question bank. Read every explanation. Track what you're getting wrong. Take timed practice exams. When you're consistently passing those by a comfortable margin, book the test.</p>
        <p>That's it. There's no secret. The bank is published. Use it.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-medical-certificate-classes-explained': {
    title: 'FAA Medical Certificate: Class 1, 2, 3, and BasicMed Explained',
    description: 'Before you start flight training, you need to know if you qualify for an FAA medical certificate. Here\'s what Class 1, 2, and 3 require, who needs what, and how BasicMed works.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/private-pilot-faa-knowledge-test-prep.jpg',
    related: ['how-long-to-get-private-pilot-license', 'how-to-pass-faa-private-pilot-written-exam-first-try', 'part-107-vs-private-pilot-license'],
    content: (
      <>
        <p>One of the first things people ask when they decide to start flight training is whether they'll actually be able to get a medical certificate. It's a reasonable question — the FAA has medical standards, and some conditions disqualify pilots or require special issuance. Knowing this early saves you from investing months of time and thousands of dollars before finding out there's a problem.</p>
        <p>Here's how the FAA medical certificate system works.</p>

        <h2>Why you need a medical certificate</h2>
        <p>To act as pilot in command of a powered aircraft, you need to hold a valid FAA medical certificate — or qualify under BasicMed (more on that below). The medical ensures you're physically and mentally fit to fly safely. Student pilots need at least a third-class medical before their first solo flight.</p>
        <p>Drone pilots don't need a medical certificate. The Part 107 Remote Pilot Certificate has no medical requirement whatsoever — that's one of the reasons it's accessible to nearly anyone.</p>

        <h2>The three classes of FAA medical</h2>

        <h3>Third-Class Medical</h3>
        <p>The third-class medical is what private pilots need. It's the least restrictive class. To exercise private pilot privileges, your third-class medical must be current — it's valid for 60 calendar months if you're under 40 at the time of the exam, and 24 calendar months if you're 40 or older.</p>
        <p>Requirements include: vision correctable to 20/40 in each eye, no hearing impairment that prevents normal conversations, no untreated disqualifying medical conditions (certain heart conditions, epilepsy, severe mental health diagnoses, substance dependence). Many conditions that people assume are disqualifying — including controlled diabetes, well-managed depression, and some cardiac conditions — can actually qualify with special issuance.</p>

        <h3>Second-Class Medical</h3>
        <p>Commercial pilots exercising commercial privileges need a second-class medical. It's valid for 12 calendar months for commercial operations, then reverts to third-class privileges for another 12 or 48 months depending on age. Requirements are more stringent than third class — vision must be correctable to 20/20, and near vision standards also apply.</p>

        <h3>First-Class Medical</h3>
        <p>Airline Transport Pilots (ATP) require a first-class medical. It's valid for 12 calendar months if you're under 40, and 6 calendar months if 40 or older (for ATP operations). First-class has the most stringent requirements: 20/20 distance vision, additional near and intermediate vision standards, EKG requirements after age 35, and stricter cardiovascular standards overall.</p>

        <h2>BasicMed — the alternative for private pilots</h2>
        <p>In 2017, the FAA introduced BasicMed as a simplified alternative to the third-class medical for private pilots. Under BasicMed, you can fly without a formal FAA medical exam if you meet these conditions:</p>
        <ul>
          <li>You held a valid FAA medical certificate at any point after July 14, 2006</li>
          <li>You have a physical exam with any state-licensed physician and complete the AOPA online course</li>
          <li>You fly a U.S.-registered, non-pressurized aircraft (under 6,000 lbs, max 6 passengers)</li>
          <li>You fly within the U.S., below 18,000 feet MSL, at speeds under 250 knots indicated</li>
          <li>You're not flying for compensation or hire</li>
        </ul>
        <p>BasicMed is valid for 48 calendar months and requires a new physician exam and online course each cycle. It's a popular option for recreational private pilots who want to avoid the FAA AME process.</p>

        <h2>How to get your FAA medical</h2>
        <p>FAA medical exams are conducted by Aviation Medical Examiners (AMEs) — physicians specifically designated by the FAA. You don't go to your regular doctor for this; you find an AME. The FAA has a lookup tool at <strong>medxpress.faa.gov</strong> where you also complete your application before the appointment.</p>
        <p>The exam itself covers vision, hearing, blood pressure, and a general physical. It's not a full annual physical — AMEs are trained to evaluate aviation-specific concerns. For a third-class medical with no complicated history, it typically takes 20–30 minutes.</p>
        <p>Common conditions that may require special issuance (SI) include: hypertension on medication, well-controlled Type 2 diabetes (now routinely approved for third-class), history of kidney stones, some psychiatric conditions treated with approved medications, and cardiac conditions. Special issuance takes longer — weeks to months — and requires documentation from treating physicians. But many conditions that disqualified pilots a decade ago are now approvable.</p>

        <h2>The question everyone is afraid to ask</h2>
        <p>The most common concern is mental health history. The FAA has historically been strict about psychiatric diagnoses and certain medications, which caused many pilots to avoid seeking treatment. Policy has evolved. The FAA now has a pathway for pilots on SSRIs for depression — it requires a period of stability on the medication and FAA review, but it's not an automatic disqualifier.</p>
        <p>If you have a condition you're unsure about, the right move is to consult with an Aviation Medical Examiner before applying, or contact AOPA's Medical Services team. Going in informed is far better than getting denied and then having to navigate the appeal process.</p>

        <h2>What this means for the FAA written exam</h2>
        <p>The knowledge test doesn't require a medical certificate — you can study and take the written exam before you have your medical. But you cannot solo (and therefore cannot complete flight training for a private pilot certificate) without one. Sort out the medical early, especially if you have any conditions that might need special issuance. The last thing you want is to be a week from solo and discover a problem that takes six months to resolve.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-to-read-a-taf': {
    title: 'How to Read a TAF (Terminal Aerodrome Forecast)',
    description: 'TAFs are aviation weather forecasts that show up on FAA knowledge tests — especially for instrument rating. Here\'s how to decode one field by field, with a real example.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/blog-metar.webp',
    related: ['how-to-read-a-metar', 'faa-instrument-rating-written-test-study-tips-2026', 'instrument-rating-knowledge-test-tips'],
    content: (
      <>
        <p>If you've already learned to read a METAR, a TAF is the logical next step. METARs tell you current conditions. TAFs tell you what's forecast — and they use very similar language. For the Instrument Rating knowledge test especially, TAF questions are common. Private Pilot and Part 107 exams also touch on them.</p>
        <p>Here's how to decode a TAF from scratch.</p>

        <h2>What is a TAF?</h2>
        <p>A TAF is a Terminal Aerodrome Forecast — a weather forecast for conditions within 5 statute miles of a specific airport. TAFs are issued four times daily by the National Weather Service (at 0000, 0600, 1200, and 1800 UTC) and cover a 24- or 30-hour period. They're the official forecast pilots use for flight planning.</p>
        <p>TAFs are only issued for airports with instrument approaches that have enough traffic to warrant them. Small rural airports may not have a TAF — you rely on METARs and area forecasts instead.</p>

        <h2>A real TAF, decoded</h2>
        <p style={{fontFamily:'monospace', background:'var(--card-bg)', padding:'12px 16px', borderRadius:8, fontSize:'.85rem', overflowX:'auto', display:'block', marginBottom:20, lineHeight:1.8}}>
          TAF KDEN 041720Z 041818 27012KT 9999 FEW040 SCT100<br/>
          TEMPO 1820 27018G28KT 6SM -TSRA SCT030CB BKN080<br/>
          FM2100 28008KT 9999 SCT060<br/>
          FM0300 30004KT 9999 SKC
        </p>

        <h3>TAF KDEN</h3>
        <p>Report type and station. TAF for Denver International (KDEN).</p>

        <h3>041720Z</h3>
        <p>Issuance time. Day 04 of the month, issued at 1720 Zulu. Always UTC.</p>

        <h3>041818</h3>
        <p>Validity period. Day 04 from 1800Z to day 05 at 1800Z — a 24-hour forecast. Written as DDHH/DDHH or just DDHHHH depending on format. The forecast begins at the first time and ends at the second.</p>

        <h3>27012KT 9999 FEW040 SCT100</h3>
        <p>The initial conditions — wind, visibility, sky. Same format as a METAR. Wind 270° at 12 knots. 9999 = visibility greater than 9 km (or in US TAFs, more than 6 SM — 9999 means unrestricted). FEW clouds at 4,000 ft, scattered at 10,000 ft. These are the forecast conditions at the start of the valid period.</p>

        <h3>TEMPO 1820</h3>
        <p>TEMPO means temporary — conditions expected to last less than half the time during the specified period and for less than 60 minutes at a time. "1820" means from 1800Z to 2000Z. During that window, temporarily expect: 27018G28KT (wind 270° at 18, gusting 28), 6SM visibility, -TSRA (light thunderstorm with rain), SCT030CB (scattered cumulonimbus at 3,000 ft), BKN080 (broken at 8,000 ft).</p>
        <p>CB after a cloud layer code always means cumulonimbus — a thunderstorm. That's significant and testable. Cumulonimbus layers are always a ceiling concern and a significant weather flag regardless of coverage.</p>

        <h3>FM2100</h3>
        <p>FM means "from" — a permanent change in conditions starting at the specified time. FM2100 means at 2100Z, conditions change to: 28008KT (lighter wind), 9999 visibility, SCT060. After 2100Z, the TEMPO conditions are gone and this is the new baseline.</p>
        <p>FM groups always replace everything before them — wind, visibility, clouds — with the new forecast. They're not temporary or conditional.</p>

        <h3>FM0300</h3>
        <p>Another "from" group starting at 0300Z (overnight). Wind 300° at 4 knots, unlimited visibility, SKC (sky clear). Nice overnight conditions forecast.</p>

        <h2>The other change indicators</h2>
        <p>Beyond TEMPO and FM, TAFs use a couple other change group types:</p>
        <ul>
          <li><strong>BECMG (becoming)</strong> — a gradual change expected to occur within the specified time window and then persist. Unlike TEMPO, BECMG changes are permanent once they occur.</li>
          <li><strong>PROB30 / PROB40</strong> — 30% or 40% probability of the conditions listed. PROB30 means there's a 30% chance of the following conditions during that period. PROB40 is more likely. You won't see PROB in most basic exam questions but it appears on instrument rating material.</li>
        </ul>

        <h2>Visibility in US TAFs</h2>
        <p>US TAFs use statute miles for visibility, consistent with METARs. International TAFs (ICAO format) use meters — so 9999 means visibility greater than 9,999 meters (essentially unlimited), while US format might write P6SM (plus 6 statute miles). Know which format your exam question is using.</p>

        <h2>What the IRA exam actually asks</h2>
        <p>Instrument rating TAF questions are usually one of these:</p>
        <ul>
          <li>At a given time, what are the forecast conditions? — Find the right FM or TEMPO group that applies at that hour.</li>
          <li>Is the airport forecast to be above or below alternate minimums at a given time?</li>
          <li>What does this change group indicator (TEMPO, BECMG, FM) mean?</li>
          <li>What is the ceiling during this TEMPO period?</li>
        </ul>
        <p>The biggest mistake is misreading which time group is active. If a question asks about conditions at 2200Z in the example above, that's after FM2100 — so you use the FM2100 conditions, not the TEMPO 1820 conditions (which ended at 2000Z). Work through the timeline carefully.</p>

        <h2>TAF vs METAR — the key difference</h2>
        <p>A METAR is observed reality. A TAF is a forecast. Pilots use both: the METAR to see what conditions actually are right now, and the TAF to see what's expected during their flight. For IFR flight planning, the TAF at the destination and alternate airports is required reading before departure.</p>
        <p>If you can read a METAR, a TAF takes maybe an hour to get comfortable with. The format is similar, the abbreviations are the same, and the main new skill is understanding the change group indicators and how to determine which group applies at any given time.</p>
      </>
    ),
  },

  /* ================================================================ */
  'vfr-cross-country-flight-planning': {
    title: 'VFR Cross-Country Flight Planning: What the FAA Expects You to Know',
    description: 'Cross-country flight planning is a core private pilot skill — and a common knowledge test topic. Here\'s how to plan a VFR cross-country by the book, including fuel, weather, and filing.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/private-pilot-faa-knowledge-test-prep.jpg',
    related: ['how-to-read-a-metar', 'how-to-read-a-sectional-chart', 'faa-airspace-classes-explained'],
    content: (
      <>
        <p>Cross-country flight planning is one of the core skills the FAA expects a private pilot to have. It's tested on the PAR knowledge exam, it's a required training element, and it's a major part of the practical test (checkride). Understanding the planning process isn't just about passing the written — it's foundational to actually flying anywhere beyond the pattern.</p>
        <p>Here's what cross-country planning involves and what the exam focuses on.</p>

        <h2>What counts as a cross-country flight</h2>
        <p>For FAA purposes, a cross-country flight is one that includes a point of landing more than 50 nautical miles from the departure airport. This matters for logging time that counts toward certificate requirements. For the solo cross-country required for a private certificate, the route must include a landing more than 50 NM from the departure point.</p>
        <p>Note that some short cross-countries (any flight to another airport and back, even nearby) can log cross-country time — but only flights exceeding 50 NM count toward the specific requirements in FAR 61.109.</p>

        <h2>Step 1: Route planning</h2>
        <p>Start with a sectional chart and identify your departure and destination airports. Then plan your route — which may be direct or may follow landmarks, airways, or airspace-friendly corridors depending on what's in the way.</p>
        <p>VFR pilots navigate using pilotage (visual landmarks), dead reckoning (calculating position based on heading, speed, and time), or GPS. The FAA expects private pilot students to know pilotage and dead reckoning even if they'll use GPS in practice.</p>
        <p>Draw your course line on the chart. Measure the total distance in nautical miles. Identify checkpoints along the route — identifiable landmarks (roads, rivers, towns, towers) you'll look for at regular intervals to confirm you're on course.</p>

        <h2>Step 2: True course to magnetic heading</h2>
        <p>The course you drew on the chart is the <strong>true course</strong> — measured from true north. But your compass reads magnetic north, and your aircraft is affected by wind. You need to correct for both.</p>
        <p>The mnemonic is <strong>TVMDC</strong> — True, Variation, Magnetic, Deviation, Compass:</p>
        <ol>
          <li><strong>True course</strong> from the chart</li>
          <li>Apply <strong>variation</strong> (magnetic declination from the sectional chart isogonic lines). East variation, subtract; West variation, add. "East is least, West is best."</li>
          <li>Result is your <strong>magnetic course</strong></li>
          <li>Apply <strong>deviation</strong> (your specific compass error from the compass correction card in your aircraft)</li>
          <li>Result is your <strong>compass heading</strong></li>
        </ol>
        <p>Then apply <strong>wind correction angle (WCA)</strong> to get your actual magnetic heading to fly. Wind pushes the aircraft off course — you crab into the wind to maintain your desired track. The E-6B flight computer calculates this.</p>

        <h2>Step 3: Time en route and fuel</h2>
        <p>Divide distance by groundspeed (true airspeed corrected for wind) to get time en route. Your E-6B handles this with the wind side.</p>
        <p>Fuel planning: multiply fuel burn rate (from the POH, in gallons per hour) by time en route. FAR 91.151 requires VFR flights to carry enough fuel to reach the first intended landing plus 30 minutes reserve during the day (45 minutes at night).</p>
        <p>On the exam, fuel questions often test whether you know the reserve requirements and whether you can calculate whether a given fuel load is legal. Always plan with the actual fuel consumption from cruise performance tables — don't assume a round number.</p>

        <h2>Step 4: Weather</h2>
        <p>Before any cross-country, you need a proper weather briefing. The official source is <strong>1800wxbrief.com</strong> or calling Flight Service (1-800-WX-BRIEF). A standard briefing covers:</p>
        <ul>
          <li>Adverse conditions (TFRs, SIGMETs, AIRMETs, PIREPs)</li>
          <li>VFR flight not recommended (VNR) advisory if applicable</li>
          <li>Synopsis (big picture weather)</li>
          <li>Current conditions (METARs along the route)</li>
          <li>En route forecast (winds aloft, AIRMETs)</li>
          <li>Destination forecast (TAF)</li>
          <li>NOTAMs</li>
        </ul>
        <p>VFR minimums in controlled airspace: 3 SM visibility and 500 below / 1,000 above / 2,000 horizontal from clouds. In Class G below 1,200 AGL during the day: 1 SM, clear of clouds. Know these — weather minimums are a staple exam topic.</p>

        <h2>Step 5: Filing a VFR flight plan</h2>
        <p>VFR flight plans are not required by the FAA — they're voluntary. But they're strongly recommended for cross-country flights because they activate search and rescue if you don't close the plan after landing. File with Flight Service (1800wxbrief.com or by phone).</p>
        <p>A VFR flight plan includes: aircraft identification, type and equipment, true airspeed, departure airport and time, cruising altitude, route, destination, estimated time en route, remarks, fuel on board, alternate airport, and pilot contact information.</p>
        <p>Important: if you file a flight plan, you must open it (call Flight Service or activate via radio) after departure, and you must <strong>close it after landing</strong>. Failing to close triggers search and rescue operations. This is testable.</p>

        <h2>The E-6B flight computer</h2>
        <p>The E-6B — or its electronic equivalent — is the tool that ties everything together for cross-country planning. It calculates:</p>
        <ul>
          <li>Wind correction angle and groundspeed (wind triangle)</li>
          <li>Time, speed, distance conversions</li>
          <li>Fuel calculations</li>
          <li>Density altitude</li>
          <li>True airspeed from indicated airspeed, altitude, and temperature</li>
        </ul>
        <p>The FAA written exam allows you to use an E-6B or flight computer — either the physical circular slide rule or an approved electronic version. Know how to use it for wind problems and fuel calculations. Those question types are common and calculator-dependent.</p>

        <h2>What the exam focuses on</h2>
        <p>PAR cross-country questions typically cover: fuel reserve requirements (30/45 minutes), the TVMDC conversion, reading winds aloft forecasts, whether a given weather briefing supports VFR flight, and flight plan content and procedures. Master those and you'll handle this section of the exam cleanly.</p>
      </>
    ),
  },

  /* ================================================================ */
  'what-is-density-altitude': {
    title: 'What Is Density Altitude? (And Why It Kills Aircraft Performance)',
    description: 'Density altitude is one of the most tested concepts on every FAA knowledge exam. Here\'s what it actually means, how to calculate it, and why it matters for safe flight.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['faa-airspace-classes-explained', 'how-to-read-a-metar', 'how-to-pass-faa-written-exam-first-try'],
    content: (
      <>
        <p>Density altitude shows up on the Private Pilot, Commercial Pilot, Instrument Rating, and Part 107 knowledge tests. It's also one of the most practically important concepts in flying — high density altitude has killed pilots who didn't take it seriously. Understanding it is worth your time both for the exam and for actually operating an aircraft.</p>

        <h2>Start with pressure altitude</h2>
        <p>Before density altitude makes sense, you need pressure altitude. Pressure altitude is what your altimeter reads when you set it to 29.92 in Hg (the standard day sea level pressure). It tells you where you are in the standard atmosphere — not your height above the ground, but your position in the pressure column.</p>
        <p>An airport at 5,000 feet elevation has a pressure altitude of roughly 5,000 feet on a standard day. But temperature throws everything off.</p>

        <h2>What density altitude actually means</h2>
        <p>Density altitude is pressure altitude corrected for non-standard temperature. It answers one specific question: <strong>how does the air here perform compared to standard sea-level air?</strong></p>
        <p>Standard atmosphere at sea level is 59°F (15°C) and 29.92 in Hg. When it's hotter than standard, the air is less dense. When it's colder, the air is denser. Humidity also reduces air density slightly, though temperature is the dominant factor on the exam.</p>
        <p>If your airport is at 5,000 feet pressure altitude and the temperature is 95°F — a hot summer day in Denver — your density altitude might be 8,000 or 9,000 feet. The air feels like you're at 8,000–9,000 feet to your engine, your propeller, and your wings, even though you're physically at 5,000 feet.</p>

        <h2>Why high density altitude is dangerous</h2>
        <p>Everything that depends on air density degrades at high density altitude:</p>
        <ul>
          <li><strong>Engine power</strong> — naturally aspirated (non-turbocharged) piston engines lose roughly 3% of power per 1,000 feet of density altitude. At 8,000 feet density altitude, you might have only 75% of sea-level power.</li>
          <li><strong>Propeller efficiency</strong> — the prop is an airfoil generating thrust. Thin air means less thrust for the same RPM.</li>
          <li><strong>Lift</strong> — wings generate lift by accelerating air. Less dense air means you need more speed to generate the same lift. Takeoff roll gets longer. Climb rate drops.</li>
        </ul>
        <p>Put those three together on a short runway on a hot afternoon at a mountain airport, and you have an accident waiting to happen. Density altitude accidents are not rare. Aircraft that perform fine on a cool morning at a sea-level airport have crashed trying to take off from high-elevation strips on hot days, fully loaded.</p>

        <h2>How to calculate density altitude</h2>
        <p>The FAA exam will either give you a density altitude chart (E-6B or the performance chart in the POH) or ask you to use a rule of thumb. Here's what you need to know:</p>
        <p><strong>Rule of thumb:</strong> For every 13°C (or roughly 23°F) that temperature exceeds standard, density altitude increases by about 1,000 feet above pressure altitude.</p>
        <p>Standard temperature decreases 2°C per 1,000 feet as you climb. Standard temp at sea level is 15°C. At 5,000 feet it's 5°C. At 10,000 feet it's -5°C.</p>
        <p>So if you're at a 5,000-foot airport and the temperature is 30°C, you're 25°C above standard (30 − 5 = 25°C deviation). 25 ÷ 13 ≈ 1.9 — so density altitude is roughly 5,000 + 1,900 = <strong>~6,900 feet</strong>.</p>
        <p>On the exam, you'll usually be given a density altitude chart or an E-6B flight computer and asked to read the answer directly. The math is just for building intuition.</p>

        <h2>The formula the FAA uses</h2>
        <p>The formal calculation: <strong>Density Altitude = Pressure Altitude + (120 × (OAT − ISA Temp))</strong></p>
        <p>Where OAT is outside air temperature in °C and ISA Temp is standard temperature at that altitude (15°C − 2°C per 1,000 ft).</p>
        <p>Example: pressure altitude 6,000 ft, OAT 25°C. ISA temp at 6,000 ft = 15 − 12 = 3°C. Deviation = 25 − 3 = 22°C. DA = 6,000 + (120 × 22) = 6,000 + 2,640 = <strong>8,640 ft</strong>.</p>

        <h2>What the FAA exam actually asks</h2>
        <p>Density altitude questions come in a few flavors:</p>
        <ul>
          <li>Given conditions (elevation, temp, altimeter setting), what is the density altitude? — Usually solved with a provided chart.</li>
          <li>Which conditions produce the highest density altitude? — Hot, humid, high elevation. The answer is always the one with the highest temp and elevation.</li>
          <li>How does density altitude affect performance? — Always negative. Higher DA = longer takeoff roll, lower climb rate, longer landing distance.</li>
          <li>What is the standard temperature at a given altitude? — Memorize: 15°C at sea level, −2°C per 1,000 ft.</li>
        </ul>
        <p>Part 107 questions tend to be conceptual (does density altitude affect drone performance?). Yes — battery efficiency and prop thrust both degrade. Private Pilot and Commercial questions are more likely to involve performance charts.</p>

        <h2>The one thing to remember</h2>
        <p>Hot + high + humid = high density altitude = poor performance. If you remember nothing else from this topic, remember that. The exam will give you a scenario and ask you to evaluate performance — the answer is always that high density altitude makes everything worse: longer takeoff, lower climb, longer landing.</p>
        <p>It's also one of the few topics where understanding the concept genuinely makes you a safer pilot, not just a test-passer. The accidents are real and preventable.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-to-read-a-sectional-chart': {
    title: 'How to Read a Sectional Chart: A Pilot\'s Guide',
    description: 'Sectional aeronautical charts are on every FAA knowledge test. Here\'s how to read the symbols, airspace boundaries, airport data, and terrain features you\'ll actually be tested on.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '9 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['faa-airspace-classes-explained', 'how-to-read-a-metar', 'part-107-drone-test-study-guide'],
    content: (
      <>
        <p>Sectional aeronautical charts — "sectionals" — are the road maps of the air. They show terrain, airports, airspace boundaries, navigation aids, obstacles, and a lot more. They're also a significant part of every FAA knowledge test. Private Pilot, Instrument Rating, Commercial, and Part 107 exams all include sectional chart questions.</p>
        <p>Reading a sectional is a skill, not trivia. Once you understand the symbology, you can decode it quickly. Here's what you need to know for the exam.</p>

        <h2>Scale and what you're looking at</h2>
        <p>Sectionals are drawn at a scale of 1:500,000 — one inch on the chart equals roughly 8 statute miles on the ground. They're updated every 56 days because airspace changes frequently. Always use a current chart. On the test, charts are provided for you.</p>
        <p>The chart is dense. The key — the legend — explains every symbol used. Your exam will provide chart supplement excerpts and the legend. Learning the most common symbols means you won't have to look everything up mid-question.</p>

        <h2>Airports</h2>
        <p>Airports are shown as circles (for non-towered) or circles with a dot in the center (controlled/towered). Color matters:</p>
        <ul>
          <li><strong>Blue</strong> — airports with an operating control tower</li>
          <li><strong>Magenta</strong> — non-towered airports</li>
        </ul>
        <p>Next to each airport symbol is a data block. It typically shows: airport name, identifier, field elevation, length of longest runway (in hundreds of feet), and lighting availability. A small "L" means the runway has pilot-controlled lighting available at night. A star means it has a beacon.</p>
        <p>The tick marks around the circle indicate runway configuration — each tick is a runway. A circle with one horizontal tick is a single runway aligned east-west. Two perpendicular ticks means two runways.</p>

        <h2>Airspace — the most tested part</h2>
        <p>Airspace is where most exam questions live. Here's how each class looks on the chart:</p>
        <ul>
          <li><strong>Class B</strong> — solid blue lines forming concentric rings (the wedding cake). Altitudes written as ceiling/floor (e.g., 100/SFC means from the surface to 10,000 feet MSL).</li>
          <li><strong>Class C</strong> — solid magenta lines forming two concentric circles. Same altitude notation.</li>
          <li><strong>Class D</strong> — dashed blue circle around the airport. Extends from the surface to usually 2,500 AGL. If no ceiling is shown, it's the default.</li>
          <li><strong>Class E starting at 700 AGL</strong> — magenta vignette (fuzzy, shaded circle) around smaller airports. This protects instrument approaches.</li>
          <li><strong>Class E starting at 1,200 AGL</strong> — no special marking. It's the default over most of the country.</li>
          <li><strong>Class E to the surface</strong> — dashed magenta circle. Similar to Class D in appearance but no tower.</li>
        </ul>
        <p>The difference between a dashed blue circle (Class D) and a dashed magenta circle (Class E to the surface) is one of the most common trick questions on the exam. Blue = controlled, towered airport. Magenta = non-towered with instrument approaches.</p>

        <h2>Special use airspace</h2>
        <p>Special use airspace is shown with hashed outlines and labeled with a code:</p>
        <ul>
          <li><strong>P-</strong> followed by a number = Prohibited area. No flight, period.</li>
          <li><strong>R-</strong> followed by a number = Restricted area. Check if active before entering.</li>
          <li><strong>W-</strong> followed by a number = Warning area. Over international waters. Not legally prohibited but dangerous.</li>
          <li><strong>MOA</strong> — Military Operations Area. Labeled by name. VFR legal but proceed with caution when active.</li>
          <li><strong>A-</strong> followed by a number = Alert area. High volume of flight training. No ATC service, but expect traffic.</li>
        </ul>
        <p>The chart legend in your exam supplement lists all active special use areas with their altitudes and hours of operation. For restricted areas, you look for the notation of whether they're "continuous" (always hot) or have hours, and sometimes an ATC frequency to request entry.</p>

        <h2>Terrain and obstacles</h2>
        <p>Terrain is shown with contour lines and color shading — warmer browns and reds are higher elevation, greens are lower. Maximum elevation figures (MEFs) are printed in large digits in each latitude/longitude quadrant. They represent the highest obstacle or terrain in that area, rounded up to the next 100 feet. MEF is your quick reference for "what's the highest thing here I need to clear?"</p>
        <p>Obstacles are shown as symbols with height data next to them:</p>
        <ul>
          <li>A small tower symbol with two numbers — the top number is MSL elevation, the bottom (in parentheses) is AGL height</li>
          <li>Groups of obstacles are shown with a "double tower" symbol</li>
          <li>High-intensity lights on tall towers are marked with a lightning bolt on the symbol</li>
        </ul>
        <p>Under controlled flight, you need to know MSL heights (to compare to your altimeter reading). When operating visually at low altitude, the AGL height is what tells you how far you need to stay away from the top.</p>

        <h2>Navigation aids</h2>
        <p>VORs (VHF Omnidirectional Range stations) appear as a compass rose with a hexagon at the center. The compass rose shows magnetic north and is oriented to match local magnetic variation. Frequency and identifier are printed next to it. You'll use this to tune your nav radio.</p>
        <p>NDBs (Non-Directional Beacons) appear as a circle with dots. Less common in modern training but still on the exam.</p>
        <p>Victor airways — the low-altitude IFR highways — are shown as blue lines connecting VORs. They're identified with a "V" and a number (V23, V105, etc.). MEAs (minimum en route altitudes) are printed along the airways.</p>

        <h2>The numbers game: what exam questions actually ask</h2>
        <p>Sectional questions on the FAA exam tend to fall into these categories:</p>
        <ul>
          <li><strong>What class of airspace is this point in?</strong> — Identify the boundary lines and their colors.</li>
          <li><strong>What are the altitude limits of this airspace?</strong> — Read the ceiling/floor notation.</li>
          <li><strong>Do you need a clearance/radio/transponder to fly here?</strong> — Apply the class rules to the airspace identified.</li>
          <li><strong>What is the MEF in this quadrant?</strong> — Read the large number printed in the grid square.</li>
          <li><strong>What is the elevation of this airport?</strong> — Read the data block.</li>
          <li><strong>Is there an operating control tower?</strong> — Blue = yes, magenta = no.</li>
          <li><strong>What special use airspace is this?</strong> — Identify the hashed boundary and prefix letter.</li>
        </ul>

        <h2>How to study sectional chart questions</h2>
        <p>The FAA publishes the actual sectional chart excerpts used in the test supplement. Practice looking at the chart figures in the test supplement and working through sample questions that reference them. The worst way to study this is memorizing abstract descriptions — you need to actually look at charts.</p>
        <p>Most practice question platforms show the chart excerpt alongside the question so you can see exactly what's being asked. Work through enough of those and the symbology becomes automatic. The goal is to be able to look at any point on a sectional and immediately identify the airspace class, floor, ceiling, and whether you can enter it VFR without calling anyone.</p>
      </>
    ),
  },

  /* ================================================================ */
  'faa-airspace-classes-explained': {
    title: 'FAA Airspace Classes Explained: A Plain-English Guide',
    description: 'Class A through G — what each one means, who can fly there, what you need, and why it matters for the FAA written exam. No jargon, real examples.',
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '8 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['how-to-read-a-metar', 'how-to-pass-faa-written-exam-first-try', 'part-107-drone-test-study-guide'],
    content: (
      <>
        <p>Airspace is one of those topics that looks intimidating on the sectional chart and turns out to be pretty logical once someone explains it clearly. There are seven classes — A through G — and each one has specific rules about who can fly there, what equipment you need, and what kind of clearance or communication is required.</p>
        <p>This comes up on every FAA knowledge test. Private pilot, instrument rating, commercial, Part 107 — all of them have airspace questions. Here's how it actually works.</p>

        <h2>The basic idea</h2>
        <p>Airspace exists to separate aircraft and keep everyone safe. The classes are organized roughly by how busy and complex the environment is. Class A is the high-altitude stuff above 18,000 feet where everybody is on instruments. Class G is the loose, uncontrolled airspace close to the ground in rural areas. Everything between them has progressively more structure.</p>
        <p>Each class has three things that matter: who controls it (ATC or nobody), what you need to enter (clearance, two-way radio, a transponder), and what weather minimums apply (visibility and cloud clearance requirements).</p>

        <h2>Class A — High altitude, IFR only</h2>
        <p>Class A starts at 18,000 feet MSL and goes up to FL600 (60,000 feet). You cannot fly VFR in Class A. Period. Everyone is on an IFR flight plan, talking to ATC, operating on assigned altitudes. You need an instrument rating, an IFR clearance, and Mode C transponder. There are no VFR weather minimums for Class A because VFR is simply not allowed.</p>
        <p>Most private pilot students don't spend much time on Class A because they'll never fly there — but the exam expects you to know what it is and what it requires.</p>

        <h2>Class B — The busiest airports</h2>
        <p>Class B airspace surrounds the nation's busiest airports — places like LAX, JFK, O'Hare, Atlanta. It looks like an upside-down wedding cake on the sectional chart: a series of concentric rings stacked on top of each other, each with defined floor and ceiling altitudes. The inner ring goes all the way to the surface.</p>
        <p>To enter Class B you need an explicit ATC clearance — "cleared into the Bravo" — not just radio contact. You also need a Mode C transponder and a private pilot certificate (student pilots need a specific endorsement). VFR weather minimums inside Class B are 3 SM visibility and clear of clouds. That last part isn't a typo: inside Class B you just need to stay clear of clouds, not a specific distance away from them.</p>

        <h2>Class C — Busy but not the busiest</h2>
        <p>Class C surrounds airports with an operating control tower, radar approach control, and a certain level of scheduled airline service. Think mid-size cities — Portland, Providence, Tucson. It's a two-ring structure: the inner circle (5 NM radius, surface to 4,000 AGL) and the outer circle (10 NM radius, 1,200 to 4,000 AGL).</p>
        <p>To enter Class C, you need two-way radio communication established before entry — you don't need an explicit clearance like Class B, just contact. ATC has to respond with your call sign. If they say "N12345, standby," that counts as contact. If they say "aircraft calling, standby," it doesn't — your call sign wasn't acknowledged. Mode C transponder required. VFR minimums are 3 SM visibility, 500 below / 1,000 above / 2,000 horizontal from clouds.</p>

        <h2>Class D — Towered airports</h2>
        <p>Class D airspace surrounds airports with an operating control tower that aren't Class B or C. It typically extends from the surface to 2,500 feet AGL and about 4 NM around the airport. The shape on the sectional is a dashed blue circle.</p>
        <p>To enter Class D, you need two-way radio communication established before entry. Same rule as Class C — your call sign has to be acknowledged. No transponder requirement under Class D alone (though Mode C is required within 30 NM of Class B airports). VFR minimums are 3 SM visibility, 500 below / 1,000 above / 2,000 horizontal from clouds.</p>
        <p>When the tower closes, Class D airspace either reverts to Class E or Class G depending on the airport. Always check the Chart Supplement for hours.</p>

        <h2>Class E — Controlled but not a specific airport</h2>
        <p>Class E is the most complicated class to understand because it appears in several different ways. It's controlled airspace that isn't A, B, C, or D. Most of the airspace in the US where IFR traffic operates is Class E.</p>
        <p>Class E can start at different altitudes depending on where you are:</p>
        <ul>
          <li><strong>700 feet AGL</strong> — shown by a magenta vignette (fading circle) on the sectional. This exists around many non-towered airports to protect instrument approaches.</li>
          <li><strong>1,200 feet AGL</strong> — the default over most of the US where there's no other designation.</li>
          <li><strong>Surface</strong> — shown by a dashed magenta circle. This exists at airports with instrument approaches but no operating tower.</li>
          <li><strong>14,500 feet MSL</strong> — Class E starts at 14,500 nationwide where there's no other class above it, up to 18,000 (where Class A begins).</li>
        </ul>
        <p>No ATC clearance or radio communication required for VFR flight in Class E. VFR minimums depend on altitude: below 10,000 MSL, it's 3 SM and 500 below / 1,000 above / 2,000 horizontal. At or above 10,000 MSL, minimums jump to 5 SM and 1,000 below / 1,000 above / 1 SM horizontal.</p>

        <h2>Class G — Uncontrolled</h2>
        <p>Class G is uncontrolled airspace. ATC has no authority here and doesn't provide traffic separation. It exists from the surface up to the floor of Class E above it — typically 700 or 1,200 feet AGL, sometimes higher in remote areas.</p>
        <p>No communication required, no clearance, no transponder required by the airspace itself. VFR minimums are the most relaxed:</p>
        <ul>
          <li>Day, below 1,200 AGL: 1 SM visibility, clear of clouds</li>
          <li>Night, below 1,200 AGL: 3 SM visibility, 500/1,000/2,000 cloud clearance</li>
          <li>Above 1,200 AGL but below 10,000 MSL: 1 SM day (clear of clouds), 3 SM night with standard cloud clearances</li>
        </ul>
        <p>The "1 SM, clear of clouds" minimums for Class G during the day are the most permissive in the system. That's the specific condition where a private pilot can legally be in 1 SM visibility just staying clear of clouds — no distances required.</p>

        <h2>Special use airspace</h2>
        <p>Beyond the lettered classes, the sectional shows special use airspace that has its own restrictions:</p>
        <ul>
          <li><strong>Prohibited areas</strong> (P-) — flight not permitted. Camp David, the White House airspace. Hard no.</li>
          <li><strong>Restricted areas</strong> (R-) — flight restricted when active. Often military operations, artillery ranges, missile testing. Check NOTAMs to see if they're "hot."</li>
          <li><strong>Warning areas</strong> (W-) — similar to restricted but over international waters, so the FAA can't legally prohibit flight. Still dangerous. Avoid unless you know what's there.</li>
          <li><strong>Military operations areas</strong> (MOAs) — military flight training. VFR pilots can legally fly through, but you're mixing with fast military aircraft doing unpredictable things. Check if it's active first.</li>
          <li><strong>Alert areas</strong> (A-) — high volume of pilot training or unusual aerial activity. No restrictions but proceed with extreme caution.</li>
        </ul>

        <h2>The quick reference for the exam</h2>
        <div style={{ overflowX: 'auto', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '.88rem' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)', textAlign: 'left' }}>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Class</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Entry requirement</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>Transponder</th>
              <th style={{ padding: '10px 12px', color: 'var(--text)' }}>VFR visibility</th>
            </tr></thead>
            <tbody>
              {[
                ['A','IFR clearance required','Mode C','N/A (IFR only)'],
                ['B','ATC clearance ("cleared into the Bravo")','Mode C','3 SM, clear of clouds'],
                ['C','Two-way radio contact (call sign acknowledged)','Mode C','3 SM, 500/1,000/2,000'],
                ['D','Two-way radio contact (call sign acknowledged)','None required','3 SM, 500/1,000/2,000'],
                ['E','None for VFR','None required (below 10k)','3 SM, 500/1,000/2,000 (below 10k)'],
                ['G','None','None required','1 SM day (clear of clouds) / 3 SM night'],
              ].map(([cls,entry,xpdr,vis],i)=>(
                <tr key={i} style={{ borderBottom:'1px solid var(--border)', background: i%2===0?'var(--card-bg)':'transparent' }}>
                  <td style={{ padding:'9px 12px', fontWeight:700, color:'var(--text)' }}>{cls}</td>
                  <td style={{ padding:'9px 12px', color:'var(--text2)', fontSize:'.85rem' }}>{entry}</td>
                  <td style={{ padding:'9px 12px', color:'var(--text2)', fontSize:'.85rem' }}>{xpdr}</td>
                  <td style={{ padding:'9px 12px', color:'var(--text2)', fontSize:'.85rem' }}>{vis}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>The thing that trips people up on the exam</h2>
        <p>The most common mistake on airspace questions isn't mixing up Class C and D — it's getting the weather minimums wrong for Class G. The "clear of clouds" rule only applies during the day, below 1,200 AGL. At night or above 1,200 AGL, normal cloud distances apply. Read the question carefully for time of day and altitude.</p>
        <p>The other trap is Class B entry. Students often think radio contact is enough — it isn't. You need an explicit clearance. "N12345 standby" from ATC is contact, not clearance. You cannot enter Class B until they say you're cleared in.</p>
        <p>Study the sectional chart symbols for each class alongside the rules. The visual and the regulation reinforce each other, and you'll see both on the exam.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-to-schedule-faa-written-exam': {
    title: 'How to Schedule Your FAA Written Exam (Step by Step)',
    description: "Scheduling the FAA knowledge test is straightforward once you know where to go. Here's exactly how to register, find a testing center, and what to bring on test day.",
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '5 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
    related: ['faa-written-exam-questions-score-tips', 'how-to-pass-faa-written-exam-first-try', 'how-long-to-study-for-faa-written-exam'],
    content: (
      <>
        <p>The process of actually registering for the FAA Airman Knowledge Test trips people up more than it should. There are a few steps, a couple of gotchas, and one number you need before you can book anything. Here's the exact process.</p>

        <h2>Step 1: Get your IACRA account (if you don't have one)</h2>
        <p>IACRA stands for Integrated Airman Certification and Rating Application — it's the FAA's online system for pilot applications. You'll eventually use it to apply for your certificate, but you also need a FTN (FAA Tracking Number) from it to register for the knowledge test.</p>
        <p>Go to <strong>iacra.faa.gov</strong>, create an account, and your FTN is assigned automatically. It's a short alphanumeric code that lives in your profile. Write it down. You'll need it when you book the exam.</p>
        <p>Important: if you already have an IACRA account from a previous FAA application, use that account — don't create a new one. Duplicate accounts cause headaches.</p>

        <h2>Step 2: Pick a testing provider</h2>
        <p>The FAA authorizes two testing companies to administer Airman Knowledge Tests:</p>
        <ul>
          <li><strong>PSI Exams</strong> — psiexams.com</li>
          <li><strong>CATS (Computer Assisted Testing Service)</strong> — no longer a separate entity; CATS test centers now operate under PSI</li>
        </ul>
        <p>In practice: almost all FAA knowledge tests are scheduled through PSI. Go to <strong>psiexams.com</strong>, search for FAA Airman Knowledge Tests, and find a location near you. There are testing centers across the country — most mid-size cities have at least one, often inside an aviation school, FBO, or a generic PSI testing facility.</p>

        <h2>Step 3: Book and pay</h2>
        <p>On PSI's site, select the specific exam you're taking. The exam codes are:</p>
        <ul>
          <li>PAR — Private Pilot Airplane (Recreational)</li>
          <li>IRA — Instrument Rating Airplane</li>
          <li>CAX — Commercial Pilot Airplane</li>
          <li>UAG — Unmanned Aircraft General (Part 107)</li>
        </ul>
        <p>Select your testing center, pick a date and time, and pay. The fee is <strong>$175</strong> for most exams, paid directly to PSI. This is not refundable if you no-show, but you can usually reschedule with enough notice. The fee is the same whether you pass or fail — if you need to retake, you pay again.</p>
        <p>You'll need your FTN from IACRA to complete the booking. Have it ready.</p>

        <h2>Step 4: Get your instructor endorsement (for most exams)</h2>
        <p>For the Private Pilot (PAR), Instrument Rating (IRA), and Commercial Pilot (CAX) knowledge tests, you need a <strong>written endorsement from a flight instructor</strong> certifying that you're prepared to take the exam. This is FAA required — the testing center will ask for it.</p>
        <p>Your CFI signs a logbook entry or provides a separate signed document with specific language. The exact wording is specified in FAA Advisory Circular AC 61-65. Your instructor will know what it needs to say.</p>
        <p>Part 107 is different: you do <strong>not</strong> need an instructor endorsement for the Part 107 exam. Anyone can walk in and take it. That's one reason it's the most accessible FAA exam for people without a flight training background.</p>

        <h2>What to bring on test day</h2>
        <ul>
          <li><strong>Government-issued photo ID</strong> — driver's license, passport, or military ID</li>
          <li><strong>Your instructor endorsement</strong> — logbook, printed document, or signed paper (not required for Part 107)</li>
          <li><strong>Your FTN</strong> — the testing center will use this to pull your registration</li>
        </ul>
        <p>You don't need to bring a calculator — the testing center provides one on-screen. You will have access to a printed copy of the FAA Airman Knowledge Test Supplement, which includes the sectional chart excerpts, weather charts, and other figures referenced in questions. You don't need to memorize those figures — they'll be right in front of you.</p>
        <p>Phones, watches, and any personal reference materials stay outside the testing room. You get scratch paper.</p>

        <h2>When you get your score</h2>
        <p>Results are immediate. When you finish the last question and submit, the screen shows your score. The testing center prints an Airman Knowledge Test Report (AKTR) — this is your official score report. <strong>Do not lose it.</strong> You'll need to present it to your examiner on your checkride. The report shows your overall score and the knowledge areas where you got questions wrong.</p>
        <p>Passing score is 70% for most exams. Your score report is valid for 24 months from the test date.</p>

        <h2>If you fail</h2>
        <p>You can retake the exam after a <strong>14-day waiting period</strong>. There's no limit to how many times you can take it, but you pay the full $175 each attempt and need a new instructor endorsement for each retake (for PAR/IRA/CAX). The 14-day wait is mandatory regardless of circumstance.</p>
        <p>Most people who fail do so because they underestimated a specific topic area — usually weather or airspace. Look at your AKTR, identify the weak areas, and focus study time there before rescheduling.</p>

        <h2>The short version</h2>
        <p>Create an IACRA account → get your FTN → book on psiexams.com → get your instructor endorsement → show up with ID. That's it. The scheduling process takes about 15 minutes once you have your FTN. The hard part is being ready for the test itself.</p>
      </>
    ),
  },

  /* ================================================================ */
  'how-hard-is-the-part-107-exam': {
    title: 'How Hard Is the FAA Part 107 Exam? (Honest Take)',
    description: "The Part 107 drone license exam isn't as hard as it sounds — if you study the right things. Here's what trips people up, what's actually easy, and what to expect on test day.",
    date: 'May 2, 2026',
    dateISO: '2026-05-02',
    readTime: '7 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
    related: ['part-107-study-guide-2026', 'part-107-drone-test-study-guide', 'part-107-vs-private-pilot-license'],
    content: (
      <>
        <p>If you search for "how hard is the Part 107 exam," you'll get two kinds of answers. People who passed it saying it was easy. People who failed it saying it was surprisingly brutal. Both are telling the truth.</p>
        <p>The Part 107 knowledge test is not technically difficult. The concepts aren't advanced. There's no math more complicated than reading a chart. But it has a specific trap: it tests aviation knowledge — airspace, weather, sectional charts — that drone pilots with no aviation background have never encountered before. If that's you, some of this will feel like learning a new language.</p>
        <p>Here's an honest breakdown.</p>

        <h2>The basics</h2>
        <p>The Part 107 Aeronautical Knowledge Test is 60 multiple-choice questions. You have 2 hours to complete it. You need 70% to pass — that's 42 out of 60 correct. The test is administered at PSI testing centers, costs $175, and there's no practical test or flight component whatsoever. It's purely a knowledge exam.</p>
        <p>The national pass rate is around 85–90%. That sounds high, but it includes people who've taken it multiple times — first-time pass rates are lower. And the people in that 10–15% who fail are almost always people who underestimated the airspace and weather sections.</p>

        <h2>What's actually on the test</h2>
        <p>The FAA breaks Part 107 into several topic areas. In practice, questions cluster around these:</p>
        <ul>
          <li><strong>Airspace classification and entry requirements</strong> — Class A through G, what's controlled, what requires authorization, what doesn't</li>
          <li><strong>Reading sectional aeronautical charts</strong> — identifying airspace boundaries, obstacles, airports, restricted areas</li>
          <li><strong>Weather</strong> — reading METARs and TAFs, understanding density altitude, recognizing hazardous conditions</li>
          <li><strong>Part 107 regulations</strong> — altitude limits, speed limits, VLOS requirements, operating hours, waiver requirements</li>
          <li><strong>Remote ID and registration</strong></li>
          <li><strong>Emergency procedures and accident reporting</strong></li>
          <li><strong>Crew resource management and human factors</strong> — very light coverage</li>
        </ul>
        <p>The regulations section is the most straightforward if you study them. The rules are specific and testable: 400 feet AGL, 87 knots max speed, 3 SM visibility, 500 feet below clouds, 2,000 feet horizontal from clouds. Memorize those numbers and you'll get those questions right.</p>

        <h2>Where people actually fail</h2>
        <p>The hard part — the part nobody warns you about — is that <strong>the FAA expects you to think like a pilot, not like a drone operator.</strong></p>
        <p>Sectional chart questions are the biggest stumbling block. You'll be shown a portion of a sectional chart and asked to identify what class of airspace you're in, what the altitude limits are, or whether you need authorization to fly there. If you've never read an aeronautical chart, this is genuinely confusing at first. The symbology is dense. Airspace boundaries stack and overlap. A "Class E from 700 AGL" designation looks nothing like a "Class E to the surface" designation on the chart, and the test absolutely expects you to know the difference.</p>
        <p>Weather is the second area. Reading a METAR isn't hard once you learn the format — but there are a lot of abbreviations, the units aren't always intuitive (cloud heights in hundreds of feet, visibility in statute miles), and the questions can be specific. Knowing that "BKN014" means broken clouds at 1,400 feet AGL, not 14,000 feet, is the kind of detail that trips people up.</p>
        <p>Density altitude is another one. The concept itself isn't complicated — hot, humid, high-elevation airports have degraded performance — but the exam asks about it from multiple angles and expects you to understand why, not just what.</p>

        <h2>What's easy (if you actually study it)</h2>
        <p>The Part 107-specific regulations are very learnable. The rules are finite, specific, and clearly written. 400 feet, 87 knots, 55 pounds, 3 SM, 70% to pass — these are just numbers. Flash card them once, see them in practice questions a few times, done.</p>
        <p>Remote ID rules are newer but not complicated. Registration is straightforward. The waiver system is testable at a surface level — you mostly need to know what requires a waiver, not how to write one.</p>
        <p>Human factors questions are generally the easiest part of the exam. IMSAFE, the DECIDE model, the five hazardous attitudes — these are accessible and the questions are usually pretty direct.</p>

        <h2>How to prepare without wasting time</h2>
        <p>Most people who fail put in study time, just the wrong kind. Reading the Part 107 regulations document cover to cover is tedious and not how you learn testable material. Watching YouTube videos gives you a feel for things without building the recall you need under test conditions.</p>
        <p>What actually works: practice questions from the actual FAA question bank, with explanations for every answer. When you get a sectional chart question wrong, don't just note that you got it wrong — understand exactly why the correct answer is correct, what the chart symbol means, what airspace you're in and why. That's the difference between memorizing and knowing.</p>
        <p>Spend extra time on weather and charts specifically. Those are the areas where smart people who don't study the right way get burned.</p>

        <h2>The honest bottom line</h2>
        <p>If you have an aviation background — private pilot certificate, military aviation, anything — Part 107 is probably a week or two of light review. The airspace and weather material is ground you've already covered.</p>
        <p>If you're coming to this with zero aviation knowledge and your experience is flying a DJI around your neighborhood, expect 2–3 weeks of real study. The regulations are easy. The airspace and weather sections are where you need to put real work in. Don't skip them because they look complicated. They're the exam.</p>
        <p>The test is passable. Genuinely. But "I know how to fly a drone" doesn't prepare you for it the way studying the actual question bank does.</p>
      </>
    ),
  },

};

/* ─── Shared layout ────────────────────────────────────────────────── */
export default function BlogPost() {
  const { slug } = useParams();
  const post = POSTS[slug];

  if (!post) {
    return (
      <div className="container page" style={{ maxWidth: 720, textAlign: 'center', paddingTop: 80 }}>
        <Helmet>
          <title>Article Not Found | FAAExaminations.com</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div style={{ marginBottom: 16 }}><svg width="56" height="56" viewBox="0 0 24 24" fill="var(--blue)" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg></div>
        <h1>Article not found</h1>
        <p style={{ color: 'var(--text2)', marginBottom: 24 }}>That article doesn't exist or may have moved.</p>
        <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
      </div>
    );
  }

  const tc = tagColors[post.tag] || tagColors['Study Tips'];

  return (
    <div className="container page" style={{ maxWidth: 720 }}>
      <Helmet>
        <title>{post.title} | FAAExaminations.com</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://faaexaminations.com/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://faaexaminations.com/blog/${slug}`} />
        {post.image && <meta property="og:image" content={`https://faaexaminations.com${post.image}`} />}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.description,
          "datePublished": post.dateISO,
          "author": { "@type": "Organization", "name": "FAAExaminations.com", "url": "https://faaexaminations.com" },
          "publisher": { "@type": "Organization", "name": "FAAExaminations.com", "url": "https://faaexaminations.com", "logo": { "@type": "ImageObject", "url": "https://faaexaminations.com/favicon.png" } },
          "mainEntityOfPage": { "@type": "WebPage", "@id": `https://faaexaminations.com/blog/${slug}` },
          ...(post.image ? { "image": `https://faaexaminations.com${post.image}` } : {})
        })}</script>
      </Helmet>

      {/* Back link */}
      <div style={{ marginBottom: 28 }}>
        <Link to="/blog" style={{ color: 'var(--text2)', fontSize: '.88rem', textDecoration: 'none' }}>
          ← All articles
        </Link>
      </div>

      {/* Hero image */}
      {post.image && (
        <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 32, height: 260 }}>
          <img src={post.image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,14,20,0.2), rgba(8,14,20,0.65))' }} />
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <span style={{ fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: tc.bg, color: tc.color }}>
            {post.tag}
          </span>
          <span style={{ fontSize: '.78rem', color: 'var(--text3)' }}>{post.date}</span>
          <span style={{ fontSize: '.78rem', color: 'var(--text3)' }}>· {post.readTime}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 800, lineHeight: 1.25, marginBottom: 0 }}>
          {post.title}
        </h1>
      </div>

      {/* Article body */}
      <div className="blog-body">
        {post.content}
      </div>

      {/* Practice test CTA */}
      {(() => {
        const practiceLinks = {
          'Private Pilot':     { path: '/par-practice-test',    label: 'Free PAR Practice Test',     sub: '30 questions · No login required' },
          'Instrument Rating': { path: '/ira-practice-test',    label: 'Free IRA Practice Test',     sub: '30 questions · No login required' },
          'Part 107':          { path: '/part-107-practice-test', label: 'Free Part 107 Practice Test', sub: '30 questions · No login required' },
          'Study Tips':        { path: '/par-practice-test',    label: 'Free FAA Practice Test',     sub: '30 questions · No login required' },
        };
        const pl = practiceLinks[post.tag];
        if (!pl) return null;
        return (
          <div style={{ margin: '48px 0', background: 'var(--card-bg)', border: '1px solid var(--border2)', borderRadius: 12, padding: '28px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '.75rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 6 }}>Test your knowledge</div>
              <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)', marginBottom: 2 }}>{pl.label}</div>
              <div style={{ fontSize: '.85rem', color: 'var(--text3)' }}>{pl.sub}</div>
            </div>
            <Link to={pl.path} className="btn btn-primary" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>Take the Test →</Link>
          </div>
        );
      })()}

      {/* Related articles */}
      {post.related && post.related.length > 0 && (
        <div style={{ marginTop: 48 }}>
          <div style={{ fontSize: '.78rem', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 16 }}>Related articles</div>
          <div style={{ display: 'grid', gap: 12 }}>
            {post.related.map(s => {
              const r = POSTS[s];
              if (!r) return null;
              const rtc = tagColors[r.tag] || tagColors['Study Tips'];
              return (
                <Link key={s} to={`/blog/${s}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ padding: '16px 20px', cursor: 'pointer', transition: 'border-color .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ fontSize: '.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: rtc.bg, color: rtc.color }}>{r.tag}</span>
                      <span style={{ fontSize: '.75rem', color: 'var(--text3)' }}>{r.readTime}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text)' }}>{r.title}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="card" style={{ marginTop: 48, textAlign: 'center', padding: '28px 24px', background: 'var(--blue-dim)', borderColor: 'var(--border2)' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>Ready to start practicing?</div>
        <p style={{ color: 'var(--text2)', marginBottom: 16, fontSize: '.92rem' }}>
          2,826 authentic FAA practice questions with a timed exam simulator and full explanations.
        </p>
        <Link to="/register" className="btn btn-primary">Start Free →</Link>
      </div>

      {/* Back to blog */}
      <div style={{ textAlign: 'center', marginTop: 32 }}>
        <Link to="/blog" style={{ color: 'var(--text2)', fontSize: '.88rem' }}>← Back to all articles</Link>
      </div>
    </div>
  );
}
