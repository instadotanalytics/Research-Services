import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Award, Users, Building2, FileText, BookOpen, Search, GraduationCap,
  ClipboardList, ClipboardCheck, PenLine, BarChart3, Settings, PackageCheck, ShieldCheck,
  Target, UserCheck, Clock, Plus, Minus, ChevronLeft, ChevronRight, Newspaper, Database,
  Lightbulb, School, Landmark, FlaskConical, FolderOpen, MessageCircle,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { getTestimonials, getFAQs } from '../../services/contentApi.js';
import herobanner from '../../assets/herobanner.png';
import heroimg from '../../assets/heroimg.png';
import './Home.css';

/* ---------- STATIC CONTENT ---------- */
const heroStats = [
  { icon: FolderOpen, value: '500+', label: 'Research Projects Supported' },
  { icon: FileText, value: '200+', label: 'Research Papers Assisted' },
  { icon: GraduationCap, value: '100+', label: 'Scholars Supported' },
  { icon: Building2, value: '50+', label: 'Academic Institutions' },
];

const services = [
  { icon: FileText, title: 'Dissertation Writing', desc: 'Well-researched and professionally written dissertations tailored to your needs.' },
  { icon: PenLine, title: 'Research Paper Writing', desc: 'High-quality research papers with proper structure and referencing.' },
  { icon: Newspaper, title: 'Research Paper Publication Assistance', desc: 'Guidance for journal selection, formatting and submission support.' },
  { icon: BookOpen, title: 'Thesis Writing', desc: 'Plagiarism-free thesis with in-depth research and analysis.' },
  { icon: UserCheck, title: 'Synopsis Writing', desc: 'Well-structured synopsis for your research proposal.' },
  { icon: Database, title: 'Data Collection & Analysis', desc: 'Accurate data collection, analysis and meaningful insights.' },
  { icon: Users, title: 'Faculty Development Program (FDP)', desc: 'Customized FDP programs for faculty and institutions.' },
  { icon: Lightbulb, title: 'Research Proposal Writing', desc: 'Professional research proposals for funding and academic projects.' },
  { icon: School, title: 'College & School Academic Writing', desc: 'Assignments, projects, reports and academic content support.' },
];

const whyUs = [
  { icon: Award, title: 'Experienced Support', desc: 'Skilled professionals with domain expertise.' },
  { icon: Target, title: 'Structured Approach', desc: 'Well-defined process for best results.' },
  { icon: BarChart3, title: 'Data-Driven Analysis', desc: 'Accurate and reliable research insights.' },
  { icon: Users, title: 'Personalized Guidance', desc: 'Support tailored to your specific needs.' },
  { icon: ShieldCheck, title: 'Confidentiality', desc: 'Your data and information are always safe.' },
  { icon: Clock, title: 'Timely Assistance', desc: 'On-time delivery and clear communication.' },
];

const process = [
  { icon: FileText, title: 'Submit Your Requirement', desc: 'Tell us your needs and expectations.' },
  { icon: Search, title: 'Requirement Analysis', desc: 'We understand your requirements in detail.' },
  { icon: ClipboardList, title: 'Research Planning', desc: 'Create a customized plan for your project.' },
  { icon: Settings, title: 'Development / Analysis', desc: 'Work on research, writing and data analysis.' },
  { icon: ClipboardCheck, title: 'Review & Assistance', desc: 'Quality check and revisions if needed.' },
  { icon: PackageCheck, title: 'Final Delivery', desc: 'On-time delivery with complete support.' },
];

const audience = [
  { icon: GraduationCap, title: 'Students' },
  { icon: Search, title: 'PhD Scholars' },
  { icon: FlaskConical, title: 'Researchers' },
  { icon: Users, title: 'Faculty' },
  { icon: School, title: 'Schools' },
  { icon: Landmark, title: 'Institutions' },
];

const defaultTestimonials = [
  { _id: 't1', name: 'Priya Sharma', designation: 'M.Sc. Student', institution: 'Delhi University', rating: 5, review: 'The team at ResearchPlus helped me with my dissertation. The quality of work and timely delivery was excellent. Highly recommended!' },
  { _id: 't2', name: 'Rahul Verma', designation: 'PhD Scholar', institution: 'IIT Roorkee', rating: 5, review: 'Professional, supportive and very knowledgeable team. They guided me well throughout my research paper publication process.' },
  { _id: 't3', name: 'Sneha Patel', designation: 'Assistant Professor', institution: 'SPPU', rating: 5, review: 'The FDP program was well-structured and very informative. It helped me improve my teaching and research skills.' },
];

