import { useEffect, useState } from 'react';
import SEO from '../components/SEO.jsx';
import ServiceCard from '../components/ServiceCard/ServiceCard.jsx';
import EmptyState from '../components/Loading/EmptyState.jsx';
import CTASection from '../components/CTA/CTASection.jsx';
import { getServices } from '../services/serviceApi.js';
import './Services.css';

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
    <>
      <SEO
        title="All Services"
        description="Explore our comprehensive research and academic support services including dissertation, thesis, research paper writing and data analysis."
      />

      <section className="svcs-hero">
        <div className="container">
          <span className="svcs-pill">Our Services</span>
          <h1>Research &amp; Academic Support Services</h1>
          <p>
            Comprehensive, structured and ethical academic support for every stage of your
            research journey.
          </p>
          {!loading && services.length > 0 && (
            <div className="svcs-count">{services.length} services to choose from</div>
          )}
        </div>
      </section>

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
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </>
  );
}