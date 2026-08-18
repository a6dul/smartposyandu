const bcrypt = require('bcryptjs');
const { queryAsync, db } = require('./config/db.cjs');

const kaders = [
  "Nurhasanah",
  "Sri Wahyuni Lubis",
  "Samniar Bako",
  "Lela Safitri",
  "Tika Kartika",
  "Tri Astuti",
  "Afrina Ariani",
  "Fauzi Afleni",
  "Parianti",
  "Sumiati",
  "Indayani",
  "Fitriani"
];

async function create() {
  try {
    for (const nama of kaders) {
      // Membuat email dari nama, misal "Sri Wahyuni Lubis" -> "sri.wahyuni.lubis@kader.com"
      const email = nama.toLowerCase().replace(/\s+/g, '.') + '@kader.com';
      const password = 'password123'; // Default password
      const hashed = await bcrypt.hash(password, 10);
      
      const newId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      // Check if exists
      const existing = await queryAsync('SELECT id FROM `profiles` WHERE `email` = ?', [email]);
      if (existing.length === 0) {
        await queryAsync(
          'INSERT INTO `profiles` (`id`, `nama_lengkap`, `email`, `telepon`, `password`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, NOW())',
          [newId, nama, email, null, hashed, 'kader']
        );
        console.log(`✅ Dibuat: ${nama} | Email: ${email} | Password: ${password}`);
      } else {
        console.log(`⚠️  Sudah ada: ${nama} | Email: ${email}`);
      }
    }
    console.log('Selesai membuat akun kader.');
  } catch (err) {
    console.error(err);
  } finally {
    db.end(); // Tutup koneksi
  }
}

create();
