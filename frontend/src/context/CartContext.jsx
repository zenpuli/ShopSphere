import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalAmount: 0, validForCheckout: false });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], totalItems: 0, totalAmount: 0, validForCheckout: false });
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/api/cart');
      if (res.data?.data) {
        setCart(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      showToast('Please sign in to add items to your cart.', 'info');
      return false;
    }
    try {
      const res = await api.post('/api/cart/items', { productId, quantity });
      setCart(res.data.data);
      showToast('Added to cart!', 'success');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const res = await api.put(`/api/cart/items/${itemId}`, { quantity });
      setCart(res.data.data);
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const res = await api.delete(`/api/cart/items/${itemId}`);
      setCart(res.data.data);
      showToast('Item removed from cart.', 'info');
      return true;
    } catch (err) {
      showToast(err.message, 'error');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/api/cart');
      setCart({ items: [], totalItems: 0, totalAmount: 0, validForCheckout: false });
    } catch (err) {
      console.error('Error clearing cart:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.totalItems || 0,
        loading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
