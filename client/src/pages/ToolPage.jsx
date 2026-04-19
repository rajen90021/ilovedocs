import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { ChevronRight, Home } from 'lucide-react';
import Header from '../components/Header';
import Workspace from '../components/Workspace';
import SEOHead from '../components/SEOHead';
import { TOOL_SEO, buildToolJsonLd, buildToolFaqJsonLd, buildHowToJsonLd, buildBreadcrumbJsonLd } from '../data/toolSEO';
import { getToolConfig } from '../data/toolConfigs';
import { API_URL } from '../context/AuthContext';
import ToolInfoSection from '../components/ToolInfoSection';
import './HomePage.css'; 

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [allTools, setAllTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/api/tools`)
      .then(res => {
        const tools = res.data.tools || [];
        setAllTools(tools);
        const found = tools.find(t => t.id === toolId);
        if (found) {
          setTool(found);
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [toolId, navigate]);

  if (loading || !tool) {
    return (
      <div className="dashboard-loading shimmer">
        <div className="spinner-glow" />
        <p>Loading {toolId}...</p>
      </div>
    );
  }

  const seoData = TOOL_SEO[tool.id];
  const jsonLd = [
    buildToolJsonLd(tool, seoData),
    buildToolFaqJsonLd(tool, seoData),
    buildHowToJsonLd(tool, seoData),
    buildBreadcrumbJsonLd(tool),
  ].filter(Boolean);

  return (
    <div className="app-container">
      <SEOHead
        title={seoData?.title ?? `${tool.name} — Free Online Tool`}
        description={seoData?.description ?? tool.description}
        keywords={seoData?.keywords ?? tool.name}
        canonical={`/tools/${tool.id}`}
        jsonLd={jsonLd}
      />

      <Header 
        tools={allTools}
        activeTool={tool}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="dashboard-layout top-nav-layout">
        <main className="dashboard-main">
          <div className="dashboard-content">
            
            {/* Breadcrumbs for SEO and UX */}
            <nav className="tool-breadcrumbs animated-in">
               <Link to="/"><Home size={14} /> Home</Link>
               <ChevronRight size={14} />
               <span className="breadcrumb-cat">{tool.category}</span>
               <ChevronRight size={14} />
               <span className="current">{tool.name}</span>
            </nav>

            <div className="workspace-container">
              <Workspace 
                tool={tool} 
                config={getToolConfig(tool.id)}
              />
            </div>
            
            {/* Standardized Premium SEO & Info Section */}
            <ToolInfoSection 
              seoData={seoData} 
              toolName={tool.name} 
            />
          </div>
        </main>
      </div>
    </div>
  );
}
