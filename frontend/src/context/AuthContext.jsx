import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/api/auth/me');
      if (res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const userData = res.data.data;
    setUser(userData);
    return userData;
  };

  const register = async (userData) => {
    const res = await api.post('/api/auth/register', userData);
    const userResult = res.data.data;
    setUser(userResult);
    return userResult;
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser: checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
