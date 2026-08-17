import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import Dropdown from '../components/UI/Dropdown';
import Toast from '../components/UI/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

// ── Helper ──────────────────────────────────────────────────────
const getRisikoConfig = (status) => {
  const map = {
    'Normal': { color: 'text-primary', bg: 'bg-primary/10', dot: 'bg-primary', badge: 'bg-primary/10 text-primary border-primary/20' },
    'Risiko Tinggi': { color: 'text-error', bg: 'bg-error/10', dot: 'bg-error', badge: 'bg-error/10 text-error border-error/20' },
    'Sangat Risiko Tinggi': { color: 'text-error', bg: 'bg-error-container/30', dot: 'bg-error', badge: 'bg-error-container/30 text-error border-error/30' },
  };
  return map[status] || map['Normal'];
};

const hitungHariMenujuHPL = (hpl) => {
  if (!hpl) return null;
  const today = new Date();
  const hplDate = new Date(hpl);
  const diff = Math.ceil((hplDate - today) / (1000 * 60 * 60 * 24));
  return diff;
};

// ── Form Tambah / Edit ───────────────────────────────────────────
const FormIbuHamil = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({
    nama_lengkap: data?.nama_lengkap || '',
    nik: data?.nik || '',
    usia: data?.usia || '',
    alamat: data?.alamat || '',
    nama_suami: data?.nama_suami || '',
    telepon: data?.telepon || '',
    usia_kandungan: data?.usia_kandungan || '',
    hpht: data?.hpht ? data.hpht.substring(0, 10) : '',
    hpl: data?.hpl ? data.hpl.substring(0, 10) : '',
    jumlah_anc: data?.jumlah_anc || 0,
    status_risiko: data?.status_risiko || 'Normal',
    golongan_darah: data?.golongan_darah || 'A',
    status_aktif: data ? data.status_aktif : true,
  });

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm(prev => ({ ...prev, [e.target.name]: val }));
  };
  const handleSubmit = (e) => { e.preventDefault(); onSave(form); };

  const inputClass = "w-full h-12 px-4 rounded-xl border-2 border-outline-variant focus:border-secondary outline-none text-sm bg-surface transition-all";
  const labelClass = "text-xs font-bold text-on-surface-variant";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2 space-y-1">
          <label className={labelClass}>Nama Lengkap *</label>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required
            className={inputClass} placeholder="Nama lengkap ibu..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>NIK</label>
          <input name="nik" value={form.nik} onChange={handleChange}
            className={inputClass} placeholder="16 digit NIK..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Usia (tahun) *</label>
          <input name="usia" type="number" value={form.usia} onChange={handleChange} required
            className={inputClass} placeholder="Usia ibu..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Nama Suami</label>
          <input name="nama_suami" value={form.nama_suami} onChange={handleChange}
            className={inputClass} placeholder="Nama suami..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>No. Telepon</label>
          <input name="telepon" value={form.telepon} onChange={handleChange}
            className={inputClass} placeholder="08xx..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Usia Kandungan (minggu) *</label>
          <input name="usia_kandungan" type="number" value={form.usia_kandungan} onChange={handleChange} required
            className={inputClass} placeholder="Minggu ke-..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Jumlah Kunjungan ANC</label>
          <input name="jumlah_anc" type="number" value={form.jumlah_anc} onChange={handleChange}
            className={inputClass} placeholder="Jumlah ANC..." />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>HPHT (Hari Pertama Haid Terakhir)</label>
          <input name="hpht" type="date" value={form.hpht} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>HPL (Hari Perkiraan Lahir)</label>
          <input name="hpl" type="date" value={form.hpl} onChange={handleChange} className={inputClass} />
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Golongan Darah</label>
          <select name="golongan_darah" value={form.golongan_darah} onChange={handleChange} className={inputClass}>
            {['A', 'B', 'AB', 'O'].map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="space-y-1">
          <label className={labelClass}>Status Risiko</label>
          <select name="status_risiko" value={form.status_risiko} onChange={handleChange} className={inputClass}>
            <option>Normal</option>
            <option>Risiko Tinggi</option>
            <option>Sangat Risiko Tinggi</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className={labelClass}>Alamat Lengkap</label>
        <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-secondary outline-none text-sm bg-surface transition-all resize-none"
          placeholder="Alamat lengkap..." />
      </div>
      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" name="status_aktif" checked={form.status_aktif}
          onChange={handleChange} className="w-5 h-5 accent-secondary" id="statusAktifHamil" />
        <label htmlFor="statusAktifHamil" className="font-bold text-on-surface cursor-pointer">Status Aktif Terpantau</label>
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 h-14 rounded-xl border-2 border-outline-variant text-on-surface-variant font-bold hover:bg-surface-container-high transition-colors">
          Batal
        </button>
        <button type="submit"
          className="flex-1 h-14 rounded-xl bg-secondary text-on-secondary font-bold hover:bg-secondary/90 active:scale-95 transition-all shadow-md flex items-center justify-center gap-2">
          <span className="material-symbols-outlined">save</span>
          {data ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
};

// ── Detail Modal ─────────────────────────────────────────────────
const DetailIbuHamil = ({ ibu }) => {
  if (!ibu) return null;
  const hariHPL = hitungHariMenujuHPL(ibu.hpl);
  const cfg = getRisikoConfig(ibu.status_risiko);

  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl bg-secondary-container text-secondary">
          {ibu.nama_lengkap?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-headline-md font-bold text-on-surface">{ibu.nama_lengkap}</h3>
          <p className="text-on-surface-variant text-sm">NIK: {ibu.nik || '-'}</p>
          <span className={`text-xs font-bold px-3 py-1 rounded-full border mt-1 inline-block ${cfg.badge}`}>
            {ibu.status_risiko}
          </span>
        </div>
      </div>

      {hariHPL !== null && (
        <div className={`p-4 rounded-xl border flex items-center gap-3 ${hariHPL > 0 ? 'bg-secondary/5 border-secondary/20' : 'bg-error/10 border-error/20'}`}>
          <span className={`material-symbols-outlined text-[28px] ${hariHPL > 0 ? 'text-secondary' : 'text-error'}`}>event</span>
          <div>
            <p className={`font-bold text-sm ${hariHPL > 0 ? 'text-secondary' : 'text-error'}`}>
              {hariHPL > 0 ? `${hariHPL} hari menuju HPL` : `Sudah melewati HPL ${Math.abs(hariHPL)} hari lalu`}
            </p>
            <p className="text-xs text-on-surface-variant">
              HPL: {new Date(ibu.hpl).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'HPHT', value: ibu.hpht ? new Date(ibu.hpht).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-' },
          { label: 'Usia Kandungan', value: `${ibu.usia_kandungan} minggu` },
          { label: 'Usia Ibu', value: `${ibu.usia} tahun` },
          { label: 'Nama Suami', value: ibu.nama_suami || '-' },
          { label: 'Golongan Darah', value: ibu.golongan_darah || '-' },
          { label: 'Kunjungan ANC', value: `${ibu.jumlah_anc}x` },
          { label: 'No. Telepon', value: ibu.telepon || '-' },
        ].map(d => (
          <div key={d.label} className="bg-surface-container-low rounded-xl p-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{d.label}</p>
            <p className="font-bold text-on-surface mt-0.5">{d.value}</p>
          </div>
        ))}
      </div>

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
const IbuHamil = () => {
  const { logAudit } = useAuth();
  const [modal, setModal] = useState(null);
  const [selected, setSelected] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRisiko, setFilterRisiko] = useState('Semua');
  const [toast, setToast] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const { data: result } = await supabase.from('ibu_hamil').select('*').order('created_at', { ascending: false });
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
        const { error } = await supabase.from('ibu_hamil').insert([formData]);
        if (error) throw error;
        showToast(`Data ${formData.nama_lengkap} berhasil ditambahkan!`);
        logAudit('CREATE', 'Ibu Hamil', `Menambahkan ibu hamil: ${formData.nama_lengkap}`);
      } else {
        const { error } = await supabase.from('ibu_hamil').update(formData).eq('id', selected.id);
        if (error) throw error;
        showToast(`Data ${formData.nama_lengkap} berhasil diperbarui!`);
        logAudit('UPDATE', 'Ibu Hamil', `Memperbarui ibu hamil: ${formData.nama_lengkap}`);
      }
      fetchData();
      closeModal();
    } catch (err) {
      showToast(err.message || 'Gagal menyimpan', 'error');
    }
  };

  const handleHapus = async () => {
    try {
      const { error } = await supabase.from('ibu_hamil').delete().eq('id', selected.id);
      if (error) throw error;
      showToast(`Data ${selected.nama_lengkap} berhasil dihapus.`);
      logAudit('DELETE', 'Ibu Hamil', `Menghapus ibu hamil: ${selected.nama_lengkap}`);
      fetchData();
      closeModal();
    } catch (err) {
      showToast('Gagal menghapus data', 'error');
    }
  };

  const filteredData = data.filter(d => {
    const matchSearch = d.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) || d.nik?.includes(search);
    const matchRisiko = filterRisiko === 'Semua' || d.status_risiko === filterRisiko;
    return matchSearch && matchRisiko;
  });

  const stats = {
    total: data.length,
    aktif: data.filter(d => d.status_aktif).length,
    risikoTinggi: data.filter(d => d.status_risiko === 'Risiko Tinggi' || d.status_risiko === 'Sangat Risiko Tinggi').length,
  };

  return (
    <section className="p-4 lg:p-margin-page flex flex-col gap-stack-gap max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-title-lg font-bold text-on-surface">Data Ibu Hamil</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Pemantauan kehamilan dan kunjungan ANC terpadu.</p>
        </div>
        <button onClick={() => setModal('tambah')}
          className="bg-secondary text-on-secondary text-sm font-bold px-5 h-11 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-secondary/90 active:scale-95 transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">pregnant_woman</span>
          Tambah Data
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Ibu Hamil', value: stats.total, icon: 'pregnant_woman', color: 'secondary' },
          { label: 'Sedang Dipantau', value: stats.aktif, icon: 'monitor_heart', color: 'primary' },
          { label: 'Risiko Tinggi', value: stats.risikoTinggi, icon: 'warning', color: 'error' },
        ].map(stat => (
          <div key={stat.label} className={`bg-${stat.color}-container/10 p-6 rounded-2xl border border-${stat.color}/20 flex items-center gap-5`}>
            <div className={`bg-${stat.color} text-on-${stat.color} w-14 h-14 rounded-full flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className={`text-body-md text-${stat.color} font-semibold`}>{stat.label}</p>
              <p className={`text-headline-lg font-bold text-${stat.color}`}>{loading ? '–' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-surface-container-lowest p-4 lg:p-6 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-outline-variant focus:border-secondary outline-none text-sm transition-all bg-surface"
              placeholder="Cari nama atau NIK..." />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Semua', 'Normal', 'Risiko Tinggi'].map(r => (
              <button key={r} onClick={() => setFilterRisiko(r)}
                className={`px-4 h-11 rounded-xl border-2 font-bold text-sm transition-all ${filterRisiko === r ? 'border-secondary bg-secondary text-on-secondary' : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'}`}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={fetchData}
            className="h-[56px] px-5 border-2 border-outline-variant rounded-xl flex items-center gap-2 hover:bg-surface-container transition-colors text-on-surface-variant font-bold">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Ibu Hamil', 'Usia Kandungan', 'HPL', 'ANC', 'Risiko', ''].map(h => (
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
                  Tidak ada data ibu hamil.
                </td></tr>
              ) : filteredData.map(ibu => {
                const cfg = getRisikoConfig(ibu.status_risiko);
                const hariHPL = hitungHariMenujuHPL(ibu.hpl);
                return (
                  <tr key={ibu.id} className="hover:bg-surface-container/30 transition-colors">
                    <td className="p-4 lg:p-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm bg-secondary-container text-secondary shrink-0">
                          {ibu.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-base font-bold text-on-surface">{ibu.nama_lengkap}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">NIK: {ibu.nik || '–'} · {ibu.usia} thn</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 lg:p-5">
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-surface-container-high rounded-full h-2">
                          <div className="bg-secondary h-2 rounded-full" style={{ width: `${Math.min((ibu.usia_kandungan / 40) * 100, 100)}%` }} />
                        </div>
                        <span className="text-sm font-bold text-on-surface">{ibu.usia_kandungan} mgg</span>
                      </div>
                    </td>
                    <td className="p-4 lg:p-5">
                      {hariHPL !== null ? (
                        <span className={`text-sm font-bold ${hariHPL > 30 ? 'text-on-surface-variant' : hariHPL > 0 ? 'text-tertiary' : 'text-error'}`}>
                          {hariHPL > 0 ? `${hariHPL} hari lagi` : `${Math.abs(hariHPL)} hari lewat`}
                        </span>
                      ) : <span className="text-on-surface-variant text-sm">–</span>}
                    </td>
                    <td className="p-4 lg:p-5">
                      <span className="font-bold text-on-surface">{ibu.jumlah_anc}x</span>
                    </td>
                    <td className="p-4 lg:p-5">
                      <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.badge}`}>
                        {ibu.status_risiko}
                      </span>
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
      <Modal isOpen={modal === 'tambah'} onClose={closeModal} title="Tambah Data Ibu Hamil" size="lg">
        <FormIbuHamil onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'edit'} onClose={closeModal} title="Edit Data Ibu Hamil" size="lg">
        <FormIbuHamil data={selected} onClose={closeModal} onSave={handleSave} />
      </Modal>
      <Modal isOpen={modal === 'detail'} onClose={closeModal} title="Detail Ibu Hamil" size="md">
        {selected && <DetailIbuHamil ibu={selected} />}
      </Modal>
      <Modal isOpen={modal === 'hapus'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <ConfirmHapus ibu={selected} onConfirm={handleHapus} onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default IbuHamil;
