import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const COMPETITORS = [
  {
    name: 'FAAExaminations.com',
    tag: '★ Best Value',
    tagColor: 'var(--blue)',
    price: '$24.99/exam',
    trial: '3-day free trial',
    questions: { par: '1,469', ira: '900+', cax: '1,000+', p107: '300+' },
    explanations: true,
    aiInstructor: true,
    cheatSheet: true,
    freeTest: true,
    mobileFriendly: true,
    highlight: true,
  },
  {
    name: 'Sheppard Air',
    tag: null,
    price: '$34.95–$49.95',
    trial: 'No free trial',
    questions: { par: 'Full bank', ira: 'Full bank', cax: 'Full bank', p107: 'Yes' },
    explanations: false,
    aiInstructor: false,
    cheatSheet: false,
    freeTest: false,
    mobileFriendly: true,
    highlight: false,
  },
  {
    name: 'King Schools',
    tag: null,
    price: '$119–$219',
    trial: 'No (money-back)',
    questions: { par: 'Full bank', ira: 'Full bank', cax: 'Full bank', p107: 'Yes' },
    explanations: true,
    aiInstructor: false,
    cheatSheet: false,
    freeTest: false,
    mobileFriendly: true,
    highlight: false,
  },
  {
    name: "Sporty's",
    tag: null,
    price: 'Free – $149',
    trial: 'Free questions (limited)',
    questions: { par: 'Full bank', ira: 'Partial', cax: 'Partial', p107: 'Yes' },
    explanations: true,
    aiInstructor: false,
    cheatSheet: false,
    freeTest: true,
    mobileFriendly: true,
    highlight: false,
  },
];

const CHECK = '✓';
const CROSS = '✗';

const FAQS = [
  {
    q: 'Is FAAExaminations.com better than Sheppard Air?',
    a: 'It depends on your learning style. Sheppard Air is a pure memorization system — it trains you to recognize patterns in the question bank and score high. FAAExaminations.com covers the full question bank too, but adds detailed explanations for every question so you actually understand the material. If you want to understand why the answer is correct (not just memorize it), FAAExaminations.com is the stronger choice. It\'s also significantly cheaper at $24.99 vs $34.95–$49.95.',
  },
  {
    q: 'How does FAAExaminations.com compare to King Schools?',
    a: 'King Schools is a video-based course with a large brand reputation and a very high price ($119–$219). FAAExaminations.com is a focused question-bank platform at $24.99 — no video lectures, just the most efficient path to exam-ready. If you want video lessons bundled with your prep, King is worth considering. If you already have ground school or just need to nail the written test, FAAExaminations.com covers the same question bank at a fraction of the cost.',
  },
  {
    q: 'What makes FAAExaminations.com different from other FAA test prep sites?',
    a: 'Three things: (1) Every question has a detailed explanation written by a Certified Flight Instructor — not just the correct answer. (2) A built-in AI Instructor answers follow-up questions on each topic during your practice tests. (3) A free downloadable cheat sheet for each exam that condenses the highest-yield formulas and rules. No other prep site at this price point offers all three.',
  },
  {
    q: 'Is there a free trial for FAAExaminations.com?',
    a: 'Yes — FAAExaminations.com offers a 3-day free trial. Your card is required to start but you won\'t be charged for the first 3 days. Cancel any time before day 4 and pay nothing. Each exam also has a free practice test (30 questions, no login required) you can try before signing up.',
  },
  {
    q: 'Which FAA exam prep site has the most questions?',
    a: 'FAAExaminations.com covers the full FAA question banks: 1,469 questions for the Private Pilot (PAR), and full banks for IRA, CAX, and Part 107. The FAA draws all real exam questions from these published banks, so full-bank coverage is the most important feature to look for in any prep site.',
  },
  {
    q: 'What is the cheapest FAA written exam prep?',
    a: 'FAAExaminations.com is $24.99 per exam — one of the lowest prices among full-bank prep sites. Sporty\'s offers limited free content. Sheppard Air runs $34.95–$49.95. King Schools is $119–$219. For the combination of price, full question bank, and CFI-written explanations, FAAExaminations.com offers the best value.',
  },
];

