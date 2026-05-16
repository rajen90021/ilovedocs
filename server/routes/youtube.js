const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const ytdl = require('@distube/ytdl-core');
const { Innertube, UniversalCache, Platform, Parser } = require('youtubei.js');

// 🛡️ Global Parser Shield: Prevent non-fatal parsing errors from crashing the app
// YouTube frequently changes UI components that youtubei.js hasn't mapped yet.
// This shield ensures these mismatches are treated as warnings, not fatal crashes.
if (Parser && !Parser.shield_active) {
  try {
    if (typeof Parser.setParserErrorHandler === 'function') {
      Parser.setParserErrorHandler((context) => {
        if (context.error_type === 'typecheck') {
          console.warn('[Parser Shield] Handled UI mismatch:', context.classname);
          return; // Skip this item and continue
        }
        if (context.error) {
          console.error('[Parser Shield] Unexpected error:', context.error.message);
        }
      });
    } else {
      // Fallback for older versions or different builds
      const originalError = Parser.ERROR_HANDLER;
      Parser.ERROR_HANDLER = (error) => {
        if (error && error.message && error.message.includes('Type mismatch')) {
          console.warn('[Parser Shield] Suppressed UI mismatch:', error.message.split('\n')[0]);
          return;
        }
        return originalError ? originalError(error) : undefined;
      };
    }
    Parser.shield_active = true;
  } catch (e) {
    console.error('[Parser Shield] Failed to initialize:', e.message);
  }
}

// ⚡ Global Engine Hardening: Use native Function constructor
// This is critical for handling YouTube's signature deciphering scripts which 
// often contain 'return' statements that standard 'eval' or 'vm' might reject.
if (Platform && Platform.shim && !Platform.shim.eval_overridden) {
  Platform.shim.eval = (data, args) => {
    try {
      const keys = Object.keys(args);
      const values = Object.values(args);
      const fn = new Function(...keys, data.output);
      return fn(...values);
    } catch (e) {
      try {
        return (new Function(data.output))();
      } catch (inner) {
        throw e;
      }
    }
  };
  Platform.shim.eval_overridden = true;
}

// ── Helper: Extract Video ID ─────────────────────────────────
function getVideoId(url) {
  if (!url) return null;
  url = url.trim();
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const regex of patterns) {
    const m = url.match(regex);
    if (m) return m[1];
  }
  return null;
}

// ── Helper: Fetch with browser-like User-Agent ───────────────
async function fetchPage(url) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0'
  ];
  const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];

  // Randomize platform for Sec-Ch-Ua
  const platforms = ['"Windows"', '"macOS"', '"Linux"'];
  const platform = platforms[Math.floor(Math.random() * platforms.length)];

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': randomUA,
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Referer': 'https://www.google.com/',
        'Sec-Ch-Ua': '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': platform,
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
        'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+412; ' // Helps bypass some consent gates
      },
      timeout: 25000,
    });

    if (data.includes('recaptcha') || data.includes('Sign in to confirm you’re not a bot')) {
       const error = new Error('YouTube Blocked (Bot Detection)');
       error.status = 403;
       throw error;
    }

    return data;
  } catch (err) {
    if (err.status === 403) throw err;
    if (err.response?.status === 429) {
      const error = new Error('YouTube Limit (Too Many Requests)');
      error.status = 429;
      throw error;
    }
    throw err;
  }
}

/**
 * Fetch video details using the InnerTube API (tries multiple clients for resilience)
 */
async function fetchVideoDetails(videoId) {
  const clients = [
    {
      name: 'WEB',
      url: 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      body: {
        context: { client: { clientName: 'WEB', clientVersion: '2.20241015.01.00', hl: 'en', gl: 'US' } },
        videoId,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
        'X-YouTube-Client-Name': '1',
        'X-YouTube-Client-Version': '2.20241015.01.00',
        'Origin': 'https://www.youtube.com',
      }
    },
    {
      name: 'ANDROID',
      url: 'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
      body: {
        context: { client: { clientName: 'ANDROID', clientVersion: '19.42.34', hl: 'en', gl: 'US' } },
        videoId,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'com.google.android.youtube/19.42.34 (Linux; U; Android 14; en_US; Pixel 8 Pro Build/AP1A.240305.019)',
        'X-YouTube-Client-Name': '3',
        'X-YouTube-Client-Version': '19.42.34',
      }
    }
  ];

  for (const client of clients) {
    try {
      const res = await axios.post(client.url, client.body, { headers: client.headers, timeout: 15000 });
      if (res.data?.playabilityStatus?.status === 'OK' || res.data?.videoDetails) {
        return res.data;
      }
    } catch (e) {
      console.error(`[fetchVideoDetails][${client.name}] Error:`, e.message);
    }
  }
  return null;
}

