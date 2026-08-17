import React from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScrollToTop from './ScrollToTop';

const AppLayout = () => {
  const { user, profile, appRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard', roles: ['administrator', 'kader', 'orang_tua'] },
    { to: '/dashboard/data-balita', icon: 'child_care', label: 'Data Balita', roles: ['administrator', 'kader'] },
    { to: '/dashboard/ibu-hamil', icon: 'pregnant_woman', label: 'Ibu Hamil', roles: ['administrator', 'kader'] },
    { to: '/dashboard/ibu-menyusui', icon: 'breastfeeding', label: 'Ibu Menyusui', roles: ['administrator', 'kader'] },
    { to: '/dashboard/penimbangan', icon: 'scale', label: 'Penimbangan', roles: ['administrator', 'kader'], isPrimary: true },
    { to: '/dashboard/riwayat', icon: 'history', label: 'Riwayat', roles: ['administrator', 'kader', 'orang_tua'] },
    { to: '/dashboard/laporan', icon: 'analytics', label: 'Laporan', roles: ['administrator', 'kader'] },
    { to: '/dashboard/users', icon: 'group', label: 'Users', roles: ['administrator'] },
    { to: '/dashboard/settings', icon: 'settings', label: 'Pengaturan', roles: ['administrator'] },
  ];

  const visibleLinks = navLinks.filter(link => link.roles.includes(appRole));

  return (
    <div className="bg-background text-on-background min-h-screen antialiased flex w-full">
      <ScrollToTop />
      
      {/* DESKTOP LAYOUT */}
      <aside className="hidden lg:flex flex-col h-screen w-72 left-0 top-0 fixed bg-surface-container-low border-r border-outline-variant py-8 px-4 gap-stack-gap z-50">
        <div className="flex flex-col items-center gap-2 mb-8 px-2">
          <Link to="/dashboard" className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined text-[40px]">health_and_safety</span>
            </div>
            <div className="text-center">
              <h1 className="text-headline-md font-bold text-primary">SmartPosyandu</h1>
              <p className="text-body-md text-on-surface-variant capitalize">{appRole?.replace('_', ' ')}</p>
            </div>
          </Link>
        </div>
        
        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto app-scrollbar pr-2">
          {visibleLinks.map((link) => (
            <NavLink 
              key={link.to} 
              to={link.to}
              className={({ isActive }) => 
                isActive 
                  ? "flex items-center gap-4 px-4 py-3 text-primary font-bold border-r-4 border-primary bg-surface-container-high rounded-l-xl"
                  : "flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-container transition-colors rounded-xl"
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className="text-label-lg">{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-3 text-error hover:bg-error-container hover:text-on-error-container transition-colors rounded-xl mt-auto"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-label-lg font-bold">Keluar</span>
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="lg:ml-72 flex flex-col min-h-screen flex-1 w-full pb-[80px] lg:pb-0">
        <header className="flex justify-between items-center w-full px-4 lg:px-margin-page h-[64px] sticky top-0 z-40 bg-surface shadow-sm lg:bg-surface-container-low lg:shadow-none border-b lg:border-none border-outline-variant/30">
          <div className="flex items-center gap-3 lg:hidden">
            <span className="material-symbols-outlined text-primary text-[32px]">health_and_safety</span>
            <h1 className="text-headline-md font-bold text-primary tracking-tight">SmartPosyandu</h1>
          </div>
          <div className="hidden lg:block">
            {/* Breadcrumb or Title can go here, but omitted for generic layout */}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end mr-2 hidden md:flex">
              <span className="text-[14px] font-bold text-on-surface leading-none">{profile?.nama_lengkap || user?.email}</span>
              <span className="text-[12px] text-on-surface-variant capitalize">{appRole?.replace('_', ' ')}</span>
            </div>
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-high active:scale-95 transition-all text-on-surface-variant relative">
              <span className="material-symbols-outlined text-[24px]">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-surface"></span>
            </button>
            <div className="w-[40px] h-[40px] rounded-full overflow-hidden border-2 border-primary cursor-pointer hover:scale-105 transition-transform" onClick={() => navigate('/dashboard/profile')} title="Profil Saya">
              <img className="w-full h-full object-cover" alt="Profil Pengguna" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMF4SUB6qon-ujRpeBT38CJQHHpBY0N_4VG_lD-Umc5GTdEUBqo7z6-RV7pnKjhx9xtM9BMigXW20LRZ4ZC-Ha-hSexrNMbxVpHMEzCpPztXkbPLrZJ_dtIM6eCIt07ygyvSeNOTG5tMjpNXFYnTQkjNbR55Pw539DCT2nwW4zE1GRXgr4BnsVZ450XkNlYKGL9KSeKWKmaeLIvcwU-bcCr-oLqkZx4QwOQs3RM8Cus20EgWsOHfUF3sUwbCnJw8EM-oqiyCBjIgI"/>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1">
          <Outlet />
        </div>
      </main>

      {/* MOBILE BOTTOM NAV */}
      <nav className="lg:hidden fixed bottom-0 w-full shrink-0 flex justify-around items-center px-1 py-2 bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.05)] h-[80px] border-t border-outline-variant z-50">
        {visibleLinks.map((link) => {
          if (link.isPrimary) {
            return (
              <NavLink 
                key={link.to} 
                to={link.to}
                className={({ isActive }) => 
                  isActive 
                    ? "flex flex-col items-center justify-center bg-primary text-on-primary rounded-full px-3 py-1.5 min-[380px]:px-4 scale-105 transition-all shadow-md"
                    : "flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-3 py-1.5 min-[380px]:px-4 scale-95 transition-all"
                }
              >
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{link.icon}</span>
                <span className="text-[11px] font-semibold">{link.label}</span>
              </NavLink>
            );
          }
          return (
            <NavLink 
              key={link.to} 
              to={link.to}
              className={({ isActive }) => 
                isActive 
                  ? "flex flex-col items-center justify-center text-primary py-2 rounded-xl px-2.5 transition-all"
                  : "flex flex-col items-center justify-center text-on-surface-variant py-2 hover:bg-surface-variant/20 rounded-xl px-2.5 transition-all"
              }
            >
              <span className="material-symbols-outlined text-[24px]">{link.icon}</span>
              <span className="text-[11px] font-semibold max-[380px]:hidden">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

    </div>
  );
};

export default AppLayout;
