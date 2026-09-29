
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  CheckCircle2,
  ShieldCheck,
  User,
  Building2,
  FileText,
  BarChart3,
  BookOpen,
  GraduationCap,
  Compass,
  ListChecks,
  MessagesSquare,
  ArrowUpRight,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import api from '../../services/api.js';
import { createEnquiry } from '../../services/enquiryApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { validateEmail, validatePhone, required } from '../../utils/validation.js';
import heroImage from '../../assets/contact-heroimage.png';
import './Contact.css';

/* ------------------------------------------------------------------ */
/* Static config                                                       */
/* ------------------------------------------------------------------ */

const initial = {
  name: '',
  email: '',
  phone: '',
  service: '',
  institution: '',
  message: '',
  preferredContact: 'email',
};

const SERVICE_OPTIONS = [
  'Dissertation Writing',
  'Research Paper Writing',
  'Research Paper Publication Assistance',
  'Thesis Writing',
  'Synopsis Writing',
  'Data Collection & Analysis',
  'Faculty Development Program (FDP)',
  'Research Proposal Writing',
  'College & School Academic Writing',
  'Other',
];

// Used only if Site Settings cannot be loaded (same values the page used before).
const FALLBACK_SETTINGS = {
  phone: '+91 98765 43210',
  email: 'info@research.com',
  whatsapp: '+91 98765 43210',
  address: 'India',
  hours: 'Mon – Sat: 9:00 AM – 7:00 PM',
  mapUrl: '',
};

const WHY_POINTS = [
  {
    icon: Compass,
    title: 'Research-focused guidance',
    text: 'Support shaped around your topic, discipline and institutional requirements.',
  },
  {
    icon: ListChecks,
    title: 'Structured academic support',
    text: 'A clear, step-by-step approach to proposals, synopses, theses and papers.',
  },
  {
    icon: BarChart3,
    title: 'Data analysis assistance',
    text: 'Help with data collection, statistical analysis and interpreting results.',
  },
  {
    icon: MessagesSquare,
    title: 'Professional communication',
    text: 'Respectful, timely replies and clarity on scope before you commit to anything.',
  },
];

/* ------------------------------------------------------------------ */
/* Site settings (phone / email / WhatsApp / address / map)            */
/* ------------------------------------------------------------------ */

const pick = (...values) => {
  const found = values.find((v) => typeof v === 'string' && v.trim());
  return found ? found.trim() : '';
};

