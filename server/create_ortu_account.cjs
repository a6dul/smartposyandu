require('dotenv').config();
const bcrypt = require('bcryptjs');
const { queryAsync, db } = require('./config/db.cjs');

// ===== DATA ORANG TUA =====
const NAMA_IBU    = 'INDAH SAPUTRI';
const EMAIL       = 'indah.saputri@orangtua.com';
const TELEPON     = null; // isi jika ada, contoh: '08123456789'
const PASSWORD    = 'posyandu123';

// ===== DATA ANAK (untuk linking) =====
const NIK_ANAK   = '1271120509250006';
// ==========================

async function createOrtuAccount() {
  try {
    // 1. Cek akun sudah ada atau belum
    const existing = await queryAsync(
      'SELECT id FROM profiles WHERE email = ?',
      [EMAIL]
    );

    let ortuId;

    if (existing.length > 0) {
      ortuId = existing[0].id;
      console.log(`⚠️  Akun sudah ada: ${EMAIL} (ID: ${ortuId})`);
    } else {
      // 2. Buat akun baru
      const hashed = await bcrypt.hash(PASSWORD, 10);
      ortuId = `usr-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

      await queryAsync(
        'INSERT INTO `profiles` (`id`, `nama_lengkap`, `email`, `telepon`, `password`, `role`, `created_at`) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [ortuId, NAMA_IBU, EMAIL, TELEPON, hashed, 'orang_tua']
      );
      console.log(`✅ Akun berhasil dibuat:`);
      console.log(`   Nama     : ${NAMA_IBU}`);
      console.log(`   Email    : ${EMAIL}`);
      console.log(`   Password : ${PASSWORD}`);
      console.log(`   Role     : orang_tua`);
      console.log(`   ID       : ${ortuId}`);
    }

    // 3. Cari balita berdasarkan NIK
    const balita = await queryAsync(
      'SELECT id, nama_lengkap, nik, id_orang_tua FROM balita WHERE nik = ?',
      [NIK_ANAK]
    );

    if (balita.length === 0) {
      console.log(`\n❌ Balita dengan NIK ${NIK_ANAK} tidak ditemukan di database!`);
      db.end();
      return;
    }

    const anak = balita[0];
    console.log(`\n✅ Balita ditemukan:`);
    console.log(`   Nama     : ${anak.nama_lengkap}`);
    console.log(`   NIK      : ${anak.nik}`);
    console.log(`   ID       : ${anak.id}`);
    console.log(`   id_orang_tua saat ini: ${anak.id_orang_tua || '(kosong)'}`);

    // 4. Update id_orang_tua di tabel balita
    await queryAsync(
      'UPDATE balita SET id_orang_tua = ? WHERE nik = ?',
      [ortuId, NIK_ANAK]
    );

    console.log(`\n🔗 Berhasil menghubungkan akun ke anak:`);
    console.log(`   ${NAMA_IBU}  →  ${anak.nama_lengkap}`);
    console.log(`\n📋 Info Login:`);
    console.log(`   Email    : ${EMAIL}`);
    console.log(`   Password : ${PASSWORD}`);

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    db.end();
  }
}

createOrtuAccount();
