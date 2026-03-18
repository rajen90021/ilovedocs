import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="not-found-page" style={{
      paddingTop: 'calc(72px + var(--space-4xl))',
      paddingBottom: 'var(--space-4xl)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      minHeight: '80vh'
    }}>
      <div className="container-sm">
        <div style={{ color: 'var(--brand-secondary)', marginBottom: 'var(--space-xl)' }}>
          <AlertTriangle size={80} />
        </div>
        <h1 className="hero__title" style={{ fontSize: '6rem' }}>404</h1>
        <h2 style={{ fontSize: '2rem', marginBottom: 'var(--space-md)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-2xl)', maxWidth: '440px', margin: '0 auto var(--space-2xl)' }}>
          Oops! The document you are looking for has been misplaced, deleted, or never existed in the first place.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/tools" className="btn btn-secondary">
            <Search size={18} /> Browse Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
