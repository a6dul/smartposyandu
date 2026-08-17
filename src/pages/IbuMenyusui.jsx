import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import Dropdown from '../components/UI/Dropdown';
import Toast from '../components/UI/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Helper ──────────────────────────────────────────────────────
const getAsiConfig = (status) => {
  const map = {
    'ASI Eksklusif': { color: 'text-primary', bg: 'bg-primary/10', badge: 'bg-primary/10 text-primary border-primary/20', icon: 'breastfeeding' },
    'ASI + MPASI':   { color: 'text-secondary', bg: 'bg-secondary/10', badge: 'bg-secondary/10 text-secondary border-secondary/20', icon: 'child_friendly' },
    'MPASI':         { color: 'text-tertiary', bg: 'bg-tertiary/10', badge: 'bg-tertiary/10 text-tertiary border-tertiary/20', icon: 'restaurant' },
    'Sufor':         { color: 'text-error', bg: 'bg-error/10', badge: 'bg-error/10 text-error border-error/20', icon: 'no_food' },
  };
  return map[status] || map['ASI Eksklusif'];
};

// ── Form Tambah / Edit ───────────────────────────────────────────
const FormIbuMenyusui = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({
    nama_lengkap: data?.nama_lengkap || '',
    nik: data?.nik || '',
    usia: data?.usia || '',
    alamat: data?.alamat || '',
    nama_bayi: data?.nama_bayi || '',
    usia_bayi: data?.usia_bayi || '',
    telepon: data?.telepon || '',
    status_asi: data?.status_asi || 'ASI Eksklusif',
    kendala: data?.kendala || '',
    status_aktif: data ? data.status_aktif : true,
  });

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: val }));
  };
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  const inputClass = "w-full h-14 px-4 rounded-xl border-2 border-outline-variant focus:border-tertiary outline-none text-body-md bg-surface transition-all";
  const labelClass = "text-sm font-bold text-on-surface";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className={labelClass}>Nama Lengkap Ibu *</label>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required
            className={inputClass} placeholder="Nama lengkap ibu..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>NIK</label>
          <input name="nik" value={form.nik} onChange={handleChange}
            className={inputClass} placeholder="16 digit NIK..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Usia Ibu (tahun) *</label>
          <input name="usia" type="number" value={form.usia} onChange={handleChange} required
            className={inputClass} placeholder="Usia ibu..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Nama Bayi *</label>
          <input name="nama_bayi" value={form.nama_bayi} onChange={handleChange} required
            className={inputClass} placeholder="Nama bayi..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Usia Bayi (bulan) *</label>
          <input name="usia_bayi" type="number" value={form.usia_bayi} onChange={handleChange} required
            className={inputClass} placeholder="Usia bayi dalam bulan..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>No. Telepon</label>
          <input name="telepon" value={form.telepon} onChange={handleChange}
            className={inputClass} placeholder="08xx..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status Pemberian ASI</label>
          <select name="status_asi" value={form.status_asi} onChange={handleChange} className={inputClass}>
            <option>ASI Eksklusif</option>
            <option>ASI + MPASI</option>
            <option>MPASI</option>
            <option>Sufor</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className={labelClass}>Kendala / Catatan</label>
        <textarea name="kendala" value={form.kendala} onChange={handleChange} rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-tertiary outline-none text-body-md bg-surface transition-all resize-none"
          placeholder="Kendala menyusui atau catatan lain..." />
      </div>
      <div className="space-y-1">
        <label className={labelClass}>Alamat Lengkap</label>
        <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-tertiary outline-none text-body-md bg-surface transition-all resize-none"
          placeholder="Alamat lengkap..." />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" name="status_aktif" checked={form.status_aktif}
          onChange={handleChange} className="w-5 h-5 accent-tertiary" id="statusAktifSus" />
        <label htmlFor="statusAktifSus" className="font-bold text-on-surface cursor-pointer">Masih Aktif Menyusui</label>
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 h-14 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">
          Batal
        </button>
        <button type="submit"
          className="flex-1 h-14 rounded-xl bg-tertiary text-on-tertiary font-bold hover:bg-tertiary/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">save</span>
          {data ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
};

