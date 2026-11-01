import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔒</div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Sign in to view your cart</h2>
        <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
          Your cart items are stored securely and persistently on your account.
        </p>
        <Link to="/login" className="btn btn-primary btn-lg">
          Sign In Now
        </Link>
      </div>
    );
  }

  const items = cart.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>
        Shopping Cart
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
        Review your chosen items before proceeding to secure checkout.
      </p>

      {isEmpty ? (
        <div
          style={{
            background: 'white',
            padding: '60px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🛒</div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
            Your cart is currently empty
          </h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: '24px' }}>
            Explore our curated products and find something you love today.
          </p>
          <Link to="/products" className="btn btn-primary btn-lg">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 360px',
            gap: '32px',
            alignItems: 'flex-start',
          }}
        >
          {/* Items List */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-200)', fontWeight: '700', fontSize: '1.1rem' }}>
              Items in Cart ({cart.totalItems})
            </div>

            <div style={{ divideY: '1px solid var(--gray-200)' }}>
              {items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: '1px solid var(--gray-100)',
                    gap: '16px',
                  }}
                >
                  {/* Thumbnail & Title */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <img
                      src={item.productImageUrl}
                      alt={item.productName}
                      style={{
                        width: '72px',
                        height: '72px',
                        borderRadius: 'var(--radius-md)',
                        objectFit: 'cover',
                        background: 'var(--gray-100)',
                      }}
                    />
                    <div>
                      <Link
                        to={`/products/${item.productId}`}
                        style={{ fontWeight: '700', color: 'var(--dark)', fontSize: '1rem', display: 'block', marginBottom: '4px' }}
                      >
                        {item.productName}
                      </Link>
                      <div style={{ color: 'var(--gray-500)', fontSize: '0.88rem' }}>
                        Unit Price: ${Number(item.unitPrice).toFixed(2)}
                      </div>
                      {!item.inStock && (
                        <div style={{ color: 'var(--danger)', fontSize: '0.8rem', fontWeight: '600', marginTop: '2px' }}>
                          ⚠️ Low stock: Only {item.availableStock} remaining
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid var(--gray-300)',
                        borderRadius: 'var(--radius-md)',
                      }}
                    >
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        style={{ padding: '4px 10px', fontWeight: 'bold' }}
                      >
                        -
                      </button>
                      <span style={{ padding: '4px 12px', fontWeight: '700', minWidth: '32px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{ padding: '4px 10px', fontWeight: 'bold' }}
                        disabled={item.quantity >= item.availableStock}
                      >
                        +
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div style={{ minWidth: '90px', textAlign: 'right', fontWeight: '800', color: 'var(--dark)' }}>
                      ${Number(item.subtotal).toFixed(2)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: 'var(--gray-400)', padding: '6px', fontSize: '1.1rem' }}
                      title="Remove item"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Card */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '20px' }}>
              Order Summary
            </h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--gray-500)' }}>Subtotal</span>
              <span style={{ fontWeight: '600' }}>${Number(cart.totalAmount).toFixed(2)}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--gray-500)' }}>Standard Delivery</span>
              <span style={{ color: 'var(--success)', fontWeight: '700' }}>FREE</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--gray-500)' }}>Estimated Tax</span>
              <span style={{ color: 'var(--gray-500)' }}>Included</span>
            </div>

            <div
              style={{
                borderTop: '2px solid var(--gray-200)',
                paddingTop: '16px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--dark)' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                ${Number(cart.totalAmount).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={!cart.validForCheckout}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              Proceed to Checkout
            </button>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--gray-400)' }}>
              🔒 Bank-grade encrypted 256-bit transactional checkout
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
