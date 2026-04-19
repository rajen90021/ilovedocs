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
  'yt-thumbnail': {
    title: 'YouTube Thumbnail Downloader — Get High-Res Thumbnails Free',
    h1: 'Download YouTube Thumbnails In HD',
    h2: 'Free HD & 4K YouTube Thumbnail Downloader',
    description: 'Extract and download high-resolution thumbnails from any YouTube video instantly. No login, no ads, high-quality JPG results.',
    longDescription: 'Need a high-quality thumbnail for a report, blog post, or inspiration? Our free YouTube Thumbnail Downloader lets you grab the specific HD cover image from any video in seconds. Just paste the URL and get the MaxRes, High, and Medium resolution images instantly.',
    keywords: 'youtube thumbnail downloader, download yt thumbnails, save youtube thumbnail hd, extract video cover image',
    howTo: [
      'Paste the YouTube video URL into the input field.',
      'Wait for the dashboard to fetch the thumbnail options.',
      'Select the resolution you need (MaxRes, High, or Medium).',
      'Right-click or click download to save the image.'
    ],
    faqs: [
      { q: "Is it legal to download YouTube thumbnails?", a: "Downloading thumbnails is generally allowed for personal use or fair use scenarios like criticism, news, or education. Always respect the original creator's copyright." },
      { q: "What is the highest resolution available?", a: "We provide 'MaxResDefault' which is usually 1280x720 or 1920x1080 depending on what the creator uploaded." }
    ]
  },
  'yt-tags': {
    title: 'YouTube Tag Extractor — Get Video SEO Tags Free',
    h1: 'Extract YouTube Tags & SEO Keywords',
    h2: 'Optimize Your Videos with High-Ranking Tags',
    description: 'See the hidden tags and SEO keywords used by successful YouTube videos. Research competition and improve your own video rankings free.',
    longDescription: 'Struggling with YouTube SEO? Our Tag Extractor reveals exactly which tags top-ranking videos are using. By analyzing your competition, you can discover high-volume keywords to help your own videos rank higher in search results and the "Recommended" section.',
    keywords: 'youtube tag extractor, get tags from youtube video, youtube seo research tool, find video keywords',
    howTo: [
      'Enter the link of the YouTube video you want to analyze.',
      'Click the "Extract Tags" button.',
      'View the complete list of hidden SEO tags used by the video.',
      'Copy the tags to your clipboard for your own metadata.'
    ],
    faqs: [
      { q: "Why are YouTube tags hidden?", a: "YouTube hides tags from the front-end UI for a cleaner look, but they are still in the metadata. Our tool simply pulls them out for you to see." },
      { q: "How many tags should I use on my video?", a: "YouTube allows up to 500 characters of tags. Focus on relevance rather than quantity." }
    ]
  },
  'yt-transcript': {
    title: 'YouTube Transcript Downloader — Get Video Captions to Text',
    h1: 'Download YouTube Transcripts as Text',
    h2: 'Convert Video Audio to Readable Text Instantly',
    description: 'Extract full timestamps and text transcripts from any YouTube video. Perfect for students, researchers, and content creators.',
    longDescription: 'Turn any video into a readable document in one click. Our YouTube Transcript Downloader extracts all captions and formats them into clean, searchable text. Ideal for taking notes from lectures, repurposing video content into blog posts, or studying long-form interviews.',
    keywords: 'youtube transcript downloader, convert youtube to text, download captions from youtube, save video transcript',
    howTo: [
      'Paste the URL of the YouTube video.',
      'Click "Get Transcript" to start the extraction.',
      'View the full text in our clean dashboard reader.',
      'Copy the entire transcript or save it for your research.'
    ],
    faqs: [
      { q: "Does this work for videos without CC?", a: "No, the video must have either auto-generated captions or manually uploaded subtitles for our tool to fetch them." },
      { q: "Can I download transcripts in different languages?", a: "We currently fetch the primary language transcript available on the video." }
    ]
  },
  'yt-region': {
    title: 'YouTube Region Checker — See Where Videos are Blocked',
    h1: 'Check YouTube Video Country Restrictions',
    h2: 'Is your video blocked? Check Worldwide Availability',
    description: 'Find out if a YouTube video is restricted or blocked in specific countries. Get a full list of allowed and blocked regions instantly.',
    longDescription: 'Ever wondered why a video says "not available in your country"? Our Region Checker reveals the exact restriction list for any video. Useful for creators checking their global reach or users trying to understand regional licensing blocks.',
    keywords: 'youtube region checker, check video blocked countries, youtube restriction checker, bypass regional blocks',
    howTo: [
      'Paste the YouTube video link.',
      'Click "Check Regions" in the dashboard.',
      'View the "Allowed" and "Blocked" status for countries worldwide.',
      'Understand exactly where the video is licensed to play.'
    ],
    faqs: [
      { q: "Why are some videos blocked in my country?", a: "Videos are often restricted due to licensing agreements, copyright claims, or local government censorship." },
      { q: "Does this tool help me unblock a video?", a: "This tool is for checking status only. To watch a blocked video, you would typically need a VPN." }
    ]
  },
  'yt-summarize': {
    title: 'YouTube Video Summarizer AI — Get Instant Video Recaps',
    h1: 'AI-Powered YouTube Video Summarization',
    h2: 'Summarize Long Videos into Key Points Instantly',
    description: 'Use advanced AI to summarize any YouTube video into clear bullet points. Save hours of watching time—get the insights fast.',
    longDescription: 'Do not have time to watch a 30-minute lecture or interview? Our AI Video Summarizer uses state-of-the-art language models to watch the video for you and return a concise, high-impact summary. Get the key takeaways, main arguments, and important data points in seconds.',
    keywords: 'youtube video summarizer, ai video summary, summarize youtube with ai, yt recap tool',
    howTo: [
      'Provide the YouTube URL of the video you want to summarize.',
      'Click "Summarize with AI".',
      'Wait for the AI to analyze the transcript and generate a recap.',
      'Review the key insights and copy the summary for your notes.'
    ],
    faqs: [
      { q: "How accurate is the AI summary?", a: "The AI is highly accurate as it analyzes the actual transcript of the video. However, always verify critical numbers or facts." },
      { q: "Is there a length limit for videos?", a: "The tool works best on videos under 20 minutes, but can handle longer content by focusing on the most relevant sections." }
    ]
  },
  'yt-monetization': {
    title: 'YouTube Monetization Checker — See if a Channel is Monetized',
    h1: 'Check YouTube Channel Monetization Status',
    h2: 'Find Out if Any YouTube Channel is Making Money',
    description: 'Instantly check if a YouTube channel or video is monetized. See subscriber counts, estimated earnings, and family-friendly statuses for free.',
    longDescription: 'Curious if your favorite creator is monetized, or doing research on competitors in your niche? Our YouTube Monetization Checker analyzes the source code and metadata of any channel to reliably determine its monetization status. Get comprehensive stats including total views, subscriber milestones, and family-friendly tags in one click.',
    keywords: 'youtube monetization checker, is channel monetized, check youtube channel earnings, youtube money calculator',
    howTo: [
      'Paste the URL of a YouTube channel or a specific video.',
      'Click the Check button to scan the channel data.',
      'Instantly see if the channel has monetization enabled.',
      'Review additional metrics like estimated earnings and safety status.'
    ],
    faqs: [
      { q: "How do you know if a channel is monetized?", a: "We analyze hidden metadata tags in the channel source code that indicate whether the channel is approved for the YouTube Partner Program." },
      { q: "Does checking a channel alert the owner?", a: "No, this tool performs a completely anonymous check." }
    ]
  },
  'yt-seo-score': {
    title: 'YouTube SEO Score Checker — Analyze Video Ranking Strength',
    h1: 'Check Your YouTube Video SEO Score',
    h2: 'Optimize Videos for the YouTube Algorithm',
    description: 'Analyze any YouTube video for SEO best practices. Get an instant score out of 100 on titles, descriptions, tags, and thumbnails to rank higher.',
    longDescription: 'Are your videos not getting enough views? Our YouTube SEO Score tool grades any video on critical algorithmic ranking factors. We check title lengths, keyword density, tag usage, description links, and thumbnail dimensions to give you a definitive SEO score out of 100, alongside a checklist of what to fix.',
    keywords: 'youtube seo score checker, youtube keyword rank checker, rank higher on youtube, optimize youtube video, video seo tool',
    howTo: [
      'Input the URL of the YouTube video you want to audit.',
      'Wait for our system to scan the video metadata and thumbnail.',
      'Review your overall SEO score out of 100.',
      'Follow the red/yellow checklist warnings to fix missing SEO elements.'
    ],
    faqs: [
      { q: "What makes a perfect YouTube SEO score?", a: "A perfect score means the video has a fully optimized title length, uses maximum allowed tags, has a comprehensive description with links, and features an HD thumbnail." },
      { q: "Will fixing these issues guarantee more views?", a: "While SEO helps the algorithm understand your video, ultimately CTR (Click-Through Rate) and AVD (Average View Duration) determine virality." }
    ]
  },
  'yt-revenue': {
    title: 'YouTube Revenue Calculator — Estimate Channel Earnings',
    h1: 'YouTube Revenue & Earnings Calculator',
    h2: 'Calculate Daily, Monthly, and Yearly Earnings',
    description: 'Calculate the estimated revenue of any YouTube channel or video based on views and RPM. Free YouTube money calculator.',
    longDescription: 'Ever wondered how much a specific video made? Our YouTube Revenue Calculator uses standard industry RPM (Revenue Per Mille) metrics combined with live view-counts to estimate the daily, monthly, and yearly income of any video or channel. Adjust sliders or rely on our data estimates to see the financial potential of YouTube niches.',
    keywords: 'youtube revenue calculator, youtube money calculator, how much do youtubers make, estimate youtube earnings',
    howTo: [
      'Enter the YouTube video or channel URL you are curious about.',
      'Let the tool fetch the total view counts.',
      'Review the projected daily, monthly, and yearly earnings.',
      'Understand how RPM differences affect total income.'
    ],
    faqs: [
      { q: "Are these earnings exact?", a: "No, these are estimates. Exact earnings depend heavily on the demographic of the viewers, the niche of the channel, and the current advertiser bidding rates (CPM)." },
      { q: "What is RPM vs CPM?", a: "CPM is what advertisers pay per 1,000 views. RPM is what the creator actually takes home per 1,000 views after YouTube takes its 45% cut." }
    ]
  },
  'yt-video-info': {
    title: 'YouTube Video Info Viewer — Extract Metadata & Thumbnails',
    h1: 'Extract YouTube Video Metadata',
    h2: 'View Hidden Video Data, Descriptions & Publish Dates',
    description: 'Extract and view all hidden metadata from a YouTube video including exact publish date, full description, category, and HD thumbnails.',
    longDescription: 'Get a clean, instant overview of any YouTube video. The Video Info Viewer extracts critical metadata such as the exact publish date and time, the full un-truncated description, duration, and channel category without needing to open the YouTube app.',
    keywords: 'youtube video info, extract youtube metadata, video publish date, youtube description extractor',
    howTo: [
      'Paste the URL of any public YouTube video.',
      'Click the button to extract metadata.',
      'Read the clean summary of views, dates, formats, and text.',
      'Easily copy the description or save the thumbnail.'
    ]
  },
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
    h1: 'Rotate PDF Pages Online',
    h2: 'Fix PDF Orientation in Seconds',
    description: 'Rotate individual or all pages in your PDF document online. Choose 90°, 180° or 270° rotation. Free and instant — no account needed.',
    longDescription: 'Scanned a document upside down or sideways? Our PDF rotation tool lets you easily fix the orientation of your PDF files. You can rotate specific pages or the entire document by 90, 180, or 270 degrees. It works entirely in your browser, keeping your data private and secure.',
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
      { q: "Can I remove a watermark later?", a: "If the PDF is not flattened, some editors can remove it, but our tool permanently stamps the text into the PDF layers for security." },
      { q: "Is there a limit to the length of the watermark text?", a: "We recommend keeping it under 50 characters for better visibility across the page." }
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
      { q: "What happens if I forget the password?", a: "For security reasons, we do not store your passwords. If you lose it, the file cannot be decrypted by us." },
      { q: "What encryption level is used?", a: "We use standard 128-bit or 256-bit AES encryption to ensure maximum security." }
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
    h1: 'Convert PDF to JPG Online',
    h2: 'Extract High-Quality Images from PDF',
    description: 'Convert every page of your PDF to high-quality JPG images online. Single-page PDFs download as JPG; multi-page PDFs as a ZIP archive.',
    longDescription: 'Want to turn a PDF slide into a social media post? Our PDF to JPG converter extracts each page of your document as a high-resolution image file. It handles single and multi-page documents with ease.',
    keywords: 'PDF to JPG, convert PDF to image, PDF to PNG, PDF page to JPG, extract images from PDF, PDF image converter',
    howTo: [
      'Upload the PDF document you want to convert into images.',
      'Click "PDF to JPG" and wait for the conversion to complete.',
      'Download your images (multi-page files will be in a ZIP archive).'
    ]
  },
  'pdf-to-excel': {
    title: 'PDF to Excel — Convert PDF Tables to XLSX Online Free',
    h1: 'Convert PDF to Excel Online',
    h2: 'Extract PDF Tables to Editable Spreadsheets',
    description: 'Extract tables and data from PDF files and convert them to Excel XLSX spreadsheets for free. Fast, secure, and no account needed.',
    longDescription: 'Stop manual data entry. If you have a PDF table, our tool will extract the cellular data and formatting into a perfect Excel spreadsheet. Ideal for financial analysis and data migration.',
    keywords: 'PDF to Excel, PDF to XLSX, convert PDF to spreadsheet, extract table from PDF, PDF Excel converter free',
    howTo: [
      'Select the PDF file containing the data tables.',
      'Click "PDF to Excel" to start the extraction.',
      'Download your XLSX file and start editing.'
    ]
  },
  'word-to-pdf': {
    title: 'Word to PDF — Convert DOCX to PDF Online Free',
    h1: 'Convert Word to PDF Online',
    h2: 'Professional DOCX to PDF Conversion',
    description: 'Convert Microsoft Word DOCX files to PDF documents online for free. Fast conversion with formatting preserved — instant download.',
    longDescription: 'Ensure your document looks exactly the same on every device by converting it to PDF. Our Word to PDF tool preserves fonts, spacing, and images perfectly.',
    keywords: 'Word to PDF, DOCX to PDF, convert Word to PDF, Word PDF converter, DOC to PDF online free',
    howTo: [
      'Upload your .docx or .doc file.',
      'Click the "Word to PDF" button.',
      'Download your professional PDF document.'
    ]
  },
  'excel-to-pdf': {
    title: 'Excel to PDF — Convert XLSX Spreadsheets to PDF Free',
    h1: 'Convert Excel to PDF Online',
    h2: 'Transform Spreadsheets into Clean PDF Reports',
    description: 'Convert Excel XLSX spreadsheets to clean PDF documents online for free. No Microsoft Office needed — start converting instantly.',
    longDescription: 'Turn your data into a readable report. Our Excel to PDF converter ensures your tables and charts are formatted correctly for viewing or printing.',
    keywords: 'Excel to PDF, XLSX to PDF, convert Excel to PDF, spreadsheet to PDF, XLS to PDF free online',
    howTo: [
      'Upload your Excel spreadsheet.',
      'Click "Excel to PDF" to process the conversion.',
      'Download your PDF report.'
    ]
  },
  'ppt-to-pdf': {
    title: 'PowerPoint to PDF — Convert PPTX to PDF Online Free',
    h1: 'Convert PowerPoint to PDF Online',
    h2: 'Share Your Slides as Portable PDF Files',
    description: 'Convert PowerPoint PPTX presentations to PDF documents online for free. Share your slides as a portable PDF file without PowerPoint.',
    longDescription: 'Make your presentations accessible to everyone. By converting PowerPoint slides to PDF, you ensure that they can be viewed on any device without software compatibility issues.',
    keywords: 'PowerPoint to PDF, PPTX to PDF, convert presentation to PDF, PPT to PDF free, slide to PDF converter',
    howTo: [
      'Upload your PPTX or PPT file.',
      'Click "PowerPoint to PDF".',
      'Download your slides as a single PDF.'
    ]
  },
  'html-to-pdf': {
    title: 'HTML to PDF — Convert Web Pages to PDF Online Free',
    h1: 'Convert HTML to PDF Online',
    h2: 'Save Webpages as Offline PDF Documents',
    description: 'Convert HTML files and web pages to PDF documents online for free. Upload your HTML file and receive a clean, printable PDF instantly.',
    longDescription: 'Archive web content or save online articles for later reading. Our HTML to PDF tool renders code into a clean document format.',
    keywords: 'HTML to PDF, convert webpage to PDF, HTML file to PDF, web page PDF converter, HTML PDF online free',
    howTo: [
      'Upload your .html file.',
      'Click "HTML to PDF".',
      'Download your PDF snapshot.'
    ]
  },
  'compress-image': {
    title: 'Compress Image — Reduce Image File Size Online Free',
    h1: 'Compress Images Online Free',
    h2: 'Fast JPG, PNG, & WebP Compression',
    description: 'Compress JPG, PNG, and WebP images online for free. Reduce file size up to 80% while maintaining visual quality — instant, no signup.',
    longDescription: 'Speed up your website and save storage space. Our image compressor uses smart techniques to shrink images without making them look pixelated or blurry.',
    keywords: 'compress image, reduce image size, image compressor, optimize image, shrink photo, JPG PNG compressor free',
    howTo: [
      'Upload the images you want to shrink.',
      'Click "Compress Image".',
      'Download your optimized images.'
    ]
  },
  'resize-image': {
    title: 'Resize Image — Change Image Dimensions Online Free',
    h1: 'Resize Images Online Free',
    h2: 'Custom Dimensions for Any Purpose',
    description: 'Resize JPG, PNG, and WebP images to any dimension online for free. Maintain aspect ratio or set custom width and height — instant download.',
    longDescription: 'Get the exact dimensions you need for social media, print, or web design. Our resizer lets you scale images precisely while keeping things crisp.',
    keywords: 'resize image, change image size, image resizer online, scale image, crop resize photo free, image dimensions',
    howTo: [
      'Upload your image file.',
      'Enter the new width and height.',
      'Click "Resize Image" and download the result.'
    ]
  },
  'convert-image': {
    title: 'Convert Image — Convert JPG PNG WebP BMP Online Free',
    h1: 'Convert Image Formats Online',
    h2: 'The Ultimate Image Format Converter',
    description: 'Convert images between JPG, PNG, WebP, BMP, GIF, and TIFF formats online for free. Fast image format converter — no account, no software.',
    longDescription: 'Swap between image formats in a heart beat. Whether you need a transparent PNG or a lightweight WebP, our converter handles it all in high quality.',
    keywords: 'convert image, image converter, JPG to PNG, PNG to WebP, WebP to JPG, BMP to PNG, image format converter free',
    howTo: [
      'Upload the image or image sets.',
      'Choose your desired output format.',
      'Click "Convert Image".',
      'Download your new files.'
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

/**
 * Build ItemList JSON-LD for the Tools listing page.
 */
export function buildToolsItemListJsonLd(tools) {
  const SITE_URL = 'https://ilovedocs.in';
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Online Document Tools',
    description: 'A comprehensive list of free online PDF and image processing tools.',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      url: `${SITE_URL}/tools/${tool.id}`,
    })),
  };
}