const defaultFaqs = [
  { _id: 'f1', question: 'What types of services do you offer?', answer: 'We offer dissertation, thesis, synopsis and research paper writing, publication assistance, data analysis, FDP programs and academic writing support.' },
  { _id: 'f2', question: 'Do you provide revisions?', answer: 'Yes. Iterative reviews and revisions are part of our process until you are satisfied with the work.' },
  { _id: 'f3', question: 'Is your work plagiarism-free?', answer: 'Yes. All work is written from scratch and checked with plagiarism detection tools.' },
  { _id: 'f4', question: 'Can I get a refund if I’m not satisfied?', answer: 'Please review our Refund Policy. We aim to resolve every concern through revisions first.' },
  { _id: 'f5', question: 'How long does it take to complete a project?', answer: 'Timelines depend on the scope and stage of your project. We share a clear timeline after requirement analysis.' },
  { _id: 'f6', question: 'How do I contact your support team?', answer: 'You can reach us through the contact form, email, phone or WhatsApp.' },
  { _id: 'f7', question: 'How do I make a payment?', answer: 'We accept UPI, bank transfer and other online payment methods. Details are shared after confirmation.' },
  { _id: 'f8', question: 'Are your services available for international clients?', answer: 'Yes. We support students, scholars and institutions across the globe.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

function useIsMobile(query = '(max-width: 768px)') {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}

/* ---------- COMPONENT ---------- */

export default function Home() {
  const isMobile = useIsMobile();
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [openFaq, setOpenFaq] = useState(null);
  const [tIndex, setTIndex] = useState(0);
  const [sIndex, setSIndex] = useState(0);
  const servicesScrollRef = useRef(null);

  useEffect(() => {
    Promise.all([getTestimonials(), getFAQs()])
      .then(([t, f]) => {
        if (t?.data?.length) setTestimonials(t.data);
        if (f?.data?.length) setFaqs(f.data);
      })
      .catch(console.error);
  }, []);

  // Testimonials logic
  const visibleCount = Math.min(3, testimonials.length);
  const visibleTestimonials = Array.from({ length: visibleCount }, (_, i) =>
    testimonials[(tIndex + i) % testimonials.length]
  );
  const prevT = () => setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const nextT = () => setTIndex((i) => (i + 1) % testimonials.length);

  // Services scroll logic (mobile only)
  const scrollToService = (index) => {
    if (servicesScrollRef.current) {
      const cardWidth = servicesScrollRef.current.children[0]?.offsetWidth || 0;
      servicesScrollRef.current.scrollTo({
        left: index * (cardWidth + 16), // 16px gap
        behavior: 'smooth',
      });
      setSIndex(index);
    }
  };
  const prevS = () => scrollToService(Math.max(0, sIndex - 1));
  const nextS = () => scrollToService(Math.min(services.length - 1, sIndex + 1));

  // Reset services index on desktop
  useEffect(() => {
    if (!isMobile) setSIndex(0);
  }, [isMobile]);

  const renderArrows = (cls, onPrev, onNext) => (
    <div className={cls}>
      <button type="button" onClick={onPrev} aria-label="Previous"><ChevronLeft size={18} /></button>
      <button type="button" onClick={onNext} aria-label="Next"><ChevronRight size={18} /></button>
    </div>
  );

  const shownFaqs = faqs.slice(0, 8);
  const half = Math.ceil(shownFaqs.length / 2);
  const faqCols = [shownFaqs.slice(0, half), shownFaqs.slice(half)];

  const renderFaq = (f) => {
    const open = openFaq === f._id;
    return (
      <div key={f._id} className={`faq-item ${open ? 'open' : ''}`}>
        <button
          type="button"
          className="faq-q"
          onClick={() => setOpenFaq(open ? null : f._id)}
          aria-expanded={open}
        >
          <span>{f.question}</span>
          {open ? <Minus size={16} /> : <Plus size={16} />}
        </button>
        {open && <p className="faq-a">{f.answer}</p>}
      </div>
    );
  };

  return (
    <>
      <SEO
        title="Research & Academic Support Services"
        description="Professional research and academic support services for students, researchers, scholars and educational institutions."
      />

      {/* ========== HERO ========== */}
      <section
        className="home-section hero"
        style={isMobile ? undefined : { '--hero-bg': `url(${herobanner})` }}
      >
        <div className="container hero-inner">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="pill">Your Research Partner</span>
            <h1>Empowering Research. Supporting Academic Excellence.</h1>
            <p>
              Professional research and academic support services for students, researchers,
              scholars and educational institutions.
            </p>
            <div className="hero-actions">
              <Link to="/services" className="btn-orange">
                Explore Services <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-ghost">Get Consultation</Link>
            </div>

            <div className="hero-stats">
              {heroStats.map((s) => (
                <div key={s.label} className="hero-stat">
                  <s.icon size={24} />
                  <div>
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== SERVICES ========== */}
      <section className="home-section section-alt">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="pill">Our Services</span>
              <h2>Comprehensive Research & Academic Support</h2>
              <p>
                We offer a wide range of academic and research services to help you achieve
                your goals with confidence and quality.
              </p>
            </div>
            <Link to="/services" className="link-arrow">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>

          {/* Mobile scroll with arrows, desktop grid */}
          <div className="services-grid-wrapper">
            <div className="services-grid" ref={servicesScrollRef}>
              {services.map((s, i) => (
                <motion.div key={s.title} className="service-card" {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <div className="icon-box"><s.icon size={22} /></div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <Link to="/services" className="learn-more">
                    Learn More <ArrowRight size={13} />
                  </Link>
                </motion.div>
              ))}
            </div>
            {/* Mobile arrows (only visible on mobile) */}
            <div className="services-arrows-mobile">
              {renderArrows('arrows', prevS, nextS)}
            </div>
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="home-section">
        <div className="container why-inner">
          <div className="why-content">
            <span className="pill">Why Choose Us</span>
            <h2>Your Success Is Our Priority</h2>
            <p>
              We are committed to providing high-quality, reliable and plagiarism-free academic
              support with a professional approach.
            </p>
            <div className="why-grid">
              {whyUs.map((w, i) => (
                <motion.div key={w.title} className="why-item" {...fadeUp} transition={{ delay: i * 0.06 }}>
                  <div className="why-icon"><w.icon size={18} /></div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {!isMobile && (
            <div className="why-visual">
              <img src={heroimg} alt="Research, analysis, writing and success" className="side-img" />
            </div>
          )}
        </div>
      </section>

      {/* ========== PROCESS ========== */}
      <section className="home-section section-alt">
        <div className="container">
          <div className="section-head">
            <span className="pill">Our Process</span>
            <h2>Simple 6-Step Research Support Process</h2>
            <p>We follow a transparent and systematic process to ensure the best results.</p>
          </div>
          <div className="process-grid">
            {process.map((p, i) => (
              <motion.div key={p.title} className="process-card" {...fadeUp} transition={{ delay: i * 0.07 }}>
                <span className="process-num">{String(i + 1).padStart(2, '0')}</span>
                <div className="process-icon"><p.icon size={30} /></div>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== AUDIENCE ========== */}
      <section className="home-section">
        <div className="container">
          <div className="section-head">
            <span className="pill">Who We Work With</span>
            <h2>Supporting a Wide Range of Researchers & Learners</h2>
            <p>We serve students, scholars, researchers, faculty and educational institutions across the globe.</p>
          </div>
          <div className="audience-grid">
            {audience.map((a, i) => (
              <motion.div key={a.title} className="audience-card" {...fadeUp} transition={{ delay: i * 0.06 }}>
                <span className="audience-num">{String(i + 1).padStart(2, '0')}</span>
                <a.icon size={30} />
                <span className="audience-title">{a.title}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="home-section section-alt">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="pill">Testimonials</span>
              <h2>What Our Clients Say</h2>
              <p>Trusted by students, researchers and institutions for quality and reliability.</p>
            </div>
            {renderArrows('arrows arrows-top', prevT, nextT)}
          </div>

          <div className="testimonial-grid">
            {visibleTestimonials.map((t) => (
              <div key={t._id} className="testimonial-card">
                <div className="testimonial-top">
                  <div className="testimonial-avatar">{t.name.charAt(0).toUpperCase()}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.designation}{t.institution ? `, ${t.institution}` : ''}</span>
                    <div className="stars">{'★'.repeat(t.rating || 5)}</div>
                  </div>
                </div>
                <p>“{t.review}”</p>
              </div>
            ))}
          </div>
          {renderArrows('arrows arrows-bottom', prevT, nextT)}
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section className="home-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="pill">Frequently Asked Questions</span>
              <h2>Got Questions? We’re Here to Help</h2>
              <p>Find answers to the most common questions about our services.</p>
            </div>
            <Link to="/faq" className="link-arrow">
              View All FAQs <ArrowRight size={14} />
            </Link>
          </div>
          <div className="faq-grid">
            {faqCols.map((col, i) => (
              <div key={i} className="faq-col">{col.map(renderFaq)}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="home-section cta-wrap">
        <div className="container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Need Research or Academic Support?</h2>
              <p>Talk to our team of experienced research professionals and get guidance tailored to your academic goals.</p>
            </div>
            <div className="cta-actions">
              <Link to="/contact" className="btn-orange">
                <MessageCircle size={18} /> Talk to Our Team
              </Link>
              <Link to="/services" className="btn-ghost btn-ghost-light">
                Explore Services <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}