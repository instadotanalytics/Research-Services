import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { changePassword } from '../../services/authApi.js';
import { User, Mail, Shield, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import './AdminProfile.css';

export default function AdminProfile() {
  const { user } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

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
    if (form.currentPassword === form.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }
    setLoading(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const toggleShow = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'A';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Password strength helpers
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const getStrengthClass = (pwd) => {
    const s = getStrength(pwd);
    if (s <= 2) return 'weak';
    if (s <= 3) return 'medium';
    return 'strong';
  };

  const getStrengthLabel = (pwd) => {
    const s = getStrength(pwd);
    if (s <= 2) return 'Weak';
    if (s <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="admin-profile-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account settings and security</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* ============ LEFT: Account Info Card ============ */}
        <div className="profile-card">
          {/* Avatar Header */}
          <div className="profile-card-header">
            <div className="profile-avatar">
              {getInitials(user?.name)}
              <span className="profile-online-dot" />
            </div>
            <div className="profile-header-info">
              <h3>{user?.name || 'Admin'}</h3>
              <span className="profile-role-badge">
                <Shield size={11} />
                {user?.role || 'Administrator'}
              </span>
            </div>
          </div>

          {/* Details List */}
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
                <span
                  className="detail-value"
                  style={{ textTransform: 'capitalize' }}
                >
                  {user?.role || 'Administrator'}
                </span>
              </div>
            </div>
          </div>

          {/* Security Note */}
          <div className="profile-security-note">
            <div className="security-note-icon">
              <CheckCircle size={16} />
            </div>
            <div>
              <strong>Account Secured</strong>
              <p>Your password is encrypted and stored securely.</p>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: Change Password Card ============ */}
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
            {/* Current Password */}
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.current ? 'text' : 'password'}
                  className="form-control"
                  value={form.currentPassword}
                  onChange={(e) =>
                    setForm({ ...form, currentPassword: e.target.value })
                  }
                  required
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('current')}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.current ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.new ? 'text' : 'password'}
                  className="form-control"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  required
                  placeholder="Enter new password (min 6 characters)"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('new')}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className={`strength-fill ${getStrengthClass(form.newPassword)}`}
                    />
                  </div>
                  <span
                    className={`strength-label ${getStrengthClass(form.newPassword)}`}
                  >
                    {getStrengthLabel(form.newPassword)}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrap">
                <input
                  type={showPassword.confirm ? 'text' : 'password'}
                  className="form-control"
                  value={form.confirmPassword}
                  onChange={(e) =>
                    setForm({ ...form, confirmPassword: e.target.value })
                  }
                  required
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => toggleShow('confirm')}
                  aria-label="Toggle password visibility"
                >
                  {showPassword.confirm ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {form.confirmPassword &&
                form.newPassword !== form.confirmPassword && (
                  <div className="form-error">Passwords do not match</div>
                )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}