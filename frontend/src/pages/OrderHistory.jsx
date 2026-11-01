import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/api/orders');
        setOrders(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>
        My Order History
      </h1>
      <p style={{ color: 'var(--gray-500)', marginBottom: '32px' }}>
        Track your previous orders and inspect item fulfillment statuses.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: 'white',
            padding: '60px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📦</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '8px' }}>No orders placed yet</h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: '20px' }}>
            When you purchase items on ShopSphere, your order records and tracking details will appear here.
          </p>
          <Link to="/products" className="btn btn-primary">
            Explore Collection
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map((order) => (
            <div
              key={order.id}
              style={{
                background: 'white',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--gray-200)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  borderBottom: '1px solid var(--gray-100)',
                  paddingBottom: '16px',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>Order Number: </span>
                  <strong style={{ color: 'var(--dark)', fontSize: '1rem' }}>{order.orderNumber}</strong>
                  <div style={{ fontSize: '0.82rem', color: 'var(--gray-400)', marginTop: '2px' }}>
                    Placed on {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                  <div style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--dark)' }}>
                    ${Number(order.totalAmount).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {order.items?.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: 'var(--gray-700)',
                    }}
                  >
                    <span>
                      {item.productName} × <strong>{item.quantity}</strong>
                    </span>
                    <span style={{ fontWeight: '600' }}>${Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--gray-100)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem',
                  color: 'var(--gray-500)',
                }}
              >
                <span>Ship to: {order.recipientName} ({order.shippingAddress})</span>
                <Link to={`/orders/${order.id}`} style={{ color: 'var(--primary)', fontWeight: '700' }}>
                  View Full Receipt →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
