import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, FileText, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './AuthPage.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to ILoveDocs.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed. Please try again.';
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
          <h1 className="auth-card__title">Create an account</h1>
          <p className="auth-card__subtitle">Free forever. No credit card required.</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {errors.general && <div className="auth-error">{errors.general}</div>}

          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <div className="input-icon-wrap">
              <User size={16} className="input-icon" />
              <input id="reg-name" type="text" className={`form-input input-with-icon ${errors.name ? 'input-error' : ''}`}
                placeholder="John Doe" value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))} autoComplete="name" />
            </div>
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <div className="input-icon-wrap">
              <Mail size={16} className="input-icon" />
              <input id="reg-email" type="email" className={`form-input input-with-icon ${errors.email ? 'input-error' : ''}`}
                placeholder="you@example.com" value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))} autoComplete="email" />
            </div>
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input id="reg-password" type={showPwd ? 'text' : 'password'}
                className={`form-input input-with-icon input-with-icon-right ${errors.password ? 'input-error' : ''}`}
                placeholder="At least 6 characters" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} autoComplete="new-password" />
              <button type="button" className="input-icon-right" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
            <div className="input-icon-wrap">
              <Lock size={16} className="input-icon" />
              <input id="reg-confirm" type={showPwd ? 'text' : 'password'}
                className={`form-input input-with-icon ${errors.confirm ? 'input-error' : ''}`}
                placeholder="Repeat password" value={form.confirm}
                onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))} autoComplete="new-password" />
            </div>
            {errors.confirm && <span className="form-error">{errors.confirm}</span>}
          </div>

          <button id="register-btn" type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? <><span className="spinner" /> Creating account...</> : <><Zap size={16} /> Create Free Account</>}
          </button>

          <p className="auth-terms">
            By registering, you agree to our <a href="#" className="auth-link">Terms of Service</a> and <a href="#" className="auth-link">Privacy Policy</a>.
          </p>
        </form>

        <div className="auth-card__footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in</Link></p>
          <Link to="/tools" className="auth-link auth-link--muted">Continue without account →</Link>
        </div>
      </div>
    </div>
  );
}
