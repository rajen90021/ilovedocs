import { useState, useEffect } from 'react';
import axios from 'axios';
import { Filter } from 'lucide-react';
import Header from '../components/Header';
import ToolCard from '../components/ToolCard';
import ContentSection from '../components/ContentSection';
import SEOHead from '../components/SEOHead';
import FooterDirectory from '../components/FooterDirectory';
import AdUnit from '../components/AdUnit';
import { buildWebsiteJsonLd } from '../data/toolSEO';
import { API_URL } from '../context/AuthContext';
import './HomePage.css';

const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'pdf', label: 'PDF' },
  { id: 'image', label: 'Image' },
  { id: 'convert', label: 'Convert' },
];

export default function HomePage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    axios.get(`${API_URL}/api/tools`)
      .then(res => {
        setTools(res.data.tools || []);
      })
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tools.filter(tool => {
    const matchesSearch =
      searchQuery === '' ||
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = category === 'all' || tool.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="home-container">
      <SEOHead
        title="ILoveDocs — #1 Free YouTube & PDF Toolkit Dashboard"
        description="Premium online tools for creators and professionals. Download YouTube thumbnails, extract tags, merge PDFs, and summarize videos with AI. 100% Free."
        keywords="youtube SEO, youtube thumbnail downloader, merge pdf free, video summarizer ai, tag extractor"
        canonical="/"
        jsonLd={buildWebsiteJsonLd()}
      />

      <Header 
        tools={tools}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <main className="home-main">
        {/* All Tools Hero */}
        <section className="home-hero">
           <div className="bg-glow bg-glow-1" />
           <div className="container hero-content">
              <div className="hero-badge animate-fade-up">PREMIUM TOOLKIT</div>
              <h1 className="hero-title animate-fade-up delay-100">
                All <span className="text-gradient">Tools</span>
              </h1>
              <p className="hero-subtitle animate-fade-up delay-200">
                {tools.length}+ powerful utilities for creators and professionals. No signup required.
              </p>
           </div>
        </section>
        <div className="container" style={{ margin: '20px auto' }}>
          <AdUnit slot="7438986866" />
        </div>
        {/* Directory Controls */}
        <section className="directory-section">
          <div className="container">
            <div className="directory-controls animate-fade-up delay-300">
               <div className="category-tabs">
                  {CATEGORIES.map(cat => (
                     <button
                       key={cat.id}
                       className={`cat-pill ${category === cat.id ? 'active' : ''}`}
                       onClick={() => setCategory(cat.id)}
                     >
                       {cat.label} {cat.id !== 'all' && <span className="cat-count">{tools.filter(t => t.category === cat.id).length}</span>}
                     </button>
                  ))}
               </div>
               
               <div className="directory-meta">
                 <span className="results-count">Showing {filtered.length} tools</span>
               </div>
            </div>

            {loading ? (
              <div className="tools-grid-home">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="tool-skeleton shimmer" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="empty-directory animate-fade-up">
                <Filter size={48} className="empty-icon" />
                <h3>No tools found</h3>
                <p>Try adjusting your search or category filter.</p>
                <button className="btn btn-glass" onClick={() => { setSearchQuery(''); setCategory('all'); }}>
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="tools-grid-home">
                {filtered.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} delay={i * 30} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Home Content / SEO Articles */}
        <section className="home-content-body">
          <div className="container">
            <div className="dashboard-divider">
               <div className="divider-line" />
               <div className="divider-dot" />
               <div className="divider-line" />
            </div>
            <ContentSection />
          </div>
        </section>
      </main>

      {/* Massive Keyword-Rich Directory (SEO Growth) */}
      <FooterDirectory />
    </div>
  );
}
