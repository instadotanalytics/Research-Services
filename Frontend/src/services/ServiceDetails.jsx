import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Users, ArrowRight, Phone, Sparkles, FileText, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import FAQAccordion from '../components/FAQ/FAQAccordion.jsx';
import CTASection from '../components/CTA/CTASection.jsx';
import LoadingSpinner from '../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../components/Loading/EmptyState.jsx';
import { getServiceBySlug } from '../services/serviceApi.js';
import { iconMap } from '../utils/serviceIcons.js';
import { optimizeImage } from '../utils/cloudinary.js';
import './ServiceDetails.css';

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

  const Icon = iconMap[service.icon] || FileText;
  const heroImg = optimizeImage(service.image, 1600);
  const faqs = (service.faqs || []).map((f, i) => ({ _id: i, question: f.question, answer: f.answer }));
  const cta = service.ctaText || 'Get Research Assistance';

  return (
    <div className="sd-page">
      <SEO
        title={service.seoTitle || service.title}
        description={service.seoDescription || service.shortDescription}
      />

      {/* ============ HERO ============ */}
      <section className={`sd-hero ${heroImg ? 'has-img' : ''}`}>
        {heroImg && <img className="sd-hero-img" src={heroImg} alt="" />}
        <div className="sd-hero-overlay" />
        <div className="container sd-hero-inner">
          <nav className="sd-crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link><span>/</span>
            <Link to="/services">Services</Link><span>/</span>
            <em>{service.title}</em>
          </nav>

          <span className="sd-chip"><Icon size={15} /> Academic Service</span>
          <h1>{service.title}</h1>
          <p>{service.shortDescription}</p>

          <div className="sd-hero-actions">
            <Link to="/contact" className="sd-btn sd-btn-orange">
              <Phone size={17} /> {cta}
            </Link>
            {service.process?.length > 0 && (
              <a href="#sd-process" className="sd-btn sd-btn-ghost">How it works</a>
            )}
          </div>
        </div>
      </section>

      {/* ============ BODY ============ */}
      <section className="sd-body">
        <div className="container sd-layout">
          <div className="sd-main">
            <div className="sd-block">
              <h2 className="sd-h2">Overview</h2>
              <p className="sd-lead">{service.description}</p>
            </div>

            {service.features?.length > 0 && (
              <div className="sd-block">
                <h2 className="sd-h2">Key Features</h2>
                <div className="sd-features">
                  {service.features.map((f, i) => (
                    <div key={i} className="sd-feature">
                      <CheckCircle2 size={20} />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.benefits?.length > 0 && (
              <div className="sd-block">
                <h2 className="sd-h2">Benefits</h2>
                <div className="sd-benefits">
                  {service.benefits.map((b, i) => (
                    <div key={i} className="sd-benefit">
                      <span className="sd-benefit-icon"><Sparkles size={16} /></span>
                      <strong>{b}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {service.process?.length > 0 && (
              <div className="sd-block" id="sd-process">
                <h2 className="sd-h2">Our Process</h2>
                <ol className="sd-steps">
                  {service.process.map((p, i) => (
                    <li key={i} className="sd-step">
                      <span className="sd-step-num">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h3>{p.step}</h3>
                        <p>{p.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {service.audience?.length > 0 && (
              <div className="sd-block">
                <h2 className="sd-h2">Who Is It For?</h2>
                <div className="sd-audience">
                  {service.audience.map((a, i) => (
                    <span key={i}><Users size={15} /> {a}</span>
                  ))}
                </div>
              </div>
            )}

            {faqs.length > 0 && (
              <div className="sd-block">
                <h2 className="sd-h2">Frequently Asked Questions</h2>
                <FAQAccordion faqs={faqs} />
              </div>
            )}
          </div>

          {/* ---- sticky side card ---- */}
          <aside className="sd-aside">
            <div className="sd-aside-card">
              <span className="sd-aside-icon"><Icon size={22} /></span>
              <h3>Ready to get started?</h3>
              <p>Tell us about your requirement and our team will get back to you within 24 hours.</p>
              <Link to="/contact" className="sd-btn sd-btn-orange sd-btn-block">
                <Phone size={17} /> {cta}
              </Link>
              <Link to="/services" className="sd-btn sd-btn-ghost sd-btn-block">
                View All Services <ArrowRight size={16} />
              </Link>
              <div className="sd-aside-note">
                <ShieldCheck size={16} /> 100% confidential &amp; ethical support
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CTASection />
    </div>
  );
}