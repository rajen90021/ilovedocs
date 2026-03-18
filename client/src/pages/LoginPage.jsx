import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, FileText, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AuthPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__bg" />
      <div className="auth-card animate-fade-up">
        <div className="auth-card__logo">
          <div className="auth-card__logo-icon"><FileText size={22} /></div>
          <span>ILove<span>Docs</span></span>
        </div>

        <div className="auth-card__header">
          <h1 className="auth-card__title">Welcome back</h1>
          <p className="auth-card__subtitle">Sign in to your account to continue</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.general && (
            <div className="auth-error">{errors.general}</div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input
                id="login-email"
                type="email"
                className={`form-input input-with-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                autoComplete="email"
              />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input
                id="login-password"
                type={showPwd ? 'text' : 'password'}
                className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'input-error' : ''}`}
                placeholder="Your password"
                value={form.password}
                onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                autoComplete="current-password"
              />
              <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <button id="login-btn" type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in...</> : <><Zap size={16} /> Sign In</>}
          </button>
        </form>

        <div className="auth-card__footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Create one free</Link></p>
          <Link to="/tools" className="auth-link auth-link--muted">Continue without account →</Link>
        </div>
      </div>
    </div>
  );
}
