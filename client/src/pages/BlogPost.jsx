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
  'part-107-drone-test-study-guide': {
    title: 'How to Pass the Part 107 Drone Test First Try',
    description: 'Everything you need to pass the FAA Part 107 Remote Pilot test first try. Study plan, key topics, and 166 practice questions at FAAExaminations.com. Start free.',
    date: 'April 25, 2026',
    readTime: '7 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
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
        <p>Then start practice questions, by topic. At <a href="https://www.faaexaminations.com" style={{color:'var(--blue)'}}>FAAExaminations.com</a>, all 166 Part 107 questions are sorted by category. Drill the weak areas instead of cycling through what you already know.</p>

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
    readTime: '7 min read',
    tag: 'Study Tips',
    image: '/blog-faa-simulator.jpg',
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
        <p>At <a href="https://www.faaexaminations.com" style={{color:'var(--blue)'}}>FAAExaminations.com</a>, all 3,000+ questions are sorted by module — same categories the FAA uses. Drill your weak areas instead of repeating what you already know.</p>

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
    readTime: '8 min read',
    tag: 'Private Pilot',
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
    readTime: '6 min read',
    tag: 'Study Tips',
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
    readTime: '7 min read',
    tag: 'Instrument Rating',
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
    readTime: '5 min read',
    tag: 'Resources',
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
    readTime: '6 min read',
    tag: 'Private Pilot',
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
    readTime: '7 min read',
    tag: 'License Conversion',
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
        <link rel="canonical" href={`https://www.faaexaminations.com/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.faaexaminations.com/blog/${slug}`} />
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
