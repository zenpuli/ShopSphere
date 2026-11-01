import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/api/products/featured'),
          api.get('/api/categories')
        ]);
        setFeaturedProducts(prodRes.data?.data || []);
        setCategories(catRes.data?.data || []);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadHomeData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-content">
          <div>
            <span className="hero-tag">✨ Engineering Elegance for Modern Living</span>
            <h1>Curated Gear for Creators & Professionals.</h1>
            <p>
              Discover high-performance electronics, studio-grade audio, minimalist apparel, and refined living essentials engineered for durability.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Explore Catalog
              </Link>
              <Link to="/products?categoryId=1" className="btn btn-outline btn-lg" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}>
                Tech & Gear
              </Link>
            </div>
          </div>

          <div className="hero-image">
            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80"
              alt="ShopSphere Hero Showcase"
            />
          </div>
        </div>
      </section>

      {/* Pillars of Trust */}
      <div className="container">
        <div className="pillars">
          <div className="pillar-card">
            <div className="pillar-icon">🚀</div>
            <div>
              <h4>Express Shipping</h4>
              <p>Complimentary tracked delivery on all orders.</p>
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🛡️</div>
            <div>
              <h4>Secure Checkout</h4>
              <p>Simulated tokenized payment with zero friction.</p>
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">🔄</div>
            <div>
              <h4>30-Day Guarantee</h4>
              <p>Hassle-free returns and product replacements.</p>
            </div>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">⚡</div>
            <div>
              <h4>Real-Time Inventory</h4>
              <p>Accurate database-synchronized stock levels.</p>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section style={{ marginBottom: '60px' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop by Category</h2>
              <p className="section-subtitle">Explore precision-designed essentials tailored to your daily craft.</p>
            </div>
            <Link to="/products" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              View All Categories →
            </Link>
          </div>

          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?categoryId=${cat.id}`}
                className="category-card"
                style={{ backgroundImage: `url(${cat.imageUrl})` }}
              >
                <div className="category-card-content">
                  <h3>{cat.name}</h3>
                  <span style={{ fontSize: '0.82rem', opacity: 0.9 }}>Browse items</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Products Section */}
        <section style={{ marginBottom: '80px' }}>
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Selections</h2>
              <p className="section-subtitle">Hand-picked top tier products from our active collection.</p>
            </div>
            <Link to="/products" style={{ color: 'var(--primary)', fontWeight: '700' }}>
              See All Products ({featuredProducts.length}+) →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray-500)' }}>
              Loading featured products...
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
