import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Zap, Shield, Clock, Star, ChevronRight, FileText, Image, RefreshCw } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import SEOHead from '../components/SEOHead';
import { buildWebsiteJsonLd } from '../data/toolSEO';
import { API_URL } from '../context/AuthContext';
import './HomePage.css';

const stats = [
  { value: '20+', label: 'PDF & Document Tools' },
  { value: '100%', label: 'Free Forever' },
  { value: '50MB', label: 'Max File Size' },
  { value: '1hr', label: 'Auto File Delete' },
];

const features = [
  {
    icon: <Zap size={24} />,
    title: 'Lightning Fast',
    desc: 'Process documents in seconds with our optimized backend engine.',
    color: '#F59E0B',
  },
  {
    icon: <Shield size={24} />,
    title: 'Secure & Private',
    desc: 'All files are encrypted in transit and automatically deleted after 1 hour.',
    color: '#10B981',
  },
  {
    icon: <Clock size={24} />,
    title: 'No Signup Required',
    desc: 'Start converting instantly. Create an account to save your history.',
    color: '#6C63FF',
  },
  {
    icon: <Star size={24} />,
    title: 'High Quality Output',
    desc: 'Maintain document integrity and quality through every conversion.',
    color: '#EC4899',
  },
];

const categories = [
  { id: 'pdf', label: 'PDF Tools', icon: <FileText size={18} />, color: '#E63946' },
  { id: 'image', label: 'Image Tools', icon: <Image size={18} />, color: '#FF6B6B' },
  { id: 'convert', label: 'Convert', icon: <RefreshCw size={18} />, color: '#4ECDC4' },
];

export default function HomePage() {
  const [tools, setTools] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_URL}/api/tools`)
      .then(res => setTools(res.data.tools || []))
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'all'
    ? tools.slice(0, 8)
    : tools.filter(t => t.category === activeCategory).slice(0, 8);

  return (
    <div className="home">
      <SEOHead
        title="Free Online PDF & Document Tools"
        description="ILoveDocs — Merge, split, compress, rotate, watermark, convert PDF files & images online for free. 20+ powerful tools. No signup, no watermark, files auto-deleted in 1 hour."
        keywords="free PDF tools, merge PDF online, compress PDF, PDF to Word, Word to PDF, PDF to JPG, PDF converter, image converter, online document tools"
        canonical="/"
        jsonLd={buildWebsiteJsonLd()}
      />
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg-grid" />
        <div className="hero__bg-glow hero__bg-glow--1" />
        <div className="hero__bg-glow hero__bg-glow--2" />
        <div className="container hero__content">
          <div className="hero__badge animate-fade-up">
            <span className="hero__badge-dot" />
            Free Online Document Tools Platform
          </div>
          <h1 className="hero__title animate-fade-up delay-100">
            Transform Your <br />
            <span className="text-gradient">Documents</span> Instantly
          </h1>
          <p className="hero__subtitle animate-fade-up delay-200">
            Merge, split, compress, convert, and edit PDFs and images. 
            20+ powerful tools — all free, all private, all fast.
          </p>
          <div className="hero__cta animate-fade-up delay-300">
            <Link to="/tools" className="btn btn-primary btn-lg">
              Explore All Tools <ArrowRight size={18} />
            </Link>
            <Link to="/tools/merge-pdf" className="btn btn-secondary btn-lg">
              Try Merge PDF
            </Link>
          </div>

          {/* Stats */}
          <div className="hero__stats animate-fade-up delay-400">
            {stats.map(stat => (
              <div key={stat.label} className="hero__stat">
                <span className="hero__stat-value text-gradient">{stat.value}</span>
                <span className="hero__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="tools-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">All <span className="text-gradient">Tools</span></h2>
              <p className="section-subtitle">Everything you need to work with documents</p>
            </div>
            <Link to="/tools" className="btn btn-secondary btn-sm">
              View All <ChevronRight size={14} />
            </Link>
          </div>

          {/* Category Filter */}
          <div className="category-filter">
            <button
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All Tools
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                style={{ '--cat-color': cat.color }}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>

          {/* Tool Grid */}
          {loading ? (
            <div className="tools-loading">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="tool-card-skeleton" />
              ))}
            </div>
          ) : (
            <div className="tools-grid">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} delay={i * 50} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <div className="text-center">
              <h2 className="section-title">How It <span className="text-gradient">Works</span></h2>
              <p className="section-subtitle">Get your tasks done in 3 simple steps</p>
            </div>
          </div>
          <div className="how-it-works__steps">
            <div className="work-step">
              <div className="work-step__icon">1</div>
              <h3>Choose a Tool</h3>
              <p>Select from over 20+ PDF, image, and document tools available on our platform.</p>
            </div>
            <div className="work-step__divider"></div>
            <div className="work-step">
              <div className="work-step__icon">2</div>
              <h3>Upload & Process</h3>
              <p>Drag and drop your files. Our fast server-side engine will handle the heavy lifting.</p>
            </div>
            <div className="work-step__divider"></div>
            <div className="work-step">
              <div className="work-step__icon">3</div>
              <h3>Download Result</h3>
              <p>Get your processed files instantly. They are auto-deleted after 1 hour for your privacy.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <div className="text-center">
              <h2 className="section-title">Why Choose <span className="text-gradient">ILoveDocs</span>?</h2>
              <p className="section-subtitle">Built for speed, security, and simplicity</p>
            </div>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={f.title} className="feature-card animate-fade-up" style={{ animationDelay: `${i * 100}ms`, '--feat-color': f.color }}>
                <div className="feature-card__icon">
                  {f.icon}
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <div className="cta-banner__inner">
            <div className="cta-banner__glow" />
            <h2 className="cta-banner__title">
              Ready to get started?
            </h2>
            <p className="cta-banner__subtitle">
              No account needed. Pick a tool and start converting in seconds.
            </p>
            <div className="cta-banner__actions">
              <Link to="/tools/merge-pdf" className="btn btn-primary btn-lg">
                Merge PDF Free <ArrowRight size={18} />
              </Link>
              <Link to="/tools/compress-pdf" className="btn btn-secondary btn-lg">
                Compress PDF
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
