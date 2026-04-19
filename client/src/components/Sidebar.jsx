import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import './Sidebar.css';

const categories = [
  { id: 'youtube', label: 'YouTube Tools', icon: 'Youtube', color: 'var(--neon-youtube)' },
  { id: 'pdf', label: 'PDF Tools', icon: 'FileText', color: 'var(--neon-pdf)' },
  { id: 'image', label: 'Image Tools', icon: 'Image', color: 'var(--neon-image)' },
  { id: 'convert', label: 'Convert', icon: 'RefreshCw', color: 'var(--brand-accent)' },
];

export default function Sidebar({ tools, activeTool, onSelectTool, mobileOpen, setMobileOpen }) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('youtube');

  const filteredTools = tools.filter(t => t.category === activeCategory);

  // Auto-close on mobile when tool selected
  const handleSelectTool = (tool) => {
    onSelectTool(tool);
    if (window.innerWidth <= 768) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`} 
        onClick={() => setMobileOpen(false)} 
      />

      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="logo-icon-premium">
               <Icons.Zap size={20} fill="currentColor" />
            </div>
            {(!collapsed || mobileOpen) && (
              <span className="logo-text">
                ILoveDocs 
                <span className="premium-badge">PRO</span>
              </span>
            )}
          </div>
          <button className="sidebar__toggle desktop-only" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <Icons.ChevronRight size={18} /> : <Icons.ChevronLeft size={18} />}
          </button>
          <button className="sidebar__toggle mobile-only" onClick={() => setMobileOpen(false)}>
            <Icons.X size={20} />
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-label">{(!collapsed || mobileOpen) && 'Categories'}</div>
          <ul className="sidebar__categories">
            {categories.map(cat => {
              const Icon = Icons[cat.icon];
              return (
                <li key={cat.id}>
                  <button 
                    className={`category-item ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    title={cat.label}
                    style={{ '--cat-color': cat.color }}
                  >
                    <Icon size={20} />
                    {(!collapsed || mobileOpen) && <span>{cat.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="sidebar__divider" />

          <div className="sidebar__section-label">{(!collapsed || mobileOpen) && 'Tools'}</div>
          <ul className="sidebar__tools">
            {filteredTools.map(tool => {
              const ToolIcon = Icons[toPascalCase(tool.icon)] || Icons.Circle;
              return (
                <li key={tool.id}>
                  <button 
                    className={`tool-item ${activeTool?.id === tool.id ? 'active' : ''}`}
                    onClick={() => handleSelectTool(tool)}
                    title={tool.name}
                  >
                    <ToolIcon size={18} />
                    {(!collapsed || mobileOpen) && <span className="tool-name">{tool.name}</span>}
                    {activeTool?.id === tool.id && (!collapsed || mobileOpen) && (
                      <div className="active-glow" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar__footer">
          {(!collapsed || mobileOpen) && (
            <div className="sidebar-promo">
               <p>Rank #1 with AI SEO</p>
               <div className="promo-bar"><div className="promo-fill" /></div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
