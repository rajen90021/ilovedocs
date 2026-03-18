/**
 * toolSEO.js — Per-tool SEO metadata.
 *
 * Used by ToolPage.jsx to inject:
 *  • <title>
 *  • meta description
 *  • meta keywords
 *  • JSON-LD SoftwareApplication schema
 *
 * Keys match the tool `id` values from the API tools registry.
 */

export const TOOL_SEO = {
  'merge-pdf': {
    title: 'Merge PDF — Combine Multiple PDF Files Online Free',
    description:
      'Merge multiple PDF files into a single document in seconds. Free, fast, and secure PDF merger — no signup required. Up to 20 PDFs, 50 MB each.',
    keywords:
      'merge PDF, combine PDF, join PDF files, PDF merger online, combine multiple PDFs, merge PDF free',
  },
  'split-pdf': {
    title: 'Split PDF — Extract Pages from PDF Online Free',
    description:
      'Split a PDF into individual pages or extract a specific page range instantly. Free online PDF splitter with no email required.',
    keywords:
      'split PDF, extract PDF pages, PDF page extractor, divide PDF, split PDF free online',
  },
  'compress-pdf': {
    title: 'Compress PDF — Reduce PDF File Size Online Free',
    description:
      'Reduce PDF file size without losing quality. Our free PDF compressor shrinks large files for email or upload — instant, secure, no install.',
    keywords:
      'compress PDF, reduce PDF size, PDF compressor, shrink PDF, make PDF smaller, PDF optimizer',
  },
  'rotate-pdf': {
    title: 'Rotate PDF — Rotate PDF Pages Online Free',
    description:
      'Rotate individual or all pages in your PDF document online. Choose 90°, 180° or 270° rotation. Free and instant — no account needed.',
    keywords:
      'rotate PDF, rotate PDF pages, flip PDF pages, PDF rotation tool, rotate PDF online free',
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF — Online Free Watermark Tool',
    description:
      'Add a custom text watermark to your PDF document online. Control opacity, color, and text. Protect your document in seconds — free.',
    keywords:
      'watermark PDF, add watermark to PDF, PDF watermark online, stamp PDF, text watermark PDF',
  },
  'protect-pdf': {
    title: 'Password Protect PDF — Encrypt PDF Online Free',
    description:
      'Add password protection and encryption to your PDF documents online. Secure sensitive files in seconds without software installation.',
    keywords:
      'protect PDF, password protect PDF, encrypt PDF, secure PDF, lock PDF file, PDF password tool',
  },
  'unlock-pdf': {
    title: 'Unlock PDF — Remove PDF Password Online Free',
    description:
      'Remove password protection from PDFs online. Unlock secured PDFs instantly and for free — no desktop software needed.',
    keywords:
      'unlock PDF, remove PDF password, PDF unlocker, decrypt PDF, unsecure PDF, open protected PDF',
  },
  'reorder-pdf': {
    title: 'Reorder PDF Pages — Rearrange PDF Pages Online',
    description:
      'Rearrange and reorder pages in your PDF document online. Specify a custom page order to reorganize your PDF instantly for free.',
    keywords:
      'reorder PDF pages, rearrange PDF, reorganize PDF, change page order PDF, PDF page organizer',
  },
  'edit-pdf': {
    title: 'Edit PDF — Add Text to PDF Online Free',
    description:
      'Add custom text annotations to your PDF documents online for free. Specify position, font size, and color. No plugins or software required.',
    keywords:
      'edit PDF, add text to PDF, annotate PDF, PDF editor online free, write on PDF, PDF text tool',
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF — Convert Images to PDF Online Free',
    description:
      'Convert JPG, PNG, WebP, and BMP images to PDF documents in one click. Combine multiple images into a single high-quality PDF file for free.',
    keywords:
      'JPG to PDF, image to PDF, PNG to PDF, convert photo to PDF, picture to PDF, free image PDF converter',
  },
  'pdf-to-word': {
    title: 'PDF to Word — Convert PDF to DOCX Online Free',
    description:
      'Convert PDF documents to editable Word DOCX files online for free. Preserve text and formatting — no email or signup required.',
    keywords:
      'PDF to Word, convert PDF to DOCX, PDF to Word free, PDF to editable Word, PDF converter, PDF Word online',
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG — Convert PDF Pages to Images Online Free',
    description:
      'Convert every page of your PDF to high-quality JPG images online. Single-page PDFs download as JPG; multi-page PDFs as a ZIP archive.',
    keywords:
      'PDF to JPG, convert PDF to image, PDF to PNG, PDF page to JPG, extract images from PDF, PDF image converter',
  },
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF Tables to XLSX Online Free',
    description:
      'Extract tables and data from PDF files and convert them to Excel XLSX spreadsheets for free. Fast, secure, and no account needed.',
    keywords:
      'PDF to Excel, PDF to XLSX, convert PDF to spreadsheet, extract table from PDF, PDF Excel converter free',
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX to PDF Online Free',
    description:
      'Convert Microsoft Word DOCX files to PDF documents online for free. Fast conversion with formatting preserved — instant download.',
    keywords:
      'Word to PDF, DOCX to PDF, convert Word to PDF, Word PDF converter, DOC to PDF online free',
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX Spreadsheets to PDF Free',
    description:
      'Convert Excel XLSX spreadsheets to clean PDF documents online for free. No Microsoft Office needed — start converting instantly.',
    keywords:
      'Excel to PDF, XLSX to PDF, convert Excel to PDF, spreadsheet to PDF, XLS to PDF free online',
  },
  'ppt-to-pdf': {
    title: 'PowerPoint to PDF — Convert PPTX to PDF Online Free',
    description:
      'Convert PowerPoint PPTX presentations to PDF documents online for free. Share your slides as a portable PDF file without PowerPoint.',
    keywords:
      'PowerPoint to PDF, PPTX to PDF, convert presentation to PDF, PPT to PDF free, slide to PDF converter',
  },
  'html-to-pdf': {
    title: 'HTML to PDF — Convert Web Pages to PDF Online Free',
    description:
      'Convert HTML files and web pages to PDF documents online for free. Upload your HTML file and receive a clean, printable PDF instantly.',
    keywords:
      'HTML to PDF, convert webpage to PDF, HTML file to PDF, web page PDF converter, HTML PDF online free',
  },
  'compress-image': {
    title: 'Compress Image — Reduce Image File Size Online Free',
    description:
      'Compress JPG, PNG, and WebP images online for free. Reduce file size up to 80% while maintaining visual quality — instant, no signup.',
    keywords:
      'compress image, reduce image size, image compressor, optimize image, shrink photo, JPG PNG compressor free',
  },
  'resize-image': {
    title: 'Resize Image — Change Image Dimensions Online Free',
    description:
      'Resize JPG, PNG, and WebP images to any dimension online for free. Maintain aspect ratio or set custom width and height — instant download.',
    keywords:
      'resize image, change image size, image resizer online, scale image, crop resize photo free, image dimensions',
  },
  'convert-image': {
    title: 'Convert Image — Convert JPG PNG WebP BMP Online Free',
    description:
      'Convert images between JPG, PNG, WebP, BMP, GIF, and TIFF formats online for free. Fast image format converter — no account, no software.',
    keywords:
      'convert image, image converter, JPG to PNG, PNG to WebP, WebP to JPG, BMP to PNG, image format converter free',
  },
};

