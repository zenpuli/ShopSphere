import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await login(email, password);
      showToast('Welcome back to ShopSphere!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@shopsphere.com');
    setPassword('Admin@ShopSphere2026');
    setErrorMsg('');
  };

  const autofillCustomer = () => {
    setEmail('customer@shopsphere.com');
    setPassword('Customer@ShopSphere2026');
    setErrorMsg('');
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div className="auth-wrapper">
        <div className="auth-header">
          <h2>Sign In to ShopSphere</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
            Access your orders, saved cart items, and account settings.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. yourname@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="demo-credentials-box">
          <h4>🧪 Demo Credentials (One-Click Fill)</h4>
          <p style={{ color: 'var(--gray-600)', marginBottom: '8px' }}>
            Click either button below to prefill testing credentials:
          </p>
          <div>
            <button type="button" onClick={autofillAdmin} className="demo-fill-btn">
              🔑 Admin Demo
            </button>
            <button type="button" onClick={autofillCustomer} className="demo-fill-btn">
              🛍️ Customer Demo
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
