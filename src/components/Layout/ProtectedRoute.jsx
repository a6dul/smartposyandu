import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, appRole, isLoading } = useAuth();
  const location = useLocation();

  // Tampilkan loading saat inisialisasi auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[48px] animate-spin">
            progress_activity
          </span>
          <p className="text-on-surface-variant font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  // Belum login → ke halaman login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role tidak sesuai → tampilkan halaman akses ditolak
  if (allowedRoles && appRole && !allowedRoles.includes(appRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface p-8">
        <div className="text-center max-w-sm">
          <span className="material-symbols-outlined text-error text-[64px]">lock</span>
          <h2 className="text-headline-md font-bold text-on-surface mt-4 mb-2">Akses Ditolak</h2>
          <p className="text-on-surface-variant">
            Halaman ini memerlukan izin yang lebih tinggi. Hubungi administrator untuk mengubah peran Anda.
          </p>
          <p className="text-sm text-on-surface-variant mt-2">
            Role Anda: <strong className="text-primary">{appRole}</strong>
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
