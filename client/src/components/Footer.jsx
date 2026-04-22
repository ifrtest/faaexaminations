import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          FAA<span style={{ color: 'var(--blue)' }}>Examinations</span>.com
        </div>
        <div style={{ marginBottom: 8 }}>
          <Link to="/references" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>
            Free FAA References
          </Link>
          <Link to="/cancel-policy" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>
            Cancellation &amp; Refund Policy
          </Link>
          <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--text2)', fontSize: '.85rem' }}>
            support@faaexaminations.com
          </a>
        </div>
        <div>
          © {new Date().getFullYear()} FAAExaminations.com · FAA practice exams for student pilots ·
          Not affiliated with the Federal Aviation Administration
        </div>
        <div style={{ marginTop: 6, fontSize: '.78rem', color: 'var(--text2)', opacity: 0.6 }}>
          Designed by <a href="https://websitework.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>websitework.ca</a>
        </div>
        <div style={{ marginTop: 4, fontSize: '.78rem', color: 'var(--text2)', opacity: 0.6 }}>
          Our Canadian Partner <span style={{ color: '#ff0000' }}>🍁</span>{' '}
          <a href="https://ifrtest.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>ifrtest.ca</a>
        </div>
      </div>
    </footer>
  );
}
