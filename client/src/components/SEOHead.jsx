/**
 * SEOHead — Drop-in component that populates <head> for any page.
 * Wrap the app in <HelmetProvider> (done in main.jsx) then use
 * <SEOHead> at the top of any page component.
 */
import { Helmet } from 'react-helmet-async';

const SITE_NAME      = 'ILoveDocs';
const SITE_URL       = 'https://ilovedocs.in';
const DEFAULT_IMG    = `${SITE_URL}/og-default.png`;
const TWITTER_HANDLE = '@ilovedocs';
const BASE_KEYWORDS  = 'PDF tools, document converter, free PDF, online PDF editor, PDF merge, PDF compress';

/**
 * @param {object}   props
 * @param {string}   props.title        – Page title (without site name suffix)
 * @param {string}   props.description  – Meta description (keep ≤155 chars)
 * @param {string}   [props.keywords]   – Comma-separated extra keywords
 * @param {string}   [props.canonical]  – Path portion of canonical URL, e.g. '/tools/pdf-to-word'
 * @param {string}   [props.ogImage]    – Absolute URL of OG image
 * @param {string}   [props.ogType]     – 'website' | 'article' (default: 'website')
 * @param {object}   [props.jsonLd]     – JSON-LD Schema.org object (or array)
 * @param {boolean}  [props.noIndex]    – true to add noindex,nofollow
 */
export default function SEOHead({
  title,
  description = 'ILoveDocs — Free online tools to merge, split, compress, convert and edit PDF and image files. No signup required.',
  keywords = '',
  canonical,
  ogImage = DEFAULT_IMG,
  ogType  = 'website',
  jsonLd,
  noIndex = false,
}) {
  const fullTitle    = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Free Online PDF & Document Tools`;
  const canonicalUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const allKeywords  = keywords ? `${keywords}, ${BASE_KEYWORDS}` : BASE_KEYWORDS;
  const robots       = noIndex ? 'noindex,nofollow' : 'index,follow';

  return (
    <Helmet>
      {/* ── Primary ── */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description"        content={description} />
      <meta name="keywords"           content={allKeywords} />
      <meta name="robots"             content={robots} />
      <link rel="canonical"           href={canonicalUrl} />

      {/* ── Open Graph ── */}
      <meta property="og:type"        content={ogType} />
      <meta property="og:site_name"   content={SITE_NAME} />
      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonicalUrl} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:site"        content={TWITTER_HANDLE} />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />

      {/* ── JSON-LD ── */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : [jsonLd])}
        </script>
      )}
    </Helmet>
  );
}
