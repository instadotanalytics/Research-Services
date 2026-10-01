import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import SEO from '../components/SEO.jsx';
import ServiceCard from '../components/ServiceCard/ServiceCard.jsx';
import EmptyState from '../components/Loading/EmptyState.jsx';
import { getServices } from '../services/serviceApi.js';
import './Services.css';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .catch(() => setServices([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="svcs-page">
      <SEO
        title="All Services"
        description="Explore our comprehensive research and academic support services including dissertation, thesis, research paper writing and data analysis."
      />

      {/* ========== HERO ========== */}
      <section className="svcs-hero">
        <div className="container">
          <motion.div
            className="svcs-hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="svcs-pill">Our Services</span>
            <h1>Research &amp; Academic Support Services</h1>
            <p>
              Comprehensive, structured and ethical academic support for every stage of your
              research journey.
            </p>
            <div className="svcs-hero-actions">
              <Link to="/contact" className="svcs-btn-orange">
                Get Consultation <ArrowRight size={16} />
              </Link>
              {!loading && services.length > 0 && (
                <span className="svcs-count">{services.length} services to choose from</span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICES GRID ========== */}
      <section className="svcs-section">
        <div className="container">
          {loading ? (
            <div className="svcs-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="svcs-skeleton">
                  <div className="svcs-skeleton-img" />
                  <div className="svcs-skeleton-line" />
                  <div className="svcs-skeleton-line short" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <EmptyState title="No services yet" message="Please check back soon." />
          ) : (
            <div className="svcs-grid">
              {services.map((s, i) => (
                <motion.div key={s._id} {...fadeUp} transition={{ delay: (i % 3) * 0.07 }}>
                  <ServiceCard service={s} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========== CTA (same as Home) ========== */}
      <section className="svcs-cta-wrap">
        <div className="container">
          <div className="svcs-cta-banner">
            <div className="svcs-cta-content">
              <h2>Need Research or Academic Support?</h2>
              <p>
                Talk to our team of experienced research professionals and get guidance tailored
                to your academic goals.
              </p>
            </div>
            <div className="svcs-cta-actions">
              <Link to="/contact" className="svcs-btn-orange">
                <MessageCircle size={18} /> Talk to Our Team
              </Link>
              <Link to="/" className="svcs-btn-ghost">
                Back to Home <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}