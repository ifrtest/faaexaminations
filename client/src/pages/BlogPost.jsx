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
