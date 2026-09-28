import SEO from '../../components/SEO.jsx';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy" description="Read our privacy policy to understand how we collect and protect your information." />
      <section className="page-hero">
        <div className="container">
          <h1>Privacy Policy</h1>
          <p>How we collect, use and protect your information.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: 'var(--text)' }}>1. Information We Collect</h2>
          <p>We collect information you voluntarily provide through enquiry forms, including name, email, phone, institution, service interest and message content.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>2. How We Use Information</h2>
          <p>Your information is used solely to respond to your enquiries and provide the requested research and academic support services.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>3. Confidentiality</h2>
          <p>All research material, personal information and communications are treated as strictly confidential.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>4. Data Security</h2>
          <p>We use reasonable technical and organizational measures to protect your information from unauthorized access.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>5. Third Parties</h2>
          <p>We do not sell or share your personal information with third parties for marketing purposes.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>6. Contact</h2>
          <p>For privacy-related queries, contact us at info@research.com.</p>
        </div>
      </section>
    </>
  );
}