require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
const https = require('https');
const http = require('http');
const { cleanExpiredFiles } = require('./services/cleanupService');
const { initDB } = require('./services/database');

// Routes
const authRoutes = require('./routes/auth');
const pdfRoutes = require('./routes/pdf');
const imageRoutes = require('./routes/image');
const fileRoutes = require('./routes/files');
const toolsRoutes = require('./routes/tools');

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting on hosting platforms like Render + Cloudflare
app.set('trust proxy', true);

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
// Apply rate limiter ONLY to API routes, not static files or SEO assets
app.use('/api', limiter);

// CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: [
    'Content-Disposition',
    'X-Original-Size',
    'X-Compressed-Size',
    'X-Reduction-Percent',
    'X-Tool-Success',
  ],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files (for preview/download)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/pdf', pdfRoutes);
app.use('/api/image', imageRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/tools', toolsRoutes);

// Health check — must be defined BEFORE static file middleware catch-all
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// Explicitly serve robots.txt and sitemap.xml
// This ensures they are served correctly even if the static build folder is missing or if the catch-all interferes
app.get('/robots.txt', (req, res) => {
  const localPath = path.join(__dirname, '../client/public/robots.txt');
  const distPath = path.join(__dirname, '../client/dist/robots.txt');
  if (fs.existsSync(distPath)) return res.sendFile(distPath);
  if (fs.existsSync(localPath)) return res.sendFile(localPath);
  res.status(404).send('robots.txt not found');
});

app.get('/sitemap.xml', (req, res) => {
  const localPath = path.join(__dirname, '../client/public/sitemap.xml');
  const distPath = path.join(__dirname, '../client/dist/sitemap.xml');
  if (fs.existsSync(distPath)) return res.sendFile(distPath);
  if (fs.existsSync(localPath)) return res.sendFile(localPath);
  res.status(404).send('sitemap.xml not found');
});

// ── Serve Production Client ─────────────────────────────────
// Serve the built static files
app.use(express.static(path.join(__dirname, '../client/dist')));

// SPA Catch-all: If it's not an API call, serve the client index.html
app.get(/.*/, (req, res) => {
  // If it's an API route that somehow hit here, send 404
  if (req.url.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
  
  const indexPath = path.join(__dirname, '../client/dist/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // In local development, you might not have run 'npm run build' yet.
    // Instead of crashing, we provide a status or 404.
    res.status(404).json({ 
      info: 'ILoveDocs API is running.',
      error: 'Frontend build not found at client/dist. For local testing, use the Vite dev server at http://localhost:5173' 
    });
  }
});



// Error handler
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum size is 50MB.' });
  }
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Initialize database
initDB();

// Cron job: clean expired files every 30 minutes
cron.schedule('*/30 * * * *', () => {
  console.log('[Cron] Cleaning expired files...');
  cleanExpiredFiles();
});

// ── Keep-Alive: Prevent Render free-tier cold starts ────────────
// Pings our own /api/health endpoint every 14 minutes so the server
// never goes idle. Only runs in production (RENDER_EXTERNAL_URL is
// automatically set by Render on all deployed services).
const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
if (RENDER_URL) {
  const pingUrl = `${RENDER_URL}/api/health`;
  console.log(`[Keep-Alive] Self-ping enabled → ${pingUrl}`);

  cron.schedule('*/10 * * * *', () => {
    const client = pingUrl.startsWith('https') ? https : http;
    client.get(pingUrl, (res) => {
      console.log(`[Keep-Alive] Ping sent → HTTP ${res.statusCode}`);
    }).on('error', (err) => {
      console.warn('[Keep-Alive] Ping failed:', err.message);
    });
  });
} else {
  console.log('[Keep-Alive] Skipped (not running on Render).');
}

app.listen(PORT, () => {
  console.log(`\n🚀 ILoveDocs Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}\n`);
});
