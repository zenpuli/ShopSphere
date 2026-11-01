import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully.', 'info');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <Link to="/" className="brand">
          <div className="brand-icon">S</div>
          <span>Shop</span>Sphere
        </Link>

        {/* Navigation Links */}
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => (isActive ? 'active' : '')}>
            Products
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/orders" className={({ isActive }) => (isActive ? 'active' : '')}>
              My Orders
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'active' : '')} style={{ color: '#d97706', fontWeight: '700' }}>
              Admin Panel
            </NavLink>
          )}
        </div>

        {/* Action Controls */}
        <div className="nav-actions">
          {/* Cart Icon */}
          <Link to="/cart" className="cart-btn" aria-label="Shopping Cart">
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User State */}
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--dark)' }}>
                  {user.fullName}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--gray-500)' }}>
                  {user.role}
                </div>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
