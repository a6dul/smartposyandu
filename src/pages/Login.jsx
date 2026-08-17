import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setError(err.message || 'Email atau password salah. Periksa kembali data Anda.');
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setEmail('admin@smartposyandu.id');
      setPassword('password');
    } else {
      setEmail('kader@smartposyandu.id');
      setPassword('password');
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* === SISI KIRI: BRANDING PANEL === */}
      <div className="hidden lg:flex lg:w-[55%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        {/* Dekorasi Lingkaran Abstrak */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-white/8 rounded-full translate-x-1/2 pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-10 group">
          <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined text-white text-[24px]">health_and_safety</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">SmartPosyandu</span>
        </Link>

        {/* Konten Tengah */}
        <div className="z-10 space-y-8">
          {/* Ilustrasi SVG Minimalis */}
          <div className="relative w-full max-w-sm mx-auto">
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-2xl">
              {/* Kartu Data Balita */}
              <rect x="40" y="40" width="200" height="130" rx="20" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
              <circle cx="75" cy="80" r="20" fill="white" fillOpacity="0.2"/>
              <rect x="105" y="66" width="100" height="10" rx="5" fill="white" fillOpacity="0.4"/>
              <rect x="105" y="84" width="70" height="8" rx="4" fill="white" fillOpacity="0.25"/>
              <rect x="55" y="115" width="165" height="8" rx="4" fill="white" fillOpacity="0.2"/>
              <rect x="55" y="131" width="120" height="8" rx="4" fill="white" fillOpacity="0.15"/>

              {/* Kartu Status Gizi */}
              <rect x="170" y="120" width="180" height="120" rx="20" fill="white" fillOpacity="0.18" stroke="white" strokeOpacity="0.3" strokeWidth="1.5"/>
              <rect x="190" y="145" width="140" height="8" rx="4" fill="white" fillOpacity="0.4"/>
              {/* Progress Bar Gizi */}
              <rect x="190" y="168" width="140" height="12" rx="6" fill="white" fillOpacity="0.15"/>
              <rect x="190" y="168" width="100" height="12" rx="6" fill="white" fillOpacity="0.5"/>
              <rect x="190" y="193" width="140" height="12" rx="6" fill="white" fillOpacity="0.15"/>
              <rect x="190" y="193" width="120" height="12" rx="6" fill="white" fillOpacity="0.35"/>
              <rect x="190" y="218" width="80" height="8" rx="4" fill="white" fillOpacity="0.25"/>

              {/* Badge Status */}
              <rect x="260" y="50" width="100" height="36" rx="18" fill="white" fillOpacity="0.2" stroke="white" strokeOpacity="0.4" strokeWidth="1.5"/>
              <circle cx="283" cy="68" r="7" fill="#4ade80" fillOpacity="0.9"/>
              <rect x="296" y="63" width="50" height="8" rx="4" fill="white" fillOpacity="0.5"/>

              {/* Garis dekoratif */}
              <path d="M30 270 Q80 230 130 250 Q180 270 230 240 Q280 210 360 230" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.4" strokeDasharray="6 4"/>
            </svg>
          </div>

          <div className="space-y-4 max-w-sm">
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Pantau Tumbuh Kembang Balita dengan Lebih Cerdas
            </h1>
            <p className="text-white/75 text-base leading-relaxed font-medium">
              Platform pencatatan posyandu digital yang terintegrasi — dari KMS, SKDN, hingga laporan otomatis untuk Puskesmas.
            </p>
          </div>

          {/* Testimonial / Stat Card */}
          <div className="flex items-start gap-4 bg-white/10 border border-white/20 backdrop-blur-sm rounded-2xl p-5 max-w-sm">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white text-[20px]">format_quote</span>
            </div>
            <div>
              <p className="text-white/90 text-sm leading-relaxed font-medium italic">
                "Input data posyandu sekarang jadi 5x lebih cepat. Laporannya langsung jadi dan akurat."
              </p>
              <p className="text-white/60 text-xs mt-2 font-bold">— Kader Posyandu Melati, Kelurahan Sei Sikambing</p>
            </div>
          </div>
        </div>

        {/* Footer Branding */}
        <div className="z-10 flex items-center gap-6 flex-wrap">
          {[
            { icon: 'child_care', label: '350+ Balita' },
            { icon: 'health_and_safety', label: '98% Imunisasi' },
            { icon: 'description', label: 'SKDN Otomatis' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-white/70">
              <span className="material-symbols-outlined text-[16px]">{s.icon}</span>
              <span className="text-xs font-bold">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* === SISI KANAN: FORM LOGIN === */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 bg-background relative">

        {/* Tombol Kembali */}
        <Link
          to="/"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-on-surface-variant font-bold text-sm hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-full transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="hidden sm:inline">Beranda</span>
        </Link>

        <div className="w-full max-w-md space-y-8">
          {/* Header Form */}
          <div className="text-center space-y-2">
            {/* Logo kecil (mobile only) */}
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25 lg:hidden">
              <span className="material-symbols-outlined text-on-primary text-[30px]">health_and_safety</span>
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Selamat Datang</h2>
            <p className="text-on-surface-variant text-sm font-medium">
              Masuk ke akun SmartPosyandu Anda untuk melanjutkan.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-2xl text-sm font-medium flex items-start gap-3 border border-error/20 animate-[fadeIn_0.2s_ease]">
              <span className="material-symbols-outlined shrink-0 text-[20px] text-error">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface">Alamat Email</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                <input
                  type="email"
                  required
                  className="w-full h-13 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                  placeholder="kader@posyandu.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-bold text-on-surface">Password</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full h-13 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                  placeholder="Password Anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-primary text-on-primary font-bold text-sm rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">login</span>
                  Masuk ke Sistem
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Access */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant/60" />
              <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest whitespace-nowrap">⚡ Akses Demo</span>
              <div className="flex-1 h-px bg-outline-variant/60" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => fillDemo('admin')}
                className="h-11 px-4 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-xs text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container hover:border-secondary/40 hover:text-secondary transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-secondary">admin_panel_settings</span>
                Administrator
              </button>
              <button
                type="button"
                onClick={() => fillDemo('kader')}
                className="h-11 px-4 bg-surface-container-low border border-outline-variant rounded-xl font-semibold text-xs text-on-surface flex items-center justify-center gap-2 hover:bg-surface-container hover:border-primary/40 hover:text-primary transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">medical_services</span>
                Kader Posyandu
              </button>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-on-surface-variant">
            Belum memiliki akun?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline underline-offset-2">
              Daftar Sekarang
            </Link>
          </p>
        </div>

        {/* Bottom Copyright */}
        <p className="absolute bottom-6 text-xs text-on-surface-variant/60 font-medium">
          © {new Date().getFullYear()} SmartPosyandu — Universitas Satya Terra Bhinneka
        </p>
      </div>
    </div>
  );
};

export default Login;
