import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, Grid3X3, Layers } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import Header from '../components/Header';
import SEOHead from '../components/SEOHead';
import { API_URL } from '../context/AuthContext';
import { buildToolsItemListJsonLd } from '../data/toolSEO';
import './ToolsPage.css';

const CATEGORIES = [
  { id: 'all', label: 'All Tools' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'pdf', label: 'PDF' },
  { id: 'image', label: 'Image' },
  { id: 'convert', label: 'Convert' },
];

const TOOLS_JSON_LD = (tools) => [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'All YouTube, PDF & Image Tools | ILoveDocs',
    description: 'Browse the ultimate free online toolkit for YouTube creators and professionals.',
    url: 'https://ilovedocs.in/tools',
  },
  buildToolsItemListJsonLd(tools)
];

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
    <div className="app-container">
      <SEOHead
        title="All Tools — Free YouTube & PDF Creator Kit"
        description="Browse our suite of free online tools for YouTube creators and professionals. Get thumbnails, calculate revenue, check SEO scores, merge PDFs, and more."
        keywords="all youtube tools, free PDF tools, online document tools, youtube revenue calculator, youtube SEO score"
        canonical="/tools"
        jsonLd={TOOLS_JSON_LD(tools)}
      />

      <Header 
        tools={tools}
        searchQuery={search}
        setSearchQuery={setSearch}
      />

      <div className="tools-directory-layout">
        {/* Hero Section */}
        <div className="tools-hero">
           <div className="bg-glow bg-glow-1" style={{ top: '-10%', left: '20%' }} />
           <div className="container tools-hero-content">
             <div className="badge badge-red animate-fade-up">Premium Toolkit</div>
             <h1 className="animate-fade-up delay-100">
               All <span className="text-gradient">Tools</span>
             </h1>
             <p className="subtitle animate-fade-up delay-200">
               {tools.length}+ powerful utilities for creators and professionals. No signup required.
             </p>
           </div>
        </div>

        <div className="container directory-container">
          {/* Filters & Tabs */}
          <div className="directory-controls animate-fade-up delay-300">
             <div className="category-tabs">
                {CATEGORIES.map(cat => (
                   <button
                     key={cat.id}
                     className={`cat-pill ${category === cat.id ? 'active' : ''}`}
                     onClick={() => setCategory(cat.id)}
                   >
                     {cat.label}
                     {cat.id !== 'all' && (
                        <span className="cat-count">
                           {tools.filter(t => t.category === cat.id).length}
                        </span>
                     )}
                   </button>
                ))}
             </div>
             
             <div className="directory-meta">
               <span className="results-count">Showing {filtered.length} tools</span>
             </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="premium-tools-grid">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="tool-card-skeleton shimmer" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-directory">
              <Filter size={48} className="empty-icon" />
              <h3>No tools found</h3>
              <p>Try adjusting your search or category filter.</p>
              <button className="btn btn-secondary" onClick={() => { setSearch(''); setCategory('all'); }}>
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="premium-tools-grid">
              {filtered.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} delay={i * 30} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
