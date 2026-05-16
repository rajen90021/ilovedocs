import { Globe, Shield, Play, HelpCircle, CheckCircle2, Zap, Download, Search, BarChart3 } from 'lucide-react';
import './ContentSection.css';

const ARTICLES = [
  {
    title: "YouTube Thumbnail Downloader HD",
    desc: "Extract and download high-resolution 4K thumbnails from any YouTube video instantly. Our tool fetches the MaxResDefault image directly from YouTube's servers for the best possible quality.",
    icon: <Download size={24} />,
    color: "red"
  },
  {
    title: "Advanced YouTube SEO & Tags",
    desc: "Find the high-ranking tags your competitors are using. Our YouTube Tag Extractor reveals hidden metadata, helping you optimize your videos for the 'Recommended' sidebar and search results.",
    icon: <Search size={24} />,
    color: "blue"
  },
  {
    title: "Monetization & Revenue Check",
    desc: "Check if any YouTube channel is monetized and calculate estimated daily earnings. Use our Revenue Calculator to project potential income based on views and niche-specific RPMs.",
    icon: <BarChart3 size={24} />,
    color: "green"
  },
  {
    title: "YouTube Video Downloader HD",
    desc: "Download YouTube videos in HD (720p, 1080p, 4K) for free. Save your favorite content as high-quality MP4 files for offline viewing on any device.",
    icon: <Play size={24} />,
    color: "purple"
  },
  {
    title: "YouTube Audio Extractor",
    desc: "Extract high-quality audio from any YouTube video. Convert video to MP3 or M4A instantly. Perfect for podcasts, music, and lectures.",
    icon: <Play size={24} />,
    color: "orange"
  }
];

export default function ContentSection() {
  return (
    <div className="seo-content-root">
      {/* Premium Hero Features */}
      <div className="content-grid-premium">
        {ARTICLES.map((article, i) => (
          <article key={i} className="premium-article-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`article-icon-blob ${article.color}`}>
              {article.icon}
            </div>
            <h2 className="article-title">{article.title}</h2>
            <p className="article-desc">{article.desc}</p>
          </article>
        ))}
      </div>

      {/* Structured SEO Guide */}
      <div className="seo-guide-section animate-fade-up">
        <div className="guide-header">
           <Zap className="guide-icon" size={28} />
           <h2 className="guide-title">Ultimate <span className="text-gradient">YouTube & File Toolkit</span></h2>
        </div>
        <div className="guide-content-grid">
           <div className="guide-col">
              <h3>Why Use ILoveDocs for YouTube?</h3>
              <p>
                In the competitive world of content creation, having the right data is everything. 
                ILoveDocs provides a 100% free **YouTube SEO toolkit** that allows you to:
              </p>
              <ul className="guide-list">
                 <li><CheckCircle2 size={16} /> <strong>Download 4K Thumbnails</strong> for inspiration or blog covers.</li>
                 <li><CheckCircle2 size={16} /> <strong>Extract Video Tags</strong> to see what makes a video go viral.</li>
                 <li><CheckCircle2 size={16} /> <strong>Check Monetization Status</strong> to research niche profitability.</li>
                 <li><CheckCircle2 size={16} /> <strong>Summarize Videos with AI</strong> to learn faster without watching hours of footage.</li>
              </ul>
           </div>
           <div className="guide-col">
              <h3>Professional PDF & File Management</h3>
              <p>
                Manage your digital documents with professional-grade tools that prioritize your privacy:
              </p>
              <ul className="guide-list">
                 <li><CheckCircle2 size={16} /> <strong>Merge PDFs</strong> into a single organized document.</li>
                 <li><CheckCircle2 size={16} /> <strong>Compress Large Files</strong> for easy email sharing.</li>
                 <li><CheckCircle2 size={16} /> <strong>Convert PDF to Word</strong> with high-precision text extraction.</li>
                 <li><CheckCircle2 size={16} /> <strong>Secure Processing</strong> with automatic file deletion every hour.</li>
              </ul>
           </div>
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="faq-visual-container animate-fade-up">
         <div className="faq-header-main">
            <HelpCircle className="faq-main-icon" size={32} />
            <h2 className="faq-title">Frequently <span className="text-gradient">Asked Questions</span></h2>
         </div>
         <div className="faq-grid-modern">
            <div className="faq-item-modern">
               <div className="faq-q-line">
                 <CheckCircle2 size={18} className="q-icon" />
                 <strong>How do I rank higher using your YouTube Tag Extractor?</strong>
               </div>
               <p>Find the top-ranking videos for your target keyword, extract their tags, and use the most relevant ones in your own video's metadata to signal context to YouTube's algorithm.</p>
            </div>
            <div className="faq-item-modern">
               <div className="faq-q-line">
                 <CheckCircle2 size={18} className="q-icon" />
                 <strong>Can I download thumbnails from any video?</strong>
               </div>
               <p>Yes, as long as the video is public or unlisted, our **YouTube Thumbnail Downloader** can fetch the MaxRes, High, Medium, and Standard resolutions instantly.</p>
            </div>
            <div className="faq-item-modern">
               <div className="faq-q-line">
                 <CheckCircle2 size={18} className="q-icon" />
                 <strong>Is my data safe when converting PDFs?</strong>
               </div>
               <p>Absolutely. We use end-to-end SSL encryption. All uploaded and processed files are permanently wiped from our secure servers 1 hour after processing.</p>
            </div>
         </div>
      </div>

      {/* SEO Footer Text */}
      <div className="seo-footer-visual animate-fade-up">
         <h2 className="footer-seo-title">The Best Free Online <span className="text-gradient">YouTube & Document Tools</span></h2>
         <p className="footer-seo-p">
          ILoveDocs is your one-stop shop for **YouTube growth** and **document productivity**. 
          Whether you need a **YouTube Thumbnail Downloader**, a **PDF to Word converter**, or an **AI Video Summarizer**, 
          our platform delivers fast, secure, and accurate results without the need for an account. 
          Start optimizing your digital workflow today with ILoveDocs.
         </p>
      </div>
    </div>
  );
}
