const axios = require('axios');

async function testScraper() {
  const videoId = 'mD4jTBqCRpA'; // Video from the user's screenshot
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    console.log('--- TEST START ---');
    console.log('HTML Length:', html.length);

    // 1. Bot Detection
    const isBotChallenge = html.includes('recaptcha') || html.includes('Sign in to confirm you’re not a bot');
    console.log('Bot Challenge Detected:', isBotChallenge);

    // 2. Helper Matcher
    const safeMatch = (regex, index = 1, fallback = 'Unknown') => {
      try {
        const m = html.match(regex);
        return m ? m[index] : fallback;
      } catch (e) { return fallback; }
    };

    // 3. Logic Simulation
    const titleVal = safeMatch(/<title>(.*?) - YouTube<\/title>/);
    const channelName = safeMatch(/"ownerChannelName":"([^"]+)"/, 1, 'Unknown');
    const rawViews = safeMatch(/"viewCount":"(\d+)"/, 1, '0');
    const views = parseInt(rawViews) || 0;
    const rawPublishDate = safeMatch(/"publishDate":"([^"]+)"/, 1, null);

    console.log('Title:', titleVal);
    console.log('Channel:', channelName);
    console.log('Views:', views);
    console.log('Raw Publish Date:', rawPublishDate);

    // 4. Date Parse Check
    if (rawPublishDate) {
      const dateObj = new Date(rawPublishDate);
      console.log('Date Valid:', !isNaN(dateObj.getTime()));
      if (!isNaN(dateObj.getTime())) {
          console.log('Formatted Date:', dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
    }

    // 5. Advanced Check
    const subMatch = html.match(/"subscriberCountText":\s*\{[^}]*?"simpleText":"([^"]+)"\}/) || 
                     html.match(/"label":"([^"]+)\s+subscribers"/) ||
                     html.match(/"subscriberCountText":\s*\{"accessibility":\{"accessibilityData":\{"label":"([^"]+)"\}\}/);
    
    console.log('Subscribers:', subMatch ? (subMatch[1] || subMatch[2]) : 'N/A');

    const logoMatch = html.match(/"avatar":\s*\{"thumbnails":\s*\[\{"url":"([^"]+)"/);
    console.log('Logo Found:', !!logoMatch);

    console.log('--- TEST END ---');

  } catch (err) {
    console.error('Error:', err.message);
  }
}

testScraper();
