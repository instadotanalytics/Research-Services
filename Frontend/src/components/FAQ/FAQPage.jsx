
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Search,
  X,
  HelpCircle,
  MessageCircle,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  SearchX,
  BookOpen,
  GraduationCap,
  FileText,
  BarChart3,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import FAQAccordion from '../../components/FAQ/FAQAccordion.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import CTASection from '../../components/CTA/CTASection.jsx';
import { getFAQs } from '../../services/contentApi.js';
import '../../components/FAQ/FAQ.css';

const TOPICS = [
  { icon: BookOpen, label: 'Services & research support' },
  { icon: FileText, label: 'Process & timelines' },
  { icon: GraduationCap, label: 'Publication assistance' },
  { icon: BarChart3, label: 'Data analysis support' },
];

export default function FAQPage() {
  const reduce = useReducedMotion();

  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to retry the request
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');

  /* ---- data loading (same getFAQs() call as before, plus error + retry) ---- */
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(false);

    getFAQs()
      .then((res) => {
        if (!active) return;
        const data = Array.isArray(res.data) ? res.data : res.data?.data;
        setFaqs(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  /* ---- optional categories: only shown if the loaded data already has them ---- */
  const categories = useMemo(() => {
    const set = new Set(
      faqs.map((f) => (typeof f.category === 'string' ? f.category.trim() : '')).filter(Boolean),
    );
    return set.size > 1 ? ['All', ...set] : [];
  }, [faqs]);

  /* ---- client-side search / filter ---- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter((f) => {
      if (category !== 'All' && (f.category || '').trim() !== category) return false;
      if (!q) return true;
      return `${f.question || ''} ${f.answer || ''}`.toLowerCase().includes(q);
    });
  }, [faqs, query, category]);

  const isFiltering = query.trim() !== '' || category !== 'All';

  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' },
          transition: { duration: 0.4, delay, ease: 'easeOut' },
        };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  return (
    <div className="faq-page">
      <SEO
        title="FAQ"
        description="Find answers to commonly asked questions about our research and academic support services."
      />

      {/* ============================ HERO ============================ */}
      <section className="faq-hero" aria-labelledby="faq-hero-title">
        <span className="faq-hero__shape faq-hero__shape--a" aria-hidden="true" />
        <span className="faq-hero__shape faq-hero__shape--b" aria-hidden="true" />
        <div className="faq-hero__grid" aria-hidden="true" />

        <motion.div
          className="faq-container faq-hero__inner"
          {...(reduce
            ? {}
            : {
                initial: { opacity: 0, y: 16 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.5, ease: 'easeOut' },
              })}
        >
          <span className="faq-eyebrow">
            <HelpCircle size={14} aria-hidden="true" /> FAQ &amp; Support
          </span>
          <h1 id="faq-hero-title">Frequently Asked Questions</h1>
          <p>
            Find answers to common questions about our research, academic support, services,
            process, and engagement.
          </p>
        </motion.div>
      </section>

      {/* ======================== FAQ CONTENT ======================== */}
      <section className="faq-content" aria-label="Frequently asked questions">
        <div className="faq-container faq-layout">
          {/* LEFT — introduction / support card */}
          <aside className="faq-aside">
            <motion.div className="faq-help" {...reveal()}>
              <span className="faq-help__icon">
                <HelpCircle size={22} aria-hidden="true" />
              </span>
              <h2>How can we help?</h2>
              <p>
                Explore answers to common questions about our services, research support, process,
                timelines, and academic assistance.
              </p>

              <ul className="faq-topics">
                {TOPICS.map(({ icon: Icon, label }) => (
                  <li key={label}>
                    <Icon size={16} aria-hidden="true" />
                    <span>{label}</span>
                  </li>
                ))}
              </ul>

              <div className="faq-help__more">
                <strong>Still have questions?</strong>
                <span>Talk to our research support team for personalized guidance.</span>
                <Link to="/contact" className="faq-btn faq-btn--primary">
                  Contact Our Team
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </motion.div>
          </aside>

          {/* RIGHT — search, filters, accordion */}
          <div className="faq-main">
            {/* Search + categories (only when there is data to search) */}
            {!loading && !error && faqs.length > 0 && (
              <div className="faq-toolbar">
                <div className="faq-search">
                  <Search size={18} className="faq-search__icon" aria-hidden="true" />
                  <label htmlFor="faq-search" className="faq-sr">
                    Search frequently asked questions
                  </label>
                  <input
                    id="faq-search"
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search your question..."
                    autoComplete="off"
                  />
                  {query && (
                    <button
                      type="button"
                      className="faq-search__clear"
                      onClick={() => setQuery('')}
                      aria-label="Clear search"
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>

                {categories.length > 0 && (
                  <div className="faq-cats" role="group" aria-label="Filter by category">
                    {categories.map((c) => (
                      <button
                        key={c}
                        type="button"
                        className={`faq-cat${category === c ? ' faq-cat--active' : ''}`}
                        aria-pressed={category === c}
                        onClick={() => setCategory(c)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}

                <p className="faq-count" aria-live="polite">
                  {isFiltering
                    ? `Showing ${filtered.length} of ${faqs.length} questions`
                    : `${faqs.length} ${faqs.length === 1 ? 'question' : 'questions'}`}
                </p>
              </div>
            )}

            {/* LOADING */}
            {loading && (
              <div className="faq-loading" role="status" aria-live="polite" aria-busy="true">
                <LoadingSpinner />
                <div className="faq-skeletons" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((n) => (
                    <div key={n} className="faq-skel" />
                  ))}
                </div>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="faq-state" role="alert">
                <span className="faq-state__icon faq-state__icon--danger">
                  <AlertTriangle size={26} aria-hidden="true" />
                </span>
                <h2>Unable to load FAQs</h2>
                <p>
                  We couldn&rsquo;t load the frequently asked questions right now. Please try
                  again.
                </p>
                <button
                  type="button"
                  className="faq-btn faq-btn--primary"
                  onClick={() => setAttempt((n) => n + 1)}
                >
                  <RefreshCw size={16} aria-hidden="true" />
                  Try Again
                </button>
              </div>
            )}

            {/* EMPTY (no FAQs at all) */}
            {!loading && !error && faqs.length === 0 && (
              <div className="faq-state">
                <span className="faq-state__icon">
                  <MessageCircle size={26} aria-hidden="true" />
                </span>
                <h2>No FAQs available</h2>
                <p>
                  We&rsquo;re currently updating our frequently asked questions. Please contact our
                  team if you need assistance.
                </p>
                <Link to="/contact" className="faq-btn faq-btn--primary">
                  Contact Us
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            )}

            {/* NO SEARCH MATCHES */}
            {!loading && !error && faqs.length > 0 && filtered.length === 0 && (
              <div className="faq-state">
                <span className="faq-state__icon">
                  <SearchX size={26} aria-hidden="true" />
                </span>
                <h2>No matching questions</h2>
                <p>
                  Try different keywords, or reach out to our team and we&rsquo;ll be happy to help.
                </p>
                <div className="faq-state__actions">
                  <button type="button" className="faq-btn faq-btn--outline" onClick={clearFilters}>
                    Clear search
                  </button>
                  <Link to="/contact" className="faq-btn faq-btn--primary">
                    Contact Us
                    <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}

            {/* ACCORDION */}
            {!loading && !error && filtered.length > 0 && <FAQAccordion faqs={filtered} />}
          </div>
        </div>
      </section>

      {/* ==================== STILL HAVE QUESTIONS ==================== */}
      <section className="faq-support-wrap" aria-labelledby="faq-support-title">
        <div className="faq-container">
          <motion.div className="faq-support" {...reveal()}>
            <span className="faq-support__icon">
              <MessageCircle size={24} aria-hidden="true" />
            </span>
            <div className="faq-support__text">
              <h2 id="faq-support-title">Still have questions?</h2>
              <p>
                Our team is available to help you understand our research and academic support
                services.
              </p>
            </div>
            <div className="faq-support__actions">
              <Link to="/contact" className="faq-btn faq-btn--primary">
                Talk to Our Team
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link to="/contact" className="faq-btn faq-btn--outline">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================ CTA ============================ */}
      <div className="faq-cta">
        <CTASection />
      </div>
    </div>
  );
}