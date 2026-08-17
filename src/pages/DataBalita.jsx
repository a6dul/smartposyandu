import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Modal from '../components/UI/Modal';
import Dropdown from '../components/UI/Dropdown';
import Toast from '../components/UI/Toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const inputCls = "w-full h-12 px-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface transition-all";

// --- Form Tambah / Edit ---
export const FormPeserta = ({ data, onClose, onSave }) => {
  const [form, setForm] = useState({
    nama_lengkap: data?.nama_lengkap || '',
    nik: data?.nik || '',
    tanggal_lahir: data?.tanggal_lahir ? data.tanggal_lahir.substring(0, 10) : '',
    jenis_kelamin: data?.jenis_kelamin || 'L',
    nama_ibu: data?.nama_ibu || '',
    nama_ayah: data?.nama_ayah || '',
    alamat: data?.alamat || '',
    status_aktif: data ? data.status_aktif : true,
    foto: data?.foto || '',
  });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(data?.foto ? `${data.foto}` : null);
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let fotoUrl = form.foto;
    if (fotoFile) {
      setUploadingFoto(true);
      try {
        const token = localStorage.getItem('smartposyandu_token');
        const formData = new FormData();
        formData.append('foto', fotoFile);
        const res = await fetch('/api/upload/foto-balita', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        fotoUrl = json.data.url;
      } catch (err) {
        alert('Gagal upload foto: ' + err.message);
        setUploadingFoto(false);
        return;
      }
      setUploadingFoto(false);
    }
    onSave({ ...form, foto: fotoUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-2">
      {/* Foto Upload */}
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant">
        <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-container flex items-center justify-center shrink-0 border-2 border-primary/20">
          {fotoPreview ? (
            <img src={fotoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="material-symbols-outlined text-primary text-[28px]">person</span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-on-surface">Foto Balita</p>
          <p className="text-xs text-on-surface-variant mt-0.5">JPG, PNG, WEBP. Maks 5MB.</p>
          <label className="mt-2 inline-flex items-center gap-1.5 cursor-pointer text-primary text-xs font-bold hover:underline">
            <span className="material-symbols-outlined text-[14px]">upload</span>
            {fotoPreview ? 'Ganti Foto' : 'Pilih Foto'}
            <input type="file" accept="image/*" onChange={handleFotoChange} className="hidden" />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">Nama Lengkap Balita *</label>
          <input name="nama_lengkap" value={form.nama_lengkap} onChange={handleChange} required className={inputCls} placeholder="Nama lengkap..."/>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">NIK / No. KK</label>
          <input name="nik" value={form.nik} onChange={handleChange} className={inputCls} placeholder="16 digit NIK..."/>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">Tanggal Lahir *</label>
          <input name="tanggal_lahir" type="date" value={form.tanggal_lahir} onChange={handleChange} required className={inputCls}/>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">Jenis Kelamin</label>
          <select name="jenis_kelamin" value={form.jenis_kelamin} onChange={handleChange} className={inputCls}>
            <option value="L">Laki-laki (L)</option>
            <option value="P">Perempuan (P)</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">Nama Ibu *</label>
          <input name="nama_ibu" value={form.nama_ibu} onChange={handleChange} required className={inputCls} placeholder="Nama ibu kandung..."/>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-on-surface-variant">Nama Ayah</label>
          <input name="nama_ayah" value={form.nama_ayah} onChange={handleChange} className={inputCls} placeholder="Nama ayah..."/>
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-bold text-on-surface-variant">Alamat Lengkap</label>
        <textarea name="alamat" value={form.alamat} onChange={handleChange} rows={2}
          className="w-full px-4 py-3 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface transition-all resize-none"
          placeholder="Alamat lengkap..."/>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <input type="checkbox" name="status_aktif" checked={form.status_aktif}
          onChange={(e) => setForm(p => ({ ...p, status_aktif: e.target.checked }))}
          className="w-4 h-4 accent-primary" id="statusAktif" />
        <label htmlFor="statusAktif" className="text-sm font-semibold text-on-surface cursor-pointer">
          Status Balita Aktif (masuk hitungan SKDN)
        </label>
      </div>

      <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 h-11 rounded-xl border-2 border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-colors">
          Batal
        </button>
        <button type="submit" disabled={uploadingFoto}
          className="flex-1 h-11 rounded-xl bg-primary text-on-primary text-sm font-bold hover:bg-primary/90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
          <span className="material-symbols-outlined text-[18px]">{uploadingFoto ? 'hourglass_empty' : 'save'}</span>
          {uploadingFoto ? 'Mengupload...' : data ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>
    </form>
  );
};

// --- Konfirmasi Hapus ---
export const ConfirmHapus = ({ peserta, onConfirm, onClose }) => (
  <div className="pb-2 space-y-4">
    <div className="p-4 bg-error-container/30 rounded-xl border border-error/20 flex items-start gap-3">
      <span className="material-symbols-outlined text-error text-[24px] shrink-0">warning</span>
      <div>
        <p className="font-bold text-error text-sm">Hapus data ini?</p>
        <p className="text-sm text-on-surface-variant mt-1">
          Data <span className="font-bold text-on-surface">{peserta?.nama_lengkap}</span> akan dihapus permanen dan tidak dapat dikembalikan.
        </p>
      </div>
    </div>
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      <button onClick={onClose}
        className="flex-1 h-11 rounded-xl border-2 border-outline-variant text-on-surface-variant text-sm font-bold hover:bg-surface-container-high transition-colors">
        Batal
      </button>
      <button onClick={onConfirm}
        className="flex-1 h-11 rounded-xl bg-error text-on-error text-sm font-bold hover:bg-error/90 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[18px]">delete</span>
        Ya, Hapus
      </button>
    </div>
  </div>
);

// ============================================================
// MAIN COMPONENT
// ============================================================
const DataBalita = () => {
  const { logAudit } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [modal, setModal] = useState(null);
  const [selectedPeserta, setSelectedPeserta] = useState(null);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);

  const { data: data = [], isLoading, isRefetching } = useQuery({
    queryKey: ['balita'],
    queryFn: async () => {
      const res = await api.post('/query', {
        table: 'balita',
        action: 'select',
        sortConfig: { field: 'created_at', ascending: false }
      });
      if (res.data.error) throw new Error(res.data.error);
      return res.data.data || [];
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      const action = modal === 'tambah' ? 'insert' : 'update';
      const payload = modal === 'tambah' ? [formData] : formData;
      const filters = modal === 'tambah' ? undefined : [{ field: 'id', value: selectedPeserta.id }];
      const res = await api.post('/query', { table: 'balita', action, payload, filters });
      if (res.data.error) throw new Error(res.data.error);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['balita'] });
      showToast(`Data ${variables.nama_lengkap} berhasil disimpan!`);
      logAudit(modal === 'tambah' ? 'CREATE' : 'UPDATE', 'Data Balita', `Menyimpan data balita: ${variables.nama_lengkap}`);
      closeModal();
    },
    onError: (err) => showToast(err.message || 'Terjadi kesalahan saat menyimpan data.', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.post('/query', { table: 'balita', action: 'delete', filters: [{ field: 'id', value: id }] });
      if (res.data.error) throw new Error(res.data.error);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balita'] });
      showToast(`Data ${selectedPeserta.nama_lengkap} berhasil dihapus.`, 'success');
      logAudit('DELETE', 'Data Balita', `Menghapus balita: ${selectedPeserta.nama_lengkap}`);
      closeModal();
    },
    onError: (err) => showToast(err.message || 'Terjadi kesalahan saat menghapus data.', 'error')
  });

  const closeModal = () => { setModal(null); setSelectedPeserta(null); };
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredData = data.filter(p =>
    p.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
    p.nik?.includes(search)
  );

  return (
    <section className="p-4 lg:p-8 flex flex-col gap-6 max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-title-lg font-bold text-on-surface">Data Balita Posyandu</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Kelola database balita yang terdaftar.</p>
        </div>
        <button onClick={() => setModal('tambah')}
          className="bg-primary text-on-primary text-sm font-bold px-5 h-11 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 active:scale-95 transition-all whitespace-nowrap">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Tambah Data
        </button>
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Terdaftar', value: data.length, icon: 'child_care', color: 'primary' },
          { label: 'Laki-laki', value: data.filter(d => d.jenis_kelamin === 'L').length, icon: 'boy', color: 'secondary' },
          { label: 'Perempuan', value: data.filter(d => d.jenis_kelamin === 'P').length, icon: 'girl', color: 'tertiary' },
        ].map(stat => (
          <div key={stat.label} className={`bg-${stat.color}-container/10 p-6 rounded-2xl border border-${stat.color}/20 flex items-center gap-5`}>
            <div className={`bg-${stat.color} text-on-${stat.color} w-14 h-14 rounded-full flex items-center justify-center shrink-0`}>
              <span className="material-symbols-outlined text-3xl">{stat.icon}</span>
            </div>
            <div>
              <p className={`text-sm text-${stat.color} font-semibold`}>{stat.label}</p>
              <p className={`text-[28px] font-bold text-${stat.color} leading-none mt-1`}>{isLoading ? '-' : stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Refresh */}
      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-sm transition-all bg-surface"
              placeholder="Cari nama balita atau NIK..."/>
          </div>
          <button onClick={() => queryClient.invalidateQueries({ queryKey: ['balita'] })}
            className="h-11 w-full sm:w-auto px-5 border-2 border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface-variant text-sm font-bold">
            <span className={`material-symbols-outlined text-[18px] ${isRefetching ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[560px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                {['Nama Anak', 'Nama Ibu', 'L/P', 'Status', ''].map(h => (
                  <th key={h} className={`px-4 py-3 text-xs font-bold text-on-surface-variant uppercase tracking-wide ${h === '' ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {isLoading ? (
                <tr><td colSpan={5} className="p-12 text-center text-sm text-on-surface-variant">Memuat data dari database...</td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan={5} className="p-12 text-center">
                  <span className="material-symbols-outlined text-[40px] block mb-2 opacity-30">search_off</span>
                  <span className="text-sm text-on-surface-variant">Tidak ada data balita ditemukan.</span>
                </td></tr>
              ) : filteredData.map(peserta => (
                <tr key={peserta.id} className="hover:bg-surface-container/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {peserta.foto ? (
                        <img src={`${peserta.foto}`} alt={peserta.nama_lengkap}
                          className="w-9 h-9 rounded-full object-cover shrink-0 border-2 border-primary/20"/>
                      ) : (
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs bg-primary-container text-primary shrink-0">
                          {peserta.nama_lengkap.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="cursor-pointer group" onClick={() => navigate(`/dashboard/balita/${peserta.id}`)}>
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors">{peserta.nama_lengkap}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          {peserta.nik ? `NIK: ${peserta.nik} · ` : ''}{new Date(peserta.tanggal_lahir).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-on-surface">{peserta.nama_ibu || '-'}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${peserta.jenis_kelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                      {peserta.jenis_kelamin}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {peserta.status_aktif ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>circle</span>Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full">
                        <span className="material-symbols-outlined text-[12px]">circle</span>Nonaktif
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Dropdown
                      trigger={
                        <button className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-all active:scale-90">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                      }
                      items={[
                        { label: 'Lihat Detail', icon: 'visibility', onClick: () => navigate(`/dashboard/balita/${peserta.id}`) },
                        { label: 'Edit Data', icon: 'edit', onClick: () => { setSelectedPeserta(peserta); setModal('edit'); } },
                        { divider: true },
                        { label: 'Hapus Data', icon: 'delete', danger: true, onClick: () => { setSelectedPeserta(peserta); setModal('hapus'); } },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer count */}
        {!isLoading && filteredData.length > 0 && (
          <div className="px-4 py-3 border-t border-outline-variant/40 bg-surface-container-low">
            <p className="text-xs text-on-surface-variant">
              Menampilkan <span className="font-bold text-on-surface">{filteredData.length}</span> dari <span className="font-bold text-on-surface">{data.length}</span> balita terdaftar
            </p>
          </div>
        )}
      </div>

      {/* MODALS */}
      <Modal isOpen={modal === 'tambah'} onClose={closeModal} title="Tambah Data Balita" size="lg">
        <FormPeserta onClose={closeModal} onSave={(d) => saveMutation.mutate(d)} />
      </Modal>

      {modal === 'edit' && selectedPeserta && (
        <Modal isOpen={true} onClose={closeModal} title="Edit Data Balita" size="lg">
          <FormPeserta data={selectedPeserta} onClose={closeModal} onSave={(d) => saveMutation.mutate(d)} />
        </Modal>
      )}

      <Modal isOpen={modal === 'hapus'} onClose={closeModal} title="Konfirmasi Hapus" size="sm">
        <ConfirmHapus peserta={selectedPeserta} onConfirm={() => deleteMutation.mutate(selectedPeserta.id)} onClose={closeModal} />
      </Modal>
    </section>
  );
};

export default DataBalita;
