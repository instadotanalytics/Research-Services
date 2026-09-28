import SEO from '../../components/SEO.jsx';

export default function RefundPolicy() {
  return (
    <>
      <SEO title="Refund Policy" description="Refund policy for our research and academic support services." />
      <section className="page-hero">
        <div className="container">
          <h1>Refund Policy</h1>
          <p>Our commitment to transparent service delivery.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: 'var(--text)' }}>1. Service Cancellation</h2>
          <p>Refund eligibility depends on the stage of service delivery at the time of cancellation.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>2. Before Work Commencement</h2>
          <p>If cancellation occurs before work has commenced, a full refund (minus any transaction fees) may be issued.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>3. After Work Commencement</h2>
          <p>If work has already begun, refunds are assessed proportionally based on completed deliverables.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>4. Non-Refundable Cases</h2>
          <p>Completed and delivered services are non-refundable.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>5. How to Request</h2>
          <p>Refund requests should be sent via email to info@research.com with details of the engagement.</p>
        </div>
      </section>
    </>
  );
}