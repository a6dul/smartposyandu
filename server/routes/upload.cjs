const express = require('express');
const router = express.Router();
const { verifyToken, checkDemoRestriction } = require('../middleware/auth.cjs');
const { upload } = require('../config/multer.cjs');

router.post('/foto-balita', verifyToken, checkDemoRestriction, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Tidak ada file yang diunggah.' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ data: { url: fileUrl }, error: null });
  } catch (err) {
    console.error('Error Upload:', err.message);
    return res.status(500).json({ error: err.message || 'Gagal mengupload file.' });
  }
});

module.exports = router;
