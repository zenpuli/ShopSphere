import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: user?.fullName || '',
    recipientPhone: user?.phone || '+1 555-019-2834',
    shippingAddress: user?.address || '742 Evergreen Terrace, Springfield, OR 97477',
    paymentMethod: 'CARD',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvc: '888',
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.recipientName.trim() || !formData.recipientPhone.trim() || !formData.shippingAddress.trim()) {
      setErrorMsg('Please fill out all required shipping fields.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/api/orders/checkout', {
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
      });

      const order = res.data?.data;
      showToast('Order placed successfully!', 'success');
      // Refresh cart to ensure zeroed count
      await fetchCart();
      navigate(`/orders/${order.id}`);
    } catch (err) {
      setErrorMsg(err.message);
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ margin: '16px 0', color: 'var(--gray-500)' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/products" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>
        Checkout & Payment
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
        Enter your shipping destination and complete the simulated transaction.
      </p>

      {errorMsg && (
        <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '16px 20px', borderRadius: 'var(--radius-md)', marginBottom: '24px', fontWeight: '600' }}>
          ⚠️ {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 380px',
            gap: '36px',
            alignItems: 'flex-start',
          }}
        >
          {/* Shipping & Payment Info */}
          <div>
            {/* Shipping Destination */}
            <div
              style={{
                background: 'white',
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '28px',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📍 Shipping Details
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Recipient Full Name *</label>
                  <input
                    type="text"
                    name="recipientName"
                    className="form-control"
                    value={formData.recipientName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number *</label>
                  <input
                    type="text"
                    name="recipientPhone"
                    className="form-control"
                    value={formData.recipientPhone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Full Street Delivery Address *</label>
                <textarea
                  name="shippingAddress"
                  className="form-control"
                  rows="3"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div
              style={{
                background: 'white',
                padding: '28px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                💳 Payment Method (Simulated)
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--gray-500)', marginBottom: '20px' }}>
                No real money will be charged. Payment validation is simulated end-to-end.
              </p>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                {['CARD', 'UPI', 'COD'].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
                    className={`btn ${formData.paymentMethod === method ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1, padding: '12px 10px' }}
                  >
                    {method === 'CARD' && '💳 Card'}
                    {method === 'UPI' && '📱 Instant UPI'}
                    {method === 'COD' && '💵 Cash on Delivery'}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'CARD' && (
                <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-control"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        className="form-control"
                        value={paymentDetails.cardExpiry}
                        onChange={handlePaymentChange}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVC / Security Code</label>
                      <input
                        type="text"
                        name="cardCvc"
                        className="form-control"
                        value={paymentDetails.cardCvc}
                        onChange={handlePaymentChange}
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'UPI' && (
                <div style={{ background: 'var(--gray-50)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <div className="form-group">
                    <label className="form-label">UPI ID / VPA</label>
                    <input
                      type="text"
                      className="form-control"
                      defaultValue="customer@okaxis"
                      placeholder="e.g. yourname@oksbi"
                    />
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'COD' && (
                <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                  💵 Pay with cash upon delivery at your doorstep.
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--gray-200)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              position: 'sticky',
              top: '100px',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '18px' }}>
              Items Summary
            </h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '20px', paddingRight: '4px' }}>
              {cart.items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--dark)', flex: 1, marginRight: '12px' }}>
                    {item.productName} <span style={{ color: 'var(--gray-400)' }}>× {item.quantity}</span>
                  </span>
                  <span style={{ fontWeight: '600' }}>${Number(item.subtotal).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--gray-500)' }}>Subtotal</span>
                <span>${Number(cart.totalAmount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--gray-500)' }}>Shipping</span>
                <span style={{ color: 'var(--success)', fontWeight: '700' }}>FREE</span>
              </div>
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
              <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--dark)' }}>Total to Pay</span>
              <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>
                ${Number(cart.totalAmount).toFixed(2)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              {submitting ? 'Processing Transaction...' : `Authorize & Place Order`}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
