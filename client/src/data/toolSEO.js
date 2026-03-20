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
    h1: 'Merge PDF Files Online Free',
    h2: 'The Best Free PDF Merger Online',
    description: 'Merge multiple PDF files into a single document in seconds. Free, fast, and secure PDF merger — no signup required. Up to 20 PDFs, 50 MB each.',
    longDescription: 'Our free online PDF merger allows you to seamlessly combine multiple PDF documents into a single, organized file. Whether you are compiling reports, merging invoices, or organizing study materials, ILoveDocs makes the process lightning fast. Drag and drop your files, arrange them in the exact order you need, and hit merge. The entire process happens securely in the cloud, ensuring your original formatting is perfectly preserved.',
    keywords: 'merge PDF, combine PDF, join PDF files, PDF merger online, combine multiple PDFs, merge PDF free',
    howTo: [
      'Click the "Upload Files" button or drag and drop your PDF files into the upload area.',
      'Optionally, rearrange the files into the order you want them to appear in the merged document.',
      'Click the "Merge PDF" button to begin the combination process.',
      'Once finished, click the "Download" button to save your new merged PDF file.'
    ],
    faqs: [
      { q: "Is it safe to merge PDFs online?", a: "Yes. All file transfers are secured with advanced TLS encryption. Your merged PDFs are automatically and permanently deleted from our servers 1 hour after processing." },
      { q: "Will merging PDFs drop the quality?", a: "No, our PDF merger combines your documents without altering the original quality, resolution, or text formatting." },
      { q: "Can I rearrange pages before merging?", a: "Currently, you can upload files and drag them into your preferred order before merging them together." },
      { q: "Do I need to download software to merge PDF files?", a: "No installation is required. Our PDF merge tool operates entirely online in your web browser." }
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
      { q: "Is the PDF splitting process secure?", a: "Absolutely. Files are transferred securely and are hard-deleted automatically after 1 hour." },
      { q: "Can I extract just one page from a PDF?", a: "Yes. Simply type the number of the page you want to extract into the input field." }
    ]
  },
  'compress-pdf': {
    title: 'Compress PDF — Reduce PDF File Size Online Free',
    h1: 'Compress PDF Files Online Free',
    h2: 'The Smartest PDF Compressor Tool',
    description: 'Reduce PDF file size without losing quality. Our free PDF compressor shrinks large files for email or upload — instant, secure, no install.',
    longDescription: 'Running into frustrating file size limits on email or web forms? Our online PDF Compressor is the fastest way to shrink large PDFs into easily shareable files. Using advanced optimization algorithms, we ensure your document gets substantially smaller without sacrificing readability or graphic quality. Best of all, it is entirely free and happens instantly in your web browser.',
    keywords: 'compress PDF, reduce PDF size, PDF compressor, shrink PDF, make PDF smaller, PDF optimizer',
    howTo: [
      'Upload the large PDF file that you need to compress.',
      'Our tool will automatically apply the best compression ratio while preserving quality.',
      'Click the "Compress PDF" button to start the optimization.',
      'Download your optimized, smaller PDF file.'
    ],
    faqs: [
      { q: "Will compressing a PDF make it blurry?", a: "No, our smart compressor optimizes internal structures and image metadata rather than destroying pixel quality. Your text will remain perfectly crisp." },
      { q: "What is the maximum file size I can compress?", a: "You can compress PDF files up to 50 MB in size." },
      { q: "Is the compression tool free to use?", a: "Yes, our PDF compressor is 100% free with no hidden limits or watermarks." }
    ]
  },
  'rotate-pdf': {
    title: 'Rotate PDF — Rotate PDF Pages Online Free',
    description:
      'Rotate individual or all pages in your PDF document online. Choose 90°, 180° or 270° rotation. Free and instant — no account needed.',
    keywords:
      'rotate PDF, rotate PDF pages, flip PDF pages, PDF rotation tool, rotate PDF online free',
    howTo: [
      'Upload your PDF file to the rotation tool.',
      'Choose the rotation angle: 90° clockwise, 180°, or 270° clockwise.',
      'Click the "Rotate PDF" button to apply the changes to all pages.',
      'Download your rotated PDF document.'
    ]
  },
  'watermark-pdf': {
    title: 'Add Watermark to PDF — Online Free Watermark Tool',
    description:
      'Add a custom text watermark to your PDF document online. Control opacity, color, and text. Protect your document in seconds — free.',
    keywords:
      'watermark PDF, add watermark to PDF, PDF watermark online, stamp PDF, text watermark PDF',
    howTo: [
      'Select the PDF file you want to protect with a watermark.',
      'Type your watermark text (e.g., "CONFIDENTIAL" or "DRAFT") in the options box.',
      'Adjust settings like opacity and color to fit your needs.',
      'Click "Watermark PDF" and download your stamped document.'
    ]
  },
  'protect-pdf': {
    title: 'Password Protect PDF — Encrypt PDF Online Free',
    description:
      'Add password protection and encryption to your PDF documents online. Secure sensitive files in seconds without software installation.',
    keywords:
      'protect PDF, password protect PDF, encrypt PDF, secure PDF, lock PDF file, PDF password tool',
    howTo: [
      'Upload the PDF you wish to encrypt.',
      'Set a strong password for your document.',
      'Click the "Protect PDF" button to encrypt the file with AES standards.',
      'Download your newly secured PDF.'
    ]
  },
  'unlock-pdf': {
    title: 'Unlock PDF — Remove PDF Password Online Free',
    description:
      'Remove password protection from PDFs online. Unlock secured PDFs instantly and for free — no desktop software needed.',
    keywords:
      'unlock PDF, remove PDF password, PDF unlocker, decrypt PDF, unsecure PDF, open protected PDF',
    howTo: [
      'Select the password-protected PDF file you want to unlock.',
      'Wait for the tool to analyze the file (ensure you have the right to unlock it).',
      'Click the "Unlock PDF" button to strip the security.',
      'Download your unlocked PDF file.'
    ]
  },
  'reorder-pdf': {
    title: 'Reorder PDF Pages — Rearrange PDF Pages Online',
    description:
      'Rearrange and reorder pages in your PDF document online. Specify a custom page order to reorganize your PDF instantly for free.',
    keywords:
      'reorder PDF pages, rearrange PDF, reorganize PDF, change page order PDF, PDF page organizer',
    howTo: [
      'Upload the PDF you want to reorganize.',
      'Enter the new page order in the input field, separated by commas (e.g., 3, 1, 2).',
      'Click the "Reorder PDF Pages" button.',
      'Download your reorganized PDF file.'
    ]
  },
  'edit-pdf': {
    title: 'Edit PDF — Add Text to PDF Online Free',
    description:
      'Add custom text annotations to your PDF documents online for free. Specify position, font size, and color. No plugins or software required.',
    keywords:
      'edit PDF, add text to PDF, annotate PDF, PDF editor online free, write on PDF, PDF text tool',
    howTo: [
      'Upload the PDF file you need to annotate.',
      'Enter the text you want to add and choose its position, size, and color.',
      'Click the "Edit PDF" button to overlay your text onto the document.',
      'Download your edited PDF.'
    ]
  },
  'jpg-to-pdf': {
    title: 'JPG to PDF — Convert Images to PDF Online Free',
    h1: 'Convert JPG to PDF Online',
    h2: 'The Best Free Image to PDF Converter',
    description: 'Convert JPG, PNG, WebP, and BMP images to PDF documents in one click. Combine multiple images into a single high-quality PDF file for free.',
    longDescription: 'Turn your photos, scanned documents, and image files into professional PDF documents instantly. Whether you are submitting expense receipts, creating a photo album, or compiling scanned pages, our JPG to PDF converter handles it effortlessly. You can upload multiple images at once and combine them into a single continuous PDF document for easy sharing.',
    keywords: 'JPG to PDF, image to PDF, PNG to PDF, convert photo to PDF, picture to PDF, free image PDF converter',
    howTo: [
      'Upload one or more images (JPG, PNG, WebP, BMP).',
      'Our tool will automatically prepare them for a standard PDF layout.',
      'Click "JPG to PDF" to generate the document.',
      'Download your high-quality PDF file.'
    ],
    faqs: [
      { q: "Which image formats are supported?", a: "Our converter fully supports JPG, JPEG, PNG, WebP, and BMP image formats." },
      { q: "Can I convert multiple images into one PDF?", a: "Yes! You can upload up to 20 images at a time and they will all be perfectly combined into a single, multi-page PDF." },
      { q: "Will the images lose quality when converted to PDF?", a: "No. The images are embedded directly into the PDF document keeping their original High-Definition resolution intact." }
    ]
  },
  'pdf-to-word': {
    title: 'PDF to Word — Convert PDF to DOCX Online Free',
    h1: 'Convert PDF to Word Online',
    h2: 'Fast & Accurate PDF to DOCX Converter',
    description: 'Convert PDF documents to editable Word DOCX files online for free. Preserve text and formatting — no email or signup required.',
    longDescription: 'Need to edit a PDF but do not have the original file? Our fast PDF to Word converter accurately extracts the text, styling, and formatting from your PDF and transforms it into an editable Microsoft Word document (.docx). Perfect for updating old documents, tweaking resumes, or extracting text without having to manually retype everything.',
    keywords: 'PDF to Word, convert PDF to DOCX, PDF to Word free, PDF to editable Word, PDF converter, PDF Word online',
    howTo: [
      'Upload the PDF file you want to convert into Word format.',
      'The tool extracts the text and formatting into a DOCX structure.',
      'Click the "PDF to Word" button to start the conversion.',
      'Download your editable Microsoft Word file.'
    ],
    faqs: [
      { q: "Will the Word document look like my original PDF?", a: "Our conversion engine works hard to map PDF layouts, tables, styles, and text into Word format, preserving the visual layout as accurately as possible." },
      { q: "Is the PDF to Word converter free?", a: "Yes, you can convert PDFs to editable Word documents completely for free with no hidden fees." },
      { q: "Is it safe to convert sensitive documents?", a: "Absolutely. We encrypt all traffic and permanently wipe uploaded files from our databases just 1 hour after conversion." }
    ]
  },
  'pdf-to-jpg': {
    title: 'PDF to JPG — Convert PDF Pages to Images Online Free',
    description:
      'Convert every page of your PDF to high-quality JPG images online. Single-page PDFs download as JPG; multi-page PDFs as a ZIP archive.',
    keywords:
      'PDF to JPG, convert PDF to image, PDF to PNG, PDF page to JPG, extract images from PDF, PDF image converter',
    howTo: [
      'Upload the PDF document you want to convert into images.',
      'Our engine processes each page into a separate high-resolution JPG.',
      'Click "PDF to JPG" and download the resulting file.',
      'If it is a multi-page PDF, you will receive a ZIP file containing all pages.'
    ]
  },
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF Tables to XLSX Online Free',
    description:
      'Extract tables and data from PDF files and convert them to Excel XLSX spreadsheets for free. Fast, secure, and no account needed.',
    keywords:
      'PDF to Excel, PDF to XLSX, convert PDF to spreadsheet, extract table from PDF, PDF Excel converter free',
    howTo: [
      'Select the PDF file that contains tables or structured data.',
      'Wait for the engine to analyze and extract the cellular data.',
      'Click "PDF to Excel" to generate your spreadsheet.',
      'Download your editable Excel XLSX file.'
    ]
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX to PDF Online Free',
    description:
      'Convert Microsoft Word DOCX files to PDF documents online for free. Fast conversion with formatting preserved — instant download.',
    keywords:
      'Word to PDF, DOCX to PDF, convert Word to PDF, Word PDF converter, DOC to PDF online free',
    howTo: [
      'Upload your .docx or .doc file to the converter.',
      'Click the "Word to PDF" button to process your document.',
      'The tool magically transforms your Word file into a PDF while keeping your fonts and layout.',
      'Download your new PDF document.'
    ]
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX Spreadsheets to PDF Free',
    description:
      'Convert Excel XLSX spreadsheets to clean PDF documents online for free. No Microsoft Office needed — start converting instantly.',
    keywords:
      'Excel to PDF, XLSX to PDF, convert Excel to PDF, spreadsheet to PDF, XLS to PDF free online',
    howTo: [
      'Select and upload your Excel spreadsheet (.xlsx or .xls).',
      'The tool maps your sheets and cells into a PDF-friendly presentation.',
      'Click "Excel to PDF" to finalize the conversion.',
      'Download your clean PDF file.'
    ]
  },
  'ppt-to-pdf': {
    title: 'PowerPoint to PDF — Convert PPTX to PDF Online Free',
    description:
      'Convert PowerPoint PPTX presentations to PDF documents online for free. Share your slides as a portable PDF file without PowerPoint.',
    keywords:
      'PowerPoint to PDF, PPTX to PDF, convert presentation to PDF, PPT to PDF free, slide to PDF converter',
    howTo: [
      'Upload your PowerPoint (.pptx) file to the upload box.',
      'Click "PowerPoint to PDF" to start transforming your slides.',
      'Download your presentation as a portable PDF document.'
    ]
  },
  'html-to-pdf': {
    title: 'HTML to PDF — Convert Web Pages to PDF Online Free',
    description:
      'Convert HTML files and web pages to PDF documents online for free. Upload your HTML file and receive a clean, printable PDF instantly.',
    keywords:
      'HTML to PDF, convert webpage to PDF, HTML file to PDF, web page PDF converter, HTML PDF online free',
    howTo: [
      'Upload your .html file or a snapshot of a webpage.',
      'Click the "HTML to PDF" button to generate the report.',
      'Download your clean PDF document.'
    ]
  },
  'compress-image': {
    title: 'Compress Image — Reduce Image File Size Online Free',
    description:
      'Compress JPG, PNG, and WebP images online for free. Reduce file size up to 80% while maintaining visual quality — instant, no signup.',
    keywords:
      'compress image, reduce image size, image compressor, optimize image, shrink photo, JPG PNG compressor free',
    howTo: [
      'Select the image (JPG, PNG, or WebP) you need to shrink.',
      'Optionally, select the quality level or output format.',
      'Click "Compress Image" to reduce the file size.',
      'Download your optimized image instantly.'
    ]
  },
  'resize-image': {
    title: 'Resize Image — Change Image Dimensions Online Free',
    description:
      'Resize JPG, PNG, and WebP images to any dimension online for free. Maintain aspect ratio or set custom width and height — instant download.',
    keywords:
      'resize image, change image size, image resizer online, scale image, crop resize photo free, image dimensions',
    howTo: [
      'Upload the image you want to resize.',
      'Input the desired width and height, and choose a fit mode.',
      'Click "Resize Image" to adjust the dimensions.',
      'Download your newly sized image.'
    ]
  },
  'convert-image': {
    title: 'Convert Image — Convert JPG PNG WebP BMP Online Free',
    description:
      'Convert images between JPG, PNG, WebP, BMP, GIF, and TIFF formats online for free. Fast image format converter — no account, no software.',
    keywords:
      'convert image, image converter, JPG to PNG, PNG to WebP, WebP to JPG, BMP to PNG, image format converter free',
    howTo: [
      'Select the image file you want to convert.',
      'Choose your target output format (e.g., JPEG, PNG, WebP, BMP, TIFF, GIF).',
      'Click the "Convert Image" button.',
      'Download your image in its new format.'
    ]
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
      '100% Free to use',
      'No sign-up or email required',
      'Files auto-deleted after 1 hour',
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
