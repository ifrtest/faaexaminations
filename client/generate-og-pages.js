import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const base = readFileSync('dist/index.html', 'utf8');

const pages = {
  'par': {
    pageTitle: 'FAA Private Pilot Written Test Prep — 1,469 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/par',
    ogTitle: 'FAA Private Pilot Written Test Prep — Pass First Try',
    ogDesc: '1,469 practice questions, timed simulator, and AI instructor. Pass your FAA Private Pilot written exam first try. $24.99/month.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'Private Pilot FAA exam prep — FAAExaminations.com',
  },
  'part-107': {
    pageTitle: 'FAA Part 107 Drone License Test Prep | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107',
    ogTitle: 'FAA Part 107 Drone License Test Prep — Pass First Try',
    ogDesc: 'Get your FAA drone license. Practice questions, timed simulator, and AI instructor. $37.99 one-time payment. Lifetime access.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license exam prep — FAAExaminations.com',
  },
  'ira': {
    pageTitle: 'FAA Instrument Rating Written Test Prep — 821 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira',
    ogTitle: 'FAA Instrument Rating Written Test Prep — Pass First Try',
    ogDesc: '821 IFR practice questions, approach procedures, charts, and AI instructor. Pass your FAA Instrument Rating written exam. $24.99/month.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'Instrument Rating FAA exam prep — FAAExaminations.com',
  },
  'cax': {
    pageTitle: 'FAA Commercial Pilot Written Test Prep — 536 Questions | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax',
    ogTitle: 'FAA Commercial Pilot Written Test Prep — Pass First Try',
    ogDesc: '536 practice questions covering performance, weight & balance, and advanced operations. Pass your FAA Commercial Pilot written exam. $24.99/month.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'Commercial Pilot FAA exam prep — FAAExaminations.com',
  },
  'bundle': {
    pageTitle: 'FAA Pilot Certificate Bundle — PAR, IRA & CAX | FAAExaminations.com',
    url: 'https://faaexaminations.com/bundle',
    ogTitle: 'FAA Pilot Certificate Bundle — PAR + IRA + CAX',
    ogDesc: 'All three FAA pilot certificate exams in one subscription. 2,826 practice questions, timed simulators, AI instructor. Save $35/month vs individual.',
    image: 'https://faaexaminations.com/plane-bundle.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Pilot Certificate Bundle — FAAExaminations.com',
  },
  'part-107-cheat-sheet': {
    pageTitle: 'FAA Part 107 Cheat Sheet — Key Rules, Airspace & Numbers (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107-cheat-sheet',
    ogTitle: 'FAA Part 107 Cheat Sheet — Key Rules, Airspace & Numbers (2026)',
    ogDesc: 'Free FAA Part 107 drone license exam cheat sheet. Altitude limits, airspace authorization, Remote ID, weather minimums, waivers, and key regulations.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license exam cheat sheet — FAAExaminations.com',
  },
  'par-cheat-sheet': {
    pageTitle: 'FAA Private Pilot Exam Cheat Sheet (PAR) — Key Numbers, Rules & Formulas (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/par-cheat-sheet',
    ogTitle: 'FAA Private Pilot Exam Cheat Sheet — Key Numbers, Rules & Formulas',
    ogDesc: 'Free FAA Private Pilot (PAR) written exam cheat sheet. FARs, airspace minimums, METAR codes, density altitude, weight & balance, and more. Printable reference.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'FAA Private Pilot exam cheat sheet — FAAExaminations.com',
  },
  'ira-cheat-sheet': {
    pageTitle: 'FAA Instrument Rating Cheat Sheet (IRA) — IFR Rules, Approaches & Minimums (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira-cheat-sheet',
    ogTitle: 'FAA Instrument Rating Cheat Sheet — IFR Rules, Approaches & Minimums',
    ogDesc: 'Free FAA Instrument Rating (IRA) written exam cheat sheet. IFR currency, CRAFT clearances, approach minimums, alternate rules, holding procedures, and more.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Instrument Rating exam cheat sheet — FAAExaminations.com',
  },
  'cax-cheat-sheet': {
    pageTitle: 'FAA Commercial Pilot Exam Cheat Sheet (CAX) — Regs, Performance & Maneuvers (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax-cheat-sheet',
    ogTitle: 'FAA Commercial Pilot Exam Cheat Sheet — Regs, Performance & Maneuvers',
    ogDesc: 'Free FAA Commercial Pilot (CAX) written exam cheat sheet. FAR 61.129 requirements, V-speeds, weight & balance, advanced aerodynamics, commercial maneuvers.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'FAA Commercial Pilot exam cheat sheet — FAAExaminations.com',
  },
  'par-practice-test': {
    pageTitle: 'FAA Private Pilot Practice Test (PAR) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/par-practice-test',
    ogTitle: 'FAA Private Pilot Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Private Pilot (PAR) practice test with 30 real exam-style questions. Instant scoring, answer explanations, no login required.',
    image: 'https://faaexaminations.com/plane-par-desktop.jpg',
    imageWidth: '1920',
    imageHeight: '1280',
    imageAlt: 'FAA Private Pilot practice test — FAAExaminations.com',
  },
  'ira-practice-test': {
    pageTitle: 'FAA Instrument Rating Practice Test (IRA) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/ira-practice-test',
    ogTitle: 'FAA Instrument Rating Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Instrument Rating (IRA) practice test with 30 real exam-style questions. IFR procedures, approaches, holds, weather. No login required.',
    image: 'https://faaexaminations.com/plane-ira.jpg',
    imageWidth: '2400',
    imageHeight: '1792',
    imageAlt: 'FAA Instrument Rating practice test — FAAExaminations.com',
  },
  'cax-practice-test': {
    pageTitle: 'FAA Commercial Pilot Practice Test (CAX) — 30 Free Questions (2026) | FAAExaminations.com',
    url: 'https://faaexaminations.com/cax-practice-test',
    ogTitle: 'FAA Commercial Pilot Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Commercial Pilot (CAX) practice test with 30 real exam-style questions. Regulations, aerodynamics, performance, multi-engine. No login required.',
    image: 'https://faaexaminations.com/plane-cax-hero.jpg',
    imageWidth: '1200',
    imageHeight: '630',
    imageAlt: 'FAA Commercial Pilot practice test — FAAExaminations.com',
  },
  'part-107-practice-test': {
    pageTitle: 'Part 107 Practice Test — 30 Free Questions (2026) | FAA Drone Exam | FAAExaminations.com',
    url: 'https://faaexaminations.com/part-107-practice-test',
    ogTitle: 'Part 107 Practice Test — 30 Free Questions (2026)',
    ogDesc: 'Free FAA Part 107 drone license practice test with 30 real exam-style questions. Airspace, VLOS, Remote ID, weather. No login required.',
    image: 'https://faaexaminations.com/drone_image_faa_examinations.jpg',
    imageWidth: '1440',
    imageHeight: '1080',
    imageAlt: 'FAA Part 107 drone license practice test — FAAExaminations.com',
  },
};

