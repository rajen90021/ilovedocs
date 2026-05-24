import { useState, useEffect } from 'react';
import axios from 'axios';
import * as Icons from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../context/AuthContext';
import './Workspace.css';

export default function Workspace({ tool, config }) {
  const { toast } = useToast();
  const [url, setUrl] = useState('');
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState({});
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);


  // Reset state when the active tool changes
  useEffect(() => {
    setUrl('');
    setFiles([]);
    setOptions({});
    setResult(null);
    setProcessing(false);
    setProgress(0);
  }, [tool?.id]);

  const onDrop = (accepted) => {
    if (accepted.length === 0) return;

    // Instant validation for unwanted file types
    if (tool.acceptedTypes && tool.acceptedTypes.length > 0) {
      const invalidFiles = accepted.filter(file => {
        // match extension
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        // check if explicitly allowed
        return !tool.acceptedTypes.includes(ext);
      });

      if (invalidFiles.length > 0) {
        toast.error(`Invalid file type. Accepted formats: ${tool.acceptedTypes.join(', ')}`);
        return;
      }
    }

    // Instant validation for multiple files in single-file tools
    if (!config?.multi && accepted.length > 1) {
      toast.error('This tool only accepts a single file. Selecting the first file only.');
      setFiles([accepted[0]]);
      setResult(null);
      return;
    }

    setFiles(config?.multi ? [...files, ...accepted] : [accepted[0]]);
    setResult(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: config?.multi,
  });

  const handleProcess = async () => {
    const isUrl = config?.type === 'url';
    if (isUrl) {
      if (!url || !url.trim()) {
        toast.error('Please enter a valid URL');
        return;
      }
    } else {
      if (files.length === 0) {
        toast.error('Please upload at least one file');
        return;
      }
      if (!config.multi && files.length > 1) {
        toast.error('This tool only accepts a single file');
        return;
      }
      // Basic PDF/Image MIME validations
      if (tool.category === 'pdf' || tool.id.includes('pdf')) {
        // exceptions for tools like jpg-to-pdf which process images to PDF
        if (tool.id !== 'jpg-to-pdf') {
          const hasInvalid = files.some(f => f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf'));
          if (hasInvalid) {
            toast.error('Please upload PDF files only');
            return;
          }
        } else {
          const hasInvalid = files.some(f => !f.type.startsWith('image/'));
          if (hasInvalid) {
            toast.error('Please upload valid Image files only');
            return;
          }
        }
      }
      if (tool.category === 'image' && tool.id !== 'pdf-to-jpg') {
        const hasInvalid = files.some(f => !f.type.startsWith('image/'));
        if (hasInvalid) {
          toast.error('Please upload valid Image files only');
          return;
        }
      }

      // PDF security validations
      if ((tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (!options.password || !options.password.trim())) {
        toast.error('Please enter a password for this tool.');
        return;
      }
    }

    // Build the full URL robustly to avoid double /api
    const getBaseApi = () => {
      let base = API_URL || '';
      if (!base.includes('/api')) base += '/api';
      return base;
    };

    const getFullUrl = (endpoint) => {
      const base = getBaseApi();
      const cleanEndpoint = endpoint.startsWith('/api') ? endpoint.substring(4) : endpoint;
      return `${base}${cleanEndpoint}`;
    };



    setProcessing(true);
    setProgress(0);
    setResult(null);

    const messages = [
      'Analyzing YouTube metrics...',
      'Bypassing the matrix...',
      'Fetching data from the cloud...',
      'Generating your high-quality result...',
      'Almost there, finishing touches...',
      'Optimizing performance...',
    ];
    let msgIdx = 0;
    const msgInterval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      const el = document.querySelector('.processing-text');
      if (el) el.innerText = messages[msgIdx];
    }, 2500);

    try {
      let response;
      let isFileDownload = false;
      let downloadFilename = 'downloaded_file';

      if (tool.endpoint?.startsWith('/client/')) {
        const { processClientTool } = await import('../utils/pdfProcessor.js');
        const res = await processClientTool(tool.id, files, options);
        response = { data: res.blob };
        downloadFilename = res.filename;
        isFileDownload = true;
      } else {
        if (url) {
          const endpoint = tool.endpoint;
          const fullUrl = getFullUrl(endpoint);
          response = await axios.post(fullUrl, { url });
        } else {
          const formData = new FormData();
          files.forEach(f => formData.append(config.multi ? 'files' : 'file', f));
          
          // Append dynamic configuration options
          Object.entries(options).forEach(([key, val]) => {
            if (val) formData.append(key, val);
          });

          response = await axios.post(`${API_URL}${tool.endpoint}`, formData, {
            responseType: 'blob'
          });
          isFileDownload = true;

          // Try extracting filename from headers if backend sends it
          const contentDisposition = response.headers['content-disposition'];
          if (contentDisposition && contentDisposition.includes('filename=')) {
            downloadFilename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
          } else {
            // Fallback guess based on tool
            if (tool.id.includes('pdf')) downloadFilename = 'ilovedocs_output.pdf';
            if (tool.id.includes('image') || tool.id.includes('jpg')) downloadFilename = 'ilovedocs_output.jpg';
            if (tool.id.includes('word')) downloadFilename = 'ilovedocs_output.docx';
            if (tool.id.includes('excel')) downloadFilename = 'ilovedocs_output.xlsx';
          }
        }
      }

      clearInterval(msgInterval);
      setProgress(100);
      
      let fileUrl = null;
      if (isFileDownload) {
        fileUrl = window.URL.createObjectURL(new Blob([response.data]));
        // Auto-trigger download for better UX
        const link = document.createElement('a');
        link.href = fileUrl;
        link.setAttribute('download', downloadFilename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      }

      setResult({ data: response.data, isFileDownload, downloadFilename, fileUrl });
      toast.success(`${tool.name} complete!`);
    } catch (err) {
      let status = err.response?.status;
      let errorData = 'Processing failed. Please try again.';

      // Handle Blob errors (occur when responseType is 'blob')
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const json = JSON.parse(text);
          errorData = json.error || json.message || errorData;
        } catch (e) {
          console.error('Failed to parse error blob', e);
        }
      } else {
        errorData = err.response?.data?.error || err.response?.data?.message || errorData;
      }

      // Map errors to user-friendly UI states
      let errorState = {
        isError: true,
        errorTitle: 'Something Went Wrong',
        errorMsg: errorData,
      };

      if (status === 429) {
        errorState.errorTitle = 'Rate Limit Reached';
        errorState.errorMsg = 'YouTube is limiting requests. Please wait a minute and try again.';
      } else if (status === 403) {
        errorState.errorTitle = 'Video Restricted';
        errorState.errorMsg = 'This video is private, age-restricted, or blocked in this region.';
      } else if (errorData.includes('Transcript unavailable') || errorData.includes('no captions found')) {
        errorState = {
          isError: true,
          errorTitle: 'Captions Not Found',
          errorMsg: 'This YouTube video does not have captions or transcripts enabled.',
          suggestion: 'Our AI needs transcripts to summarize or extract text. Please try a video with Closed Captions (CC) enabled.',
          iconName: 'FileX'
        };
      } else if (status === 403 || errorData.includes('blocked') || errorData.includes('Security Block')) {
        errorState = {
          isError: true,
          errorTitle: 'YouTube Security Limit',
          errorMsg: errorData || 'YouTube has temporarily restricted our access to this content.',
          suggestion: 'This often happens with popular or music-related videos. Please try again in 5-10 minutes or try a different video.',
          iconName: 'ShieldAlert'
        };
      } else if (status === 400 || errorData.includes('Invalid YouTube URL')) {
        errorState = {
          isError: true,
          errorTitle: 'Invalid Link',
          errorMsg: 'The URL provided doesn\'t seem to be a standard YouTube link.',
          suggestion: 'Make sure it looks like: https://youtube.com/watch?v=VIDEO_ID',
          iconName: 'Link2Off'
        };
      } else if (status === 500) {
        errorState = {
          isError: true,
          errorTitle: 'Processing Error',
          errorMsg: errorData || 'Our processing engine encountered an unexpected hurdle.',
          suggestion: 'This specific video might be restricted or protected. Please try another link or check back soon.',
          iconName: 'ServerCrash'
        };
      }

      setResult(errorState);
    } finally {
      setProcessing(false);
    }
  };

  if (!tool) return null;

  const ToolIcon = Icons[toPascalCase(tool.icon)] || Icons.Zap;
  const isUrlTool = config?.type === 'url';

  return (
    <div className="workspace-container">
      <div className="workspace-glass">
        <div className="workspace-header">
          <div className="tool-badge-icon">
            <ToolIcon size={24} />
          </div>
          <div className="tool-info">
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
          </div>
        </div>

        <div className="workspace-body">
          {!result && !processing && (
            <div className="input-area">
              {isUrlTool ? (
                <div className="url-input-container">
                  <div className="premium-input-wrapper">
                    <Icons.Link className="input-icon" size={18} />
                    <input
                      type="text"
                      className="premium-url-input"
                      placeholder="Paste YouTube video URL here (e.g. https://youtube.com/watch?v=...)"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
                    />
                  </div>
                  <div className="process-btn-row">
                    <button className="btn btn-primary btn-process-main" onClick={handleProcess}>
                      Process Content <Icons.ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div {...getRootProps()} className={`premium-dropzone ${isDragActive ? 'active' : ''}`}>
                  <input {...getInputProps()} />
                  <div className="dropzone-inner">
                    <div className="dropzone-icon">
                      <Icons.UploadCloud size={36} />
                    </div>
                    <p className="dropzone-text">
                      {isDragActive ? 'Drop it here!' : 'Drag & Drop or Click to Browse'}
                    </p>
                    <span className="dropzone-hint">{config?.acceptedInfo}</span>
                  </div>
                </div>
              )}

              {files.length > 0 && !isUrlTool && (
                <>
                  <div className="file-preview-grid" style={{ marginTop: '16px' }}>
                    {files.map((f, i) => (
                      <div key={i} className="file-preview-tag">
                        <Icons.File size={14} />
                        <span>{f.name}</span>
                        <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))}>
                          <Icons.X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Dynamic Tool Options Menu */}
              {(files.length > 0) && (
                <>
                  <div className="tool-options-container" style={{ marginTop: '24px', background: 'white', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                    <h4 style={{ marginBottom: '16px', fontSize: '1rem', color: 'var(--text-main)' }}>Configuration Options</h4>

                    {tool.id === 'split-pdf' && (
                      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Pages to extract (e.g. "1,3,5" or "1-3")</label>
                        <input type="text" placeholder="Leave empty to split all pages" value={options.pages || ''} onChange={e => setOptions({ ...options, pages: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                      </div>
                    )}

                    {tool.id === 'rotate-pdf' && (
                      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rotation Angle (Degrees)</label>
                        <select value={options.angle || '90'} onChange={e => setOptions({ ...options, angle: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                          <option value="90">90° Clockwise</option>
                          <option value="180">180° Flip</option>
                          <option value="270">90° Counter-Clockwise</option>
                        </select>
                      </div>
                    )}

                    {tool.id === 'watermark-pdf' && (
                      <div className="options-grid">
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Watermark Text</label>
                          <input type="text" placeholder="CONFIDENTIAL" value={options.text || ''} onChange={e => setOptions({ ...options, text: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Color</label>
                          <select value={options.color || 'gray'} onChange={e => setOptions({ ...options, color: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <option value="gray">Gray</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                          </select>
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Opacity (0.1 - 1.0)</label>
                          <input type="number" step="0.1" min="0.1" max="1.0" value={options.opacity || '0.3'} onChange={e => setOptions({ ...options, opacity: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                      </div>
                    )}

                    {tool.id === 'reorder-pdf' && (
                      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>New Page Order (e.g. "3,1,2")</label>
                        <input type="text" placeholder="Required: 3,1,2" value={options.order || ''} onChange={e => setOptions({ ...options, order: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                      </div>
                    )}

                    {tool.id === 'edit-pdf' && (
                      <div className="options-grid">
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Add Text to PDF</label>
                          <input type="text" placeholder="Text to insert" value={options.text || ''} onChange={e => setOptions({ ...options, text: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Add to X Pos</label>
                          <input type="number" value={options.x || '50'} onChange={e => setOptions({ ...options, x: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Add to Y Pos</label>
                          <input type="number" value={options.y || '50'} onChange={e => setOptions({ ...options, y: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Color</label>
                          <select value={options.color || 'black'} onChange={e => setOptions({ ...options, color: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                            <option value="black">Black</option>
                            <option value="red">Red</option>
                            <option value="blue">Blue</option>
                          </select>
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Font Size</label>
                          <input type="number" value={options.size || '12'} onChange={e => setOptions({ ...options, size: e.target.value })} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} />
                        </div>
                      </div>
                    )}

                    {(tool.id === 'protect-pdf' || tool.id === 'unlock-pdf') && (
                      <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tool.id === 'protect-pdf' ? 'Set Password to Protect PDF' : 'Enter Password to Unlock PDF'}</label>
                        <input 
                          type="password" 
                          placeholder="Enter password..." 
                          value={options.password || ''} 
                          onChange={e => setOptions({ ...options, password: e.target.value })} 
                          style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--border-light)' }} 
                        />
                      </div>
                    )}
                  </div>

                  <div className="process-btn-row">
                    <button className="btn btn-primary btn-process-main" onClick={() => handleProcess()}>
                       Process File <Icons.Zap size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {processing && (
            <div className="workspace-processing">
              <div className="progress-ring-container">
                <svg className="progress-ring" width="120" height="120">
                  <circle
                    className="progress-ring-circle"
                    stroke="var(--brand-primary)"
                    strokeWidth="4"
                    fill="transparent"
                    r="52"
                    cx="60"
                    cy="60"
                    style={{ strokeDashoffset: `${326 - (326 * progress) / 100}`, strokeDasharray: '326 326' }}
                  />
                </svg>
                <span className="progress-pct">{Math.round(progress)}%</span>
              </div>
              <p className="processing-text">Analyzing YouTube metrics...</p>
            </div>
          )}

          {result && (
            <div className="workspace-result animated-in">
              {!result.isError && (
                <div className="result-header">
                  <Icons.CheckCircle color="#10b981" size={40} />
                  <h3>Analysis Ready</h3>
                </div>
              )}

              <div className="result-data-box">
                {!result.isError && (
                  <>

                  </>
                )}

                {/* ─── Modernized Error Notice ─── */}
                {result.isError && (
                  <div className="specific-error-view animated-in" style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
                      <div className="error-icon-box" style={{ padding: '16px', borderRadius: '50%', background: result.iconName === 'ShieldAlert' ? '#fffbeb' : '#fff1f2', color: result.iconName === 'ShieldAlert' ? '#f59e0b' : '#ef4444' }}>
                        {(() => {
                           const IconComp = Icons[result.iconName] || Icons.AlertCircle;
                           return <IconComp size={32} />;
                        })()}
                      </div>
                      <div className="error-text-content">
                        <h3 style={{ color: 'var(--text-main)', fontSize: '1.25rem', marginBottom: '8px' }}>{result.errorTitle}</h3>
                        <p style={{ color: 'var(--text-soft)', fontSize: '0.925rem', lineHeight: '1.6', maxWidth: '400px', margin: '0 auto' }}>{result.errorMsg}</p>
                      </div>
                      <div style={{ marginTop: '8px', padding: '12px 20px', background: 'rgba(0, 0, 0, 0.03)', borderRadius: '12px', fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icons.Lightbulb size={16} color="var(--brand-primary)" />
                        <span>{result.suggestion}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── File Download Results ─── */}
                {result.isFileDownload && (
                  <div className="file-download-result" style={{ textAlign: 'center', padding: '32px 16px' }}>
                    <Icons.FileCheck size={48} color="#10b981" style={{ marginBottom: '16px', display: 'inline-block' }} />
                    <h3 style={{ marginBottom: '8px', fontSize: '1.25rem', color: 'var(--text-main)' }}>File Ready!</h3>
                    <p style={{ color: 'var(--text-soft)', marginBottom: '24px' }}>Your file has been processed successfully.</p>

                    <a href={result.fileUrl} download={result.downloadFilename} className="btn btn-primary" style={{ display: 'inline-flex', padding: '12px 32px', margin: '0 auto' }}>
                      <Icons.Download size={18} style={{ marginRight: '8px' }} />
                      Download {result.downloadFilename.substring(0, 15) + (result.downloadFilename.length > 15 ? '...' : '')}
                    </a>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" style={{ width: '100%', marginTop: '24px' }}
                onClick={() => { setResult(null); setUrl(''); setFiles([]); }}>
                Try Another Link
              </button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
