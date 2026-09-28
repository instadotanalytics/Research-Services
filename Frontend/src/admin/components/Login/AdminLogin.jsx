import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useToast } from '../../../components/Toast/ToastContext.jsx';
import { validateEmail } from '../../../utils/validation.js';
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

        {/* Left Side - Expanded Text Content */}
        <div className="admin-login-text">
          <h2>Fast, Efficient and Productive</h2>
          <p className="main-desc">
            Streamline your workflow with our powerful admin dashboard.
            Manage users, analyze data, and control your entire system from one centralized, secure location.
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Real-time analytics and reporting</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Advanced user management system</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">✓</span>
              <span>Secure and scalable infrastructure</span>
            </div>
          </div>
        </div>

        {/* Right Side - Clean Login Section */}
        <div className="admin-login-section">
          <div className="login-header">
            <h1>Sign In</h1>
            <p>Few Clicks To Manage</p>
          </div>

          <form onSubmit={onSubmit} className="clean-form" autoComplete="off">
            <div className="admin-group">
              <label>Email</label>
              <input
                type="email"
                className={`admin-input ${errors.email ? 'error' : ''}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@research.com"
                autoComplete="new-password"
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="admin-group">
              <label>Password</label>
              <input
                type="password"
                className={`admin-input ${errors.password ? 'error' : ''}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <div className="password-hint">
                Use 8+ characters with a mix of letters, numbers & symbols
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              <Lock size={16} /> {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}