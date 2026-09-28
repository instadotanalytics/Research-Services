import { useEffect, useState } from 'react';
import SEO from '../../components/SEO.jsx';
import FAQAccordion from '../../components/FAQ/FAQAccordion.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import CTASection from '../../components/CTA/CTASection.jsx';
import { getFAQs } from '../../services/contentApi.js';

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFAQs()
      .then((res) => setFaqs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="FAQ" description="Find answers to commonly asked questions about our research and academic support services." />
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">FAQ</span>
          <h1>Frequently Asked Questions</h1>
          <p>Answers to common questions about our research and academic support services.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {loading ? <LoadingSpinner fullScreen /> : <FAQAccordion faqs={faqs} />}
        </div>
      </section>
      <CTASection />
    </>
  );
}