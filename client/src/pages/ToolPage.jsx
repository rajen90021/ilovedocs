import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import { TOOL_SEO, buildToolJsonLd, buildToolFaqJsonLd } from '../data/toolSEO';
import './ToolPage.css';


// Tool-specific configuration
const TOOL_CONFIG = {
  'merge-pdf': {
    options: null,
    multi: true,
    acceptedInfo: 'PDF files only • Up to 20 files',
  },
  'split-pdf': {
    options: [
      { key: 'pages', label: 'Pages to Extract', type: 'text', placeholder: 'e.g. 1-3, 5, 7 (leave empty to split all)', required: false },
    ],
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'rotate-pdf': {
    options: [
      {
        key: 'angle', label: 'Rotation Angle', type: 'select', required: true,
        choices: [{ v: '90', l: '90° Clockwise' }, { v: '180', l: '180°' }, { v: '270', l: '270° Clockwise' }],
      },
    ],
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'compress-pdf': {
    options: null,
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'watermark-pdf': {
    options: [
      { key: 'text', label: 'Watermark Text', type: 'text', placeholder: 'e.g. CONFIDENTIAL', required: true },
      { key: 'opacity', label: 'Opacity (0.1 – 1.0)', type: 'number', placeholder: '0.3', required: false },
      {
        key: 'color', label: 'Text Color', type: 'select', required: false,
        choices: [{ v: 'gray', l: 'Gray' }, { v: 'red', l: 'Red' }, { v: 'blue', l: 'Blue' }],
      },
    ],
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'protect-pdf': {
    options: null,
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'unlock-pdf': {
    options: null,
    multi: false,
    acceptedInfo: 'Single PDF file',
  },
  'reorder-pdf': {
    options: [
      { key: 'order', label: 'Page Order', type: 'text', placeholder: 'e.g. 3,1,2 (new order of pages)', required: true },
    ],
    multi: false,
    acceptedInfo: 'Single PDF file',
    hint: 'Enter page numbers in the desired order, separated by commas.',
  },
  'jpg-to-pdf': {
    options: null,
    multi: true,
    acceptedInfo: 'JPG, PNG, WebP, BMP images',
  },
  'compress-image': {
    options: [
      { key: 'quality', label: 'Quality (1–100)', type: 'number', placeholder: '80', required: false },
      {
        key: 'format', label: 'Output Format', type: 'select', required: false,
        choices: [{ v: 'jpeg', l: 'JPEG' }, { v: 'png', l: 'PNG' }, { v: 'webp', l: 'WebP' }],
      },
    ],
    multi: false,
    acceptedInfo: 'JPG, PNG, WebP images',
  },
  'resize-image': {
    options: [
      { key: 'width', label: 'Width (px)', type: 'number', placeholder: 'e.g. 1920', required: false },
      { key: 'height', label: 'Height (px)', type: 'number', placeholder: 'e.g. 1080', required: false },
      {
        key: 'fit', label: 'Fit Mode', type: 'select', required: false,
        choices: [
          { v: 'inside', l: 'Inside (maintain ratio)' },
          { v: 'cover', l: 'Cover (crop to fit)' },
          { v: 'contain', l: 'Contain (letterbox)' },
          { v: 'fill', l: 'Fill (stretch)' },
        ],
      },
    ],
    multi: false,
    acceptedInfo: 'JPG, PNG, WebP, BMP images',
  },
  'convert-image': {
    options: [
      {
        key: 'to', label: 'Convert To', type: 'select', required: true,
        choices: [
          { v: 'jpeg', l: 'JPEG (.jpg)' },
          { v: 'png', l: 'PNG (.png)' },
          { v: 'webp', l: 'WebP (.webp)' },
          { v: 'bmp', l: 'BMP (.bmp)' },
          { v: 'tiff', l: 'TIFF (.tiff)' },
          { v: 'gif', l: 'GIF (.gif)' },
        ],
      },
    ],
    multi: false,
    acceptedInfo: 'JPG, PNG, WebP, BMP, GIF, TIFF images',
  },
  'edit-pdf': {
    options: [
      { key: 'text', label: 'Text to Add', type: 'text', placeholder: 'Enter text...', required: true },
      { key: 'x', label: 'X Position (px)', type: 'number', placeholder: '50', required: false },
      { key: 'y', label: 'Y Position (px)', type: 'number', placeholder: '50', required: false },
      { key: 'size', label: 'Font Size', type: 'number', placeholder: '12', required: false },
      {
        key: 'color', label: 'Text Color', type: 'select',
        choices: [{ v: 'black', l: 'Black' }, { v: 'red', l: 'Red' }, { v: 'blue', l: 'Blue' }],
      },
    ],
    multi: false,
    acceptedInfo: 'Single PDF file',
    hint: 'This will add text to the first page of your PDF.',
  },
  'pdf-to-word': { options: null, multi: false, acceptedInfo: 'Single PDF file' },
  'pdf-to-excel': { options: null, multi: false, acceptedInfo: 'Single PDF file' },
  'word-to-pdf': { options: null, multi: false, acceptedInfo: 'Word file (.docx)' },
  'excel-to-pdf': { options: null, multi: false, acceptedInfo: 'Excel file (.xlsx)' },
  'ppt-to-pdf': { options: null, multi: false, acceptedInfo: 'PowerPoint file (.pptx)' },
  'html-to-pdf': { options: null, multi: false, acceptedInfo: 'HTML file (.html)' },
};

function toPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function ToolPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [tool, setTool] = useState(null);
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({});
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null); // { url, filename, originalSize, newSize, reduction }
  const [error, setError] = useState(null);

  const config = TOOL_CONFIG[toolId] || { options: null, multi: false, acceptedInfo: 'Supported files' };

  useEffect(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setOptions({});

    axios.get(`${API_URL}/api/tools`)
      .then(res => {
        const found = res.data.tools?.find(t => t.id === toolId);
        if (found) {
          setTool(found);
          // title is handled by SEOHead now
        } else {
          navigate('/tools');
        }
      })
      .catch(() => navigate('/tools'));
  }, [toolId, navigate]);


  const onDrop = useCallback((accepted) => {
    if (config.multi) {
      setFiles(prev => [...prev, ...accepted]);
    } else {
      setFiles([accepted[0]]);
    }
    setResult(null);
    setError(null);
  }, [config.multi]);

  const acceptMap = {
    'merge-pdf': { 'application/pdf': ['.pdf'] },
    'split-pdf': { 'application/pdf': ['.pdf'] },
    'rotate-pdf': { 'application/pdf': ['.pdf'] },
    'compress-pdf': { 'application/pdf': ['.pdf'] },
    'watermark-pdf': { 'application/pdf': ['.pdf'] },
    'protect-pdf': { 'application/pdf': ['.pdf'] },
    'unlock-pdf': { 'application/pdf': ['.pdf'] },
    'reorder-pdf': { 'application/pdf': ['.pdf'] },
    'jpg-to-pdf': { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'] },
    'compress-image': { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    'resize-image': { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp'] },
    'convert-image': { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.tiff'] },
    'edit-pdf': { 'application/pdf': ['.pdf'] },
    'pdf-to-word': { 'application/pdf': ['.pdf'] },
    'pdf-to-excel': { 'application/pdf': ['.pdf'] },
    'pdf-to-jpg': { 'application/pdf': ['.pdf'] },
    'word-to-pdf': { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'application/msword': ['.doc'] },
    'excel-to-pdf': { 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'], 'application/vnd.ms-excel': ['.xls'] },
    'ppt-to-pdf': { 'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'] },
    'html-to-pdf': { 'text/html': ['.html', '.htm'] },
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptMap[toolId] || {},
    multiple: config.multi,
    maxSize: 52428800,
    onDropRejected: (rejected) => {
      const msg = rejected[0]?.errors[0]?.message || 'File rejected. Check type or size.';
      toast.error(msg);
    },
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('Please upload a file first');
      return;
    }

    setProcessing(true);
    setProgress(0);
    setError(null);
    setResult(null);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 88));
    }, 300);

    try {
      const formData = new FormData();

      if (config.multi || toolId === 'merge-pdf' || toolId === 'jpg-to-pdf') {
        files.forEach(f => formData.append('files', f));
      } else {
        formData.append('file', files[0]);
      }

      // Append options
      Object.entries(options).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          formData.append(key, value);
        }
      });

      const token = localStorage.getItem('ilovedocs_token');
      const headers = { 'Content-Type': 'multipart/form-data' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const response = await axios.post(`${API_URL}${tool.endpoint}`, formData, {
        headers,
        responseType: 'blob',
        timeout: 120000,
      });

      clearInterval(progressInterval);
      setProgress(100);

      // Get metadata from headers
      const originalSize = parseInt(response.headers['x-original-size']) || null;
      const newSize = parseInt(response.headers['x-compressed-size']) || null;
      const reduction = parseInt(response.headers['x-reduction-percent']) || null;

      // Get filename from Content-Disposition
      const disposition = response.headers['content-disposition'] || '';
      const filenameMatch = disposition.match(/filename="(.+?)"/);
      const filename = filenameMatch ? filenameMatch[1] : `${toolId}-result.${getOutputExt(toolId)}`;

      // Create blob URL
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = URL.createObjectURL(blob);

      setResult({ url, filename, originalSize, newSize, reduction });
      toast.success('File processed successfully!');
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);

      let errorMsg = 'Processing failed. Please try again.';
      if (err.response) {
        // Parse blob error response
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errorMsg = json.error || errorMsg;
        } catch (e) {
          errorMsg = `Server error: ${err.response.status}`;
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMsg = 'Request timed out. Try a smaller file.';
      }
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    a.click();
  };

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setProgress(0);
    setOptions({});
    if (result?.url) URL.revokeObjectURL(result.url);
  };

  function getOutputExt(id) {
    // Specific conversions first — BEFORE generic checks
    if (id === 'pdf-to-jpg')    return 'jpg';
    if (id === 'pdf-to-word')   return 'docx';
    if (id === 'pdf-to-excel')  return 'xlsx';
    if (id === 'word-to-pdf')   return 'pdf';
    if (id === 'excel-to-pdf')  return 'pdf';
    if (id === 'ppt-to-pdf')    return 'pdf';
    if (id === 'html-to-pdf')   return 'pdf';
    if (id === 'jpg-to-pdf')    return 'pdf';
    if (id === 'convert-image') return options.to || 'jpg';
    if (id === 'compress-image' || id === 'resize-image') return 'jpg';
    // Generic: anything containing 'pdf' stays pdf, else pdf
    if (id.endsWith('-pdf') || id.startsWith('pdf-') || id.includes('pdf')) return 'pdf';
    return 'pdf';
  }

  const seoData = tool ? TOOL_SEO[tool.id] : null;
  const IconComponent = tool ? (Icons[toPascalCase(tool.icon)] || Icons.FileText) : Icons.FileText;

  if (!tool) {
    return (
      <div className="tool-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  const jsonLd = [
    buildToolJsonLd(tool, seoData),
    buildToolFaqJsonLd(tool),
  ];

  return (
    <div className="tool-page">
      {/* SEO */}
      <SEOHead
        title={seoData?.title ?? `${tool.name} — Free Online Tool`}
        description={seoData?.description ?? tool.description}
        keywords={seoData?.keywords ?? tool.name}
        canonical={`/tools/${tool.id}`}
        jsonLd={jsonLd}
      />

      {/* Header */}
      <div className="tool-page__header" style={{ '--tool-color': tool.color }}>
        <div className="tool-page__header-bg" />
        <div className="container-sm">
          <Link to="/tools" className="tool-page__back">
            <Icons.ArrowLeft size={16} /> All Tools
          </Link>
          <div className="tool-page__hero">
            <div className="tool-page__icon">
              <IconComponent size={32} />
            </div>
            <div>
              <h1 className="tool-page__title">{tool.name}</h1>
              <p className="tool-page__desc">{tool.description}</p>
            </div>
          </div>

          {/* Trust badges */}
          <div className="tool-page__badges">
            <span className="badge badge-green">🔒 Secure</span>
            <span className="badge badge-blue">⚡ Fast Processing</span>
            <span className="badge badge-purple">🗑️ Auto-deleted in 1hr</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-sm tool-page__body">

        {/* Step 1: Upload */}
        {!result && (
          <div className="tool-step animate-fade-up">
            <div className="tool-step__label">
              <span className="step-num">1</span>
              <span>Upload {config.multi ? 'Files' : 'File'}</span>
            </div>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              id="dropzone"
              className={`dropzone ${isDragActive ? 'dropzone--active' : ''} ${files.length > 0 ? 'dropzone--has-files' : ''}`}
            >
              <input {...getInputProps()} />
              <div className="dropzone__content">
                <div className="dropzone__icon">
                  <Icons.Upload size={32} className="dropzone__icon-svg" />
                </div>
                <p className="dropzone__title">
                  {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
                </p>
                <p className="dropzone__subtitle">or <span className="dropzone__link">click to browse</span></p>
                <p className="dropzone__info">{config.acceptedInfo} • Max 50MB per file</p>
              </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
              <div className="file-list">
                {files.map((file, index) => (
                  <div key={index} className="file-item">
                    <div className="file-item__icon">
                      <Icons.File size={18} />
                    </div>
                    <div className="file-item__info">
                      <p className="file-item__name">{file.name}</p>
                      <p className="file-item__size">{formatBytes(file.size)}</p>
                    </div>
                    <button
                      className="file-item__remove"
                      onClick={() => removeFile(index)}
                      disabled={processing}
                    >
                      <Icons.X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Hint */}
            {config.hint && (
              <div className="tool-hint">
                <Icons.Info size={14} />
                {config.hint}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Options */}
        {!result && config.options && config.options.length > 0 && (
          <div className="tool-step animate-fade-up delay-100">
            <div className="tool-step__label">
              <span className="step-num">2</span>
              <span>Options</span>
            </div>
            <div className="options-grid">
              {config.options.map(opt => (
                <div key={opt.key} className="form-group">
                  <label className="form-label" htmlFor={`opt-${opt.key}`}>{opt.label}</label>
                  {opt.type === 'select' ? (
                    <select
                      id={`opt-${opt.key}`}
                      className="form-input"
                      value={options[opt.key] || ''}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    >
                      <option value="">Default</option>
                      {opt.choices?.map(c => (
                        <option key={c.v} value={c.v}>{c.l}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`opt-${opt.key}`}
                      type={opt.type}
                      className="form-input"
                      placeholder={opt.placeholder}
                      value={options[opt.key] || ''}
                      onChange={e => setOptions(prev => ({ ...prev, [opt.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="tool-error animate-fade-in">
            <Icons.AlertCircle size={18} />
            <div>
              <p className="tool-error__title">Processing Failed</p>
              <p className="tool-error__msg">{error}</p>
            </div>
          </div>
        )}

        {/* Progress */}
        {processing && (
          <div className="tool-processing animate-fade-in">
            <div className="spinner spinner-lg" />
            <p>Processing your file{files.length > 1 ? 's' : ''}...</p>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="tool-processing__pct">{Math.round(progress)}%</span>
          </div>
        )}

        {/* Process Button */}
        {!result && !processing && (
          <div className="animate-fade-up delay-200">
            <button
              id="process-btn"
              className="btn btn-primary btn-lg w-full"
              onClick={handleProcess}
              disabled={files.length === 0 || processing}
              style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}aa)` }}
            >
              <IconComponent size={20} />
              {tool.name}
            </button>
          </div>
        )}

        {/* Step 3: Result */}
        {result && (
          <div className="tool-result animate-fade-up">
            <div className="tool-result__success">
              <div className="tool-result__check">
                <Icons.CheckCircle size={40} />
              </div>
              <h2 className="tool-result__title">Done!</h2>
              <p className="tool-result__subtitle">Your file is ready to download</p>

              {/* Compression stats */}
              {result.originalSize && result.newSize && (
                <div className="tool-result__stats">
                  <div className="tool-result__stat">
                    <span className="tool-result__stat-label">Original</span>
                    <span className="tool-result__stat-value">{formatBytes(result.originalSize)}</span>
                  </div>
                  <Icons.ArrowRight size={16} style={{ color: 'var(--text-muted)' }} />
                  <div className="tool-result__stat">
                    <span className="tool-result__stat-label">Result</span>
                    <span className="tool-result__stat-value">{formatBytes(result.newSize)}</span>
                  </div>
                  {result.reduction > 0 && (
                    <div className="tool-result__badge">
                      <span>↓ {result.reduction}% smaller</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="tool-result__actions">
              <button
                id="download-btn"
                className="btn btn-primary btn-lg"
                onClick={handleDownload}
              >
                <Icons.Download size={20} />
                Download {result.filename}
              </button>
              <button
                id="reset-btn"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                <Icons.RotateCcw size={16} />
                Process Another File
              </button>
            </div>

            <p className="tool-result__note">
              <Icons.Clock size={13} />
              Your file will be automatically deleted from our servers in 1 hour
            </p>
          </div>
        )}
      </div>

      {/* ── SEO Content Section ── rendered below the fold for indexing ── */}
      <section className="tool-seo-section" aria-label="About this tool">
        <div className="container-sm">
          <div className="tool-seo-content">
            <h2 className="tool-seo-content__title">About {tool.name}</h2>
            <p className="tool-seo-content__desc">
              {seoData?.description ?? tool.description}
            </p>

            <div className="tool-seo-benefits">
              <h3>Why use ILoveDocs {tool.name}?</h3>
              <ul>
                <li>✅ <strong>100% Free</strong> — No payment or subscription required, ever.</li>
                <li>✅ <strong>No Sign-Up</strong> — Start converting instantly without creating an account.</li>
                <li>✅ <strong>Secure & Private</strong> — Files are transferred over HTTPS and auto-deleted after 1 hour.</li>
                <li>✅ <strong>Works On Any Device</strong> — Use on Windows, Mac, Linux, iOS, or Android via your browser.</li>
                <li>✅ <strong>Fast Processing</strong> — Powered by an optimised server engine for instant results.</li>
                <li>✅ <strong>Up to 50 MB</strong> — Supports files up to 50 MB per upload.</li>
              </ul>
            </div>

            <div className="tool-seo-faq">
              <h3>Frequently Asked Questions</h3>
              <div className="faq-item">
                <strong>Is {tool.name} free?</strong>
                <p>Yes. {tool.name} on ILoveDocs is completely free with no sign-up, no watermark, and no usage limits.</p>
              </div>
              <div className="faq-item">
                <strong>How long are my files stored?</strong>
                <p>All uploaded and processed files are automatically and permanently deleted from our servers after 1 hour.</p>
              </div>
              <div className="faq-item">
                <strong>What is the maximum file size?</strong>
                <p>You can upload files up to 50 MB. For larger files, consider compressing them first.</p>
              </div>
              <div className="faq-item">
                <strong>Is my data secure?</strong>
                <p>Yes. All file transfers are encrypted using HTTPS. We do not share your files with any third parties.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
