import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Toast from '../components/UI/Toast';
import Modal from '../components/UI/Modal';

// ── Konfirmasi Reset ─────────────────────────────────────────
const ConfirmReset = ({ onConfirm, onClose }) => (
  <div className="pb-2 space-y-4">
    <div className="p-4 bg-error-container/30 rounded-xl border border-error/20 flex items-start gap-3">
      <span className="material-symbols-outlined text-error text-[28px] shrink-0">warning</span>
      <div>
        <p className="font-bold text-error">Reset ke Default?</p>
        <p className="text-sm text-on-surface-variant mt-1">Semua pengaturan akan dikembalikan ke nilai bawaan. Data peserta dan riwayat <strong>tidak akan terpengaruh</strong>.</p>
      </div>
    </div>
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      <button onClick={onClose} className="flex-1 h-12 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors text-sm">Batal</button>
      <button onClick={onConfirm} className="flex-1 h-12 rounded-xl bg-error text-on-error font-bold hover:bg-error/90 active:scale-95 transition-all shadow-md text-sm flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">restart_alt</span>
        Ya, Reset
      </button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════
// MAIN SETTINGS COMPONENT
// ═══════════════════════════════════════════════════════════════
const Settings = () => {
  const [toast, setToast] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({
    nama: 'Posyandu Melati',
    desa_kelurahan: 'Desa Mekar Sari',
    kecamatan: 'Kebon Jeruk',
    kota_kabupaten: 'Jakarta Barat',
    kontak_telepon: '08123456789',
    jadwalPengingat: true,
    notifLaporan: false,
    suaraVibrasi: true,
    tema: 'Otomatis',
    halaman: 'Dashboard',
    sesiOtomatis: true,
    cadanganData: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/public/pengaturan');
        const json = await res.json();
        if (json.data) {
          setForm(prev => ({
            ...prev,
            nama: json.data.nama_posyandu || prev.nama,
            desa_kelurahan: json.data.desa_kelurahan || prev.desa_kelurahan,
            kecamatan: json.data.kecamatan || prev.kecamatan,
            kota_kabupaten: json.data.kota_kabupaten || prev.kota_kabupaten,
            kontak_telepon: json.data.kontak_telepon || prev.kontak_telepon,
          }));
        }
      } catch (e) {
        console.error('Gagal fetch pengaturan:', e);
      }
    };
    fetchSettings();
  }, []);

  const showToast = (msg, type = 'success') => setToast({ msg, type });
  const handleChange = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  const handleToggle = (key) => setForm(prev => ({ ...prev, [key]: !prev[key] }));

  const handleSimpan = async () => {
    try {
      const token = localStorage.getItem('smartposyandu_token');
      // Kirim data terpisah sesuai kolom di database
      await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          table: 'pengaturan_sistem',
          action: 'update',
          payload: { 
            nama_posyandu: form.nama, 
            desa_kelurahan: form.desa_kelurahan,
            kecamatan: form.kecamatan,
            kota_kabupaten: form.kota_kabupaten,
            kontak_telepon: form.kontak_telepon
          },
          filters: [{ field: 'id', value: 1 }]
        })
      });
      showToast('Pengaturan berhasil disimpan! ✅');
    } catch (e) {
      showToast('Gagal menyimpan pengaturan.', 'error');
    }
  };

  const handleReset = async () => {
    const defaults = {
      nama: 'Posyandu Melati',
      desa_kelurahan: 'Desa Mekar Sari',
      kecamatan: 'Kebon Jeruk',
      kota_kabupaten: 'Jakarta Barat',
      kontak_telepon: '08123456789',
      jadwalPengingat: true, notifLaporan: false, suaraVibrasi: true,
      tema: 'Otomatis', halaman: 'Dashboard',
      sesiOtomatis: true, cadanganData: false,
    };
    setForm(defaults);
    try {
      const token = localStorage.getItem('smartposyandu_token');
      await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          table: 'pengaturan_sistem',
          action: 'update',
          payload: { 
            nama_posyandu: defaults.nama, 
            desa_kelurahan: defaults.desa_kelurahan,
            kecamatan: defaults.kecamatan,
            kota_kabupaten: defaults.kota_kabupaten,
            kontak_telepon: defaults.kontak_telepon
          },
          filters: [{ field: 'id', value: 1 }]
        })
      });
      setModal(null);
      showToast('Pengaturan dikembalikan ke default.', 'warning');
    } catch (e) {
      showToast('Gagal reset pengaturan.', 'error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 w-full">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <section className="bg-surface-container-lowest rounded-[28px] shadow-sm border border-outline-variant p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[44px] text-primary">settings</span>
            <div>
              <h1 className="text-title-lg font-bold text-on-background">Pengaturan SmartPosyandu</h1>
              <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">Sesuaikan preferensi tampilan, notifikasi, dan informasi Posyandu Anda.</p>
            </div>
          </div>
          <Link className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-white transition hover:bg-primary/90 font-bold shadow-md" to="/dashboard">
            <span className="material-symbols-outlined">arrow_back</span>
            Kembali ke Dashboard
          </Link>
        </div>

        <div className="mt-10 space-y-6">
          {/* ── Informasi Posyandu ─────────────────────────────── */}
          <section className="rounded-[24px] bg-surface-container-low border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-on-background">Informasi Posyandu</h2>
                <p className="text-sm text-on-surface-variant mt-1">Nama Posyandu dan lokasi yang akan ditampilkan pada aplikasi.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-sm text-on-secondary font-bold">Umum</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="nama_posyandu">Nama Posyandu</label>
                <input id="nama_posyandu" value={form.nama} onChange={e => handleChange('nama', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all" type="text" placeholder="Posyandu Melati" />
              </div>
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="desa_kelurahan">Desa/Kelurahan</label>
                <input id="desa_kelurahan" value={form.desa_kelurahan} onChange={e => handleChange('desa_kelurahan', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all" type="text" placeholder="Desa Mekar Sari" />
              </div>
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="kecamatan">Kecamatan</label>
                <input id="kecamatan" value={form.kecamatan} onChange={e => handleChange('kecamatan', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all" type="text" placeholder="Kebon Jeruk" />
              </div>
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="kota_kabupaten">Kota/Kabupaten</label>
                <input id="kota_kabupaten" value={form.kota_kabupaten} onChange={e => handleChange('kota_kabupaten', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all" type="text" placeholder="Jakarta Barat" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="kontak_telepon">Nomor WhatsApp Tujuan (Bidan / Dinkes)</label>
                <input id="kontak_telepon" value={form.kontak_telepon} onChange={e => handleChange('kontak_telepon', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all" type="text" placeholder="08123456789" />
                <p className="text-xs text-on-surface-variant mt-1">Nomor ini akan digunakan sebagai tujuan saat mengirim Laporan via WhatsApp.</p>
              </div>
            </div>
          </section>

          {/* ── Notifikasi ─────────────────────────────────────── */}
          <section className="rounded-[24px] bg-surface-container-low border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-on-background">Notifikasi</h2>
                <p className="text-sm text-on-surface-variant mt-1">Aktifkan pengingat dan laporan otomatis.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-bold">Penting</span>
            </div>
            <div className="space-y-3">
              {[
                { key: 'jadwalPengingat', title: 'Pengingat Jadwal', desc: 'Notifikasi untuk kegiatan penimbangan dan imunisasi.' },
                { key: 'notifLaporan', title: 'Notifikasi Laporan', desc: 'Pemberitahuan ketika laporan bulanan siap diunduh.' },
                { key: 'suaraVibrasi', title: 'Suara & Vibration', desc: 'Aktifkan umpan balik haptik dan suara pada notifikasi.' },
              ].map(item => (
                <label key={item.key}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface p-4 cursor-pointer hover:bg-surface-container-lowest transition-colors group">
                  <span>
                    <span className="block text-base font-bold text-on-background group-hover:text-primary transition-colors">{item.title}</span>
                    <span className="block text-sm text-on-surface-variant">{item.desc}</span>
                  </span>
                  <div className="relative">
                    <input type="checkbox" checked={form[item.key]} onChange={() => handleToggle(item.key)}
                      className="sr-only peer" />
                    <div className="w-11 h-6 bg-outline-variant rounded-full peer-checked:bg-primary transition-colors" />
                    <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* ── Tampilan & Akses ───────────────────────────────── */}
          <section className="rounded-[24px] bg-surface-container-low border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-on-background">Tampilan & Akses</h2>
                <p className="text-sm text-on-surface-variant mt-1">Pilih mode tampilan dan halaman awal.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-secondary-container px-3 py-1 text-sm text-on-secondary font-bold">Preferensi</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="tema_aplikasi">Tema Aplikasi</label>
                <select id="tema_aplikasi" value={form.tema} onChange={e => handleChange('tema', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all">
                  <option>Terang</option>
                  <option>Otomatis</option>
                  <option>Gelap</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-label-lg font-bold text-on-surface" htmlFor="halaman_awal">Halaman Awal</label>
                <select id="halaman_awal" value={form.halaman} onChange={e => handleChange('halaman', e.target.value)}
                  className="w-full rounded-2xl border-2 border-outline-variant bg-surface p-4 text-body-md focus:border-primary focus:outline-none transition-all">
                  <option>Dashboard</option>
                  <option>Penimbangan</option>
                  <option>Data Balita</option>
                </select>
              </div>
            </div>
          </section>

          {/* ── Akun dan Privasi ───────────────────────────────── */}
          <section className="rounded-[24px] bg-surface-container-low border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-xl font-bold text-on-background">Akun dan Privasi</h2>
                <p className="text-sm text-on-surface-variant mt-1">Kelola akses dan proteksi data aplikasi.</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-tertiary-container px-3 py-1 text-sm text-on-tertiary-container font-bold">Akun</span>
            </div>
            <div className="space-y-3">
              {[
                { key: 'sesiOtomatis', title: 'Sesi Otomatis', desc: 'Keluar otomatis setelah 15 menit tidak aktif.' },
                { key: 'cadanganData', title: 'Cadangan Data', desc: 'Simpan ringkasan harian secara otomatis.' },
              ].map(item => (
                <div key={item.key} className="rounded-2xl border border-outline-variant bg-surface p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-on-background">{item.title}</p>
                      <p className="text-sm text-on-surface-variant mt-1">{item.desc}</p>
                    </div>
                    <div className="relative">
                      <input type="checkbox" checked={form[item.key]} onChange={() => handleToggle(item.key)} className="sr-only peer" />
                      <div className="w-11 h-6 bg-outline-variant rounded-full peer-checked:bg-primary transition-colors" />
                      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Action Buttons ─────────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-end pt-2">
            <button onClick={() => setModal('reset')}
              className="rounded-full bg-surface-container text-on-surface border border-outline-variant px-6 py-3 font-bold hover:bg-surface-container-high transition flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Reset
            </button>
            <button onClick={handleSimpan}
              className="rounded-full bg-primary text-white px-8 py-3 font-bold hover:bg-primary/90 transition shadow-md flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Simpan Pengaturan
            </button>
          </div>
        </div>
      </section>

      {/* Modal Reset */}
      <Modal isOpen={modal === 'reset'} onClose={() => setModal(null)} title="Reset Pengaturan" size="sm">
        <ConfirmReset onConfirm={handleReset} onClose={() => setModal(null)} />
      </Modal>
    </div>
  );
};

export default Settings;
