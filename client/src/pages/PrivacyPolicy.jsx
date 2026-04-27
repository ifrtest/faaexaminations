import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px 80px' }}>
      <Helmet>
        <title>Privacy Policy | FAAExaminations.com</title>
        <meta name="description" content="Privacy policy for FAAExaminations.com — how we collect, use, and protect your personal information." />
        <link rel="canonical" href="https://faaexaminations.com/privacy" />
      </Helmet>
      <h1 style={{ marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>Last updated: April 2026</p>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>1. Who We Are</h2>
        <p>FAAExaminations.com is an online FAA knowledge test preparation service. We are not affiliated with the Federal Aviation Administration. References to "we," "us," or "our" refer to FAAExaminations.com.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>2. Information We Collect</h2>
        <p style={{ marginBottom: 12 }}>We collect the following information when you create an account or purchase a subscription:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--text2)' }}>
          <li>Name and email address (required for account creation)</li>
          <li>Payment information — processed securely by Stripe; we never store your card details</li>
          <li>Exam session data (questions answered, scores, study history) tied to your account</li>
          <li>Basic usage data (pages visited, session duration) collected anonymously via Vercel Analytics</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>3. How We Use Your Information</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--text2)' }}>
          <li>To provide and maintain your account and subscription</li>
          <li>To process payments and send billing confirmations</li>
          <li>To track your exam progress and display your results dashboard</li>
          <li>To send transactional emails (account confirmation, subscription receipts)</li>
          <li>To improve the platform based on aggregate usage patterns</li>
        </ul>
        <p style={{ marginTop: 12 }}>We do not sell your personal information to third parties.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>4. Third-Party Services</h2>
        <p style={{ marginBottom: 8 }}>We use the following third-party services to operate FAAExaminations.com:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--text2)' }}>
          <li><strong>Stripe</strong> — payment processing. Your card details go directly to Stripe and are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--blue)' }}>Stripe's Privacy Policy</a>.</li>
          <li><strong>Vercel</strong> — website hosting and anonymous analytics.</li>
          <li><strong>Render</strong> — backend API hosting.</li>
          <li><strong>Supabase</strong> — database hosting. Your account data is stored in a Supabase-managed PostgreSQL database in Canada (ca-central-1).</li>
          <li><strong>Anthropic Claude API</strong> — powers the AI Instructor feature. Questions you send to AI Instructor may be processed by Anthropic's API.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>5. Cookies</h2>
        <p>We use a JWT token stored in your browser's local storage to keep you logged in. We do not use tracking cookies or advertising cookies.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>6. Data Retention</h2>
        <p>Your account data and exam history are retained for as long as your account is active. If you request account deletion, we will remove your personal data within 30 days. Contact us at <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)' }}>support@faaexaminations.com</a> to request deletion.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>7. Your Rights</h2>
        <p>You have the right to access, correct, or delete your personal data at any time. Email us at <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)' }}>support@faaexaminations.com</a> with any privacy requests.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>8. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or by posting a notice on the site. Continued use of FAAExaminations.com after changes constitutes acceptance of the updated policy.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>9. Contact</h2>
        <p>Questions about this policy? Contact us at <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)' }}>support@faaexaminations.com</a>.</p>
      </section>
    </div>
  );
}