/**
 * Build a JSON-LD SoftwareApplication schema for a given tool.
 * Helps Google understand what the tool does and show rich results.
 */
export function buildToolJsonLd(tool, seoData) {
  const SITE_URL = 'https://ilovedocs.in';
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: seoData?.description ?? tool.description,
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/tools/${tool.id}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    provider: {
      '@type': 'Organization',
      name: 'ILoveDocs',
      url: SITE_URL,
    },
    featureList: [
      'Free to use',
      'No sign-up required',
      'Files auto-deleted after 1 hour',
      'Secure HTTPS transfer',
      'Max 50MB per file',
    ],
  };
}

/**
 * Build the website-level JSON-LD (WebSite + WebPage schemas).
 */
export function buildWebsiteJsonLd() {
  const SITE_URL = 'https://ilovedocs.in';
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'ILoveDocs',
      url: SITE_URL,
      description:
        'Free online PDF and document tools. Merge, split, compress, rotate, watermark, and convert PDF files — plus image conversion tools.',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE_URL}/tools?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'ILoveDocs',
      url: SITE_URL,
      logo: `${SITE_URL}/favicon.svg`,
      sameAs: [],
    },
  ];
}

/**
 * Build a FAQ JSON-LD block for a tool page.
 */
export function buildToolFaqJsonLd(tool) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `Is ${tool.name} free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. ${tool.name} on ILoveDocs is completely free. No sign-up, no payment, no watermark.`,
        },
      },
      {
        '@type': 'Question',
        name: `How long are my files kept after using ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            'All uploaded and output files are automatically and permanently deleted from our servers after 1 hour.',
        },
      },
      {
        '@type': 'Question',
        name: `What is the maximum file size for ${tool.name}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The maximum accepted file size is 50 MB per file.',
        },
      },
    ],
  };
}
