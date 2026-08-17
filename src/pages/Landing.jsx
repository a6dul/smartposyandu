import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState(null);

  const stats = [
    { value: '350+', label: 'Balita Terdata', icon: 'child_care', color: 'text-primary' },
    { value: '98%', label: 'Imunisasi Tepat Waktu', icon: 'health_and_safety', color: 'text-secondary' },
    { value: '1 Klik', label: 'Laporan SKDN Selesai', icon: 'description', color: 'text-tertiary' },
    { value: '100% Offline', label: 'Akses Tanpa Sinyal', icon: 'signal_wifi_off', color: 'text-success' },
  ];

  const features = [
    {
      icon: 'signal_wifi_off',
      color: 'bg-primary/10 text-primary border-primary/20',
      title: 'Dukungan Offline PWA',
      desc: 'Kader di lapangan tetap bisa mencatat data balita secara instan meski sinyal internet terputus. Data otomatis sinkron saat terhubung kembali.'
    },
    {
      icon: 'monitoring',
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      title: 'Grafik KMS Digital Terpadu',
      desc: 'Pantau kurva tumbuh kembang berat badan (BB/U), tinggi badan (TB/U), dan status gizi anak sesuai standar WHO secara otomatis.'
    },
    {
      icon: 'description',
      color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
      title: 'Ekspor Laporan SKDN Otomatis',
      desc: 'Tidak perlu rekap manual berhari-hari. Dapatkan visualisasi kehadiran balita (S, K, D, N) siap cetak dan kirim ke Puskesmas dalam hitungan detik.'
    },
    {
      icon: 'notifications_active',
      color: 'bg-primary/10 text-primary border-primary/20',
      title: 'Pengingat WhatsApp Otomatis',
      desc: 'Kirim jadwal posyandu, peringatan imunisasi, dan riwayat bulanan langsung ke nomor WhatsApp orang tua secara terintegrasi.'
    },
    {
      icon: 'security',
      color: 'bg-secondary/10 text-secondary border-secondary/20',
      title: 'Penyimpanan Data Aman',
      desc: 'Semua rekam medis dan data balita di-enkripsi dengan aman. Dilengkapi dengan audit log aktivitas untuk melacak siapa yang melakukan input.'
    },
    {
      icon: 'group',
      color: 'bg-tertiary/10 text-tertiary border-tertiary/20',
      title: 'Multi-Role User Access',
      desc: 'Akses terbagi berdasarkan peran: Administrator (kelola sistem), Kader (input data pengukuran), dan Orang Tua (pantau KMS & riwayat anak).'
    }
  ];

  const testimonials = [
    {
      text: "Aplikasi ini memotong waktu rekap bulanan kami dari 3 hari menjadi hanya 1 kali klik. Sangat membantu kader senior yang kurang paham IT.",
      name: "Bidan Siti Aminah",
      role: "Kader Posyandu Mekar Sari",
      avatar: "S"
    },
    {
      text: "Sebagai orang tua, saya sangat senang bisa melihat grafik tumbuh kembang anak langsung dari HP. Tidak khawatir lagi jika buku KIA fisik hilang.",
      name: "Ibu Rahmawati",
      role: "Orang Tua Balita (Aris)",
      avatar: "R"
    }
  ];

  const faqs = [
    {
      q: "Apakah aplikasi ini bisa digunakan tanpa internet?",
      a: "Ya! Aplikasi ini dirancang sebagai Progressive Web App (PWA) dengan basis data lokal. Kader dapat menginput data penimbangan secara penuh di lapangan meskipun tidak ada sinyal internet sama sekali."
    },
    {
      q: "Bagaimana cara mencetak grafik KMS Balita?",
      a: "Anda bisa masuk ke menu Riwayat Kesehatan Anak atau Laporan, pilih nama balita, lalu klik tombol Cetak / PDF. Grafik KMS yang sesuai standar WHO akan otomatis terformat rapi untuk dicetak."
    },
    {
      q: "Apakah data anak kami aman dari kebocoran?",
      a: "Tentu. SmartPosyandu mengimplementasikan Row Level Security (RLS) dan enkripsi lokal. Hanya pengguna dengan akun resmi terverifikasi yang dapat mengakses data anak di posyandu tersebut."
    }
  ];

  return (
    <div className="flex flex-col w-full bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-surface to-background flex flex-col items-center text-center px-4 pt-16 pb-24 lg:pt-28 lg:pb-36 overflow-hidden border-b border-outline-variant/30">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-8 px-2">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface-container-highest/80 backdrop-blur border border-outline-variant/60 text-primary font-bold text-sm mx-auto shadow-sm">
            <span className="material-symbols-outlined text-[18px]">verified_user</span>
            Sistem Informasi Kesehatan Anak Terintegrasi
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-on-background leading-tight tracking-tight max-w-4xl mx-auto">
            Era Baru Posyandu Digital <br className="hidden md:inline" />
            Dengan Layanan <span className="text-primary relative inline-block">
              Bebas Sinyal
              <span className="absolute bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
            </span>
          </h1>

          <p className="text-body-lg lg:text-xl text-on-surface-variant max-w-3xl mx-auto leading-relaxed">
            Platform modern terlengkap untuk kader posyandu dan orang tua. Catat hasil penimbangan bulanan, pantau grafik KMS digital standar WHO, dan hasilkan laporan otomatis, bahkan tanpa koneksi internet di lapangan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-on-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-98">
                Buka Dashboard
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            ) : (
              <Link to="/login" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-on-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-98">
                Masuk Demo 1-Klik
                <span className="material-symbols-outlined text-[20px]">login</span>
              </Link>
            )}

            <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-surface-container-low text-on-surface border border-outline-variant font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-98 group">
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform text-primary text-[20px]">cloud_download</span>
              Pasang Aplikasi (PWA)
            </button>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="relative -mt-12 z-20 px-4 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 lg:p-8 bg-surface-container-lowest/90 backdrop-blur rounded-[32px] border border-outline-variant/60 shadow-xl">
          {stats.map((s, idx) => (
            <div key={idx} className="flex flex-col items-center text-center p-4 rounded-2xl hover:bg-surface-container-low/40 transition-colors">
              <div className={`w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-3 ${s.color}`}>
                <span className="material-symbols-outlined text-[24px]">{s.icon}</span>
              </div>
              <p className="text-2xl md:text-3xl font-black text-on-surface">{s.value}</p>
              <p className="text-xs md:text-sm font-semibold text-on-surface-variant mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-24 px-4 bg-surface-container-lowest relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-primary font-bold text-sm tracking-wider uppercase bg-primary/10 px-3 py-1.5 rounded-full">Solusi Modern</span>
            <h2 className="text-3xl md:text-5xl font-black text-on-background tracking-tight">Semua yang Anda Butuhkan dalam Satu Aplikasi</h2>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">Dirancang terintegrasi untuk mempercepat alur kerja pelayanan Posyandu serta mempermudah akses informasi bagi para orang tua.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, idx) => (
              <div key={idx} className="bg-surface rounded-3xl border border-outline-variant/60 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group flex flex-col justify-between">
                <div>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${f.color} group-hover:scale-105 transition-transform`}>
                    <span className="material-symbols-outlined text-[28px]">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Showcase */}
      <section className="py-20 px-4 bg-surface-container-low/40 border-y border-outline-variant/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-secondary font-bold text-sm tracking-wider uppercase bg-secondary/10 px-3 py-1.5 rounded-full">KMS Digital</span>
            <h3 className="text-3xl md:text-4xl font-black text-on-surface leading-tight">Grafik Tumbuh Kembang yang Presisi & Otomatis</h3>
            <p className="text-body-lg text-on-surface-variant leading-relaxed">
              Selamat tinggal pembuatan garis titik manual yang merepotkan dan rawan salah. Cukup ketik berat badan dan tinggi badan balita, biarkan algoritma kami menggambarkan kurva posisinya di KMS digital.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Deteksi dini gizi kurang atau gizi buruk secara otomatis',
                'Visualisasi riwayat tumbuh kembang anak dari lahir hingga 5 tahun',
                'Mudah dibaca oleh petugas kesehatan maupun orang tua',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                  <span className="font-bold text-on-surface text-sm md:text-base">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-3xl overflow-hidden border border-outline-variant/60 shadow-2xl bg-surface-container-lowest p-6">
            {/* Visualisasi Preview Sederhana */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-outline-variant/40">
                <span className="font-bold text-on-surface text-sm">Grafik Tumbuh Kembang - Muhammad Aris</span>
                <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold">Status: Baik</span>
              </div>
              <div className="h-48 w-full bg-gradient-to-t from-primary/5 to-transparent rounded-2xl border border-dashed border-primary/20 relative flex items-end p-4">
                {/* Garis Kurva */}
                <svg className="absolute inset-0 w-full h-full p-2" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,90 Q25,80 50,60 T100,30" fill="none" stroke="#006a40" strokeWidth="4" />
                  <circle cx="50" cy="60" r="4" fill="#006a40" />
                  <circle cx="75" cy="45" r="4" fill="#006a40" />
                </svg>
                <div className="flex justify-between w-full text-[10px] font-bold text-on-surface-variant">
                  <span>0 Bln</span>
                  <span>12 Bln</span>
                  <span>24 Bln</span>
                  <span>36 Bln</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-surface-container-low p-3 rounded-xl text-center">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Berat</span>
                  <span className="font-black text-on-surface">12.5 kg</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl text-center">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Tinggi</span>
                  <span className="font-black text-on-surface">88 cm</span>
                </div>
                <div className="bg-surface-container-low p-3 rounded-xl text-center">
                  <span className="text-[10px] text-on-surface-variant block uppercase font-bold">Usia</span>
                  <span className="font-black text-on-surface">27 Bln</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-surface-container-lowest">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-tertiary font-bold text-sm tracking-wider uppercase bg-tertiary/10 px-3 py-1.5 rounded-full">Testimoni</span>
            <h3 className="text-3xl md:text-4xl font-black text-on-surface">Telah Membantu Kader & Orang Tua</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-surface p-8 rounded-3xl border border-outline-variant/60 shadow-sm relative flex flex-col justify-between">
                <span className="material-symbols-outlined text-[48px] text-primary/10 absolute right-6 top-6 select-none">format_quote</span>
                <p className="text-on-surface-variant text-base md:text-lg italic leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-lg">{t.avatar}</div>
                  <div>
                    <h5 className="font-black text-on-surface text-sm md:text-base">{t.name}</h5>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-surface-container-low/20 border-t border-outline-variant/30">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-black text-on-surface">Pertanyaan Umum</h3>
            <p className="text-on-surface-variant text-sm md:text-base">Beberapa jawaban untuk pertanyaan yang paling sering ditanyakan.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 font-bold text-on-surface flex justify-between items-center hover:bg-surface-container-low/40 transition-colors"
                >
                  <span className="text-sm md:text-base">{faq.q}</span>
                  <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200" style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none' }}>expand_more</span>
                </button>
                {activeFaq === idx && (
                  <div className="p-5 pt-0 text-sm md:text-base text-on-surface-variant border-t border-outline-variant/40 leading-relaxed animate-[fadeIn_0.15s_ease]">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-on-primary py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-white/10 to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">Siap Beralih ke Sistem Digital?</h2>
          <p className="text-body-lg text-primary-container leading-relaxed max-w-2xl mx-auto">
            Tinggalkan buku tebal yang mudah robek dan hilang. Daftarkan posyandu Anda hari ini untuk pencatatan kesehatan balita yang rapi, cepat, dan modern.
          </p>
          <div className="pt-4">
            <Link to="/login" className="inline-flex h-14 px-8 rounded-full bg-white text-primary font-bold text-lg items-center justify-center hover:bg-surface transition-colors shadow-lg active:scale-95 hover:shadow-xl hover:-translate-y-0.5">
              Mulai Uji Coba Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