// ── Detail Modal ─────────────────────────────────────────────────
const DetailIbuMenyusui = ({ ibu }) => {
  if (!ibu) return null;
  const cfg = getAsiConfig(ibu.status_asi);

  const getAsiPesan = (status, usiaBayi) => {
    if (status === 'ASI Eksklusif' && usiaBayi < 6) return { pesan: 'ASI Eksklusif berjalan lancar!', saran: 'Lanjutkan sampai bayi berusia 6 bulan.', ok: true };
    if (status === 'ASI Eksklusif' && usiaBayi >= 6) return { pesan: 'Waktunya MPASI!', saran: 'Bayi sudah siap tambahan makanan pendamping ASI.', ok: true };
    if (status === 'ASI + MPASI') return { pesan: 'ASI + MPASI berjalan baik.', saran: 'Teruskan menyusui sambil perkenalkan variasi MPASI.', ok: true };
    if (status === 'Sufor') return { pesan: 'Menggunakan Susu Formula.', saran: 'Konsultasikan dengan bidan terkait nutrisi bayi.', ok: false };
    return { pesan: status, saran: '', ok: true };
  };

  const info = getAsiPesan(ibu.status_asi, ibu.usia_bayi);

  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl bg-tertiary-container text-tertiary">
          {ibu.nama_lengkap?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-headline-md font-bold text-on-surface">{ibu.nama_lengkap}</h3>
          <p className="text-on-surface-variant text-sm">NIK: {ibu.nik || '–'}</p>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-1 inline-flex items-center gap-1 ${cfg.badge}`}>
            <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
            {ibu.status_asi}
          </span>
        </div>
      </div>

      <div className={`p-4 rounded-xl border flex items-start gap-3 ${info.ok ? 'bg-primary/5 border-primary/20' : 'bg-error/10 border-error/20'}`}>
        <span className={`material-symbols-outlined text-[24px] shrink-0 ${info.ok ? 'text-primary' : 'text-error'}`}>
          {info.ok ? 'check_circle' : 'info'}
        </span>
        <div>
          <p className={`font-bold text-sm ${info.ok ? 'text-primary' : 'text-error'}`}>{info.pesan}</p>
          {info.saran && <p className="text-xs text-on-surface-variant mt-0.5">{info.saran}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Nama Bayi', value: ibu.nama_bayi || '–' },
          { label: 'Usia Bayi', value: `${ibu.usia_bayi} bulan` },
          { label: 'Usia Ibu', value: `${ibu.usia} tahun` },
          { label: 'No. Telepon', value: ibu.telepon || '–' },
          { label: 'Status', value: ibu.status_aktif ? 'Aktif Menyusui' : 'Sudah Selesai' },
        ].map(d => (
          <div key={d.label} className="bg-surface-container-low rounded-xl p-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{d.label}</p>
            <p className="font-bold text-on-surface mt-0.5">{d.value}</p>
          </div>
        ))}
      </div>

      {ibu.kendala && ibu.kendala !== '-' && (
        <div className="bg-tertiary/5 border border-tertiary/20 rounded-xl p-4">
          <p className="text-sm font-bold text-tertiary mb-1">Kendala / Catatan</p>
          <p className="text-sm text-on-surface-variant">{ibu.kendala}</p>
        </div>
      )}
      {ibu.alamat && (
        <div className="bg-surface-container-low rounded-xl p-3">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">Alamat</p>
          <p className="font-bold text-on-surface mt-0.5">{ibu.alamat}</p>
        </div>
      )}
    </div>
  );
};

// ── Konfirmasi Hapus ─────────────────────────────────────────────
const ConfirmHapus = ({ ibu, onConfirm, onClose }) => (
  <div className="pb-2 space-y-4">
    <div className="p-4 bg-error-container/30 rounded-xl border border-error/20 flex items-start gap-3">
      <span className="material-symbols-outlined text-error text-[28px] shrink-0">warning</span>
      <div>
        <p className="font-bold text-error">Hapus data ini?</p>
        <p className="text-sm text-on-surface-variant mt-1">
          Data <span className="font-bold text-on-surface">{ibu?.nama_lengkap}</span> akan dihapus permanen.
        </p>
      </div>
    </div>
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      <button onClick={onClose}
        className="flex-1 h-14 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">
        Batal
      </button>
      <button onClick={onConfirm}
        className="flex-1 h-14 rounded-xl bg-error text-on-error font-bold hover:bg-error/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
        <span className="material-symbols-outlined">delete</span>
        Ya, Hapus
      </button>
    </div>
  </div>
);

// ════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════
const IbuMenyusui = () => {
  const { logAudit } = useAuth();
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAsi, setFilterAsi] = useState('Semua');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: result } = await supabase.from('ibu_menyusui').select('*').order('created_at', { ascending: false });
    setData(result || []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const closeModal = () => { setModal(null); setSelected(null); };
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (formData) => {
    try {
      if (modal === 'tambah') {
        const { error } = await supabase.from('ibu_menyusui').insert([formData]);
        if (error) throw error;
        showToast(`Data ${formData.nama_lengkap} berhasil ditambahkan!`);
        logAudit('CREATE', 'Ibu Menyusui', `Menambahkan ibu menyusui: ${formData.nama_lengkap}`);
      } else {
        const { error } = await supabase.from('ibu_menyusui').update(formData).eq('id', selected.id);
        if (error) throw error;
        showToast(`Data ${formData.nama_lengkap} berhasil diperbarui!`);
        logAudit('UPDATE', 'Ibu Menyusui', `Memperbarui ibu menyusui: ${formData.nama_lengkap}`);
      }
      fetchData();
      closeModal();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan', 'error');
    }
  };

  const handleHapus = async () => {
    try {
      const { error } = await supabase.from('ibu_menyusui').delete().eq('id', selected.id);
      if (error) throw error;
      showToast(`Data ${selected.nama_lengkap} berhasil dihapus.`);
      logAudit('DELETE', 'Ibu Menyusui', `Menghapus ibu menyusui: ${selected.nama_lengkap}`);
      fetchData();
      closeModal();
    } catch (err) {
      showToast('Gagal menghapus data', 'error');
    }
  };

  const filteredData = data.filter(d => {
    const matchSearch = d.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || d.nama_bayi?.toLowerCase().includes(search.toLowerCase()) || d.nik?.includes(search);
    const matchAsi = filterAsi === 'Semua' || d.status_asi === filterAsi;
    return matchSearch && matchAsi;
  });

  const stats = {
    total: data.length,
    aktif: data.filter(d => d.status_aktif).length,
    eksklusif: data.filter(d => d.status_asi === 'ASI Eksklusif').length,
    kendala: data.filter(d => d.kendala && d.kendala !== '-').length,
  };

  return (
    <section className="p-4 lg:p-margin-page flex flex-col gap-stack-gap max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h3 className="text-headline-lg font-bold text-on-surface">Data Ibu Menyusui</h3>
          <p className="text-body-lg text-on-surface-variant">Pemantauan ASI eksklusif dan perkembangan bayi.</p>
        </div>
        <button onClick={() => setModal('tambah')}
          className="bg-tertiary text-on-tertiary font-bold px-8 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-tertiary/90 active:scale-95 transition-all h-touch-target-min">
          <span className="material-symbols-outlined">breastfeeding</span>
          Tambah Data
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Ibu Menyusui', value: stats.total, icon: 'breastfeeding', color: 'tertiary' },
          { label: 'Masih Aktif', value: stats.aktif, icon: 'check_circle', color: 'primary' },
          { label: 'ASI Eksklusif', value: stats.eksklusif, icon: 'star', color: 'secondary' },
          { label: 'Perlu Perhatian', value: stats.kendala, icon: 'warning', color: 'error' },
        ].map(stat => (
          <div key={stat.label} className={`bg-${stat.color}-container/10 p-5 rounded-2xl border border-${stat.color}/20 flex flex-col gap-3`}>
            <div className={`bg-${stat.color} text-on-${stat.color} w-12 h-12 rounded-full flex items-center justify-center`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className={`text-sm text-${stat.color} font-semibold leading-tight`}>{stat.label}</p>
              <p className={`text-headline-lg font-bold text-${stat.color}`}>{loading ? '–' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-surface-container-lowest p-4 lg:p-6 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex flex-col md:flex-row gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-[56px] pl-12 pr-4 rounded-xl border-2 border-outline-variant focus:border-tertiary outline-none text-body-md transition-all bg-surface"
              placeholder="Cari nama ibu atau bayi..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Semua', 'ASI Eksklusif', 'ASI + MPASI', 'Sufor'].map(a => (
              <button key={a} onClick={() => setFilterAsi(a)}
                className={`px-4 h-[56px] rounded-xl border-2 font-bold text-sm transition-all ${filterAsi === a ? 'border-tertiary bg-tertiary text-on-tertiary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>
                {a}
              </button>
            ))}
          </div>
          <button onClick={fetchData}
            className="h-[56px] px-5 border-2 border-outline-variant rounded-xl flex items-center gap-2 hover:bg-surface-container transition-colors text-on-surface-variant font-bold">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Kartu / Tabel */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Ibu Menyusui', 'Nama Bayi', 'Usia Bayi', 'Status ASI', 'Kendala', ''].map(h => (
                  <th key={h} className={`p-4 lg:p-5 text-label-lg font-bold text-on-surface-variant ${h === '' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {loading ? (
                <tr><td colSpan={6} className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] block mb-2 animate-spin opacity-60">progress_activity</span>
                  Memuat data...
                </td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={6} className="p-12 text-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[48px] block mb-2 opacity-40">search_off</span>
                  Tidak ada data ibu menyusui.
                </td></tr>
              ) : filteredData.map(ibu => {
                const cfg = getAsiConfig(ibu.status_asi);
                return (
                  <tr key={ibu.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="p-4 lg:p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-tertiary-container text-tertiary shrink-0">
                          {ibu.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-bold text-on-surface">{ibu.nama_lengkap}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{ibu.usia} thn · {ibu.telepon || '–'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 lg:p-5">
                      <p className="font-semibold text-on-surface">{ibu.nama_bayi || '–'}</p>
                    </td>
                    <td className="p-4 lg:p-5">
                      <span className="font-bold text-on-surface">{ibu.usia_bayi} bln</span>
                    </td>
                    <td className="p-4 lg:p-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border inline-flex items-center gap-1 ${cfg.badge}`}>
                        <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                        {ibu.status_asi}
                      </span>
                    </td>
                    <td className="p-4 lg:p-5 max-w-[160px]">
                      {ibu.kendala && ibu.kendala !== '-' ? (
                        <p className="text-sm text-error truncate">{ibu.kendala}</p>
                      ) : (
                        <span className="text-sm text-on-surface-variant">–</span>
                      )}
                    </td>
                    <td className="p-4 lg:p-5 text-right">
                      <Dropdown
                        trigger={
                          <button className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-all active:scale-90">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        }
                        items={[
                          { label: 'Lihat Detail', icon: 'visibility', onClick: () => { setSelected(ibu); setModal('detail'); } },
                          { label: 'Edit Data', icon: 'edit', onClick: () => { setSelected(ibu); setModal('edit'); } },
                          { divider: true },
                          { label: 'Hapus Data', icon: 'delete', danger: true, onClick: () => { setSelected(ibu); setModal('hapus'); } },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS */}
      <Modal isOpen={modal === 'tambah'} onClose={closeModal} title="Tambah Data Ibu Menyusui" size="lg">
        <FormIbuMenyusui onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit Data Ibu Menyusui" size="lg">
        <FormIbuMenyusui data={selected} onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'detail'} onClose={closeModal} title="Detail Ibu Menyusui" size="md">
        {selected && <DetailIbuMenyusui ibu={selected} />}
      </Modal>
      <Modal isOpen={modal === 'hapus'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <ConfirmHapus ibu={selected} onConfirm={handleHapus} onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default IbuMenyusui;