/**
 * Fetch channel details using InnerTube API (more robust than scraping)
 */
async function fetchChannelDetails(channelUrl) {
  try {
    let browseId = null;
    if (channelUrl.includes('/channel/')) {
      browseId = channelUrl.split('/channel/')[1].split('/')[0].split('?')[0];
    } else if (channelUrl.includes('/@')) {
      browseId = channelUrl.split('/@')[1].split('/')[0].split('?')[0];
    }

    const body = {
      context: { client: { clientName: 'WEB', clientVersion: '2.20241015.01.00', hl: 'en', gl: 'US' } },
      browseId: browseId && !browseId.startsWith('@') ? browseId : undefined,
      params: 'EghhYm91dC1tZQ%3D%3D',
    };

    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
      'X-YouTube-Client-Name': '1',
      'X-YouTube-Client-Version': '2.20241015.01.00',
    };

    const res = await axios.post('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', body, { headers, timeout: 15000 });
    const data = res.data;

    // Parse data from browse response
    const header = data.header?.c4TabbedHeaderRenderer || data.header?.pageHeaderRenderer;
    const metadata = data.metadata?.channelMetadataRenderer || {};
    
    // Extract views and subs from about tab or header
    let views = 0;
    let subs = 'N/A';
    
    // Try to find the about info in the response
    const rows = data.contents?.twoColumnBrowseResultsRenderer?.tabs?.find(t => t.tabRenderer?.content)?.tabRenderer?.content?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents?.[0]?.channelAboutMetadataRenderer;
    
    if (rows) {
      views = parseInt((rows.viewCountText?.simpleText || '0').replace(/[^0-9]/g, ''));
      subs = rows.subscriberCountText?.simpleText || 'N/A';
    } else if (header) {
      subs = header.subscriberCountText?.simpleText || 'N/A';
    }

    return {
      name: metadata.title || header?.title || 'YouTube Creator',
      views: views || 100000,
      subs: subs,
      logo: metadata.avatar?.thumbnails?.[0]?.url || header?.avatar?.thumbnails?.[0]?.url || ''
    };
  } catch (e) {
    console.error('[fetchChannelDetails] Error:', e.message);
    return null;
  }
}

// ── Helper: Safe Regex Matcher ───────────────
const safeMatch = (html, regex, index = 1, fallback = 'Unknown') => {
  try {
    const m = html.match(regex);
    return m ? m[index] : fallback;
  } catch (e) { return fallback; }
};

// ── Helper: Fetch YouTube transcript (tries multiple methods) ────────
async function fetchTranscript(videoId) {
  try {
    // Method 0: Innertube (most robust)
    const yt = await Innertube.create({ 
      cache: new UniversalCache(false), 
      generate_session_locally: true,
      client_type: 'ANDROID'
    });
    
    const info = await yt.getInfo(videoId, { client: 'ANDROID' });
    try {
      const transcriptData = await info.getTranscript();
      if (transcriptData && transcriptData.transcript?.content?.body?.initial_segments) {
        return transcriptData.transcript.content.body.initial_segments.map(s => ({
          text: s.snippet?.text || '',
          offset: parseInt(s.start_ms || '0'),
          duration: parseInt(s.duration_ms || '0')
        })).filter(s => s.text);
      }
    } catch (tErr) {
      console.warn('[fetchTranscript][Innertube] Failed:', tErr.message);
    }

    // Method 1: Manual InnerTube API fallbacks
    const clients = [
      {
        name: 'WEB',
        body: { context: { client: { clientName: 'WEB', clientVersion: '2.20241015.01.00', hl: 'en', gl: 'US' } }, videoId },
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' }
      },
      {
        name: 'ANDROID',
        body: { context: { client: { clientName: 'ANDROID', clientVersion: '19.42.34', hl: 'en', gl: 'US' } }, videoId },
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'com.google.android.youtube/19.42.34' }
      }
    ];

    for (const client of clients) {
      try {
        const res = await axios.post('https://www.youtube.com/youtubei/v1/player', client.body, { headers: client.headers, timeout: 10000 });
        const tracks = res.data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
        if (!tracks || tracks.length === 0) continue;

        const track = tracks.find(t => t.languageCode === 'en' && !t.kind) || tracks[0];
        if (!track || !track.baseUrl) continue;

        const captionRes = await axios.get(track.baseUrl, { timeout: 10000 });
        const xml = captionRes.data;
        const segments = [];
        const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
        let m;
        while ((m = regex.exec(xml)) !== null) {
          const text = m[3].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
          if (text) segments.push({ text, offset: parseFloat(m[1]) * 1000, duration: parseFloat(m[2]) * 1000 });
        }
        if (segments.length > 0) return segments;
      } catch (e) {}
    }
  } catch (err) {
    console.error('[fetchTranscript] Critical Error:', err.message);
  }
  return null;
}


