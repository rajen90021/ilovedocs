import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  ChevronDown, 
  X,
  CircleUser,
  LogOut, 
  Layout,
  Circle 
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header({ 
  tools = [], // Should be passed from parent or fetched
  searchQuery, 
  setSearchQuery 
}) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isBrowseOpen, setIsBrowseOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const hideTimeout = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group PDF tools into subcategories for a neat dropdown
  const megaMenuColumns = [
    { 
      label: 'Conversions', 
      color: '#E63946', 
      tools: tools.filter(t => ['pdf-to-word', 'pdf-to-excel', 'pdf-to-ppt', 'pdf-to-jpg', 'pdf-to-png', 'jpg-to-pdf', 'word-to-pdf', 'excel-to-pdf', 'ppt-to-pdf', 'html-to-pdf'].includes(t.id)) 
    },
    { 
      label: 'Edit & Enhance', 
      color: '#4ECDC4', 
      tools: tools.filter(t => ['edit-pdf', 'watermark-pdf', 'page-numbers-pdf', 'remove-pages-pdf', 'reorder-pdf', 'crop-pdf', 'header-footer-pdf', 'redact-pdf'].includes(t.id)) 
    },
    { 
      label: 'Security & Utility', 
      color: '#3B82F6', 
      tools: tools.filter(t => ['protect-pdf', 'unlock-pdf', 'sign-pdf', 'flatten-pdf', 'ocr-pdf', 'repair-pdf', 'pdf-to-text', 'compare-pdf'].includes(t.id)) 
    }
  ];

  // Hover handlers for Mega Menu
  const handleMouseEnter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setIsBrowseOpen(true);
  };

  const handleMouseLeave = () => {
    hideTimeout.current = setTimeout(() => {
      setIsBrowseOpen(false);
    }, 200);
  };

  const handleSelectTool = (toolId) => {
    navigate(`/tools/${toolId}`);
    setIsBrowseOpen(false);
    setMobileMenuOpen(false);
    setSearchFocused(false);
  };

  const filteredSearchResults = searchQuery?.trim() 
    ? tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <header className="main-header" onMouseLeave={() => setSearchFocused(false)}>
      <div className="header-left">
        <Link to="/" className="logo-section" style={{ textDecoration: 'none', outline: 'none' }}>
          <div className="logo">
            <div className="logo-icon-red" style={{ 
               background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
               width: '40px', height: '40px', 
               borderRadius: '12px', 
               display: 'flex', alignItems: 'center', justifyContent: 'center',
               boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                 <polyline points="14 2 14 8 20 8"></polyline>
                 <line x1="16" y1="13" x2="8" y2="13"></line>
                 <line x1="16" y1="17" x2="8" y2="17"></line>
                 <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span style={{ fontWeight: 900, letterSpacing: '-0.5px', whiteSpace: 'nowrap', paddingRight: '4px' }}>
              iLove<span style={{ color: 'var(--brand-primary)' }}>Docs</span>
            </span>
          </div>
        </Link>

        <nav className="desktop-only main-nav">
          <Link to="/" className="nav-link">Home</Link>
          
          <div 
            className="browse-dropdown-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
             <button className={`nav-link browse-btn ${isBrowseOpen ? 'active' : ''}`}>
               Browse Tools <ChevronDown size={14} className={isBrowseOpen ? 'rotate-180' : ''} />
             </button>

             {isBrowseOpen && (
               <div className="mega-menu animated-in" ref={dropdownRef}>
                  <div className="mega-menu-grid">
                     {megaMenuColumns.map((col, idx) => (
                        <div key={idx} className="mega-column">
                           <div className="mega-title" style={{ color: col.color }}>{col.label}</div>
                           <div className="mega-tools">
                              {col.tools.map(tool => {
                                 const ToolIcon = Icons[toPascalCase(tool.icon)] || Circle;
                                 return (
                                    <button 
                                      key={tool.id} 
                                      className="mega-tool-item"
                                      onClick={() => handleSelectTool(tool.id)}
                                    >
                                       <ToolIcon size={16} />
                                       <span>{tool.name}</span>
                                    </button>
                                 );
                              })}
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}
          </div>
          <Link to="/tools" className="nav-link">See All Tools</Link>
        </nav>
      </div>

      <div className="header-center desktop-only">
        <div className={`premium-search-container ${searchFocused ? 'focused' : ''}`}>
          <div className="premium-search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for tools..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
            />
            {searchQuery && (
              <X 
                size={16} 
                className="clear-search" 
                onClick={() => setSearchQuery('')} 
              />
            )}
          </div>

          {searchFocused && filteredSearchResults.length > 0 && (
            <div className="search-results-dropdown animated-in">
              <div className="search-results-label">Search Results</div>
              {filteredSearchResults.map(tool => {
                const ToolIcon = Icons[toPascalCase(tool.icon)] || Circle;
                return (
                  <button 
                    key={tool.id} 
                    className="search-result-item" 
                    onClick={() => handleSelectTool(tool.id)}
                  >
                    <ToolIcon size={16} />
                    <div className="result-info">
                      <span className="result-name">{tool.name}</span>
                      <span className="result-cat">{tool.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="header-actions">
        <div className="profile-dropdown-wrapper" ref={profileRef}>
          <button 
            className={`account-btn-branded ${isProfileOpen ? 'active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            title="Account"
          >
            <CircleUser size={24} strokeWidth={1.5} />
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown animated-in">
              {user ? (
                <>
                  <div className="dropdown-user-info">
                    <div className="user-avatar-mini">
                      <CircleUser size={20} />
                    </div>
                    <div className="user-details">
                      <span className="user-name">{user.name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                  </div>
                  <div className="dropdown-divider" />
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <Layout size={16} />
                    <span>Dashboard</span>
                  </Link>
                  <button className="dropdown-item text-danger" onClick={() => { logout(); setIsProfileOpen(false); }}>
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <span>Sign In</span>
                  </Link>
                  <Link to="/register" className="dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    <span>Create Account</span>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>

        <button className="mobile-only menu-toggle-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer animated-in">
          <div className="mobile-search">
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="mobile-nav-group">
            {searchQuery.trim() ? (
              <div className="mobile-cat-section">
                <div className="mobile-cat-header">Search Results</div>
                <div className="mobile-tools-list">
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map(tool => (
                      <button key={tool.id} className="mobile-tool-link" onClick={() => handleSelectTool(tool.id)}>
                        {tool.name}
                      </button>
                    ))
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '10px' }}>No tools found matching "{searchQuery}"</div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="mobile-label">PDF Tools</div>
                {megaMenuColumns.map((col, idx) => (
                  <div key={idx} className="mobile-cat-section">
                    <div className="mobile-cat-header" style={{ color: col.color }}>{col.label}</div>
                    <div className="mobile-tools-list">
                      {col.tools.map(tool => (
                        <button key={tool.id} className="mobile-tool-link" onClick={() => handleSelectTool(tool.id)}>
                          {tool.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          
          {!searchQuery.trim() && (
            <div className="mobile-nav-group" style={{ borderTop: '1px solid var(--border-light)', paddingTop: '20px' }}>
              <div className="mobile-label">Account</div>
              <div className="mobile-tools-list">
                {user ? (
                  <>
                    <Link to="/dashboard" className="mobile-tool-link" onClick={() => setMobileMenuOpen(false)}>
                      <Layout size={18} />
                      Dashboard
                    </Link>
                    <button className="mobile-tool-link text-danger" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="mobile-tool-link" onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
                    <Link to="/register" className="mobile-tool-link" onClick={() => setMobileMenuOpen(false)}>Create Account</Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
