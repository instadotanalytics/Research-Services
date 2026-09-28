import { useEffect, useState } from 'react';
import SEO from '../components/SEO.jsx';
import ServiceCard from '../components/ServiceCard/ServiceCard.jsx';
import LoadingSpinner from '../components/Loading/LoadingSpinner.jsx';
import CTASection from '../components/CTA/CTASection.jsx';
import { getServices } from '../services/serviceApi.js';

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServices()
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="All Services" description="Explore our comprehensive research and academic support services including dissertation, thesis, research paper writing and data analysis." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Our Services</span>
          <h1>Research & Academic Support Services</h1>
          <p>Comprehensive, structured and ethical academic support for every stage of your research journey.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {loading ? (
            <LoadingSpinner fullScreen />
          ) : (
            <div className="grid grid-3">
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