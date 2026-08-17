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
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-on-background py-16">
      <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-on-primary mb-6 shadow-md">
        <span className="material-symbols-outlined text-[64px]">health_and_safety</span>
      </div>
      <h1 className="text-headline-lg font-bold text-primary mb-2 text-center">SmartPosyandu</h1>
      <p className="text-body-md text-on-surface-variant mb-10 text-center max-w-sm">
        Sistem pencatatan terpadu untuk kader kesehatan dan orang tua balita.
      </p>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant">
        <h2 className="text-headline-md font-bold mb-6 text-center text-on-surface">Masuk ke Akun</h2>

        {error && (
          <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-2">
            <span className="material-symbols-outlined shrink-0">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full h-14 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Masukkan email Anda"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-label-lg font-bold text-on-surface mb-2">Password</label>
            <input
              type="password"
              required
              className="w-full h-14 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              placeholder="Masukkan password Anda"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[56px] bg-primary text-on-primary font-bold text-[16px] rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="material-symbols-outlined animate-spin">progress_activity</span>
            ) : (
              <>
                <span className="material-symbols-outlined">login</span>
                Masuk
              </>
            )}
          </button>
        </form>

        {/* --- TOMBOL AKSES CEPAT UNTUK DEMO OFFLINE --- */}
        <div className="mt-8 pt-6 border-t border-outline-variant/60">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider text-center mb-3">
            ⚡ Akses Cepat Demo (1-Klik Offline)
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => { setEmail('kader@smartposyandu.id'); setPassword('123456'); }}
              className="w-full h-11 px-3 bg-primary-container/20 hover:bg-primary-container/40 text-primary border border-primary/20 rounded-xl font-medium text-xs flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">medical_services</span>
                <span>Demo Kader Posyandu</span>
              </span>
              <span className="text-[10px] bg-primary/10 px-2 py-0.5 rounded-full font-bold">Kader</span>
            </button>

            <button
              type="button"
              onClick={() => { setEmail('admin@smartposyandu.id'); setPassword('123456'); }}
              className="w-full h-11 px-3 bg-secondary-container/20 hover:bg-secondary-container/40 text-secondary border border-secondary/20 rounded-xl font-medium text-xs flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                <span>Demo Administrator</span>
              </span>
              <span className="text-[10px] bg-secondary/10 px-2 py-0.5 rounded-full font-bold">Admin</span>
            </button>

            <button
              type="button"
              onClick={() => { setEmail('orangtua@smartposyandu.id'); setPassword('123456'); }}
              className="w-full h-11 px-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface border border-outline-variant rounded-xl font-medium text-xs flex items-center justify-between transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">family_restroom</span>
                <span>Demo Orang Tua Balita</span>
              </span>
              <span className="text-[10px] bg-outline-variant/40 px-2 py-0.5 rounded-full font-bold">Ortu</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-outline-variant/60 text-center">
          <p className="text-body-md text-on-surface-variant">
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
