import { Link } from 'react-router-dom';
import { GraduationCap, Mail, Phone, MapPin, Share2, MessageCircle, Briefcase, Camera } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <GraduationCap size={22} />
              </div>
              <span>ResearchEdge</span>
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
              <li><Mail size={16} /> info@research.com</li>
              <li><Phone size={16} /> +91 98765 43210</li>
              <li><MapPin size={16} /> India</li>
            </ul>
          </div>

          {/* Copyright + Legal — desktop pe footer-bottom, mobile pe Contact ke saath 2nd row */}
          <div className="footer-col footer-col-copyright">
            <p className="footer-copy">
              © {new Date().getFullYear()} ResearchEdge. All rights reserved.
            </p>
            <div className="footer-legal">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
              <Link to="/refund-policy">Refund Policy</Link>
              <Link to="/disclaimer">Disclaimer</Link>
            </div>
          </div>

        </div>

        {/* Desktop footer bottom — copyright + legal (original look) */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ResearchEdge. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
            <Link to="/refund-policy">Refund Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}