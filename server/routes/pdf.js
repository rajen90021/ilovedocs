const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { PDFDocument, degrees, rgb, StandardFonts } = require('pdf-lib');
const { upload, UPLOAD_DIR } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { getDB } = require('../services/database');
const { getExpiryDate } = require('../services/cleanupService');

const router = express.Router();

function trackFile(req, inputFile, outputPath, toolUsed) {
  try {
    const db = getDB();
    const id = uuidv4();
    db.prepare(`
      INSERT INTO files (id, user_id, original_name, stored_name, mime_type, size, tool_used, output_path, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)
    `).run(
      id,
      req.user?.id || null,
      inputFile.originalname,
      inputFile.filename,
      inputFile.mimetype,
      inputFile.size,
      toolUsed,
      outputPath,
      getExpiryDate(60)
    );
  } catch (e) {
    console.error('[Track] Error:', e.message);
  }
}

function sendFileResponse(res, outputPath, filename) {
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('X-Tool-Success', 'true');
  res.sendFile(path.resolve(outputPath), (err) => {
    if (err && !res.headersSent) {
      console.error('[Send] Error sending file:', err.message);
      res.status(500).json({ error: 'Error sending file' });
    }
  });
}

// POST /api/pdf/merge
router.post('/merge', optionalAuth, upload.array('files', 20), async (req, res) => {
  if (!req.files || req.files.length < 2) {
    return res.status(400).json({ error: 'Please upload at least 2 PDF files to merge' });
  }

  try {
    const mergedDoc = await PDFDocument.create();

    for (const file of req.files) {
      const bytes = fs.readFileSync(file.path);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pages = await mergedDoc.copyPages(doc, doc.getPageIndices());
      pages.forEach(p => mergedDoc.addPage(p));
    }

    const outputBytes = await mergedDoc.save();
    const outputName = `merged_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.files[0], outputPath, 'merge-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'merged.pdf');
  } catch (err) {
    console.error('[Merge PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to merge PDFs. Make sure all files are valid PDFs.' });
  }
});

// POST /api/pdf/split
router.post('/split', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const { pages } = req.body; // e.g. "1,3,5" or "1-3"
    const bytes = fs.readFileSync(req.file.path);
    const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    let pageIndices = [];
    if (pages) {
      // Parse page ranges
      const parts = pages.split(',').map(p => p.trim());
      for (const part of parts) {
        if (part.includes('-')) {
          const [start, end] = part.split('-').map(n => parseInt(n) - 1);
          for (let i = start; i <= Math.min(end, totalPages - 1); i++) {
            if (i >= 0) pageIndices.push(i);
          }
        } else {
          const idx = parseInt(part) - 1;
          if (idx >= 0 && idx < totalPages) pageIndices.push(idx);
        }
      }
    } else {
      // Split into individual pages
      pageIndices = srcDoc.getPageIndices();
    }

    if (pageIndices.length === 0) {
      return res.status(400).json({ error: 'No valid page numbers specified' });
    }

    const newDoc = await PDFDocument.create();
    const copiedPages = await newDoc.copyPages(srcDoc, pageIndices);
    copiedPages.forEach(p => newDoc.addPage(p));

    const outputBytes = await newDoc.save();
    const outputName = `split_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'split-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'split.pdf');
  } catch (err) {
    console.error('[Split PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to split PDF' });
  }
});

// POST /api/pdf/rotate
router.post('/rotate', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const angle = parseInt(req.body.angle) || 90;
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    const pages = doc.getPages();
    pages.forEach(page => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    });

    const outputBytes = await doc.save();
    const outputName = `rotated_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'rotate-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'rotated.pdf');
  } catch (err) {
    console.error('[Rotate PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to rotate PDF' });
  }
});

// POST /api/pdf/compress
router.post('/compress', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    // pdf-lib doesn't truly compress images; we save with compression
    const outputBytes = await doc.save({
      useObjectStreams: true,
      addDefaultPage: false,
      objectsPerTick: 50,
    });

    const outputName = `compressed_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    const originalSize = req.file.size;
    const newSize = outputBytes.length;
    const reduction = Math.round(((originalSize - newSize) / originalSize) * 100);

    trackFile(req, req.file, outputPath, 'compress-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('X-Original-Size', originalSize);
    res.setHeader('X-Compressed-Size', newSize);
    res.setHeader('X-Reduction-Percent', Math.max(0, reduction));
    sendFileResponse(res, outputPath, 'compressed.pdf');
  } catch (err) {
    console.error('[Compress PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to compress PDF' });
  }
});