function useContactSettings() {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);

  useEffect(() => {
    let active = true;
    api
      .get('/settings')
      .then((res) => {
        if (!active) return;
        const s = res?.data?.data ?? res?.data ?? {};
        const c = s.contact || {};
        setSettings({
          phone: pick(s.phone, s.contactPhone, c.phone) || FALLBACK_SETTINGS.phone,
          email: pick(s.email, s.contactEmail, c.email) || FALLBACK_SETTINGS.email,
          whatsapp:
            pick(s.whatsapp, s.whatsappNumber, c.whatsapp) ||
            pick(s.phone, s.contactPhone, c.phone) ||
            FALLBACK_SETTINGS.whatsapp,
          address: pick(s.address, s.location, c.address) || FALLBACK_SETTINGS.address,
          hours: pick(s.businessHours, s.hours, c.businessHours) || FALLBACK_SETTINGS.hours,
          mapUrl: pick(s.mapEmbedUrl, s.mapUrl, s.googleMapUrl, c.mapUrl),
        });
      })
      .catch(() => {
        /* keep fallback values — page must still work */
      });
    return () => {
      active = false;
    };
  }, []);

  return settings;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function Contact() {
  const toast = useToast();
  const reduce = useReducedMotion();
  const settings = useContactSettings();

  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ---- derived contact values ---- */
  const telHref = `tel:${settings.phone.replace(/[^\d+]/g, '')}`;
  const waHref = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`;
  const mapSrc = settings.mapUrl.startsWith('https://www.google.com/maps')
    ? settings.mapUrl
    : settings.address
      ? `https://www.google.com/maps?q=${encodeURIComponent(settings.address)}&output=embed`
      : '';

  /* ---- animation helpers (disabled when reduced motion is on) ---- */
  const reveal = (delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '-40px' },
          transition: { duration: 0.4, delay, ease: 'easeOut' },
        };

  /* ---- validation (unchanged logic) ---- */
  const validate = () => {
    const e = {};
    if (!required(form.name)) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';

    if (!validateEmail(form.email)) e.email = 'Valid email is required';

    if (!validatePhone(form.phone)) e.phone = 'Valid phone number is required';

    if (!required(form.service)) e.service = 'Please select a service';

    if (!required(form.message)) e.message = 'Message is required';
    else if (form.message.length < 10) e.message = 'Message must be at least 10 characters';
    else if (form.message.length > 2000) e.message = 'Message is too long (max 2000 characters)';

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Wait a tick so error classes are rendered, then focus the first invalid field
      setTimeout(() => {
        const first = document.querySelector('.ct-input--error');
        if (first) {
          first.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
          first.focus({ preventScroll: true });
        }
      }, 0);
      return;
    }
    setSubmitting(true);
    try {
      await createEnquiry(form);
      toast.success('Enquiry submitted successfully! We will contact you soon.');
      setForm(initial);
      setErrors({});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ---- per-field props for accessibility ---- */
  const fieldProps = (name) => ({
    id: `ct-${name}`,
    name,
    value: form[name],
    onChange,
    className: `ct-input${errors[name] ? ' ct-input--error' : ''}`,
    'aria-invalid': errors[name] ? 'true' : 'false',
    'aria-describedby': errors[name] ? `ct-${name}-error` : undefined,
  });

  const FieldError = ({ name }) =>
    errors[name] ? (
      <p className="ct-error" id={`ct-${name}-error`} role="alert">
        {errors[name]}
      </p>
    ) : null;

  const focusForm = (e) => {
    e.preventDefault();
    const target = document.getElementById('enquiry-form');
    if (target) target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => document.getElementById('ct-name')?.focus({ preventScroll: true }), reduce ? 0 : 450);
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with our team for research and academic support. Submit an enquiry or reach us via phone, email or WhatsApp."
      />

      {/* ============================ HERO ============================ */}
      <section className="ct-hero" aria-labelledby="ct-hero-title">
        {/* Right-side hero image (CSS background, so no global <img> rules can affect it) */}
        <div
          className="ct-hero__media"
          aria-hidden="true"
          style={{ backgroundImage: `url("${heroImage}")` }}
        />

        <div className="ct-container ct-hero__inner">
          <motion.div
            className="ct-hero__copy"
            {...(reduce
              ? {}
              : {
                  initial: { opacity: 0, y: 18 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.5, ease: 'easeOut' },
                })}
          >
            <div className="ct-eyebrow-row">
              <span className="ct-eyebrow">Let&rsquo;s discuss your research</span>
              <span className="ct-eyebrow-line" aria-hidden="true" />
            </div>

            <h1 id="ct-hero-title">
              Let&rsquo;s Talk About
              <span className="ct-hero__accent">Your Research</span>
            </h1>

            <p>
              Have a research, academic writing, data analysis, or publication-related requirement?
              Share your requirements with us and our team will guide you through the next steps.
            </p>

            <ul className="ct-hero__features">
              <li>
                <BookOpen size={22} aria-hidden="true" />
                <span>Research Support</span>
              </li>
              <li>
                <GraduationCap size={22} aria-hidden="true" />
                <span>Academic Guidance</span>
              </li>
              <li>
                <BarChart3 size={22} aria-hidden="true" />
                <span>Data Analysis</span>
              </li>
            </ul>

            <div className="ct-hero__badge">
              <Clock size={18} aria-hidden="true" />
              <span>We aim to reply within 24 hours</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================== INFO + FORM ===================== */}
      <section className="ct-main" aria-label="Contact details and enquiry form">
        <div className="ct-container ct-main__grid">
          {/* LEFT — contact information */}
          <aside className="ct-info">
            <motion.div {...reveal()}>
              <h2>Get in touch</h2>
              <p className="ct-info__lead">
                Choose whichever way is easiest for you. Every message reaches our research support
                team directly.
              </p>
            </motion.div>

            <ul className="ct-methods">
              <motion.li {...reveal(0.05)}>
                <a href={telHref} className="ct-method">
                  <span className="ct-method__icon"><Phone size={20} aria-hidden="true" /></span>
                  <span className="ct-method__body">
                    <span className="ct-method__label">Phone</span>
                    <span className="ct-method__hint">Speak with our research support team</span>
                    <span className="ct-method__value">{settings.phone}</span>
                  </span>
                  <ArrowUpRight size={16} className="ct-method__arrow" aria-hidden="true" />
                </a>
              </motion.li>

              <motion.li {...reveal(0.1)}>
                <a href={`mailto:${settings.email}`} className="ct-method">
                  <span className="ct-method__icon"><Mail size={20} aria-hidden="true" /></span>
                  <span className="ct-method__body">
                    <span className="ct-method__label">Email</span>
                    <span className="ct-method__hint">Send us your research requirement</span>
                    <span className="ct-method__value">{settings.email}</span>
                  </span>
                  <ArrowUpRight size={16} className="ct-method__arrow" aria-hidden="true" />
                </a>
              </motion.li>

              <motion.li {...reveal(0.15)}>
                <a href={waHref} target="_blank" rel="noreferrer" className="ct-method">
                  <span className="ct-method__icon ct-method__icon--wa">
                    <MessageCircle size={20} aria-hidden="true" />
                  </span>
                  <span className="ct-method__body">
                    <span className="ct-method__label">WhatsApp</span>
                    <span className="ct-method__hint">Chat with our team</span>
                    <span className="ct-method__value">{settings.whatsapp}</span>
                  </span>
                  <ArrowUpRight size={16} className="ct-method__arrow" aria-hidden="true" />
                </a>
              </motion.li>

              <motion.li {...reveal(0.2)}>
                <div className="ct-method ct-method--static">
                  <span className="ct-method__icon"><MapPin size={20} aria-hidden="true" /></span>
                  <span className="ct-method__body">
                    <span className="ct-method__label">Location</span>
                    <span className="ct-method__hint">Serving researchers across the globe</span>
                    <span className="ct-method__value">{settings.address}</span>
                  </span>
                </div>
              </motion.li>

              <motion.li {...reveal(0.25)}>
                <div className="ct-method ct-method--static">
                  <span className="ct-method__icon"><Clock size={20} aria-hidden="true" /></span>
                  <span className="ct-method__body">
                    <span className="ct-method__label">Business hours</span>
                    <span className="ct-method__value">{settings.hours}</span>
                  </span>
                </div>
              </motion.li>
            </ul>

            <motion.div className="ct-trust" {...reveal(0.3)}>
              <span className="ct-trust__icon"><ShieldCheck size={20} aria-hidden="true" /></span>
              <div>
                <strong>Confidential &amp; carefully reviewed</strong>
                <p>
                  Your requirement will be reviewed carefully so we can understand the appropriate
                  support for your research. Your information is kept private.
                </p>
              </div>
            </motion.div>
          </aside>

          {/* RIGHT — enquiry form */}
          <motion.form
            id="enquiry-form"
            className="ct-form"
            onSubmit={onSubmit}
            noValidate
            aria-labelledby="ct-form-title"
            {...reveal(0.1)}
          >
            <header className="ct-form__header">
              <h2 id="ct-form-title">Send Us Your Requirement</h2>
              <p>
                Tell us a little about what you need. Our team will review your enquiry and get back
                to you. Fields marked * are required.
              </p>
            </header>

            {submitted && (
              <div className="ct-success" role="status">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>Your enquiry has been submitted successfully! We&rsquo;ll be in touch soon.</span>
              </div>
            )}

            <div className="ct-field">
              <label htmlFor="ct-name">
                <User size={14} aria-hidden="true" /> Full name *
              </label>
              <input
                {...fieldProps('name')}
                placeholder="Enter your full name"
                autoComplete="name"
              />
              <FieldError name="name" />
            </div>

            <div className="ct-row">
              <div className="ct-field">
                <label htmlFor="ct-email">
                  <Mail size={14} aria-hidden="true" /> Email *
                </label>
                <input
                  {...fieldProps('email')}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <FieldError name="email" />
              </div>

              <div className="ct-field">
                <label htmlFor="ct-phone">
                  <Phone size={14} aria-hidden="true" /> Phone *
                </label>
                <input
                  {...fieldProps('phone')}
                  type="tel"
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
                <FieldError name="phone" />
              </div>
            </div>

            <div className="ct-row">
              <div className="ct-field">
                <label htmlFor="ct-service">
                  <FileText size={14} aria-hidden="true" /> Service *
                </label>
                <select {...fieldProps('service')} className={`ct-input ct-select${errors.service ? ' ct-input--error' : ''}`}>
                  <option value="">Select a service</option>
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <FieldError name="service" />
              </div>

              <div className="ct-field">
                <label htmlFor="ct-institution">
                  <Building2 size={14} aria-hidden="true" /> Institution
                </label>
                <input
                  {...fieldProps('institution')}
                  placeholder="University / College"
                  autoComplete="organization"
                />
              </div>
            </div>

            <fieldset className="ct-field ct-fieldset">
              <legend>Preferred contact method</legend>
              <div className="ct-radios">
                {['email', 'phone', 'whatsapp'].map((method) => (
                  <label
                    key={method}
                    className={`ct-radio${form.preferredContact === method ? ' ct-radio--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={form.preferredContact === method}
                      onChange={onChange}
                    />
                    <span>{method}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="ct-field">
              <label htmlFor="ct-message">Your requirement *</label>
              <textarea
                {...fieldProps('message')}
                rows="4"
                placeholder="Describe your requirement — topic, discipline, stage of work and any deadlines."
                maxLength={2000}
              />
              <div className="ct-helper">
                {errors.message ? (
                  <p className="ct-error" id="ct-message-error" role="alert">
                    {errors.message}
                  </p>
                ) : (
                  <span />
                )}
                <span className="ct-count">{form.message.length} / 2000</span>
              </div>
            </div>

            <button type="submit" className="ct-submit" disabled={submitting} aria-busy={submitting}>
              {submitting ? (
                <>
                  <span className="ct-spinner" aria-hidden="true" />
                  Sending…
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  Send Enquiry
                </>
              )}
            </button>

            <p className="ct-note">
              By submitting this form, you agree to our <Link to="/privacy-policy">Privacy Policy</Link>.
            </p>
          </motion.form>
        </div>
      </section>

      {/* ===================== WHY REACH OUT ===================== */}
      <section className="ct-why" aria-labelledby="ct-why-title">
        <div className="ct-container">
          <motion.div className="ct-section-head" {...reveal()}>
            <h2 id="ct-why-title">Why Reach Out to ResearchEdge?</h2>
            <p>Support designed around how researchers and students actually work.</p>
          </motion.div>

          <ul className="ct-why__grid">
            {WHY_POINTS.map(({ icon: Icon, title, text }, i) => (
              <motion.li key={title} className="ct-why__item" {...reveal(i * 0.06)}>
                <span className="ct-why__icon"><Icon size={20} aria-hidden="true" /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.li>
            ))}
          </ul>

          <p className="ct-why__note">
            We provide guidance and structured support. We do not guarantee publication, acceptance,
            marks, admission, funding or any specific academic outcome.
          </p>
        </div>
      </section>

      {/* ===================== MAP / LOCATION ===================== */}
      {mapSrc && (
        <section className="ct-map" aria-labelledby="ct-map-title">
          <div className="ct-container">
            <motion.div className="ct-map__card" {...reveal()}>
              <div className="ct-map__text">
                <h2 id="ct-map-title">Our Location</h2>
                <p>We&rsquo;re based in India and support researchers across the globe.</p>
                <div className="ct-map__address">
                  <MapPin size={18} aria-hidden="true" />
                  <span>{settings.address}</span>
                </div>
                <div className="ct-map__address">
                  <Clock size={18} aria-hidden="true" />
                  <span>{settings.hours}</span>
                </div>
              </div>
              <div className="ct-map__frame">
                <iframe
                  title="ResearchEdge office location"
                  src={mapSrc}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ===================== FINAL CTA ===================== */}
      <section className="ct-cta" aria-labelledby="ct-cta-title">
        <div className="ct-container">
          <motion.div className="ct-cta__card" {...reveal()}>
            <div>
              <h2 id="ct-cta-title">Not Sure Where to Start?</h2>
              <p>
                Share your research requirement with us and we&rsquo;ll help you identify the
                appropriate next step.
              </p>
            </div>
            <a href="#enquiry-form" className="ct-cta__btn" onClick={focusForm}>
              Send an Enquiry
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}