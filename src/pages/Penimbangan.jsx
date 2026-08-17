import React, { useState, useEffect } from 'react';
import Toast from '../components/UI/Toast';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { hitungUmurBulan, calculateStatusGizi } from '../utils/giziCalculator';

const Penimbangan = () => {
  const { logAudit } = useAuth();
  const [balitaList, setBalitaList] = useState([]);
  const [searchBalita, setSearchBalita] = useState('');
  const [form, setForm] = useState({
    id_balita: '',
    berat_badan: '',
    tinggi_badan: '',
    status_gizi: '',
    catatan: '',
  });
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sudahTimbangIds, setSudahTimbangIds] = useState(new Set());
  const [comboOpen, setComboOpen] = useState(false);
  const [comboSearch, setComboSearch] = useState('');
  const comboRef = React.useRef(null);

  const bulanIni = new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  // Close combobox on outside click
  useEffect(() => {
    const handleClick = (e) => { if (comboRef.current && !comboRef.current.contains(e.target)) setComboOpen(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const fetchBalita = async () => {
      try {
        const res = await api.post('/query', {
          table: 'balita',
          action: 'select',
          sortConfig: { field: 'nama_lengkap', ascending: true }
        });
        if (res.data.data) setBalitaList(res.data.data);
      } catch (err) {
        console.error('Gagal memuat balita:', err.message);
      }
    };

    const fetchSudahTimbang = async () => {
      try {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // Ambil semua penimbangan, lalu filter di frontend berdasarkan bulan & tahun
        const res = await api.post('/query', {
          table: 'penimbangan',
          action: 'select'
        });
        if (res.data.data) {
          const timbangBulanIni = res.data.data.filter(d => {
            const tgl = d.tanggal_ukur ? d.tanggal_ukur.substring(0, 7) : '';
            return tgl === `${year}-${month}`;
          });
          setSudahTimbangIds(new Set(timbangBulanIni.map(d => d.id_balita)));
        }
      } catch (err) {
        console.error('Gagal memuat data penimbangan bulan ini:', err.message);
      }
    };

    fetchBalita();
    fetchSudahTimbang();
  }, []);

  const filteredBalita = comboSearch
    ? balitaList.filter(b =>
        b.nama_lengkap?.toLowerCase().includes(comboSearch.toLowerCase()) ||
        b.nama_ibu?.toLowerCase().includes(comboSearch.toLowerCase())
      )
    : balitaList;

  const selectedBalitaObj = balitaList.find(b => b.id === form.id_balita);

  const handleSelectBalita = (b) => {
    setComboSearch('');
    setComboOpen(false);
    setForm(prev => ({ ...prev, id_balita: b.id, status_gizi: '' }));
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchBalita(val);
    if (!val) {
      setForm(prev => ({ ...prev, id_balita: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const updatedForm = { ...prev, [name]: value };

      if (name === 'berat_badan' || name === 'tinggi_badan' || name === 'id_balita') {
        const balitaId = name === 'id_balita' ? value : updatedForm.id_balita;
        const selectedBalita = balitaList.find(b => b.id === balitaId);
        
        if (selectedBalita && updatedForm.berat_badan && updatedForm.tinggi_badan) {
          const umurBulan = hitungUmurBulan(selectedBalita.tanggal_lahir);
          updatedForm.status_gizi = calculateStatusGizi(
            updatedForm.berat_badan,
            updatedForm.tinggi_badan,
            umurBulan,
            selectedBalita.jenis_kelamin
          );
        } else if (name === 'id_balita') {
          updatedForm.status_gizi = '';
        }
      }
      return updatedForm;
    });
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const selectedBalita = balitaList.find(b => b.id === form.id_balita);
      const namaBalita = selectedBalita ? selectedBalita.nama_lengkap : 'Balita';

      const payload = {
        id_balita: form.id_balita,
        tanggal_ukur: new Date().toISOString().split('T')[0],
        berat_badan: parseFloat(form.berat_badan) || 0,
        tinggi_badan: parseFloat(form.tinggi_badan) || 0,
        status_gizi: form.status_gizi,
        keterangan: form.catatan,
      };

      const res = await api.post('/query', {
        table: 'penimbangan',
        action: 'insert',
        payload: [payload]
      });

      if (res.data.error) throw new Error(res.data.error);

      showToast(`Hasil penimbangan ${namaBalita} berhasil disimpan!`);
      logAudit('CREATE', 'Penimbangan', `Input penimbangan balita: ${namaBalita} (${form.berat_badan}kg, ${form.tinggi_badan}cm)`);

      // Reset form
      setForm({ id_balita: '', berat_badan: '', tinggi_badan: '', status_gizi: '', catatan: '' });
      setComboSearch('');
      // Update daftar sudah timbang (tandai balita ini sudah timbang)
      setSudahTimbangIds(prev => new Set([...prev, form.id_balita]));
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Gagal menyimpan data', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 lg:px-margin-page py-6 lg:py-8 max-w-4xl mx-auto w-full">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6 lg:mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="relative z-10 lg:static bg-gradient-to-br from-primary to-[#005230] lg:bg-none p-6 lg:p-0 rounded-2xl lg:rounded-none text-on-primary-container lg:text-on-surface shadow-md lg:shadow-none overflow-hidden lg:overflow-visible">
          <p className="text-xs font-bold opacity-90 text-white/80 lg:hidden">Formulir Pengukuran</p>
          <h2 className="text-title-lg font-bold mt-1 text-white lg:text-on-surface">Pencatatan Hasil Penimbangan</h2>
          <p className="text-sm mt-2 opacity-80 text-white/90 lg:text-on-surface-variant">Masukkan data pengukuran rutin balita untuk memantau tumbuh kembang.</p>
        </div>
      </div>

      {/* Info Bulan Penimbangan */}
      <div className="flex items-center justify-between mb-4 p-4 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
          <span className="font-bold text-on-surface text-sm">Penimbangan Bulan: <span className="text-primary">{bulanIni}</span></span>
        </div>
        <span className="text-xs text-on-surface-variant">{sudahTimbangIds.size} anak sudah ditimbang</span>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl lg:rounded-xl p-5 lg:p-8 shadow-sm border border-outline-variant">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface px-1">Nama Balita *</label>
            {/* Combobox: searchable dropdown */}
            <div className="relative" ref={comboRef}>
              <div
                onClick={() => setComboOpen(o => !o)}
                className={`w-full min-h-[48px] h-12 px-4 pl-12 pr-10 bg-surface rounded-xl border-2 flex items-center cursor-pointer text-sm transition-all ${
                  comboOpen ? 'border-secondary' : 'border-outline-variant'
                }`}
              >
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">person</span>
                <span className={`text-body-md ${selectedBalitaObj ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                  {selectedBalitaObj
                    ? <>{sudahTimbangIds.has(selectedBalitaObj.id) && <span className="text-primary font-bold mr-1">✓</span>}{selectedBalitaObj.nama_lengkap} <span className="text-on-surface-variant font-normal text-sm">(Ibu: {selectedBalitaObj.nama_ibu})</span></>
                    : balitaList.length === 0 ? 'Memuat data balita...' : '-- Pilih Balita --'
                  }
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">{comboOpen ? 'expand_less' : 'expand_more'}</span>
              </div>

              {comboOpen && (
                <div className="absolute z-50 mt-1 w-full bg-surface rounded-xl border-2 border-secondary shadow-xl overflow-hidden">
                  <div className="p-2 border-b border-outline-variant">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px]">search</span>
                      <input
                        autoFocus
                        type="text"
                        placeholder="Ketik nama balita atau ibu..."
                        value={comboSearch}
                        onChange={e => setComboSearch(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 bg-surface-container-low rounded-lg text-sm outline-none"
                      />
                    </div>
                  </div>
                  <div className="max-h-52 overflow-y-auto">
                    {filteredBalita.length === 0 ? (
                      <div className="p-4 text-sm text-center text-on-surface-variant">Tidak ada hasil</div>
                    ) : (
                      filteredBalita.map(b => (
                        <div
                          key={b.id}
                          onClick={() => handleSelectBalita(b)}
                          className={`px-4 py-3 cursor-pointer flex items-center justify-between hover:bg-surface-container transition-colors ${
                            form.id_balita === b.id ? 'bg-secondary/10' : ''
                          }`}
                        >
                          <div>
                            <p className="font-bold text-sm text-on-surface">{b.nama_lengkap}</p>
                            <p className="text-xs text-on-surface-variant">Ibu: {b.nama_ibu}</p>
                          </div>
                          {sudahTimbangIds.has(b.id) && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full">✓ Sudah</span>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:gap-8">
            <div className="flex flex-col gap-2">
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Berat Badan (kg) *</label>
              <div className="relative">
                <span className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">scale</span>
                <input
                  name="berat_badan"
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.0"
                  value={form.berat_badan}
                  onChange={handleChange}
                  className="w-full h-12 pl-10 pr-10 bg-surface rounded-xl border-2 border-outline-variant focus:border-secondary focus:ring-0 text-sm transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">kg</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-on-surface px-1">Tinggi Badan (cm) *</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">straighten</span>
                <input
                  name="tinggi_badan"
                  type="number"
                  step="0.1"
                  required
                  placeholder="0.0"
                  value={form.tinggi_badan}
                  onChange={handleChange}
                  className="w-full h-12 pl-10 pr-10 bg-surface rounded-xl border-2 border-outline-variant focus:border-secondary focus:ring-0 text-sm transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-bold">cm</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface px-1">Status Gizi *</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">monitoring</span>
              <input
                type="text"
                name="status_gizi"
                value={form.status_gizi}
                readOnly
                placeholder="Otomatis terisi setelah input BB & TB"
                className={`w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 transition-all text-sm font-bold 
                  ${!form.status_gizi ? 'border-outline-variant text-on-surface-variant' :
                    form.status_gizi === 'Baik' ? 'border-primary text-primary bg-primary/5' :
                    form.status_gizi === 'Buruk' ? 'border-error text-error bg-error/10' :
                    'border-secondary text-secondary bg-secondary/10'}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none text-[20px]">auto_awesome</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface px-1">Catatan Tambahan</label>
            <div className="relative">
              <span className="absolute left-4 top-4 lg:top-3 material-symbols-outlined text-outline text-[20px]">edit_note</span>
              <textarea
                name="catatan"
                rows="3"
                value={form.catatan}
                onChange={handleChange}
                placeholder="Catatan perkembangan balita..."
                className="w-full p-3 pl-12 bg-surface rounded-xl border-2 border-outline-variant focus:border-secondary focus:ring-0 text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-2 lg:mt-4">
            <button
              type="submit"
              disabled={loading || !form.id_balita}
              className="w-full lg:flex-1 h-11 bg-primary text-on-primary text-sm font-bold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              {loading ? 'Menyimpan...' : 'Simpan Data Penimbangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Penimbangan;
