import { Helmet } from 'react-helmet-async';

export default function TermsOfService() {
  return (
    <div className="container" style={{ maxWidth: 760, margin: '60px auto', padding: '0 24px 80px' }}>
      <Helmet>
        <title>Terms of Service | FAAExaminations.com</title>
        <meta name="description" content="Terms of service for FAAExaminations.com — your rights and responsibilities when using our FAA exam prep platform." />
        <link rel="canonical" href="https://www.faaexaminations.com/terms" />
      </Helmet>
      <h1 style={{ marginBottom: 8 }}>Terms of Service</h1>
      <p style={{ color: 'var(--text2)', marginBottom: 40 }}>Last updated: April 2026</p>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>1. Acceptance of Terms</h2>
        <p>By creating an account or purchasing a subscription on FAAExaminations.com, you agree to these Terms of Service. If you do not agree, do not use this service.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>2. Description of Service</h2>
        <p>FAAExaminations.com provides FAA Airman Knowledge Test preparation materials including practice questions, study modules, exam simulators, and an AI-assisted instructor feature. We are an independent educational service and are not affiliated with the Federal Aviation Administration (FAA).</p>
        <p style={{ marginTop: 8 }}>Practice questions are for educational purposes only. Passing our practice exams does not guarantee passing the official FAA Airman Knowledge Test.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>3. Subscriptions and Billing</h2>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--text2)' }}>
          <li>Subscriptions are billed monthly and renew automatically until cancelled.</li>
          <li>Payment is processed securely through Stripe. We do not store your payment details.</li>
          <li>You may cancel your subscription at any time from the <a href="/cancel-policy" style={{ color: 'var(--blue)' }}>Cancellation &amp; Refund Policy</a> page. Access continues until the end of the current billing period.</li>
          <li>Subscription fees are non-refundable except where required by applicable law.</li>
          <li>We reserve the right to change subscription pricing with 30 days' notice to existing subscribers.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>4. Free Account and Demo Access</h2>
        <p>Creating a free account gives you access to a 10-question Private Pilot (PAR) sample in Study Mode and the free TRUST recreational drone safety test. Full exam access requires a paid subscription.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>5. Acceptable Use</h2>
        <p style={{ marginBottom: 8 }}>You agree not to:</p>
        <ul style={{ paddingLeft: 20, lineHeight: 2, color: 'var(--text2)' }}>
          <li>Share your account credentials with others</li>
          <li>Scrape, copy, or reproduce question content for redistribution</li>
          <li>Use automated tools to access the platform</li>
          <li>Attempt to reverse-engineer or circumvent access controls</li>
        </ul>
        <p style={{ marginTop: 12 }}>Violation of these terms may result in immediate account termination without refund.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>6. Intellectual Property</h2>
        <p>All content on FAAExaminations.com — including question explanations, module structure, UI design, and AI-generated responses — is the property of FAAExaminations.com. FAA source material (regulations, testing supplements) is in the public domain. You may not reproduce our proprietary content without written permission.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>7. Disclaimer of Warranties</h2>
        <p>FAAExaminations.com is provided "as is" without warranty of any kind. We make no guarantee that our practice questions reflect the exact questions you will encounter on your FAA Airman Knowledge Test, as the FAA periodically updates its question banks. We are not responsible for exam outcomes.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>8. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, FAAExaminations.com is not liable for any indirect, incidental, or consequential damages arising from use of this service, including but not limited to exam failure, loss of study time, or interruption of service.</p>
      </section>

      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>9. Changes to Terms</h2>
        <p>We may update these Terms of Service from time to time. Continued use of the service after changes are posted constitutes acceptance of the updated terms. We will notify users of material changes by email.</p>
      </section>

      <section>
        <h2 style={{ fontSize: '1.15rem', marginBottom: 12 }}>10. Contact</h2>
        <p>Questions about these terms? Contact us at <a href="mailto:support@faaexaminations.com" style={{ color: 'var(--blue)' }}>support@faaexaminations.com</a>.</p>
      </section>
    </div>
  );
}
