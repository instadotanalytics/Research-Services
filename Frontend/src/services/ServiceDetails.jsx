import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Users, ArrowRight, Phone, Sparkles, FileText, ShieldCheck } from 'lucide-react';
import SEO from '../components/SEO';
import FAQAccordion from '../components/FAQ/FAQAccordion.jsx';
import CTASection from '../components/CTA/CTASection.jsx';
import EmptyState from '../components/Loading/EmptyState.jsx';
import { getServiceBySlug } from '../services/serviceApi.js';
import { iconMap } from '../utils/serviceIcons.js';
import { optimizeImage } from '../utils/cloudinary.js';
import './ServiceDetails.css';

/* ---------- Skeleton helpers ---------- */
function Sk({ w = '100%', h = 14, r = 6, style }) {
  return <span className="sd-sk" style={{ width: w, height: h, borderRadius: r, ...style }} />;
}

function ServiceDetailsSkeleton() {
  return (
    <div className="sd-page" aria-busy="true" aria-label="Loading service details">
      {/* HERO */}
      <section className="sd-hero">
        <div className="container sd-hero-inner">
          <div className="sd-sk-row" style={{ marginBottom: 20 }}>
            <Sk w={50} h={12} />
            <Sk w={60} h={12} />
            <Sk w={120} h={12} />
          </div>
          <Sk w={130} h={28} r={999} style={{ marginBottom: 16 }} />
          <Sk w="min(520px, 90%)" h={36} r={10} style={{ marginBottom: 12 }} />
          <Sk w="min(380px, 70%)" h={36} r={10} style={{ marginBottom: 20 }} />
          <Sk w="min(540px, 95%)" h={14} style={{ marginBottom: 10 }} />
          <Sk w="min(420px, 80%)" h={14} style={{ marginBottom: 26 }} />
          <div className="sd-hero-actions">
            <Sk w={200} h={44} r={10} />
            <Sk w={140} h={44} r={10} />
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="sd-body">
        <div className="container sd-layout">
          <div className="sd-main">
            {/* Overview */}
            <div className="sd-block">
              <Sk w={150} h={24} r={8} style={{ marginBottom: 20 }} />
              <Sk h={14} style={{ marginBottom: 12 }} />
              <Sk h={14} style={{ marginBottom: 12 }} />
              <Sk h={14} style={{ marginBottom: 12 }} />
              <Sk w="60%" h={14} />
            </div>

            {/* Features */}
            <div className="sd-block">
              <Sk w={170} h={24} r={8} style={{ marginBottom: 20 }} />
              <div className="sd-features">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="sd-feature">
                    <Sk w={20} h={20} r={999} style={{ flexShrink: 0 }} />
                    <Sk w={i % 2 ? '65%' : '80%'} h={14} />
                  </div>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className="sd-block">
              <Sk w={140} h={24} r={8} style={{ marginBottom: 20 }} />
              <ol className="sd-steps">
                {[...Array(3)].map((_, i) => (
                  <li key={i} className="sd-step">
                    <Sk w={44} h={44} r={999} style={{ flexShrink: 0, position: 'relative', zIndex: 1 }} />
                    <div>
                      <Sk w="40%" h={16} style={{ marginBottom: 10 }} />
                      <Sk h={12} style={{ marginBottom: 8 }} />
                      <Sk w="70%" h={12} />
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Audience */}
            <div className="sd-block">
              <Sk w={160} h={24} r={8} style={{ marginBottom: 20 }} />
              <div className="sd-audience">
                {[130, 160, 110, 150].map((w, i) => (
                  <Sk key={i} w={w} h={36} r={999} />
                ))}
              </div>
            </div>
          </div>

          {/* Aside */}
          <aside className="sd-aside">
            <div className="sd-aside-card">
              <Sk w={46} h={46} r={12} />
              <Sk w="70%" h={20} style={{ marginTop: 4 }} />
              <Sk h={12} />
              <Sk w="85%" h={12} style={{ marginBottom: 6 }} />
              <Sk h={44} r={10} />
              <Sk h={44} r={10} />
              <Sk w="75%" h={12} style={{ margin: '10px auto 0' }} />
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/* ---------- Page ---------- */
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

  if (loading) return <ServiceDetailsSkeleton />;
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