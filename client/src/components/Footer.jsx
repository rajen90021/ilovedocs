import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import './Footer.css';

const footerTools = [
  { name: 'Merge PDF', path: '/tools/merge-pdf' },
  { name: 'Split PDF', path: '/tools/split-pdf' },
  { name: 'Compress PDF', path: '/tools/compress-pdf' },
  { name: 'Rotate PDF', path: '/tools/rotate-pdf' },
  { name: 'Compress Image', path: '/tools/compress-image' },
  { name: 'Convert Image', path: '/tools/convert-image' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <FileText size={20} />
              </div>
              <span>ILove<span>Docs</span></span>
            </Link>
            <p className="footer__tagline">
              Free, fast, and secure document tools. Process your files directly in the browser with no limits.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="GitHub" className="footer__social-link"><Github size={18} /></a>
              <a href="#" aria-label="Twitter" className="footer__social-link"><Twitter size={18} /></a>
              <a href="#" aria-label="LinkedIn" className="footer__social-link"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Popular Tools */}
          <div className="footer__section">
            <h3 className="footer__heading">Popular Tools</h3>
            <ul className="footer__links">
              {footerTools.map(tool => (
                <li key={tool.path}>
                  <Link to={tool.path} className="footer__link">{tool.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="footer__section">
            <h3 className="footer__heading">Company</h3>
            <ul className="footer__links">
              <li><Link to="/" className="footer__link">Home</Link></li>
              <li><Link to="/tools" className="footer__link">All Tools</Link></li>
              <li><Link to="/register" className="footer__link">Get Started Free</Link></li>
              <li><Link to="/login" className="footer__link">Sign In</Link></li>
            </ul>
          </div>

          {/* Security */}
          <div className="footer__section">
            <h3 className="footer__heading">Security & Privacy</h3>
            <ul className="footer__links">
              <li><a href="#" className="footer__link">Privacy Policy</a></li>
              <li><a href="#" className="footer__link">Terms of Service</a></li>
              <li><a href="#" className="footer__link">Cookie Policy</a></li>
            </ul>
            <div className="footer__badge">
              <span>🔒</span>
              <span>Files auto-deleted after 1 hour</span>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} ILoveDocs. All rights reserved.
          </p>
          <p className="footer__made-with">
            Made with <Heart size={12} className="footer__heart" /> for document lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
