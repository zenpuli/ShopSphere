import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.1rem' }}>Verifying administrative privileges...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--danger)', marginBottom: '16px' }}>403 Access Denied</h2>
        <p style={{ color: 'var(--gray-600)', marginBottom: '24px' }}>
          This section is restricted exclusively to ShopSphere administrators.
        </p>
        <a href="/" className="btn btn-primary">Return to Homepage</a>
      </div>
    );
  }

  return children;
};
