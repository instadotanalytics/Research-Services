import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { changePassword } from '../../services/authApi.js';
import { User, Mail, Shield, Lock } from 'lucide-react';
import './AdminSettings.css';

export default function AdminProfile() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success('Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="admin-profile-page">
      <div className="admin-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account settings and security</p>
        </div>
      </div>

      <div className="profile-grid">

        {/* Account Information Card */}
        <div className="profile-card">
          <div className="profile-card-header">
            <div className="profile-avatar">
              {getInitials(user?.name)}
            </div>
            <div className="profile-header-info">
              <h3>{user?.name || 'Admin'}</h3>
              <span className="profile-role-badge">{user?.role || 'Administrator'}</span>
            </div>
          </div>

          <div className="profile-details">
            <div className="profile-detail-row">
              <div className="detail-icon-wrap">
                <User size={16} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user?.name || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="detail-icon-wrap">
                <Mail size={16} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{user?.email || '—'}</span>
              </div>
            </div>

            <div className="profile-detail-row">
              <div className="detail-icon-wrap">
                <Shield size={16} />
              </div>
              <div className="detail-content">
                <span className="detail-label">Role</span>
                <span className="detail-value" style={{ textTransform: 'capitalize' }}>
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="profile-card">
          <div className="card-section-header">
            <div className="section-icon-wrap">
              <Lock size={18} />
            </div>
            <div>
              <h3>Change Password</h3>
              <p>Update your password to keep your account secure</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="profile-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                className="form-control"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                required
                placeholder="Enter current password"
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                className="form-control"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                className="form-control"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                placeholder="Confirm new password"
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}