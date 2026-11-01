import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import ProductCard from '../components/ProductCard';

const ProductCatalog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('categoryId') || '';
  const searchQuery = searchParams.get('query') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';

  const [searchInput, setSearchInput] = useState(searchQuery);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.get('/api/categories');
        setCategories(res.data?.data || []);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch products when query params change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory) params.categoryId = selectedCategory;
        if (searchQuery) params.query = searchQuery;
        if (sortBy) params.sortBy = sortBy;

        const res = await api.get('/api/products', { params });
        setProducts(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, searchQuery, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('query', searchInput.trim());
    } else {
      newParams.delete('query');
    }
    setSearchParams(newParams);
  };

  const handleCategoryChange = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId) {
      newParams.set('categoryId', catId);
    } else {
      newParams.delete('categoryId');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (e) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sortBy', e.target.value);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      {/* Title & Filters bar */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '8px' }}>
          Explore Products
        </h1>
        <p style={{ color: 'var(--gray-500)', fontSize: '1rem' }}>
          Browse our entire catalog of curated items with live stock tracking.
        </p>
      </div>

      {/* Search and Sort Toolbar */}
      <div
        style={{
          background: 'white',
          padding: '18px 24px',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--gray-200)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', flex: '1', minWidth: '280px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by product name or keyword..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--gray-600)' }}>Sort by:</span>
          <select
            className="form-control"
            style={{ width: 'auto', padding: '10px 14px' }}
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="newest">Newest Additions</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          {(selectedCategory || searchQuery) && (
            <button onClick={clearFilters} className="btn btn-outline btn-sm">
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => handleCategoryChange('')}
          className={`btn btn-sm ${!selectedCategory ? 'btn-primary' : 'btn-outline'}`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id.toString())}
            className={`btn btn-sm ${selectedCategory === cat.id.toString() ? 'btn-primary' : 'btn-outline'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Listing Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--gray-500)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
          <p>Loading products from server...</p>
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            background: 'white',
            padding: '60px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gray-200)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--dark)', marginBottom: '8px' }}>
            No products match your criteria
          </h3>
          <p style={{ color: 'var(--gray-500)', marginBottom: '20px' }}>
            Try adjusting your search terms or clearing category filters.
          </p>
          <button onClick={clearFilters} className="btn btn-primary">
            Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '18px', color: 'var(--gray-500)', fontSize: '0.9rem' }}>
            Showing <strong>{products.length}</strong> available products
          </div>
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
