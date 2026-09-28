import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle } from 'lucide-react';
import './CTA.css';

export default function CTASection({ title = 'Need Research or Academic Support?', subtitle = 'Talk to our team of experienced research professionals and get guidance tailored to your academic goals.', primaryText = 'Talk to Our Team', primaryLink = '/contact' }) {
  return (
    <section className="cta-section">
      <div className="container">
        <div className="cta-box">
          <div>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
          <div className="cta-actions">
            <Link to={primaryLink} className="btn btn-secondary">
              <MessageCircle size={18} /> {primaryText}
            </Link>
            <Link to="/services" className="btn btn-outline" style={{ borderColor: '#fff', color: '#fff' }}>
              Explore Services <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}