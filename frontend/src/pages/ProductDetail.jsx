import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/products/${id}`);
        setProduct(res.data?.data || null);
      } catch (err) {
        showToast(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, showToast]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--gray-500)' }}>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Product Not Found</h2>
        <p style={{ margin: '16px 0', color: 'var(--gray-500)' }}>The requested product does not exist or has been retired.</p>
        <Link to="/products" className="btn btn-primary">Return to Catalog</Link>
      </div>
    );
  }

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link to="/products" style={{ color: 'var(--gray-500)', fontSize: '0.9rem', fontWeight: '600' }}>
          ← Back to Catalog
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '48px',
          background: 'white',
          padding: '40px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* Product Image */}
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--gray-100)' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '520px', objectFit: 'cover' }}
          />
        </div>

        {/* Details & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              textTransform: 'uppercase',
              color: 'var(--primary)',
              fontWeight: '700',
              fontSize: '0.85rem',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            {product.categoryName}
          </span>

          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '14px', lineHeight: '1.2' }}>
            {product.name}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--dark)' }}>
              ${Number(product.price).toFixed(2)}
            </span>
            <span
              className={`badge-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}
              style={{ position: 'static' }}
            >
              {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} available in inventory`}
            </span>
          </div>

          <div style={{ borderTop: '1px solid var(--gray-200)', borderBottom: '1px solid var(--gray-200)', padding: '24px 0', margin: '16px 0 28px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--gray-800)', marginBottom: '10px' }}>
              Description & Specifications
            </h4>
            <p style={{ color: 'var(--gray-600)', lineHeight: '1.7', fontSize: '1rem' }}>
              {product.description}
            </p>
          </div>

          {/* Quantity and Add to Cart */}
          {!isOutOfStock ? (
            <div style={{ marginTop: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                <span style={{ fontWeight: '600', color: 'var(--gray-700)' }}>Quantity:</span>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--gray-300)', borderRadius: 'var(--radius-md)' }}>
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    style={{ padding: '8px 16px', fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    -
                  </button>
                  <span style={{ padding: '8px 16px', fontWeight: '700', minWidth: '40px', textAlign: 'center' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((prev) => Math.min(product.stockQuantity, prev + 1))}
                    style={{ padding: '8px 16px', fontSize: '1.1rem', fontWeight: 'bold' }}
                  >
                    +
                  </button>
                </div>
                <span style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>
                  Max: {product.stockQuantity}
                </span>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
              >
                {adding ? 'Adding...' : `Add ${quantity} to Cart — $${(Number(product.price) * quantity).toFixed(2)}`}
              </button>
            </div>
          ) : (
            <div style={{ marginTop: 'auto', background: 'var(--danger-light)', padding: '16px', borderRadius: 'var(--radius-md)', color: 'var(--danger)' }}>
              <strong>Currently Unavailable:</strong> This product has sold out. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
