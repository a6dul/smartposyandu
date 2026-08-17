import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Begitu `user` state terisi di AuthContext, langsung pindah ke dashboard
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
      // Navigasi ditangani oleh useEffect di atas saat `user` state terupdate
    } catch (err) {
      console.error('LOGIN ERROR:', err);
      setError(err.message || 'Email atau password salah. Periksa kembali data Anda.');
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative text-on-background min-h-screen">
      {/* Tombol Kembali ke Beranda */}
      <Link to="/" className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-primary font-bold hover:bg-primary/10 px-4 py-2 rounded-full transition-colors z-10">
        <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        <span className="hidden sm:inline">Kembali</span>
      </Link>

      {/* Header / Logo (Dirampingkan) */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-primary flex items-center justify-center text-on-primary mb-4 shadow-md mt-10 sm:mt-0">
        <span className="material-symbols-outlined text-[40px] sm:text-[48px]">health_and_safety</span>
      </div>
      <h1 className="text-headline-sm sm:text-headline-md font-bold text-primary mb-1 text-center">SmartPosyandu</h1>
      <p className="text-body-sm sm:text-body-md text-on-surface-variant mb-6 text-center max-w-sm px-4">
        Sistem pencatatan terpadu untuk kader dan orang tua balita.
      </p>

      {/* Box Form Login */}
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-sm border border-outline-variant">
        <h2 className="text-title-lg font-bold mb-5 text-center text-on-surface">Masuk ke Akun</h2>

        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-5 text-sm font-medium flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0 text-[18px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-label-md font-bold text-on-surface mb-1.5">Email</label>
            <input
              type="email"
              required
              className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-label-md font-bold text-on-surface mb-1.5">Password</label>
            <input
              type="password"
              required
              className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-on-primary font-bold text-sm rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">login</span>
                Masuk
              </>
            )}
          </button>
        </form>

        {/* --- TOMBOL AKSES CEPAT (Dirampingkan) --- */}
        <div className="mt-6 pt-5 border-t border-outline-variant/60">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center mb-2">
            ⚡ Akses Cepat Demo
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { setEmail('admin@smartposyandu.id'); setPassword('password'); }}
              className="w-full h-9 px-3 bg-secondary-container/20 hover:bg-secondary-container/40 text-secondary border border-secondary/20 rounded-lg font-medium text-[11px] flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                <span>Demo Administrator</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setEmail('kader@smartposyandu.id'); setPassword('password'); }}
              className="w-full h-9 px-3 bg-primary-container/20 hover:bg-primary-container/40 text-primary border border-primary/20 rounded-lg font-medium text-[11px] flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">medical_services</span>
                <span>Demo Kader Posyandu</span>
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-outline-variant/60 text-center">
          <p className="text-body-sm text-on-surface-variant">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
