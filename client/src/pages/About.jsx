export default function About() {
  return (
    <div className="container" style={{ maxWidth: 720, margin: '60px auto', padding: '0 24px 80px' }}>
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
          In March 2020, Ash was days away from his first day flying for an airline. Years of exams, ratings, simulator hours, early mornings — all of it was supposed to finally pay off that week. Then the world shut down. The call came. Just like that, it was gone.
        </p>
        <p style={{ marginBottom: 24 }}>
          The months that followed were genuinely hard. Depression, a lot of uncertainty, a lot of not knowing what to do with yourself when the thing you'd worked toward just disappears. But we kept coming back to the same question: were we really going to let all of that mean nothing? Every exam, every flight hour, every night with the books.
        </p>
        <p style={{ marginBottom: 24 }}>
          It wasn't just us asking either. Student pilots who'd been training with Ash kept reaching out. Checking in. Asking if he was still teaching, what we were doing. We didn't want to let them down on top of everything else.
        </p>
        <p style={{ marginBottom: 24 }}>
          So we started building. I'm a web developer. Ash is a flight instructor who knows the FAA exam system cold. Our first version was bad — genuinely bad. We didn't know how to structure a question database, which platform to use, how to stop things from falling apart. We figured it out anyway. When I started integrating AI into the platform, it finally became what we'd been trying to make the whole time.
        </p>
        <p style={{ marginBottom: 48 }}>
          We've been through every FAA exam prep site out there. We haven't found one we think is better. And when students email us after they pass their test — that's why we built it.
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
