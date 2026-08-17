import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">


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
            <p className="text-sm text-on-surface-variant">&copy; {new Date().getFullYear()} SmartPosyandu. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default PublicLayout;
