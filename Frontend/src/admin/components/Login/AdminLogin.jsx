import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, GraduationCap, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import { validateEmail } from '../../utils/validation.js';
import './AdminLogin.css';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!validateEmail(email)) errs.email = 'Valid email required';
    if (!password) errs.password = 'Password required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* ============ Left: Marketing ============ */}
        <div className="admin-login-text">
          {/* Brand */}
          <div className="admin-login-brand">
            <div className="admin-login-brand-icon">
              <GraduationCap size={24} />
            </div>
            <div className="admin-login-brand-text">
              <strong>ResearchEdge</strong>
              <span>Academic Services</span>
            </div>
          </div>

          <h2>Fast, Efficient and Productive</h2>
          <p className="main-desc">
            Streamline your workflow with our powerful admin dashboard. Manage
            services, track enquiries, and control your entire platform from one
            centralized, secure location.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">
                <Check size={13} />
              </span>
              <span>Manage dynamic service pages</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Check size={13} />
              </span>
              <span>Track enquiries and customer messages</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Check size={13} />
              </span>
              <span>Update testimonials, FAQs and statistics</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">
                <Check size={13} />
              </span>
              <span>Full control over website content</span>
            </div>
          </div>
        </div>

        {/* ============ Right: Login Form ============ */}
        <div className="admin-login-section">
          <div className="login-header">
            <h1>Sign In</h1>
            <p>Few clicks to manage your platform</p>
          </div>

          <form onSubmit={onSubmit} noValidate autoComplete="off">
            <div className="admin-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className={`admin-input ${errors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@research.com"
                autoComplete="email"
                autoFocus
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="admin-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className={`admin-input ${errors.password ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <div className="form-error">{errors.password}</div>
              )}
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={loading}
            >
              <Lock size={16} />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="admin-login-note">
            Protected admin area. Unauthorized access is prohibited.
          </div>
        </div>
      </div>
    </div>
  );
}