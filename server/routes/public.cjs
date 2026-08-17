const express = require('express');
const router = express.Router();
const { queryAsync } = require('../config/db.cjs');
const { verifyToken } = require('../middleware/auth.cjs');
const { checkPermission } = require('../middleware/rbac.cjs');

router.get('/jadwal', async (req, res) => {
  try {
    const rows = await queryAsync('SELECT * FROM `jadwal_layanan` ORDER BY `tanggal` ASC');
    return res.json({ data: rows, error: null });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil jadwal.' });
  }
});

router.get('/notifikasi', async (req, res) => {
  try {
    const rows = await queryAsync('SELECT * FROM `notifikasi` ORDER BY `created_at` DESC LIMIT 10');
    return res.json({ data: rows, error: null });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil notifikasi.' });
  }
});

router.get('/pengaturan', async (req, res) => {
  try {
    const rows = await queryAsync('SELECT * FROM `pengaturan_sistem` WHERE id = 1');
    return res.json({ data: rows[0] || null, error: null });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil pengaturan.' });
  }
});

router.post('/pengaturan', verifyToken, checkPermission, async (req, res) => {
  // Ditangani oleh /api/query dengan table: pengaturan_sistem,
  // Rute ini hanya placeholder agar sama dengan API server.cjs lama jika dipanggil langsung
  return res.status(200).json({ message: "Gunakan /api/query untuk mengupdate pengaturan." });
});

router.get('/skdn', async (req, res) => {
  try {
    const balita = await queryAsync('SELECT * FROM `balita` WHERE `status_aktif` = 1');

    const { year, month } = req.query;
    let penimbangan;
    if (year && month) {
      penimbangan = await queryAsync(
        'SELECT * FROM `penimbangan` WHERE YEAR(`tanggal_ukur`) = ? AND MONTH(`tanggal_ukur`) = ?',
        [parseInt(year), parseInt(month)]
      );
    } else {
      penimbangan = await queryAsync('SELECT * FROM `penimbangan`');
    }
    return res.json({ data: { balita, penimbangan }, error: null });
  } catch (err) {
    return res.status(500).json({ error: 'Gagal mengambil data SKDN.' });
  }
});

module.exports = router;
