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

async function updateToUsername() {
  try {
    for (const nama of kaders) {
      // Ambil kata pertama (nama depan) dan jadikan lowercase, tanpa @pos.id
      const username = nama.split(' ')[0].toLowerCase();
      
      await queryAsync(
        'UPDATE `profiles` SET `email` = ? WHERE `nama_lengkap` = ? AND `role` = "kader"',
        [username, nama]
      );
      
      console.log(`✅ Username diupdate: ${nama} -> Login dengan: ${username}`);
    }
    console.log('Selesai.');
  } catch (err) {
    console.error(err);
  } finally {
    db.end();
  }
}

updateToUsername();
