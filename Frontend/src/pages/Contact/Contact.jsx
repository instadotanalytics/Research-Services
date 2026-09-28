import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle, User, Building2 } from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { createEnquiry } from '../../services/enquiryApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { validateEmail, validatePhone, required } from '../../utils/validation.js';
import './Contact.css';

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

export default function Contact() {
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
      // Scroll to first error
      const firstErrorField = document.querySelector('.form-control.error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with our team for research and academic support. Submit an enquiry or reach us via phone, email or WhatsApp."
      />

      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Contact Us</span>
          <h1>Let's Discuss Your Research Needs</h1>
          <p>
            Fill out the form or reach out directly — our team will respond within 24 hours.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT — Info Column */}
            <div className="contact-info-wrapper">
              <div className="contact-info-header">
                <h2>Get in Touch</h2>
                <p>Multiple ways to reach our research support team.</p>
              </div>

              <div className="contact-info-list">
                <a href="tel:+919876543210" className="contact-info-item">
                  <div className="contact-info-icon">
                    <Phone size={20} />
                  </div>
                  <div className="contact-info-text">
                    <strong>Phone</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </a>

                <a href="mailto:info@research.com" className="contact-info-item">
                  <div className="contact-info-icon">
                    <Mail size={20} />
                  </div>
                  <div className="contact-info-text">
                    <strong>Email</strong>
                    <span>info@research.com</span>
                  </div>
                </a>

                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="contact-info-item"
                >
                  <div className="contact-info-icon whatsapp">
                    <MessageCircle size={20} />
                  </div>
                  <div className="contact-info-text">
                    <strong>WhatsApp</strong>
                    <span>+91 98765 43210</span>
                  </div>
                </a>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <MapPin size={20} />
                  </div>
                  <div className="contact-info-text">
                    <strong>Address</strong>
                    <span>India</span>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-info-icon">
                    <Clock size={20} />
                  </div>
                  <div className="contact-info-text">
                    <strong>Business Hours</strong>
                    <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Trust badge */}
              <div className="contact-trust">
                <div className="contact-trust-icon">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <strong>Confidential & Reliable</strong>
                  <span>Your information is kept strictly private.</span>
                </div>
              </div>
            </div>

            {/* RIGHT — Form */}
            <form className="contact-form card" onSubmit={onSubmit} noValidate>
              <div className="contact-form-header">
                <h3>Send an Enquiry</h3>
                <p>We'll get back to you within 24 hours.</p>
              </div>

              {submitted && (
                <div className="contact-success">
                  <CheckCircle size={18} />
                  <span>Your enquiry has been submitted successfully!</span>
                </div>
              )}

              {/* Full Name */}
              <div className="form-group">
                <label>
                  <User size={14} /> Full Name *
                </label>
                <input
                  className={`form-control ${errors.name ? 'error' : ''}`}
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              {/* Email + Phone */}
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    className={`form-control ${errors.email ? 'error' : ''}`}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    className={`form-control ${errors.phone ? 'error' : ''}`}
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="+91 98765 43210"
                    autoComplete="tel"
                  />
                  {errors.phone && <div className="form-error">{errors.phone}</div>}
                </div>
              </div>

              {/* Service + Institution */}
              <div className="form-row">
                <div className="form-group">
                  <label>Service *</label>
                  <select
                    className={`form-control ${errors.service ? 'error' : ''}`}
                    name="service"
                    value={form.service}
                    onChange={onChange}
                  >
                    <option value="">Select a service</option>
                    {SERVICE_OPTIONS.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  {errors.service && <div className="form-error">{errors.service}</div>}
                </div>

                <div className="form-group">
                  <label>
                    <Building2 size={14} /> Institution
                  </label>
                  <input
                    className="form-control"
                    name="institution"
                    value={form.institution}
                    onChange={onChange}
                    placeholder="University / College"
                  />
                </div>
              </div>

              {/* Preferred Contact */}
              <div className="form-group">
                <label>Preferred Contact Method</label>
                <div className="contact-radio-group">
                  {['email', 'phone', 'whatsapp'].map((method) => (
                    <label
                      key={method}
                      className={`contact-radio ${form.preferredContact === method ? 'active' : ''}`}
                    >
                      <input
                        type="radio"
                        name="preferredContact"
                        value={method}
                        checked={form.preferredContact === method}
                        onChange={onChange}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{method}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label>Message *</label>
                <textarea
                  className={`form-control ${errors.message ? 'error' : ''}`}
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Describe your requirement in detail..."
                  maxLength={2000}
                />
                <div className="form-helper">
                  {errors.message ? (
                    <span className="form-error">{errors.message}</span>
                  ) : (
                    <span className="char-count">
                      {form.message.length} / 2000
                    </span>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary contact-submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit Enquiry
                  </>
                )}
              </button>

              <p className="contact-form-note">
                By submitting, you agree to our{' '}
                <a href="/privacy-policy">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* MAP */}
      <section className="contact-map-section">
        <div className="container">
          <div className="contact-map-header">
            <h2>Visit Us</h2>
            <p>We're based in India, serving researchers across the globe.</p>
          </div>
          <div className="contact-map-wrapper">
            <iframe
              title="Office Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153095.491655488!2d76.7443005734375!3d22.351114799999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}