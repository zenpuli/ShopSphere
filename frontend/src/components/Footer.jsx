import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">ShopSphere</div>
            <p style={{ maxWidth: '320px', lineHeight: '1.6', fontSize: '0.9rem' }}>
              Next-generation e-commerce platform built with Spring Boot 3, Java 22, React, and MySQL. High reliability, server-enforced security, and persistent database carts.
            </p>
          </div>

          <div className="footer-col">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Products</Link></li>
              <li><Link to="/products?categoryId=1">Electronics</Link></li>
              <li><Link to="/products?categoryId=2">Audio & Wearables</Link></li>
              <li><Link to="/products?categoryId=3">Fashion & Lifestyle</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Customer</h4>
            <ul>
              <li><Link to="/cart">View Cart</Link></li>
              <li><Link to="/orders">Order History</Link></li>
              <li><Link to="/login">Account Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Technology</h4>
            <ul>
              <li>Java 22 & Spring Boot 3</li>
              <li>Spring Security & BCrypt</li>
              <li>React 18 & Vite</li>
              <li>MySQL 8 Database</li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} ShopSphere Inc. All rights reserved. Built for production reliability.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
