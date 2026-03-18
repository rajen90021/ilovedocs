import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import SEOHead from '../components/SEOHead';
import { API_URL } from '../context/AuthContext';
import './ToolsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'pdf', label: 'PDF Tools' },
  { id: 'image', label: 'Image Tools' },
  { id: 'convert', label: 'Convert' },
];

const TOOLS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All PDF & Document Tools — ILoveDocs',
  description: 'Browse 20+ free online PDF and document tools including merge, split, compress, convert, and image editing tools.',
  url: 'https://ilovedocs.com/tools',
};

export default function ToolsPage() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  useEffect(() => {
    axios.get(`${API_URL}/api/tools`)
      .then(res => setTools(res.data.tools || []))
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);


  const filtered = tools.filter(tool => {
    const matchesSearch =
      search === '' ||
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || tool.category === category;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="tools-page">
      <SEOHead
        title="All Free PDF & Document Tools Online"
        description="Browse 20+ free online PDF and document conversion tools. Merge PDF, compress PDF, convert PDF to Word, Excel, JPG, and more — no signup, no watermark."
        keywords="all PDF tools, free document tools, PDF converter online, merge PDF, compress PDF, PDF to Word, Word to PDF, PDF tools list"
        canonical="/tools"
        jsonLd={TOOLS_JSON_LD}
      />
      <div className="tools-page__header">
        <div className="tools-page__bg-glow" />
        <div className="container">
          <h1 className="tools-page__title animate-fade-up">
            All <span className="text-gradient">Tools</span>
          </h1>
          <p className="tools-page__subtitle animate-fade-up delay-100">
            {tools.length}+ free document and PDF tools — no signup required
          </p>

          {/* Search */}
          <div className="tools-page__search animate-fade-up delay-200">
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                id="tool-search"
                type="text"
                placeholder="Search tools..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-4xl)' }}>
        {/* Category Tabs */}
        <div className="tools-page__tabs">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`tools-page__tab ${category === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
              {cat.id !== 'all' && (
                <span className="tools-page__tab-count">
                  {tools.filter(t => t.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
          <span className="tools-page__tab-results">
            {filtered.length} tool{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="tools-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="tool-card-skeleton" style={{ height: 160 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="tools-page__empty">
            <Filter size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }} />
            <h3>No tools found</h3>
            <p>Try a different search term or category</p>
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(''); setCategory('all'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="tools-grid">
            {filtered.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} delay={i * 40} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
