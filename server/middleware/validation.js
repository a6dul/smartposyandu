const ALLOWED_FIELDS = {
  profiles: ['id', 'email', 'password', 'nama_lengkap', 'role', 'telepon', 'created_at'],
  balita: ['id', 'nama_lengkap', 'nik', 'jenis_kelamin', 'tanggal_lahir', 'nama_ibu', 'nama_ayah', 'alamat', 'id_orang_tua', 'status_aktif', 'foto', 'created_at', 'updated_at'],
  penimbangan: ['id', 'id_balita', 'tanggal_ukur', 'berat_badan', 'tinggi_badan', 'lingkar_kepala', 'lingkar_lengan', 'status_gizi', 'keterangan', 'id_kader', 'created_at'],
  ibu_hamil: ['id', 'nama_lengkap', 'nik', 'usia', 'alamat', 'nama_suami', 'telepon', 'usia_kandungan', 'hpht', 'hpl', 'jumlah_anc', 'status_risiko', 'golongan_darah', 'status_aktif', 'created_at'],
  ibu_menyusui: ['id', 'nama_lengkap', 'nik', 'usia', 'alamat', 'nama_bayi', 'usia_bayi', 'telepon', 'status_asi', 'kendala', 'status_aktif', 'created_at'],
  audit_logs: ['id', 'id_user', 'nama_user', 'aksi', 'modul', 'deskripsi', 'created_at'],
  pengaturan_sistem: ['id', 'nama_posyandu', 'alamat_lengkap', 'desa_kelurahan', 'kecamatan', 'kota_kabupaten', 'provinsi', 'kontak_telepon', 'updated_at'],
  jadwal_layanan: ['id', 'tanggal', 'hari', 'waktu', 'tempat', 'kegiatan', 'badge', 'created_at'],
  notifikasi: ['id', 'tipe', 'judul', 'pesan', 'icon', 'color_class', 'bg_class', 'created_at'],
};

// Field yang wajib ada saat INSERT per tabel
const REQUIRED_FIELDS = {
  balita: ['nama_lengkap', 'jenis_kelamin', 'tanggal_lahir', 'nama_ibu'],
  penimbangan: ['id_balita', 'tanggal_ukur', 'berat_badan', 'tinggi_badan'],
  ibu_hamil: ['nama_lengkap'],
  ibu_menyusui: ['nama_lengkap'],
};

// Sanitasi payload: hanya field yang ada di whitelist, trim string, buang null key
const sanitizePayload = (table, data) => {
  const allowed = ALLOWED_FIELDS[table] || [];
  const sanitized = {};
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const val = data[key];
      if (val === null || val === undefined) {
        sanitized[key] = null;
      } else if (typeof val === 'string') {
        sanitized[key] = val.trim().substring(0, 500); // max 500 char
      } else {
        sanitized[key] = val;
      }
    }
  }
  return sanitized;
};

// Validasi field wajib saat INSERT
const validateRequired = (table, data) => {
  const required = REQUIRED_FIELDS[table] || [];
  const missing = required.filter(f => !data[f] || String(data[f]).trim() === '');
  return missing;
};

module.exports = {
  ALLOWED_FIELDS,
  REQUIRED_FIELDS,
  sanitizePayload,
  validateRequired
};
