import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  File, 
  Trash2, 
  ExternalLink, 
  Clock, 
  BarChart3, 
  ArrowUpRight, 
  Search,
  History,
  Activity,
  Zap
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
    year: 'numeric',
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
    if (!window.confirm('Are you sure you want to delete this file from history?')) return;
    
    try {
      await axios.delete(`${API_URL}/api/files/${fileId}`);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.success('File removed from history');
    } catch (err) {
      toast.error('Failed to delete file');
    }
  };

  const filteredFiles = files.filter(file => 
    file.original_name.toLowerCase().includes(search.toLowerCase()) ||
    file.tool_used.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || (loading && files.length === 0)) {
    return (
      <div className="dashboard-page loading">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Header */}
        <header className="dashboard-header animate-fade-up">
          <div>
            <h1 className="dashboard-title">
              Welcome back, <span className="text-gradient">{user?.name}</span>
            </h1>
            <p className="dashboard-subtitle">Manage your recent activities and file history</p>
          </div>
          <Link to="/tools" className="btn btn-primary">
            <Zap size={18} /> New Task
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid animate-fade-up delay-100">
          <div className="stat-card glass-card">
            <div className="stat-card__icon stat-card__icon--blue">
              <Activity size={24} />
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">Total Operations</p>
              <h3 className="stat-card__value">{stats.total_operations}</h3>
            </div>
            <div className="stat-card__chart">
              {/* Simple CSS bar representation of stats */}
              <div className="stat-mini-bar" style={{ height: '40%' }} />
              <div className="stat-mini-bar" style={{ height: '70%' }} />
              <div className="stat-mini-bar" style={{ height: '100%' }} />
              <div className="stat-mini-bar" style={{ height: '50%' }} />
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card__icon stat-card__icon--purple">
              <History size={24} />
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">Recent Files</p>
              <h3 className="stat-card__value">{files.length}</h3>
            </div>
          </div>

          <div className="stat-card glass-card">
            <div className="stat-card__icon stat-card__icon--green">
              <BarChart3 size={24} />
            </div>
            <div className="stat-card__content">
              <p className="stat-card__label">Most Used Tool</p>
              <h3 className="stat-card__value">
                {stats.by_tool[0]?.tool_used.split('-')[0].toUpperCase() || 'N/A'}
              </h3>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="dashboard-content animate-fade-up delay-200">
          <div className="dashboard-content__header">
            <h2 className="content-title">File History</h2>
            <div className="search-bar">
              <Search size={16} />
              <input 
                type="text" 
                placeholder="Filter files..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="history-container glass-card">
            {filteredFiles.length === 0 ? (
              <div className="empty-history">
                <File size={48} className="empty-history__icon" />
                <p>No document history found</p>
                <Link to="/tools" className="auth-link">Try a tool now</Link>
              </div>
            ) : (
              <div className="history-table-wrapper">
                <table className="history-table">
                  <thead>
                    <tr>
                      <th>File Name</th>
                      <th>Tool Used</th>
                      <th>Size</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="history-row">
                        <td>
                          <div className="file-cell">
                            <div className="file-cell__icon">
                              <File size={16} />
                            </div>
                            <span className="file-cell__name" title={file.original_name}>
                              {file.original_name}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-purple">
                            {file.tool_used.replace('-', ' ')}
                          </span>
                        </td>
                        <td>{formatBytes(file.size)}</td>
                        <td>
                          <div className="date-cell">
                            <Clock size={12} />
                            {formatDate(file.created_at)}
                          </div>
                        </td>
                        <td>
                          <div className="actions-cell">
                            <button className="action-btn action-btn--delete" onClick={() => handleDelete(file.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
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
    </div>
  );
}
