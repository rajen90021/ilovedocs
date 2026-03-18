const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const archiver = require('archiver');
const { upload, UPLOAD_DIR } = require('../middleware/upload');
const { optionalAuth } = require('../middleware/auth');
const { getDB } = require('../services/database');
const { getExpiryDate } = require('../services/cleanupService');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph, TextRun } = require('docx');
const xlsx = require('xlsx');
const mammoth = require('mammoth');
const officeParser = require('officeparser');

const router = express.Router();

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function trackFile(req, inputFile, outputPath, toolUsed) {
  try {
    const db = getDB();
    db.prepare(`
      INSERT INTO files (id, user_id, original_name, stored_name, mime_type, size, tool_used, output_path, status, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'completed', ?)
    `).run(
      uuidv4(), req.user?.id || null,
      inputFile.originalname, inputFile.filename,
      inputFile.mimetype, inputFile.size,
      toolUsed, outputPath, getExpiryDate(60)
    );
  } catch (e) { console.error('[Track]', e.message); }
}

function sendFileResponse(res, outputPath, filename, mimeType) {
  res.setHeader('Content-Type', mimeType || 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('X-Tool-Success', 'true');
  res.sendFile(path.resolve(outputPath), (err) => {
    if (err && !res.headersSent) {
      console.error('[sendFile]', err.message);
      res.status(500).json({ error: 'Error sending file' });
    }
  });
}

/**
 * Robustly extract text from PDF using pdfjs-dist
 * Handles item positioning to maintain something resembling a layout
 */
async function extractPDFText(filePath) {
  const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
  const data = new Uint8Array(fs.readFileSync(filePath));
  const pdfDoc = await pdfjsLib.getDocument({ 
    data, 
    useSystemFonts: true, 
    disableFontFace: true,
    nativeImageDecoderSupport: 'none'
  }).promise;

  let fullText = '';
  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);
    const content = await page.getTextContent();
    
    // Sort items safely by vertical position then horizontal
    const items = content.items
      .filter(item => item && item.transform && item.transform.length >= 6)
      .sort((a, b) => {
        if (Math.abs(b.transform[5] - a.transform[5]) > 2) {
          return b.transform[5] - a.transform[5];
        }
        return a.transform[4] - b.transform[4];
      });

    let pageText = '';
    let lastY = -1;
    for (const item of items) {
      if (lastY !== -1 && Math.abs(item.transform[5] - lastY) > 5) {
        pageText += '\n';
      }
      pageText += (item.str || '') + ' ';
      lastY = item.transform[5];
    }
    fullText += pageText + '\n\n';
  }
  return fullText.trim();
}

/**
 * Word-wrap text into lines fitting maxWidth, sanitising non-Latin chars.
 */
function wordWrapLines(text, maxWidth, font, fontSize) {
  const paragraphs = text.replace(/\r\n/g, '\n').split('\n');
  const allLines = [];
  for (const para of paragraphs) {
    if (!para.trim()) { allLines.push(''); continue; }
    const words = para.split(/\s+/);
    let current = '';
    for (const word of words) {
      const safe = word.replace(/[^\x00-\xFF]/g, '?');
      const candidate = current ? `${current} ${safe}` : safe;
      try {
        if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
          current = candidate;
        } else {
          if (current) allLines.push(current);
          current = safe;
        }
      } catch { current = candidate; }
    }
    if (current) allLines.push(current);
  }
  return allLines;
}

/**
 * Convert plain text to a properly paginated, multi-page A4 PDF.
 */
async function textToPDF(text) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const PAGE_W = 595.28, PAGE_H = 841.89;
  const MX = 50, MY = 60, FS = 10, LH = FS * 1.4;
  const MAX_W = PAGE_W - 2 * MX;
  const LPP = Math.floor((PAGE_H - 2 * MY) / LH);

  const lines = wordWrapLines(text || '(Empty document)', MAX_W, font, FS);

  for (let i = 0; i < Math.max(lines.length, 1); i += LPP) {
    const page = pdfDoc.addPage([PAGE_W, PAGE_H]);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: rgb(1, 1, 1) });
    const pageLines = lines.slice(i, i + LPP);
    pageLines.forEach((line, j) => {
      if (!line.trim()) return;
      page.drawText(line, {
        x: MX,
        y: PAGE_H - MY - j * LH,
        size: FS,
        font,
        color: rgb(0, 0, 0),
      });
    });
  }
  return pdfDoc;
}

