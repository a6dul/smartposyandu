const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { db, queryAsync } = require('../config/db.cjs');
const { verifyToken, checkDemoRestriction, JWT_SECRET, JWT_EXPIRES, BCRYPT_ROUNDS } = require('../middleware/auth.cjs');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }
  if (typeof email !== 'string' || email.length > 150) {
    return res.status(400).json({ error: 'Format input tidak valid.' });
  }
  if (typeof password !== 'string' || password.length > 128) {
    return res.status(400).json({ error: 'Password tidak valid.' });
  }

  try {
    const rows = await queryAsync('SELECT * FROM `profiles` WHERE `email` = ?', [email.trim().toLowerCase()]);

    if (rows.length === 0) {
      return res.status(400).json({ error: 'Email atau password salah.' });
    }

    const user = rows[0];
    let passwordMatch = false;

    const isHashed = user.password && (user.password.startsWith('$2b$') || user.password.startsWith('$2a$'));

    if (!isHashed) {
      if (user.password === password) {
        const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
        await queryAsync('UPDATE `profiles` SET `password` = ? WHERE `id` = ?', [hashed, user.id]);
        passwordMatch = true;
        console.log(`🔐 [Security] Password '${email}' otomatis di-migrate ke bcrypt hash.`);
      }
    } else {
      passwordMatch = await bcrypt.compare(password, user.password);
    }

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Email atau password salah.' });
    }

    const tokenPayload = { id: user.id, email: user.email, role: user.role };
    const access_token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    console.log(`✅ Login berhasil: ${user.email} (${user.role})`);

    return res.json({
      user: { id: user.id, email: user.email },
      profile: {
        id: user.id,
        email: user.email,
        nama_lengkap: user.nama_lengkap,
        role: user.role,
        telepon: user.telepon,
        created_at: user.created_at
      },
      access_token,
      error: null
    });
  } catch (err) {
    console.error('Error Auth:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.get('/verify', verifyToken, async (req, res) => {
  try {
    const rows = await queryAsync('SELECT id, email, nama_lengkap, role, telepon, created_at FROM `profiles` WHERE `id` = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'User tidak ditemukan.' });
    }
    return res.json({ profile: rows[0], error: null });
  } catch (err) {
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.post('/change-password', verifyToken, checkDemoRestriction, async (req, res) => {
  const { password_lama, password_baru } = req.body;

  if (!password_lama || !password_baru) {
    return res.status(400).json({ error: 'Password lama dan baru wajib diisi.' });
  }
  if (password_baru.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter.' });
  }

  try {
    const rows = await queryAsync('SELECT password FROM `profiles` WHERE `id` = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan.' });
    }

    const user = rows[0];
    const isHashed = user.password && user.password.startsWith('$2b$');
    let match = isHashed
      ? await bcrypt.compare(password_lama, user.password)
      : user.password === password_lama;

    if (!match) {
      return res.status(400).json({ error: 'Password lama tidak sesuai.' });
    }

    const hashed = await bcrypt.hash(password_baru, BCRYPT_ROUNDS);
    await queryAsync('UPDATE `profiles` SET `password` = ? WHERE `id` = ?', [hashed, req.user.id]);

    return res.json({ data: true, error: null });
  } catch (err) {
    console.error('Error Change Password:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
  }
});

router.post('/register', async (req, res) => {
  const { nama_lengkap, email, telepon, password } = req.body;
  
  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ error: 'Nama, email, dan password wajib diisi.' });
  }

  try {
    const existing = await queryAsync('SELECT id FROM `profiles` WHERE `email` = ?', [email.trim().toLowerCase()]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar.' });
    }

    const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const newId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    
    await queryAsync(
      'INSERT INTO `profiles` (`id`, `nama_lengkap`, `email`, `telepon`, `password`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [newId, nama_lengkap.trim(), email.trim().toLowerCase(), telepon?.trim() || null, hashed, 'orang_tua']
    );

    return res.json({ data: true, error: null });
  } catch (err) {
    console.error('Error Register:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

router.post('/update-profile', verifyToken, checkDemoRestriction, async (req, res) => {
  const { nama_lengkap, telepon } = req.body;
  if (!nama_lengkap || nama_lengkap.trim() === '') {
    return res.status(400).json({ error: 'Nama lengkap wajib diisi.' });
  }

  try {
    await queryAsync('UPDATE `profiles` SET `nama_lengkap` = ?, `telepon` = ? WHERE `id` = ?', [
      nama_lengkap.trim(),
      telepon?.trim() || null,
      req.user.id
    ]);
    return res.json({ data: true, error: null });
  } catch (err) {
    console.error('Error Update Profile:', err.message);
    return res.status(500).json({ error: 'Terjadi kesalahan pada server saat update profil.' });
  }
});

module.exports = router;
