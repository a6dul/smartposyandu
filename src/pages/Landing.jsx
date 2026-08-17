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
    { value: '100% Aman', label: 'Privasi Data Terjaga', icon: 'verified_user', color: 'text-success' },
  ];

  const features = [
    {
      icon: 'devices',
      color: 'from-blue-500/20 to-blue-500/5 text-blue-600 border-blue-200/50',
      hoverBorder: 'group-hover:border-blue-400',
      title: 'Akses Multi-Perangkat',
      desc: 'Dapat diakses secara responsif dari smartphone, tablet, maupun komputer untuk memudahkan input data kader di mana saja.'
    },
    {
      icon: 'monitoring',
      color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-600 border-emerald-200/50',
      hoverBorder: 'group-hover:border-emerald-400',
      title: 'Grafik KMS Digital Terpadu',
      desc: 'Pantau kurva tumbuh kembang berat badan (BB/U), tinggi badan (TB/U), dan status gizi anak sesuai standar WHO secara otomatis.'
    },
    {
      icon: 'description',
      color: 'from-purple-500/20 to-purple-500/5 text-purple-600 border-purple-200/50',
      hoverBorder: 'group-hover:border-purple-400',
      title: 'Ekspor Laporan SKDN',
      desc: 'Tidak perlu rekap manual berhari-hari. Dapatkan visualisasi kehadiran balita (S, K, D, N) siap cetak dalam hitungan detik.'
    },
    {
      icon: 'notifications_active',
      color: 'from-amber-500/20 to-amber-500/5 text-amber-600 border-amber-200/50',
      hoverBorder: 'group-hover:border-amber-400',
      title: 'Pengingat Otomatis',
      desc: 'Kirim jadwal posyandu, peringatan imunisasi, dan riwayat bulanan langsung ke WhatsApp orang tua secara terintegrasi.'
    },
    {
      icon: 'security',
      color: 'from-indigo-500/20 to-indigo-500/5 text-indigo-600 border-indigo-200/50',
      hoverBorder: 'group-hover:border-indigo-400',
      title: 'Penyimpanan Data Aman',
      desc: 'Semua rekam medis dan data balita di-enkripsi dengan aman. Dilengkapi audit log untuk melacak siapa yang melakukan input.'
    },
    {
      icon: 'group',
      color: 'from-rose-500/20 to-rose-500/5 text-rose-600 border-rose-200/50',
      hoverBorder: 'group-hover:border-rose-400',
      title: 'Multi-Role User Access',
      desc: 'Akses terbagi berdasarkan peran spesifik: Administrator (kelola sistem), Kader (input data), dan Orang Tua (pantau KMS).'
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
      q: "Siapa saja yang bisa menggunakan SmartPosyandu?",
      a: "Aplikasi ini dirancang khusus untuk membantu Kader Posyandu dalam melakukan pencatatan KMS (Kartu Menuju Sehat), pemantauan tumbuh kembang balita, ibu hamil, hingga rekapitulasi laporan SKDN bulanan."
    },
    {
      q: "Bagaimana cara mendapatkan akun login untuk kader?",
      a: "Pembuatan akun login dilakukan secara terpusat oleh koordinator Posyandu tingkat kelurahan atau Puskesmas setempat. Silakan hubungi admin atau koordinator Anda untuk didaftarkan ke dalam sistem."
    },
    {
      q: "Apakah aplikasi ini bisa diakses dari HP atau Smartphone?",
      a: "Ya! SmartPosyandu dibuat dengan teknologi web modern yang responsif (PWA), sehingga tampilannya akan menyesuaikan dengan sempurna baik diakses lewat HP, tablet, maupun komputer/laptop."
    },
    {
      q: "Apakah keamanan data privasi warga terjamin?",
      a: "Sangat terjamin. Seluruh data identitas, tumbuh kembang balita, dan riwayat ibu disimpan secara aman di server yang dienkripsi. Akses data pun dibatasi hanya untuk kader terdaftar pada Posyandu yang bersangkutan."
    },
    {
      q: "Bagaimana cara mencetak grafik KMS Balita ke kertas?",
      a: "Pada halaman Detail Balita di dashboard kader, Anda cukup menekan tombol 'Cetak KMS'. Sistem akan otomatis menyusun dokumen PDF grafik tumbuh kembang yang siap untuk langsung di-print."
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
              Terpadu & Inovatif
              <span className="absolute bottom-1 left-0 w-full h-[6px] bg-primary/20 rounded-full -z-10" />
            </span>
          </h1>

          <p className="text-body-lg md:text-xl text-on-surface-variant leading-relaxed max-w-3xl mx-auto font-medium">
            Platform modern terlengkap untuk kader posyandu dan orang tua. Catat hasil penimbangan bulanan, pantau grafik KMS digital standar WHO, dan hasilkan laporan otomatis dengan cepat dan akurat di lapangan.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto sm:max-w-none">
            {user ? (
              <Link to="/dashboard" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-on-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95">
                Masuk Dashboard
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </Link>
            ) : (
              <Link to="/login" className="w-full sm:w-auto h-14 px-8 rounded-full bg-primary text-on-primary font-bold text-lg flex items-center justify-center gap-2 hover:bg-primary/95 transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:scale-95">
                Akses Portal Posyandu
                <span className="material-symbols-outlined text-[20px]">login</span>
              </Link>
            )}

            <button className="w-full sm:w-auto h-14 px-8 rounded-full bg-surface-container-low text-on-surface border border-outline-variant font-bold text-lg flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all active:scale-95 group">
              <span className="material-symbols-outlined group-hover:translate-y-0.5 transition-transform text-primary text-[20px]">cloud_download</span>
              Pasang Aplikasi (PWA)
            </button>
          </div>
        </div>

        {/* Supported By Section (Logos) */}
        <div className="relative z-10 w-full max-w-5xl mx-auto mt-20 pt-10 border-t border-outline-variant/30 text-center">
          <p className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-8">Didanai & Didukung Oleh</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-90 hover:opacity-100 transition-opacity">
            <img src="/assets/logos/logo-diktisaintek.jpg" alt="Diktisaintek" className="h-14 w-auto object-contain rounded-md" />
            <img src="/assets/logos/logo-bima.jpg" alt="BIMA" className="h-12 w-auto object-contain rounded-md" />
            <img src="/assets/logos/logo-dppm.jpg" alt="DPPM" className="h-12 w-auto object-contain rounded-md" />
            <img src="/assets/logos/logo-stb.png" alt="STB" className="h-14 w-auto object-contain" />
            <img src="/assets/logos/logo-lppm-stb.png" alt="LPPM STB" className="h-14 w-auto object-contain" />
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

      {/* Features Grid */}
      <section className="py-24 px-4 bg-surface relative overflow-hidden">
        {/* Dekorasi Background Bulatan Blur */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 max-w-2xl mx-auto space-y-6">
            <span className="inline-block text-primary font-black text-sm tracking-widest uppercase bg-primary/10 border border-primary/20 px-5 py-2.5 rounded-full shadow-sm">
              Solusi Modern
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight tracking-tight">Semua yang Anda Butuhkan dalam Satu Aplikasi</h2>
            <p className="text-lg text-on-surface-variant leading-relaxed">
              Dirancang secara terintegrasi untuk mempercepat alur kerja pelayanan Posyandu serta mempermudah akses informasi bagi para orang tua.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((f, idx) => (
              <div key={idx} className={`bg-surface-container-lowest rounded-[2rem] border border-outline-variant/50 p-8 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300 group flex flex-col justify-between ${f.hoverBorder}`}>
                <div className="relative">
                  {/* Efek Lingkaran Blur di Belakang Ikon saat Hover */}
                  <div className={`absolute -top-4 -left-4 w-20 h-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl bg-gradient-to-br ${f.color.split(' ')[0]}`}></div>
                  
                  <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center mb-8 border bg-gradient-to-br ${f.color} group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-md`}>
                    <span className="material-symbols-outlined text-[32px]">{f.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">{f.title}</h3>
                  <p className="text-sm md:text-base text-on-surface-variant leading-relaxed font-medium">{f.desc}</p>
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
              <div className="h-56 w-full relative rounded-2xl border border-outline-variant/60 overflow-hidden bg-white/50">
                {/* SVG KMS Chart Zones */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Zona Merah Bawah (Buruk) */}
                  <path d="M0,100 L100,100 L100,60 Q50,75 0,85 Z" fill="#ffebee" />
                  {/* Zona Kuning Bawah (Kurang) */}
                  <path d="M0,85 Q50,75 100,60 L100,45 Q50,60 0,75 Z" fill="#fff8e1" />
                  {/* Zona Hijau (Normal) */}
                  <path d="M0,75 Q50,60 100,45 L100,25 Q50,40 0,50 Z" fill="#e8f5e9" />
                  {/* Zona Kuning Atas (Lebih) */}
                  <path d="M0,50 Q50,40 100,25 L100,15 Q50,30 0,40 Z" fill="#fff8e1" />
                  {/* Zona Merah Atas (Obesitas) */}
                  <path d="M0,40 Q50,30 100,15 L100,0 L0,0 Z" fill="#ffebee" />

                  {/* Garis Grid Vertical (Bulan) */}
                  <line x1="25" y1="0" x2="25" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.6"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.6"/>
                  <line x1="75" y1="0" x2="75" y2="100" stroke="#ffffff" strokeWidth="1" opacity="0.6"/>

                  {/* Garis Kurva Pertumbuhan Anak */}
                  <path d="M0,65 Q25,55 50,42 T100,30" fill="none" stroke="#006a40" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                </svg>
                
                {/* Data Points (Absolute positioning to keep perfect circles) */}
                <div className="absolute w-3 h-3 bg-white border-[3px] border-primary rounded-full shadow-sm" style={{ left: '-6px', top: 'calc(65% - 6px)' }}></div>
                <div className="absolute w-3 h-3 bg-white border-[3px] border-primary rounded-full shadow-sm" style={{ left: 'calc(25% - 6px)', top: 'calc(52% - 6px)' }}></div>
                <div className="absolute w-3 h-3 bg-white border-[3px] border-primary rounded-full shadow-sm" style={{ left: 'calc(50% - 6px)', top: 'calc(42% - 6px)' }}></div>
                <div className="absolute w-3 h-3 bg-white border-[3px] border-primary rounded-full shadow-sm" style={{ left: 'calc(75% - 6px)', top: 'calc(35% - 6px)' }}></div>
                <div className="absolute w-4 h-4 bg-primary rounded-full shadow-md z-10" style={{ right: '-8px', top: 'calc(30% - 8px)' }}>
                  <div className="absolute inset-0 w-full h-full bg-primary rounded-full animate-ping opacity-75"></div>
                </div>

                {/* Legend Bulan di Bawah */}
                <div className="absolute bottom-2 left-0 w-full px-2 flex justify-between text-[10px] font-black text-on-surface-variant drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                  <span className="translate-x-1">0 Bln</span>
                  <span>12 Bln</span>
                  <span>24 Bln</span>
                  <span>36 Bln</span>
                  <span className="-translate-x-2">48 Bln</span>
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
      <section className="py-24 px-4 bg-primary relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,60 70,60 100,100 L100,0 L0,0 Z" fill="#ffffff" />
          </svg>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-sm">Siap Beralih ke Sistem Digital?</h2>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto font-medium">
            Tinggalkan buku tebal yang mudah robek dan hilang. Daftarkan posyandu Anda hari ini untuk pencatatan kesehatan balita yang rapi, cepat, dan modern.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="inline-flex h-14 px-8 rounded-full bg-white text-primary font-bold text-lg items-center justify-center hover:bg-surface transition-colors shadow-lg active:scale-95 hover:shadow-xl hover:-translate-y-0.5">
              Akses SmartPosyandu
            </Link>
            <a href="https://satyaterrabhinneka.ac.id" target="_blank" rel="noreferrer" className="inline-flex h-14 px-8 rounded-full border-2 border-white/50 text-white font-bold text-lg items-center justify-center hover:bg-white/10 transition-colors shadow-lg active:scale-95">
              <span className="material-symbols-outlined mr-2">school</span>
              Info Universitas STB
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
