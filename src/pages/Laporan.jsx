import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, Legend } from 'recharts';

// Generate dynamic 6 months back
const getBulanList = () => {
  const list = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    list.push(d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }));
  }
  return list;
};
const bulanOptions = getBulanList();

// ── Konfirmasi WhatsApp ──────────────────────────────────────────
const ConfirmWhatsApp = ({ bulan, tipe, kontak_telepon, onConfirm, onClose }) => (
  <div className="pb-2 space-y-4">
    <div className="p-4 bg-primary-container/10 rounded-xl border border-primary/20 flex items-start gap-3">
      <span className="material-symbols-outlined text-primary text-[28px] shrink-0">send</span>
      <div>
        <p className="font-bold text-primary">Kirim via WhatsApp?</p>
        <p className="text-sm text-on-surface-variant mt-1">
          <strong>{tipe}</strong> bulan <strong>{bulan}</strong> akan dikirim ke nomor Bidan Desa dan Dinas Kesehatan yang terdaftar.
        </p>
      </div>
    </div>
    <div className="p-4 bg-surface-container-low rounded-xl space-y-2">
      <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Penerima</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-on-surface">Bidan Desa / Dinkes</p>
          <p className="text-xs text-on-surface-variant">Tujuan Utama</p>
        </div>
        <span className="text-xs text-on-surface-variant font-mono">{kontak_telepon || 'Belum diatur'}</span>
      </div>
    </div>
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      <button onClick={onClose} className="flex-1 h-12 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors text-sm">Batal</button>
      <button onClick={onConfirm} className="flex-1 h-12 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-md text-sm flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">send</span>
        Ya, Kirim Sekarang
      </button>
    </div>
  </div>
);

