const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10kb' })); // Batasi ukuran request body

// Serve uploaded files statically
const { uploadsDir } = require('./config/multer');
app.use('/uploads', express.static(uploadsDir));

// Routes
const authRoutes = require('./routes/auth');
const queryRoutes = require('./routes/query');
const uploadRoutes = require('./routes/upload');
const publicRoutes = require('./routes/public');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/public', publicRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server SmartPosyandu berjalan di http://localhost:${PORT}`);
  console.log(`🔐 Fitur keamanan aktif: bcrypt, JWT, validasi input, RBAC server-side`);
  console.log(`📁 Upload folder: ${uploadsDir}`);
});
