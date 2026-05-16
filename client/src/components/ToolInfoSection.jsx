import React from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Lock 
} from 'lucide-react';
import './ToolInfoSection.css';

export default function ToolInfoSection({ seoData, toolName, allTools = [], category, currentToolId }) {
  if (!seoData) return null;

  const relatedTools = allTools
    .filter(t => t.category === category && t.id !== currentToolId)
    .slice(0, 4);

  return (
    <section className="tool-info-section animate-fade-up">
      <div className="info-container">
        {/* Header Description */}
        <div className="info-intro">
          <h2 className="info-title">
            {seoData.h2 || `How to use ${toolName}`}
          </h2>
          <p className="info-description">
            {seoData.longDescription || seoData.description}
          </p>
        </div>

        {/* Why Choose Us Features */}
        <div className="feature-grid">
           <div className="feature-item">
              <div className="feature-icon red"><Zap size={20} /></div>
              <div className="feature-text">
                <strong>Lightning Fast</strong>
                <p>Process your files in seconds with our optimized high-speed servers.</p>
              </div>
           </div>
           <div className="feature-item">
              <div className="feature-icon blue"><Lock size={20} /></div>
              <div className="feature-text">
                <strong>100% Secure</strong>
                <p>Advanced end-to-end encryption ensures your data remains private.</p>
              </div>
           </div>
           <div className="feature-item">
              <div className="feature-icon green"><ShieldCheck size={20} /></div>
              <div className="feature-text">
                <strong>No Signup Required</strong>
                <p>Use all utilities immediately. No email or account creation needed.</p>
              </div>
           </div>
        </div>

        {/* Tool Specific Features (SEO Boost) */}
        {seoData.features && (
          <div className="tool-features-box">
            <h3 className="section-subtitle">Core Features & Benefits</h3>
            <div className="features-list-premium">
              {seoData.features.map((feature, i) => (
                <div key={i} className="feature-check-item">
                  <CheckCircle2 className="check-icon" size={20} />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How To Steps */}
        {seoData.howTo && (
          <div className="howto-box">
            <h3 className="section-subtitle">Step-by-Step Guide</h3>
            <div className="steps-grid">
              {seoData.howTo.map((step, idx) => (
                <div key={idx} className="step-card">
                  <div className="step-number">{idx + 1}</div>
                  <p className="step-content">{step}</p>
                  {idx < seoData.howTo.length - 1 && (
                    <ArrowRight className="step-arrow" size={16} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ Section */}
        {seoData.faqs && (
          <div className="faq-box">
             <div className="faq-header">
               <HelpCircle className="faq-icon" size={24} />
               <h3 className="section-subtitle">Frequently Asked Questions</h3>
             </div>
             <div className="faq-grid-premium">
               {seoData.faqs.map((faq, i) => (
                 <div key={i} className="faq-card-premium">
                   <div className="faq-q">
                      <div className="q-dot" />
                      <strong>{faq.q}</strong>
                   </div>
                   <p className="faq-a">{faq.a}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Related Tools Section for SEO Interlinking */}
        {relatedTools.length > 0 && (
          <div className="related-tools-box">
            <h3 className="section-subtitle">Related {category.toUpperCase()} Tools</h3>
            <div className="related-grid">
              {relatedTools.map(t => (
                <a key={t.id} href={`/tools/${t.id}`} className="related-tool-card">
                  <div className="related-icon" style={{ backgroundColor: t.color }}>
                     <CheckCircle2 size={14} color="white" />
                  </div>
                  <span>{t.name}</span>
                  <ArrowRight size={14} className="hover-arrow" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
