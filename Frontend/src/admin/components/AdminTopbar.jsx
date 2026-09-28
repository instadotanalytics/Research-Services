import { Link } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminTopbar.css';

export default function AdminTopbar() {
  const { user } = useAuth();

  return (
    <header className="admin-topbar">
      <div className="topbar-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="admin-topbar-actions">
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-avatar">
            <User size={18} />
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}