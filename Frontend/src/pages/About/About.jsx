
import SEO from '../../components/SEO.jsx';
import CTASection from '../../components/CTA/CTASection.jsx';
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import './About.css';

const values = [
  { icon: Shield, title: 'Integrity', desc: 'Ethical, transparent support with no misleading claims.' },
  { icon: Heart, title: 'Commitment', desc: 'Dedicated attention to every research project we support.' },
  { icon: Users, title: 'Collaboration', desc: 'We work with you, not for you — your research remains your own.' },
  { icon: TrendingUp, title: 'Excellence', desc: 'A commitment to academic quality and structured delivery.' },
];

const whyUs = [
  'Experienced research professionals across disciplines',
  'Structured, transparent support process',
  'Data-driven analysis with standard tools',
  'Personalized academic guidance',
  'Complete confidentiality of your work',
  'Timely, dependable assistance',
];

const stats = [
  { value: '500+', label: 'Researchers supported' },
  { value: '50+', label: 'Disciplines covered' },
  { value: '10+', label: 'Years of combined experience' },
  { value: '24h', label: 'Average response time' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about our mission to support researchers, scholars, and academic institutions with professional research guidance."
      />

      {/* ============================ HERO ============================ */}
      <section className="ab-hero">
        <div className="container ab-hero__inner">
          <span className="ab-eyebrow">About ResearchPlus</span>

          <h1>
            Dedicated to
            <span className="ab-hero__accent"> Academic Excellence</span>
          </h1>

          <p>
            We provide professional research and academic support to students, researchers, scholars,
            faculty members and institutions — with a focus on structure, ethics and quality.
          </p>

          <ul className="ab-stats">
            {stats.map((s) => (
              <li key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================ STORY ============================ */}
      <section className="ab-story">
        <div className="container ab-story__grid">
          <div className="ab-story__text">
            <span className="ab-kicker">Who We Are</span>
            <h2>
              Research support built around <em>your</em> work
            </h2>
            <p>
              We are a research and academic support service built to help researchers and academic
              professionals succeed in their academic journey. Our team assists with dissertations,
              theses, research papers, data analysis, proposals, faculty development and academic
              documentation.
            </p>
            <p>
              We provide expert guidance at every stage while making sure the work you submit remains
              your own original contribution.
            </p>

            <ul className="ab-story__points">
              <li>
                <CheckCircle size={18} aria-hidden="true" />
                <span>Your research remains your own</span>
              </li>
              <li>
                <CheckCircle size={18} aria-hidden="true" />
                <span>Ethical guidance, never shortcuts</span>
              </li>
              <li>
                <CheckCircle size={18} aria-hidden="true" />
                <span>A transparent process, start to finish</span>
              </li>
            </ul>
          </div>

          <div className="ab-story__panel">
            <div className="ab-mv-card">
              <span className="ab-mv-icon">
                <Target size={24} aria-hidden="true" />
              </span>
              <h3>Our Mission</h3>
              <p>
                To empower researchers and academic professionals with structured, ethical and
                high-quality support that helps them achieve their academic goals.
              </p>
            </div>

            <div className="ab-mv-card ab-mv-card--alt">
              <span className="ab-mv-icon">
                <Eye size={24} aria-hidden="true" />
              </span>
              <h3>Our Vision</h3>
              <p>
                To become a trusted academic support partner for researchers, scholars and institutions
                across disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ VALUES ============================ */}
      <section className="ab-values">
        <div className="container">
          <div className="ab-section-head">
            <span className="ab-kicker">What Drives Us</span>
            <h2>Our Values</h2>
            <p>The principles that shape how we work with every researcher we support.</p>
          </div>

          <div className="ab-values__grid">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="ab-value">
                <span className="ab-value__icon">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ WHY CHOOSE US ============================ */}
      <section className="ab-why">
        <div className="container ab-why__grid">
          <div className="ab-why__side">
            <span className="ab-kicker">Why Choose Us</span>
            <h2>Support you can rely on</h2>
            <p>
              From your first enquiry to your final submission, we keep the process clear, honest and
              focused on your success.
            </p>
            <a href="/contact" className="ab-why__cta">
              Get in touch
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>

          <ul className="ab-why__list">
            {whyUs.map((w) => (
              <li key={w}>
                <span className="ab-why__check">
                  <CheckCircle size={18} aria-hidden="true" />
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection />
    </>
  );
}