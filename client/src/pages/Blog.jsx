// client/src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const POSTS = [
  {
    slug: 'how-to-become-a-commercial-pilot',
    title: 'How to Become a Commercial Pilot: Requirements, Timeline, and Cost',
    excerpt: "A step-by-step breakdown of what it takes to become a commercial pilot — FAA certificate path, 250-hour requirements, realistic timeline from zero, and what it actually costs.",
    date: 'May 2, 2026',
    readTime: '8 min read',
    tag: 'Study Tips',
    image: '/blog-throttle-cockpit.jpg',
  },
  {
    slug: 'vor-navigation-explained',
    title: 'VOR Navigation Explained: How to Use a VOR',
    excerpt: "VORs are still heavily tested on every FAA knowledge exam. Here's how the system works, how to read the CDI and TO/FROM flag, Victor airways, and the VOR check requirements.",
    date: 'May 2, 2026',
    readTime: '7 min read',
    tag: 'Instrument Rating',
    image: '/blog-commercial-cockpit.jpg',
  },
  {
    slug: 'night-vfr-requirements',
    title: 'Night VFR Requirements: What Private Pilots Need to Know',
    excerpt: "Night flying has different currency requirements, equipment rules, and weather minimums than daytime VFR. Here's what the FAA requires and what the PAR exam specifically tests.",
    date: 'May 2, 2026',
    readTime: '6 min read',
    tag: 'Private Pilot',
    image: '/blog-pilot-ready.jpg',
  },
  {
    slug: 'ils-approach-explained',
    title: 'ILS Approach Explained: How It Works and What the Exam Tests',
    excerpt: "The ILS is the most common precision instrument approach. Here's how the localizer and glideslope work, what the minimums mean, and exactly what the IRA knowledge test asks about it.",
    date: 'May 2, 2026',
    readTime: '8 min read',
    tag: 'Instrument Rating',
    image: '/blog-garmin-cockpit.jpg',
  },
  {
    slug: 'private-pilot-checkride-what-to-expect',
    title: 'Private Pilot Checkride: What to Expect (And How to Prepare)',
    excerpt: "The private pilot checkride is an oral exam plus a flight test. Here's what examiners actually look for, what fails people, what documents to bring, and how to go in ready.",
    date: 'May 2, 2026',
    readTime: '8 min read',
    tag: 'Private Pilot',
    image: '/blog-preflight.jpg',
  },
  {
    slug: 'weight-and-balance-faa-exam',
    title: 'Weight and Balance for the FAA Exam: Calculations Explained',
    excerpt: "Weight and balance questions are on both the PAR and CAX written exams. Here's the complete calculation framework — datum, arm, moment, CG — with a worked example and the formulas you need.",
    date: 'May 2, 2026',
    readTime: '7 min read',
    tag: 'Study Tips',
    image: '/blog-ga-cockpit.jpg',
  },
  {
    slug: 'faa-medical-certificate-classes-explained',
    title: 'FAA Medical Certificate: Class 1, 2, 3, and BasicMed Explained',
    excerpt: "Before you start flight training, you need to know if you qualify for an FAA medical. Here's what each class requires, who needs what, and how BasicMed works as an alternative.",
    date: 'May 2, 2026',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/blog-faa-medical.jpg',
  },
  {
    slug: 'how-to-read-a-taf',
    title: 'How to Read a TAF (Terminal Aerodrome Forecast)',
    excerpt: "TAFs are aviation weather forecasts that show up on FAA knowledge tests — especially for instrument rating. Here's how to decode one field by field, with a real example.",
    date: 'May 2, 2026',
    readTime: '6 min read',
    tag: 'Instrument Rating',
    image: '/blog-navigation.jpg',
  },
  {
    slug: 'vfr-cross-country-flight-planning',
    title: 'VFR Cross-Country Flight Planning: What the FAA Expects You to Know',
    excerpt: "Cross-country planning is a core private pilot skill and a common knowledge test topic. TVMDC, fuel reserves, weather briefings, flight plans — here's what you need to know.",
    date: 'May 2, 2026',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/blog-vfr-flight.jpg',
  },
  {
    slug: 'what-is-density-altitude',
    title: 'What Is Density Altitude? (And Why It Kills Aircraft Performance)',
    excerpt: "Density altitude is one of the most tested concepts on every FAA exam — and one of the most practical. Here's what it means, how to calculate it, and why high density altitude gets pilots into trouble.",
    date: 'May 2, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/blog-cockpit-gauges.jpg',
  },
  {
    slug: 'how-to-read-a-sectional-chart',
    title: "How to Read a Sectional Chart: A Pilot's Guide",
    excerpt: "Sectional chart questions are on every FAA knowledge test. Here's how to decode airspace boundaries, airport data, terrain, obstacles, and navigation aids — with the exact symbols the exam tests.",
    date: 'May 2, 2026',
    readTime: '9 min read',
    tag: 'Study Tips',
    image: '/blog-sectional-chart.jpg',
  },
  {
    slug: 'faa-airspace-classes-explained',
    title: 'FAA Airspace Classes Explained: A Plain-English Guide',
    excerpt: "Class A through G — what each one means, who can fly there, what equipment you need, and what the weather minimums are. Airspace questions show up on every FAA knowledge test.",
    date: 'May 2, 2026',
    readTime: '8 min read',
    tag: 'Study Tips',
    image: '/blog-pilots-flying.jpg',
  },
  {
    slug: 'how-to-schedule-faa-written-exam',
    title: 'How to Schedule Your FAA Written Exam (Step by Step)',
    excerpt: "Scheduling the FAA knowledge test is straightforward once you know where to go. Here's exactly how to get your FTN, register on PSI, get your endorsement, and what to bring on test day.",
    date: 'May 2, 2026',
    readTime: '5 min read',
    tag: 'Study Tips',
    image: '/blog-student-pilot.jpg',
  },
  {
    slug: 'how-long-to-study-for-faa-written-exam',
    title: 'How Long Should You Study for the FAA Written Exam?',
    excerpt: 'The "2–4 weeks" answer is technically true but not that useful. Here\'s a more honest breakdown by exam type, study method, and how much time you can actually put in each day.',
    date: 'May 2, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
  },
  {
    slug: 'how-hard-is-the-part-107-exam',
    title: 'How Hard Is the FAA Part 107 Exam? (Honest Take)',
    excerpt: "The Part 107 exam isn't technically hard — but it has a specific trap. It tests aviation knowledge that most drone pilots have never seen. Here's what to actually expect.",
    date: 'May 2, 2026',
    readTime: '7 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
  },
  {
    slug: 'how-to-pass-faa-private-pilot-written-exam-first-try',
    title: 'How to Pass the FAA Private Pilot Written Exam First Try',
    excerpt: 'The PAR knowledge test has 1,400+ questions in the official bank — but the real exam only draws 60. Here\'s how to study smarter, not harder, and pass first try.',
    date: 'April 27, 2026',
    readTime: '7 min read',
    tag: 'Private Pilot',
    image: '/private-pilot-faa-knowledge-test-prep.jpg',
  },
  {
    slug: 'part-107-study-guide-2026',
    title: 'Part 107 Study Guide 2026: Pass the FAA Remote Pilot Exam',
    excerpt: 'Everything you need to study for the FAA Part 107 Remote Pilot Certificate — what\'s on the test, how hard it is, and the fastest path to passing without wasting time.',
    date: 'April 27, 2026',
    readTime: '8 min read',
    tag: 'Part 107',
    image: '/part-107-drone-license-faa-remote-pilot.jpg',
  },
  {
    slug: 'faa-instrument-rating-written-test-study-tips-2026',
    title: 'FAA Instrument Rating Written Test: Study Tips That Work (2026)',
    excerpt: 'The IRA knowledge test covers weather, IFR procedures, charts, and regulations. Most students underestimate it — here\'s how to prepare properly and pass.',
    date: 'April 27, 2026',
    readTime: '7 min read',
    tag: 'Instrument Rating',
    image: '/plane-ira.webp',
  },
  {
    slug: 'how-long-to-get-private-pilot-license',
    title: 'How Long Does It Take to Get a Private Pilot License?',
    excerpt: 'The FAA minimum is 40 hours, but the national average is closer to 60–70. Here\'s an honest breakdown of what actually affects your timeline — and how to speed it up.',
    date: 'April 27, 2026',
    readTime: '6 min read',
    tag: 'Private Pilot',
    image: '/blog-pilot-aircraft.jpg',
  },
  {
    slug: 'part-107-vs-private-pilot-license',
    title: 'Part 107 vs Private Pilot License: Which Should You Get First?',
    excerpt: 'Part 107 is faster and cheaper. A Private Pilot license opens more doors. If you\'re deciding between them — here\'s what actually matters for your goals.',
    date: 'April 27, 2026',
    readTime: '6 min read',
    tag: 'Part 107',
    image: '/part-107-drone-license-faa-remote-pilot.jpg',
  },
  {
    slug: 'how-to-read-a-metar',
    title: 'How to Read a METAR (With Real Examples)',
    excerpt: 'METARs look confusing at first. They\'re not. Once you learn the structure you can decode one in under a minute — and they show up on every FAA knowledge test.',
    date: 'April 25, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/blog-metar.webp',
  },
  {
    slug: 'faa-written-exam-study-guide',
    title: 'FAA Written Exam Study Guide: What to Study and in What Order',
    excerpt: 'A topic-by-topic breakdown of the FAA written exam — what\'s high priority, what order to study it, and how long each area actually takes.',
    date: 'April 25, 2026',
    readTime: '8 min read',
    tag: 'Study Tips',
    image: '/plane-step2.jpg',
  },
  {
    slug: 'instrument-rating-knowledge-test-tips',
    title: 'Instrument Rating Knowledge Test: What Makes It Hard and How to Pass',
    excerpt: 'The IRA has a lower pass rate than the private pilot test. Here\'s what actually makes it harder — and the study order that works.',
    date: 'April 25, 2026',
    readTime: '8 min read',
    tag: 'Instrument Rating',
    image: '/plane-ira.webp',
  },
  {
    slug: 'part-107-drone-test-study-guide',
    title: 'How to Pass the Part 107 Drone Test First Try',
    excerpt: 'The FAA Part 107 exam isn\'t a flying test — it\'s a knowledge test. Weather and airspace trip up most drone pilots. Here\'s how to prepare and pass first try.',
    date: 'April 25, 2026',
    readTime: '7 min read',
    tag: 'Part 107',
    image: '/blog-part107-drone.jpg',
  },
  {
    slug: 'how-to-pass-faa-written-exam-first-try',
    title: 'How to Pass the FAA Written Exam First Try',
    excerpt: 'The knowledge test has a published question bank — you\'re not guessing what might show up, you\'re practicing the actual questions. Here\'s the study method that works.',
    date: 'April 25, 2026',
    readTime: '7 min read',
    tag: 'Study Tips',
    image: '/plane-par.webp',
  },
  {
    slug: 'how-to-pass-faa-private-pilot-written-exam',
    title: 'How to Pass the FAA Private Pilot Written Exam',
    excerpt: 'Everything you need to know about the PAR knowledge test — what topics are covered, how many questions, what score you need, and the most effective study strategies.',
    date: 'April 18, 2026',
    readTime: '8 min read',
    tag: 'Private Pilot',
    image: '/plane-par-desktop.jpg',
  },
  {
    slug: 'faa-written-exam-questions-score-tips',
    title: 'FAA Written Exam: How Many Questions, What Score to Pass & How to Prepare',
    excerpt: 'A complete breakdown of the FAA Airman Knowledge Test format — number of questions per exam, passing scores, time limits, and what happens if you fail.',
    date: 'April 15, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/blog-student-pilot.jpg',
  },
  {
    slug: 'instrument-rating-knowledge-test-study-tips',
    title: 'Instrument Rating Knowledge Test: Study Tips That Actually Work',
    excerpt: 'The IRA is the hardest FAA written exam. Here\'s how to tackle the weather, navigation, and regulations topics that trip up most students.',
    date: 'April 10, 2026',
    readTime: '7 min read',
    tag: 'Instrument Rating',
    image: '/plane-ira.jpg',
  },
  {
    slug: 'best-faa-test-prep-tools',
    title: 'Best FAA Test Prep Tools Compared (2026)',
    excerpt: 'We compare the most popular FAA knowledge test prep platforms — question banks, features, pricing, and pass rates — so you can choose the right one.',
    date: 'April 5, 2026',
    readTime: '5 min read',
    tag: 'Resources',
    image: '/blog-cockpit-gauges.jpg',
  },
  {
    slug: 'common-mistakes-private-pilot-written-exam',
    title: 'Common Mistakes on the Private Pilot Written Exam (And How to Avoid Them)',
    excerpt: 'From weather charts to airspace questions, these are the topics where student pilots lose the most points — and how to make sure you don\'t.',
    date: 'March 28, 2026',
    readTime: '6 min read',
    tag: 'Private Pilot',
    image: '/blog-preflight.jpg',
  },
  {
    slug: 'faa-license-conversion-foreign-pilots',
    title: 'FAA License Conversion: What Foreign Pilots Need to Know',
    excerpt: 'Holding an ICAO or Transport Canada pilot licence and converting to FAA? Here\'s exactly what knowledge tests you need and how to prepare.',
    date: 'March 20, 2026',
    readTime: '7 min read',
    tag: 'License Conversion',
    image: '/blog-pilots-flying.jpg',
  },
];

