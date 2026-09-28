import SEO from '../../components/SEO.jsx';

export default function Disclaimer() {
  return (
    <>
      <SEO title="Disclaimer" description="Important disclaimer regarding our research and academic support services." />
      <section className="page-hero">
        <div className="container">
          <h1>Disclaimer</h1>
          <p>Important information about our services.</p>
        </div>
      </section>
      <section className="section">
        <div className="container" style={{ maxWidth: 800, color: 'var(--text-muted)', lineHeight: 1.8 }}>
          <h2 style={{ color: 'var(--text)' }}>Academic Guidance Only</h2>
          <p>Our services provide academic guidance and support. They are not a substitute for your own original research work. Users must ensure all final submissions comply with their institution's academic integrity policies.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>No Guarantees</h2>
          <p>We do not guarantee publication, acceptance, marks, degrees, grants or any specific academic outcome. Outcomes depend on external factors including peer review, institutional policies and evaluation bodies.</p>
          <h2 style={{ color: 'var(--text)', marginTop: 24 }}>Third-Party Decisions</h2>
          <p>Decisions made by journals, universities, funding bodies and evaluators are outside our control.</p>
        </div>
      </section>
    </>
  );
}