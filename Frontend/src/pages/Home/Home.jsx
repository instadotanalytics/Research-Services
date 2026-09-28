import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Award, Users, Building2, FileText, Shield, Clock, Target, TrendingUp, UserCheck, BookOpen,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import ServiceCard from '../../components/ServiceCard/ServiceCard.jsx';
import CTASection from '../../components/CTA/CTASection.jsx';
import FAQAccordion from '../../components/FAQ/FAQAccordion.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import { getServices } from '../../services/serviceApi.js';
import { getStatistics, getTestimonials, getFAQs } from '../../services/contentApi.js';
import './Home.css';

const iconMap = { Award, Users, Building2, FileText };

const whyUs = [
  { icon: UserCheck, title: 'Experienced Research Support', desc: 'Guidance from professionals with academic research expertise across disciplines.' },
  { icon: Target, title: 'Structured Approach', desc: 'A clear, step-by-step process for every engagement — no guesswork.' },
  { icon: TrendingUp, title: 'Data-Driven Analysis', desc: 'Statistical analysis using industry-standard tools like SPSS, R and Python.' },
  { icon: Users, title: 'Personalized Guidance', desc: 'Support tailored to your research topic, stage and institution requirements.' },
  { icon: Shield, title: 'Complete Confidentiality', desc: 'Your work, data and identity are always kept strictly confidential.' },
  { icon: Clock, title: 'Timely Assistance', desc: 'Structured timelines and dependable support to keep you on track.' },
];

const process = [
  { step: '01', title: 'Submit Your Requirement', desc: 'Share your topic, stage and deadlines through our enquiry form.' },
  { step: '02', title: 'Requirement Analysis', desc: 'Our team assesses the scope and plans the support approach.' },
  { step: '03', title: 'Research Planning', desc: 'A structured plan and timeline are prepared for your project.' },
  { step: '04', title: 'Development & Analysis', desc: 'Guided writing, analysis and refinement in a structured manner.' },
  { step: '05', title: 'Review & Assistance', desc: 'Iterative reviews and refinements based on your feedback.' },
  { step: '06', title: 'Final Delivery', desc: 'Final handover of complete, formatted, submission-ready material.' },
];

const audience = [
  { icon: Users, title: 'Students' },
  { icon: Award, title: 'PhD Scholars' },
  { icon: BookOpen, title: 'Researchers' },
  { icon: UserCheck, title: 'Faculty' },
  { icon: Building2, title: 'Colleges' },
  { icon: Building2, title: 'Schools' },
  { icon: Building2, title: 'Institutions' },
];

export default function Home() {
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getStatistics(), getTestimonials(), getFAQs()])
      .then(([s, st, t, f]) => {
        setServices(s.data);
        setStats(st.data);
        setTestimonials(t.data);
        setFaqs(f.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Research & Academic Support Services"
        description="Professional research and academic support services for students, researchers, scholars and educational institutions."
      />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">
              <Award size={14} /> Trusted Academic Support
            </span>
            <h1>
              Empowering Research. <span>Supporting Academic Excellence.</span>
            </h1>
            <p>
              Professional research and academic support services for students, researchers, scholars and educational
              institutions.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn btn-primary">
                Explore Services <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Get Consultation
              </Link>
            </div>
            <div className="hero-trust">
              <div className="hero-trust-item">
                <strong>500+</strong>
                <span>Projects Supported</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <strong>200+</strong>
                <span>Papers Assisted</span>
              </div>
              <div className="hero-trust-divider" />
              <div className="hero-trust-item">
                <strong>100+</strong>
                <span>Scholars Guided</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="hero-card hero-card-1">
              <div className="hero-card-icon"><FileText size={22} /></div>
              <div>
                <strong>Research Papers</strong>
                <span>Writing & Publication Support</span>
              </div>
            </div>
            <div className="hero-card hero-card-2">
              <div className="hero-card-icon"><BookOpen size={22} /></div>
              <div>
                <strong>Thesis & Dissertation</strong>
                <span>Structured Academic Guidance</span>
              </div>
            </div>
            <div className="hero-card hero-card-3">
              <div className="hero-card-icon"><TrendingUp size={22} /></div>
              <div>
                <strong>Data Analysis</strong>
                <span>SPSS • R • Python</span>
              </div>
            </div>
            <div className="hero-blob" />
          </motion.div>
        </div>
      </section>

      {/* STATISTICS */}
      {stats.length > 0 && (
        <section className="stats-section">
          <div className="container">
            <div className="stats-grid">
              {stats.map((s, i) => {
                const Icon = iconMap[s.icon] || Award;
                return (
                  <motion.div
                    key={s._id}
                    className="stat-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Icon size={28} className="stat-icon" />
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-title">{s.title}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Our Services</span>
            <h2>Comprehensive Research & Academic Support</h2>
            <p>Expert guidance across every stage of your academic research journey.</p>
          </div>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-3">
              {services.map((s) => (
                <ServiceCard key={s._id} service={s} />
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/services" className="btn btn-outline">
              View All Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Why Choose Us</span>
            <h2>Built on Expertise, Trust & Structure</h2>
            <p>We combine academic expertise with a structured, transparent approach.</p>
          </div>
          <div className="grid grid-3">
            {whyUs.map((w, i) => (
              <motion.div
                key={i}
                className="card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="why-icon"><w.icon size={24} /></div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: 8 }}>{w.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{w.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Our Process</span>
            <h2>Structured Research Support Process</h2>
            <p>A clear, six-step workflow from requirement to delivery.</p>
          </div>
          <div className="process-grid">
            {process.map((p, i) => (
              <motion.div
                key={i}
                className="process-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="process-number">{p.step}</div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section" style={{ background: '#fff' }}>
        <div className="container">
          <div className="section-header">
            <span className="eyebrow">Who We Support</span>
            <h2>For Every Academic Stakeholder</h2>
          </div>
          <div className="audience-grid">
            {audience.map((a, i) => (
              <div key={i} className="audience-card">
                <a.icon size={26} />
                <span>{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">Testimonials</span>
              <h2>What Our Clients Say</h2>
            </div>
            <div className="grid grid-3">
              {testimonials.slice(0, 6).map((t) => (
                <div key={t._id} className="card testimonial-card">
                  <div className="stars">
                    {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                  </div>
                  <p className="testimonial-review">"{t.review}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.designation}{t.institution ? ` • ${t.institution}` : ''}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="section" style={{ background: '#fff' }}>
          <div className="container">
            <div className="section-header">
              <span className="eyebrow">FAQ</span>
              <h2>Frequently Asked Questions</h2>
            </div>
            <FAQAccordion faqs={faqs.slice(0, 6)} />
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}