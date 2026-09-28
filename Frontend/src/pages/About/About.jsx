import SEO from '../../components/SEO.jsx';
import CTASection from '../../components/CTA/CTASection.jsx';
import { Target, Eye, Heart, Shield, Users, TrendingUp, CheckCircle } from 'lucide-react';

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

export default function About() {
  return (
    <>
      <SEO title="About Us" description="Learn about our mission to support researchers, scholars, and academic institutions with professional research guidance." />

      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">About Us</span>
          <h1>Dedicated to Academic Excellence</h1>
          <p>
            We provide professional research and academic support to students, researchers, scholars, faculty members and
            institutions — with a focus on structure, ethics and quality.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 style={{ marginBottom: 16 }}>Who We Are</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: 40 }}>
            We are a research and academic support service built to help researchers and academic professionals succeed
            in their academic journey. Our team assists with dissertation, thesis, research papers, data analysis,
            proposals, faculty development and academic documentation — providing expert guidance while ensuring the
            work remains your original contribution.
          </p>

          <div className="grid grid-2 mb-3">
            <div className="card">
              <Target size={28} color="#2563eb" style={{ marginBottom: 14 }} />
              <h3 style={{ marginBottom: 10 }}>Our Mission</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                To empower researchers and academic professionals with structured, ethical and high-quality support
                that helps them achieve their academic goals.
              </p>
            </div>
            <div className="card">
              <Eye size={28} color="#2563eb" style={{ marginBottom: 14 }} />
              <h3 style={{ marginBottom: 10 }}>Our Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                To become a trusted academic support partner for researchers, scholars and institutions across
                disciplines.
              </p>
            </div>
          </div>

          <h2 style={{ marginTop: 40, marginBottom: 24 }}>Our Values</h2>
          <div className="grid grid-4">
            {values.map((v, i) => (
              <div key={i} className="card" style={{ textAlign: 'center' }}>
                <v.icon size={26} color="#2563eb" style={{ margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1rem', marginBottom: 6 }}>{v.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{v.desc}</p>
              </div>
            ))}
          </div>

          <h2 style={{ marginTop: 50, marginBottom: 24 }}>Why Choose Us</h2>
          <div className="grid grid-2">
            {whyUs.map((w, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={20} color="#16a34a" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.95rem' }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}