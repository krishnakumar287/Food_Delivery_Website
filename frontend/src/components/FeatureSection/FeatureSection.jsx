import React from 'react';
import './FeatureSection.css';

const FeatureSection = () => {
  return (
    <section className="feature-section">
      <div className="feature-container">
        <div className="feature-header">
          <h2>Why Choose <span className="accent-text">Us</span></h2>
          <p className="feature-subtitle">Experience the best food delivery service with premium features</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3>Free Delivery</h3>
            <p>Free delivery on all orders over $25. No hidden fees, just great food delivered to your door.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <h3>Fresh Ingredients</h3>
            <p>We use only the freshest ingredients sourced from local producers for exceptional quality.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Fast Service</h3>
            <p>Our dedicated delivery team ensures your food arrives hot and fresh in record time.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
