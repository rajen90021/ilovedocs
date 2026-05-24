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
    title: 'Merge PDF Online — Combine PDF Files for Free',
    h1: 'Merge Multiple PDF Files into One',
    h2: '#1 Free Online PDF Merger — No Limits, No Signup',
    description: 'Combine multiple PDF documents into a single file in seconds. Drag and drop, reorder pages, and merge PDFs with 100% security.',
    longDescription: 'Merging PDF files shouldn\'t be complicated. Our online PDF Merger allows you to combine up to 50 files into a single organized document. Whether you are organizing tax documents, merging medical records, or combining school assignments, our tool handles it with high-speed processing and zero data loss. Your files are automatically processed locally for your privacy.',
    keywords: 'merge pdf, combine pdf files, join pdf online, free pdf merger, merge multiple pdfs, combine docs to pdf',
    features: [
      'Drag and drop multiple files to merge instantly',
      'Reorder files before merging to get the perfect sequence',
      'Fast client-side processing – no browser lag',
      'Secure end-to-end processing'
    ],
    howTo: [
      'Select the PDF files you want to merge by clicking "Choose Files".',
      'Drag and drop the files to arrange them in the desired order.',
      'Click the "Merge PDF" button to start the process.',
      'Download your newly combined PDF document instantly.'
    ],
    faqs: [
      { q: "Is there a limit on how many PDFs I can merge?", a: "You can merge up to 20 files at once for free." },
      { q: "Will the quality of my PDFs decrease after merging?", a: "No, our tool merges the raw page streams, ensuring 100% original quality is preserved." },
      { q: "Is it safe to upload my documents?", a: "Yes, all processing is done locally in your browser. Your files never leave your computer." }
    ]
  },
  'split-pdf': {
    title: 'Split PDF — Extract Pages from PDF Online Free',
    h1: 'Split PDF & Extract Pages Free',
    h2: 'The Fastest Way to Split PDF Files Online',
    description: 'Split a PDF into individual pages or extract a specific page range instantly. Free online PDF splitter with no email required.',
    longDescription: 'Extract exactly what you need from large documents. Our split PDF tool lets you separate a massive document into individual pages or pull out specific critical pages in seconds. It is completely free, does not require an account, and ensures your newly separated pages retain their original high quality.',
    keywords: 'split PDF, extract PDF pages, PDF page extractor, divide PDF, split PDF free online',
    howTo: [
      'Select and upload the PDF document you want to split.',
      'Enter the specific page numbers or ranges you wish to extract (e.g., 1-5, 8, 10).',
      'Click the "Split PDF" button to extract your chosen pages.',
      'Download the result, which will be a new PDF or a ZIP archive if multiple files were created.'
    ],
    faqs: [
      { q: "How do I split a PDF file into multiple pages?", a: "Upload your document, leave the range input blank to split every page individually, and hit split. You will receive a ZIP file containing every page as a separate PDF." },
      { q: "Is the PDF splitting process secure?", a: "Absolutely. Files are processed locally in your browser and are never uploaded to any server." },
      { q: "Can I extract just one page from a PDF?", a: "Yes. Simply type the number of the page you want to extract into the input field." }
    ]
  },
  'compress-pdf': {
    title: 'Compress PDF Online — Reduce PDF File Size Free',
    h1: 'Compress & Optimize PDF Files',
    h2: 'Shrink Your PDF Size Without Losing Quality',
    description: 'Reduce PDF file size for easier email sharing and faster web loading. Get the smallest PDF size with the highest possible quality.',
    longDescription: 'Is your PDF too large to send via email? Our PDF compressor uses advanced optimization algorithms to strip away unnecessary metadata and compress high-resolution images within the document. You get a significantly smaller file while the text remains crisp and images look professional.',
    keywords: 'compress pdf, reduce pdf size, shrink pdf online, optimize pdf for web, small pdf converter, free pdf compressor',
    features: [
      'Intelligent compression – high quality with low file size',
      'Batch compress multiple files at once',
      'Privacy first: processed locally in your browser',
      'Compatible with all PDF versions and scanners'
    ],
    howTo: [
      'Upload your large PDF file to our secure dashboard.',
      'Wait for our engine to analyze and optimize the content.',
      'Review the reduction percentage (often up to 90%).',
      'Download your optimized, smaller PDF file.'
    ],
    faqs: [
      { q: "Will my images look blurry?", a: "We use smart compression that reduces DPI only to the web-standard (144dpi), ensuring they look great on screens." },
      { q: "How much can you reduce the size?", a: "Typically, you will see a reduction between 40% to 90% depending on the original file's content." },
      { q: "Does this work on scanned PDFs?", a: "Yes, scanned PDFs often see the biggest size reductions." }
    ]
  },
  'rotate-pdf': {
    title: 'Rotate PDF — Rotate PDF Pages Online Free',
    h1: 'Rotate PDF Pages Online',
    h2: 'Fix PDF Orientation in Seconds',
    description: 'Rotate individual or all pages in your PDF document online. Choose 90°, 180° or 270° rotation. Free and instant — no account needed.',
    longDescription: 'Scanned a document upside down or sideways? Our PDF rotation tool lets you easily fix the orientation of your PDF files. You can rotate specific pages or the entire document by 90, 180, or 270 degrees.',
    keywords: 'rotate PDF, rotate PDF pages, flip PDF pages, PDF rotation tool, rotate PDF online free',
    howTo: [
      'Upload your PDF file to the rotation tool.',
      'Choose the rotation angle: 90° clockwise, 180°, or 270° clockwise.',
      'Click the "Rotate PDF" button to apply the changes.',
      'Download your perfectly oriented PDF document.'
    ],
    faqs: [
      { q: "Can I rotate only one page?", a: "Yes, our tool allows you to select specific pages for rotation or apply it to the whole document." },
      { q: "Is it possible to rotate multiple PDFs at once?", a: "Currently, you can process one PDF at a time for precise rotation control." }
    ]
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF — Online Free Watermark Tool',
    h1: 'Add Watermark to PDF Online',
    h2: 'Protect Your Documents with Custom Watermarks',
    description: 'Add a custom text watermark to your PDF document online. Control opacity, color, and text. Protect your document in seconds — free.',
    longDescription: 'Protect your intellectual property or label your drafts with our customizable PDF watermark tool. Add any text, adjust transparency, and choose a color to make it your own. Whether it is "DRAFT", "CONFIDENTIAL", or your brand name, applying a watermark is simple and fast.',
    keywords: 'watermark PDF, add watermark to PDF, PDF watermark online, stamp PDF, text watermark PDF',
    howTo: [
      'Select the PDF file you want to protect with a watermark.',
      'Type your watermark text in the options area.',
      'Adjust settings like opacity and color.',
      'Click "Watermark PDF" and download your protected document.'
    ],
    faqs: [
      { q: "Can I remove a watermark later?", a: "Our tool permanently stamps the text into the PDF layers for security, making it very secure." }
    ]
  },
  'protect-pdf': {
    title: 'Password Protect PDF — Encrypt PDF Online Free',
    h1: 'Protect PDF with Password Online',
    h2: 'Enterprise-Grade PDF Encryption',
    description: 'Add password protection and encryption to your PDF documents online. Secure sensitive files in seconds without software installation.',
    longDescription: 'Keep your sensitive information safe from unauthorized eyes. Our PDF protection tool uses advanced encryption to lock your files with a custom password. Perfect for contracts, financial statements, or personal records.',
    keywords: 'protect PDF, password protect PDF, encrypt PDF, secure PDF, lock PDF file, PDF password tool',
    howTo: [
      'Upload the PDF you wish to encrypt.',
      'Set a strong, unique password for your document.',
      'Click the "Protect PDF" button to apply encryption.',
      'Download your securely locked PDF.'
    ],
    faqs: [
      { q: "What happens if I forget the password?", a: "For security reasons, we do not store your passwords. If you lose it, the file cannot be decrypted by us." }
    ]
  },
  'unlock-pdf': {
    title: 'Unlock PDF — Remove PDF Password Online Free',
    h1: 'Unlock Password Protected PDFs',
    h2: 'Access Your Secured PDF Files Instantly',
    description: 'Remove password protection from PDFs online. Unlock secured PDFs instantly and for free — no desktop software needed.',
    longDescription: 'Need to edit or print a PDF that is locked? Our PDF unlocker helps you remove passwords from authorized files so you can use them freely. Simply upload and let our engine handle the decryption.',
    keywords: 'unlock PDF, remove PDF password, PDF unlocker, decrypt PDF, unsecure PDF, open protected PDF',
    howTo: [
      'Select the password-protected PDF file you want to unlock.',
      'Confirm you have the rights to unlock the file.',
      'Click the "Unlock PDF" button.',
      'Download your unlocked PDF file.'
    ],
    faqs: [
      { q: "Can you unlock any PDF?", a: "We can remove standard owner passwords. If a file has a strong user/open password, you may still need to provide it to finalize the decryption." }
    ]
  },
  'reorder-pdf': {
    title: 'Reorder PDF Pages — Rearrange PDF Pages Online',
    h1: 'Rearrange PDF Pages Online',
    h2: 'The Easiest PDF Page Organizer',
    description: 'Rearrange and reorder pages in your PDF document online. Specify a custom page order to reorganize your PDF instantly for free.',
    longDescription: 'Get your document pages in the perfect sequence. Our reordering tool lets you visually or manually rearrange pages within a PDF. No more messy documents—clean up your presentations or reports in seconds.',
    keywords: 'reorder PDF pages, rearrange PDF, reorganize PDF, change page order PDF, PDF page organizer',
    howTo: [
      'Upload the PDF you want to reorganize.',
      'Enter the new page order (e.g., 3, 1, 2) or drag pages to move them.',
      'Click the "Reorder PDF Pages" button.',
      'Download your newly organized PDF.'
    ]
  },
  'edit-pdf': {
    title: 'Edit PDF — Add Text to PDF Online Free',
    h1: 'Edit PDF Online Free',
    h2: 'Quick PDF Annotation & Text Addition',
    description: 'Add custom text annotations to your PDF documents online for free. Specify position, font size, and color. No plugins or software required.',
    longDescription: 'Simple edits made easy. If you need to add a note, fill out a field, or add a comment to a PDF, our editor is the quickest way to do it without downloading heavy software like Adobe Acrobat.',
    keywords: 'edit PDF, add text to PDF, annotate PDF, PDF editor online free, write on PDF, PDF text tool',
    howTo: [
      'Upload the PDF file you need to annotate.',
      'Enter the text and choose the placement and style.',
      'Click the "Edit PDF" button.',
      'Download your edited document.'
    ]
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF — Convert Images to PDF Online Free',
    h1: 'Convert JPG to PDF Online',
    h2: 'The Best Free Image to PDF Converter',
    description: 'Convert JPG, PNG, WebP, and BMP images to PDF documents in one click. Combine multiple images into a single high-quality PDF file for free.',
    longDescription: 'Turn your photos, scanned documents, and image files into professional PDF documents instantly. Whether you are submitting expense receipts, creating a photo album, or compiling scanned pages, our JPG to PDF converter handles it effortlessly.',
    keywords: 'JPG to PDF, image to PDF, PNG to PDF, convert photo to PDF, picture to PDF, free image PDF converter',
    howTo: [
      'Upload one or more images (JPG, PNG, WebP, BMP).',
      'Our tool will automatically prepare them for a standard PDF layout.',
      'Click "JPG to PDF" to generate the document.',
      'Download your high-quality PDF file.'
    ]
  },

  // Conversions
  'pdf-to-word': {
    title: 'Convert PDF to Word — Edit PDF in Word Online',
    description: 'Convert PDF files to editable Word documents online for free. Clean layout retention and high text extraction quality.',
    keywords: 'pdf to word, convert pdf to docx, edit pdf in word, pdf to word converter'
  },
  'pdf-to-excel': {
    title: 'Convert PDF to Excel — Extract PDF Tables Online',
    description: 'Convert PDF files to Excel spreadsheets (XLSX/CSV) online. Extract tables from PDF accurately and securely.',
    keywords: 'pdf to excel, pdf to xlsx, extract tables from pdf, pdf table converter'
  },
  'pdf-to-ppt': {
    title: 'Convert PDF to PowerPoint — PDF to PPTX Online',
    description: 'Convert your PDF documents into editable PowerPoint presentation slides. 100% free and client-side.',
    keywords: 'pdf to ppt, pdf to pptx, convert pdf to presentation, pdf presentation converter'
  },
  'pdf-to-jpg': {
    title: 'Convert PDF to JPG — Extract PDF Pages as Images',
    description: 'Convert PDF pages into high-quality JPG images instantly. Processed completely in your browser.',
    keywords: 'pdf to jpg, convert pdf to jpeg, pdf pages to images, extract pdf images'
  },
  'pdf-to-png': {
    title: 'Convert PDF to PNG — High Quality PDF to PNG Converter',
    description: 'Extract PDF pages as PNG images with transparent backgrounds. Quick, free, and secure client-side extraction.',
    keywords: 'pdf to png, pdf transparent image, convert pdf to png online'
  },
  'word-to-pdf': {
    title: 'Convert Word to PDF — DOCX to PDF Online Free',
    description: 'Convert Microsoft Word documents (.doc/.docx) to standard PDF files in your browser.',
    keywords: 'word to pdf, docx to pdf, convert doc to pdf, word document to pdf'
  },
  'excel-to-pdf': {
    title: 'Convert Excel to PDF — XLSX to PDF Converter',
    description: 'Convert Excel spreadsheets (.xls/.xlsx) into high-quality, readable PDF files offline.',
    keywords: 'excel to pdf, xlsx to pdf, spreadsheet to pdf, convert excel online'
  },
  'ppt-to-pdf': {
    title: 'Convert PowerPoint to PDF — PPTX to PDF Converter',
    description: 'Convert your PowerPoint presentation slides (.ppt/.pptx) into standard PDF documents easily.',
    keywords: 'ppt to pdf, pptx to pdf, presentation to pdf, convert powerpoint to pdf'
  },
  'html-to-pdf': {
    title: 'Convert HTML to PDF — Webpage to PDF Online',
    description: 'Convert HTML documents or raw web files to standard PDF format instantly in your browser.',
    keywords: 'html to pdf, webpage to pdf, web to pdf, convert html to pdf free'
  },

  // Edit & Enhance
  'page-numbers-pdf': {
    title: 'Add Page Numbers to PDF — Online PDF Page Numbering',
    description: 'Quickly insert page numbers into your PDF files at the footer. Choose format and numbering styles.',
    keywords: 'page numbers pdf, add page numbers to pdf, enumerate pdf pages'
  },
  'remove-pages-pdf': {
    title: 'Remove Pages from PDF — Delete PDF Pages Online',
    description: 'Select and permanently delete unwanted pages from your PDF document. Processed 100% offline.',
    keywords: 'remove pages pdf, delete pdf pages, crop pages from pdf, cut pdf pages'
  },
  'crop-pdf': {
    title: 'Crop PDF — Adjust PDF Margin and Page Size Online',
    description: 'Trim the margins of your PDF pages or adjust size. Simple browser-based PDF cropping tool.',
    keywords: 'crop pdf, trim pdf, adjust pdf margins, crop pdf pages'
  },
  'header-footer-pdf': {
    title: 'Add Header & Footer to PDF — Custom PDF Headers',
    description: 'Add custom header and footer text elements to your PDF pages easily in your browser.',
    keywords: 'add header to pdf, add footer to pdf, pdf header footer tool, custom pdf text'
  },
  'redact-pdf': {
    title: 'Redact PDF — Permanently Blackout Sensitive PDF Text',
    description: 'Remove sensitive information, passwords, or personal data from your PDF with a redaction blackbox.',
    keywords: 'redact pdf, blackout pdf, secure pdf content, remove sensitive info pdf'
  },

  // Security & Utility
  'sign-pdf': {
    title: 'Sign PDF Online — Draw Electronic Signature on PDF',
    description: 'Add your electronic signature to any PDF document. Draw, type, or upload signature image securely.',
    keywords: 'sign pdf, e-signature pdf, sign document online, electronic signature free'
  },
  'flatten-pdf': {
    title: 'Flatten PDF Forms — Flatten Annotations in PDF',
    description: 'Flatten form fields, checklists, and annotations in your PDF to make it read-only and uneditable.',
    keywords: 'flatten pdf, flatten forms, lock form fields pdf, read only pdf'
  },
  'ocr-pdf': {
    title: 'OCR PDF — Make Scanned PDFs Searchable Online',
    description: 'Apply Optical Character Recognition (OCR) to scanned PDF documents to extract and search text.',
    keywords: 'ocr pdf, scanned pdf to text, searchable pdf converter, optical character recognition'
  },
  'repair-pdf': {
    title: 'Repair PDF — Fix Damaged or Corrupted PDF Files',
    description: 'Recover data from broken, corrupted, or damaged PDF documents online using repair scripts.',
    keywords: 'repair pdf, fix corrupted pdf, restore damaged pdf, pdf data recovery'
  },
  'pdf-to-text': {
    title: 'PDF to Text — Extract Plain Text from PDF Online',
    description: 'Extract raw, plain text from any PDF document. Fast text scanner running 100% in your browser.',
    keywords: 'pdf to text, extract text from pdf, pdf text scanner, read text pdf'
  },
  'compare-pdf': {
    title: 'Compare PDFs — Highlight Differences Between PDF Files',
    description: 'Compare two PDF documents side-by-side to detect text additions, removals, and changes.',
    keywords: 'compare pdf, find differences pdf, pdf document comparison, diff pdf'
  }
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
      '100% Free to use',
      'No sign-up or email required',
      'Processed 100% locally in browser',
      'Secure HTTPS transfer',
      'Max 50MB per file',
    ],
  };
}

