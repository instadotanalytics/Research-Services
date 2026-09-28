import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap, ArrowRight, Phone } from 'lucide-react';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
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

  // Add shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
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
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="ResearchEdge Home">
            <div className="logo-icon">
              <GraduationCap size={22} strokeWidth={2.2} />
            </div>
            <div className="logo-text">
              <span className="logo-title">ResearchEdge</span>
              <span className="logo-sub">Academic Services</span>
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
              <a href="tel:+919876543210" className="nav-phone">
                <Phone size={15} />
                <span>+91 98765 43210</span>
              </a>
              <Link to="/contact" className="btn btn-primary nav-cta">
                Get Started
                <ArrowRight size={15} />
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