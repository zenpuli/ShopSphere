import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (formData.password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      showToast('Account registered successfully! Welcome to ShopSphere.', 'success');
      navigate('/');
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div className="auth-wrapper" style={{ maxWidth: '520px' }}>
        <div className="auth-header">
          <h2>Create Your Account</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
            Join ShopSphere for seamless shopping, orders, and synchronized cart storage.
          </p>
        </div>

        {errorMsg && (
          <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '0.9rem', fontWeight: '600' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-control"
              placeholder="e.g. Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="e.g. jane@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password * (6+ characters)</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-control"
              placeholder="+1-555-0199"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Default Shipping Address (Optional)</label>
            <textarea
              name="address"
              className="form-control"
              rows="2"
              placeholder="123 Market St, Suite 400"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--gray-600)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700' }}>
            Sign In Instead
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