// POST /api/pdf/watermark
router.post('/watermark', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const text = req.body.text || 'CONFIDENTIAL';
    const opacity = parseFloat(req.body.opacity) || 0.3;
    const color = req.body.color || 'gray'; // gray, red, blue

    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.HelveticaBold);

    const pages = doc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 10;

      let r = 0.5, g = 0.5, b = 0.5;
      if (color === 'red') { r = 1; g = 0; b = 0; }
      if (color === 'blue') { r = 0; g = 0; b = 1; }

      page.drawText(text, {
        x: width / 2 - (fontSize * text.length * 0.3),
        y: height / 2,
        size: fontSize,
        font,
        color: rgb(r, g, b),
        opacity,
        rotate: degrees(45),
      });
    }

    const outputBytes = await doc.save();
    const outputName = `watermarked_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'watermark-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'watermarked.pdf');
  } catch (err) {
    console.error('[Watermark PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to add watermark to PDF' });
  }
});

// POST /api/pdf/protect
router.post('/protect', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    // pdf-lib doesn't support native encryption yet, so we copy the PDF and add a metadata note
    // For production, use node-qpdf or similar
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    doc.setTitle(`Protected - ${req.file.originalname}`);
    doc.setProducer('ILoveDocs');

    const outputBytes = await doc.save();
    const outputName = `protected_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'protect-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'protected.pdf');
  } catch (err) {
    console.error('[Protect PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to protect PDF' });
  }
});

// POST /api/pdf/unlock
router.post('/unlock', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });

    const outputBytes = await doc.save();
    const outputName = `unlocked_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'unlock-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'unlocked.pdf');
  } catch (err) {
    console.error('[Unlock PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to unlock PDF. The file may require a password.' });
  }
});

// POST /api/pdf/reorder
router.post('/reorder', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const { order } = req.body; // "3,1,2" = page 3 first, then 1, then 2
    if (!order) return res.status(400).json({ error: 'Page order is required' });

    const bytes = fs.readFileSync(req.file.path);
    const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const totalPages = srcDoc.getPageCount();

    const indices = order.split(',').map(n => parseInt(n.trim()) - 1).filter(i => i >= 0 && i < totalPages);

    if (indices.length === 0) return res.status(400).json({ error: 'Invalid page order' });

    const newDoc = await PDFDocument.create();
    const copied = await newDoc.copyPages(srcDoc, indices);
    copied.forEach(p => newDoc.addPage(p));

    const outputBytes = await newDoc.save();
    const outputName = `reordered_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'reorder-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'reordered.pdf');
  } catch (err) {
    console.error('[Reorder PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to reorder PDF pages' });
  }
});

// POST /api/pdf/jpg-to-pdf
router.post('/jpg-to-pdf', optionalAuth, upload.array('files', 20), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Please upload image files' });
  }

  try {
    const doc = await PDFDocument.create();

    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);
      let img;

      if (file.mimetype === 'image/jpeg') {
        img = await doc.embedJpg(imgBytes);
      } else if (file.mimetype === 'image/png') {
        img = await doc.embedPng(imgBytes);
      } else {
        // Convert to PNG bytes via sharp first
        const sharp = require('sharp');
        const pngBytes = await sharp(imgBytes).png().toBuffer();
        img = await doc.embedPng(pngBytes);
      }

      const page = doc.addPage([img.width, img.height]);
      page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
    }

    const outputBytes = await doc.save();
    const outputName = `converted_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.files[0], outputPath, 'jpg-to-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'images.pdf');
  } catch (err) {
    console.error('[JPG to PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to convert images to PDF' });
  }
});

// POST /api/pdf/page-count (utility)
router.post('/page-count', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const count = doc.getPageCount();

    // Cleanup temp file
    fs.unlinkSync(req.file.path);

    res.json({ pageCount: count, filename: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: 'Could not read PDF page count' });
  }
});

// POST /api/pdf/edit
router.post('/edit', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Please upload a PDF file' });

  try {
    const { text, x, y, size, color } = req.body;
    if (!text) return res.status(400).json({ error: 'Edit text is required' });

    const posX = parseFloat(x) || 50;
    const posY = parseFloat(y) || 50;
    const fontSize = parseInt(size) || 12;

    const bytes = fs.readFileSync(req.file.path);
    const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    const font = await doc.embedFont(StandardFonts.Helvetica);

    const pages = doc.getPages();
    if (pages.length > 0) {
      const page = pages[0]; // Edit first page for now
      
      let r = 0, g = 0, b = 0;
      if (color === 'red') { r = 1; }
      else if (color === 'blue') { b = 1; }

      page.drawText(text, {
        x: posX,
        y: page.getHeight() - posY,
        size: fontSize,
        font,
        color: rgb(r, g, b),
      });
    }

    const outputBytes = await doc.save();
    const outputName = `edited_${uuidv4()}.pdf`;
    const outputPath = path.join(UPLOAD_DIR, outputName);
    fs.writeFileSync(outputPath, outputBytes);

    trackFile(req, req.file, outputPath, 'edit-pdf');

    res.setHeader('Content-Type', 'application/pdf');
    sendFileResponse(res, outputPath, 'edited.pdf');
  } catch (err) {
    console.error('[Edit PDF] Error:', err.message);
    res.status(500).json({ error: 'Failed to edit PDF' });
  }
});

module.exports = router;
