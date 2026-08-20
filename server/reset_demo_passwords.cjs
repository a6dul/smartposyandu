require('dotenv').config();
const bcrypt = require('bcryptjs');
const { queryAsync, db } = require('./config/db.cjs');

async function resetDemoPasswords() {
  try {
    const hashed = await bcrypt.hash('demo123', 10);
    
    const accounts = [
      { email: 'admin@smartposyandu.id', role: 'Administrator' },
      { email: 'kader@smartposyandu.id', role: 'Kader' },
    ];

    for (const acc of accounts) {
      const rows = await queryAsync('SELECT id FROM profiles WHERE email = ?', [acc.email]);
      if (rows.length > 0) {
        await queryAsync('UPDATE profiles SET password = ? WHERE email = ?', [hashed, acc.email]);
        console.log(`✅ Password reset: ${acc.email} (${acc.role}) -> 'demo123'`);
      } else {
        console.log(`❌ Tidak ditemukan: ${acc.email}`);
      }
    }

    console.log('\nSelesai! Gunakan password: demo123');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    db.end();
  }
}

resetDemoPasswords();
