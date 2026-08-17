import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/UI/Toast';

const Profile = () => {
  const { profile, updateProfileData, changePassword } = useAuth();
  
  // Profile state
  const [profileForm, setProfileForm] = useState({
    nama_lengkap: '',
    telepon: ''
  });
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState({
    password_lama: '',
    password_baru: '',
    confirm_password: ''
  });
  const [loadingPassword, setLoadingPassword] = useState(false);
  
  const [toast, setToast] = useState(null);
  const showToast = (msg, type = 'success') => setToast({ msg, type });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        nama_lengkap: profile.nama_lengkap || '',
        telepon: profile.telepon || ''
      });
    }
  }, [profile]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const submitProfile = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      await updateProfileData(profileForm.nama_lengkap, profileForm.telepon);
      showToast('Profil berhasil diperbarui!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingProfile(false);
    }
  };

  const submitPassword = async (e) => {
    e.preventDefault();
    if (passwordForm.password_baru !== passwordForm.confirm_password) {
      return showToast('Konfirmasi password tidak cocok.', 'error');
    }
    if (passwordForm.password_baru.length < 6) {
      return showToast('Password baru minimal 6 karakter.', 'error');
    }

    setLoadingPassword(true);
    try {
      await changePassword(passwordForm.password_lama, passwordForm.password_baru);
      showToast('Password berhasil diubah!');
      setPasswordForm({ password_lama: '', password_baru: '', confirm_password: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoadingPassword(false);
    }
  };

  if (!profile) return null;

  return (
    <main className="flex-1 p-4 lg:p-margin-page pb-32 lg:pb-12 max-w-4xl mx-auto w-full">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="mb-6 lg:mb-10 flex flex-col gap-2 pt-4 lg:pt-0">
        <h2 className="text-title-lg font-bold text-on-background">Profil Saya</h2>
        <p className="text-sm text-on-surface-variant">Kelola informasi personal dan keamanan akun Anda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* --- INFO PROFIL --- */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-primary text-[28px]">person</span>
            <h3 className="text-title-lg font-bold text-on-surface">Informasi Personal</h3>
          </div>

          <form onSubmit={submitProfile} className="flex flex-col gap-4">
            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Email</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">mail</span>
                <input
                  type="email"
                  value={profile.email}
                  readOnly
                  className="w-full h-12 pl-12 pr-4 bg-surface-variant/30 rounded-xl border border-outline-variant text-sm text-on-surface-variant cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Role</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">badge</span>
                <input
                  type="text"
                  value={profile.role?.replace('_', ' ')}
                  readOnly
                  className="w-full h-12 pl-12 pr-4 bg-surface-variant/30 rounded-xl border border-outline-variant text-sm text-on-surface-variant capitalize cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Nama Lengkap *</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">id_card</span>
                <input
                  type="text"
                  name="nama_lengkap"
                  required
                  value={profileForm.nama_lengkap}
                  onChange={handleProfileChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 border-outline-variant focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">No. Telepon / WhatsApp</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">call</span>
                <input
                  type="tel"
                  name="telepon"
                  value={profileForm.telepon}
                  onChange={handleProfileChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 border-outline-variant focus:border-primary outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingProfile}
              className="mt-2 h-11 bg-primary text-on-primary rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {loadingProfile ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">save</span>}
              Simpan Profil
            </button>
          </form>
        </section>

        {/* --- GANTI PASSWORD --- */}
        <section className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-6 shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3 pb-4 border-b border-outline-variant">
            <span className="material-symbols-outlined text-error text-[28px]">lock_reset</span>
            <h3 className="text-title-lg font-bold text-on-surface">Ubah Password</h3>
          </div>

          <form onSubmit={submitPassword} className="flex flex-col gap-4">
            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Password Lama *</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">key</span>
                <input
                  type="password"
                  name="password_lama"
                  required
                  value={passwordForm.password_lama}
                  onChange={handlePasswordChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 border-outline-variant focus:border-error outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Password Baru *</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock</span>
                <input
                  type="password"
                  name="password_baru"
                  required
                  minLength="6"
                  value={passwordForm.password_baru}
                  onChange={handlePasswordChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 border-outline-variant focus:border-error outline-none transition-all text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] lg:text-label-lg font-semibold text-on-surface px-1">Konfirmasi Password Baru *</label>
              <div className="relative mt-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">lock_check</span>
                <input
                  type="password"
                  name="confirm_password"
                  required
                  minLength="6"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  className="w-full h-12 pl-12 pr-4 bg-surface rounded-xl border-2 border-outline-variant focus:border-error outline-none transition-all text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingPassword}
              className="mt-2 h-11 bg-error text-on-error rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-error/90 transition-all disabled:opacity-50"
            >
              {loadingPassword ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">password</span>}
              Ganti Password
            </button>
          </form>
        </section>

      </div>
    </main>
  );
};

export default Profile;