export default function ComparisonPage() {
  return (
    <div style={{ background: 'var(--charcoal)', minHeight: '100vh' }}>
      <Helmet>
        <title>FAA Exam Prep Comparison 2026 — FAAExaminations vs Sheppard Air vs King Schools vs Sporty's</title>
        <meta name="description" content="Compare the top FAA written exam prep sites: FAAExaminations.com vs Sheppard Air vs King Schools vs Sporty's. Price, question counts, features, and honest pros/cons for PAR, IRA, CAX, and Part 107." />
        <link rel="canonical" href="https://faaexaminations.com/faa-exam-prep-comparison" />
        <meta property="og:title" content="FAA Exam Prep Comparison 2026 — Which Site Is Best?" />
        <meta property="og:description" content="Honest comparison of the top FAA knowledge test prep sites. Price, features, question counts — everything you need to pick the right one." />
        <meta property="og:url" content="https://faaexaminations.com/faa-exam-prep-comparison" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: FAQS.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'FAA Exam Prep Site Comparison 2026',
          url: 'https://faaexaminations.com/faa-exam-prep-comparison',
          description: 'An honest comparison of the top FAA knowledge test prep platforms including FAAExaminations.com, Sheppard Air, King Schools, and Sporty\'s.',
          publisher: { '@type': 'Organization', name: 'FAAExaminations.com', url: 'https://faaexaminations.com' },
        })}</script>
      </Helmet>

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '60px 24px 100px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--blue-dim)',
            border: '1px solid var(--border2)',
            borderRadius: 99,
            padding: '4px 16px',
            fontSize: '0.78rem',
            color: 'var(--blue)',
            fontFamily: 'var(--font-cond)',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}>
            2026 · Updated Regularly
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontFamily: 'var(--font-cond)', fontWeight: 800, color: 'var(--text)', lineHeight: 1.15, marginBottom: 16 }}>
            FAA Exam Prep Site Comparison
          </h1>
          <p style={{ color: 'var(--text2)', fontSize: '1.05rem', maxWidth: 580, margin: '0 auto', lineHeight: 1.7 }}>
            FAAExaminations.com vs Sheppard Air vs King Schools vs Sporty's — an honest, feature-by-feature breakdown
            so you can pick the right prep site for your exam.
          </p>
        </div>

        {/* Quick verdict cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 48 }}>
          {[
            { label: 'Best Overall Value', winner: 'FAAExaminations.com', reason: 'Full bank + explanations + AI at $24.99' },
            { label: 'Best for Memorization', winner: 'Sheppard Air', reason: 'Pattern-drill system, very high pass rate' },
            { label: 'Best Video Course', winner: 'King Schools', reason: 'Video lectures + question bank bundled' },
            { label: 'Best Free Option', winner: "Sporty's", reason: 'Solid free practice questions, no credit card' },
          ].map(v => (
            <div key={v.label} style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '16px 14px',
            }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text3)', fontFamily: 'var(--font-cond)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>{v.label}</div>
              <div style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{v.winner}</div>
              <div style={{ color: 'var(--text3)', fontSize: '0.78rem', lineHeight: 1.5 }}>{v.reason}</div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <h2 style={{ fontFamily: 'var(--font-cond)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: 20 }}>Feature Comparison</h2>

        <div style={{ overflowX: 'auto', marginBottom: 56 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr>
                <th style={thLeft}>Feature</th>
                {COMPETITORS.map(c => (
                  <th key={c.name} style={{
                    ...thCenter,
                    background: c.highlight ? 'rgba(48,172,226,0.10)' : 'var(--panel)',
                    color: c.highlight ? 'var(--blue)' : 'var(--text)',
                    borderTop: c.highlight ? '2px solid var(--blue)' : '1px solid var(--border)',
                  }}>
                    {c.name}
                    {c.tag && <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--blue)', fontWeight: 700, marginTop: 2 }}>{c.tag}</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Price', key: 'price' },
                { label: 'Free Trial', key: 'trial' },
                { label: 'PAR Questions', key: 'par', nested: 'questions' },
                { label: 'IRA Questions', key: 'ira', nested: 'questions' },
                { label: 'CAX Questions', key: 'cax', nested: 'questions' },
                { label: 'Part 107 Questions', key: 'p107', nested: 'questions' },
                { label: 'Detailed Explanations', key: 'explanations', bool: true },
                { label: 'AI Instructor', key: 'aiInstructor', bool: true },
                { label: 'Free Cheat Sheet', key: 'cheatSheet', bool: true },
                { label: 'Free Practice Test', key: 'freeTest', bool: true },
                { label: 'Mobile Friendly', key: 'mobileFriendly', bool: true },
              ].map((row, i) => (
                <tr key={row.label} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td style={tdLeft}>{row.label}</td>
                  {COMPETITORS.map(c => {
                    const val = row.nested ? c[row.nested][row.key] : c[row.key];
                    return (
                      <td key={c.name} style={{
                        ...tdCenter,
                        background: c.highlight ? 'rgba(48,172,226,0.05)' : 'transparent',
                        fontWeight: c.highlight ? 600 : 400,
                        color: row.bool
                          ? (val ? 'var(--green)' : 'var(--text3)')
                          : (c.highlight ? 'var(--text)' : 'var(--text2)'),
                      }}>
                        {row.bool ? (val ? CHECK : CROSS) : val}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Head-to-head sections */}
        <h2 style={{ fontFamily: 'var(--font-cond)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: 24 }}>Head-to-Head Breakdowns</h2>

        {[
          {
            title: 'FAAExaminations.com vs Sheppard Air',
            anchor: 'vs-sheppard-air',
            body: `Sheppard Air built its reputation on one thing: getting you to pass. Their system drills the exact FAA question bank through pattern recognition — study long enough and you'll recognize every question on the real exam. It works, and their pass rate is genuinely impressive.\n\nThe trade-off is that Sheppard Air doesn't explain anything. You learn to recognize the correct answer pattern, not the aerodynamic or regulatory principle behind it. For many students that's fine — you just need to pass the written test.\n\nFAAExaminations.com covers the same full question bank, but every question has a CFI-written explanation. You understand *why* the answer is correct. This matters more in some areas than others — weather and aerodynamics stick better when you understand the physics, not just the answer letter. It's also $10–$25 cheaper per exam.`,
            verdict: 'If pure memorization efficiency is your goal, Sheppard Air is proven. If you want to understand the material (helpful for the checkride oral exam too), FAAExaminations.com is the better investment.',
          },
          {
            title: 'FAAExaminations.com vs King Schools',
            anchor: 'vs-king-schools',
            body: `King Schools is a video course first, question bank second. John and Martha King have been in aviation education for decades, and the brand carries real weight. Their explanations are delivered through video lessons, and the full course includes a money-back pass guarantee.\n\nThe price gap is significant: King runs $119–$219 vs $24.99 at FAAExaminations.com. For that premium you get video instruction — ideal if you're starting ground school from zero.\n\nIf you already have a ground school (whether through a Part 141 school, a CFI, or a separate video course), paying $119+ for King just to access the question bank is hard to justify. FAAExaminations.com covers the full question bank with CFI-written explanations at a fraction of the cost.`,
            verdict: 'King Schools is worth it if you need structured video ground school. For question-bank-only prep, FAAExaminations.com delivers the same coverage at 80% less.',
          },
          {
            title: "FAAExaminations.com vs Sporty's",
            anchor: 'vs-sportys',
            body: `Sporty's is the most accessible option — they offer free practice questions and a solid reputation. Their free tier covers a reasonable number of PAR questions and is a good way to gauge your current level before committing to a paid site.\n\nFor IRA and CAX, Sporty's free coverage becomes more limited, and you'd need their paid course to access the full bank. Their paid course is video-based and priced similarly to King Schools.\n\nFAAExaminations.com is the better choice once you're ready to do serious prep — full question bank, question-by-question explanations, and a 3-day free trial that gives you risk-free access to everything before committing.`,
            verdict: "Sporty's free practice tests are a great starting point. When you're ready to commit to structured prep with the full question bank, FAAExaminations.com is more efficient and less expensive.",
          },
        ].map(section => (
          <div key={section.anchor} id={section.anchor} style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '28px 28px 24px',
            marginBottom: 20,
          }}>
            <h3 style={{ fontFamily: 'var(--font-cond)', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text)', marginBottom: 16 }}>{section.title}</h3>
            {section.body.split('\n\n').map((para, i) => (
              <p key={i} style={{ color: 'var(--text2)', lineHeight: 1.75, marginBottom: 14, fontSize: '0.95rem' }}>{para}</p>
            ))}
            <div style={{
              background: 'var(--blue-dim)',
              border: '1px solid var(--border2)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px 16px',
              marginTop: 8,
            }}>
              <span style={{ color: 'var(--blue)', fontWeight: 700, fontSize: '0.85rem', fontFamily: 'var(--font-cond)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Verdict: </span>
              <span style={{ color: 'var(--text)', fontSize: '0.9rem' }}>{section.verdict}</span>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div style={{
          background: 'var(--panel)',
          border: '1px solid var(--border2)',
          borderRadius: 'var(--radius)',
          padding: '36px 28px',
          textAlign: 'center',
          margin: '48px 0',
        }}>
          <h2 style={{ fontFamily: 'var(--font-cond)', fontWeight: 800, fontSize: '1.5rem', color: 'var(--text)', marginBottom: 10 }}>Try FAAExaminations.com Free</h2>
          <p style={{ color: 'var(--text2)', marginBottom: 24, lineHeight: 1.7 }}>
            3-day free trial — full access to the complete question bank, CFI explanations, and AI Instructor.<br />
            Cancel before day 4 and pay nothing.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/par-practice-test" className="btn btn-ghost" style={{ fontSize: '0.9rem' }}>Try PAR Free Test</Link>
            <Link to="/par" className="btn btn-primary" style={{ fontSize: '0.9rem' }}>Start 3-Day Trial →</Link>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['/par-practice-test', '/ira-practice-test', '/cax-practice-test', '/part-107-practice-test'].map((path, i) => (
              <Link key={path} to={path} style={{ color: 'var(--text3)', fontSize: '0.82rem' }}>
                {['PAR', 'IRA', 'CAX', 'Part 107'][i]} Free Test
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ section */}
        <h2 style={{ fontFamily: 'var(--font-cond)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--text)', marginBottom: 24 }}>Frequently Asked Questions</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {FAQS.map(faq => (
            <details key={faq.q} style={{
              background: 'var(--panel)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              padding: '18px 20px',
            }}>
              <summary style={{
                cursor: 'pointer',
                fontWeight: 700,
                color: 'var(--text)',
                fontSize: '0.95rem',
                listStyle: 'none',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 12,
              }}>
                {faq.q}
                <span style={{ color: 'var(--blue)', flexShrink: 0, fontSize: '1.1rem' }}>+</span>
              </summary>
              <p style={{ color: 'var(--text2)', lineHeight: 1.75, marginTop: 14, fontSize: '0.93rem' }}>{faq.a}</p>
            </details>
          ))}
        </div>

        {/* Bottom nav */}
        <div style={{ borderTop: '1px solid var(--border)', marginTop: 60, paddingTop: 32 }}>
          <p style={{ color: 'var(--text3)', fontSize: '0.82rem', marginBottom: 16 }}>Explore by exam:</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { path: '/par', label: 'Private Pilot (PAR)' },
              { path: '/ira', label: 'Instrument Rating (IRA)' },
              { path: '/cax', label: 'Commercial Pilot (CAX)' },
              { path: '/part-107', label: 'Part 107 Drone' },
            ].map(l => (
              <Link key={l.path} to={l.path} style={{
                background: 'var(--panel)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 14px',
                fontSize: '0.85rem',
                color: 'var(--text2)',
              }}>{l.label}</Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const thLeft = {
  textAlign: 'left',
  padding: '12px 16px',
  background: 'var(--panel2)',
  color: 'var(--text3)',
  fontSize: '0.8rem',
  fontFamily: 'var(--font-cond)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid var(--border)',
  fontWeight: 700,
  minWidth: 140,
};

const thCenter = {
  textAlign: 'center',
  padding: '12px 16px',
  fontSize: '0.85rem',
  fontWeight: 700,
  borderBottom: '1px solid var(--border)',
  borderLeft: '1px solid var(--border)',
  minWidth: 130,
};

const tdLeft = {
  padding: '11px 16px',
  color: 'var(--text2)',
  fontSize: '0.88rem',
  borderBottom: '1px solid rgba(48,172,226,0.08)',
};

const tdCenter = {
  padding: '11px 16px',
  textAlign: 'center',
  fontSize: '0.88rem',
  borderBottom: '1px solid rgba(48,172,226,0.08)',
  borderLeft: '1px solid rgba(48,172,226,0.08)',
};
