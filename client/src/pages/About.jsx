import { Helmet } from 'react-helmet-async';

export default function About() {
  return (
    <div className="container" style={{ maxWidth: 720, margin: '60px auto', padding: '0 24px 80px' }}>
      <Helmet>
        <title>About Us | FAAExaminations.com</title>
        <meta name="description" content="FAAExaminations.com was built by a certified flight instructor and a web developer after COVID shut down the airline industry. Here's our story." />
        <link rel="canonical" href="https://www.faaexaminations.com/about" />
        <meta property="og:title" content="About FAAExaminations.com" />
        <meta property="og:description" content="Built by a CFI and a web developer. 3,000+ FAA practice questions for Private Pilot, Instrument Rating, Commercial, and Part 107." />
        <meta property="og:url" content="https://www.faaexaminations.com/about" />
      </Helmet>
      <h1 style={{ marginBottom: 8 }}>About FAAExaminations.com</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 48 }}>Built by pilots, for pilots.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 40 }}>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img
            src="/about-ash-leila.jpg"
            alt="Leila and Ash in the cockpit"
            style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center center', display: 'block' }}
          />
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text2)', opacity: 0.5, padding: '8px 0 10px' }}>Leila &amp; Ash</div>
        </div>
        <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img
            src="/about-ash.jpg"
            alt="Ash in pilot uniform"
            style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center 30%', display: 'block' }}
          />
          <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--text2)', opacity: 0.5, padding: '8px 0 10px' }}>Ash — Certified Flight Instructor</div>
        </div>
      </div>

      <div style={{ lineHeight: 1.85, fontSize: '1.05rem', color: 'var(--text2)' }}>
        <p style={{ marginBottom: 24 }}>
          In March 2020, Ash was just days away from starting his first airline job. Years of exams, ratings, simulator hours, and early mornings had all led to that moment. Then the world shut down — and just like that, the opportunity was gone.
        </p>
        <p style={{ marginBottom: 24 }}>
          What followed was a difficult stretch. A lot of uncertainty, a lot of questions, and the challenge of figuring out what comes next when everything you've worked toward suddenly disappears. But one thought kept coming back: was all of that effort really going to lead nowhere?
        </p>
        <p style={{ marginBottom: 24 }}>
          Around the same time, student pilots Ash had trained began reaching out — checking in, asking if he was still teaching, looking for guidance. It became clear that stepping away wasn't really an option.
        </p>
        <p style={{ marginBottom: 24 }}>
          So we started building. I'm a web developer, and Ash is a flight instructor with deep expertise in the FAA exam system. Our first version wasn't great — we were figuring everything out from scratch: how to structure a question bank, what platform to use, how to make it all actually work. But we kept improving it. When we began integrating AI to explain questions and support students, it finally became what we had originally set out to create.
        </p>
        <p style={{ marginBottom: 24 }}>
          We've used nearly every FAA exam prep resource out there, and we built this to be better — simpler, clearer, and more effective.
        </p>
        <p style={{ marginBottom: 48 }}>
          The real validation comes from students who come back and tell us they passed. That's why we do this.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 20,
        marginBottom: 48,
      }}>
        {[
          { label: 'Flight Instructor', desc: 'FAA-certified CFI behind all the content' },
          { label: 'Web Developer', desc: 'Full-stack engineer behind the platform' },
          { label: '3,000+ Questions', desc: 'Covering PAR, IRA, CAX, Part 107, and TRUST' },
          { label: 'Since 2020', desc: 'Built from the ground up, continuously improved' },
        ].map(({ label, desc }) => (
          <div key={label} style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 24px',
          }}>
            <div style={{ fontWeight: 700, color: 'var(--blue)', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: '.875rem', color: 'var(--text2)' }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '28px 32px',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 8, fontSize: '1rem', color: 'var(--text1)' }}>Questions or feedback?</div>
        <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)', textDecoration: 'none', fontWeight: 600 }}>
          support@faaexaminations.com
        </a>
      </div>
    </div>
  );
}
