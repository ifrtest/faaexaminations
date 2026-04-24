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
      <div style={{ marginBottom: 16 }}><svg width="72" height="72" viewBox="0 0 24 24" fill="var(--blue)" xmlns="http://www.w3.org/2000/svg"><path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg></div>
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
