import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Briefcase, MessageSquare, Mail, Star, HelpCircle, BarChart3, Settings, User, LogOut, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminSidebar.css';

const menu = [
  { section: 'Dashboard', items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }] },
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
      { to: '/admin/messages', label: 'Contact Messages', icon: Mail },
    ],
  },
  {
    section: 'System',
    items: [
      { to: '/admin/settings', label: 'Site Settings', icon: Settings },
      { to: '/admin/profile', label: 'My Profile', icon: User },
    ],
  },
];

export default function AdminSidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <>
      <button className="admin-menu-btn" onClick={() => setOpen(!open)}>☰</button>
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-sidebar-brand">
          <div className="admin-logo-icon"><GraduationCap size={20} /></div>
          <div>
            <strong>ResearchEdge</strong>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav className="admin-sidebar-nav">
          {menu.map((s) => (
            <div key={s.section} className="admin-nav-section">
              <span className="admin-nav-section-title">{s.section}</span>
              {s.items.map((it) => (
                <NavLink
                  key={it.to}
                  to={it.to}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
                  onClick={() => setOpen(false)}
                >
                  <it.icon size={18} />
                  <span>{it.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
          <button className="admin-nav-link" onClick={handleLogout} style={{ color: '#dc2626', width: '100%' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}