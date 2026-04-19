/**
 * Centralized configuration for all tools in the platform.
 * This includes UI metadata, input requirements, and specific tool options.
 */

export const TOOL_CONFIGS = {
  // --- YouTube Tools ---
  'yt-thumbnail': { 
    id: 'yt-thumbnail',
    name: 'YouTube Thumbnail',
    icon: 'Image',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-tags': { 
    id: 'yt-tags',
    name: 'YouTube Tags',
    icon: 'Tag',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-transcript': { 
    id: 'yt-transcript',
    name: 'YouTube Transcript',
    icon: 'FileText',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-region': { 
    id: 'yt-region',
    name: 'Region Checker',
    icon: 'Globe',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-summarize': { 
    id: 'yt-summarize',
    name: 'AI Summarizer',
    icon: 'Sparkles',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-monetization': { 
    id: 'yt-monetization',
    name: 'Monetization Checker',
    icon: 'DollarSign',
    type: 'url', 
    acceptedInfo: 'YouTube Video or Channel URL',
    placeholder: 'https://www.youtube.com/@channel or Video URL',
    category: 'youtube'
  },
  'yt-seo-score': { 
    id: 'yt-seo-score',
    name: 'SEO Score Checker',
    icon: 'BarChart3',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },
  'yt-revenue': { 
    id: 'yt-revenue',
    name: 'Revenue Calculator',
    icon: 'PiggyBank',
    type: 'url', 
    acceptedInfo: 'YouTube Video or Channel URL',
    placeholder: 'Enter YouTube Video or Channel URL',
    category: 'youtube'
  },
  'yt-video-info': { 
    id: 'yt-video-info',
    name: 'Video Info Viewer',
    icon: 'Info',
    type: 'url', 
    acceptedInfo: 'YouTube Video URL',
    placeholder: 'https://www.youtube.com/watch?v=...',
    category: 'youtube'
  },

  // --- PDF Tools ---
  'merge-pdf': { 
    id: 'merge-pdf',
    name: 'Merge PDF',
    icon: 'Files',
    multi: true, 
    acceptedInfo: 'PDF files only',
    category: 'pdf'
  },
  'split-pdf': { 
    id: 'split-pdf',
    name: 'Split PDF',
    icon: 'Scissors',
    multi: false,
    options: [{ key: 'pages', label: 'Pages (e.g. 1-3, 5)', type: 'text' }],
    category: 'pdf'
  },
  'compress-pdf': { 
    id: 'compress-pdf',
    name: 'Compress PDF',
    icon: 'Archive',
    multi: false,
    category: 'pdf'
  },
  'rotate-pdf': { 
    id: 'rotate-pdf',
    name: 'Rotate PDF',
    icon: 'RotateCw',
    multi: false,
    options: [{ 
      key: 'angle', 
      label: 'Angle', 
      type: 'select', 
      choices: [{v:'90', l:'90°'}, {v:'180', l:'180°'}, {v:'270', l:'270°'}] 
    }],
    category: 'pdf' 
  },
  'pdf-to-word': { 
    id: 'pdf-to-word',
    name: 'PDF to Word',
    icon: 'FileText',
    multi: false,
    category: 'convert'
  },
  'pdf-to-excel': { 
    id: 'pdf-to-excel',
    name: 'PDF to Excel',
    icon: 'Table',
    multi: false,
    category: 'convert'
  },
  'jpg-to-pdf': { 
    id: 'jpg-to-pdf',
    name: 'JPG to PDF',
    icon: 'Image',
    multi: true,
    category: 'convert'
  },

  // --- Image Tools ---
  'compress-image': {
    id: 'compress-image',
    name: 'Compress Image',
    icon: 'Image',
    multi: false,
    category: 'image'
  },
  'resize-image': {
    id: 'resize-image',
    name: 'Resize Image',
    icon: 'Maximize',
    multi: false,
    category: 'image'
  }
};

export const getToolConfig = (id) => TOOL_CONFIGS[id] || { options: null, multi: false };