function buildHtml(base, meta) {
  return base
    .replace(/<title>[^<]*<\/title>/, `<title>${meta.pageTitle}</title>`)
    .replace(/<meta name="description" content="[^"]*"[^>]*>/, `<meta name="description" content="${meta.ogDesc}" />`)
    .replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${meta.url}" />`)
    .replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${meta.ogTitle}" />`)
    .replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${meta.ogDesc}" />`)
    .replace(/<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${meta.image}" />`)
    .replace(/<meta property="og:image:width" content="[^"]*" \/>/, `<meta property="og:image:width" content="${meta.imageWidth || '1200'}" />`)
    .replace(/<meta property="og:image:height" content="[^"]*" \/>/, `<meta property="og:image:height" content="${meta.imageHeight || '630'}" />`)
    .replace(/<meta property="og:image:alt" content="[^"]*" \/>/, `<meta property="og:image:alt" content="${meta.imageAlt || meta.ogTitle}" />`)
    .replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${meta.ogTitle}" />`)
    .replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${meta.ogDesc}" />`)
    .replace(/<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${meta.image}" />`);
}

for (const [slug, meta] of Object.entries(pages)) {
  writeFileSync(`dist/${slug}.html`, buildHtml(base, meta));
  console.log(`Generated dist/${slug}.html`);
}

// Blog posts — pre-rendered static HTML so Googlebot gets correct meta tags
const blogPosts = [
  { slug: 'how-to-become-a-commercial-pilot', ogTitle: 'How to Become a Commercial Pilot: Requirements, Timeline, and Cost', ogDesc: 'A step-by-step breakdown of what it takes to become a commercial pilot — FAA certificate path, 250-hour requirements, realistic timeline from zero, and what it actually costs.', image: 'https://faaexaminations.com/blog-throttle-cockpit.jpg' },
  { slug: 'vor-navigation-explained', ogTitle: 'VOR Navigation Explained: How to Use a VOR', ogDesc: 'VORs are still heavily tested on every FAA knowledge exam. Here\'s how the system works, how to read the CDI and TO/FROM flag, Victor airways, and the VOR check requirements.', image: 'https://faaexaminations.com/blog-commercial-cockpit.jpg' },
  { slug: 'night-vfr-requirements', ogTitle: 'Night VFR Requirements: What Private Pilots Need to Know', ogDesc: 'Night flying has different currency requirements, equipment rules, and weather minimums than daytime VFR. Here\'s what the FAA requires and what the PAR exam specifically tests.', image: 'https://faaexaminations.com/blog-pilot-ready.jpg' },
  { slug: 'ils-approach-explained', ogTitle: 'ILS Approach Explained: How It Works and What the Exam Tests', ogDesc: 'The ILS is the most common precision instrument approach. Here\'s how the localizer and glideslope work, what the minimums mean, and exactly what the IRA knowledge test asks about it.', image: 'https://faaexaminations.com/blog-garmin-cockpit.jpg' },
  { slug: 'private-pilot-checkride-what-to-expect', ogTitle: 'Private Pilot Checkride: What to Expect (And How to Prepare)', ogDesc: 'The private pilot checkride is an oral exam plus a flight test. Here\'s what examiners actually look for, what fails people, what documents to bring, and how to go in ready.', image: 'https://faaexaminations.com/blog-preflight.jpg' },
  { slug: 'weight-and-balance-faa-exam', ogTitle: 'Weight and Balance for the FAA Exam: Calculations Explained', ogDesc: 'Weight and balance questions are on both the PAR and CAX written exams. Here\'s the complete calculation framework — datum, arm, moment, CG — with a worked example and the formulas you need.', image: 'https://faaexaminations.com/blog-ga-cockpit.jpg' },
  { slug: 'faa-medical-certificate-classes-explained', ogTitle: 'FAA Medical Certificate: Class 1, 2, 3, and BasicMed Explained', ogDesc: 'Before you start flight training, you need to know if you qualify for an FAA medical. Here\'s what each class requires, who needs what, and how BasicMed works as an alternative.', image: 'https://faaexaminations.com/blog-faa-medical.jpg' },
  { slug: 'how-to-read-a-taf', ogTitle: 'How to Read a TAF (Terminal Aerodrome Forecast)', ogDesc: 'TAFs are aviation weather forecasts that show up on FAA knowledge tests — especially for instrument rating. Here\'s how to decode one field by field, with a real example.', image: 'https://faaexaminations.com/blog-navigation.jpg' },
  { slug: 'vfr-cross-country-flight-planning', ogTitle: 'VFR Cross-Country Flight Planning: What the FAA Expects You to Know', ogDesc: 'Cross-country planning is a core private pilot skill and a common knowledge test topic. TVMDC, fuel reserves, weather briefings, flight plans — here\'s what you need to know.', image: 'https://faaexaminations.com/blog-vfr-flight.jpg' },
  { slug: 'what-is-density-altitude', ogTitle: 'What Is Density Altitude? (And Why It Kills Aircraft Performance)', ogDesc: 'Density altitude is one of the most tested concepts on every FAA exam — and one of the most practical. Here\'s what it means, how to calculate it, and why high density altitude gets pilots into trouble.', image: 'https://faaexaminations.com/blog-cockpit-gauges.jpg' },
  { slug: 'how-to-read-a-sectional-chart', ogTitle: "How to Read a Sectional Chart: A Pilot's Guide", ogDesc: 'Sectional chart questions are on every FAA knowledge test. Here\'s how to decode airspace boundaries, airport data, terrain, obstacles, and navigation aids — with the exact symbols the exam tests.', image: 'https://faaexaminations.com/blog-sectional-chart.jpg' },
  { slug: 'faa-airspace-classes-explained', ogTitle: 'FAA Airspace Classes Explained: A Plain-English Guide', ogDesc: 'Class A through G — what each one means, who can fly there, what equipment you need, and what the weather minimums are. Airspace questions show up on every FAA knowledge test.', image: 'https://faaexaminations.com/blog-pilots-flying.jpg' },
  { slug: 'how-to-schedule-faa-written-exam', ogTitle: 'How to Schedule Your FAA Written Exam (Step by Step)', ogDesc: 'Scheduling the FAA knowledge test is straightforward once you know where to go. Here\'s exactly how to get your FTN, register on PSI, get your endorsement, and what to bring on test day.', image: 'https://faaexaminations.com/blog-student-pilot.jpg' },
  { slug: 'how-long-to-study-for-faa-written-exam', ogTitle: 'How Long Should You Study for the FAA Written Exam?', ogDesc: 'The "2–4 weeks" answer is technically true but not that useful. Here\'s a more honest breakdown by exam type, study method, and how much time you can actually put in each day.', image: 'https://faaexaminations.com/plane-step2.jpg' },
  { slug: 'how-hard-is-the-part-107-exam', ogTitle: 'How Hard Is the FAA Part 107 Exam? (Honest Take)', ogDesc: "The Part 107 exam isn't technically hard — but it has a specific trap. It tests aviation knowledge that most drone pilots have never seen. Here's what to actually expect.", image: 'https://faaexaminations.com/blog-part107-drone.jpg' },
  { slug: 'how-to-pass-faa-private-pilot-written-exam-first-try', ogTitle: 'How to Pass the FAA Private Pilot Written Exam First Try', ogDesc: "The PAR knowledge test has 1,400+ questions in the official bank — but the real exam only draws 60. Here's how to study smarter, not harder, and pass first try.", image: 'https://faaexaminations.com/private-pilot-faa-knowledge-test-prep.jpg' },
  { slug: 'part-107-study-guide-2026', ogTitle: 'Part 107 Study Guide 2026: Pass the FAA Remote Pilot Exam', ogDesc: "Everything you need to study for the FAA Part 107 Remote Pilot Certificate — what's on the test, how hard it is, and the fastest path to passing without wasting time.", image: 'https://faaexaminations.com/part-107-drone-license-faa-remote-pilot.jpg' },
  { slug: 'faa-instrument-rating-written-test-study-tips-2026', ogTitle: 'FAA Instrument Rating Written Test: Study Tips That Work (2026)', ogDesc: "The IRA knowledge test covers weather, IFR procedures, charts, and regulations. Most students underestimate it — here's how to prepare properly and pass.", image: 'https://faaexaminations.com/plane-ira.jpg' },
  { slug: 'how-long-to-get-private-pilot-license', ogTitle: 'How Long Does It Take to Get a Private Pilot License?', ogDesc: "The FAA minimum is 40 hours, but the national average is closer to 60–70. Here's an honest breakdown of what actually affects your timeline — and how to speed it up.", image: 'https://faaexaminations.com/blog-pilot-aircraft.jpg' },
  { slug: 'part-107-vs-private-pilot-license', ogTitle: 'Part 107 vs Private Pilot License: Which Should You Get First?', ogDesc: "Part 107 is faster and cheaper. A Private Pilot license opens more doors. If you're deciding between them — here's what actually matters for your goals.", image: 'https://faaexaminations.com/part-107-drone-license-faa-remote-pilot.jpg' },
  { slug: 'how-to-read-a-metar', ogTitle: 'How to Read a METAR (With Real Examples)', ogDesc: "METARs look confusing at first. They're not. Once you learn the structure you can decode one in under a minute — and they show up on every FAA knowledge test.", image: 'https://faaexaminations.com/blog-metar.webp' },
  { slug: 'faa-written-exam-study-guide', ogTitle: 'FAA Written Exam Study Guide: What to Study and in What Order', ogDesc: "A topic-by-topic breakdown of the FAA written exam — what's high priority, what order to study it, and how long each area actually takes.", image: 'https://faaexaminations.com/plane-step2.jpg' },
  { slug: 'instrument-rating-knowledge-test-tips', ogTitle: 'Instrument Rating Knowledge Test: What Makes It Hard and How to Pass', ogDesc: "The IRA has a lower pass rate than the private pilot test. Here's what actually makes it harder — and the study order that works.", image: 'https://faaexaminations.com/plane-ira.jpg' },
  { slug: 'part-107-drone-test-study-guide', ogTitle: 'How to Pass the Part 107 Drone Test First Try', ogDesc: "The FAA Part 107 exam isn't a flying test — it's a knowledge test. Weather and airspace trip up most drone pilots. Here's how to prepare and pass first try.", image: 'https://faaexaminations.com/blog-part107-drone.jpg' },
  { slug: 'how-to-pass-faa-written-exam-first-try', ogTitle: 'How to Pass the FAA Written Exam First Try', ogDesc: "The knowledge test has a published question bank — you're not guessing what might show up, you're practicing the actual questions. Here's the study method that works.", image: 'https://faaexaminations.com/plane-par-desktop.jpg' },
  { slug: 'how-to-pass-faa-private-pilot-written-exam', ogTitle: 'How to Pass the FAA Private Pilot Written Exam', ogDesc: "Everything you need to know about the PAR knowledge test — what topics are covered, how many questions, what score you need, and the most effective study strategies.", image: 'https://faaexaminations.com/plane-par-desktop.jpg' },
  { slug: 'faa-written-exam-questions-score-tips', ogTitle: 'FAA Written Exam: How Many Questions, What Score to Pass & How to Prepare', ogDesc: "A complete breakdown of the FAA Airman Knowledge Test format — number of questions per exam, passing scores, time limits, and what happens if you fail.", image: 'https://faaexaminations.com/blog-student-pilot.jpg' },
  { slug: 'instrument-rating-knowledge-test-study-tips', ogTitle: 'Instrument Rating Knowledge Test: Study Tips That Actually Work', ogDesc: "The IRA is the hardest FAA written exam. Here's how to tackle the weather, navigation, and regulations topics that trip up most students.", image: 'https://faaexaminations.com/plane-ira.jpg' },
  { slug: 'best-faa-test-prep-tools', ogTitle: 'Best FAA Test Prep Tools Compared (2026)', ogDesc: "We compare the most popular FAA knowledge test prep platforms — question banks, features, pricing, and pass rates — so you can choose the right one.", image: 'https://faaexaminations.com/blog-cockpit-gauges.jpg' },
  { slug: 'common-mistakes-private-pilot-written-exam', ogTitle: 'Common Mistakes on the Private Pilot Written Exam (And How to Avoid Them)', ogDesc: "From weather charts to airspace questions, these are the topics where student pilots lose the most points — and how to make sure you don't.", image: 'https://faaexaminations.com/blog-preflight.jpg' },
  { slug: 'faa-license-conversion-foreign-pilots', ogTitle: 'FAA License Conversion: What Foreign Pilots Need to Know', ogDesc: "Holding an ICAO or Transport Canada pilot licence and converting to FAA? Here's exactly what knowledge tests you need and how to prepare.", image: 'https://faaexaminations.com/blog-pilots-flying.jpg' },
  { slug: 'ifr-holding-patterns-explained', ogTitle: 'IFR Holding Patterns Explained: Entries, Timing, and What the Exam Tests', ogDesc: "Holding patterns trip up almost every instrument student. Here's how the three entries work, how timing changes with wind, and exactly what the IRA exam expects you to know.", image: 'https://faaexaminations.com/blog-ifr-cockpit-instruments.jpg' },
  { slug: 'how-to-read-instrument-approach-plate', ogTitle: 'How to Read an Instrument Approach Plate (Step by Step)', ogDesc: "Approach plates look overwhelming the first time. Once you understand the layout — briefing strip, plan view, profile view, minimums — they're actually very logical. Here's how to read one.", image: 'https://faaexaminations.com/blog-ifr-student-stressed.jpg' },
  { slug: 'ifr-alternate-airport-requirements', ogTitle: 'IFR Alternate Airport Requirements: The 1-2-3 Rule and When You Need One', ogDesc: "When does an IFR flight plan require an alternate? What makes an airport qualify as one? The 1-2-3 rule is just the start — here's the full picture the IRA exam tests.", image: 'https://faaexaminations.com/blog-ifr-weather-storm.jpg' },
  { slug: 'ifr-weather-minimums', ogTitle: 'IFR Weather Minimums: Takeoff, En Route, and Approach Explained', ogDesc: "IFR weather minimums aren't one number — they depend on the phase of flight, the approach type, and your equipment. Here's a plain-English breakdown of what the FAA requires.", image: 'https://faaexaminations.com/blog-ifr-clouds-flight.jpg' },
  { slug: 'rnav-gps-approaches-explained', ogTitle: 'RNAV and GPS Approaches Explained: LPV, LNAV, and What They Mean', ogDesc: "GPS approaches have largely replaced VOR approaches at most airports — but the different approach types (LPV, LNAV/VNAV, LNAV) confuse a lot of instrument students. Here's what each one means.", image: 'https://faaexaminations.com/blog-ifr-cockpit-approach.jpg' },
  { slug: 'aircraft-icing-ifr-flying', ogTitle: 'Aircraft Icing: What IFR Pilots Need to Know (And What the Exam Tests)', ogDesc: "Structural icing is one of the most dangerous hazards in IFR flying — and one of the most tested topics on the IRA knowledge exam. Here's how icing forms, what to do about it, and what the FAA expects you to know.", image: 'https://faaexaminations.com/blog-ifr-woman-pilot.jpg' },
  { slug: 'ifr-departure-procedures-odps-sids', ogTitle: 'IFR Departure Procedures: ODPs and SIDs Explained', ogDesc: "Obstacle Departure Procedures and Standard Instrument Departures serve the same purpose but work differently. Here's what each one is, when you must fly it, and how to brief one before departure.", image: 'https://faaexaminations.com/blog-ifr-cockpit-night.jpg' },
  { slug: 'vor-approach-explained', ogTitle: 'VOR Approach Explained: How to Fly One and What the IRA Tests', ogDesc: "VOR approaches are non-precision approaches — no glideslope, just lateral guidance to a final approach fix. Here's how they work, how to brief them, and the specific things the IRA knowledge test focuses on.", image: 'https://faaexaminations.com/blog-ifr-cockpit-gauges.jpg' },
  { slug: 'ifr-currency-requirements', ogTitle: 'IFR Currency Requirements: What 61.57 Actually Says', ogDesc: "14 CFR 61.57(c) sets out exactly what you need to stay current for IFR flight. Six approaches, holds, intercepting and tracking — here's what counts, what doesn't, and how to get current again if you've lapsed.", image: 'https://faaexaminations.com/blog-ifr-pilot-training.jpg' },
  { slug: 'instrument-approach-missed-approach', ogTitle: 'Missed Approach: When to Execute It and What Happens Next', ogDesc: "The missed approach point is one of the most critical decision points in IFR flying. Here's when you're required to go missed, how to find the MAP on an approach plate, and what the IRA knowledge test asks about it.", image: 'https://faaexaminations.com/blog-ifr-approach-runway.jpg' },
  { slug: 'ifr-flight-planning-fuel-requirements', ogTitle: 'IFR Flight Planning: Fuel Requirements, Alternates, and the FAA Rules', ogDesc: "14 CFR 91.167 spells out the IFR fuel requirements — destination plus alternate plus 45 minutes. But there's more to IFR flight planning than fuel. Here's the complete picture.", image: 'https://faaexaminations.com/blog-ifr-cockpit-approach.jpg' },
];

mkdirSync('dist/blog', { recursive: true });

for (const post of blogPosts) {
  const meta = {
    pageTitle: `${post.ogTitle} | FAAExaminations.com`,
    url: `https://faaexaminations.com/blog/${post.slug}`,
    ogTitle: post.ogTitle,
    ogDesc: post.ogDesc,
    image: post.image,
    imageAlt: `${post.ogTitle} — FAAExaminations.com`,
  };
  writeFileSync(`dist/blog/${post.slug}.html`, buildHtml(base, meta));
  console.log(`Generated dist/blog/${post.slug}.html`);
}