// ═══════════════════════════════════════════════════════════
// 1. THUMBNAIL DOWNLOADER
// ═══════════════════════════════════════════════════════════
router.post('/thumbnail', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });

    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL. Use a link like: https://youtube.com/watch?v=VIDEO_ID' });

    const thumbnails = {
      maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      hq: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      mq: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
      sd: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
      default: `https://img.youtube.com/vi/${videoId}/default.jpg`,
    };

    res.json({ videoId, thumbnails });
  } catch (err) {
    console.error('[thumbnail]', err.message);
    res.status(500).json({ error: 'Failed to fetch thumbnails.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 2. TAGS & SEO EXTRACTOR
// ═══════════════════════════════════════════════════════════
// 2. TAGS & SEO EXTRACTOR
// ═══════════════════════════════════════════════════════════
router.post('/tags', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    // Use Player API (Hardened against blocks)
    const details = await fetchVideoDetails(videoId);
    if (!details) throw new Error('Could not fetch video metadata');

    const videoDetails = details.videoDetails || {};
    const title = videoDetails.title || 'YouTube Video';
    let tags = videoDetails.keywords || [];

    // Fallback if tags missing from API (rare)
    if (tags.length === 0) {
      try {
        const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);
        const kwMatch = html.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
        if (kwMatch) {
          tags = (kwMatch[1].match(/"([^"]+)"/g) || []).map(t => t.replace(/"/g, '').trim()).filter(Boolean);
        }
      } catch (e) {}
    }

    res.json({ videoId, title, tags: [...new Set(tags)] });
  } catch (err) {
    console.error('[tags]', err.message);
    const status = err.status || 500;
    res.status(status).json({ 
      error: err.message || 'Failed to extract tags.',
      isSecurityLimit: status === 403 || status === 429
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 3. TRANSCRIPT DOWNLOADER
// ═══════════════════════════════════════════════════════════
router.post('/transcript', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const segments = await fetchTranscript(videoId);
    if (!segments) {
      return res.status(400).json({ error: 'Transcript unavailable. This video may not have captions enabled.' });
    }

    const fullText = segments.map(s => s.text).join(' ').replace(/\s+/g, ' ').trim();
    res.json({ videoId, fullText, segments, wordCount: fullText.split(' ').length });
  } catch (err) {
    console.error('[transcript]', err.message);
    res.status(500).json({ error: 'Failed to fetch transcript.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 4. REGION CHECKER
// ═══════════════════════════════════════════════════════════
// 4. REGION CHECKER
// ═══════════════════════════════════════════════════════════
router.post('/region-check', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const details = await fetchVideoDetails(videoId);
    if (!details) throw new Error('Restriction data fetch failed');

    const status = details.playabilityStatus || {};
    const microformat = details.microformat?.playerMicroformatRenderer || {};
    
    // Extract restrictions from microformat or playabilityStatus
    let restrictions = { allowed: [], blocked: [] };
    let restricted = false;

    if (microformat.isUnlisted && status.status === 'UNPLAYABLE') {
       restricted = true; // Often used for region blocks
    }

    // Direct extraction from playability status if available
    if (status.errorScreen?.playerErrorMessageRenderer?.reason?.simpleText?.includes('country')) {
       restricted = true;
    }

    res.json({ 
      videoId, 
      restricted, 
      restrictions, 
      availableWorldwide: !restricted,
      reason: status.errorScreen?.playerErrorMessageRenderer?.reason?.simpleText || 'Public'
    });
  } catch (err) {
    console.error('[region-check]', err.message);
    const status = err.status || 500;
    res.status(status).json({ 
      error: err.message || 'Failed to check region restrictions.',
      isSecurityLimit: status === 403 || status === 429
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 5. AI VIDEO SUMMARIZER
// ═══════════════════════════════════════════════════════════
router.post('/summarize', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    let contentToSummarize = '';
    let source = 'transcript';

    // ── Attempt 1: Fetch Transcript ──
    const segments = await fetchTranscript(videoId);
    if (segments && segments.length > 0) {
      contentToSummarize = segments.map(s => s.text).join(' ').trim();
    } else {
      // ── Attempt 2: Fallback to Description ──
      const details = await fetchVideoDetails(videoId);
      const description = details?.videoDetails?.shortDescription || '';
      
      if (description.length > 150) {
        contentToSummarize = description;
        source = 'description';
      } else {
        return res.status(400).json({ 
          error: 'Captions Not Found',
          message: 'This video does not have transcripts enabled and the description is too short to summarize. Please try a video with Closed Captions (CC) or a longer description.'
        });
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Simple extractive summary if no AI key
      const summary = contentToSummarize.substring(0, 500) + '...';
      return res.json({ videoId, summary, aiPowered: false, source });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Summarize this YouTube video ${source} in a clear, professional, and structured format.
    Use bold headers and bullet points. Focus on key insights and takeaways.
    
    ${source === 'description' ? '(Note: This summary is based on the video description as no transcript was available)' : ''}

    Content:
    ${contentToSummarize.substring(0, 15000)}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    
    res.json({ videoId, summary, aiPowered: true, source });
  } catch (err) {
    console.error('[summarize]', err.message);
    res.status(500).json({ error: 'Summarization failed. Please try again.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 6. MONETIZATION CHECKER
// ═══════════════════════════════════════════════════════════
// 6. MONETIZATION CHECKER
// ═══════════════════════════════════════════════════════════
router.post('/monetization-check', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    // Use Player API (Robust against blocks)
    const details = await fetchVideoDetails(videoId);
    if (!details) throw new Error('Monetization metadata fetch failed');

    const videoDetails = details.videoDetails || {};
    const microformat = details.microformat?.playerMicroformatRenderer || {};
    
    // Robust Monetization Detection Logic
    const monetized = details.adPlacementRenderer || 
                     details.monetizationSettings?.allowedAds || 
                     JSON.stringify(details).includes('yt_ad_');
    
    const views = parseInt(videoDetails.viewCount || 0);
    const isFamilyFriendly = !details.playabilityStatus?.status?.includes('UNPLAYABLE') && !JSON.stringify(details).includes('FAMILY_FRIENDLY_FALSE');

    // Revenue Projections
    const estMin = ((views / 1000) * 1.5).toFixed(2);
    const estMax = ((views / 1000) * 4.5).toFixed(2);

    res.json({
      videoId,
      monetized: !!monetized,
      title: videoDetails.title || 'YouTube Video',
      channelName: videoDetails.author || 'Unknown Creator',
      channelHandle: microformat.ownerProfileUrl ? ('@' + microformat.ownerProfileUrl.split('/@')[1]) : 'Public Channel',
      channelLogo: microformat.thumbnail?.thumbnails?.[0]?.url || '',
      subscriberCount: 'N/A (Use Channel Tool)',
      viewCount: views.toLocaleString(),
      estimatedEarnings: views > 1000 ? `$${estMin} - $${estMax}` : '$0.00',
      publishDate: microformat.publishDate ? new Date(microformat.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
      familyFriendly: isFamilyFriendly,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[monetization-check]', err.message);
    const status = err.status || 500;
    res.status(status).json({ 
      error: err.message || 'Monetization check failed.',
      isSecurityLimit: status === 403 || status === 429
    });
  }
});

// [DELETED OLD VIDEO-INFO ROUTE TO PREVENT CONFLICT WITH THE NEW QUALITY-AWARE VERSION]

// ═══════════════════════════════════════════════════════════
// 8. SEO SCORE CHECKER
// ═══════════════════════════════════════════════════════════
// 8. SEO SCORE CHECKER
// ═══════════════════════════════════════════════════════════
router.post('/seo-score', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const details = await fetchVideoDetails(videoId);
    if (!details) throw new Error('SEO data fetch failed');

    const videoDetails = details.videoDetails || {};
    const title = videoDetails.title || '';
    const description = videoDetails.shortDescription || '';
    const tags = videoDetails.keywords || [];

    // Scoring Algorithm (0-100)
    let score = 0;
    const auditDetails = [];

    // 1. Title Score (25 pts)
    const titleLen = title.length;
    if (titleLen >= 30 && titleLen <= 70) {
      score += 25;
      auditDetails.push({ label: 'Title Length', status: 'perfect', text: 'Excellent! Your title length is optimized for search (30-70 chars).' });
    } else if (titleLen > 0) {
      score += 15;
      auditDetails.push({ label: 'Title Length', status: 'warning', text: 'Your title could be more descriptive. Aim for 30-70 characters.' });
    }

    // 2. Tags Score (25 pts)
    const tagCount = tags.length;
    if (tagCount >= 15) {
      score += 25;
      auditDetails.push({ label: 'Tag Count', status: 'perfect', text: `${tagCount} tags found. Great job using many relevant tags!` });
    } else if (tagCount >= 5) {
      score += 15;
      auditDetails.push({ label: 'Tag Count', status: 'warning', text: `Only ${tagCount} tags found. Adding more tags helps YouTube categorize your video.` });
    } else {
      auditDetails.push({ label: 'Tag Count', status: 'danger', text: 'No hidden tags found. This limits your video discoverability.' });
    }

    // 3. Description Score (25 pts)
    const descLen = description.length;
    if (descLen > 500) {
      score += 25;
      auditDetails.push({ label: 'Description Richness', status: 'perfect', text: 'Rich description! You provided plenty of context for search engines.' });
    } else if (descLen > 100) {
      score += 15;
      auditDetails.push({ label: 'Description Richness', status: 'warning', text: 'Your description is a bit short. Add more keywords and info.' });
    }

    // 4. Keyword Synergy (25 pts)
    const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const keywordMatchCount = titleWords.filter(w => description.toLowerCase().includes(w)).length;
    if (keywordMatchCount >= 3) {
      score += 25;
      auditDetails.push({ label: 'Keyword Synergy', status: 'perfect', text: 'High synergy! Your title keywords are well-distributed in the description.' });
    } else if (keywordMatchCount > 0) {
      score += 10;
      auditDetails.push({ label: 'Keyword Synergy', status: 'warning', text: 'Weak synergy. Try including more title keywords in the first 2 lines of description.' });
    }

    res.json({
      videoId,
      title,
      score,
      details: auditDetails,
      recommendation: score > 80 ? 'Excellent SEO! Your video is highly optimized.' : 'Needs Improvement. Focus on adding more descriptive tags and expanding your description.',
    });

  } catch (err) {
    console.error('[seo-score]', err.message);
    const status = err.status || 500;
    res.status(status).json({ 
      error: err.message || 'SEO scoring failed.',
      isSecurityLimit: status === 403 || status === 429
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 9. REVENUE CALCULATOR
// ═══════════════════════════════════════════════════════════
router.post('/revenue-calculator', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'YouTube URL is required' });

    const isChannel = url.includes('/@') || url.includes('/channel/') || url.includes('/c/');
    const videoId = !isChannel ? getVideoId(url) : null;

    let name = 'YouTube Creator';
    let totalViews = 100000;
    let subs = 'N/A';
    let logo = '';

    if (videoId) {
      // ── Video Mode (Player API) ──
      const details = await fetchVideoDetails(videoId);
      if (details) {
        const videoDetails = details.videoDetails || {};
        name = videoDetails.title || name;
        totalViews = parseInt(videoDetails.viewCount || 100000);
        logo = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        subs = videoDetails.author || 'YouTube Creator';
      } else {
        throw new Error('Could not fetch video data. YouTube may be temporarily restricting access.');
      }
    } else {
      // ── Channel Mode (Use Browse API) ──
      const details = await fetchChannelDetails(url);
      if (details) {
        name = details.name;
        totalViews = details.views;
        subs = details.subs;
        logo = details.logo;
      } else {
        // Fallback Scrape (Last resort)
        try {
          const html = await fetchPage(url.includes('/about') ? url : `${url.split('?')[0]}/about`);
          name = safeMatch(html, /<title>(.*?) - YouTube<\/title>/, 1, 'YouTube Creator').trim();
          const viewMatch = html.match(/"viewCountText":\s*\{"simpleText":"([\d,]+) views"\}/);
          if (viewMatch) totalViews = parseInt(viewMatch[1].replace(/,/g, ''));
          const subMatch = html.match(/"subscriberCountText":\s*\{[^}]*?"simpleText":"([^"]+)"\}/);
          if (subMatch) subs = subMatch[1];
        } catch (e) {
          console.warn('[revenue-calc] All methods failed');
        }
      }
    }

    // Calculation Method
    const rpmMin = 1.20;
    const rpmMax = 5.00;

    const calculateEarnings = (v) => ({
      daily: { min: ((v / 365 / 1000) * rpmMin).toFixed(2), max: ((v / 365 / 1000) * rpmMax).toFixed(2) },
      monthly: { min: ((v / 12 / 1000) * rpmMin).toFixed(2), max: ((v / 12 / 1000) * rpmMax).toFixed(2) },
      yearly: { min: ((v / 1000) * rpmMin).toFixed(2), max: ((v / 1000) * rpmMax).toFixed(2) }
    });

    const performanceViews = isChannel ? (totalViews * 0.15) : totalViews;
    const projections = calculateEarnings(performanceViews);

    res.json({
      type: isChannel ? 'channel' : 'video',
      name,
      logo,
      subs,
      totalViews: totalViews.toLocaleString(),
      projections,
      avgRpm: `$${rpmMin} - $${rpmMax}`,
      verifiedAt: new Date().toISOString()
    });

  } catch (err) {
    console.error('[revenue-calculator]', err.message);
    const status = err.status || 500;
    res.status(status).json({ 
      error: err.message || 'Revenue calculation failed.',
      isSecurityLimit: status === 403 || status === 429
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 10. YT TO STRUCTURED DOC (WORD)
// ═══════════════════════════════════════════════════════════
router.post('/to-doc', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const details = await fetchVideoDetails(videoId);
    const transcript = await fetchTranscript(videoId);
    
    if (!transcript) return res.status(400).json({ error: 'Transcript unavailable for this video.' });

    const title = details?.videoDetails?.title || 'YouTube Video Transcript';
    const channel = details?.videoDetails?.author || 'YouTube Creator';

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: title,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Channel: ${channel}`,
            heading: HeadingLevel.HEADING_3,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `Source: https://youtube.com/watch?v=${videoId}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
          ...transcript.map(s => new Paragraph({
            children: [
              new TextRun({ text: `[${new Date(s.offset).toISOString().substr(11, 8)}] `, bold: true }),
              new TextRun(s.text),
            ],
            spacing: { after: 200 },
          })),
        ],
      }],
    });

    const buffer = await Packer.toBuffer(doc);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=yt_transcript_${videoId}.docx`);
    res.send(buffer);
  } catch (err) {
    console.error('[to-doc]', err.message);
    res.status(500).json({ error: 'Failed to generate Word document.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 11. YT TO PDF
// ═══════════════════════════════════════════════════════════
router.post('/to-pdf', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const transcript = await fetchTranscript(videoId);
    if (!transcript) return res.status(400).json({ error: 'Transcript unavailable for this video.' });

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let page = pdfDoc.addPage([600, 800]);
    let { width, height } = page.getSize();
    let y = height - 50;

    page.drawText('YouTube Video Transcript', { x: 50, y, size: 20, font: boldFont });
    y -= 30;
    page.drawText(`Video ID: ${videoId}`, { x: 50, y, size: 10, font });
    y -= 40;

    const fullText = transcript.map(s => s.text).join(' ');
    const words = fullText.split(' ');
    let line = '';

    for (const word of words) {
      if (y < 50) {
        page = pdfDoc.addPage([600, 800]);
        y = height - 50;
      }

      const testLine = line + word + ' ';
      const lineWidth = font.widthOfTextAtSize(testLine, 11);
      
      if (lineWidth > width - 100) {
        page.drawText(line, { x: 50, y, size: 11, font });
        line = word + ' ';
        y -= 15;
      } else {
        line = testLine;
      }
    }
    page.drawText(line, { x: 50, y, size: 11, font });

    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=yt_transcript_${videoId}.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error('[to-pdf]', err.message);
    res.status(500).json({ error: 'Failed to generate PDF.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 12. YT TO MARKDOWN
// ═══════════════════════════════════════════════════════════
router.post('/to-markdown', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const details = await fetchVideoDetails(videoId);
    const transcript = await fetchTranscript(videoId);
    if (!transcript) return res.status(400).json({ error: 'Transcript unavailable.' });

    const title = details?.videoDetails?.title || 'YouTube Video';
    const channel = details?.videoDetails?.author || 'Creator';

    let md = `# ${title}\n\n`;
    md += `**Channel:** ${channel}\n`;
    md += `**Source:** [Watch on YouTube](https://youtube.com/watch?v=${videoId})\n\n`;
    md += `## Transcript\n\n`;
    
    transcript.forEach(s => {
      const time = new Date(s.offset).toISOString().substr(11, 8);
      md += `**[${time}]** ${s.text}\n\n`;
    });

    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename=yt_transcript_${videoId}.md`);
    res.send(Buffer.from(md));
  } catch (err) {
    console.error('[to-markdown]', err.message);
    res.status(500).json({ error: 'Failed to generate Markdown.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 13. VIDEO DOWNLOAD (Innertube Engine)
// ═══════════════════════════════════════════════════════════
router.post('/download-video', async (req, res) => {
  try {
    const { url, itag } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    console.log(`[Innertube] Processing Video: ${videoId} (itag: ${itag || 'best'})`);

    const yt = await Innertube.create({ 
      cache: new UniversalCache(false), 
      generate_session_locally: true,
      client_type: 'ANDROID'
    });

    let info;
    try {
      info = await yt.getInfo(videoId, { client: 'ANDROID' });
    } catch (infoErr) {
      console.warn('[Innertube] getInfo (download) failed, falling back to getBasicInfo:', infoErr.message);
      info = await yt.getBasicInfo(videoId, { client: 'ANDROID' });
    }
    
    // Explicitly find the format by itag if provided
    let format;
    let downloadOptions;

    if (itag) {
      const itagInt = parseInt(itag);
      const allFormats = [
        ...(info.streaming_data?.formats || []),
        ...(info.streaming_data?.adaptive_formats || [])
      ];
      format = allFormats.find(f => Number(f.itag) === itagInt);
      downloadOptions = { itag: itagInt, client: 'ANDROID' };
      console.log(`[Innertube] Selected Format: itag=${itagInt}, quality=${format?.quality_label || 'best'}`);
    }

    if (!format) {
      // Fallback or default
      downloadOptions = { type: 'video+audio', quality: 'best', format: 'mp4', client: 'ANDROID' };
      format = info.chooseFormat(downloadOptions);
    }

    if (!format) throw new Error('Requested video quality not found or restricted.');

    const cleanTitle = (info.basic_info.title || 'video').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle}.mp4"`);
    if (format.content_length) {
      res.setHeader('Content-Length', format.content_length);
    }

    const webStream = await info.download(downloadOptions);

    const { Readable } = require('stream');
    const nodeStream = Readable.fromWeb(webStream);

    nodeStream.on('error', (err) => {
      console.error('Stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Streaming failed',
          message: err.message
        });
      }
    });

    nodeStream.pipe(res);

  } catch (err) {
    const logMsg = `[Innertube] Video Error: ${err.message}\nStack: ${err.stack}\n`;
    console.error(logMsg);
    // Log to a file for easier debugging in the routes folder
    require('fs').appendFileSync(require('path').join(__dirname, 'youtube_debug.log'), logMsg);
    
    res.status(500).json({ 
      error: 'Processing Failed',
      message: err.message.includes('403') ? 'YouTube is currently restricting access to this video.' : err.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 14. AUDIO EXTRACT (Innertube Engine)
// ═══════════════════════════════════════════════════════════
router.post('/extract-audio', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    console.log(`[Innertube] Processing Audio: ${videoId}`);

    const yt = await Innertube.create({ 
      cache: new UniversalCache(false), 
      generate_session_locally: true,
      client_type: 'ANDROID'
    });

    let info;
    try {
      info = await yt.getInfo(videoId, { client: 'ANDROID' });
    } catch (infoErr) {
      console.warn('[Innertube] getInfo (audio) failed, falling back to getBasicInfo:', infoErr.message);
      info = await yt.getBasicInfo(videoId, { client: 'ANDROID' });
    }
    const allFormats = [
      ...(info.streaming_data?.formats || []),
      ...(info.streaming_data?.adaptive_formats || [])
    ];
    
    // Filter for audio-only formats and sort by bitrate
    const audioFormats = allFormats
      .filter(f => !f.has_video && f.has_audio)
      .sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
    
    const format = audioFormats[0] || info.chooseFormat({ type: 'audio', quality: 'best', client: 'ANDROID' });

    if (!format) throw new Error('No audio streams found.');

    const cleanTitle = (info.basic_info.title || 'audio').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Correct mime and extension detection
    const mimeType = format.mime_type?.split(';')[0] || 'audio/mpeg';
    const extension = mimeType.includes('mp4') || mimeType.includes('m4a') ? 'm4a' : 'webm';

    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${cleanTitle}.${extension}"`);
    if (format.content_length) {
      res.setHeader('Content-Length', format.content_length);
    }

    console.log(`[Innertube] Downloading Audio: itag=${format.itag}, bitrate=${format.bitrate}, mime=${mimeType}`);

    const webStream = await info.download({ itag: format.itag, client: 'ANDROID' });

    const { Readable } = require('stream');
    const nodeStream = Readable.fromWeb(webStream);

    nodeStream.on('error', (err) => {
      console.error('[Innertube] Audio Stream Error:', err.message);
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Streaming failed',
          message: err.message
        });
      }
    });

    nodeStream.pipe(res);

  } catch (err) {
    const logMsg = `[Innertube] Audio Error: ${err.message}\nStack: ${err.stack}\n`;
    console.error(logMsg);
    require('fs').appendFileSync(require('path').join(__dirname, 'youtube_debug.log'), logMsg);

    res.status(500).json({ 
      error: 'Extraction Failed',
      message: err.message
    });
  }
});

// ═══════════════════════════════════════════════════════════
// 15. GET VIDEO INFO (Innertube Engine)
// ═══════════════════════════════════════════════════════════
router.post('/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const yt = await Innertube.create({ 
      cache: new UniversalCache(false), 
      generate_session_locally: true,
      client_type: 'ANDROID'
    });

    let info;
    try {
      info = await yt.getInfo(videoId, { client: 'ANDROID' });
    } catch (infoErr) {
      console.warn('[Innertube] getInfo failed, falling back to getBasicInfo:', infoErr.message);
      info = await yt.getBasicInfo(videoId, { client: 'ANDROID' });
    }
    
    // Extract available formats (only those with a valid URL or cipher)
    const formats = (info.streaming_data?.formats || [])
      .concat(info.streaming_data?.adaptive_formats || [])
      .filter(f => f.url || f.signature_cipher);
    
    const availableQualities = formats
      .filter(f => f.has_video)
      .map(f => ({
        itag: f.itag,
        quality: f.quality_label || f.quality,
        container: f.mime_type.split(';')[0].split('/')[1],
        hasAudio: f.has_audio,
        size: f.content_length ? (parseInt(f.content_length) / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown',
        fps: f.fps
      }))
      // Filter out duplicates and sort by quality
      .sort((a, b) => {
        const qA = parseInt(a.quality) || 0;
        const qB = parseInt(b.quality) || 0;
        return qB - qA;
      });

    res.json({
      title: info.basic_info.title,
      thumbnail: info.basic_info.thumbnail?.[0]?.url || '',
      duration: (() => {
        const s = info.basic_info.duration || 0;
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const rs = s % 60;
        return [h, m, rs].map(v => v.toString().padStart(2, '0')).filter((v, i) => v !== '00' || i > 0).join(':');
      })(),
      channel: info.basic_info.author,
      views: info.basic_info.view_count?.toLocaleString() || '0',
      publishDate: info.basic_info.publish_date,
      category: info.basic_info.category,
      description: info.basic_info.short_description || '',
      qualities: availableQualities
    });

  } catch (err) {
    console.error('[Innertube] Info Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch video info' });
  }
});

module.exports = router;
