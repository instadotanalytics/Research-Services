import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  ChevronDown,
  GraduationCap 
} from 'lucide-react';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services', hasDropdown: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Smooth Scroll Detection
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Trigger at 5px for instant response
          setScrolled(window.scrollY > 5);
          ticking = false;
        });
        ticking = true;
      }
    };

    onScroll(); 
    window.addEventListener('scroll', onScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
        
        {/* --- Top Bar --- */}
        <div className="top-bar">
          <div className="container top-bar-inner">
            <div className="top-bar-left">
              <a href="mailto:info@researchplus.com" className="top-item">
                <Mail size={14} />
                <span>info@researchplus.com</span>
              </a>
              <span className="divider">|</span>
              <a href="tel:+919876543210" className="top-item">
                <Phone size={14} />
                <span>+91 98765 43210</span>
              </a>
              <span className="divider">|</span>
              <a href="https://wa.me/919876543210" className="top-item" target="_blank" rel="noreferrer">
                <MessageCircle size={14} />
                <span>WhatsApp Us</span>
              </a>
            </div>
            <div className="top-bar-right">
              <ShieldCheck size={16} />
              <span>Trusted by 500+ Researchers & Institutions</span>
            </div>
          </div>
        </div>

        {/* --- Main Navigation --- */}
        <div className="main-nav">
          <div className="container navbar-inner">
            {/* Logo */}
            <Link to="/" className="navbar-logo" aria-label="ResearchPlus Home">
              <div className="logo-icon">
                <GraduationCap size={20} strokeWidth={2.5} />
              </div>
              <div className="logo-text">
                <span className="logo-title">Research<span className="logo-highlight">Plus</span></span>
                <span className="logo-sub">Research & Academic Services</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className={`navbar-nav ${open ? 'open' : ''}`} aria-label="Main navigation">
              <div className="navbar-nav-links">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    {l.label}
                    {l.hasDropdown && <ChevronDown size={14} className="nav-chevron" />}
                  </NavLink>
                ))}
              </div>

              <div className="navbar-actions">
                <button className="nav-search-btn" aria-label="Search">
                  <Search size={20} />
                </button>
                <Link to="/contact" className="btn btn-primary nav-cta">
                  Get Started
                  <ArrowRight size={16} />
                </Link>
              </div>
            </nav>

            {/* Hamburger */}
            <button
              className={`hamburger ${open ? 'active' : ''}`}
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              <span className="hamburger-box">
                <span className="hamburger-inner" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu backdrop */}
      {open && (
        <div
          className="navbar-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}