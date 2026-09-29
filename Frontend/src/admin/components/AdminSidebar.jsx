import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  MessageSquare,
  Mail,
  Star,
  HelpCircle,
  BarChart3,
  Settings,
  User,
  LogOut,
  GraduationCap,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminSidebar.css';

const menu = [
  {
    section: 'Dashboard',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    section: 'Content',
    items: [
      { to: '/admin/services', label: 'Services', icon: Briefcase },
      { to: '/admin/testimonials', label: 'Testimonials', icon: Star },
      { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
      { to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
    ],
  },
  {
    section: 'Enquiries',
    items: [
      { to: '/admin/enquiries', label: 'All Enquiries', icon: MessageSquare },
    ],
  },
  {
    section: 'System',
    items: [
      { to: '/admin/profile', label: 'My Profile', icon: User },
    ],
  },
];

export default function AdminSidebar({ open: externalOpen, onClose } = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Support both controlled (from AdminLayout) and uncontrolled usage
  const isControlled = typeof externalOpen === 'boolean';
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? (v) => (typeof v === 'function' ? onClose?.(v) : onClose?.(v))
    : setInternalOpen;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const closeMenu = () => {
    if (isControlled) onClose?.();
    else setInternalOpen(false);
  };

  const toggleMenu = () => {
    if (isControlled) onClose?.();
    else setInternalOpen((v) => !v);
  };

  return (
    <>
      {/* Mobile menu toggle button */}
      <button
        className="admin-menu-btn"
        onClick={toggleMenu}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={20} /> : '☰'}
      </button>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="admin-sidebar-backdrop"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        {/* ============ Brand Header ============ */}
        <div className="admin-sidebar-brand">
          <div className="admin-logo-icon">
            <GraduationCap size={22} />
          </div>
          <div className="admin-brand-text">
            <strong>ResearchEdge</strong>
            <span>Admin Panel</span>
          </div>

          {/* Close button (mobile only) */}
          <button
            className="admin-close-btn"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* ============ Navigation ============ */}
        <nav className="admin-sidebar-nav">
          {menu.map((section) => (
            <div key={section.section} className="admin-nav-section">
              <span className="admin-nav-section-title">{section.section}</span>

              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `admin-nav-link ${isActive ? 'active' : ''}`
                  }
                  onClick={closeMenu}
                >
                  <span className="nav-icon-wrap">
                    <item.icon size={18} />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* ============ Footer — Logout ============ */}
        <div className="admin-sidebar-footer">
          <button className="admin-logout" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}