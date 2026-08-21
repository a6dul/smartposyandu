import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Modal from '../components/UI/Modal';
import Dropdown from '../components/UI/Dropdown';
import Toast from '../components/UI/Toast';
import { FormPeserta, ConfirmHapus } from './DataBalita';
import { useAuth } from '../context/AuthContext';

const DetailBalita = () => {
  const { appRole } = useAuth();
  const isOrangTua = appRole === 'orang_tua';
  const { id } = useParams();
  const navigate = useNavigate();
  const [peserta, setPeserta] = useState(null);
  const [riwayat, setRiwayat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // 'edit' | 'hapus'
  const [toast, setToast] = useState(null);

  const fetchDetail = async () => {
    setLoading(true);
    // Fetch Balita Profile
    const { data: dataBalita, error: errBalita } = await supabase
      .from('balita')
      .select('*')
      .eq('id', id)
      .single();
      
    if (errBalita || !dataBalita) {
      console.error('Balita not found');
      setLoading(false);
      return;
    }
    setPeserta(dataBalita);

    // Fetch Riwayat
    const { data: dataRiwayat } = await supabase
      .from('penimbangan')
      .select('*')
      .eq('id_balita', id)
      .order('tanggal_ukur', { ascending: false });
      
    setRiwayat(dataRiwayat || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      const { data, error } = await supabase
        .from('balita')
        .update({
          nama_lengkap: formData.nama_lengkap,
          nik: formData.nik,
          tanggal_lahir: formData.tanggal_lahir,
          jenis_kelamin: formData.jenis_kelamin,
          nama_ibu: formData.nama_ibu,
          nama_ayah: formData.nama_ayah,
          alamat: formData.alamat,
          status_aktif: formData.status_aktif,
          foto: formData.foto
        })
        .eq('id', id);

      if (error) throw error;
      setToast({ message: 'Data balita berhasil diupdate!', type: 'success' });
      setModal(null);
      fetchDetail(); // refresh data
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const handleHapus = async () => {
    try {
      const { error } = await supabase.from('balita').delete().eq('id', id);
      if (error) throw error;
      setModal(null);
      navigate('/dashboard/data-balita');
    } catch (err) {
      setToast({ message: err.message, type: 'error' });
    }
  };

  const getUmur = (tglLahir) => {
    if (!tglLahir) return '-';
    const lahir = new Date(tglLahir);
    const sekarang = new Date();
    let bulan = (sekarang.getFullYear() - lahir.getFullYear()) * 12;
    bulan -= lahir.getMonth();
    bulan += sekarang.getMonth();
    return `${bulan} bulan`;
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-margin-page flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-[48px] animate-spin text-primary opacity-60">progress_activity</span>
        <p className="mt-4 text-on-surface-variant">Memuat data balita...</p>
      </div>
    );
  }

  if (!peserta) {
    return (
      <div className="p-4 lg:p-margin-page flex flex-col items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-[48px] text-error opacity-60">error</span>
        <p className="mt-4 text-on-surface-variant">Data balita tidak ditemukan.</p>
        <button onClick={() => navigate(isOrangTua ? '/dashboard' : '/dashboard/data-balita')} className="mt-4 px-6 py-2 bg-primary text-white rounded-xl font-bold">Kembali</button>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-margin-page flex flex-col gap-stack-gap max-w-5xl mx-auto w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <button 
          onClick={() => navigate(isOrangTua ? '/dashboard' : '/dashboard/data-balita')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary font-bold transition-colors w-fit"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          {isOrangTua ? 'Kembali ke Dashboard' : 'Kembali ke Daftar Balita'}
        </button>
        <div className="flex items-center gap-2">
          {!isOrangTua && (
            <Dropdown
              trigger={
                <button className="h-11 px-5 bg-surface border-2 border-outline-variant text-on-surface-variant rounded-xl text-sm font-bold shadow-sm hover:bg-surface-container-high transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Kelola
                  <span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
                </button>
              }
              items={[
                { label: 'Edit Profil', icon: 'edit', onClick: () => setModal('edit') },
                { divider: true },
                { label: 'Hapus Data', icon: 'delete', danger: true, onClick: () => setModal('hapus') },
              ]}
            />
          )}
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-xl font-bold shadow-sm hover:shadow-md hover:bg-secondary/90 transition-all">
            <span className="material-symbols-outlined">print</span>
            Cetak KMS
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-6 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full flex items-center justify-center font-bold text-4xl bg-primary-container text-primary shadow-inner shrink-0">
            {peserta.nama_lengkap?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface mb-1">{peserta.nama_lengkap}</h2>
            <div className="flex flex-wrap items-center gap-3 text-on-surface-variant">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[18px]">badge</span> NIK: {peserta.nik || '-'}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">
                  {peserta.jenis_kelamin === 'L' ? 'boy' : 'girl'}
                </span> 
                {peserta.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Status Gizi Terakhir', value: riwayat.length > 0 ? riwayat[0].status_gizi : 'Belum Ditimbang', isHighlight: true },
            { label: 'BB Terakhir', value: riwayat.length > 0 ? `${riwayat[0].berat_badan} kg` : '-' },
            { label: 'PB/TB Terakhir', value: riwayat.length > 0 ? `${riwayat[0].tinggi_badan} cm` : '-' },
            { label: 'LK Terakhir', value: riwayat.length > 0 && riwayat[0].lingkar_kepala ? `${riwayat[0].lingkar_kepala} cm` : '-' },
            { label: 'Tgl Lahir', value: peserta.tanggal_lahir ? new Date(peserta.tanggal_lahir).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'}) : '-' },
            { label: 'Usia', value: getUmur(peserta.tanggal_lahir) },
            { label: 'Nama Ibu', value: peserta.nama_ibu || '-' },
            { label: 'Nama Ayah', value: peserta.nama_ayah || '-' },
            { label: 'Alamat', value: peserta.alamat || '-' },
          ].map(item => (
            <div key={item.label} className={`rounded-xl p-4 ${
              item.isHighlight && item.value === 'Buruk' ? 'bg-red-600 text-white shadow-sm' : 
              item.isHighlight && item.value === 'Baik' ? 'bg-green-600 text-white shadow-sm' : 
              item.isHighlight && (item.value === 'Kurang' || item.value === 'Risiko Lebih' || item.value === 'Lebih' || item.value === 'Obesitas') ? 'bg-orange-500 text-white shadow-sm' : 
              'bg-surface-container-low border border-outline-variant/50'
            } ${item.label === 'Alamat' ? 'col-span-2 md:col-span-4' : ''}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${item.isHighlight ? 'text-white/80' : 'text-on-surface-variant'}`}>{item.label}</p>
              <p className={`font-bold text-base ${item.isHighlight ? 'text-white' : 'text-on-surface'}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Growth Chart & History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart Section */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-6">
          <h3 className="text-title-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">show_chart</span>
            Grafik Pertumbuhan
          </h3>
          
          {riwayat.length > 1 ? (
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={[...riwayat].sort((a,b) => new Date(a.tanggal_ukur) - new Date(b.tanggal_ukur)).map(r => ({ ...r, bulan: new Date(r.tanggal_ukur).toLocaleDateString('id-ID', { month: 'short' }) }))} 
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                  <XAxis dataKey="bulan" tick={{ fontSize: 12, fill: '#49454f' }} />
                  <YAxis tick={{ fontSize: 12, fill: '#49454f' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #79747e', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    labelStyle={{ fontWeight: 'bold', color: '#1d192b', marginBottom: '4px' }}
                  />
                  <Line type="monotone" dataKey="berat_badan" name="Berat (kg)" stroke="#006d40" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, fill: '#006d40' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-40 mb-2">monitoring</span>
              <p className="text-on-surface-variant font-medium text-center px-4">Grafik akan muncul setelah anak memiliki minimal 2 data penimbangan.</p>
            </div>
          )}
        </div>

        {/* History Section */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-6">
          <h3 className="text-title-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            Riwayat Penimbangan
          </h3>

          {riwayat.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-surface-container-low rounded-xl border border-dashed border-outline-variant">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant opacity-40 mb-2">history_toggle_off</span>
              <p className="text-on-surface-variant font-medium text-center px-4">Belum ada riwayat penimbangan untuk anak ini.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {riwayat.map(r => (
                <div key={r.id} className="flex flex-col bg-surface hover:bg-surface-container-low transition-colors p-4 rounded-xl border border-outline-variant gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant text-[18px]">calendar_month</span>
                      </div>
                      <div>
                        <p className="font-bold text-on-surface text-sm">{new Date(r.tanggal_ukur).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        <p className="text-xs text-on-surface-variant mt-0.5">
                          BB: {r.berat_badan} kg &nbsp;|&nbsp; TB: {r.tinggi_badan} cm
                          {r.lingkar_kepala ? ` | LK: ${r.lingkar_kepala} cm` : ''}
                        </p>
                      </div>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm shrink-0 ${
                      r.status_gizi === 'Baik' ? 'bg-green-600' : 
                      r.status_gizi === 'Buruk' ? 'bg-red-600' : 
                      'bg-orange-500'
                    }`}>
                      {r.status_gizi || '-'}
                    </div>
                  </div>
                  {r.imunisasi && (
                    <div className="flex items-center gap-1.5 ml-13 pl-13">
                      <span className="material-symbols-outlined text-primary text-[14px]">vaccines</span>
                      <span className="text-xs font-semibold text-primary bg-primary/8 px-2 py-0.5 rounded-full">{r.imunisasi}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ===== MODALS ===== */}
      {modal === 'edit' && peserta && (
        <Modal isOpen={true} onClose={() => setModal(null)} title="Edit Data Balita" size="lg">
          <FormPeserta data={peserta} onClose={() => setModal(null)} onSave={handleSave} />
        </Modal>
      )}

      <Modal isOpen={modal === 'hapus'} onClose={() => setModal(null)} title="Konfirmasi Hapus" size="sm">
        <ConfirmHapus peserta={peserta} onConfirm={handleHapus} onClose={() => setModal(null)} />
      </Modal>
    </div>
  );
};

export default DetailBalita;
