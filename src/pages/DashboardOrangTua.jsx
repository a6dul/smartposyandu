import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const statusColor = (status) => {
  if (!status || status === 'Belum Ditimbang') return { bg: 'bg-surface-container', text: 'text-on-surface-variant', badge: 'bg-surface-container-highest text-on-surface-variant' };
  if (status === 'Baik') return { bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-600 text-white' };
  if (status === 'Buruk') return { bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-600 text-white' };
  return { bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-500 text-white' };
};

const getUmur = (tglLahir) => {
  if (!tglLahir) return '-';
  const lahir = new Date(tglLahir);
  const now = new Date();
  const bulan = (now.getFullYear() - lahir.getFullYear()) * 12 + now.getMonth() - lahir.getMonth();
  if (bulan >= 12) return `${Math.floor(bulan / 12)} thn ${bulan % 12} bln`;
  return `${bulan} bulan`;
};

const DashboardOrangTua = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [balitaList, setBalitaList] = useState([]);
  const [penimbanganMap, setPenimbanganMap] = useState({});
  const [jadwal, setJadwal] = useState([]);
  const [notif, setNotif] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChild, setActiveChild] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      let children = [];

      if (profile?.id) {
        const { data: balitaData } = await supabase
          .from('balita').select('*').eq('id_orang_tua', profile.id);
        children = balitaData || [];
      }

      setBalitaList(children);

      if (children.length > 0) {
        const ids = children.map(b => b.id);
        const { data: penData } = await supabase
          .from('penimbangan').select('*')
          .order('tanggal_ukur', { ascending: true });
        const filtered = (penData || []).filter(p => ids.includes(p.id_balita));
        const map = {};
        filtered.forEach(p => {
          if (!map[p.id_balita]) map[p.id_balita] = [];
          map[p.id_balita].push(p);
        });
        setPenimbanganMap(map);
      }

      try {
        const { data: jData } = await supabase.from('jadwal_layanan').select('*').order('tanggal', { ascending: true });
        const { data: pData } = await supabase.from('pengaturan_sistem').select('nama_posyandu').single();
        
        const jadwalLayanan = (jData || []).slice(0, 3).map(j => ({
          ...j,
          tempat: pData?.nama_posyandu || j.tempat
        }));
        setJadwal(jadwalLayanan);
      } catch (_) {}

      try {
        const { data: nData } = await supabase.from('notifikasi').select('*').order('created_at', { ascending: false });
        setNotif((nData || []).slice(0, 3));
      } catch (_) {}

      setLoading(false);
    };
    fetchAll();
  }, [profile?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">autorenew</span>
          <p className="text-on-surface-variant font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  const child = balitaList[activeChild];
  const childRiwayat = child ? (penimbanganMap[child.id] || []) : [];
  const latestTimbang = childRiwayat[childRiwayat.length - 1] || null;
  const statusInfo = statusColor(latestTimbang?.status_gizi);

  const chartData = childRiwayat.slice(-6).map(r => ({
    bulan: new Date(r.tanggal_ukur).toLocaleDateString('id-ID', { month: 'short' }),
    berat: parseFloat(r.berat_badan),
  }));

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 11 ? 'Selamat Pagi' : greetingHour < 15 ? 'Selamat Siang' : greetingHour < 18 ? 'Selamat Sore' : 'Selamat Malam';

  return (
    <div className="w-full px-4 lg:px-8 py-6 max-w-5xl mx-auto">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-[#005230] to-[#003d22] p-6 text-white mb-6 shadow-lg">
        <div className="relative z-10">
          <p className="text-sm opacity-80 font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold mt-0.5">{profile?.nama_lengkap?.split(' ')[0] || 'Orang Tua'} 👋</h1>
          <p className="text-sm opacity-75 mt-1">
            {balitaList.length === 0 ? 'Belum ada anak yang terdaftar.' : `Anda memantau ${balitaList.length} anak di Posyandu.`}
          </p>
        </div>
        <div className="absolute -right-6 -bottom-6 opacity-10">
          <span className="material-symbols-outlined text-[120px]">family_restroom</span>
        </div>
      </div>

      {balitaList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4 bg-surface-container-lowest rounded-2xl border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-[64px] text-on-surface-variant opacity-30">child_care</span>
          <p className="text-on-surface-variant font-medium text-center px-8">
            Data anak Anda belum terdaftar di posyandu ini.<br/>
            Silakan hubungi kader untuk pendaftaran.
          </p>
        </div>
      ) : (
        <>
          {/* TAB ANAK jika lebih dari 1 */}
          {balitaList.length > 1 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {balitaList.map((b, i) => (
                <button key={b.id} onClick={() => setActiveChild(i)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${activeChild === i ? 'bg-primary text-white shadow-md' : 'bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'}`}>
                  <span className="material-symbols-outlined text-[16px]">child_care</span>
                  {b.nama_lengkap.split(' ')[0]}
                </button>
              ))}
            </div>
          )}

          {/* KARTU ANAK */}
          <div
            className={`rounded-2xl p-5 mb-4 border border-outline-variant/30 shadow-sm cursor-pointer hover:shadow-md transition-all ${statusInfo.bg}`}
            onClick={() => navigate(`/dashboard/balita/${child.id}`)}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-2xl shrink-0 shadow-inner overflow-hidden">
                {child.foto
                  ? <img src={`${child.foto}`} className="w-full h-full object-cover" alt="" />
                  : child.nama_lengkap?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-on-surface leading-tight">{child.nama_lengkap}</h2>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      {getUmur(child.tanggal_lahir)} &bull; {child.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </p>
                  </div>
                  <span className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${statusInfo.badge}`}>
                    {latestTimbang?.status_gizi || 'Belum Ditimbang'}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Berat Terakhir', value: latestTimbang ? `${latestTimbang.berat_badan} kg` : '-', icon: 'monitor_weight' },
                { label: 'Tinggi Terakhir', value: latestTimbang ? `${latestTimbang.tinggi_badan} cm` : '-', icon: 'height' },
                { label: 'Total Kunjungan', value: childRiwayat.length, icon: 'event_available' },
              ].map(s => (
                <div key={s.label} className="bg-white/70 rounded-xl p-3 text-center">
                  <span className="material-symbols-outlined text-primary text-[20px]">{s.icon}</span>
                  <p className="text-base font-bold text-on-surface mt-0.5">{s.value}</p>
                  <p className="text-[10px] text-on-surface-variant font-medium leading-tight">{s.label}</p>
                </div>
              ))}
            </div>

            {latestTimbang && (
              <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                Ditimbang: {new Date(latestTimbang.tanggal_ukur).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}

            <p className="text-xs font-bold text-primary mt-2 flex items-center gap-1">
              Lihat Profil Lengkap <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </p>
          </div>

          {/* GRAFIK */}
          {chartData.length > 1 && (
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 mb-4 shadow-sm">
              <h3 className="font-bold text-on-surface mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">show_chart</span>
                Grafik Berat Badan
              </h3>
              <p className="text-xs text-on-surface-variant mb-3">6 kunjungan terakhir</p>
              <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="beratGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006d40" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#006d40" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e0ea" />
                    <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#49454f' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#49454f' }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #79747e', fontSize: '12px' }}
                      formatter={(val) => [`${val} kg`, 'Berat']} />
                    <Area type="monotone" dataKey="berat" stroke="#006d40" strokeWidth={2.5} fill="url(#beratGrad2)"
                      dot={{ r: 4, fill: '#fff', stroke: '#006d40', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* AKSI CEPAT */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Link to="/dashboard/riwayat"
              className="flex items-center gap-3 p-4 bg-primary text-white rounded-2xl font-bold shadow-md hover:bg-primary/90 transition-all">
              <span className="material-symbols-outlined text-[24px]">history</span>
              <span className="text-sm">Riwayat Timbang</span>
            </Link>
            <button onClick={() => child && navigate(`/dashboard/balita/${child.id}`)}
              className="flex items-center gap-3 p-4 bg-surface-container-lowest border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary/5 transition-all">
              <span className="material-symbols-outlined text-[24px]">person</span>
              <span className="text-sm">Profil Anak</span>
            </button>
          </div>
        </>
      )}

      {/* JADWAL */}
      {jadwal.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 mb-4 shadow-sm">
          <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">calendar_month</span>
            Jadwal Posyandu
          </h3>
          <div className="space-y-2">
            {jadwal.map(j => (
              <div key={j.id} className="flex gap-3 items-center p-3 bg-surface-container-low rounded-xl border border-outline-variant/40">
                <div className="text-center min-w-[40px]">
                  <p className="text-xs font-bold text-on-surface-variant uppercase">{(j.hari || '').slice(0, 3)}</p>
                  <p className="text-lg font-bold text-secondary leading-none">{(j.tanggal || '').substring(8, 10)}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-on-surface truncate">{j.kegiatan}</p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                    <span className="material-symbols-outlined text-[12px]">location_on</span>
                    {j.tempat} &bull; {j.waktu}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PENGUMUMAN */}
      {notif.length > 0 && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-5 shadow-sm">
          <h3 className="font-bold text-on-surface mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-tertiary text-[20px]">campaign</span>
            Pengumuman dari Kader
          </h3>
          <div className="space-y-2">
            {notif.map(n => (
              <div key={n.id} className="p-3 bg-primary/5 rounded-xl border border-primary/15">
                <p className="font-bold text-sm text-primary">{n.judul}</p>
                <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{n.pesan}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardOrangTua;

