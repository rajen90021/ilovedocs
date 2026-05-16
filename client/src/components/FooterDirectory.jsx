import { Link } from 'react-router-dom';
import './FooterDirectory.css';

const DIRECTORY = [
  {
    category: 'YouTube Content Tools',
    tools: [
      { id: 'yt-thumbnail', label: 'YouTube Thumbnail Downloader' },
      { id: 'yt-tags', label: 'YouTube Tag & SEO Extractor' },
      { id: 'yt-transcript', label: 'YouTube Transcript Downloader' },
      { id: 'yt-summarize', label: 'AI Video Summarizer' },
      { id: 'yt-monetization', label: 'YouTube Monetization Checker' },
      { id: 'yt-revenue', label: 'YouTube Revenue Calculator' },
      { id: 'yt-seo-score', label: 'YouTube SEO Audit Tool' },
      { id: 'yt-region', label: 'Region Restriction Checker' },
      { id: 'yt-video-info', label: 'YouTube Video Info Viewer' },
    ]
  },
  {
    category: 'PDF & Document Tools',
    tools: [
      { id: 'merge-pdf', label: 'Merge PDF Online' },
      { id: 'split-pdf', label: 'Split PDF Documents' },
      { id: 'compress-pdf', label: 'Compress PDF Files' },
      { id: 'pdf-to-word', label: 'Convert PDF to Word' },
      { id: 'pdf-to-jpg', label: 'Convert PDF to JPG' },
      { id: 'pdf-to-excel', label: 'Convert PDF to Excel' },
      { id: 'word-to-pdf', label: 'Word to PDF Converter' },
      { id: 'excel-to-pdf', label: 'Excel to PDF Converter' },
      { id: 'jpg-to-pdf', label: 'JPG to PDF Online' },
    ]
  },
  {
    category: 'Image & Creative Tools',
    tools: [
      { id: 'compress-image', label: 'Compress JPG & PNG' },
      { id: 'resize-image', label: 'Resize Image Online' },
      { id: 'convert-image', label: 'Image Format Converter' },
    ]
  }
];

export default function FooterDirectory() {
  return (
    <footer className="footer-directory">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">
               <div className="logo-box">D</div>
               <span>ILoveDocs</span>
            </div>
            <p>The world's most powerful toolkit for creators and document professionals. 100% Free, Private, and Secure.</p>
            <div className="social-links">
               {/* Optional social icons */}
            </div>
          </div>
          
          <div className="directory-links">
            {DIRECTORY.map((group, i) => (
              <div key={i} className="link-group">
                <h4>{group.category}</h4>
                <ul>
                  {group.tools.map(tool => (
                    <li key={tool.id}>
                      <Link to={`/tools/${tool.id}`}>{tool.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        
        <div className="footer-bottom">
          <div className="copyright">© 2026 ILoveDocs. All rights reserved.</div>
          <div className="bottom-links">
             <Link to="/tools">All Tools</Link>
             <Link to="/">Privacy</Link>
             <Link to="/">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
