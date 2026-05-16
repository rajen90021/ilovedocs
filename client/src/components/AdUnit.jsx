import { useEffect } from 'react';

/**
 * Reusable Google AdSense Unit Component
 * @param {string} slot - The AdSense slot ID
 * @param {string} format - Ad format (default: 'auto')
 * @param {boolean} responsive - Is the ad responsive (default: true)
 * @param {object} style - Custom styles for the ad container
 */
export default function AdUnit({ slot, format = 'auto', responsive = 'true', style = {} }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e.message);
    }
  }, []);

  return (
    <div className="ad-container" style={{ margin: '20px 0', textAlign: 'center', overflow: 'hidden', ...style }}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-7163641501310978"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
