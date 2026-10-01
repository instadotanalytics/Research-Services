import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Share2, MessageCircle, Briefcase, Camera } from 'lucide-react';
import './Footer.css';

// Logo image import
import logo from '../../assets/logo.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src={logo} alt="ResearchPlus Logo" className="footer-logo-img" />
              <span>
                Research<span className="logo-accent">Plus</span>
              </span>
            </div>
            <p>
              Professional research and academic support services for students, researchers, scholars and educational
              institutions.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><Share2 size={18} /></a>
              <a href="#" aria-label="Twitter"><MessageCircle size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Briefcase size={18} /></a>
              <a href="#" aria-label="Instagram"><Camera size={18} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col footer-col-quick">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="footer-col footer-col-services">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services/dissertation-writing">Dissertation Writing</Link></li>
              <li><Link to="/services/research-paper-writing">Research Paper Writing</Link></li>
              <li><Link to="/services/thesis-writing">Thesis Writing</Link></li>
              <li><Link to="/services/data-collection-analysis">Data Analysis</Link></li>
              <li><Link to="/services/faculty-development-program">Faculty Development</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col footer-col-contact">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon"><Mail size={16} /></span>
                info@research.com
              </li>
              <li>
                <span className="contact-icon"><Phone size={16} /></span>
                +91 98765 43210
              </li>
              <li>
                <span className="contact-icon"><MapPin size={16} /></span>
                India
              </li>
            </ul>
          </div>

          {/* Mobile-only legal links */}
          <div className="footer-col footer-col-legal-mobile">
            <h4>Legal</h4>
            <ul className="footer-legal-list">
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>

        </div>

        {/* Desktop bottom row: copyright + legal */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ResearchPlus. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="legal-divider">|</span>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <span className="legal-divider">|</span>
            <Link to="/refund-policy">Refund Policy</Link>
            <span className="legal-divider">|</span>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>

        {/* Mobile-only bottom copyright */}
        <div className="footer-copy-mobile">
          © {new Date().getFullYear()} ResearchPlus. All rights reserved.
        </div>
      </div>
    </footer>
  );
}