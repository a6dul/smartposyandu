import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      const token = localStorage.getItem('smartposyandu_token');
      if (!token) {
        if (mounted) {
          setUser(null);
          setProfile(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        const { data } = await api.get('/auth/verify');
        if (mounted) {
          if (data.profile) {
            setUser({ id: data.profile.id, email: data.profile.email });
            setProfile(data.profile);
          } else {
            setUser(null);
            setProfile(null);
          }
        }
      } catch (error) {
        console.error('Error in auth verify:', error);
        if (mounted) {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('smartposyandu_token');
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadData();

    // Listen for custom auth-unauthorized event from api.js interceptor
    const handleUnauthorized = () => {
      if (mounted) {
        setUser(null);
        setProfile(null);
      }
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);

    return () => {
      mounted = false;
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email, password) => {
    // Note: Axios automatically throws on 4xx/5xx responses
    // so errors will be caught by the component's try-catch block
    try {
      const response = await api.post('/auth/login', { email, password });
      const { data } = response;
      
      if (data.error) throw new Error(data.error);
      
      // Save token
      localStorage.setItem('smartposyandu_token', data.access_token);
      
      // Set user and profile
      setUser(data.user);
      setProfile(data.profile);
      
      return data;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message && err.message !== 'undefined' ? err.message : null) ||
        'Email/username atau password salah.';
      throw new Error(msg);
    }
  };

  const logout = () => {
    localStorage.removeItem('smartposyandu_token');
    setUser(null);
    setProfile(null);
  };

  const register = async (nama_lengkap, email, telepon, password) => {
    try {
      const response = await api.post('/auth/register', { nama_lengkap, email, telepon, password });
      if (response.data.error) throw new Error(response.data.error);
      return response.data;
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message && err.message !== 'undefined' ? err.message : null) ||
        'Terjadi kesalahan saat pendaftaran.';
      throw new Error(msg);
    }
  };

  const updateProfileData = async (nama_lengkap, telepon) => {
    try {
      const response = await api.post('/auth/update-profile', { nama_lengkap, telepon });
      if (response.data.error) throw new Error(response.data.error);
      
      setProfile(prev => ({ ...prev, nama_lengkap, telepon }));
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  };

  const changePassword = async (password_lama, password_baru) => {
    try {
      const response = await api.post('/auth/change-password', { password_lama, password_baru });
      if (response.data.error) throw new Error(response.data.error);
      return response.data;
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        throw new Error(err.response.data.error);
      }
      throw err;
    }
  };

  const logAudit = async (aksi, modul, deskripsi) => {
    if (!user) return;
    try {
      await api.post('/query', {
        table: 'audit_logs',
        action: 'insert',
        payload: [{
          id_user: user.id,
          nama_user: profile?.nama_lengkap || user.email,
          aksi, 
          modul, 
          deskripsi
        }]
      });
    } catch (e) {
      console.warn('Audit log gagal:', e.message);
    }
  };

  const appRole = profile?.role || null;

  return (
    <AuthContext.Provider value={{ user, profile, appRole, login, logout, register, updateProfileData, changePassword, logAudit, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
