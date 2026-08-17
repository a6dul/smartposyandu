const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'smartposyandu-jwt-secret-2025-changeme-in-production';
const JWT_EXPIRES = '24h';
const BCRYPT_ROUNDS = 10;

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan. Silakan login.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Sesi telah berakhir. Silakan login ulang.' });
    }
    return res.status(401).json({ error: 'Token tidak valid. Silakan login ulang.' });
  }
};

module.exports = {
  verifyToken,
  JWT_SECRET,
  JWT_EXPIRES,
  BCRYPT_ROUNDS
};
