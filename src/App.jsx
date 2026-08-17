import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DataBalita from './pages/DataBalita';
import DetailBalita from './pages/DetailBalita';
import IbuHamil from './pages/IbuHamil';
import IbuMenyusui from './pages/IbuMenyusui';
import Penimbangan from './pages/Penimbangan';
import Riwayat from './pages/Riwayat';
import Laporan from './pages/Laporan';
import Settings from './pages/Settings';
import Users from './pages/Users';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PublicLayout from './components/Layout/PublicLayout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            {/* Dashboard / Beranda */}
            <Route index element={
              <ProtectedRoute allowedRoles={['administrator', 'kader', 'orang_tua']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Profil & Password (Bisa diakses semua) */}
            <Route path="profile" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader', 'orang_tua']}>
                <Profile />
              </ProtectedRoute>
            } />
            
            {/* Data Balita */}
            <Route path="data-balita" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader']}>
                <DataBalita />
              </ProtectedRoute>
            } />
            <Route path="balita/:id" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader', 'orang_tua']}>
                <DetailBalita />
              </ProtectedRoute>
            } />
            
            {/* Ibu Hamil */}
            <Route path="ibu-hamil" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader']}>
                <IbuHamil />
              </ProtectedRoute>
            } />

            {/* Ibu Menyusui */}
            <Route path="ibu-menyusui" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader']}>
                <IbuMenyusui />
              </ProtectedRoute>
            } />
            
            {/* Penimbangan */}
            <Route path="penimbangan" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader']}>
                <Penimbangan />
              </ProtectedRoute>
            } />
            
            {/* Riwayat (Bisa diakses semua, termasuk orang tua) */}
            <Route path="riwayat" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader', 'orang_tua']}>
                <Riwayat />
              </ProtectedRoute>
            } />
            
            {/* Laporan */}
            <Route path="laporan" element={
              <ProtectedRoute allowedRoles={['administrator', 'kader']}>
                <Laporan />
              </ProtectedRoute>
            } />
            
            {/* Pengaturan */}
            <Route path="settings" element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Manajemen Pengguna */}
            <Route path="users" element={
              <ProtectedRoute allowedRoles={['administrator']}>
                <Users />
              </ProtectedRoute>
            } />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
