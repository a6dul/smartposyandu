import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nama_lengkap: '',
    email: '',
    telepon: '',
    password: '',
    confirm_password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      await register(form.nama_lengkap, form.email, form.telepon, form.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat pendaftaran.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* === SISI KIRI: BRANDING PANEL === */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 z-10 group">
          <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-2xl flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors">
            <span className="material-symbols-outlined text-white text-[24px]">health_and_safety</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight">SmartPosyandu</span>
        </Link>

        {/* Konten Tengah */}
        <div className="z-10 space-y-8">
          {/* Ilustrasi Sederhana */}
          <div className="relative w-full max-w-xs">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-6 space-y-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-[20px]">person_add</span>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Akun Baru Dibuat</p>
                  <p className="text-white/60 text-xs">Kader Posyandu berhasil terdaftar</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Nama Lengkap ✓', 'Email Terverifikasi ✓', 'Role: Kader ✓'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/50" />
                    <span className="text-white/80 text-xs font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-white/60 rounded-full" />
              </div>
              <p className="text-white/60 text-[10px] text-right">Profil 75% Lengkap</p>
            </div>
          </div>

          <div className="space-y-4 max-w-sm">
            <h1 className="text-4xl font-black text-white leading-tight tracking-tight">
              Bergabung Bersama Kader Posyandu di Seluruh Indonesia
            </h1>
            <p className="text-white/75 text-base leading-relaxed font-medium">
              Daftarkan diri Anda sebagai orang tua balita dan pantau tumbuh kembang anak kapan saja.
            </p>
          </div>

          {/* Info Akses Role */}
          <div className="space-y-3 max-w-sm">
            {[
              { icon: 'admin_panel_settings', label: 'Administrator', desc: 'Kelola sistem & pengguna' },
              { icon: 'medical_services', label: 'Kader Posyandu', desc: 'Input & rekap data balita' },
              { icon: 'family_restroom', label: 'Orang Tua', desc: 'Pantau KMS & riwayat anak' },
            ].map((r) => (
              <div key={r.label} className="flex items-center gap-3 bg-white/8 border border-white/15 rounded-2xl px-4 py-3">
                <span className="material-symbols-outlined text-white/80 text-[20px]">{r.icon}</span>
                <div>
                  <p className="text-white font-bold text-sm">{r.label}</p>
                  <p className="text-white/55 text-xs">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="z-10 text-white/50 text-xs font-medium">
          © {new Date().getFullYear()} SmartPosyandu — Universitas Satya Terra Bhinneka
        </p>
      </div>

      {/* === SISI KANAN: FORM REGISTER === */}
      <div className="flex-1 flex flex-col items-center justify-start p-6 sm:p-10 bg-background overflow-y-auto pt-20 pb-12">

        {/* Tombol Kembali ke Login */}
        <Link
          to="/login"
          className="absolute top-6 left-6 flex items-center gap-1.5 text-on-surface-variant font-bold text-sm hover:text-primary hover:bg-primary/10 px-3 py-2 rounded-full transition-all z-10"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="hidden sm:inline">Kembali ke Login</span>
        </Link>

        <div className="w-full max-w-md space-y-6 mt-4">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/25 lg:hidden">
              <span className="material-symbols-outlined text-on-primary text-[28px]">person_add</span>
            </div>
            <h2 className="text-3xl font-black text-on-surface tracking-tight">Buat Akun Baru</h2>
            <p className="text-on-surface-variant text-sm font-medium">
              Daftarkan diri sebagai orang tua balita di SmartPosyandu.
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-error-container text-on-error-container p-4 rounded-2xl text-sm font-medium flex items-start gap-3 border border-error/20">
              <span className="material-symbols-outlined shrink-0 text-[20px] text-error">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="bg-primary-container text-on-primary-container p-8 rounded-3xl text-center border border-primary/20 space-y-3">
              <span className="material-symbols-outlined text-[52px] text-primary">check_circle</span>
              <h3 className="text-xl font-black">Pendaftaran Berhasil!</h3>
              <p className="text-sm leading-relaxed font-medium opacity-80">Akun Anda telah dibuat. Anda akan diarahkan ke halaman login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Nama Lengkap <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">badge</span>
                  <input
                    type="text"
                    name="nama_lengkap"
                    required
                    className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="Nama lengkap Anda"
                    value={form.nama_lengkap}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Alamat Email <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">mail</span>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="contoh@email.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Telepon */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">No. WhatsApp</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">smartphone</span>
                  <input
                    type="tel"
                    name="telepon"
                    className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="081234567890"
                    value={form.telepon}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Password <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">lock</span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-12 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="Minimal 6 karakter"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <label className="block text-sm font-bold text-on-surface">Konfirmasi Password <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[20px]">lock_reset</span>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    className="w-full h-12 bg-surface-container-lowest border border-outline-variant rounded-2xl pl-12 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="Ulangi password"
                    value={form.confirm_password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">person_add</span>
                    Buat Akun Sekarang
                  </>
                )}
              </button>
            </form>
          )}

          {/* Link Login */}
          <p className="text-center text-sm text-on-surface-variant">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-2">
              Masuk di Sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
