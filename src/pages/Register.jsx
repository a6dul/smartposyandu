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
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const msg = (err?.message && err.message !== 'undefined')
        ? err.message
        : 'Terjadi kesalahan saat pendaftaran. Coba lagi.';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-xl shadow-black/5 space-y-4">

          {/* Header: Logo + Judul + tombol navigasi */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-md shadow-primary/30 shrink-0">
                <span className="material-symbols-outlined text-on-primary text-[20px]">person_add</span>
              </div>
              <div>
                <h1 className="text-base font-black text-on-surface leading-tight">Buat Akun Baru</h1>
                <p className="text-on-surface-variant text-[11px] font-medium">Daftarkan diri sebagai orang tua balita</p>
              </div>
            </div>
            {/* Navigasi singkat di dalam card */}
            <div className="flex items-center gap-1">
              <Link to="/" title="Beranda" className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">home</span>
              </Link>
              <Link to="/login" title="Kembali ke Login" className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">login</span>
              </Link>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-error-container text-on-error-container px-3 py-2 rounded-xl text-xs font-medium flex items-start gap-2 border border-error/20">
              <span className="material-symbols-outlined shrink-0 text-[15px] text-error mt-0.5">error</span>
              <span>{error}</span>
            </div>
          )}

          {/* Success */}
          {success ? (
            <div className="bg-primary-container text-on-primary-container p-5 rounded-2xl text-center border border-primary/20 space-y-2">
              <span className="material-symbols-outlined text-[40px] text-primary">check_circle</span>
              <h3 className="text-sm font-black">Pendaftaran Berhasil!</h3>
              <p className="text-xs leading-relaxed opacity-80">Mengarahkan ke halaman login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Nama */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Nama Lengkap <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">badge</span>
                  <input type="text" name="nama_lengkap" required
                    className="w-full h-9 bg-background border border-outline-variant rounded-xl pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="Nama lengkap Anda" value={form.nama_lengkap} onChange={handleChange} />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">Alamat Email <span className="text-error">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">mail</span>
                  <input type="email" name="email" required
                    className="w-full h-9 bg-background border border-outline-variant rounded-xl pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="contoh@email.com" value={form.email} onChange={handleChange} />
                </div>
              </div>

              {/* Telepon */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-on-surface">No. WhatsApp <span className="text-on-surface-variant font-normal">(opsional)</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">smartphone</span>
                  <input type="tel" name="telepon"
                    className="w-full h-9 bg-background border border-outline-variant rounded-xl pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                    placeholder="081234567890" value={form.telepon} onChange={handleChange} />
                </div>
              </div>

              {/* Password & Konfirmasi — 2 kolom */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Password <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">lock</span>
                    <input type={showPassword ? 'text' : 'password'} name="password" required
                      className="w-full h-9 bg-background border border-outline-variant rounded-xl pl-9 pr-8 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                      placeholder="Min. 6 karakter" value={form.password} onChange={handleChange} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[15px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-on-surface">Konfirmasi <span className="text-error">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-[16px]">lock_reset</span>
                    <input type="password" name="confirm_password" required
                      className="w-full h-9 bg-background border border-outline-variant rounded-xl pl-9 pr-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                      placeholder="Ulangi" value={form.confirm_password} onChange={handleChange} />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full h-10 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading
                  ? <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  : <><span className="material-symbols-outlined text-[18px]">person_add</span> Buat Akun Sekarang</>
                }
              </button>
            </form>
          )}

          {/* Link Login */}
          <p className="text-center text-xs text-on-surface-variant">
            Sudah memiliki akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline underline-offset-2">Masuk di Sini</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
