import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import Toast from '../components/UI/Toast';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import DashboardOrangTua from './DashboardOrangTua';

// ── Jadwal Layanan Modal Content ──────────────────────────────
const JadwalContent = ({ canEdit }) => {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ tanggal: '', hari: '', waktu: '', tempat: '', kegiatan: '', badge: 'primary' });
  const [saving, setSaving] = useState(false);

  const fetchJadwal = async () => {
    setLoading(true);
    try {
      const { data: jData } = await supabase.from('jadwal_layanan').select('*').order('tanggal', { ascending: true });
      setJadwal(jData || []);
    } catch (e) {
      setJadwal([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJadwal(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const id = `jdwl-${Date.now()}`;
      await supabase.from('jadwal_layanan').insert([{ id, ...form }]);
      setForm({ tanggal: '', hari: '', waktu: '', tempat: '', kegiatan: '', badge: 'primary' });
      setShowForm(false);
      fetchJadwal();
    } catch (e) {
      alert('Gagal menyimpan jadwal.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus jadwal ini?')) return;
    await supabase.from('jadwal_layanan').delete().eq('id', id);
    fetchJadwal();
  };

  const badgeClass = { primary: 'bg-primary text-on-primary', secondary: 'bg-secondary text-on-secondary', tertiary: 'bg-tertiary text-on-tertiary' };

  return (
    <div className="space-y-4 pb-2">
      <div className="p-4 bg-primary-container/10 rounded-xl border border-primary/20 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[28px]">calendar_month</span>
        <div><p className="font-bold text-primary">Jadwal Posyandu</p><p className="text-sm text-on-surface-variant">Layanan kesehatan terjadwal</p></div>
      </div>
      {loading ? (
        <div className="text-center p-6 text-on-surface-variant">Memuat jadwal...</div>
      ) : jadwal.length === 0 ? (
        <div className="text-center p-6 text-on-surface-variant">Belum ada jadwal yang ditambahkan.</div>
      ) : (
        <div className="space-y-3">
          {jadwal.map((j) => (
            <div key={j.id} className="flex gap-4 p-4 bg-surface-container-low rounded-xl border border-outline-variant/40 hover:border-primary/30 transition-colors">
              <div className="text-center min-w-[48px]">
                <p className="text-xs font-bold text-on-surface-variant uppercase">{(j.hari || '').slice(0, 3)}</p>
                <p className="text-xl font-bold text-primary leading-none mt-0.5">{(j.tanggal || '').split('-')[2]}</p>
                <p className="text-xs text-on-surface-variant">{new Date(j.tanggal).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</p>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold text-on-surface text-sm">{j.kegiatan}</p>
                  <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass[j.badge] || badgeClass.primary}`}>{j.waktu}</span>
                </div>
                <div className="flex items-center gap-1 mt-1 text-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">location_on</span>
                  <p className="text-sm truncate">{j.tempat}</p>
                </div>
              </div>
              {canEdit && (
                <button onClick={() => handleDelete(j.id)} className="text-error hover:bg-error/10 rounded-full p-1 self-center transition-colors">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {canEdit && !showForm && (
        <button onClick={() => setShowForm(true)} className="w-full h-12 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2">
          <span className="material-symbols-outlined text-[18px]">add_circle</span> Tambah Jadwal
        </button>
      )}
      {canEdit && showForm && (
        <form onSubmit={handleSave} className="bg-surface-container-low rounded-xl p-4 border border-primary/20 space-y-3">
          <p className="font-bold text-on-surface text-sm">Jadwal Baru</p>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-on-surface-variant">Tanggal</label><input type="date" required value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
            <div><label className="text-xs font-bold text-on-surface-variant">Hari</label><input placeholder="Senin" required value={form.hari} onChange={e => setForm({...form, hari: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
          </div>
          <div><label className="text-xs font-bold text-on-surface-variant">Kegiatan</label><input placeholder="Penimbangan Balita" required value={form.kegiatan} onChange={e => setForm({...form, kegiatan: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
          <div><label className="text-xs font-bold text-on-surface-variant">Tempat</label><input placeholder="Balai Desa RW 01" required value={form.tempat} onChange={e => setForm({...form, tempat: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-xs font-bold text-on-surface-variant">Waktu</label><input placeholder="08:00 - 11:00" value={form.waktu} onChange={e => setForm({...form, waktu: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
            <div><label className="text-xs font-bold text-on-surface-variant">Warna Badge</label>
              <select value={form.badge} onChange={e => setForm({...form, badge: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface">
                <option value="primary">Hijau</option><option value="secondary">Biru</option><option value="tertiary">Merah</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 rounded-lg border-2 border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan Jadwal'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

// ── Notifikasi Modal Content ──────────────────────────────────
const NotifContent = ({ canEdit }) => {
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ judul: '', pesan: '', icon: 'campaign', tipe: 'info' });
  const [saving, setSaving] = useState(false);

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.from('notifikasi').select('*').order('created_at', { ascending: false });
      setNotifs(data || []);
    } catch (e) {
      setNotifs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifs(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const typeConfig = { info: { icon: 'campaign', color_class: 'text-primary', bg_class: 'bg-primary/10' }, warning: { icon: 'warning', color_class: 'text-tertiary', bg_class: 'bg-tertiary/10' }, success: { icon: 'check_circle', color_class: 'text-secondary', bg_class: 'bg-secondary/10' } };
    const cfg = typeConfig[form.tipe] || typeConfig.info;
    try {
      const id = `notif-${Date.now()}`;
      await supabase.from('notifikasi').insert([{ id, judul: form.judul, pesan: form.pesan, tipe: form.tipe, ...cfg }]);
      setForm({ judul: '', pesan: '', icon: 'campaign', tipe: 'info' });
      setShowForm(false);
      fetchNotifs();
    } catch (e) {
      alert('Gagal menyimpan pengumuman.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus pengumuman ini?')) return;
    await supabase.from('notifikasi').delete().eq('id', id);
    fetchNotifs();
  };

  const iconMap = { info: 'campaign', warning: 'warning', success: 'assignment_turned_in' };
  const colorMap = { info: 'text-primary', warning: 'text-tertiary', success: 'text-secondary' };
  const bgMap = { info: 'bg-primary/10', warning: 'bg-tertiary/10', success: 'bg-secondary/10' };

  return (
    <div className="space-y-3 pb-2">
      {loading ? (
        <div className="text-center p-6 text-on-surface-variant">Memuat pengumuman...</div>
      ) : notifs.length === 0 ? (
        <div className="text-center p-6 text-on-surface-variant">Belum ada pengumuman.</div>
      ) : (
        notifs.map((n) => (
          <div key={n.id} className="flex gap-4 p-4 rounded-xl border bg-surface-container-low border-primary/20 hover:border-primary/40 transition-colors cursor-pointer">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${n.bg_class || bgMap[n.tipe] || bgMap.info} shrink-0`}>
              <span className={`material-symbols-outlined text-[20px] ${n.color_class || colorMap[n.tipe] || colorMap.info}`}>{n.icon || iconMap[n.tipe] || 'campaign'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-on-surface">{n.judul}</p>
              <p className="text-sm text-on-surface-variant mt-0.5 leading-snug">{n.pesan}</p>
              <p className="text-xs text-on-surface-variant mt-1.5 font-semibold">{new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            {canEdit && (
              <button onClick={() => handleDelete(n.id)} className="text-error hover:bg-error/10 rounded-full p-1 self-center transition-colors">
                <span className="material-symbols-outlined text-[18px]">delete</span>
              </button>
            )}
          </div>
        ))
      )}
      {canEdit && !showForm && (
        <button onClick={() => setShowForm(true)} className="w-full h-12 rounded-xl bg-primary text-on-primary font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 mt-2">
          <span className="material-symbols-outlined text-[18px]">add_circle</span> Buat Pengumuman
        </button>
      )}
      {canEdit && showForm && (
        <form onSubmit={handleSave} className="bg-surface-container-low rounded-xl p-4 border border-primary/20 space-y-3">
          <p className="font-bold text-on-surface text-sm">Pengumuman Baru</p>
          <div><label className="text-xs font-bold text-on-surface-variant">Judul</label><input placeholder="Judul pengumuman" required value={form.judul} onChange={e => setForm({...form, judul: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface" /></div>
          <div><label className="text-xs font-bold text-on-surface-variant">Pesan</label><textarea placeholder="Isi pengumuman..." required rows={3} value={form.pesan} onChange={e => setForm({...form, pesan: e.target.value})} className="w-full mt-1 p-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface resize-none" /></div>
          <div><label className="text-xs font-bold text-on-surface-variant">Tipe</label>
            <select value={form.tipe} onChange={e => setForm({...form, tipe: e.target.value})} className="w-full mt-1 h-11 px-3 rounded-lg border-2 border-outline-variant focus:border-primary outline-none text-sm bg-surface">
              <option value="info">Info (Hijau)</option><option value="warning">Peringatan (Oranye)</option><option value="success">Sukses (Biru)</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 h-10 rounded-lg border-2 border-outline-variant text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors">Batal</button>
            <button type="submit" disabled={saving} className="flex-1 h-10 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-all shadow-sm disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════
const Dashboard = () => {
  const { profile, appRole } = useAuth();
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ balita: 0, ibuHamil: 0, ibuMenyusui: 0, kunjungan: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [latestNotif, setLatestNotif] = useState(null);

  const isOrangTua = appRole === 'orang_tua';
  const canEdit = appRole === 'administrator' || appRole === 'kader';

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    const fetchStats = async () => {
      // ── Mode Kader/Admin: data global ──
      const { data: balitaData } = await supabase.from('balita').select('*');
      const { data: penimbanganData } = await supabase.from('penimbangan').select('*');
      const { data: ibuHamilData } = await supabase.from('ibu_hamil').select('*');
      const { data: ibuMenyusuiData } = await supabase.from('ibu_menyusui').select('*');
      const allBalita = balitaData || [];
      const allPenimbangan = penimbanganData || [];
      const totalKunjungan = allPenimbangan.length;
      const activeIbuHamil = (ibuHamilData || []).filter(d => d.status_aktif).length;
      const activeIbuMenyusui = (ibuMenyusuiData || []).filter(d => d.status_aktif).length;
      setStats({
        balita: allBalita.length,
        ibuHamil: activeIbuHamil,
        ibuMenyusui: activeIbuMenyusui,
        kunjungan: totalKunjungan,
      });

      // Generate Chart Data
      const currentYear = new Date().getFullYear();
      const monthlyCounts = Array(12).fill(0);
      allPenimbangan.forEach(p => {
        const d = new Date(p.tanggal_ukur);
        if (d.getFullYear() === currentYear) {
          monthlyCounts[d.getMonth()]++;
        }
      });
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const maxCount = Math.max(...monthlyCounts, 5);
      const fullChart = monthlyCounts.map((count, idx) => ({
        label: months[idx],
        count,
        active: count > 0 && count === Math.max(...monthlyCounts)
      }));
      const currentMonth = new Date().getMonth();
      const startMonth = Math.max(0, currentMonth - 5);
      setChartData(fullChart.slice(startMonth, startMonth + 6));

      // Build recent activity
      const balitaMap = {};
      allBalita.forEach(b => { balitaMap[b.id] = b; });
      const recent = allPenimbangan
        .sort((a, b) => new Date(b.tanggal_ukur) - new Date(a.tanggal_ukur))
        .slice(0, 2)
        .map(p => {
          const balita = balitaMap[p.id_balita];
          return {
            init: (balita?.nama_lengkap || 'B').charAt(0),
            nama: balita?.nama_lengkap || 'Balita',
            detail: `Berat: ${p.berat_badan} kg • Tinggi: ${p.tinggi_badan} cm`,
            time: new Date(p.tanggal_ukur).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
          };
        });
      setRecentActivity(recent);
    };
    if (!isOrangTua) fetchStats();
  }, [isOrangTua, profile]);

  // Fetch latest notif for preview card
  useEffect(() => {
    fetch('/api/public/notifikasi')
      .then(r => r.json())
      .then(json => { if (json.data && json.data.length > 0) setLatestNotif(json.data[0]); })
      .catch(() => {});
  }, []);

  // Orang tua gets their own dedicated dashboard (after all hooks)
  if (isOrangTua) return <DashboardOrangTua />;

  return (
    <div className="w-full">
      {/* Toast */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── DESKTOP CONTENT ─────────────────────────────────── */}
      <div className="hidden lg:flex px-margin-page py-8 max-w-7xl mx-auto w-full flex-col gap-8">

        {/* Hero */}
        <section className="bg-primary-container rounded-xl p-8 text-on-primary-container relative overflow-hidden flex flex-col md:flex-row items-center gap-8 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex-1 z-10">
            <h3 className="text-headline-lg font-bold mb-4 text-white">SmartPosyandu</h3>
            <p className="text-body-lg opacity-90 leading-relaxed text-white/95">
              Sistem Informasi Digital Posyandu untuk Pencatatan, Pemantauan, dan Pelaporan Layanan Kesehatan Ibu dan Anak.
            </p>
          </div>
          <div className="w-full md:w-1/3 flex justify-center z-10">
            <img alt="Ilustrasi Ibu dan Anak" className="rounded-xl shadow-lg w-full max-w-[300px]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEzITRh4WX9aD-KyeIH2_yUUrVi341WGA6kof5yjKox5Hm7WKAs-0UYHFjEwMaUihnUR-1IKRQxQgwcfwfwspsrNTmLMC-t8qdnuFiQUJKEkBnRhPJZCYvTMSA5B-Kh78vQ7TG29Jl7ZxiXwgSbaldWnrRqAfyhUbTuEo_LxsMJaHxjKZbWmGhJoWjGruGdU3XgvDBFYro09grFKc73RLNc68Ov2x30RoyreY4hecl8FBZt8VBnyjv6OoHDu5LpoPMsZ8PaBZpKQc" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        </section>

        {/* Summary Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-md">
          {(isOrangTua ? [
            { icon: 'child_care', label: 'Anak Saya', value: stats.balita, desc: 'Terdaftar di Posyandu', color: 'primary' },
            { icon: 'monitor_weight', label: 'Kunjungan', value: stats.kunjungan, desc: 'Total Riwayat Timbangan', color: 'secondary' },
            { icon: 'favorite', label: 'Pantau', value: stats.balita > 0 ? 'Aktif' : '-', desc: 'Status Pemantauan', color: 'tertiary', isText: true },
          ] : [
            { icon: 'child_care', label: 'Balita', value: stats.balita, desc: 'Jumlah Balita Terdaftar', color: 'primary' },
            { icon: 'pregnant_woman', label: 'Ibu Hamil', value: stats.ibuHamil, desc: 'Pemantauan Rutin', color: 'secondary' },
            { icon: 'child_friendly', label: 'Ibu Menyusui', value: stats.ibuMenyusui, desc: 'Dukungan Laktasi', color: 'tertiary' },
          ]).map(card => (
            <div key={card.label} className={`bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_12px_rgba(0,106,64,0.06)] border border-outline-variant flex flex-col gap-2 hover:shadow-md hover:border-${card.color}/20 transition-all duration-200 group`}>
              <div className="flex justify-between items-center">
                <span className={`material-symbols-outlined text-${card.color} text-[32px] bg-${card.color}/10 p-2 rounded-full group-hover:bg-${card.color}/20 transition-colors`}>{card.icon}</span>
                <span className="text-label-lg text-on-surface-variant">{card.label}</span>
              </div>
              <div className="mt-4">
                <h4 className={`text-headline-lg font-bold text-${card.color}`}>{card.value}</h4>
                <p className="text-body-md text-on-surface-variant">{card.desc}</p>
              </div>
            </div>
          ))}
            {!isOrangTua && (
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg flex flex-col gap-2 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-[32px] bg-white/10 p-2 rounded-full">calendar_today</span>
                  <span className="text-label-lg opacity-80">Total</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-headline-lg font-bold text-white">{stats.kunjungan}</h4>
                  <p className="text-body-md opacity-90 text-white/95">Total Kunjungan</p>
                </div>
              </div>
            )}
            {isOrangTua && (
              <div className="bg-primary text-on-primary p-6 rounded-xl shadow-lg flex flex-col gap-2 hover:shadow-xl transition-all duration-300">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-[32px] bg-white/10 p-2 rounded-full">history</span>
                  <span className="text-label-lg opacity-80">Riwayat</span>
                </div>
                <div className="mt-4">
                  <h4 className="text-headline-lg font-bold text-white">{stats.kunjungan}</h4>
                  <p className="text-body-md opacity-90 text-white/95">Total Kunjungan Anak</p>
                </div>
              </div>
            )}
        </section>

        {/* Viz & Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter-md items-start">
          {/* Chart */}
          <div className="lg:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0_4px_12px_rgba(0,106,64,0.06)] border border-outline-variant">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h5 className="text-headline-md font-bold text-on-surface">Trend Kunjungan Bulanan</h5>
                <p className="text-body-md text-on-surface-variant">Data real-time tahun {new Date().getFullYear()}</p>
              </div>
              <button
                onClick={() => showToast('Laporan PDF sedang diproses...', 'info')}
                className="flex items-center gap-2 text-primary font-bold hover:underline active:scale-95 transition-all">
                <span className="material-symbols-outlined">download</span>
                <span>Export PDF</span>
              </button>
            </div>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorKunjungan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#006d40" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#006d40" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e0ea" />
                    <XAxis dataKey="label" tick={{ fontSize: 13, fill: '#49454f', fontWeight: 600 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#49454f' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #79747e', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: '10px 16px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#1d192b', marginBottom: '4px' }}
                      formatter={(value) => [`${value} kunjungan`, 'Total']}
                    />
                    <Area type="monotone" dataKey="count" name="Kunjungan" stroke="#006d40" strokeWidth={3} fill="url(#colorKunjungan)" dot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: '#006d40' }} activeDot={{ r: 7, fill: '#006d40' }} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-on-surface-variant">Memuat grafik...</div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-stack-gap">
            <div className="bg-surface-container-lowest p-6 rounded-xl shadow-[0_4px_12px_rgba(0,106,64,0.06)] border border-outline-variant">
              <h5 className="text-headline-md font-bold text-on-surface mb-6">Aksi Cepat</h5>
              <div className="flex flex-col gap-3">
                {!isOrangTua ? (
                  <>
                    <Link to="/dashboard/data-balita" className="w-full h-11 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 hover:bg-primary/95 transition-all shadow-sm group">
                      <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">add_circle</span>
                      Tambah Balita
                    </Link>
                    <Link to="/dashboard/penimbangan" className="w-full h-11 border-2 border-primary text-primary rounded-xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 hover:bg-surface-container-low transition-all group">
                      <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">scale</span>
                      Input Timbangan
                    </Link>
                  </>
                ) : (
                  <Link to="/dashboard/riwayat" className="w-full h-11 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 hover:bg-primary/95 transition-all shadow-sm group">
                    <span className="material-symbols-outlined text-[20px] group-hover:rotate-12 transition-transform">history</span>
                    Lihat Riwayat Anak
                  </Link>
                )}
                <button
                  onClick={() => setModal('jadwal')}
                  className="w-full h-11 border-2 border-outline text-on-surface-variant rounded-xl font-bold flex items-center justify-center gap-2 text-sm active:scale-95 hover:bg-surface-container-low transition-all group">
                  <span className="material-symbols-outlined text-[20px] group-hover:translate-x-0.5 transition-transform">event</span>
                  Jadwal Layanan
                </button>
              </div>
            </div>
            {/* Notification Card */}
            <button
              onClick={() => setModal('notif')}
              className="bg-surface-container p-6 rounded-xl border border-primary/20 flex gap-4 items-start hover:shadow-md hover:border-primary/40 transition-all duration-200 cursor-pointer w-full text-left">
              <div className="p-2 bg-primary/10 rounded-full text-primary animate-bounce">
                <span className="material-symbols-outlined">campaign</span>
              </div>
              <div>
                <p className="text-label-lg font-bold text-primary">Info Terbaru</p>
                <p className="text-body-md text-on-surface-variant mt-1">{latestNotif ? latestNotif.judul : 'Klik untuk lihat pengumuman'}</p>
                <p className="text-sm text-primary font-bold mt-2 flex items-center gap-1">
                  Lihat semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* ── MOBILE CONTENT ──────────────────────────────────── */}
      <div className="lg:hidden px-4 min-[360px]:px-6 py-6 max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Hero Mobile */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#005230] p-6 text-on-primary-container shadow-md hover:shadow-lg transition-all duration-300 group">
            <div className="relative z-10">
              <p className="text-label-lg opacity-90">Selamat Pagi, {isOrangTua ? (profile?.nama_lengkap || 'Orang Tua') : 'Ibu Kader'}</p>
              <h2 className="text-headline-lg font-bold mt-1 text-white">Ringkasan Layanan</h2>
              <p className="text-body-md mt-2 opacity-80 text-white/90">
                {isOrangTua ? 'Pantau perkembangan kesehatan buah hati Anda hari ini.' : 'Pantau perkembangan kesehatan warga desa hari ini.'}
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out">
              <span className="material-symbols-outlined text-[120px]">clinical_notes</span>
            </div>
          </div>
        </section>

        {/* Stats Grid Mobile */}
        <section className="grid grid-cols-2 gap-3 min-[360px]:gap-4 mb-2">
          {(isOrangTua ? [
            { icon: 'child_care', colorIcon: 'text-primary', bg: 'bg-primary-container/10', val: stats.balita, label: 'Anak Saya', colorVal: 'text-primary' },
            { icon: 'event_available', colorIcon: 'text-on-surface', bg: 'bg-surface-container-high', val: stats.kunjungan, label: 'Total Kunjungan', colorVal: 'text-on-surface' },
            { icon: 'monitor_heart', colorIcon: 'text-secondary', bg: 'bg-secondary-container/10', val: stats.balita > 0 ? 'Aktif' : '-', label: 'Status Pantau', colorVal: 'text-secondary' },
            { icon: 'history', colorIcon: 'text-tertiary', bg: 'bg-tertiary-container/10', val: stats.kunjungan, label: 'Riwayat Timbang', colorVal: 'text-tertiary' },
          ] : [
            { icon: 'child_care', colorIcon: 'text-primary-container', bg: 'bg-primary-container/10', val: stats.balita, label: 'Jumlah Balita', colorVal: 'text-primary' },
            { icon: 'pregnant_woman', colorIcon: 'text-tertiary', bg: 'bg-tertiary-container/10', val: stats.ibuHamil, label: 'Ibu Hamil', colorVal: 'text-tertiary' },
            { icon: 'breastfeeding', colorIcon: 'text-secondary', bg: 'bg-secondary-container/10', val: stats.ibuMenyusui, label: 'Ibu Menyusui', colorVal: 'text-secondary' },
            { icon: 'event_available', colorIcon: 'text-on-surface', bg: 'bg-surface-container-high', val: stats.kunjungan, label: 'Total Kunjungan', colorVal: 'text-on-surface' },
          ]).map(s => (
            <div key={s.label} className="bg-surface-container-lowest p-3.5 min-[360px]:p-5 rounded-2xl border border-outline-variant/60 shadow-sm flex flex-col gap-2 min-[360px]:gap-3 hover:shadow-md transition-all duration-200">
              <div className={`w-10 h-10 min-[360px]:w-12 min-[360px]:h-12 rounded-full ${s.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${s.colorIcon} text-[24px] min-[360px]:text-[28px]`}>{s.icon}</span>
              </div>
              <div>
                <p className={`text-[22px] min-[360px]:text-headline-md font-bold ${s.colorVal} leading-none`}>{s.val}</p>
                <p className="text-[12px] min-[360px]:text-[14px] font-semibold text-on-surface-variant mt-1.5">{s.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions Mobile */}
        <section className="mb-2">
          <h3 className="text-label-lg font-bold text-on-surface-variant mb-3 px-1">Aksi Cepat</h3>
          <div className="flex flex-col gap-3">
            {!isOrangTua ? (
              <>
                <Link to="/dashboard/penimbangan" className="flex items-center justify-between bg-primary text-on-primary font-bold h-[56px] px-5 rounded-xl shadow-md active:scale-[0.98] hover:bg-primary/95 transition-all w-full text-left group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px]">scale</span>
                    <span className="text-[16px]">Input Penimbangan Baru</span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] opacity-70 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
                <Link to="/dashboard/data-balita" className="flex items-center justify-between bg-surface-container-lowest text-primary border-2 border-primary font-bold h-[56px] px-5 rounded-xl active:scale-[0.98] hover:bg-surface-container-low transition-all w-full text-left group">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[24px]">person_add</span>
                    <span className="text-[16px]">Tambah Data Anak</span>
                  </div>
                  <span className="material-symbols-outlined text-[20px] opacity-70 group-hover:translate-x-1 transition-transform">chevron_right</span>
                </Link>
              </>
            ) : (
              <Link to="/dashboard/riwayat" className="flex items-center justify-between bg-primary text-on-primary font-bold h-[56px] px-5 rounded-xl shadow-md active:scale-[0.98] hover:bg-primary/95 transition-all w-full text-left group">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[24px]">history</span>
                  <span className="text-[16px]">Lihat Riwayat Tumbuh Kembang</span>
                </div>
                <span className="material-symbols-outlined text-[20px] opacity-70 group-hover:translate-x-1 transition-transform">chevron_right</span>
              </Link>
            )}
            <button
              onClick={() => setModal('jadwal')}
              className="flex items-center justify-between bg-surface-container-lowest text-on-surface-variant border-2 border-outline-variant font-bold h-[56px] px-5 rounded-xl active:scale-[0.98] hover:bg-surface-container-low transition-all w-full text-left group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[24px]">event</span>
                <span className="text-[16px]">Jadwal Layanan</span>
              </div>
              <span className="material-symbols-outlined text-[20px] opacity-70 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Recent Activity Feed Mobile */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="text-label-lg font-bold text-on-surface-variant">Kunjungan Terakhir</h3>
            <Link to="/dashboard/riwayat" className="text-primary text-[14px] min-[360px]:text-[16px] hover:underline flex items-center gap-1 font-bold">
              <span>Lihat Semua</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <div className="bg-surface-container-low rounded-2xl overflow-hidden border border-outline-variant/60 shadow-sm">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i, arr) => (
                <div key={item.nama + i} className={`p-3.5 min-[360px]:p-4 flex items-center gap-3 min-[360px]:gap-4 hover:bg-surface-container-high/40 active:bg-surface-container-high/65 transition-colors duration-150 cursor-pointer ${i < arr.length - 1 ? 'border-b border-outline-variant/60' : ''}`}>
                  <div className="w-10 h-10 min-[360px]:w-12 min-[360px]:h-12 rounded-full flex items-center justify-center font-bold text-sm min-[360px]:text-base shrink-0 bg-primary-fixed text-on-primary-fixed">{item.init}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm min-[360px]:text-base font-semibold text-on-surface truncate">{item.nama}</p>
                    <p className="text-[12px] min-[360px]:text-xs text-on-surface-variant mt-0.5 truncate">{item.detail}</p>
                  </div>
                  <span className="text-[11px] min-[360px]:text-xs text-on-surface-variant shrink-0 self-start mt-0.5">{item.time}</span>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-on-surface-variant text-sm">
                Belum ada aktivitas kunjungan terbaru.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ── MODALS ───────────────────────────────────────────── */}
      <Modal isOpen={modal === 'jadwal'} onClose={() => setModal(null)} title="Jadwal Layanan Posyandu" size="md">
        <JadwalContent canEdit={canEdit} />
      </Modal>

      <Modal isOpen={modal === 'notif'} onClose={() => setModal(null)} title="Pengumuman & Notifikasi" size="md">
        <NotifContent canEdit={canEdit} />
      </Modal>
    </div>
  );
};

export default Dashboard;
