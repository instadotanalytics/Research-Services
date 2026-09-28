import SEO from '../../components/SEO.jsx';

export default function Terms() {
  return (
    <>
      <SEO title="Terms & Conditions" description="Terms and conditions for using our research and academic support services." />
      <section className="page-hero">
        <div className="container">
          <h1>Terms & Conditions</h1>
          <p>Please read these terms carefully before using our services.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: 'var(--text)' }}>1. Services</h2>
          <p>We provide research and academic support services. We do not guarantee publication, marks, admission or specific academic outcomes.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>2. Ethical Use</h2>
          <p>Our services are intended for guidance and support only. Users are responsible for ensuring their final submission complies with their institution's academic integrity policies.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>3. Confidentiality</h2>
          <p>All client information and documents are kept strictly confidential.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>4. Payments</h2>
          <p>Payment terms are discussed and agreed before service commencement.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>5. Limitation of Liability</h2>
          <p>We provide best-effort academic support and are not liable for academic outcomes determined by third parties.</p>
        </div>
      </section>
    </>
  );
}