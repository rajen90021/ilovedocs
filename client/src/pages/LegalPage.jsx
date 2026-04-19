import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, FileText, AlertCircle } from 'lucide-react';
import './../components/Workspace.css'; // Reuse basic styling

export default function LegalPage() {
  const { policyType } = useParams();

  const getPolicyDetails = () => {
    switch(policyType) {
      case 'privacy':
        return {
          title: 'Privacy Policy',
          icon: <Shield className="title-icon" size={28} />,
          lastUpdated: 'October 15, 2025',
          content: (
            <>
              <h3>1. Data Collection</h3>
              <p>At ILoveDocs, your privacy is our priority. We do not store any of the files you upload beyond the 1-hour automatic processing window. Any metadata collected is strictly used for analytics and improving our tools.</p>
              
              <h3>2. File Security</h3>
              <p>All files uploaded to our platform are encrypted using industry-standard TLS protocols. Your files are automatically permanently deleted from our servers 1 hour after processing.</p>

              <h3>3. Third-Party Services</h3>
              <p>We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information entirely. We use trusted third-party services like Google Analytics strictly to aggregate platform usage data.</p>
            </>
          )
        };
      case 'terms':
        return {
          title: 'Terms of Service',
          icon: <FileText className="title-icon" size={28} />,
          lastUpdated: 'November 2, 2025',
          content: (
            <>
              <h3>1. Acceptance of Terms</h3>
              <p>By accessing ILoveDocs, you agree to be bound by these Terms of Service. If you do not agree, please do not use our document tools.</p>
              
              <h3>2. Acceptable Use</h3>
              <p>You agree not to use our services for unlawful activities. Do not attempt to process malicious code, illegal materials, or exploit our infrastructure.</p>

              <h3>3. Service Availability</h3>
              <p>ILoveDocs is provided "as is". We reserve the right to restrict processing limits or modify APIs to maintain fair use across all users. We are not liable for files lost during failed conversions.</p>
            </>
          )
        };
      case 'cookies':
        return {
          title: 'Cookie Policy',
          icon: <AlertCircle className="title-icon" size={28} />,
          lastUpdated: 'September 5, 2025',
          content: (
            <>
              <h3>1. What are Cookies?</h3>
              <p>Cookies are small files transferred to your computer's hard drive through your Web browser (if you allow) that enable the site's or service provider's systems to recognize your browser and capture certain information.</p>
              
              <h3>2. How We Use Cookies</h3>
              <p>We use cookies to understand and save your preferences for future visits and compile aggregate data about site traffic so that we can offer better tool experiences natively.</p>

              <h3>3. Disabling Cookies</h3>
              <p>You can choose to turn off all cookies via your browser settings. However, some functional aspects of the toolkit (like recent file caching) may not function properly without them.</p>
            </>
          )
        };
      default:
        return {
          title: 'Legal Documents',
          icon: <Shield className="title-icon" size={28} />,
          lastUpdated: '2025',
          content: <p>Please select a specific legal document from the navigation menus.</p>
        }
    }
  };

  const details = getPolicyDetails();

  return (
    <div className="dashboard-layout">
      <main className="dashboard-main">
        <div className="dashboard-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div className="workspace-container animated-in">
            <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
              <div className="header-icon-group">
                <div className="icon-box" style={{ background: 'var(--bg-white)', color: 'var(--brand-primary)', border: '1px solid var(--border-light)' }}>
                  {details.icon}
                </div>
                <div>
                  <h1 className="dashboard-title">{details.title}</h1>
                  <p className="dashboard-subtitle">Last updated: {details.lastUpdated}</p>
                </div>
              </div>
            </div>

            <div className="policy-document" style={{
              background: 'white',
              padding: '40px',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              color: 'var(--text-soft)',
              lineHeight: '1.8'
            }}>
              {details.content}
              
              <div style={{ marginTop: '60px', paddingTop: '40px', borderTop: '1px solid var(--border-light)' }}>
                <h3>Contact Us</h3>
                <p>If you have any questions regarding this {details.title.toLowerCase()}, you may contact us using the information below:</p>
                <p style={{ marginTop: '10px', fontWeight: 'bold' }}>support@ilovedocs.in</p>
              </div>
            </div>
            
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
               <Link to="/" className="btn btn-primary">Return to Homepage</Link>
            </div>
            
          </div>

        </div>
      </main>
    </div>
  );
}
