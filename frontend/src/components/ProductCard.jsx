import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stockQuantity <= 0;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'}
            alt={product.name}
            loading="lazy"
          />
        </Link>
        {product.featured && <span className="badge-featured">Featured</span>}
        <span className={`badge-stock ${isOutOfStock ? 'out-of-stock' : 'in-stock'}`}>
          {isOutOfStock ? 'Out of Stock' : `${product.stockQuantity} in stock`}
        </span>
      </div>

      <div className="product-info">
        <span className="product-category">{product.categoryName || 'General'}</span>
        <Link to={`/products/${product.id}`} className="product-title" title={product.name}>
          {product.name}
        </Link>
        <p className="product-desc">{product.description}</p>

        <div className="product-footer">
          <div className="product-price">${Number(product.price).toFixed(2)}</div>
          <button
            onClick={() => addToCart(product.id, 1)}
            disabled={isOutOfStock}
            className="btn btn-primary btn-sm"
          >
            {isOutOfStock ? 'Sold Out' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
