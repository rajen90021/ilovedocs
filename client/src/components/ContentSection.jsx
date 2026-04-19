import { Globe, Shield, Play, HelpCircle, CheckCircle2 } from 'lucide-react';
import './ContentSection.css';

const ARTICLES = [
  {
    title: "World Class YouTube Toolkit",
    desc: "ILoveDocs is built for high-performance content creation. Our suite of tools—including the Channel Monetization Checker and Tag Extractor—gives you the data you need to grow your channel faster and smarter.",
    icon: <Play size={24} />,
    color: "red"
  },
  {
    title: "Advanced YouTube SEO",
    desc: "Ranking on page 1 of YouTube requires precision. We analyze video metadata in real-time to give you the exact tags and SEO metrics used by viral videos. It's 100% free and automated.",
    icon: <Globe size={24} />,
    color: "blue"
  },
  {
    title: "Secure Document Engine",
    desc: "Beyond YouTube, ILoveDocs handles your professional documents with ease. Merge, compress, and convert PDF files securely. All files are automatically deleted after 60 minutes for your privacy.",
    icon: <Shield size={24} />,
    color: "green"
  }
];

export default function ContentSection() {
  return (
    <div className="seo-content-root">
      {/* Feature Articles */}
      <div className="content-grid-premium">
        {ARTICLES.map((article, i) => (
          <article key={i} className="premium-article-card animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className={`article-icon-blob ${article.color}`}>
              {article.icon}
            </div>
            <h3 className="article-title">{article.title}</h3>
            <p className="article-desc">{article.desc}</p>
          </article>
        ))}
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
                 <strong>Is the Monetization Checker accurate?</strong>
               </div>
               <p>Yes. Our tool analyzes the raw metadata of the YouTube video to detect the official monetization markers used by the platform.</p>
            </div>
            <div className="faq-item-modern">
               <div className="faq-q-line">
                 <CheckCircle2 size={18} className="q-icon" />
                 <strong>How do I download HD thumbnails?</strong>
               </div>
               <p>Just paste the video link into our Thumbnail Downloader. We provide direct links to the Maximum, High, and Medium resolution covers.</p>
            </div>
            <div className="faq-item-modern">
               <div className="faq-q-line">
                 <CheckCircle2 size={18} className="q-icon" />
                 <strong>Are there any usage limits?</strong>
               </div>
               <p>No. You can process as many videos and documents as you want. There are no daily limits or credit systems.</p>
            </div>
         </div>
      </div>

      {/* SEO Footer Text */}
      <div className="seo-footer-visual animate-fade-up">
         <h2 className="footer-seo-title">Free Online <span className="text-gradient">YouTube & Document Tools</span></h2>
         <p className="footer-seo-p">
          ILoveDocs is the most complete free utility hub for YouTube creators and document professionals. 
          From <strong>checking channel monetization</strong> to <strong>merging professional PDFs</strong>, 
          our platform provides high-speed, secure, and accurate results every time. 
          Trusted by thousands for <strong>YouTube SEO</strong> and daily document workflows.
         </p>
      </div>
    </div>
  );
}
