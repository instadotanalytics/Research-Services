import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AdminSearch from './AdminSearch.jsx';
import './AdminTopbar.css';
import '../admin-mobile.css';

const getGreeting = (d) => {
  const h = d.getHours();
  if (h < 5) return { text: 'Working late', emoji: '🌙' };
  if (h < 12) return { text: 'Good morning', emoji: '☀️' };
  if (h < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (h < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Good night', emoji: '🌙' };
};

export default function AdminTopbar() {
  const { user } = useAuth();
  const [now, setNow] = useState(new Date());

  // keeps greeting + date correct without a page refresh
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const greeting = getGreeting(now);
  const dateLabel = now.toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="admin-topbar">
      {/* ============ Left: Greeting ============ */}
      <div className="admin-topbar-greeting">
        <h2>
          {greeting.text} {greeting.emoji}
        </h2>
        <p>{dateLabel}</p>
      </div>

      {/* ============ Center: working search ============ */}
      <AdminSearch />

      {/* ============ Right: Profile ============ */}
      <div className="admin-topbar-actions">
        <Link to="/admin/profile" className="user-profile">
          <div className="user-avatar">{getInitials(user?.name)}</div>
          <div className="user-info">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <span className="user-role">{user?.role || 'Administrator'}</span>
          </div>
        </Link>
      </div>
    </header>
  );
}