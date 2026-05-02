import { Link } from 'react-router-dom';

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          FAA<span style={{ color: 'var(--blue)' }}>Examinations</span>.com
        </div>
        <div style={{ marginBottom: 8, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '4px 0' }}>
          <Link to="/" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Home</Link>
          <Link to="/exams" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Practice Exams</Link>
          <Link to="/dashboard" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Dashboard</Link>
          <Link to="/references" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Free FAA References</Link>
          <Link to="/blog" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Blog</Link>
          <Link to="/about" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>About</Link>
          <Link to="/cancel-policy" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Cancellation &amp; Refund Policy</Link>
          <Link to="/privacy" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Privacy Policy</Link>
          <Link to="/terms" style={{ color: 'var(--text2)', fontSize: '.85rem', marginRight: 16 }}>Terms of Service</Link>
          <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--text2)', fontSize: '.85rem' }}>support@faaexaminations.com</a>
        </div>
        {/* Payment method logos */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, margin: '10px 0', flexWrap: 'wrap' }}>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 3, padding: '2px 4px', opacity: 0.7 }}>
            <text x="4" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="13" fill="#1a1f71">VISA</text>
          </svg>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 3, opacity: 0.7 }}>
            <circle cx="14" cy="12" r="7" fill="#EB001B"/>
            <circle cx="24" cy="12" r="7" fill="#F79E1B"/>
            <path d="M19 6.8a7 7 0 0 1 0 10.4A7 7 0 0 1 19 6.8z" fill="#FF5F00"/>
          </svg>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#2671b2', borderRadius: 3, padding: '2px 3px', opacity: 0.7 }}>
            <text x="2" y="16" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="9" fill="#fff">AMEX</text>
          </svg>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 3, padding: '2px 3px', opacity: 0.7 }}>
            <text x="1" y="11" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7" fill="#231f20">DISC-</text>
            <text x="1" y="19" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="7" fill="#231f20">OVER</text>
            <circle cx="30" cy="12" r="6" fill="#F76F20"/>
          </svg>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#000', borderRadius: 3, padding: '3px 5px', opacity: 0.7 }}>
            <text x="4" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#fff">Apple</text>
            <text x="4" y="18" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#fff">Pay</text>
          </svg>
          <svg width="34" height="22" viewBox="0 0 38 24" fill="none" style={{ background: '#fff', borderRadius: 3, padding: '3px 4px', opacity: 0.7 }}>
            <text x="1" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#4285F4">G</text>
            <text x="7" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#EA4335">o</text>
            <text x="12" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#FBBC05">o</text>
            <text x="17" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#34A853">g</text>
            <text x="22" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#EA4335">l</text>
            <text x="25" y="10" fontFamily="Arial,sans-serif" fontWeight="500" fontSize="6" fill="#4285F4">e</text>
            <text x="4" y="19" fontFamily="Arial,sans-serif" fontWeight="700" fontSize="7" fill="#5F6368">Pay</text>
          </svg>
        </div>
        <div>
          © {new Date().getFullYear()} FAAExaminations.com · FAA practice exams for student pilots ·
          Not affiliated with the Federal Aviation Administration
        </div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 20px', fontSize: '.78rem', color: 'var(--text2)', opacity: 0.6 }}>
          <div style={{ display: 'flex', gap: 14 }}>
            <a href="https://www.facebook.com/profile.php?id=61550998640330" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Facebook"><FacebookIcon /></a>
            <a href="https://www.instagram.com/faaexaminations" target="_blank" rel="noopener noreferrer"
              style={{ color: 'var(--text2)', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0.7}
              title="Instagram"><InstagramIcon /></a>
          </div>
          <span style={{ opacity: 0.4 }}>·</span>
          <span>Designed by <a href="https://websitework.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>websitework.ca</a></span>
          <span style={{ opacity: 0.4 }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Canadian pilots:
            <img src="/maple-leaf.png" alt="🍁" style={{ width: 12, height: 12 }} />
            <a href="https://ifrtest.ca" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text2)' }}>ifrtest.ca</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
