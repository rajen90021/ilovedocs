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
  const [recentChecks, setRecentChecks] = useState([]);
  const [videoInfo, setVideoInfo] = useState(null);
  const [fetchingInfo, setFetchingInfo] = useState(false);
  const [selectedItag, setSelectedItag] = useState(null);

  // Load recent checks from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('yt_recent_checks');
    if (saved) setRecentChecks(JSON.parse(saved));
  }, []);

  // Reset state when the active tool changes
  useEffect(() => {
    setUrl('');
    setFiles([]);
    setOptions({});
    setResult(null);
    setProcessing(false);
    setProgress(0);
    setVideoInfo(null);
    setFetchingInfo(false);
    setSelectedItag(null);
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
      // YouTube URL validation
      if (tool.category === 'youtube') {
        try {
          const urlObj = new URL(url.trim());
          const validHosts = ['youtube.com', 'm.youtube.com', 'youtu.be', 'www.youtube.com'];
          if (!validHosts.includes(urlObj.hostname)) {
            toast.error('Please enter a valid YouTube URL (e.g. youtube.com/watch?v=...)');
            return;
          }
        } catch (e) {
          toast.error('Invalid URL format');
          return;
        }
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

    // Step 1: Fetch Video Info for Video Downloader
    if (tool.id === 'yt-video-download' && !videoInfo) {
      setFetchingInfo(true);
      setProgress(20);
      try {
        const fullUrl = getFullUrl('/youtube/video-info');
        const infoRes = await axios.post(fullUrl, { url });
        setVideoInfo(infoRes.data);
        if (infoRes.data.qualities?.length > 0) {
          setSelectedItag(infoRes.data.qualities[0].itag);
        }
        setProgress(100);
        toast.success('Video analyzed! Choose quality.');
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to analyze video');
      } finally {
        setFetchingInfo(false);
        setProgress(0);
      }
      return;
    }

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

      const fileReturnTools = ['yt-to-doc', 'yt-to-pdf', 'yt-to-markdown', 'yt-video-download', 'yt-audio-extract'];
      const shouldReturnFile = fileReturnTools.includes(tool.id);

      if (url) {
        if (shouldReturnFile) {
          // Pass selected itag if available
          const payload = { url };
          if (selectedItag) payload.itag = selectedItag;
          
          const fullUrl = getFullUrl(tool.endpoint);
          response = await axios.post(fullUrl, payload, { responseType: 'blob' });
          isFileDownload = true;
          
          const contentDisposition = response.headers['content-disposition'];
          if (contentDisposition && contentDisposition.includes('filename=')) {
            downloadFilename = contentDisposition.split('filename=')[1].split(';')[0].replace(/"/g, '');
          } else {
            if (tool.id === 'yt-to-doc') downloadFilename = 'youtube_transcript.docx';
            if (tool.id === 'yt-to-pdf') downloadFilename = 'youtube_transcript.pdf';
            if (tool.id === 'yt-to-markdown') downloadFilename = 'youtube_transcript.md';
            if (tool.id === 'yt-video-download') downloadFilename = 'youtube_video.mp4';
            if (tool.id === 'yt-audio-extract') downloadFilename = 'youtube_audio.mp3';
          }
        } else {
          // Check if tool has an explicit endpoint, otherwise guess from ID
          const endpoint = tool.endpoint || `/youtube/${tool.id.replace('yt-', '')}`;
          const fullUrl = getFullUrl(endpoint);
          response = await axios.post(fullUrl, { url });
        }

        // Save to recent checks for YouTube tools
        if (tool.category === 'youtube' && !shouldReturnFile) {
          const newCheck = {
            id: Date.now(),
            toolId: tool.id,
            toolName: tool.name,
            url,
            title: response.data.title || 'YouTube Result',
            timestamp: new Date().toISOString(),
          };
          const updated = [newCheck, ...recentChecks].filter(c => c.url !== url).slice(0, 5);
          setRecentChecks(updated);
          localStorage.setItem('yt_recent_checks', JSON.stringify(updated));
        }
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

      clearInterval(interval);
      clearInterval(msgInterval);
      setProgress(100);
      
      let fileUrl = null;
      if (isFileDownload) {
        fileUrl = window.URL.createObjectURL(new Blob([response.data]));
      }

      setResult({ data: response.data, isFileDownload, downloadFilename, fileUrl });
      toast.success(`${tool.name} complete!`);
    } catch (err) {
      let status = err.response?.status;
      let errorData = err.response?.data?.error || 'Processing failed. Please try again.';

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
              {(videoInfo || !isUrlTool) && (
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

                    {tool.id === 'yt-video-download' && videoInfo && (
                      <div className="options-grid">
                        <div className="video-preview-card" style={{ gridColumn: 'span 2', display: 'flex', gap: '16px', padding: '12px', background: 'rgba(0,0,0,0.03)', borderRadius: '12px', marginBottom: '8px' }}>
                          <img src={videoInfo.thumbnail} alt="preview" style={{ width: '120px', height: '68px', borderRadius: '8px', objectFit: 'cover' }} />
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h4 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{videoInfo.title}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{videoInfo.author}</span>
                          </div>
                        </div>
                        <div className="option-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Download Quality</label>
                          <select 
                            value={selectedItag || ''} 
                            onChange={e => setSelectedItag(e.target.value)} 
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.9rem', background: 'white' }}
                          >
                            {videoInfo.qualities.map(q => (
                              <option key={q.itag} value={q.itag}>
                                {q.quality} {q.fps > 30 ? `(${q.fps}fps)` : ''} — {q.size} ({q.container})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {!['split-pdf', 'rotate-pdf', 'watermark-pdf', 'reorder-pdf', 'edit-pdf', 'yt-video-download'].includes(tool.id) && (
                      <p style={{ color: 'var(--text-muted)' }}>No additional configuration needed. Ready to process!</p>
                    )}
                  </div>

                  <div className="process-btn-row">
                    <button className="btn btn-primary btn-process-main" onClick={handleProcess} disabled={fetchingInfo}>
                      {fetchingInfo ? (
                        <>Analyzing... <Icons.Loader2 className="spin" size={16} /></>
                      ) : (
                        videoInfo ? <>Start Download <Icons.Download size={16} /></> : <>Analyze Link <Icons.Zap size={16} /></>
                      )}
                    </button>
                    {videoInfo && (
                      <button className="btn btn-glass" onClick={() => setVideoInfo(null)} style={{ marginLeft: '12px' }}>
                        Change Link
                      </button>
                    )}
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
                    {/* ─── Thumbnail Downloader ─── */}
                    {tool.id === 'yt-thumbnail' && (
                      <div className="thumbnail-results">
                        {Object.entries(result.data.thumbnails).map(([quality, thumbUrl]) => (
                          <div key={quality} className="thumb-item">
                            <img src={thumbUrl} alt={`${quality} thumbnail`} className="thumb-preview" />
                            <div className="thumb-actions">
                              <span className="quality-label">{quality.toUpperCase()}</span>
                              <a href={thumbUrl} target="_blank" rel="noreferrer" className="btn btn-glass btn-sm">
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* ─── Tags Extractor ─── */}
                    {tool.id === 'yt-tags' && (
                      <div className="tags-container">
                        <div className="tags-header">
                          <strong>{result.data.tags?.length || 0} Tags Found</strong>
                          <button className="btn btn-glass btn-sm" onClick={() => {
                            navigator.clipboard.writeText((result.data.tags || []).join(', '));
                            toast.success('Tags copied!');
                          }}>Copy All</button>
                        </div>
                        {result.data.tags && result.data.tags.length > 0 ? (
                          <div className="tags-list">
                            {result.data.tags.map((t, i) => <span key={i} className="tag-pill">{t}</span>)}
                          </div>
                        ) : (
                          <p style={{ color: 'var(--text-muted)', marginTop: '12px' }}>No public tags found for this video.</p>
                        )}
                      </div>
                    )}

                    {/* ─── Transcript Fetcher ─── */}
                    {tool.id === 'yt-transcript' && (
                      <div className="summary-result">
                        <div className="summary-header">
                          <Icons.FileText size={16} />
                          <span>Full Transcript</span>
                          <button className="btn btn-glass btn-sm" style={{ marginLeft: 'auto' }} onClick={() => {
                            navigator.clipboard.writeText(result.data.fullText);
                            toast.success('Transcript copied!');
                          }}>Copy</button>
                        </div>
                        <div className="transcript-box">
                          <p>{result.data.fullText}</p>
                        </div>
                      </div>
                    )}

                    {/* ─── AI Summarizer ─── */}
                    {tool.id === 'yt-summarize' && (
                      <div className="summary-result">
                        <div className="summary-header">
                          <Icons.Sparkles size={16} />
                          <span>AI Generated Summary</span>
                        </div>
                        <div className="summary-content">
                          {(result.data.summary || '').split('\n').map((line, i) =>
                            line.trim() ? <p key={i}>{line}</p> : null
                          )}
                        </div>
                      </div>
                    )}

                    {/* ─── Region Checker ─── */}
                    {tool.id === 'yt-region' && (
                      <div className="summary-result">
                        <div className="summary-header">
                          <Icons.Globe size={16} />
                          <span>Region Restriction Status</span>
                        </div>
                        {result.data.restricted ? (
                          <div>
                            {result.data.restrictions.blocked?.length > 0 && (
                              <div style={{ marginTop: '12px' }}>
                                <strong style={{ color: '#ef4444' }}>Blocked In:</strong>
                                <div className="tags-list" style={{ marginTop: '8px' }}>
                                  {result.data.restrictions.blocked.map(c => (
                                    <span key={c} className="tag-pill" style={{ color: '#ef4444', borderColor: '#fecaca' }}>{c}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.data.restrictions.allowed?.length > 0 && (
                              <div style={{ marginTop: '12px' }}>
                                <strong style={{ color: '#10b981' }}>Allowed In:</strong>
                                <div className="tags-list" style={{ marginTop: '8px' }}>
                                  {result.data.restrictions.allowed.map(c => (
                                    <span key={c} className="tag-pill">{c}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p style={{ color: '#10b981', fontWeight: 600, marginTop: '12px' }}>
                            ✅ Available Worldwide — No region restrictions found.
                          </p>
                        )}
                      </div>
                    )}

                    {/* ─── Monetization Checker (Premium Overhaul) ─── */}
                    {tool.id === 'yt-monetization' && (
                      <div className="monetization-dashboard">
                        <div className="dashboard-header">
                          <div className="channel-badge-premium">
                            {result.data.channelLogo ? (
                              <img src={result.data.channelLogo} alt={result.data.channelName} className="channel-logo" />
                            ) : (
                              <div className="channel-logo-placeholder">{result.data.channelName?.charAt(0)}</div>
                            )}
                            <div className="channel-info-text">
                              <h4>{result.data.channelName}</h4>
                              <span>{result.data.channelHandle || 'Public Channel'}</span>
                            </div>
                          </div>
                          <div className={`status-pill-premium ${result.data.monetized ? 'active' : 'inactive'}`}>
                            {result.data.monetized ? <Icons.Zap size={14} /> : <Icons.AlertCircle size={14} />}
                            {result.data.monetized ? 'Monetized' : 'Not Monetized'}
                          </div>
                        </div>

                        <div className="premium-stats-grid">
                          <div className="stat-card">
                            <Icons.Users className="stat-icon" size={18} />
                            <div className="stat-value">{result.data.subscriberCount}</div>
                            <div className="stat-label">Subscribers</div>
                          </div>
                          <div className="stat-card highlight">
                            <Icons.DollarSign className="stat-icon" size={18} />
                            <div className="stat-value">{result.data.estimatedEarnings}</div>
                            <div className="stat-label">Estimated Revenue</div>
                          </div>
                          <div className="stat-card">
                            <Icons.Eye className="stat-icon" size={18} />
                            <div className="stat-value">{result.data.viewCount}</div>
                            <div className="stat-label">Total Views</div>
                          </div>
                        </div>

                        <div className="monetization-details">
                          <div className="detail-item-premium">
                            <Icons.ShieldCheck size={15} color="#10b981" />
                            <span>Family Friendly: <strong>{result.data.familyFriendly ? 'Safe' : 'Restricted'}</strong></span>
                          </div>
                          <div className="detail-item-premium">
                            <Icons.Calendar size={15} color="#ef4444" />
                            <span>Published: <strong>{result.data.publishDate}</strong></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ─── SEO Score Checker (New Tool) ─── */}
                    {tool.id === 'yt-seo-score' && (
                      <div className="seo-dashboard">
                        <div className="seo-score-header">
                          <div className="score-ring-large" style={{ '--score-color': result.data.score > 70 ? '#10b981' : result.data.score > 40 ? '#f59e0b' : '#ef4444' }}>
                            <span className="score-num">{result.data.score}</span>
                            <span className="score-denominator">/ 100</span>
                          </div>
                          <div className="score-verdict">
                            <h4>SEO Strength</h4>
                            <p>{result.data.recommendation}</p>
                          </div>
                        </div>

                        <div className="seo-checklist">
                          {result.data.details.map((item, i) => (
                            <div key={i} className={`checklist-item ${item.status}`}>
                              <div className="item-icon">
                                {item.status === 'perfect' ? <Icons.CheckCircle2 size={16} /> :
                                  item.status === 'warning' ? <Icons.AlertCircle size={16} /> :
                                    <Icons.XCircle size={16} />}
                              </div>
                              <div className="item-text">
                                <strong>{item.label}</strong>
                                <p>{item.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ─── Revenue Calculator (New Tool) ─── */}
                    {tool.id === 'yt-revenue' && (
                      <div className="revenue-dashboard">
                        <div className="revenue-header-pro">
                          <div className="channel-badge-premium">
                            {result.data.logo ? (
                              <img src={result.data.logo} alt={result.data.name} className="channel-logo" />
                            ) : (
                              <div className="channel-logo-placeholder">{result.data.name?.charAt(0)}</div>
                            )}
                            <div className="channel-info-text">
                              <h4>{result.data.name}</h4>
                              <span>{result.data.type === 'channel' ? 'Channel Analysis' : 'Video Analysis'} • {result.data.subs} Subs</span>
                            </div>
                          </div>
                          <div className="total-views-badge">
                            <Icons.BarChart size={14} />
                            <strong>{result.data.totalViews}</strong> Total Views
                          </div>
                        </div>

                        <div className="revenue-projections-grid">
                          <div className="projection-card">
                            <div className="proj-period">Daily Projection</div>
                            <div className="proj-value">${result.data.projections.daily.min} - ${result.data.projections.daily.max}</div>
                            <div className="proj-indicator"><div className="indicator-bar daily" style={{ width: '65%' }}></div></div>
                          </div>
                          <div className="projection-card highlight">
                            <div className="proj-period">Monthly Projection</div>
                            <div className="proj-value">${result.data.projections.monthly.min} - ${result.data.projections.monthly.max}</div>
                            <div className="proj-indicator"><div className="indicator-bar monthly" style={{ width: '75%' }}></div></div>
                          </div>
                          <div className="projection-card">
                            <div className="proj-period">Yearly Projection</div>
                            <div className="proj-value">${result.data.projections.yearly.min} - ${result.data.projections.yearly.max}</div>
                            <div className="proj-indicator"><div className="indicator-bar yearly" style={{ width: '85%' }}></div></div>
                          </div>
                        </div>

                        <div className="revenue-footer-info">
                          <Icons.AlertTriangle size={14} color="#f59e0b" />
                          <p>Earnings are estimated based on a standard RPM of <strong>{result.data.avgRpm}</strong>. Actual revenue varies by niche, location, and audience engagement.</p>
                        </div>
                      </div>
                    )}

                    {/* ─── Video Info Viewer ─── */}
                    {tool.id === 'yt-video-info' && (
                      <div className="summary-result">
                        <div className="video-info-grid">
                          <div className="video-info-thumb">
                            <img src={result.data.thumbnail} alt={result.data.title} style={{ width: '100%', borderRadius: '8px', aspectRatio: '16/9', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                          </div>
                          <div className="video-info-details">
                            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '12px', color: 'var(--text-main)' }}>{result.data.title}</h3>
                            <div className="info-row"><Icons.User size={14} /><span><strong>Channel:</strong> {result.data.channel}</span></div>
                            <div className="info-row"><Icons.Eye size={14} /><span><strong>Views:</strong> {result.data.views}</span></div>
                            <div className="info-row"><Icons.Clock size={14} /><span><strong>Duration:</strong> {result.data.duration}</span></div>
                            <div className="info-row"><Icons.Calendar size={14} /><span><strong>Published:</strong> {result.data.publishDate}</span></div>
                            <div className="info-row"><Icons.Tag size={14} /><span><strong>Category:</strong> {result.data.category}</span></div>
                          </div>
                        </div>
                        {result.data.description && (
                          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--bg-subtle)', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-soft)', lineHeight: '1.6' }}>
                            <strong>Description:</strong>
                            <p style={{ marginTop: '6px' }}>{result.data.description}</p>
                          </div>
                        )}
                      </div>
                    )}
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

      {tool.category === 'youtube' && recentChecks.length > 0 && !processing && (
        <div className="recent-checks-sidebar animated-in">
          <div className="recent-header">
            <Icons.History size={16} />
            <span>Recent Analyses</span>
          </div>
          <div className="recent-list">
            {recentChecks.map((item) => (
              <div key={item.id} className="recent-item" onClick={() => { setUrl(item.url); handleProcess(); }}>
                <div className="recent-info">
                  <div className="recent-title">{item.title}</div>
                  <div className="recent-tool">{item.toolName}</div>
                </div>
                <Icons.ChevronRight size={14} className="recent-arrow" />
              </div>
            ))}
          </div>
          <button className="clear-history-btn" onClick={() => { localStorage.removeItem('yt_recent_checks'); setRecentChecks([]); }}>
            Clear History
          </button>
        </div>
      )}
    </div>
  );
}

function toPascalCase(str) {
  if (!str) return '';
  return str.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
