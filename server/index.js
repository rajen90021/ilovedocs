require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const cron = require('node-cron');
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
app.use(limiter);

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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
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

app.listen(PORT, () => {
  console.log(`\n🚀 ILoveDocs Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads')}\n`);
});
