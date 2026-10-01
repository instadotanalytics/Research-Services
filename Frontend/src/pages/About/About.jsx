
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO.jsx';
import {
  Heart,
  Shield,
  Users,
  TrendingUp,
  Check,
  ArrowRight,
} from 'lucide-react';
// react-icons  →  npm i react-icons
import { FiMessageSquare, FiMessageCircle, FiArrowUpRight } from 'react-icons/fi';

// Hero background images (src/assets)
import heroDesktop from '../../assets/about-heroimagedesktop.png';
import heroMobile from '../../assets/about-heroimagemobile.png';
// "Who We Are" section background (desktop). Mobile uses a CSS gradient.
import storyDesktop from '../../assets/about-middleimage desktop.png';
// "Why Choose Us" section background (desktop). Mobile uses a CSS gradient.
import whyDesktop from '../../assets/aboutlastimage.png';

import './About.css';

/* ---- Custom icons for the Mission / Vision cards (match the design) ---- */
function TargetArrowIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="3.4"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="22" cy="26" r="17" />
      <circle cx="22" cy="26" r="9.5" />
      <circle cx="22" cy="26" r="2.6" fill="currentColor" stroke="none" />
      <path d="M23.5 24.5 L40 8" />
      <path d="M40 8 V15 M40 8 H33" />
    </svg>
  );
}

function EyeFilledIcon() {
  return (
    <svg viewBox="0 0 48 34" aria-hidden="true">
      <path
        d="M1.5 17 C8 6, 16 1.5, 24 1.5 C32 1.5, 40 6, 46.5 17 C40 28, 32 32.5, 24 32.5 C16 32.5, 8 28, 1.5 17 Z"
        fill="currentColor"
      />
      <circle cx="24" cy="17" r="8.6" fill="#fff" />
      <circle cx="24" cy="17" r="3.8" fill="currentColor" />
    </svg>
  );
}

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
      {/* Same structure as the Home hero: full-height section, background
          image, a "container" (aligned with the navbar) and one content
          column (max 660px) holding eyebrow, heading, text and stats. */}
      <section className="ab-hero">
        {/* Background: mobile image on phones (<=768px), desktop image elsewhere */}
        <picture className="ab-hero__bg" aria-hidden="true">
          <source media="(max-width: 768px)" srcSet={heroMobile} />
          <img src={heroDesktop} alt="" />
        </picture>

        <div className="container ab-hero__inner">
          <div className="ab-hero__copy">
            <span className="ab-eyebrow">
              <span className="ab-eyebrow__light">About</span>
              <strong>ResearchPlus</strong>
            </span>

            <h1>
              Dedicated to
              <span className="ab-hero__accent"> Academic Excellence</span>
            </h1>

            <p>
              We provide professional research and academic support to students, researchers,
              scholars, faculty members and institutions — with a focus on structure, ethics and
              quality.
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
        </div>
      </section>

      {/* ============================ STORY ============================ */}
      <section className="ab-story">
        {/* Desktop background image (hidden on phones – they get a CSS gradient) */}
        <img className="ab-story__bg" src={storyDesktop} alt="" aria-hidden="true" />

        <div className="container ab-story__grid">
          <div className="ab-story__text">
            <span className="ab-story__eyebrow">Who We Are</span>

            <h2>
              Research support built around{' '}
              <span className="ab-story__hl">
                your work
                <svg
                  className="ab-story__swoosh"
                  viewBox="0 0 220 16"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10 C 48 3, 125 1, 217 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M46 14 C 95 9, 150 8, 192 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
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
              {[
                'Your research remains your own',
                'Ethical guidance, never shortcuts',
                'A transparent process, start to finish',
              ].map((t) => (
                <li key={t}>
                  <span className="ab-story__tick">
                    <Check size={13} strokeWidth={3.2} aria-hidden="true" />
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ab-story__panel">
            <div className="ab-mv-card ab-mv-card--mission">
              <span className="ab-mv-icon">
                <TargetArrowIcon />
              </span>
              <h3>Our Mission</h3>
              <p>
                To empower researchers and academic{' '}
                <br className="ab-br" />
                professionals with structured, ethical and{' '}
                <br className="ab-br" />
                high-quality support that helps them{' '}
                <br className="ab-br" />
                achieve their academic goals.
              </p>
            </div>

            <div className="ab-mv-card ab-mv-card--vision">
              <span className="ab-mv-icon">
                <EyeFilledIcon />
              </span>
              <h3>Our Vision</h3>
              <p>
                To become a trusted academic support{' '}
                <br className="ab-br" />
                partner for researchers, scholars and{' '}
                <br className="ab-br" />
                institutions across disciplines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ VALUES (What Drives Us) ============================ */}
      {/* Light-blue gradient + soft bubbles, same look as the Home page
          sections. No photo background. */}
      <section className="ab-values" aria-labelledby="ab-values-title">
        <div className="container ab-values__inner">
          <div className="ab-values__head">
            <span className="ab-values__eyebrow">What Drives Us</span>
            <h2 id="ab-values-title">
              Our <span className="ab-values__hl">Values</span>
            </h2>
            <p>The principles that shape how we work with every researcher we support.</p>
          </div>

          <div className="ab-values__grid">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="ab-value">
                <span className="ab-value__icon">
                  <Icon size={28} strokeWidth={2} aria-hidden="true" />
                </span>
                <div className="ab-value__body">
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </div>
                <span className="ab-value__arrow" aria-hidden="true">
                  <ArrowRight size={20} strokeWidth={2.2} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================ WHY CHOOSE US ============================ */}
      <section className="ab-why" aria-labelledby="ab-why-title">
        {/* Desktop background image (hidden on phones – they get a CSS gradient) */}
        <img className="ab-why__bg" src={whyDesktop} alt="" aria-hidden="true" />

        <div className="container ab-why__grid">
          <div className="ab-why__side">
            <span className="ab-why__eyebrow">Why Choose Us</span>
            <h2 id="ab-why-title">
              Support you can
              <br />
              <span className="ab-why__hl">rely on</span>
            </h2>
            <p>
              From your initial enquiry to your final submission, we keep your research on track.
              Our team is committed to your success.
            </p>
            <Link to="/contact" className="ab-why__cta">
              Get in touch
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>

          <ul className="ab-why__list">
            {whyUs.map((w) => (
              <li key={w}>
                <span className="ab-why__check">
                  <Check size={16} strokeWidth={3.4} aria-hidden="true" />
                </span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============ BOTTOM CTA (same card style as Contact / FAQ) ============ */}
      <section className="ab-cta" aria-labelledby="ab-cta-title">
        <div className="container">
          <div className="ab-cta__card">
            <span className="ab-cta__icon">
              <FiMessageSquare size={22} aria-hidden="true" />
            </span>

            <div className="ab-cta__text">
              <h2 id="ab-cta-title">Need Research or Academic Support?</h2>
              <p>
                Talk to our team of experienced research professionals and get guidance tailored to
                your academic goals.
              </p>
            </div>

            <div className="ab-cta__actions">
              <Link to="/contact" className="ab-cta__btn ab-cta__btn--primary">
                <FiMessageCircle size={17} aria-hidden="true" />
                Talk to Our Team
              </Link>
              <Link to="/services" className="ab-cta__btn ab-cta__btn--outline">
                Explore Services
                <FiArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}