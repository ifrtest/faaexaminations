// client/src/pages/Blog.jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const POSTS = [
  {
    slug: 'how-to-read-a-metar',
    title: 'How to Read a METAR (With Real Examples)',
    excerpt: 'METARs look confusing at first. They\'re not. Once you learn the structure you can decode one in under a minute — and they show up on every FAA knowledge test.',
    date: 'April 25, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
    image: '/plane-hero-3.webp',
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
  },
  {
    slug: 'faa-written-exam-questions-score-tips',
    title: 'FAA Written Exam: How Many Questions, What Score to Pass & How to Prepare',
    excerpt: 'A complete breakdown of the FAA Airman Knowledge Test format — number of questions per exam, passing scores, time limits, and what happens if you fail.',
    date: 'April 15, 2026',
    readTime: '6 min read',
    tag: 'Study Tips',
  },
  {
    slug: 'instrument-rating-knowledge-test-study-tips',
    title: 'Instrument Rating Knowledge Test: Study Tips That Actually Work',
    excerpt: 'The IRA is the hardest FAA written exam. Here\'s how to tackle the weather, navigation, and regulations topics that trip up most students.',
    date: 'April 10, 2026',
    readTime: '7 min read',
    tag: 'Instrument Rating',
  },
  {
    slug: 'best-faa-test-prep-tools',
    title: 'Best FAA Test Prep Tools Compared (2026)',
    excerpt: 'We compare the most popular FAA knowledge test prep platforms — question banks, features, pricing, and pass rates — so you can choose the right one.',
    date: 'April 5, 2026',
    readTime: '5 min read',
    tag: 'Resources',
  },
  {
    slug: 'common-mistakes-private-pilot-written-exam',
    title: 'Common Mistakes on the Private Pilot Written Exam (And How to Avoid Them)',
    excerpt: 'From weather charts to airspace questions, these are the topics where student pilots lose the most points — and how to make sure you don\'t.',
    date: 'March 28, 2026',
    readTime: '6 min read',
    tag: 'Private Pilot',
  },
  {
    slug: 'faa-license-conversion-foreign-pilots',
    title: 'FAA License Conversion: What Foreign Pilots Need to Know',
    excerpt: 'Holding an ICAO or Transport Canada pilot licence and converting to FAA? Here\'s exactly what knowledge tests you need and how to prepare.',
    date: 'March 20, 2026',
    readTime: '7 min read',
    tag: 'License Conversion',
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
        <meta name="description" content="FAA knowledge test tips, study guides, and exam prep advice for Private Pilot, Instrument Rating, and Commercial Pilot written exams." />
        <link rel="canonical" href="https://www.faaexaminations.com/blog" />
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
