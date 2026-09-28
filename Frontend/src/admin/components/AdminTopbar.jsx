import { Link } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import './AdminTopbar.css';

export default function AdminTopbar() {
  const { user } = useAuth();
  return (
    <header className="admin-topbar">
      <div>
        <h2>Welcome back, {user?.name || 'Admin'} 👋</h2>
        <p>Manage your research platform content and enquiries.</p>
      </div>
      <div className="admin-topbar-actions">
        <button className="icon-btn" aria-label="Notifications"><Bell size={18} /></button>
        <Link to="/admin/profile" className="icon-btn" aria-label="Profile"><User size={18} /></Link>
      </div>
    </header>
  );
}