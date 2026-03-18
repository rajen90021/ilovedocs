import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <div className="navbar__logo-icon">
            <FileText size={20} />
          </div>
          <span className="navbar__logo-text">
            ILove<span>Docs</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="navbar__links">
          <Link to="/" className={`navbar__link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/tools" className={`navbar__link ${location.pathname.startsWith('/tools') ? 'active' : ''}`}>All Tools</Link>
        </div>

        {/* Right Actions */}
        <div className="navbar__actions">
          {user ? (
            <div className="navbar__user" onClick={() => setUserMenuOpen(!userMenuOpen)}>
              <div className="navbar__avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="navbar__username">{user.name.split(' ')[0]}</span>
              <ChevronDown size={14} className={`navbar__chevron ${userMenuOpen ? 'open' : ''}`} />

              {userMenuOpen && (
                <div className="navbar__dropdown">
                  <div className="navbar__dropdown-header">
                    <p className="navbar__dropdown-name">{user.name}</p>
                    <p className="navbar__dropdown-email">{user.email}</p>
                  </div>
                  <Link to="/dashboard" className="navbar__dropdown-item">
                    <LayoutDashboard size={15} /> Dashboard
                  </Link>
                  <button onClick={handleLogout} className="navbar__dropdown-item navbar__dropdown-item--danger">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                <Zap size={14} /> Get Started
              </Link>
            </>
          )}

          <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="navbar__mobile">
          <Link to="/" className="navbar__mobile-link">Home</Link>
          <Link to="/tools" className="navbar__mobile-link">All Tools</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="navbar__mobile-link">Dashboard</Link>
              <button onClick={handleLogout} className="navbar__mobile-link navbar__mobile-link--danger">Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar__mobile-link">Sign In</Link>
              <Link to="/register" className="navbar__mobile-link navbar__mobile-link--primary">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
