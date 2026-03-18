const express = require('express');
const path = require('path');
const fs = require('fs');
const { authenticateToken } = require('../middleware/auth');
const { getDB } = require('../services/database');
const { UPLOAD_DIR } = require('../middleware/upload');

const router = express.Router();

// GET /api/files — list user's file history
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const files = db.prepare(`
      SELECT id, original_name, mime_type, size, tool_used, status, created_at, expires_at
      FROM files
      WHERE user_id = ? AND status != 'deleted'
      ORDER BY created_at DESC
      LIMIT 50
    `).all(req.user.id);

    res.json({ files });
  } catch (err) {
    console.error('[Files] List error:', err.message);
    res.status(500).json({ error: 'Failed to retrieve files' });
  }
});

// DELETE /api/files/:id
router.delete('/:id', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const file = db.prepare('SELECT * FROM files WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);

    if (!file) return res.status(404).json({ error: 'File not found' });

    // Delete physical files
    try {
      const inputPath = path.join(UPLOAD_DIR, file.stored_name);
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    } catch (e) { /* ignore */ }

    try {
      if (file.output_path && fs.existsSync(file.output_path)) fs.unlinkSync(file.output_path);
    } catch (e) { /* ignore */ }

    db.prepare("UPDATE files SET status = 'deleted' WHERE id = ?").run(file.id);

    res.json({ message: 'File deleted successfully' });
  } catch (err) {
    console.error('[Files] Delete error:', err.message);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// GET /api/files/stats
router.get('/stats', authenticateToken, (req, res) => {
  try {
    const db = getDB();
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total_operations,
        tool_used,
        COUNT(*) as count
      FROM files
      WHERE user_id = ? AND status != 'deleted'
      GROUP BY tool_used
      ORDER BY count DESC
    `).all(req.user.id);

    const total = db.prepare(`SELECT COUNT(*) as c FROM files WHERE user_id = ? AND status != 'deleted'`).get(req.user.id);

    res.json({ stats, total: total.c });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