// ─────────────────────────────────────────────
// Tool Registry
// ─────────────────────────────────────────────

router.get('/', (req, res) => {
  const tools = [
    { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one document', category: 'pdf', icon: 'files', color: '#E63946', endpoint: '/api/pdf/merge', acceptedTypes: ['.pdf'], multiple: true },
    { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages or split a PDF into multiple files', category: 'pdf', icon: 'scissors', color: '#457B9D', endpoint: '/api/pdf/split', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality', category: 'pdf', icon: 'archive', color: '#2A9D8F', endpoint: '/api/pdf/compress', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate pages in your PDF document', category: 'pdf', icon: 'rotate-cw', color: '#E9C46A', endpoint: '/api/pdf/rotate', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'watermark-pdf', name: 'Watermark PDF', description: 'Add custom text watermark to your PDF', category: 'pdf', icon: 'droplets', color: '#8338EC', endpoint: '/api/pdf/watermark', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'protect-pdf', name: 'Protect PDF', description: 'Secure your PDF with a password', category: 'pdf', icon: 'shield', color: '#FB8500', endpoint: '/api/pdf/protect', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password protection from PDF', category: 'pdf', icon: 'lock-open', color: '#06D6A0', endpoint: '/api/pdf/unlock', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'reorder-pdf', name: 'Reorder PDF Pages', description: 'Rearrange pages in your PDF document', category: 'pdf', icon: 'arrow-up-down', color: '#EF476F', endpoint: '/api/pdf/reorder', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'edit-pdf', name: 'Edit PDF', description: 'Add text and annotations to your PDF', category: 'pdf', icon: 'edit', color: '#7C3AED', endpoint: '/api/pdf/edit', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert images to a PDF document', category: 'convert', icon: 'image', color: '#118AB2', endpoint: '/api/pdf/jpg-to-pdf', acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'], multiple: true },
    { id: 'html-to-pdf', name: 'HTML to PDF', description: 'Convert web pages or HTML files to PDF', category: 'convert', icon: 'code', color: '#073B4C', endpoint: '/api/tools/html-to-pdf', acceptedTypes: ['.html', '.htm'], multiple: false },
    { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF documents to editable Word files', category: 'convert', icon: 'file-text', color: '#2B6CB0', endpoint: '/api/tools/pdf-to-word', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to high-quality images', category: 'convert', icon: 'image', color: '#D69E2E', endpoint: '/api/tools/pdf-to-jpg', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'pdf-to-excel', name: 'PDF to Excel', description: 'Extract tables from PDF to Excel spreadsheet', category: 'convert', icon: 'table', color: '#276749', endpoint: '/api/tools/pdf-to-excel', acceptedTypes: ['.pdf'], multiple: false },
    { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF format', category: 'convert', icon: 'file', color: '#3B82F6', endpoint: '/api/tools/word-to-pdf', acceptedTypes: ['.docx', '.doc'], multiple: false },
    { id: 'excel-to-pdf', name: 'Excel to PDF', description: 'Convert Excel spreadsheets to PDF', category: 'convert', icon: 'bar-chart', color: '#059669', endpoint: '/api/tools/excel-to-pdf', acceptedTypes: ['.xlsx', '.xls'], multiple: false },
    { id: 'ppt-to-pdf', name: 'PowerPoint to PDF', description: 'Convert presentations to PDF format', category: 'convert', icon: 'presentation', color: '#D97706', endpoint: '/api/tools/ppt-to-pdf', acceptedTypes: ['.pptx', '.ppt'], multiple: false },
    { id: 'compress-image', name: 'Compress Image', description: 'Reduce image file size with smart compression', category: 'image', icon: 'image', color: '#FF6B6B', endpoint: '/api/image/compress', acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp'], multiple: false },
    { id: 'resize-image', name: 'Resize Image', description: 'Change image dimensions to any size', category: 'image', icon: 'maximize', color: '#4ECDC4', endpoint: '/api/image/resize', acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'], multiple: false },
    { id: 'convert-image', name: 'Convert Image', description: 'Convert between JPG, PNG, WebP, and more', category: 'image', icon: 'refresh-cw', color: '#45B7D1', endpoint: '/api/image/convert', acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif', '.tiff'], multiple: false },
  ];
  res.json({ tools, total: tools.length });
});

// ─────────────────────────────────────────────
// Implementations
// ─────────────────────────────────────────────

router.post('/pdf-to-word', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    let text = '';
    try { text = await extractPDFText(req.file.path); } catch (e) {
      console.error('[pdf-to-word] extraction error:', e.message);
    }

    if (!text || text.length < 5) {
      text = `This PDF might contain scanned images or is protected, so text could not be extracted.\n\nFile Name: ${req.file.originalname}`;
    }

    const doc = new Document({
      sections: [{
        children: text.split('\n').map(line => new Paragraph({
          children: [new TextRun({ text: line.replace(/[^\x00-\xFF]/g, '') })],
          spacing: { after: 120 }
        }))
      }]
    });
    const buffer = await Packer.toBuffer(doc);
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.docx`);
    fs.writeFileSync(outPath, buffer);
    trackFile(req, req.file, outPath, 'pdf-to-word');
    sendFileResponse(res, outPath, 'converted.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  } catch (err) {
    console.error('[pdf-to-word]', err.message);
    res.status(500).json({ error: 'Failed to convert PDF to Word' });
  }
});

router.post('/word-to-pdf', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const result = await mammoth.extractRawText({ path: req.file.path });
    const pdfDoc = await textToPDF(result.value || '(Empty Word document)');
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.pdf`);
    fs.writeFileSync(outPath, await pdfDoc.save());
    trackFile(req, req.file, outPath, 'word-to-pdf');
    sendFileResponse(res, outPath, 'converted.pdf', 'application/pdf');
  } catch (err) {
    console.error('[word-to-pdf]', err.message);
    res.status(500).json({ error: 'Failed to convert Word to PDF' });
  }
});

router.post('/pdf-to-excel', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    let text = '';
    try { text = await extractPDFText(req.file.path); } catch (e) {}
    const rows = (text || 'No data').split('\n').filter(l => l.trim()).map(line => line.split(/\t|\s{2,}/).map(c => c.trim()));
    const wb = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, xlsx.utils.aoa_to_sheet(rows.length ? rows : [['No data extracted']]), 'Sheet1');
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.xlsx`);
    xlsx.writeFile(wb, outPath);
    trackFile(req, req.file, outPath, 'pdf-to-excel');
    sendFileResponse(res, outPath, 'converted.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  } catch (err) {
    console.error('[pdf-to-excel]', err.message);
    res.status(500).json({ error: 'Failed to convert PDF to Excel' });
  }
});

router.post('/excel-to-pdf', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const wb = xlsx.readFile(req.file.path);
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const text = data.map(row => {
      const cells = row.map(c => (c === null || c === undefined) ? '' : String(c).trim());
      // Remove trailing empty cells to avoid "||||" clutter
      while (cells.length > 0 && cells[cells.length - 1] === '') {
        cells.pop();
      }
      return cells.join('    '); // Use 4 spaces for a clean, table-like separation
    }).join('\n');
    const pdfDoc = await textToPDF(text || '(Empty Excel)');
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.pdf`);
    fs.writeFileSync(outPath, await pdfDoc.save());
    trackFile(req, req.file, outPath, 'excel-to-pdf');
    sendFileResponse(res, outPath, 'converted.pdf', 'application/pdf');
  } catch (err) {
    console.error('[excel-to-pdf]', err.message);
    res.status(500).json({ error: 'Failed to convert Excel to PDF' });
  }
});

