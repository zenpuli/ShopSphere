import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useToast } from '../context/ToastContext';

const AdminDashboard = () => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('products');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State for Product Create / Edit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    featured: false,
    active: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodsRes, ordersRes, custsRes, catsRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/products?sortBy=newest'),
        api.get('/api/admin/orders'),
        api.get('/api/admin/customers'),
        api.get('/api/categories'),
      ]);

      setStats(statsRes.data?.data);
      setProducts(prodsRes.data?.data || []);
      setOrders(ordersRes.data?.data || []);
      setCustomers(custsRes.data?.data || []);
      setCategories(catsRes.data?.data || []);
    } catch (err) {
      showToast('Failed to load administrative dashboard data.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handle Order Status Update
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/api/admin/orders/${orderId}/status`, { status: newStatus });
      const updatedOrder = res.data?.data;
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));
      showToast(`Order #${updatedOrder.orderNumber} updated to ${newStatus}`, 'success');
      // Update stats
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data?.data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      stockQuantity: '',
      categoryId: categories[0]?.id || '',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      featured: false,
      active: true,
    });
    setShowProductModal(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stockQuantity: prod.stockQuantity,
      categoryId: prod.categoryId,
      imageUrl: prod.imageUrl,
      featured: prod.featured,
      active: prod.active,
    });
    setShowProductModal(true);
  };

  // Handle Submit Product Create / Edit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        stockQuantity: parseInt(productForm.stockQuantity, 10),
        categoryId: parseInt(productForm.categoryId, 10),
        imageUrl: productForm.imageUrl,
        featured: productForm.featured,
        active: productForm.active,
      };

      if (editingProduct) {
        await api.put(`/api/admin/products/${editingProduct.id}`, payload);
        showToast('Product updated successfully.', 'success');
      } else {
        await api.post('/api/admin/products', payload);
        showToast('New product created successfully.', 'success');
      }

      setShowProductModal(false);
      // Reload products
      const prodsRes = await api.get('/api/products?sortBy=newest');
      setProducts(prodsRes.data?.data || []);
      const statsRes = await api.get('/api/admin/stats');
      setStats(statsRes.data?.data);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle Deactivate Product
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      await api.delete(`/api/admin/products/${prodId}`);
      showToast('Product deactivated successfully.', 'info');
      const prodsRes = await api.get('/api/products?sortBy=newest');
      setProducts(prodsRes.data?.data || []);
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="container" style={{ padding: '40px 20px 80px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: '800', color: 'var(--dark)', marginBottom: '4px' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--gray-500)' }}>
            System overview, inventory controls, order tracking, and customer records.
          </p>
        </div>
        <button onClick={loadData} className="btn btn-outline btn-sm">
          🔄 Refresh
        </button>
      </div>

      {/* KPI Stats Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h5>Total Revenue</h5>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              ${Number(stats.totalRevenue).toFixed(2)}
            </div>
          </div>
          <div className="stat-card">
            <h5>Total Orders</h5>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h5>Pending Orders</h5>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              {stats.pendingOrders}
            </div>
          </div>
          <div className="stat-card">
            <h5>Delivered Orders</h5>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              {stats.deliveredOrders}
            </div>
          </div>
          <div className="stat-card">
            <h5>Active Products</h5>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h5>Registered Customers</h5>
            <div className="stat-value">{stats.totalCustomers}</div>
          </div>
        </div>
      )}

      {/* Tabs Header */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          📦 Product Catalog ({products.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📑 Customer Orders ({orders.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}
        >
          👥 Registered Users ({customers.length})
        </button>
      </div>

      {/* Tab 1: Products */}
      {activeTab === 'products' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Manage Inventory</h3>
            <button onClick={handleOpenCreateModal} className="btn btn-primary btn-sm">
              + Add New Product
            </button>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Featured</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', objectFit: 'cover' }}
                        />
                        <div>
                          <strong style={{ color: 'var(--dark)' }}>{p.name}</strong>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray-400)' }}>ID: #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>{p.categoryName}</td>
                    <td style={{ fontWeight: '700' }}>${Number(p.price).toFixed(2)}</td>
                    <td>
                      <span style={{ fontWeight: '700', color: p.stockQuantity < 10 ? 'var(--danger)' : 'inherit' }}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>{p.featured ? '⭐ Yes' : 'No'}</td>
                    <td>
                      <span className={`status-badge ${p.active ? 'status-DELIVERED' : 'status-PROCESSING'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="btn btn-outline btn-sm"
                        style={{ marginRight: '8px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                      >
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Customer Orders</h3>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Order Ref</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td>
                      <strong>{o.orderNumber}</strong>
                    </td>
                    <td>
                      <div>{o.recipientName}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{o.customerEmail}</div>
                    </td>
                    <td>{new Date(o.orderDate).toLocaleString()}</td>
                    <td style={{ fontWeight: '700' }}>${Number(o.totalAmount).toFixed(2)}</td>
                    <td>
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td>
                      <span className={`status-badge status-${o.status}`}>{o.status}</span>
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{ width: 'auto', padding: '6px 10px', fontSize: '0.85rem' }}
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                      >
                        <option value="PLACED">PLACED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customers */}
      {activeTab === 'customers' && (
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '20px' }}>Registered Customers</h3>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong>{c.fullName}</strong>
                    </td>
                    <td>{c.email}</td>
                    <td>{c.phone || 'N/A'}</td>
                    <td>{c.address || 'N/A'}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Create / Edit Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button onClick={() => setShowProductModal(false)} style={{ fontSize: '1.2rem' }}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct}>
              <div className="form-group">
                <label className="form-label">Product Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-control"
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    className="form-control"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    value={productForm.stockQuantity}
                    onChange={(e) => setProductForm({ ...productForm, stockQuantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input
                  type="url"
                  className="form-control"
                  value={productForm.imageUrl}
                  onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Product Description *</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '24px', margin: '16px 0 24px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                  />
                  Featured Product
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  <input
                    type="checkbox"
                    checked={productForm.active}
                    onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                  />
                  Active (Available for purchase)
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
