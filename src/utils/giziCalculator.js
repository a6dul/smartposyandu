/**
 * Fungsi pembantu (helper) untuk menghitung status gizi anak secara otomatis
 * berdasarkan pendekatan rumus standar / persentil WHO (disederhanakan untuk keperluan demo).
 */

export const hitungUmurBulan = (tanggalLahir) => {
  if (!tanggalLahir) return 0;
  const lahir = new Date(tanggalLahir);
  const sekarang = new Date();
  
  let bulan = (sekarang.getFullYear() - lahir.getFullYear()) * 12;
  bulan -= lahir.getMonth();
  bulan += sekarang.getMonth();
  
  return bulan < 0 ? 0 : bulan;
};

export const calculateStatusGizi = (bb, tb, umurBulan, jenisKelamin) => {
  const berat = parseFloat(bb);
  const tinggi = parseFloat(tb);
  
  if (!berat || !tinggi || berat <= 0 || tinggi <= 0) return 'Baik';

  // --- Pendekatan Heuristic Sederhana ---
  // Ideal kasar: bayi baru lahir ~3.3kg. Umur 1 tahun (12 bln) ~9.5kg.
  // Formula kasar BB ideal (kg) = (umurBulan / 2) + 4
  const idealBBMenurutUmur = (umurBulan / 2) + 4;
  
  // Rasio berat yang diinput terhadap berat ideal
  const rasioBB = berat / idealBBMenurutUmur;

  if (rasioBB < 0.7) {
    return 'Buruk'; // Jauh di bawah standar
  } else if (rasioBB < 0.85) {
    return 'Kurang'; // Agak kurang
  } else if (rasioBB > 1.3) {
    return 'Lebih'; // Overweight / Obesitas
  }
  
  return 'Baik'; // Normal
};
