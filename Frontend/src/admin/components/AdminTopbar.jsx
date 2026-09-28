import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminTopbar.css';

export default function AdminTopbar() {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="admin-topbar">
      {/* ============ Left: Greeting ============ */}
      <div className="admin-topbar-greeting">
        <h2>Welcome back, {user?.name || 'Admin'} 👋</h2>
        <p>Manage your research platform content and enquiries.</p>
      </div>

      {/* ============ Center: Search ============ */}
      <div className="topbar-search">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Search anything..."
          aria-label="Search"
        />
      </div>

      {/* ============ Right: Actions + Profile ============ */}
      <div className="admin-topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot" />
        </button>

        <Link to="/admin/profile" className="user-profile">
          <div className="user-avatar">
            {getInitials(user?.name)}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">
              {user?.role || 'Administrator'}
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}