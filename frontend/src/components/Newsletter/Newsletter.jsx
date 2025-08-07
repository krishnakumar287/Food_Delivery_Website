import React, { useState } from 'react';
import './Newsletter.css';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      // Reset form after submission
      setEmail('');
    }, 1000);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <div className="newsletter-content">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get the latest deals, recipes and food trends delivered to your inbox</p>
          
          {isSubmitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>Thank you for subscribing! You'll receive our next newsletter soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  aria-label="Email address"
                />
                <button type="submit" aria-label="Subscribe">
                  Subscribe
                </button>
              </div>
              {error && <p className="error-message">{error}</p>}
              <p className="privacy-note">
                By subscribing, you agree to our Privacy Policy and consent to receive updates from our company.
              </p>
            </form>
          )}
        </div>
        
        <div className="newsletter-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
