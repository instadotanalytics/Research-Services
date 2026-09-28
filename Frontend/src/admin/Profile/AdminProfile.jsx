import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { changePassword } from '../../services/authApi.js';

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

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 600, marginBottom: 20 }}>
        <h3 style={{ marginBottom: 16 }}>Account Information</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <strong style={{ fontSize: 13, color: 'var(--text-muted)' }}>Name</strong>
            <div>{user?.name}</div>
          </div>
          <div>
            <strong style={{ fontSize: 13, color: 'var(--text-muted)' }}>Email</strong>
            <div>{user?.email}</div>
          </div>
          <div>
            <strong style={{ fontSize: 13, color: 'var(--text-muted)' }}>Role</strong>
            <div style={{ textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>
      </div>

      <form className="card" style={{ maxWidth: 600 }} onSubmit={onSubmit}>
        <h3 style={{ marginBottom: 16 }}>Change Password</h3>
        <div className="form-group">
          <label>Current Password</label>
          <input
            type="password"
            className="form-control"
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            required
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
          />
        </div>
        <button className="btn btn-primary" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}