/**
 * Create a HowTo JSON-LD for better search result features.
 */
export function buildHowToJsonLd(tool, seoData) {
  if (!seoData?.howTo) return null;
  const SITE_URL = 'https://ilovedocs.in';

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use ${tool.name} on ILoveDocs`,
    description: seoData.description,
    step: seoData.howTo.map((stepText, index) => ({
      '@type': 'HowToStep',
      url: `${SITE_URL}/tools/${tool.id}#step-${index + 1}`,
      name: `Step ${index + 1}`,
      text: stepText,
    })),
  };
}

/**
 * Build Breadcrumb JSON-LD
 */
export function buildBreadcrumbJsonLd(tool) {
  const SITE_URL = 'https://ilovedocs.in';
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: `${SITE_URL}/tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `${SITE_URL}/tools/${tool.id}`,
      },
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
        'Free online PDF and document tools. Merge, split, compress, rotate, watermark, and convert PDF files. 100% browser-based.',
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
      logo: `${SITE_URL}/logo.png`,
      sameAs: [],
    },
  ];
}

/**
 * Build a FAQ JSON-LD block for a tool page.
 */
export function buildToolFaqJsonLd(tool, seoData) {
  const genericFaqs = [
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
          'All uploaded and output files are processed entirely within your web browser. No files are ever sent to or saved on our servers.',
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
    {
      '@type': 'Question',
      name: `Do I need to install any software for ${tool.name}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `No, ${tool.name} works directly in your web browser. No plugins, desktop software, or mobile apps are required.`,
      },
    },
  ];

  const faqsToUse = seoData?.faqs
    ? seoData.faqs.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      }))
    : genericFaqs;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqsToUse,
  };
}

/**
 * Build ItemList JSON-LD for the Tools listing page.
 */
export function buildToolsItemListJsonLd(tools) {
  const SITE_URL = 'https://ilovedocs.in';
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Online Document Tools',
    description: 'A comprehensive list of free online PDF processing tools.',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.id}`,
    })),
  };
}
