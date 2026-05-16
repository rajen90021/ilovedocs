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
    title: 'YouTube Thumbnail Downloader HD — Free 4K Video Cover Saver',
    h1: 'Download YouTube Thumbnails in Ultra HD',
    h2: '#1 Free HD & 4K YouTube Thumbnail Downloader Online',
    description: 'Get high-resolution YouTube thumbnails (1280x720, 1920x1080) for free. Extract 4K video covers instantly. No login, no ads, high-quality JPG results.',
    longDescription: 'Struggling to find the original high-resolution thumbnail of a YouTube video? Our professional YouTube Thumbnail Downloader is built for creators, designers, and researchers. Whether you need an HD cover for a presentation, blog post, or inspiration, our tool fetches the Maximum Resolution (MaxResDefault) directly from YouTube servers. 100% free, forever.',
    keywords: 'youtube thumbnail downloader, download yt thumbnails hd, save youtube thumbnail 4k, extract video cover image, high res youtube thumbnail, youtube thumbnail grabber',
    features: [
      'Download in MaxRes, High, Medium, and SD qualities',
      'Instant extraction – no waiting or processing queues',
      'No registration or personal data required',
      'Supports all YouTube video formats including Shorts'
    ],
    howTo: [
      'Copy the YouTube video URL from your browser or app.',
      'Paste the link into the input field above.',
      'Wait a second for the tool to fetch all available resolutions.',
      'Choose your preferred quality (MaxRes is recommended for 4K/HD).',
      'Click Download to save the JPG image to your device.'
    ],
    faqs: [
      { q: "Is it legal to download YouTube thumbnails?", a: "Downloading thumbnails is generally permitted for personal use, education, or news reporting under Fair Use. However, always credit the original creator if you use it publicly." },
      { q: "What is the highest resolution available?", a: "We provide the 'MaxResDefault' version, which is the original size uploaded by the creator (typically 1280x720 or 1920x1080)." },
      { q: "Does this work for YouTube Shorts?", a: "Yes! Simply paste the Shorts link and we will extract the cover image for you." }
    ]
  },
  'yt-tags': {
    title: 'YouTube Tag Extractor — Get SEO Keywords from Any Video',
    h1: 'Extract YouTube SEO Tags & Keywords',
    h2: 'Find High-Ranking Keywords with Our Tag Extractor',
    description: 'Discover the hidden SEO tags used by viral YouTube videos. Analyze competition and improve your video rankings with our free tag extractor tool.',
    longDescription: 'Want to know why your competitors are ranking on Page 1 while you aren\'t? It often comes down to their hidden metadata. Our YouTube Tag Extractor reveals the exact keywords and tags used by top-performing videos. By researching these tags, you can optimize your own videos to appear in search results and the "Suggested Videos" sidebar, driving more organic traffic to your channel.',
    keywords: 'youtube tag extractor, get tags from youtube video, youtube seo research tool, find video keywords, extract yt tags free, youtube keyword research',
    features: [
      'Extract hidden metadata that YouTube doesn\'t show publicly',
      'One-click "Copy All Tags" for easy optimization',
      'Analyze any public YouTube video instantly',
      'Identify niche-specific high-volume keywords'
    ],
    howTo: [
      'Find a high-ranking video in your niche on YouTube.',
      'Copy the video link (URL).',
      'Paste it into our Tag Extractor tool.',
      'Hit "Extract" to see every tag used by that creator.',
      'Copy the most relevant tags for your own video metadata.'
    ],
    faqs: [
      { q: "Why are YouTube tags important?", a: "Tags help YouTube\'s algorithm understand the context of your video, which is crucial for appearing in search results and recommendations." },
      { q: "How many tags should I use?", a: "YouTube allows up to 500 characters. We recommend using 10-15 highly relevant tags rather than stuffing irrelevant keywords." },
      { q: "Can I extract tags from private videos?", a: "No, our tool only works with public or unlisted videos where metadata is accessible." }
    ]
  },
  'yt-monetization': {
    title: 'YouTube Monetization Checker — Check Channel & Video Status',
    h1: 'Is This YouTube Video Monetized?',
    h2: 'Check Monetization Status of Any Channel or Video',
    description: 'Find out instantly if a YouTube channel or video is earning money. Our tool analyzes metadata to detect monetization markers and ads.',
    longDescription: 'Curious about your favorite creator\'s earnings or checking if your own video is eligible for revenue? Our YouTube Monetization Checker uses advanced analysis to look for specific "adPlacements" and "monetizationSettings" markers in the video data. It provides a definitive "Yes" or "No" along with estimated revenue projections based on views and industry-standard RPMs.',
    keywords: 'youtube monetization checker, is this video monetized, check youtube channel earnings, youtube revenue checker, check monetization status',
    features: [
      'Accurate detection of official monetization flags',
      'Channel-level and video-level analysis',
      'Estimated revenue calculation based on view count',
      'Check if a video is "Family Friendly" or age-restricted'
    ],
    howTo: [
      'Enter the URL of the YouTube video or channel you want to check.',
      'Click "Check Status" to begin the analysis.',
      'View the monetization badge (Green for Active, Red for Inactive).',
      'Check the "Estimated Earnings" section for revenue projections.'
    ],
    faqs: [
      { q: "How accurate is the monetization checker?", a: "Our tool is over 98% accurate as it reads the raw metadata returned by YouTube's internal API regarding ad placements." },
      { q: "Why does it say 'Not Monetized' for some big channels?", a: "A channel might be monetized, but a specific video might be demonetized due to copyright claims, community guidelines, or being 'not advertiser-friendly'." },
      { q: "Can it check total channel earnings?", a: "Yes, by pasting a channel link, we estimate lifetime earnings based on total public view counts." }
    ]
  },
  'yt-transcript': {
    title: 'YouTube Transcript Downloader — Get Video Captions to Text Free',
    h1: 'Download YouTube Transcripts as Text',
    h2: 'Convert Video Audio to Readable Text & Captions Instantly',
    description: 'Extract full timestamps and text transcripts from any YouTube video. Free captions to text converter for students, researchers, and creators.',
    longDescription: 'Turn any video into a readable, searchable document in one click. Our YouTube Transcript Downloader extracts all official and auto-generated captions and formats them into clean text. Perfect for taking notes from lectures, repurposing video content into blog posts, or studying long-form interviews without watching the entire video.',
    keywords: 'youtube transcript downloader, convert youtube to text, download captions from youtube, save video transcript, yt captions extractor, youtube text converter',
    features: [
      'Extract full transcripts with or without timestamps',
      'Supports auto-generated and manual captions',
      'One-click "Copy Transcript" for easy editing',
      'Works with long-form videos and educational content'
    ],
    howTo: [
      'Paste the URL of the YouTube video you want to transcribe.',
      'Click "Get Transcript" to start the extraction process.',
      'View the full text in our clean dashboard reader.',
      'Select "With Timestamps" or "Text Only" formatting.',
      'Copy the entire transcript or save it for your research.'
    ],
    faqs: [
      { q: "Does this work for videos without CC?", a: "The video must have either auto-generated captions or manually uploaded subtitles for our tool to fetch them." },
      { q: "Can I download transcripts in different languages?", a: "We currently fetch the primary language transcript available. If the video has multiple tracks, the default one is extracted." },
      { q: "Is there a limit on video length?", a: "Our tool can handle transcripts for videos up to several hours long with ease." }
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
    title: 'YouTube Video Summarizer AI — Get Instant Video Recaps Free',
    h1: 'AI-Powered YouTube Video Summarization',
    h2: 'Summarize Long Videos into Key Points Instantly with AI',
    description: 'Use advanced Gemini AI to summarize any YouTube video into clear bullet points. Save hours of watching—get the core insights fast.',
    longDescription: 'Don\'t have time to watch a 30-minute lecture or interview? Our AI Video Summarizer uses state-of-the-art language models (Gemini Pro) to watch the video for you and return a concise, high-impact summary. Get the key takeaways, main arguments, and important data points in seconds. Ideal for learning faster and maximizing your productivity.',
    keywords: 'youtube video summarizer, ai video summary, summarize youtube with ai, yt recap tool, youtube video to bullet points, ai video notes',
    features: [
      'AI-driven summary of key insights and takeaways',
      'Structured formatting with Overview and Bullet Points',
      'Processes videos up to 2 hours long',
      'Supports educational, news, and technical content'
    ],
    howTo: [
      'Provide the YouTube URL of the video you want to summarize.',
      'Click "Summarize with AI" and wait a few seconds.',
      'The AI analyzes the transcript and generates a recap.',
      'Review the key insights and copy the summary for your notes.'
    ],
    faqs: [
      { q: "How accurate is the AI summary?", a: "The AI is highly accurate as it analyzes the actual transcript of the video. However, always verify critical numbers or facts." },
      { q: "Is there a limit to the video length?", a: "We can summarize videos up to roughly 14,000 words of transcript (about 2 hours of speech)." },
      { q: "Do I need an AI API key?", a: "No, we handle all the AI processing on our servers for free." }
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
    title: 'YouTube Revenue Calculator — Estimate Channel & Video Earnings',
    h1: 'YouTube Earnings & Revenue Calculator',
    h2: 'How Much Do YouTubers Make? Calculate Earnings Instantly',
    description: 'Estimate monthly and yearly earnings for any YouTube channel. Calculate potential revenue based on views, CPM, and engagement rates.',
    longDescription: 'Curious about the earning potential of a niche or a specific channel? Our YouTube Revenue Calculator provides detailed projections based on view counts and industry-standard RPM (Revenue Per Mille) benchmarks. Whether you are a creator planning your next move or just curious about channel stats, our tool gives you a clear picture of the financial side of YouTube.',
    keywords: 'youtube revenue calculator, youtube money calculator, check yt channel earnings, estimate youtube salary, how much youtube pays for views',
    features: [
      'Daily, Monthly, and Yearly revenue projections',
      'Adjustable CPM/RPM sliders for better accuracy',
      'Competitor channel earning analysis',
      'Breakdown of earnings per 1,000 and 1,000,000 views'
    ],
    howTo: [
      'Enter the YouTube Channel URL or Video URL.',
      'Click "Calculate Revenue".',
      'Review the earnings table showing daily and yearly estimates.',
      'Use the results to benchmark channel performance or set goals.'
    ],
    faqs: [
      { q: "How are the earnings calculated?", a: "We use public view counts and multiply them by industry-standard RPM rates ($1 - $10) depending on the content niche." },
      { q: "Is this the exact amount they earn?", a: "No, these are estimates. Actual earnings depend on audience location, ad types, and sponsorships." },
      { q: "Why is the revenue range so wide?", a: "Revenue varies significantly between niches (e.g., Finance pays more than Entertainment)." }
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
    title: 'Merge PDF Online — Combine PDF Files for Free',
    h1: 'Merge Multiple PDF Files into One',
    h2: '#1 Free Online PDF Merger — No Limits, No Signup',
    description: 'Combine multiple PDF documents into a single file in seconds. Drag and drop, reorder pages, and merge PDFs with 100% security.',
    longDescription: 'Merging PDF files shouldn\'t be complicated. Our online PDF Merger allows you to combine up to 50 files into a single organized document. Whether you are organizing tax documents, merging medical records, or combining school assignments, our tool handles it with high-speed processing and zero data loss. Your files are automatically deleted after processing for your privacy.',
    keywords: 'merge pdf, combine pdf files, join pdf online, free pdf merger, merge multiple pdfs, combine docs to pdf',
    features: [
      'Drag and drop multiple files to merge instantly',
      'Reorder files before merging to get the perfect sequence',
      'Fast server-side processing – no browser lag',
      'Secure end-to-end encryption for all uploads'
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
      { q: "Is it safe to upload my documents?", a: "Yes, we use SSL encryption and all files are permanently deleted from our servers after 1 hour." }
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
    title: 'Compress PDF Online — Reduce PDF File Size Free',
    h1: 'Compress & Optimize PDF Files',
    h2: 'Shrink Your PDF Size Without Losing Quality',
    description: 'Reduce PDF file size for easier email sharing and faster web loading. Get the smallest PDF size with the highest possible quality.',
    longDescription: 'Is your PDF too large to send via email? Our PDF compressor uses advanced optimization algorithms to strip away unnecessary metadata and compress high-resolution images within the document. You get a significantly smaller file while the text remains crisp and images look professional. Perfect for job applications, government portals, and storage optimization.',
    keywords: 'compress pdf, reduce pdf size, shrink pdf online, optimize pdf for web, small pdf converter, free pdf compressor',
    features: [
      'Intelligent compression – high quality with low file size',
      'Batch compress multiple files at once',
      'Privacy first: files are auto-deleted from servers',
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
  'yt-thumbnail': {
    title: 'YouTube Thumbnail Downloader — Get High-Quality YT Thumbnails Free',
    h1: 'Download YouTube Thumbnails Online',
    h2: 'Get HD, HQ, and MaxRes Thumbnails in Seconds',
    description: 'Download high-quality YouTube thumbnails for free. Just paste the video link and get all available resolutions (HD, HQ, 1080p, 720p) instantly.',
    longDescription: 'Need the thumbnail of a YouTube video for your blog, social media, or presentation? Our YouTube Thumbnail Downloader extracts the highest possible resolution images directly from YouTube servers. No watermark, no signup, just high-def images.',
    keywords: 'youtube thumbnail downloader, download yt thumbnails, get youtube video image, save youtube thumbnail hd, high res youtube thumbnail, youtube thumbnail grabber',
    howTo: [
      'Copy the URL of the YouTube video.',
      'Paste it into the input box above.',
      'Click the "Fetch Thumbnails" button.',
      'Right-click and save your desired resolution (MaxRes, HQ, or MQ).'
    ],
    faqs: [
      { q: "Is it legal to download YouTube thumbnails?", a: "Downloading for personal use or fair use (like commentary or news) is generally fine, but always respect the original creator's copyright." },
      { q: "What is the highest resolution available?", a: "We fetch the 'maxresdefault' image, which is usually 1280x720 or 1920x1080 if provided by the creator." }
    ]
  },
  'yt-tags': {
    title: 'YouTube Tag Extractor — Find & Extract Video Keywords for SEO',
    h1: 'YouTube Tags & SEO Extractor',
    h2: 'Copy Competitor Tags to Rank Higher',
    description: 'Find and extract hidden tags from any YouTube video. Optimize your own video SEO by copying high-ranking competitor keywords for free.',
    longDescription: 'Hidden tags are a major signal for the YouTube algorithm. Our Tag Extractor reveals the exact keywords used by top-ranking videos, allowing you to optimize your own content strategy and improve your search rankings.',
    keywords: 'youtube tag extractor, find youtube tags, extract keywords from youtube video, see youtube video tags, copy youtube tags, youtube seo tool',
    howTo: [
      'Paste the YouTube video link into the tool.',
      'Click "Extract Tags".',
      'Copy the list of keywords to use in your own video settings.'
    ]
  },
  'yt-transcript': {
    title: 'YouTube Transcript Downloader — Extract Text from YT Videos',
    h1: 'YouTube Transcript & Text Extractor',
    h2: 'Get Video Text in Seconds',
    description: 'Download and extract full transcripts from any YouTube video. Convert video speech to text for blogs, research, or study notes — 100% free.',
    longDescription: 'Turn any YouTube video into a written article or study guide. Our transcript downloader fetches both manually uploaded and auto-generated captions, giving you a clean text file of the entire video narration.',
    keywords: 'youtube transcript downloader, extract text from youtube video, youtube speech to text, download youtube captions, yt transcript extractor',
    howTo: [
      'Enter the YouTube video URL.',
      'Click "Download Transcript".',
      'Copy the full text or view the timestamped segments below.'
    ]
  },
  'yt-summarize': {
    title: 'AI YouTube Summarizer — Get Video Summaries Instantly with AI',
    h1: 'AI-Powered YouTube Video Summarizer',
    h2: 'Save Time — Get the Key Points in Seconds',
    description: 'Summarize long YouTube videos instantly using AI. Get key insights, bullet points, and main takeaways without watching the whole video.',
    longDescription: 'Don\'t have time to watch a 20-minute video? Our AI Summarizer uses advanced language models to analyze transcripts and provide a concise summary of the most important information. Perfect for students and professionals.',
    keywords: 'youtube summarizer ai, summarize youtube video, ai video summary, youtube transcript summary, video to key points, time saving youtube tool',
    howTo: [
      'Paste the link of the video you want to summarize.',
      'Click "Summarize with AI".',
      'Read the structured summary with key insights and takeaways.'
    ]
  },
  'yt-monetization': {
    title: 'YouTube Monetization Checker — See if a Channel is Making Money',
    h1: 'YouTube Monetization & Ad Status Checker',
    h2: 'Verify Monetization Status of any Video',
    description: 'Check if a YouTube video or channel is monetized. See if ads are running and check for family-friendly status instantly — free online tool.',
    longDescription: 'Curious if a video is earning revenue? Our checker analyzes the video metadata and player settings to determine if ads are enabled and if the channel is part of the YouTube Partner Program.',
    keywords: 'youtube monetization checker, check if channel is monetized, is youtube video monetized, youtube ad status checker, monetization verifier',
    howTo: [
      'Paste the YouTube URL.',
      'Click "Check Status".',
      'View the monetization verdict and estimated revenue metrics.'
    ]
  },
  'yt-revenue': {
    title: 'YouTube Revenue Calculator — Estimate Earnings & CPM for Channels',
    h1: 'YouTube Earnings & Revenue Calculator',
    h2: 'Estimate Monthly and Yearly Income',
    description: 'Calculate potential earnings for any YouTube channel or video. Estimate daily, monthly, and yearly revenue based on views and average CPM/RPM rates.',
    longDescription: 'Wondering how much YouTubers make? Our calculator uses industry-standard RPM (Revenue Per Mille) estimates to project the earnings of any channel based on their public view counts.',
    keywords: 'youtube revenue calculator, estimate youtube earnings, how much does a youtuber make, youtube money calculator, yt income estimator',
    howTo: [
      'Enter a YouTube channel or video URL.',
      'Click "Calculate Revenue".',
      'Analyze the projected income brackets for daily, monthly, and yearly performance.'
    ]
  },
  'yt-seo-score': {
    title: 'YouTube SEO Audit & Score Checker — Optimize Video Rankings',
    h1: 'YouTube Video SEO Auditor',
    h2: 'Get a Score Out of 100 for your Video',
    description: 'Audit your YouTube video SEO for free. Get an instant score and professional recommendations to improve your rankings, CTR, and views.',
    longDescription: 'Is your video optimized for the YouTube algorithm? Our SEO Auditor checks your title, description, and tags against best practices to give you a clear score and actionable tips for improvement.',
    keywords: 'youtube seo audit, check youtube seo score, video ranking optimizer, youtube seo checker free, optimize youtube title and tags',
    howTo: [
      'Paste the URL of your video.',
      'Click "Audit SEO".',
      'Review your score and fix the highlighted issues to rank higher.'
    ]
  },
  'pdf-to-word': {
    title: 'PDF to Word Converter — Convert PDF to DOCX Free Online',
    h1: 'Convert PDF to Editable Word Online',
    h2: 'Accurate PDF to Word Conversion — 100% Free',
    description: 'Convert PDF documents to editable Microsoft Word (DOCX) files. Best accuracy for text, tables, and layouts without software.',
    longDescription: 'Need to edit a PDF document? Our PDF to Word converter accurately extracts text and structural elements from your PDF and converts them into a standard Microsoft Word (DOCX) format. Unlike other converters that create messy text boxes, our tool attempts to create clean, flowable text that you can edit immediately in Word, Google Docs, or LibreOffice.',
    keywords: 'pdf to word, convert pdf to docx, pdf to editable word, extract text from pdf, online pdf to word converter, free docx converter',
    features: [
      'High-precision text extraction using OCR-like logic',
      'No email or signup required – convert instantly',
      'Maintains font styles and paragraph spacing',
      'Secure processing with automatic file deletion'
    ],
    howTo: [
      'Upload the PDF file you want to convert to Word.',
      'Click the "Convert to Word" button.',
      'Our engine processes the document and generates a DOCX file.',
      'Download the editable Word document and start editing.'
    ],
    faqs: [
      { q: "Will the layout remain the same?", a: "We strive for high accuracy. While complex graphic designs may shift, text and tables are preserved faithfully." },
      { q: "Is this tool free for large files?", a: "Yes, you can convert documents up to 20MB for free." },
      { q: "Can I convert scanned PDFs?", a: "Currently, we extract embedded text. For scanned images, we recommend an OCR-specific tool." }
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
