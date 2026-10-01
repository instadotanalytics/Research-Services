import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, ArrowRight, X } from 'lucide-react';
import './Navbar.css';

// Logo image import
import logo from '../../assets/logo.png';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

const SEARCH_TERMS = [
  'services',
  'topics',
  'resources',
  'dissertations',
  'research papers',
  'thesis writing',
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll par navbar ko blur background do
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
  }, [pathname]);

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

  // Cycle through the animated placeholder words
  useEffect(() => {
    if (!searchOpen) return;
    const interval = setInterval(() => {
      setPrevIndex(placeholderIndex);
      setPlaceholderIndex((i) => (i + 1) % SEARCH_TERMS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [searchOpen, placeholderIndex]);

  // Reset placeholder cycle when search opens
  useEffect(() => {
    if (searchOpen) {
      setPlaceholderIndex(0);
      setPrevIndex(-1);
    }
  }, [searchOpen]);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  const toggleSearch = () => {
    setSearchOpen((s) => !s);
  };

  // Determine class for each anim item
  const getAnimClass = (i) => {
    if (i === placeholderIndex) return 'search-bar-anim-item active';
    if (i === prevIndex) return 'search-bar-anim-item exit';
    return 'search-bar-anim-item';
  };

  /**
   * Logo click handler:
   * - If we're already on Home → smooth scroll to top
   * - If we're on another page → navigate to Home (natural top)
   */
  const handleLogoClick = (e) => {
    if (pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Also close mobile menu if open
      setOpen(false);
    }
    // else: default Link behavior → navigates to '/' and top automatically
  };

  return (
    <>
      <header className="navbar-wrapper">
        {/* --- Main Navigation --- */}
        <div className={`main-nav ${scrolled ? 'scrolled' : ''}`}>
          <div className="container navbar-inner">
            {/* Logo with text */}
            <Link
              to="/"
              className="navbar-logo"
              aria-label="ResearchPlus Home"
              onClick={handleLogoClick}
            >
              <img src={logo} alt="ResearchPlus" className="logo-img" />
              <div className="logo-text">
                <span className="logo-title">
                  Research<span className="logo-highlight">Plus</span>
                </span>
                <span className="logo-sub">Research & Academic Services</span>
              </div>
            </Link>

            <nav
              className={`navbar-nav ${open ? 'open' : ''}`}
              aria-label="Main navigation"
            >
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

        {/* --- Search Overlay --- */}
        {searchOpen && (
          <div className="search-bar-overlay">
            <form className="search-bar-form" onSubmit={handleSearchSubmit}>
              <Search size={20} className="search-bar-icon" />
              <div className="search-bar-input-wrap">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-bar-input"
                  aria-label="Search"
                />
                {!searchQuery && (
                  <div className="search-bar-placeholder" aria-hidden="true">
                    <span>Search&nbsp;</span>
                    <span className="search-bar-anim">
                      {SEARCH_TERMS.map((term, i) => (
                        <span key={term} className={getAnimClass(i)}>
                          {term}
                        </span>
                      ))}
                    </span>
                  </div>
                )}
              </div>
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