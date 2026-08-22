require('dotenv').config();
const bcrypt = require('bcryptjs');
const { queryAsync } = require('./config/db.cjs');

async function createDemoAccounts() {
  const demos = [
    { email: 'admin@demo.com', nama: 'Demo Admin', role: 'administrator' },
    { email: 'kader@demo.com', nama: 'Demo Kader', role: 'kader' },
    { email: 'ortu@demo.com', nama: 'Demo Orang Tua', role: 'orang_tua' }
  ];

  try {
    const hashed = await bcrypt.hash('demo123', 10);
    
    // Cek apakah kolom status_aktif ada
    const tableInfo = await queryAsync("SHOW COLUMNS FROM `profiles` LIKE 'status_aktif'");
    const hasStatusAktif = tableInfo.length > 0;

    for (const d of demos) {
      // Cek apakah sudah ada
      const existing = await queryAsync('SELECT id FROM profiles WHERE email = ?', [d.email]);
      if (existing.length === 0) {
        const newId = `usr-demo-${d.role}-${Date.now()}`;
        
        if (hasStatusAktif) {
          await queryAsync(
            'INSERT INTO `profiles` (`id`, `nama_lengkap`, `email`, `password`, `role`, `status_aktif`, `created_at`) VALUES (?, ?, ?, ?, ?, 1, NOW())',
            [newId, d.nama, d.email, hashed, d.role]
          );
        } else {
          await queryAsync(
            'INSERT INTO `profiles` (`id`, `nama_lengkap`, `email`, `password`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())',
            [newId, d.nama, d.email, hashed, d.role]
          );
        }
        
        console.log(`✅ Akun demo berhasil dibuat: ${d.email} | Role: ${d.role} | Password: demo123`);
      } else {
        console.log(`⚠️ Akun demo sudah ada: ${d.email}`);
      }
    }
    console.log('Selesai!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createDemoAccounts();
