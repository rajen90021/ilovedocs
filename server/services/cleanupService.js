const fs = require('fs');
const path = require('path');
const { getDB } = require('./database');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

function cleanExpiredFiles() {
  try {
    const db = getDB();
    const now = new Date().toISOString();

    // Find expired file records
    const expiredFiles = db.prepare(
      `SELECT stored_name, output_path FROM files WHERE expires_at < ? AND status != 'deleted'`
    ).all(now);

    let cleaned = 0;
    for (const file of expiredFiles) {
      // Delete input file
      try {
        const inputPath = path.join(UPLOAD_DIR, file.stored_name);
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      } catch (e) { /* ignore */ }

      // Delete output file
      try {
        if (file.output_path && fs.existsSync(file.output_path)) {
          fs.unlinkSync(file.output_path);
        }
      } catch (e) { /* ignore */ }

      cleaned++;
    }

    // Mark as deleted in DB
    if (expiredFiles.length > 0) {
      db.prepare(
        `UPDATE files SET status = 'deleted' WHERE expires_at < ? AND status != 'deleted'`
      ).run(now);
    }

    if (cleaned > 0) {
      console.log(`[Cleanup] Removed ${cleaned} expired file(s)`);
    }
  } catch (err) {
    console.error('[Cleanup] Error:', err.message);
  }
}

function getExpiryDate(minutes = 60) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + (minutes || 60));
  return d.toISOString();
}

module.exports = { cleanExpiredFiles, getExpiryDate };
