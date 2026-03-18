const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const { upload, UPLOAD_DIR } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { getDB } = require('../services/database');
const { getExpiryDate } = require('../services/cleanupService');

const router = express.Router();

function trackFile(req, inputFile, outputPath, toolUsed) {
  try {
    const db = getDB();
    db.prepare(`
      INSERT INTO files (id, user_id, original_name, stored_name, mime_type, size, tool_used, output_path, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)
    `).run(
      uuidv4(),
      req.user?.id || null,
      inputFile.originalname,
      inputFile.filename,
      inputFile.mimetype,
      inputFile.size,
      toolUsed,
      outputPath,
      getExpiryDate(60)
    );
  } catch (e) { console.error('[Track]', e.message); }
}

function sendFileResponse(res, outputPath, filename, mimeType) {
  res.setHeader('Content-Type', mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('X-Tool-Success', 'true');
  res.sendFile(path.resolve(outputPath), (err) => {
    if (err && !res.headersSent) {
      console.error('[Send]', err.message);
      res.status(500).json({ error: 'Error sending file' });
    }
  });
}

// POST /api/image/compress
router.post('/compress', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload an image' });

  try {
    const quality = Math.min(100, Math.max(1, parseInt(req.body.quality) || 80));
    const inputFormat = (await sharp(req.file.path).metadata()).format;
    const format = req.body.format || (inputFormat === 'jpeg' ? 'jpeg' : inputFormat) || 'jpeg';
    const validFormats = ['jpeg', 'png', 'webp'];
    const safeFormat = validFormats.includes(format) ? format : 'jpeg';
    const ext = safeFormat === 'jpeg' ? 'jpg' : safeFormat;

    const outputPath = path.join(UPLOAD_DIR, `compressed_${uuidv4()}.${ext}`);
    let pipeline = sharp(req.file.path);

    if (safeFormat === 'jpeg') pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    else if (safeFormat === 'png') pipeline = pipeline.png({ quality, compressionLevel: 9 });
    else if (safeFormat === 'webp') pipeline = pipeline.webp({ quality });

    const info = await pipeline.toFile(outputPath);
    const originalSize = req.file.size;
    const newSize = info.size;
    const reduction = Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100));

    trackFile(req, req.file, outputPath, 'compress-image');

    res.setHeader('X-Original-Size', originalSize);
    res.setHeader('X-Compressed-Size', newSize);
    res.setHeader('X-Reduction-Percent', reduction);
    sendFileResponse(res, outputPath, `compressed.${ext}`, `image/${safeFormat}`);
  } catch (err) {
    console.error('[Compress Image]', err.message);
    res.status(500).json({ error: 'Failed to compress image: ' + err.message });
  }
});

// POST /api/image/resize
router.post('/resize', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload an image' });

  try {
    const width = req.body.width ? parseInt(req.body.width) : null;
    const height = req.body.height ? parseInt(req.body.height) : null;
    const fit = ['inside', 'cover', 'contain', 'fill'].includes(req.body.fit) ? req.body.fit : 'inside';

    if (!width && !height) {
      return res.status(400).json({ error: 'Please specify at least width or height' });
    }

    const meta = await sharp(req.file.path).metadata();
    const format = meta.format || 'jpeg';
    const ext = format === 'jpeg' ? 'jpg' : format;

    const outputPath = path.join(UPLOAD_DIR, `resized_${uuidv4()}.${ext}`);
    await sharp(req.file.path)
      .resize(width, height, { fit, withoutEnlargement: false })
      .toFile(outputPath);

    trackFile(req, req.file, outputPath, 'resize-image');

    const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
    sendFileResponse(res, outputPath, `resized.${ext}`, mimeMap[ext] || 'image/jpeg');
  } catch (err) {
    console.error('[Resize Image]', err.message);
    res.status(500).json({ error: 'Failed to resize image: ' + err.message });
  }
});

// POST /api/image/convert
router.post('/convert', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload an image' });

  try {
    const to = (req.body.to || 'jpeg').toLowerCase().replace('jpg', 'jpeg');
    const validFormats = ['jpeg', 'png', 'webp', 'bmp', 'tiff', 'gif'];

    if (!validFormats.includes(to)) {
      return res.status(400).json({ error: `Unsupported format: ${to}. Valid: ${validFormats.join(', ')}` });
    }

    const ext = to === 'jpeg' ? 'jpg' : to;
    const outputPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.${ext}`);

    let pipeline = sharp(req.file.path).rotate(); // .rotate() auto-fixes EXIF orientation

    if (to === 'jpeg') pipeline = pipeline.jpeg({ quality: 90, mozjpeg: true });
    else if (to === 'png') pipeline = pipeline.png();
    else if (to === 'webp') pipeline = pipeline.webp({ quality: 90 });
    else if (to === 'bmp') pipeline = pipeline.bmp();
    else if (to === 'tiff') pipeline = pipeline.tiff();
    else if (to === 'gif') pipeline = pipeline.gif();

    await pipeline.toFile(outputPath);
    trackFile(req, req.file, outputPath, 'convert-image');

    const mimeTypes = {
      jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
      webp: 'image/webp', bmp: 'image/bmp', tiff: 'image/tiff', gif: 'image/gif'
    };
    sendFileResponse(res, outputPath, `converted.${ext}`, mimeTypes[ext] || 'image/jpeg');
  } catch (err) {
    console.error('[Convert Image]', err.message);
    res.status(500).json({ error: 'Failed to convert image: ' + err.message });
  }
});

// POST /api/image/metadata (utility)
router.post('/metadata', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const meta = await sharp(req.file.path).metadata();
    fs.unlinkSync(req.file.path);
    res.json({
      format: meta.format,
      width: meta.width,
      height: meta.height,
      channels: meta.channels,
      size: req.file.size,
      colorSpace: meta.space,
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not read image metadata' });
  }
});

module.exports = router;