const tagColors = {
  'Private Pilot':      { bg: 'rgba(48,172,226,0.12)', color: '#30ace2' },
  'Instrument Rating':  { bg: 'rgba(61,214,140,0.12)', color: '#3dd68c' },
  'Study Tips':         { bg: 'rgba(245,166,35,0.12)',  color: '#f5a623' },
  'Resources':          { bg: 'rgba(48,172,226,0.12)', color: '#30ace2' },
  'License Conversion': { bg: 'rgba(93,200,217,0.12)', color: '#5dc8d9' },
  'Part 107':           { bg: 'rgba(61,214,140,0.12)', color: '#3dd68c' },
};

export default function Blog() {
  return (
    <div className="container page" style={{ maxWidth: 860 }}>
      <Helmet>
        <title>Blog — FAA Exam Tips &amp; Study Guides | FAAExaminations.com</title>
        <meta name="description" content="FAA knowledge test tips, study guides, and exam prep advice for Private Pilot, Instrument Rating, and Commercial Pilot written exams. Pass your FAA written test first try." />
        <link rel="canonical" href="https://faaexaminations.com/blog" />
        <meta property="og:title" content="FAA Exam Tips &amp; Study Guides — FAAExaminations.com Blog" />
        <meta property="og:description" content="FAA knowledge test tips, study guides, and exam prep advice for Private Pilot, Instrument Rating, and Commercial Pilot written exams." />
        <meta property="og:url" content="https://faaexaminations.com/blog" />
        <meta property="og:image" content="https://faaexaminations.com/plane-hero.jpeg" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [{
            "@type": "ListItem", "position": 1,
            "name": "Home", "item": "https://faaexaminations.com"
          }, {
            "@type": "ListItem", "position": 2,
            "name": "Blog", "item": "https://faaexaminations.com/blog"
          }]
        })}</script>
      </Helmet>

      <h1>FAA Exam Tips &amp; Study Guides</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40, fontSize: '1.05rem', lineHeight: 1.7 }}>
        Practical advice to help student pilots pass their FAA Airman Knowledge Tests — first try.
      </p>

      <div style={{ display: 'grid', gap: 20 }}>
        {POSTS.map((post) => {
          const tc = tagColors[post.tag] || tagColors['Study Tips'];
          return (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <div className="card" style={{ padding: '24px 28px', transition: 'border-color .2s', cursor: 'pointer' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = ''}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: '.75rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: tc.bg, color: tc.color }}>
                    {post.tag}
                  </span>
                  <span style={{ fontSize: '.78rem', color: 'var(--text3)' }}>{post.date}</span>
                  <span style={{ fontSize: '.78rem', color: 'var(--text3)' }}>· {post.readTime}</span>
                </div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  {post.title}
                </h2>
                <p style={{ color: 'var(--text2)', fontSize: '.92rem', lineHeight: 1.6, margin: 0 }}>
                  {post.excerpt}
                </p>
                <div style={{ marginTop: 14, fontSize: '.85rem', color: 'var(--blue)', fontWeight: 600 }}>
                  Read article →
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="card" style={{ marginTop: 32, textAlign: 'center', padding: '28px 24px', background: 'var(--blue-dim)', borderColor: 'var(--border2)' }}>
        <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>Ready to start studying?</div>
        <p style={{ color: 'var(--text2)', marginBottom: 16, fontSize: '.92rem' }}>
          2,826 authentic FAA practice questions with a timed exam simulator and full explanations.
        </p>
        <Link to="/register" className="btn btn-primary">Start Free →</Link>
      </div>
    </div>
  );
}
