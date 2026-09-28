import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  GraduationCap,
  X
} from 'lucide-react';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Smooth Scroll Detection (FIXED flicker)
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only trigger when scroll passes 10px (prevents jitter on tiny scrolls)
          setScrolled(window.scrollY > 10);
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

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    // Navigate to a search page. If you don't have one,
    // change this to navigate('/services') or open a modal.
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setSearchOpen((s) => !s);
  };

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
                  </NavLink>
                ))}
              </div>

              <div className="navbar-actions">
                {/* Search toggle */}
                <button
                  className="nav-search-btn"
                  aria-label="Search"
                  onClick={toggleSearch}
                >
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

        {/* --- Search Overlay / Bar --- */}
        {searchOpen && (
          <div className="search-bar-overlay">
            <form className="search-bar-form" onSubmit={handleSearchSubmit}>
              <Search size={20} className="search-bar-icon" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search services, topics, resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-bar-input"
              />
              <button
                type="button"
                className="search-bar-close"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        )}
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