// ── Modal Cetak PDF ────────────────────────────────────────────────
const PeriodeModal = ({ defaultBulan, defaultTipe, onClose, onGenerate }) => {
  const [bulan, setBulan] = useState(defaultBulan || bulanOptions[0]);
  const [tipe, setTipe] = useState(defaultTipe || 'SKDN Bulanan');
  return (
    <div className="pb-2 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-bold text-on-surface">Pilih Bulan</label>
        <select value={bulan} onChange={e => setBulan(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none bg-surface text-sm transition-all">
          {bulanOptions.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-bold text-on-surface">Tipe Laporan</label>
        <div className="space-y-2">
          {['SKDN Bulanan', 'Laporan Gizi Buruk'].map(t => (
            <label key={t} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${tipe === t ? 'border-secondary bg-secondary-container/10' : 'border-outline-variant hover:bg-surface-container-low'}`}>
              <input type="radio" name="tipe" value={t} checked={tipe === t} onChange={() => setTipe(t)} className="mr-3 text-secondary" />
              <span className="font-semibold">{t}</span>
            </label>
          ))}
        </div>
      </div>
      <button onClick={() => onGenerate(bulan, tipe)}
        className="w-full h-11 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>
        Generate &amp; Cetak
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN LAPORAN COMPONENT
// ═══════════════════════════════════════════════════════════════
const Laporan = () => {
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [bulanAktif, setBulanAktif] = useState(bulanOptions[0]);
  const [tipeLaporan, setTipeLaporan] = useState('SKDN Bulanan');
  const [posyanduInfo, setPosyanduInfo] = useState({});
  const [skdn, setSkdn] = useState({ S: 0, K: 0, D: 0, N: 0, partisipasi: '0%', rincian: [], giziBuruk: [] });

  const showToast = (msg, type = 'success') => setToast({ msg, type });
  
  const handleKirimWA = () => {
    setModal(null);
    let hp = posyanduInfo.kontak_telepon;
    if (!hp) {
      showToast('Nomor WhatsApp belum diatur di Pengaturan!', 'error');
      return;
    }
    
    // Format nomor HP (ubah 0 jadi 62)
    hp = hp.replace(/\D/g, '');
    if (hp.startsWith('0')) hp = '62' + hp.substring(1);
    
    // Siapkan pesan
    const namaPosyandu = posyanduInfo.nama_posyandu || 'Posyandu';
    let text = `Halo, berikut adalah ringkasan laporan *${tipeLaporan}* dari ${namaPosyandu} untuk periode *${bulanAktif}*.\n\n`;
    
    if (tipeLaporan === 'SKDN Bulanan') {
      text += `*Indikator SKDN:*\n`;
      text += `- S (Semua Balita): ${skdn.S}\n`;
      text += `- K (Kartu KMS): ${skdn.K}\n`;
      text += `- D (Datang Ditimbang): ${skdn.D}\n`;
      text += `- N (Naik Berat Badan): ${skdn.N}\n\n`;
      text += `Tingkat Partisipasi: ${skdn.partisipasi}\n\n`;
    } else {
      text += `*Status Gizi Bermasalah:*\n`;
      text += `Terdapat ${skdn.giziBuruk.length} balita yang memerlukan perhatian/PMT.\n\n`;
    }
    
    text += `Silakan buka aplikasi SmartPosyandu untuk mengunduh dokumen PDF lengkapnya. Terima kasih.`;
    
    const waUrl = `https://wa.me/${hp}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    
    showToast('Membuka WhatsApp...', 'success');
  };

  // ── Export PDF ──────────────────────────────────────────────
  const handleGenerate = (bulan, tipe) => {
    setBulanAktif(bulan);
    setTipeLaporan(tipe);
    setModal(null);
    showToast(`Menyiapkan ${tipe} – ${bulan}...`, 'info');

    setTimeout(async () => {
      try {
        const doc = new jsPDF();
        const nama = posyanduInfo.nama_posyandu || 'Posyandu';
        const desa = posyanduInfo.desa_kelurahan || 'Desa';
        const kec = posyanduInfo.kecamatan || '';
        const kab = posyanduInfo.kota_kabupaten || '';
        const namaPos = nama.replace(/\s+/g, '_');

        // Header
        doc.setFontSize(14);
        doc.setTextColor(0, 109, 64);
        doc.text(tipe === 'SKDN Bulanan' ? 'LAPORAN REKAPITULASI SKDN' : 'LAPORAN STATUS GIZI BALITA', 14, 18);
        doc.setFontSize(10);
        doc.setTextColor(30, 30, 30);
        doc.text(`${nama.toUpperCase()} - ${desa.toUpperCase()}`, 14, 26);
        if (kec || kab) doc.text(`Kecamatan ${kec}, ${kab}`, 14, 32);
        doc.text(`Periode: ${bulan}`, 14, 38);

        // Helper: draw signature block
        const drawSignatures = (doc, startY) => {
          const tanggal = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
          const kotaStr = kab ? kab.replace('Kabupaten ', '').replace('Kota ', '') : '';
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          // Kiri
          doc.text('Mengetahui,', 14, startY);
          doc.text('Bidan Desa', 14, startY + 5);
          doc.line(14, startY + 28, 60, startY + 28);
          doc.setFont(undefined, 'bold');
          doc.text('Bidan Desa', 14, startY + 33);
          // Kanan
          doc.setFont(undefined, 'normal');
          doc.text(`${kotaStr}, ${tanggal}`, 140, startY);
          doc.text('Ketua Kader', 140, startY + 5);
          doc.line(140, startY + 28, 186, startY + 28);
          doc.setFont(undefined, 'bold');
          doc.text('Kader Posyandu', 140, startY + 33);
          doc.setFont(undefined, 'normal');
        };

        if (tipe === 'SKDN Bulanan') {
          const tblSKDN = autoTable(doc, {
            startY: 48,
            head: [['Indikator', 'Jumlah', 'Keterangan']],
            body: [
              ['S (Semua Balita)', String(skdn.S), `${skdn.S} balita terdaftar aktif`],
              ['K (Kartu KMS)', String(skdn.K), `${skdn.K} anak memiliki buku KIA/KMS`],
              ['D (Datang Ditimbang)', String(skdn.D), `Partisipasi: ${skdn.partisipasi}`],
              ['N (Naik Berat Badan)', String(skdn.N), `${skdn.N} anak naik berat badan`]
            ],
            theme: 'grid',
            headStyles: { fillColor: [0, 109, 64], textColor: [255, 255, 255] },
            styles: { fontSize: 10 },
          });

          let curY = (tblSKDN && tblSKDN.finalY ? tblSKDN.finalY : 100) + 12;

          // Analisis Singkat
          doc.setFontSize(11);
          doc.setTextColor(0, 109, 64);
          doc.setFont(undefined, 'bold');
          doc.text('ANALISIS SINGKAT', 14, curY);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          curY += 7;
          const analisis = `Pada bulan ${bulan}, tingkat partisipasi kunjungan balita (D/S) sebesar ${skdn.partisipasi}. Dari ${skdn.D} anak yang hadir, ${skdn.N} anak mengalami kenaikan berat badan.${skdn.D === 0 ? ' Belum ada data penimbangan yang dicatat pada bulan ini.' : ''}`;
          const lines = doc.splitTextToSize(analisis, 180);
          doc.text(lines, 14, curY);
          curY += lines.length * 5 + 10;

          // Grafik
          doc.setFontSize(11);
          doc.setTextColor(0, 109, 64);
          doc.setFont(undefined, 'bold');
          doc.text('GRAFIK SKDN', 14, curY);
          doc.setFont(undefined, 'normal');
          curY += 6;

          const chartEl = document.getElementById('chart-skdn');
          if (chartEl) {
            const canvas = await html2canvas(chartEl, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = 180;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            if (curY + pdfHeight > 270) {
              doc.addPage();
              curY = 20;
            }
            
            doc.addImage(imgData, 'PNG', 14, curY, pdfWidth, pdfHeight);
            curY += pdfHeight + 15;
          }

          // Tanda Tangan
          if (curY > 240) { doc.addPage(); curY = 20; }
          drawSignatures(doc, curY);

          doc.save(`Rekap_SKDN_${namaPos}_${bulan.replace(/ /g, '_')}.pdf`);
        } else {
          // Gizi Buruk
          const sc = {};
          skdn.rincian.forEach(r => { const s = r['Status Gizi']; if (s && s !== '-') sc[s] = (sc[s] || 0) + 1; });
          const tbl1 = autoTable(doc, {
            startY: 48,
            head: [['Status Gizi', 'Jumlah Anak']],
            body: Object.entries(sc).map(([k, v]) => [k, String(v)]),
            theme: 'grid',
            headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255] },
            styles: { fontSize: 10 },
          });

          let curY = (tbl1 && tbl1.finalY ? tbl1.finalY : 100) + 10;

          // Grafik Pie
          const chartEl = document.getElementById('chart-gizi');
          if (chartEl) {
            const canvas = await html2canvas(chartEl, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const imgProps = doc.getImageProperties(imgData);
            const pdfWidth = 120;
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            if (curY + pdfHeight > 270) {
              doc.addPage();
              curY = 20;
            }
            
            doc.addImage(imgData, 'PNG', 45, curY, pdfWidth, pdfHeight);
            curY += pdfHeight + 10;
          }

          if (skdn.giziBuruk.length > 0) {
            if (curY > 240) { doc.addPage(); curY = 20; }
            doc.setFontSize(11);
            doc.setTextColor(185, 28, 28);
            doc.setFont(undefined, 'bold');
            doc.text('DAFTAR BALITA STATUS GIZI BERMASALAH', 14, curY);
            doc.setFont(undefined, 'normal');
            const tbl2 = autoTable(doc, {
              startY: curY + 6,
              head: [['Nama Balita', 'Status Gizi', 'Berat (kg)', 'Keterangan']],
              body: skdn.giziBuruk.map(b => [b.nama, b.status, String(b.berat), b.keterangan]),
              theme: 'grid',
              headStyles: { fillColor: [185, 28, 28], textColor: [255, 255, 255] },
              styles: { fontSize: 10 },
            });
            curY = (tbl2 && tbl2.finalY ? tbl2.finalY : curY + 30) + 10;
          }

          // Rekomendasi
          if (curY > 240) { doc.addPage(); curY = 20; }
          doc.setFontSize(11);
          doc.setTextColor(185, 28, 28);
          doc.setFont(undefined, 'bold');
          doc.text('REKOMENDASI TINDAK LANJUT', 14, curY);
          doc.setFont(undefined, 'normal');
          doc.setFontSize(10);
          doc.setTextColor(30, 30, 30);
          curY += 7;
          const rekom = skdn.giziBuruk.length > 0
            ? `Pada bulan ${bulan}, dari ${skdn.D} balita yang ditimbang terdapat ${skdn.giziBuruk.length} anak dengan status gizi bermasalah. Kader diharapkan melakukan kunjungan rumah dan memberikan Pemberian Makanan Tambahan (PMT) serta berkoordinasi dengan Bidan Desa.`
            : `Pada bulan ${bulan}, status gizi seluruh balita yang ditimbang dalam kondisi baik. Pertahankan program posyandu rutin setiap bulan.`;
          const rekLines = doc.splitTextToSize(rekom, 180);
          doc.text(rekLines, 14, curY);
          curY += rekLines.length * 5 + 14;

          // Tanda Tangan
          if (curY > 240) { doc.addPage(); curY = 20; }
          drawSignatures(doc, curY);

          doc.save(`Gizi_Buruk_${namaPos}_${bulan.replace(/ /g, '_')}.pdf`);
        }
        showToast('PDF berhasil diunduh!', 'success');
      } catch (err) {
        console.error('Gagal membuat PDF:', err);
        showToast('Gagal membuat PDF: ' + err.message, 'error');
      }
    }, 800);
  };

  // ── Export Excel ────────────────────────────────────────────
  const handleExcelExport = () => {
    if (skdn.rincian.length === 0) { showToast('Tidak ada data balita untuk diekspor.', 'warning'); return; }
    showToast('Mengekspor data ke Excel...', 'info');
    const data = tipeLaporan === 'SKDN Bulanan'
      ? skdn.rincian
      : skdn.giziBuruk.map(b => ({ 'Nama Balita': b.nama, 'Status Gizi': b.status, 'Berat (kg)': b.berat, 'Tinggi (cm)': b.tinggi, 'Keterangan': b.keterangan }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tipeLaporan === 'SKDN Bulanan' ? 'Data SKDN' : 'Gizi Buruk');
    const namaPos = (posyanduInfo.nama_posyandu || 'Posyandu').replace(/\s+/g, '_');
    const namaFile = tipeLaporan === 'SKDN Bulanan'
      ? `Rekap_SKDN_${namaPos}_${bulanAktif.replace(/ /g, '_')}.xlsx`
      : `Gizi_Buruk_${namaPos}_${bulanAktif.replace(/ /g, '_')}.xlsx`;
    XLSX.writeFile(wb, namaFile);
    showToast('File Excel berhasil dibuat!', 'success');
  };

  // ── Fetch Data ──────────────────────────────────────────────
  useEffect(() => {
    const fetchSKDN = async () => {
      try {
        const setRes = await fetch('/api/public/pengaturan');
        const setJson = await setRes.json();
        if (setJson.data) setPosyanduInfo(setJson.data);

        const bulanMap = { 'Januari': 1, 'Februari': 2, 'Maret': 3, 'April': 4, 'Mei': 5, 'Juni': 6, 'Juli': 7, 'Agustus': 8, 'September': 9, 'Oktober': 10, 'November': 11, 'Desember': 12 };
        const parts = bulanAktif.split(' ');
        const monthNum = bulanMap[parts[0]];
        const yearNum = parseInt(parts[1]);

        const res = await fetch(`/api/public/skdn?year=${yearNum}&month=${monthNum}`);
        const json = await res.json();

        if (json.data) {
          const allBalita = json.data.balita || [];
          const allPenimbangan = json.data.penimbangan || [];
          const S = allBalita.length;
          const K = allBalita.length;
          const ditimbangIds = new Set(allPenimbangan.map(p => p.id_balita));
          const D = ditimbangIds.size;
          const naikIds = new Set(allPenimbangan.filter(p => p.status_gizi === 'Baik' || p.status_gizi === 'Lebih').map(p => p.id_balita));
          const N = naikIds.size;
          const partisipasi = S > 0 ? `${Math.round((D / S) * 100)}%` : '0%';

          const rincianData = allBalita.map(b => {
            const t = allPenimbangan.find(p => p.id_balita === b.id);
            return { 'Nama Balita': b.nama_lengkap, 'NIK': b.nik || '-', 'Jenis Kelamin': b.jenis_kelamin, 'Nama Ibu': b.nama_ibu, 'Ditimbang (D)': t ? 'Ya' : 'Tidak', 'Berat Badan (kg)': t ? t.berat_badan : '-', 'Tinggi Badan (cm)': t ? t.tinggi_badan : '-', 'Status Gizi': t ? t.status_gizi : '-', 'Keterangan': t ? (t.keterangan || '-') : 'Tidak hadir' };
          });

          const giziBuruk = allPenimbangan
            .filter(p => ['Kurang', 'Buruk', 'Lebih'].includes(p.status_gizi))
            .map(p => {
              const b = allBalita.find(b => b.id === p.id_balita);
              return { nama: b?.nama_lengkap || '-', status: p.status_gizi, berat: p.berat_badan, tinggi: p.tinggi_badan || '-', keterangan: p.keterangan || '-' };
            });

          setSkdn({ S, K, D, N, partisipasi, rincian: rincianData, giziBuruk });
        }
      } catch (err) { console.error('Gagal fetch SKDN:', err); }
    };
    fetchSKDN();
  }, [bulanAktif]);

  // Hitung distribusi status gizi untuk pie chart
  const statusCount = {};
  skdn.rincian.forEach(r => { const s = r['Status Gizi']; if (s && s !== '-') statusCount[s] = (statusCount[s] || 0) + 1; });
  const pieData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = { 'Baik': '#006d40', 'Lebih': '#f59e0b', 'Kurang': '#ef4444', 'Buruk': '#7f1d1d' };

  const isGizi = tipeLaporan === 'Laporan Gizi Buruk';

  return (
    <main className="flex-1 p-4 lg:p-margin-page pb-32 lg:pb-12 max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Title */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-1 mb-6">
        <div>
          <h2 className="text-title-lg font-bold text-on-background">Rekapitulasi Laporan</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Otomatisasi data kesehatan bulanan untuk {posyanduInfo.nama_posyandu}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExcelExport} className="h-11 flex items-center justify-center gap-2 px-5 bg-secondary text-on-secondary rounded-xl text-sm font-bold hover:bg-secondary/90 active:scale-95 transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">file_download</span>Export Excel
          </button>
          <button onClick={() => setModal('cetak')} className="h-11 flex items-center justify-center gap-2 px-5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-md">
            <span className="material-symbols-outlined text-[18px]">picture_as_pdf</span>Cetak Laporan PDF
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-md">
        {/* Filter Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container-lowest p-6 lg:p-8 rounded-xl shadow-sm border border-outline-variant space-y-6">
            <h3 className="text-title-md font-bold text-on-surface">Filter Laporan</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface-variant">Pilih Bulan</label>
                <select value={bulanAktif} onChange={e => setBulanAktif(e.target.value)}
                  className="w-full h-12 text-sm bg-surface-container rounded-lg border-2 border-transparent focus:border-secondary transition-all px-4 outline-none">
                  {bulanOptions.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface">Tipe Laporan</label>
                <div className="grid grid-cols-1 gap-2">
                  {['SKDN Bulanan', 'Laporan Gizi Buruk'].map(t => (
                    <label key={t} onClick={() => setTipeLaporan(t)}
                      className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-colors ${tipeLaporan === t ? 'border-secondary bg-secondary-container/10' : 'border-outline-variant hover:bg-surface-container-low'}`}>
                      <input type="radio" name="rpt" checked={tipeLaporan === t} onChange={() => setTipeLaporan(t)} className="text-secondary focus:ring-secondary mr-3 w-5 h-5" />
                      <span className="font-semibold">{t}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <button onClick={() => setModal('whatsapp')}
                className="w-full min-h-touch-target-min bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center gap-3 font-bold shadow-md hover:scale-[1.02] active:scale-95 transition-all">
                <span className="material-symbols-outlined">send</span>Kirim ke WhatsApp
              </button>
              <p className="text-center text-body-md mt-4 text-on-surface-variant italic">Kirim langsung ke Bidan Desa atau Dinas Kesehatan.</p>
            </div>
          </div>

          {/* Stats Card */}
          {!isGizi ? (
            <div className="bg-tertiary-container text-on-tertiary-container p-6 lg:p-8 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-label-lg font-bold">Partisipasi Balita</span>
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <p className="text-headline-lg font-bold">{skdn.partisipasi}</p>
              <p className="text-body-md">{skdn.D} dari {skdn.S} balita datang ditimbang.</p>
              <div className="w-full bg-on-tertiary-container/20 rounded-full h-2">
                <div className="bg-on-tertiary-container h-2 rounded-full transition-all duration-700" style={{ width: skdn.partisipasi }} />
              </div>
            </div>
          ) : (
            <div className="bg-error-container text-on-error-container p-6 lg:p-8 rounded-xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-label-lg font-bold">Gizi Bermasalah</span>
                <span className="material-symbols-outlined">warning</span>
              </div>
              <p className="text-headline-lg font-bold">{skdn.giziBuruk.length} anak</p>
              <p className="text-body-md">Status Kurang/Buruk/Lebih dari {skdn.D} yang ditimbang bulan ini.</p>
            </div>
          )}
        </div>

        {/* Report Preview */}
        <div className="lg:col-span-8">
          <div className="bg-white rounded-xl shadow-lg border border-outline-variant min-h-[800px] p-4 sm:p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 hidden sm:block">
              <span className="material-symbols-outlined text-[120px]">{isGizi ? 'monitor_weight' : 'health_and_safety'}</span>
            </div>

            {/* Header dokumen */}
            <div className={`border-b-4 ${isGizi ? 'border-error' : 'border-primary'} pb-6 mb-8 flex flex-col md:flex-row justify-between items-start gap-4 relative z-10`}>
              <div className="space-y-1">
                <h4 className={`text-headline-md font-bold ${isGizi ? 'text-error' : 'text-primary'}`}>
                  {isGizi ? 'LAPORAN STATUS GIZI BALITA' : 'LAPORAN REKAPITULASI SKDN'}
                </h4>
                <p className="text-body-lg font-bold uppercase">{posyanduInfo.nama_posyandu} - {posyanduInfo.desa_kelurahan}</p>
                <p className="text-body-md text-on-surface-variant">Kecamatan {posyanduInfo.kecamatan || '-'}, {posyanduInfo.kota_kabupaten || '-'}</p>
              </div>
              <div className="text-left md:text-right">
                <p className="text-label-lg font-bold">Periode:</p>
                <p className="text-headline-md font-bold text-on-surface">{bulanAktif}</p>
              </div>
            </div>

            <div className="space-y-8 relative z-10">

              {/* ══ SKDN VIEW ══ */}
              {!isGizi && (<>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[400px]">
                    <thead>
                      <tr className="bg-surface-container-high border-b-2 border-outline">
                        <th className="p-4 font-bold text-label-lg">Indikator</th>
                        <th className="p-4 font-bold text-label-lg text-center">Jumlah</th>
                        <th className="p-4 font-bold text-label-lg">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="text-body-md">
                      {[
                        { ind: 'S (Semua Balita)', jml: skdn.S, ket: `${skdn.S} balita terdaftar aktif di wilayah`, highlight: false },
                        { ind: 'K (Kartu KMS)', jml: skdn.K, ket: `${skdn.K} anak memiliki buku KIA/KMS`, highlight: true },
                        { ind: 'D (Datang Ditimbang)', jml: skdn.D, ket: skdn.D === 0 ? 'Belum ada data penimbangan bulan ini' : `${skdn.D} dari ${skdn.S} anak hadir (${skdn.partisipasi})`, highlight: false, ketColor: skdn.D > 0 ? 'text-primary font-bold' : 'text-error' },
                        { ind: 'N (Naik Berat Badan)', jml: skdn.N, ket: skdn.D === 0 ? 'Belum ada data penimbangan' : `${skdn.N} anak naik berat badan (status Baik/Lebih)`, highlight: true },
                      ].map(row => (
                        <tr key={row.ind} className={`border-b border-outline-variant ${row.highlight ? 'bg-surface-container-lowest' : ''}`}>
                          <td className="p-4 font-semibold">{row.ind}</td>
                          <td className="p-4 text-center font-bold">{row.jml}</td>
                          <td className={`p-4 ${row.ketColor || ''}`}>{row.ket}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="space-y-3">
                  <h5 className="text-label-lg font-bold border-l-4 border-secondary pl-3 uppercase tracking-wider">Analisis Singkat</h5>
                  <p className="text-body-lg leading-relaxed text-on-surface">
                    Pada bulan {bulanAktif}, tingkat partisipasi kunjungan balita (D/S) sebesar <strong>{skdn.partisipasi}</strong>.
                    {skdn.D > 0 && ` Dari ${skdn.D} anak yang hadir, ${skdn.N} anak mengalami kenaikan berat badan.`}
                    {skdn.D === 0 && ' Belum ada data penimbangan yang dicatat pada bulan ini.'}
                  </p>
                </div>

                <div id="chart-skdn" className="h-64 w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm bg-white">
                  <ResponsiveContainer width="100%" height="100%">

                    <BarChart data={[{ name: 'S', jumlah: skdn.S }, { name: 'K', jumlah: skdn.K }, { name: 'D', jumlah: skdn.D }, { name: 'N', jumlah: skdn.N }]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                      <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 'bold', fill: '#4a4a4a' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: '#4a4a4a' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="jumlah" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                        {['#006d40', '#005230', '#14a366', '#66e8a8'].map((fill, i) => <Cell key={i} fill={fill} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </>)}

              {/* ══ GIZI BURUK VIEW ══ */}
              {isGizi && (<>
                {/* Pie chart */}
                {pieData.length > 0 ? (
                  <div id="chart-gizi" className="h-72 w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm bg-white">
                    <p className="text-label-lg font-bold text-center mb-1">Distribusi Status Gizi Balita — {bulanAktif}</p>

                    <ResponsiveContainer width="100%" height="90%">
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} isAnimationActive={false}>
                          {pieData.map((entry, i) => <Cell key={i} fill={PIE_COLORS[entry.name] || '#aaa'} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant">
                    <p className="text-on-surface-variant font-semibold">Tidak ada data penimbangan pada bulan ini</p>
                  </div>
                )}

                {/* Ringkasan kartu */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Gizi Baik', count: statusCount['Baik'] || 0, color: 'bg-primary-container text-on-primary-container', icon: 'check_circle' },
                    { label: 'Gizi Lebih', count: statusCount['Lebih'] || 0, color: 'bg-amber-100 text-amber-800', icon: 'arrow_upward' },
                    { label: 'Gizi Kurang', count: statusCount['Kurang'] || 0, color: 'bg-error-container text-on-error-container', icon: 'arrow_downward' },
                    { label: 'Gizi Buruk', count: statusCount['Buruk'] || 0, color: 'bg-red-900 text-white', icon: 'crisis_alert' },
                  ].map(s => (
                    <div key={s.label} className={`${s.color} rounded-xl p-4 text-center shadow-sm`}>
                      <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                      <p className="text-headline-md font-bold">{s.count}</p>
                      <p className="text-xs font-semibold">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Tabel anak bermasalah */}
                <div className="space-y-3">
                  <h5 className="text-label-lg font-bold border-l-4 border-error pl-3 uppercase tracking-wider text-error">Daftar Balita Perlu Perhatian</h5>
                  {skdn.giziBuruk.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead>
                          <tr className="bg-error-container border-b-2 border-error/30">
                            <th className="p-3 font-bold text-sm text-on-error-container">Nama Balita</th>
                            <th className="p-3 font-bold text-sm text-on-error-container text-center">Status</th>
                            <th className="p-3 font-bold text-sm text-on-error-container text-center">Berat (kg)</th>
                            <th className="p-3 font-bold text-sm text-on-error-container">Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className="text-body-md">
                          {skdn.giziBuruk.map((b, i) => (
                            <tr key={i} className="border-b border-outline-variant">
                              <td className="p-3 font-semibold">{b.nama}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${b.status === 'Lebih' ? 'bg-amber-100 text-amber-800' : 'bg-error-container text-on-error-container'}`}>{b.status}</span>
                              </td>
                              <td className="p-3 text-center font-bold">{b.berat}</td>
                              <td className="p-3 text-sm text-on-surface-variant">{b.keterangan}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="p-6 bg-primary-container/20 rounded-xl text-center border border-primary/20">
                      <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
                      <p className="font-bold text-primary mt-2">Tidak ada balita dengan gizi bermasalah!</p>
                      <p className="text-sm text-on-surface-variant mt-1">Semua balita yang ditimbang memiliki status gizi Baik.</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h5 className="text-label-lg font-bold border-l-4 border-error pl-3 uppercase tracking-wider">Rekomendasi Tindak Lanjut</h5>
                  <p className="text-body-lg leading-relaxed text-on-surface">
                    Pada bulan {bulanAktif}, dari <strong>{skdn.D}</strong> balita yang ditimbang terdapat{' '}
                    <strong className="text-error">{skdn.giziBuruk.length} anak</strong> dengan status gizi bermasalah.
                    {skdn.giziBuruk.length > 0
                      ? ' Kader diharapkan melakukan kunjungan rumah dan memberikan Pemberian Makanan Tambahan (PMT) kepada balita yang bersangkutan serta berkoordinasi dengan Bidan Desa.'
                      : ' Status gizi seluruh balita dalam kondisi baik. Pertahankan program posyandu rutin setiap bulan.'}
                  </p>
                </div>
              </>)}

              {/* Tanda Tangan */}
              <div className="pt-12 flex flex-wrap justify-between gap-8">
                <div className="text-center w-44">
                  <p className="text-body-md mb-20">Mengetahui,<br />Bidan Desa</p>
                  <div className="border-b-2 border-on-surface mx-auto w-32 mb-2" />
                  <p className="font-bold text-body-md">Bidan Desa</p>
                </div>
                <div className="text-center w-44">
                  <p className="text-body-md mb-20">
                    {posyanduInfo.kota_kabupaten
                      ? posyanduInfo.kota_kabupaten.replace('Kabupaten ', '').replace('Kota ', '')
                      : ''}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}<br />Ketua Kader
                  </p>
                  <div className="border-b-2 border-on-surface mx-auto w-32 mb-2" />
                  <p className="font-bold text-body-md">Kader Posyandu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────── */}
      <Modal isOpen={modal === 'whatsapp'} onClose={() => setModal(null)} title="Konfirmasi Kirim WhatsApp" size="sm">
        <ConfirmWhatsApp bulan={bulanAktif} tipe={tipeLaporan} kontak_telepon={posyanduInfo.kontak_telepon} onConfirm={handleKirimWA} onClose={() => setModal(null)} />
      </Modal>
      <Modal isOpen={modal === 'cetak'} onClose={() => setModal(null)} title="Pilih Laporan yang Dicetak" size="sm">
        <PeriodeModal defaultBulan={bulanAktif} defaultTipe={tipeLaporan} onClose={() => setModal(null)} onGenerate={handleGenerate} />
      </Modal>
    </main>
  );
};

export default Laporan;
