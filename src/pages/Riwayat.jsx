import React, { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ── Detail Riwayat Modal ──────────────────────────────────────
const DetailRiwayat = ({ item, historyData }) => {
  if (!item) return null;

  const giziConfig = {
    'Baik': { icon: 'trending_up', color: 'text-primary', bg: 'bg-primary/5 border-primary/20', label: 'Gizi Baik – Berat Badan Naik', desc: 'Sesuai dengan kurva pertumbuhan WHO' },
    'Kurang': { icon: 'warning', color: 'text-error', bg: 'bg-error-container/20 border-error/20', label: 'Perhatian: Gizi Kurang', desc: 'Perlu perhatian dan intervensi gizi' },
    'Buruk': { icon: 'emergency', color: 'text-error', bg: 'bg-error-container/30 border-error/30', label: 'Kritis: Gizi Buruk', desc: 'Segera rujuk ke Puskesmas' },
    'Lebih': { icon: 'info', color: 'text-tertiary', bg: 'bg-tertiary/5 border-tertiary/20', label: 'Gizi Lebih / Obesitas', desc: 'Perlu konsultasi pola makan' },
  };

  const gizi = giziConfig[item.status_gizi] || giziConfig['Baik'];

  const getUmur = (tglLahir) => {
    if (!tglLahir) return '-';
    const lahir = new Date(tglLahir);
    const sekarang = new Date();
    const bulan = (sekarang.getFullYear() - lahir.getFullYear()) * 12 + (sekarang.getMonth() - lahir.getMonth());
    return `${bulan} bulan`;
  };

  return (
    <div className="space-y-4 pb-2">
      <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl">
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl bg-primary-fixed text-on-primary-fixed">
          {item.balita?.nama_lengkap?.charAt(0) || '?'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-on-surface">{item.balita?.nama_lengkap}</h3>
          <p className="text-sm text-on-surface-variant">{new Date(item.tanggal_ukur).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Berat Badan', value: `${item.berat_badan} kg` },
          { label: 'Tinggi Badan', value: `${item.tinggi_badan} cm` },
          { label: 'Lingkar Kepala', value: item.lingkar_kepala ? `${item.lingkar_kepala} cm` : '-' },
          { label: 'Status Gizi', value: item.status_gizi || 'Baik' },
          { label: 'Usia', value: getUmur(item.balita?.tanggal_lahir) },
        ].map(d => (
          <div key={d.label} className="bg-surface-container-low rounded-xl p-3">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">{d.label}</p>
            <p className="font-bold text-on-surface mt-0.5">{d.value}</p>
          </div>
        ))}
      </div>
      {item.imunisasi && (
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[22px]">vaccines</span>
          <div>
            <p className="text-sm font-bold text-primary mb-0.5">Imunisasi Diberikan</p>
            <p className="text-sm text-on-surface font-semibold">{item.imunisasi}</p>
          </div>
        </div>
      )}
      {item.keterangan && (
        <div className="p-4 bg-primary-container/10 rounded-xl border border-primary/20">
          <p className="text-sm font-bold text-primary mb-1">Catatan Kader</p>
          <p className="text-sm text-on-surface-variant">{item.keterangan}</p>
        </div>
      )}
      <div className={`p-4 rounded-xl border flex items-center gap-3 ${gizi.bg}`}>
        <span className={`material-symbols-outlined text-[24px] ${gizi.color}`}>{gizi.icon}</span>
        <div>
          <p className={`font-bold text-sm ${gizi.color}`}>{gizi.label}</p>
          <p className="text-xs text-on-surface-variant">{gizi.desc}</p>
        </div>
      </div>

      {historyData && historyData.length > 1 && (
        <div className="mt-6">
          <h4 className="text-sm font-bold text-on-surface mb-4 border-l-4 border-primary pl-2">Grafik Pertumbuhan (Berat Badan)</h4>
          <div className="h-48 w-full bg-surface-container-lowest rounded-xl border border-outline-variant p-2 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historyData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#1a1a1a' }}
                />
                <Line type="monotone" dataKey="berat_badan" name="Berat (kg)" stroke="#006d40" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN RIWAYAT COMPONENT
// ═══════════════════════════════════════════════════════════════
const Riwayat = () => {
  const { profile, appRole } = useAuth();
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [toast, setToast] = useState(null);
  const [openMonths, setOpenMonths] = useState({});
  const [sortDesc, setSortDesc] = useState(true);



  const isOrangTua = appRole === 'orang_tua';

  useEffect(() => {
    const fetchRiwayat = async () => {
      setLoading(true);
      // Ambil data penimbangan
      const { data: penimbanganData, error } = await supabase
        .from('penimbangan')
        .select('*')
        .order('tanggal_ukur', { ascending: false });

      if (!error && penimbanganData) {
        // Ambil data balita
        let query = supabase.from('balita').select('*');
        
        // JIKA ORANG TUA: batasi hanya balita miliknya
        if (isOrangTua && profile?.id) {
          query = query.eq('id_orang_tua', profile.id);
        }

        const { data: balitaData } = await query;
        const balitaMap = {};
        (balitaData || []).forEach(b => { balitaMap[b.id] = b; });

        // Filter penimbangan yang hanya dimiliki balita ter-map
        const enriched = penimbanganData
          .filter(p => balitaMap[p.id_balita])
          .map(p => ({
            ...p,
            balita: balitaMap[p.id_balita] || null,
          }));
        setRiwayatData(enriched);
      }
      setLoading(false);
    };
    fetchRiwayat();
  }, [profile, appRole]);

  const filtered = riwayatData
    .filter(r => r.balita?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortDesc
      ? new Date(b.tanggal_ukur) - new Date(a.tanggal_ukur)
      : new Date(a.tanggal_ukur) - new Date(b.tanggal_ukur)
    );

  // Group filtered data by year-month
  const groupedByMonth = filtered.reduce((acc, item) => {
    const d = new Date(item.tanggal_ukur);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    if (!acc[key]) acc[key] = { key, label, items: [] };
    acc[key].items.push(item);
    return acc;
  }, {});

  const monthKeys = Object.keys(groupedByMonth).sort((a, b) =>
    sortDesc ? b.localeCompare(a) : a.localeCompare(b)
  );

  // Auto-open the latest month on first load
  useEffect(() => {
    if (monthKeys.length > 0 && Object.keys(openMonths).length === 0) {
      setOpenMonths({ [monthKeys[0]]: true });
    }
  }, [monthKeys.length]);

  const toggleMonth = (key) => setOpenMonths(prev => ({ ...prev, [key]: !prev[key] }));

  const getStatusConfig = (status) => {
    const map = {
      'Baik': { icon: 'trending_up', color: 'text-primary', dot: 'bg-primary', badge: 'bg-primary/10 text-primary' },
      'Kurang': { icon: 'warning', color: 'text-error', dot: 'bg-error', badge: 'bg-error/10 text-error' },
      'Buruk': { icon: 'emergency', color: 'text-error', dot: 'bg-error', badge: 'bg-error/10 text-error' },
      'Lebih': { icon: 'info', color: 'text-tertiary', dot: 'bg-tertiary', badge: '' },
    };
    return map[status] || map['Baik'];
  };

  return (
    <div className="p-4 lg:p-margin-page flex flex-col gap-stack-gap max-w-7xl mx-auto w-full">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
        <div>
          <h2 className="text-title-lg font-bold text-on-surface">Riwayat Kesehatan Anak</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Pantau riwayat penimbangan dan perkembangan anak secara berkala.</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
          <span className="material-symbols-outlined text-[16px]">info</span>
          {filtered.length} catatan
        </div>
      </div>

      <div className="bg-surface-container-lowest p-4 rounded-2xl shadow-sm border border-outline-variant">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-outline-variant focus:border-primary outline-none text-sm transition-all bg-surface"
              placeholder="Cari nama anak..." />
          </div>
          <button
            onClick={() => setSortDesc(p => !p)}
            className="h-11 w-full md:w-auto px-5 border-2 border-outline-variant rounded-xl flex items-center justify-center gap-2 hover:bg-surface-container transition-colors text-on-surface-variant text-sm font-bold">
            <span className="material-symbols-outlined text-[18px]">{sortDesc ? 'arrow_downward' : 'arrow_upward'}</span>
            {sortDesc ? 'Terbaru' : 'Terlama'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-2 animate-spin opacity-60">progress_activity</span>
            Memuat riwayat...
          </div>
        ) : monthKeys.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant p-12 text-center text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] block mb-2 opacity-40">search_off</span>
            {search ? 'Tidak ada riwayat yang sesuai pencarian.' : 'Belum ada data penimbangan.'}
          </div>
        ) : (
          monthKeys.map(key => {
            const { label, items } = groupedByMonth[key];
            const isOpen = !!openMonths[key];
            const burukCount = items.filter(i => i.status_gizi === 'Buruk').length;
            const kurangCount = items.filter(i => i.status_gizi === 'Kurang').length;
            return (
              <div key={key} className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
                {/* Month Header (collapsible) */}
                <button
                  onClick={() => toggleMonth(key)}
                  className="w-full flex items-center justify-between p-4 lg:p-5 hover:bg-surface-container transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-[20px]">calendar_month</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-on-surface">{label}</p>
                      <p className="text-xs text-on-surface-variant">{items.length} catatan penimbangan</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {burukCount > 0 && <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-1 rounded-full">{burukCount} Gizi Buruk</span>}
                    {kurangCount > 0 && <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-1 rounded-full">{kurangCount} Kurang</span>}
                    <span className="material-symbols-outlined text-on-surface-variant">{isOpen ? 'expand_less' : 'expand_more'}</span>
                  </div>
                </button>

                {/* Month Items */}
                {isOpen && (
                  <div className="border-t border-outline-variant divide-y divide-outline-variant/30">
                    {items.map(item => {
                      const cfg = getStatusConfig(item.status_gizi);
                      return (
                        <button
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className="w-full text-left px-5 py-4 hover:bg-surface-container transition-colors group flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-primary-container text-primary shrink-0`}>
                              {item.balita?.nama_lengkap?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{item.balita?.nama_lengkap || 'Balita'}</p>
                              <p className="text-xs text-on-surface-variant">{item.berat_badan} kg · {item.tinggi_badan} cm</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`text-[11px] font-bold px-3 py-1 rounded-full text-white ${
                              item.status_gizi === 'Baik' ? 'bg-green-600' :
                              item.status_gizi === 'Buruk' ? 'bg-red-600' : 'bg-orange-500'
                            }`}>{item.status_gizi || 'Baik'}</span>
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant group-hover:text-primary transition-colors">chevron_right</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <Modal isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} title="Detail Riwayat" size="md">
        <DetailRiwayat 
          item={selectedItem} 
          historyData={selectedItem ? riwayatData.filter(r => r.id_balita === selectedItem.id_balita).sort((a,b) => new Date(a.tanggal_ukur) - new Date(b.tanggal_ukur)).map(r => ({ ...r, bulan: new Date(r.tanggal_ukur).toLocaleDateString('id-ID', { month: 'short' }) })) : []} 
        />
      </Modal>
    </div>
  );
};

export default Riwayat;
