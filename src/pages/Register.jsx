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
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-on-background py-16">
      <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-on-primary mb-4 shadow-md">
        <span className="material-symbols-outlined text-[48px]">person_add</span>
      </div>
      <h1 className="text-headline-sm font-bold text-primary mb-2 text-center">Daftar Akun Baru</h1>
      <p className="text-body-md text-on-surface-variant mb-8 text-center max-w-sm">
        Bergabung dengan SmartPosyandu sebagai Orang Tua.
      </p>

      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant">
        {success ? (
          <div className="bg-primary-container text-on-primary-container p-6 rounded-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-primary mb-2">check_circle</span>
            <h3 className="text-title-lg font-bold mb-2">Pendaftaran Berhasil!</h3>
            <p className="text-body-md">Akun Anda telah dibuat. Mengalihkan ke halaman login...</p>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-error-container text-on-error-container p-4 rounded-xl mb-6 text-sm font-medium flex items-start gap-2">
                <span className="material-symbols-outlined shrink-0">error</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-label-lg font-bold text-on-surface mb-2">Nama Lengkap *</label>
                <input
                  type="text"
                  name="nama_lengkap"
                  required
                  className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Masukkan nama lengkap"
                  value={form.nama_lengkap}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-label-lg font-bold text-on-surface mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="contoh@email.com"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-label-lg font-bold text-on-surface mb-2">No. Telepon/WhatsApp</label>
                <input
                  type="tel"
                  name="telepon"
                  className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="081234567890"
                  value={form.telepon}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-label-lg font-bold text-on-surface mb-2">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Minimal 6 karakter"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-label-lg font-bold text-on-surface mb-2">Konfirmasi Password *</label>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  className="w-full h-12 bg-surface px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="Ulangi password"
                  value={form.confirm_password}
                  onChange={handleChange}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-[50px] bg-primary text-on-primary font-bold text-[16px] rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="material-symbols-outlined animate-spin">progress_activity</span>
                ) : (
                  'Daftar Sekarang'
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <p className="text-body-md text-on-surface-variant">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
