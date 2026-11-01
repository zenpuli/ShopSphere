import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/${id}`);
        setOrder(res.data?.data || null);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Order Not Found</h2>
        <p style={{ margin: '16px 0', color: 'var(--gray-500)' }}>We could not locate this order.</p>
        <Link to="/orders" className="btn btn-primary">Go to Order History</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px 80px', maxWidth: '800px' }}>
      <div
        style={{
          background: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'center',
          marginBottom: '32px',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🎉</div>
        <span className="status-badge status-PLACED" style={{ marginBottom: '12px' }}>
          {order.status}
        </span>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>
          Thank You For Your Order!
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem', marginBottom: '24px' }}>
          Your order has been recorded in the database and stock has been allocated.
        </p>

        <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', display: 'inline-block', marginBottom: '32px' }}>
          <span style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Order Reference: </span>
          <strong style={{ color: 'var(--primary)', fontSize: '1.1rem' }}>{order.orderNumber}</strong>
        </div>

        {/* Order Details Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            textAlign: 'left',
            background: 'var(--gray-50)',
            padding: '24px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '32px',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '700' }}>Recipient</div>
            <div style={{ fontWeight: '700', color: 'var(--dark)', marginTop: '4px' }}>{order.recipientName}</div>
            <div style={{ color: 'var(--gray-600)', fontSize: '0.9rem' }}>{order.recipientPhone}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '700' }}>Shipping Address</div>
            <div style={{ color: 'var(--dark)', marginTop: '4px', fontSize: '0.95rem' }}>{order.shippingAddress}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '700' }}>Payment Method</div>
            <div style={{ fontWeight: '700', color: 'var(--dark)', marginTop: '4px' }}>
              {order.paymentMethod} ({order.paymentStatus})
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--gray-500)', textTransform: 'uppercase', fontWeight: '700' }}>Order Date</div>
            <div style={{ color: 'var(--dark)', marginTop: '4px', fontSize: '0.95rem' }}>
              {new Date(order.orderDate).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div style={{ textAlign: 'left', marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px' }}>Ordered Items</h3>
          <div style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            {order.items?.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: '1px solid var(--gray-100)',
                }}
              >
                <div>
                  <div style={{ fontWeight: '700', color: 'var(--dark)' }}>{item.productName}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                    ${Number(item.productPrice).toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: '800', color: 'var(--dark)' }}>
                  ${Number(item.subtotal).toFixed(2)}
                </div>
              </div>
            ))}

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'var(--gray-50)',
                fontWeight: '800',
                fontSize: '1.1rem',
              }}
            >
              <span>Total Paid</span>
              <span style={{ color: 'var(--primary)' }}>${Number(order.totalAmount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link to="/products" className="btn btn-outline">
            Continue Shopping
          </Link>
          <Link to="/orders" className="btn btn-primary">
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
