import { useEffect, useState } from 'react';
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
import { getServices } from '../../services/serviceApi.js';
import herobanner from '../../assets/herobanner.png';
import herobanner2 from '../../assets/herobanner2.png';
import heroimg from '../../assets/heroimg.png';
import ServiceCard from '../../components/ServiceCard/ServiceCard.jsx';
import './Home.css';

const heroStats = [
  { icon: FolderOpen, value: '500+', label: 'Research Projects Supported' },
  { icon: FileText, value: '200+', label: 'Research Papers Assisted' },
  { icon: GraduationCap, value: '100+', label: 'Scholars Supported' },
  { icon: Building2, value: '50+', label: 'Academic Institutions' },
];

const defaultServices = [
  { _id: 's1', icon: 'FileText', title: 'Dissertation Writing', shortDescription: 'Well-researched and professionally written dissertations tailored to your needs.' },
  { _id: 's2', icon: 'PenLine', title: 'Research Paper Writing', shortDescription: 'High-quality research papers with proper structure and referencing.' },
  { _id: 's3', icon: 'Newspaper', title: 'Research Paper Publication Assistance', shortDescription: 'Guidance for journal selection, formatting and submission support.' },
  { _id: 's4', icon: 'BookOpen', title: 'Thesis Writing', shortDescription: 'In-depth thesis support with strong research and analysis.' },
  { _id: 's5', icon: 'UserCheck', title: 'Synopsis Writing', shortDescription: 'Well-structured synopsis for your research proposal.' },
  { _id: 's6', icon: 'Database', title: 'Data Collection & Analysis', shortDescription: 'Accurate data collection, analysis and meaningful insights.' },
  { _id: 's7', icon: 'Users', title: 'Faculty Development Program (FDP)', shortDescription: 'Customized FDP programs for faculty and institutions.' },
  { _id: 's8', icon: 'Lightbulb', title: 'Research Proposal Writing', shortDescription: 'Professional research proposals for funding and academic projects.' },
  { _id: 's9', icon: 'School', title: 'College & School Academic Writing', shortDescription: 'Assignments, projects, reports and academic content support.' },
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
  { icon: FileText, title: 'Submit Your Requirement', desc: 'Tell us your needs and expectations.', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=70' },
  { icon: Search, title: 'Requirement Analysis', desc: 'We understand your requirements in detail.', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=600&q=70' },
  { icon: ClipboardList, title: 'Research Planning', desc: 'Create a customized plan for your project.', image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=70' },
  { icon: Settings, title: 'Development / Analysis', desc: 'Work on research, writing and data analysis.', image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?auto=format&fit=crop&w=600&q=70' },
  { icon: ClipboardCheck, title: 'Review & Assistance', desc: 'Quality check and revisions if needed.', image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=70' },
  { icon: PackageCheck, title: 'Final Delivery', desc: 'On-time delivery with complete support.', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=600&q=70' },
];

const audience = [
  { icon: GraduationCap, title: 'Students', image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=70' },
  { icon: Search, title: 'PhD Scholars', image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=70' },
  { icon: FlaskConical, title: 'Researchers', image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?auto=format&fit=crop&w=600&q=70' },
  { icon: Users, title: 'Faculty', image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=70' },
  { icon: School, title: 'Schools', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=70' },
  { icon: Landmark, title: 'Institutions', image: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=70' },
];

const defaultTestimonials = [
  { _id: 't1', name: 'Priya Sharma', designation: 'M.Sc. Student', institution: 'Delhi University', rating: 5, review: 'The team at ResearchPlus helped me with my dissertation. The quality of work and timely delivery was excellent. Highly recommended!' },
  { _id: 't2', name: 'Rahul Verma', designation: 'PhD Scholar', institution: 'IIT Roorkee', rating: 5, review: 'Professional, supportive and very knowledgeable team. They guided me well throughout my research paper publication process.' },
  { _id: 't3', name: 'Sneha Patel', designation: 'Assistant Professor', institution: 'SPPU', rating: 5, review: 'The FDP program was well-structured and very informative. It helped me improve my teaching and research skills.' },
  { _id: 't4', name: 'Amit Kumar', designation: 'Research Scholar', institution: 'BHU', rating: 5, review: 'Excellent support with data analysis and interpretation. Their structured approach saved me weeks of work.' },
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

function ProcessCard({ p }) {
  return (
    <div className="image-card">
      <div className="image-card-media">
        <img
          src={p.image}
          alt={p.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=70';
          }}
        />
      </div>
      <div className="image-card-body">
        <div className="image-card-icon">
          <p.icon size={20} />
        </div>
        <h3>{p.title}</h3>
        <p>{p.desc}</p>
      </div>
    </div>
  );
}

function AudienceCard({ a }) {
  return (
    <div className="image-card">
      <div className="image-card-media">
        <img
          src={a.image}
          alt={a.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src =
              'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=70';
          }}
        />
      </div>
      <div className="image-card-body">
        <div className="image-card-icon">
          <a.icon size={20} />
        </div>
        <h3>{a.title}</h3>
      </div>
    </div>
  );
}

export default function Home() {
  const isMobile = useIsMobile();
  const [testimonials, setTestimonials] = useState(defaultTestimonials);
  const [faqs, setFaqs] = useState(defaultFaqs);
  const [services, setServices] = useState(defaultServices);
  const [openFaq, setOpenFaq] = useState(null);

  const [sIndex, setSIndex] = useState(0);
  const [pIndex, setPIndex] = useState(0);
  const [aIndex, setAIndex] = useState(0);
  const [tIndex, setTIndex] = useState(0);

  useEffect(() => {
    Promise.all([getTestimonials(), getFAQs(), getServices()])
      .then(([t, f, s]) => {
        if (t?.data?.length) setTestimonials(t.data);
        if (f?.data?.length) setFaqs(f.data);
        if (s?.data?.length) setServices(s.data);
      })
      .catch(console.error);
  }, []);

  const prevS = () => setSIndex((i) => (i - 1 + services.length) % services.length);
  const nextS = () => setSIndex((i) => (i + 1) % services.length);

  const maxPIndex = Math.max(0, process.length - 1);
  const prevP = () => setPIndex((i) => Math.max(0, i - 1));
  const nextP = () => setPIndex((i) => Math.min(maxPIndex, i + 1));

  const prevA = () => setAIndex((i) => (i - 1 + audience.length) % audience.length);
  const nextA = () => setAIndex((i) => (i + 1) % audience.length);

  const prevT = () => setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const nextT = () => setTIndex((i) => (i + 1) % testimonials.length);

  const visibleServices = isMobile
    ? [services[sIndex]]
    : Array.from({ length: 3 }, (_, i) => services[(sIndex + i) % services.length]);

  const visibleProcess = isMobile
    ? [process[pIndex]]
    : process.slice(pIndex, pIndex + 4);

  const visibleAudience = isMobile
    ? [audience[aIndex]]
    : Array.from({ length: 4 }, (_, i) => audience[(aIndex + i) % audience.length]);

  const visibleTestimonials = Array.from(
    { length: isMobile ? 1 : 3 },
    (_, i) => testimonials[(tIndex + i) % testimonials.length]
  );

  const shownFaqs = faqs.slice(0, 8);

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

      {/* HERO */}
      <section
        className="home-section hero"
        style={
          isMobile
            ? { backgroundImage: `url(${herobanner2})` }
            : { '--hero-bg': `url(${herobanner})` }
        }
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

      {/* SERVICES */}
      <section className="home-section services-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <span className="pill">Our Services</span>
              <h2>Comprehensive Research &amp; Academic Support</h2>
              <p>
                We offer a wide range of academic and research services to help you achieve
                your goals with confidence and quality.
              </p>
            </div>
            <Link to="/services" className="link-arrow">
              View All Services <ArrowRight size={14} />
            </Link>
          </div>

          {isMobile ? (
            <div className="carousel-wrapper">
              <button type="button" className="mobile-arrow mobile-arrow-left" onClick={prevS} aria-label="Previous service">
                <ChevronLeft size={18} />
              </button>
              <div className="services-grid">
                {visibleServices.map((s) => (
                  <ServiceCard key={s._id || s.title} service={s} />
                ))}
              </div>
              <button type="button" className="mobile-arrow mobile-arrow-right" onClick={nextS} aria-label="Next service">
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="three-col-grid">
                {visibleServices.map((s) => (
                  <ServiceCard key={s._id || s.title} service={s} />
                ))}
              </div>
              <div className="arrows-below">
                <button type="button" onClick={prevS} aria-label="Previous services">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={nextS} aria-label="Next services">
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="home-section why-section">
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

      {/* PROCESS */}
      <section className="home-section process-section">
        <div className="container">
          <div className="section-head">
            <span className="pill">Our Process</span>
            <h2 className="nowrap-heading">Simple 6-Step Research Support Process</h2>
            <p>We follow a transparent and systematic process to ensure the best results.</p>
          </div>

          {isMobile ? (
            <div className="carousel-wrapper">
              <button type="button" className="mobile-arrow mobile-arrow-left" onClick={prevP} disabled={pIndex === 0} aria-label="Previous step">
                <ChevronLeft size={18} />
              </button>
              <div className="four-col-grid process-mobile-grid">
                {visibleProcess.map((p) => (
                  <ProcessCard key={p.title} p={p} />
                ))}
              </div>
              <button type="button" className="mobile-arrow mobile-arrow-right" onClick={nextP} disabled={pIndex === maxPIndex} aria-label="Next step">
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="four-col-grid">
                {visibleProcess.map((p) => (
                  <ProcessCard key={p.title} p={p} />
                ))}
              </div>
              <div className="arrows-below">
                <button type="button" onClick={prevP} disabled={pIndex === 0} aria-label="Previous process">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={nextP} disabled={pIndex === maxPIndex} aria-label="Next process">
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="home-section audience-section">
        <div className="container">
          <div className="section-head">
            <span className="pill">Who We Work With</span>
            <h2>Supporting a Wide Range of Researchers &amp; Learners</h2>
            <p>We serve students, scholars, researchers, faculty and educational institutions across the globe.</p>
          </div>

          {isMobile ? (
            <div className="carousel-wrapper">
              <button type="button" className="mobile-arrow mobile-arrow-left" onClick={prevA} aria-label="Previous audience">
                <ChevronLeft size={18} />
              </button>
              <div className="four-col-grid">
                {visibleAudience.map((a) => (
                  <AudienceCard key={a.title} a={a} />
                ))}
              </div>
              <button type="button" className="mobile-arrow mobile-arrow-right" onClick={nextA} aria-label="Next audience">
                <ChevronRight size={18} />
              </button>
            </div>
          ) : (
            <>
              <div className="four-col-grid">
                {visibleAudience.map((a) => (
                  <AudienceCard key={a.title} a={a} />
                ))}
              </div>
              <div className="arrows-below">
                <button type="button" onClick={prevA} aria-label="Previous audience">
                  <ChevronLeft size={18} />
                </button>
                <button type="button" onClick={nextA} aria-label="Next audience">
                  <ChevronRight size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="home-section testimonials-section">
        <div className="container">
          <div className="section-head">
            <span className="pill">Testimonials</span>
            <h2>What Our Clients Say</h2>
            <p>Trusted by students, researchers and institutions for quality and reliability.</p>
          </div>

          <div className="carousel-wrapper">
            {isMobile && (
              <button type="button" className="mobile-arrow mobile-arrow-left" onClick={prevT} aria-label="Previous testimonial">
                <ChevronLeft size={18} />
              </button>
            )}

            <div className="three-col-grid testimonials-grid">
              {visibleTestimonials.map((t, i) => (
                <div key={t._id + '-' + i} className="testimonial-card">
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

            {isMobile && (
              <button type="button" className="mobile-arrow mobile-arrow-right" onClick={nextT} aria-label="Next testimonial">
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          {!isMobile && (
            <div className="arrows-below">
              <button type="button" onClick={prevT} aria-label="Previous">
                <ChevronLeft size={18} />
              </button>
              <button type="button" onClick={nextT} aria-label="Next">
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="home-section faq-section">
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
            {shownFaqs.map(renderFaq)}
          </div>
        </div>
      </section>

      {/* CTA — lighter theme blue */}
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