router.post('/ppt-to-pdf', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    let text = '';
    try { text = await officeParser.parseOfficeAsync(req.file.path); } catch (e) {}
    const pdfDoc = await textToPDF(text || '(Could not extract slides content)');
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.pdf`);
    fs.writeFileSync(outPath, await pdfDoc.save());
    trackFile(req, req.file, outPath, 'ppt-to-pdf');
    sendFileResponse(res, outPath, 'converted.pdf', 'application/pdf');
  } catch (err) {
    console.error('[ppt-to-pdf]', err.message);
    res.status(500).json({ error: 'Failed to convert PPT to PDF' });
  }
});

router.post('/pdf-to-jpg', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const { createCanvas } = require('@napi-rs/canvas');
    const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
    
    // Provide a CanvasFactory for pdfjs-dist to handle tiled patterns/masks
    class NodeCanvasFactory {
      create(width, height) {
        const canvas = createCanvas(width, height);
        const context = canvas.getContext('2d');
        return { canvas, context };
      }
      reset(canvasAndContext, width, height) {
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
      }
      destroy(canvasAndContext) {
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
      }
    }

    const data = new Uint8Array(fs.readFileSync(req.file.path));
    const loadingTask = pdfjsLib.getDocument({
      data,
      useSystemFonts: true,
      disableFontFace: true,
      standardFontDataUrl: path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'standard_fonts', '/'),
      cMapUrl: path.join(__dirname, '..', 'node_modules', 'pdfjs-dist', 'cmaps', '/'),
      cMapPacked: true,
    });
    
    const pdfDoc = await loadingTask.promise;
    const canvasFactory = new NodeCanvasFactory();
    
    // If it has multiple pages, zip them; otherwise just send page 1
    if (pdfDoc.numPages > 1) {
      const zipName = `converted_${uuidv4()}.zip`;
      const zipPath = path.join(UPLOAD_DIR, zipName);
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.pipe(output);

      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        let vp = page.getViewport({ scale: 2.0 });
        
        // Safety cap for extremely large media boxes
        if (vp.width > 4000 || vp.height > 4000) {
          vp = page.getViewport({ scale: 4000 / Math.max(vp.width/2.0, vp.height/2.0) });
        }
        
        const canvas = createCanvas(Math.floor(vp.width), Math.floor(vp.height));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        await page.render({ canvasContext: ctx, viewport: vp, canvasFactory }).promise;
        archive.append(canvas.toBuffer('image/jpeg'), { name: `page-${i}.jpg` });
      }
      
      await archive.finalize();
      output.on('close', () => {
        trackFile(req, req.file, zipPath, 'pdf-to-jpg');
        sendFileResponse(res, zipPath, 'pages.zip', 'application/zip');
      });
    } else {
      const page = await pdfDoc.getPage(1);
      let vp = page.getViewport({ scale: 2.0 });
      
      if (vp.width > 4000 || vp.height > 4000) {
        vp = page.getViewport({ scale: 4000 / Math.max(vp.width/2.0, vp.height/2.0) });
      }

      const canvas = createCanvas(Math.floor(vp.width), Math.floor(vp.height));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      await page.render({ canvasContext: ctx, viewport: vp, canvasFactory }).promise;
      const outPath = path.join(UPLOAD_DIR, `page1_${uuidv4()}.jpg`);
      fs.writeFileSync(outPath, canvas.toBuffer('image/jpeg'));
      trackFile(req, req.file, outPath, 'pdf-to-jpg');
      sendFileResponse(res, outPath, 'page-1.jpg', 'image/jpeg');
    }
  } catch (err) {
    console.error('[pdf-to-jpg] Overall route error:', err);
    res.status(500).json({ error: 'Failed to convert PDF to JPG', details: err.message });
  }
});

router.post('/html-to-pdf', optionalAuth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const html = fs.readFileSync(req.file.path, 'utf8');
    const text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const pdfDoc = await textToPDF(text || '(Empty HTML)');
    const outPath = path.join(UPLOAD_DIR, `converted_${uuidv4()}.pdf`);
    fs.writeFileSync(outPath, await pdfDoc.save());
    trackFile(req, req.file, outPath, 'html-to-pdf');
    sendFileResponse(res, outPath, 'converted.pdf', 'application/pdf');
  } catch (err) {
    console.error('[html-to-pdf]', err.message);
    res.status(500).json({ error: 'Failed to convert HTML to PDF' });
  }
});

module.exports = router;
