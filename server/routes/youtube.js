const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
  const { data } = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    },
    timeout: 20000,
  });
  return data;
}

// ── Helper: Fetch YouTube transcript (tries multiple methods) ────────
async function fetchTranscript(videoId) {
  // Method 1: InnerTube WEB client (most reliable for captions)
  const clients = [
    {
      name: 'WEB',
      body: {
        context: {
          client: {
            clientName: 'WEB',
            clientVersion: '2.20240726.00.00',
            hl: 'en',
          },
        },
        videoId,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'X-YouTube-Client-Name': '1',
        'X-YouTube-Client-Version': '2.20240726.00.00',
        'Origin': 'https://www.youtube.com',
        'Referer': `https://www.youtube.com/watch?v=${videoId}`,
      },
    },
    {
      name: 'TVHTML5',
      body: {
        context: {
          client: {
            clientName: 'TVHTML5',
            clientVersion: '7.20240726.19.00',
            hl: 'en',
          },
        },
        videoId,
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (SMART-TV; Linux; Tizen 5.0)',
        'X-YouTube-Client-Name': '7',
        'X-YouTube-Client-Version': '7.20240726.19.00',
      },
    },
  ];

  for (const client of clients) {
    try {
      const res = await axios.post(
        'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
        client.body,
        { headers: client.headers, timeout: 20000 }
      );

      const tracks = res.data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;
      if (!tracks || tracks.length === 0) continue;

      // Prefer English, then auto-generated (asr), then first available
      const track =
        tracks.find(t => t.languageCode === 'en' && !t.kind) ||
        tracks.find(t => t.languageCode === 'en') ||
        tracks.find(t => !t.kind) ||
        tracks[0];

      const captionUrl = track.baseUrl;
      const captionRes = await axios.get(captionUrl, { timeout: 15000 });
      const xml = captionRes.data;

      // Parse segments from XML
      const segments = [];
      const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
      let m;
      while ((m = regex.exec(xml)) !== null) {
        const text = m[3]
          .replace(/<[^>]+>/g, '')
          .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&apos;/g, "'")
          .replace(/&#\d+;/g, c => String.fromCharCode(parseInt(c.match(/\d+/)[0])))
          .trim();
        if (text) segments.push({ text, offset: parseFloat(m[1]) * 1000, duration: parseFloat(m[2]) * 1000 });
      }

      if (segments.length > 0) return segments;
    } catch (e) {
      console.error(`[fetchTranscript][${client.name}]`, e.message);
    }
  }

  // Method 2: Scrape caption URL from the HTML page
  try {
    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);
    const captionTrackMatch = html.match(/"captionTracks":\s*\[({[^[]*?"baseUrl":"([^"]+)")/);
    if (captionTrackMatch) {
      const captionUrl = captionTrackMatch[2].replace(/\\u0026/g, '&');
      const captionRes = await axios.get(captionUrl, { timeout: 15000 });
      const segments = [];
      const regex = /<text start="([^"]*)" dur="([^"]*)"[^>]*>([\s\S]*?)<\/text>/g;
      let m;
      while ((m = regex.exec(captionRes.data)) !== null) {
        const text = m[3].replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').trim();
        if (text) segments.push({ text, offset: parseFloat(m[1]) * 1000, duration: parseFloat(m[2]) * 1000 });
      }
      if (segments.length > 0) return segments;
    }
  } catch (e) {
    console.error('[fetchTranscript][HTML-fallback]', e.message);
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
router.post('/tags', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);

    const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : 'Unknown Title';

    let tags = [];

    // Main: extract keywords array from the page JSON
    const kwMatch = html.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
    if (kwMatch) {
      tags = (kwMatch[1].match(/"([^"]+)"/g) || []).map(t => t.replace(/"/g, '').trim()).filter(Boolean);
    }

    // Fallback: meta description hashtags
    if (tags.length === 0) {
      const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
      if (descMatch) {
        const hashtags = descMatch[1].match(/#\w+/g);
        if (hashtags) tags = hashtags.map(h => h.slice(1));
      }
    }

    res.json({ videoId, title, tags: [...new Set(tags)] });
  } catch (err) {
    console.error('[tags]', err.message);
    res.status(500).json({ error: 'Failed to extract tags. The video may be private.' });
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
router.post('/region-check', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);

    let restrictions = { allowed: [], blocked: [] };
    let restricted = false;

    const restrictionMatch = html.match(/"regionRestriction"\s*:\s*(\{[^}]+\})/);
    if (restrictionMatch) {
      try {
        const raw = restrictionMatch[1];
        const allowedMatch = raw.match(/"allowed"\s*:\s*\[([^\]]+)\]/);
        const blockedMatch = raw.match(/"blocked"\s*:\s*\[([^\]]+)\]/);
        if (allowedMatch) restrictions.allowed = (allowedMatch[1].match(/"([^"]+)"/g) || []).map(c => c.replace(/"/g, ''));
        if (blockedMatch) restrictions.blocked = (blockedMatch[1].match(/"([^"]+)"/g) || []).map(c => c.replace(/"/g, ''));
        restricted = restrictions.allowed.length > 0 || restrictions.blocked.length > 0;
      } catch (e) {}
    }

    res.json({ videoId, restricted, restrictions, availableWorldwide: !restricted });
  } catch (err) {
    console.error('[region-check]', err.message);
    res.status(500).json({ error: 'Failed to check region restrictions.' });
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

    const segments = await fetchTranscript(videoId);
    if (!segments) {
      return res.status(400).json({ error: 'Cannot summarize: no captions found for this video.' });
    }

    const fullText = segments.map(s => s.text).join(' ').trim();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Extractive fallback
      const sentences = fullText.split(/[.!?]/).filter(s => s.trim().length > 40).slice(0, 8);
      const summary = '**Key Points (Auto-extracted):**\n\n' + sentences.map(s => `• ${s.trim()}`).join('\n');
      return res.json({ videoId, summary, aiPowered: false });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Summarize this YouTube video transcript in a clear, structured format:

**📋 Overview**
[Brief 2-3 sentence overview]

**🎯 Key Points**
• [Key insight 1]
• [Key insight 2]
• [etc...]

**💡 Takeaways**
[2-3 actionable takeaways]

Transcript:
${fullText.substring(0, 14000)}`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    res.json({ videoId, summary, aiPowered: true });
  } catch (err) {
    console.error('[summarize]', err.message);
    res.status(500).json({ error: 'Summarization failed. Please try again.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 6. MONETIZATION CHECKER
// ═══════════════════════════════════════════════════════════
router.post('/monetization-check', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);

    const monetized = html.includes('"adPlacements"') || html.includes('"playerAdParams"') || html.includes('"adBreakHeartbeatParams"');
    const isFamilyFriendly = !html.includes('"ytAgeGate"') && !html.includes('"contentRating":{');
    const isLive = html.includes('"isLiveContent":true');

    const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
    const titleVal = titleMatch ? titleMatch[1].trim() : 'Unknown Title';

    const channelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
    const viewMatch = html.match(/"viewCount":"(\d+)"/);
    const views = viewMatch ? parseInt(viewMatch[1]) : 0;
    const publishMatch = html.match(/"publishDate":"([^"]+)"/);

    // Advanced Extraction: Subscribers and Logo
    let subscriberCount = 'N/A';
    const subMatch = html.match(/"subscriberCountText":\s*\{[^}]*?"simpleText":"([^"]+)"\}/) || html.match(/"label":"([^"]+)\s+subscribers"/);
    if (subMatch) subscriberCount = subMatch[1];

    let channelLogo = '';
    const logoMatch = html.match(/"avatar":\s*\{"thumbnails":\s*\[\{"url":"([^"]+)"/);
    if (logoMatch) channelLogo = logoMatch[1].replace(/\\u0026/g, '&');

    let channelHandle = '';
    const handleMatch = html.match(/"canonicalBaseUrl":"\/(@[^"]+)"/);
    if (handleMatch) channelHandle = handleMatch[1];

    // Estimated Revenue Calculation (Simplified: $1.5 - $4.0 CPM average)
    // Formula: (Views / 1000) * Avg CPM
    const estMin = ((views / 1000) * 1.5).toFixed(2);
    const estMax = ((views / 1000) * 4.0).toFixed(2);
    const estimatedEarnings = views > 1000 ? `$${estMin} - $${estMax}` : '$0.00';

    res.json({
      videoId,
      monetized,
      title: titleVal,
      channelName: channelMatch ? channelMatch[1] : 'Unknown',
      channelHandle,
      channelLogo,
      subscriberCount,
      viewCount: views.toLocaleString(),
      estimatedEarnings,
      publishDate: publishMatch ? new Date(publishMatch[1]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
      familyFriendly: isFamilyFriendly,
      isLive,
      verifiedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[monetization-check]', err.message);
    res.status(500).json({ error: 'Monetization check failed.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 7. VIDEO INFO VIEWER
// ═══════════════════════════════════════════════════════════
router.post('/video-info', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);

    const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
    const channelMatch = html.match(/"ownerChannelName":"([^"]+)"/);
    const channelIdMatch = html.match(/"channelId":"([^"]+)"/);
    const viewMatch = html.match(/"viewCount":"(\d+)"/);
    const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    const categoryMatch = html.match(/"category":"([^"]+)"/);
    const publishMatch = html.match(/"publishDate":"([^"]+)"/);
    const durationMatch = html.match(/"approxDurationMs":"(\d+)"/);
    const isPrivate = html.includes('"CONTENT_CHECK_REQUIRED"') || html.includes('"VIDEO_PRIVATE"');

    const durationMs = durationMatch ? parseInt(durationMatch[1]) : 0;
    const mins = Math.floor(durationMs / 60000);
    const secs = String(Math.floor((durationMs % 60000) / 1000)).padStart(2, '0');

    res.json({
      videoId,
      title: titleMatch ? titleMatch[1].trim() : 'Unknown',
      channel: channelMatch ? channelMatch[1] : 'Unknown',
      channelId: channelIdMatch ? channelIdMatch[1] : null,
      views: viewMatch ? parseInt(viewMatch[1]).toLocaleString() : 'N/A',
      description: descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"').substring(0, 500) : '',
      category: categoryMatch ? categoryMatch[1] : 'N/A',
      publishDate: publishMatch ? new Date(publishMatch[1]).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
      duration: durationMs ? `${mins}:${secs}` : 'N/A',
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      isPrivate,
    });
  } catch (err) {
    console.error('[video-info]', err.message);
    res.status(500).json({ error: 'Failed to fetch video info.' });
  }
});

// ═══════════════════════════════════════════════════════════
// 8. SEO SCORE CHECKER
// ═══════════════════════════════════════════════════════════
router.post('/seo-score', async (req, res) => {
  try {
    const { url } = req.body;
    const videoId = getVideoId(url);
    if (!videoId) return res.status(400).json({ error: 'Invalid YouTube URL' });

    const html = await fetchPage(`https://www.youtube.com/watch?v=${videoId}`);

    // Data Extraction
    const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
    const title = titleMatch ? titleMatch[1].trim() : '';

    const descMatch = html.match(/"shortDescription":"((?:[^"\\]|\\.)*)"/);
    const description = descMatch ? descMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"') : '';

    let tags = [];
    const kwMatch = html.match(/"keywords"\s*:\s*\[([^\]]+)\]/);
    if (kwMatch) {
      tags = (kwMatch[1].match(/"([^"]+)"/g) || []).map(t => t.replace(/"/g, '').trim()).filter(Boolean);
    }

    // Scoring Algorithm (0-100)
    let score = 0;
    const details = [];

    // 1. Title Score (25 pts)
    const titleLen = title.length;
    if (titleLen >= 30 && titleLen <= 70) {
      score += 25;
      details.push({ label: 'Title Length', status: 'perfect', text: 'Excellent! Your title length is optimized for search (30-70 chars).' });
    } else if (titleLen > 0) {
      score += 15;
      details.push({ label: 'Title Length', status: 'warning', text: 'Your title could be more descriptive. Aim for 30-70 characters.' });
    }

    // 2. Tags Score (25 pts)
    const tagCount = tags.length;
    if (tagCount >= 15) {
      score += 25;
      details.push({ label: 'Tag Count', status: 'perfect', text: `${tagCount} tags found. Great job using many relevant tags!` });
    } else if (tagCount >= 5) {
      score += 15;
      details.push({ label: 'Tag Count', status: 'warning', text: `Only ${tagCount} tags found. Adding more tags helps YouTube categorize your video.` });
    } else {
      details.push({ label: 'Tag Count', status: 'danger', text: 'No hidden tags found. This limits your video discoverability.' });
    }

    // 3. Description Score (25 pts)
    const descLen = description.length;
    if (descLen > 500) {
      score += 25;
      details.push({ label: 'Description Richness', status: 'perfect', text: 'Rich description! You provided plenty of context for search engines.' });
    } else if (descLen > 100) {
      score += 15;
      details.push({ label: 'Description Richness', status: 'warning', text: 'Your description is a bit short. Add more keywords and info.' });
    }

    // 4. Keyword Synergy (25 pts)
    const titleWords = title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const keywordMatchCount = titleWords.filter(w => description.toLowerCase().includes(w)).length;
    if (keywordMatchCount >= 3) {
      score += 25;
      details.push({ label: 'Keyword Synergy', status: 'perfect', text: 'High synergy! Your title keywords are well-distributed in the description.' });
    } else if (keywordMatchCount > 0) {
      score += 10;
      details.push({ label: 'Keyword Synergy', status: 'warning', text: 'Weak synergy. Try including more title keywords in the first 2 lines of description.' });
    }

    res.json({
      videoId,
      title,
      score,
      details,
      recommendation: score > 80 ? 'Excellent SEO! Your video is highly optimized.' : 'Needs Improvement. Focus on adding more descriptive tags and expanding your description.',
    });

  } catch (err) {
    console.error('[seo-score]', err.message);
    res.status(500).json({ error: 'SEO scoring failed.' });
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

    let targetUrl = url;
    if (isChannel && !url.includes('/about')) {
      targetUrl = url.endsWith('/') ? `${url}about` : `${url}/about`;
    }

    const html = await fetchPage(targetUrl);
    
    // Extraction for both Video and Channel
    const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
    const name = titleMatch ? titleMatch[1].trim() : 'YouTube Creator';

    // Better View Extraction (Lifetime views for channels)
    const viewMatch = html.match(/"viewCountText":\s*\{"simpleText":"([\d,]+) views"\}/) || 
                       html.match(/"viewCount":"(\d+)"/) ||
                       html.match(/"label":"([\d,]+) views"/);
    const totalViews = viewMatch ? parseInt(viewMatch[1].replace(/,/g, '')) : 100000;

    const subMatch = html.match(/"subscriberCountText":\s*\{[^}]*?"simpleText":"([^"]+)"\}/) || 
                     html.match(/"label":"([^"]+)\s+subscribers"/) ||
                     html.match(/"subscriberCountText":\s*\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"\}\}/);
    const subs = subMatch ? (subMatch[1] || subMatch[2]) : 'N/A';

    const logoMatch = html.match(/"avatar":\s*\{"thumbnails":\s*\[\{"url":"([^"]+)"/);
    const logo = logoMatch ? logoMatch[1].replace(/\\u0026/g, '&') : '';

    // Calculation Method
    // Industry Avg RPM: $1.20 - $5.00
    const rpmMin = 1.20;
    const rpmMax = 5.00;

    const calculateEarnings = (views) => ({
      daily: {
        min: ((views / 365 / 1000) * rpmMin).toFixed(2),
        max: ((views / 365 / 1000) * rpmMax).toFixed(2),
      },
      monthly: {
        min: ((views / 12 / 1000) * rpmMin).toFixed(2),
        max: ((views / 12 / 1000) * rpmMax).toFixed(2),
      },
      yearly: {
        min: ((views / 1000) * rpmMin).toFixed(2),
        max: ((views / 1000) * rpmMax).toFixed(2),
      }
    });

    // If it's a channel, views = total lifetime views. We estimate "Current Performance" as 10% of total views per year.
    // If it's a video, views = video lifetime views.
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
    res.status(500).json({ error: 'Revenue calculation failed. Please check the URL.' });
  }
});

module.exports = router;
