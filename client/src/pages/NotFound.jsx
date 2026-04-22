// client/src/pages/NotFound.jsx
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <div className="container page center-col" style={{ textAlign: 'center', paddingTop: 80 }}>
      <Helmet>
        <title>Page Not Found | FAAExaminations.com</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <div style={{ fontSize: 72, marginBottom: 16 }}>✈️</div>
      <h1 style={{ fontSize: '2rem', marginBottom: 12 }}>404 — Off Course</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 32, maxWidth: 400 }}>
        Looks like this page doesn't exist. Let's get you back on track.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Go to Homepage</Link>
        <Link to="/dashboard" className="btn">Dashboard</Link>
        <Link to="/references" className="btn">Free References</Link>
      </div>
    </div>
  );
}
