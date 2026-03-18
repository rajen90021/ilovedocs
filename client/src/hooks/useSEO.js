/**
 * useSEO — Centralised SEO hook powered by react-helmet-async.
 * Injects <title>, meta description/keywords, canonical, Open Graph,
 * Twitter Card and arbitrary JSON-LD structured-data scripts.
 */
import { useHelmet } from 'react-helmet-async';

const SITE_NAME   = 'ILoveDocs';
const SITE_URL    = 'https://ilovedocs.in';
const DEFAULT_IMG = `${SITE_URL}/og-default.png`;
const TWITTER_HANDLE = '@ilovedocs';

/**
 * @param {object} params
 * @param {string}  params.title        - Page <title> (without site name)
 * @param {string}  params.description  - Meta description (≤160 chars)
 * @param {string[]} [params.keywords]  - Additional keywords array
 * @param {string}  [params.canonical]  - Canonical path e.g. '/tools/pdf-to-word'
 * @param {string}  [params.ogImage]    - Absolute OG image URL
 * @param {string}  [params.ogType]     - 'website' | 'article' (default: 'website')
 * @param {object}  [params.jsonLd]     - JSON-LD structured data object
 */
export function useSEO({
  title,
  description,
  keywords = [],
  canonical,
  ogImage = DEFAULT_IMG,
  ogType  = 'website',
  jsonLd,
} = {}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} | Free Online PDF & Document Tools`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  // We return the JSX to be placed inside <Helmet>
  return {
    fullTitle,
    canonicalUrl,
    description,
    keywords,
    ogImage,
    ogType,
    jsonLd,
  };
}

export { SITE_NAME, SITE_URL, DEFAULT_IMG, TWITTER_HANDLE };
