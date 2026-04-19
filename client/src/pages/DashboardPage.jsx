import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  File, 
  Trash2, 
  Clock, 
  Search,
  History,
  Activity,
  Zap,
  LayoutGrid,
  FileText,
  MousePointer2
} from 'lucide-react';
import { useAuth, API_URL } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './DashboardPage.css';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric'
  });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit'
  });
}

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [stats, setStats] = useState({ total_operations: 0, by_tool: [] });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [filesRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/files`),
        axios.get(`${API_URL}/api/files/stats`)
      ]);
      setFiles(filesRes.data.files || []);
      setStats({
        total_operations: statsRes.data.total || 0,
        by_tool: statsRes.data.stats || []
      });
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Remove this file from your history?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/files/${fileId}`);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File removed safely');
    } catch (err) {
      toast.error('Could not remove file');
    }
  };

  const filteredFiles = files.filter(file => 
    file.original_name.toLowerCase().includes(search.toLowerCase()) ||
    file.tool_used.toLowerCase().includes(search.toLowerCase())
  );

  const capitalizedName = user?.name 
    ? user.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    : 'User';

  if (authLoading || (loading && files.length === 0)) {
    return (
      <div className="dashboard-loading-state">
        <div className="premium-spinner" />
        <p>Syncing your workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      {/* Background Decor */}
      <div className="dashboard-glow-bg" />
      
      <div className="container">
        {/* Header Section */}
        <header className="dashboard-header-premium animate-fade-up">
          <div className="header-text">
            <h1 className="welcome-text">
              Welcome back, <span className="name-gradient">{capitalizedName}</span>
            </h1>
            <p className="welcome-sub">Your personal workspace is ready.</p>
          </div>
          <Link to="/tools" className="new-task-pill">
            <Zap size={18} fill="currentColor" />
            <span>Start New Task</span>
          </Link>
        </header>

        {/* Stats Section */}
        <div className="stats-container animate-fade-up delay-100">
          <div className="premium-stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon-group blue">
                <Activity size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Operations</span>
                <h3 className="stat-number">{stats.total_operations}</h3>
              </div>
              <div className="stat-sparkline">
                <div className="spark-bar" style={{ height: '30%' }} />
                <div className="spark-bar" style={{ height: '50%' }} />
                <div className="spark-bar" style={{ height: '100%' }} />
                <div className="spark-bar" style={{ height: '70%' }} />
              </div>
            </div>
          </div>

          <div className="premium-stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon-group gold">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Files</span>
                <h3 className="stat-number">{files.length}</h3>
              </div>
            </div>
          </div>

          <div className="premium-stat-card">
            <div className="stat-card-inner">
              <div className="stat-icon-group red">
                <MousePointer2 size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Active Tool</span>
                <h3 className="stat-number">
                  {stats.by_tool[0]?.tool_used.split('-')[0].toUpperCase() || 'NONE'}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="history-section animate-fade-up delay-200">
          <div className="history-section-header">
            <div className="title-with-count">
              <h2 className="section-title">Project History</h2>
              <span className="count-badge">{filteredFiles.length}</span>
            </div>
            
            <div className="search-integration">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Find a file..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="history-list-wrapper glass-surface">
            {filteredFiles.length === 0 ? (
              <div className="empty-workspace-view">
                <div className="empty-icon-ring">
                  <History size={40} />
                </div>
                <h3>Clean Slate</h3>
                <p>You haven't processed any files yet. Try our tools to get started!</p>
                <Link to="/tools" className="action-link-btn">
                  Browse Tool Catalog <ArrowUpRight size={16} />
                </Link>
              </div>
            ) : (
              <div className="table-flow">
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Method</th>
                      <th className="desktop-only">Size</th>
                      <th>Processed</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="table-row-premium">
                        <td>
                          <div className="file-identity">
                            <div className="file-type-icon">
                              <File size={14} />
                            </div>
                            <span className="name-string" title={file.original_name}>
                              {file.original_name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="tool-chip">
                            {file.tool_used.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="desktop-only text-muted">{formatBytes(file.size)}</td>
                        <td>
                          <div className="temporal-cell">
                            <span className="date-st">{formatDate(file.created_at)}</span>
                            <span className="time-st">{formatTime(file.created_at)}</span>
                          </div>
                        </td>
                        <td className="text-right">
                          <button 
                            className="delete-utility-btn" 
                            onClick={() => handleDelete(file.id)}
                            title="Delete Permanently"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Page Footer Spacing */}
      <div className="bottom-spacing" />
    </div>
  );
}

function ArrowUpRight({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <line x1="7" y1="17" x2="17" y2="7"></line>
      <polyline points="7 7 17 7 17 17"></polyline>
    </svg>
  );
}
