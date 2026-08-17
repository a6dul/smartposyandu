import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      {/* Header Minimalis — hanya tampil di Landing page */}
      {location.pathname !== '/login' && location.pathname !== '/register' && (
        <header className="h-16 md:h-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/30 sticky top-0 z-50 flex items-center px-4 lg:px-8 shadow-sm">
          <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-bold text-xl group-hover:scale-105 transition-transform shadow-md">
                SP
              </div>
              <span className="font-bold text-lg text-primary hidden sm:block">SmartPosyandu</span>
            </Link>

            {/* Nav / Login Button */}
            <div className="flex items-center gap-4">
              {user ? (
                <Link to="/dashboard" className="h-10 px-5 rounded-full bg-primary-container text-on-primary-container font-bold flex items-center gap-2 hover:bg-primary/20 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">dashboard</span>
                  Ke Dashboard
                </Link>
              ) : (
                <Link to="/login" className="h-10 px-6 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center hover:bg-primary/90 transition-all shadow-md hover:shadow-lg active:scale-95">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Main Content (Outlet) */}
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer Minimalis */}
      {location.pathname !== '/login' && (
        <footer className="bg-surface-container-lowest border-t border-outline-variant py-8 px-4 lg:px-8 mt-auto">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 opacity-80">
              <span className="material-symbols-outlined text-primary text-[24px]">favorite</span>
              <p className="text-body-md font-bold text-on-surface">Dibuat untuk Kesehatan Anak Indonesia</p>
            </div>
            <p className="text-sm text-on-surface-variant">&copy; 2025 SmartPosyandu. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
