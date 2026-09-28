import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Users, ArrowRight, Phone } from 'lucide-react';
import SEO from '../components/SEO';
import FAQAccordion from '../components/FAQ/FAQAccordion.jsx';
import CTASection from '../components/CTA/CTASection.jsx';
import LoadingSpinner from '../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../components/Loading/EmptyState.jsx';
import { getServiceBySlug } from '../services/serviceApi.js';

export default function ServiceDetails() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    window.scrollTo(0, 0);
    getServiceBySlug(slug)
      .then((res) => setService(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (error || !service)
    return (
      <div className="container section">
        <EmptyState title="Service not found" message="The requested service could not be found." />
        <div className="text-center">
          <Link to="/services" className="btn btn-primary">Back to Services</Link>
        </div>
      </div>
    );

  const faqs = (service.faqs || []).map((f, i) => ({ _id: i, question: f.question, answer: f.answer }));

  return (
    <>
      <SEO
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.shortDescription}
      />

      <section className="page-hero" style={{ textAlign: 'left' }}>
        <div className="container">
          <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
            <Link to="/">Home</Link> / <Link to="/services">Services</Link> / <span>{service.title}</span>
          </nav>
          <h1>{service.title}</h1>
          <p style={{ margin: 0 }}>{service.shortDescription}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ maxWidth: 900 }}>
            <h2 style={{ marginBottom: 16 }}>Overview</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.02rem', lineHeight: 1.8 }}>{service.description}</p>
          </div>

          {service.features?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 20 }}>Key Features</h2>
              <div className="grid grid-2">
                {service.features.map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.benefits?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 20 }}>Benefits</h2>
              <div className="grid grid-2">
                {service.benefits.map((b, i) => (
                  <div key={i} className="card" style={{ padding: 20 }}>
                    <strong style={{ color: 'var(--secondary)' }}>{b}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.process?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 20 }}>Our Process</h2>
              <div className="grid grid-2">
                {service.process.map((p, i) => (
                  <div key={i} className="card" style={{ padding: 22 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 6 }}>
                      STEP {String(i + 1).padStart(2, '0')}
                    </div>
                    <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{p.step}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.audience?.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 20 }}>Who Is It For?</h2>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {service.audience.map((a, i) => (
                  <span
                    key={i}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: '#eff6ff',
                      color: 'var(--primary)',
                      padding: '10px 18px',
                      borderRadius: 999,
                      fontWeight: 500,
                      fontSize: '0.9rem',
                    }}
                  >
                    <Users size={16} /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          {faqs.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2 style={{ marginBottom: 20 }}>Frequently Asked Questions</h2>
              <FAQAccordion faqs={faqs} />
            </div>
          )}

          <div style={{ marginTop: 48, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn btn-primary">
              <Phone size={18} /> {service.ctaText || 'Get Research Assistance'}
            </Link>
            <Link to="/services" className="btn btn-outline">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}