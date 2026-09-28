import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Lock } from 'lucide-react';
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
      <div className="admin-login-card">
        <div className="admin-login-logo">
          <GraduationCap size={28} />
        </div>
        <h1>Admin Login</h1>
        <p>Sign in to access the admin panel</p>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? 'error' : ''}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@research.com"
            />
            {errors.email && <div className="form-error">{errors.email}</div>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            {errors.password && <div className="form-error">{errors.password}</div>}
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            <Lock size={16} /> {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}