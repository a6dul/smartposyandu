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

async function update() {
  try {
    for (const nama of kaders) {
      // Ambil kata pertama (nama depan) dan jadikan lowercase
      const namaDepan = nama.split(' ')[0].toLowerCase();
      // Buat domain yang sangat pendek
      const newEmail = `${namaDepan}@pos.id`;
      
      await queryAsync(
        'UPDATE `profiles` SET `email` = ? WHERE `nama_lengkap` = ? AND `role` = "kader"',
        [newEmail, nama]
      );
      
      console.log(`✅ Diupdate: ${nama} -> Email: ${newEmail}`);
    }
    console.log('Selesai mengupdate email kader ke versi singkat.');
  } catch (err) {
    console.error(err);
  } finally {
    db.end(); // Tutup koneksi
  }
}

update();
