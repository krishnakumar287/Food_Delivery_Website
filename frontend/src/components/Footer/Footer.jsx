import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-column about">
          <img src={assets.logo} alt="Company Logo" className="footer-logo" />
          <p className="footer-text">Delivering freshness and taste straight to your door.</p>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><img src={assets.facebook_icon} alt="Facebook" /></a>
            <a href="#" aria-label="Twitter"><img src={assets.twitter_icon} alt="Twitter" /></a>
            <a href="#" aria-label="LinkedIn"><img src={assets.linkedin_icon} alt="LinkedIn" /></a>
          </div>
        </div>

        <div className="footer-column links">
          <h4>Company</h4>
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#about-us">About Us</a></li>
            <li><a href="#delivery">Delivery</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-column links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#support">Support</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#careers">Careers</a></li>
          </ul>
        </div>

        <div className="footer-column contact-newsletter">
          <h4>Get in Touch</h4>
          <ul>
            <li><a href="tel:+94765489545">+94 765 489 545</a></li>
            <li><a href="mailto:dulanjalisemarantha93@gmail.com">dulanjalisemarantha93@gmail.com</a></li>
          </ul>
          <div className="newsletter">
            <h4>Newsletter Signup</h4>
            <form>
              <input type="email" placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="payment-icons">
          <img src={assets.visa_icon} alt="Visa" />
          <img src={assets.mastercard_icon} alt="Mastercard" />
          <img src={assets.paypal_icon} alt="PayPal" />
        </div>
        <p className="copyright">
          © {currentYear} Dulanjali - All Rights Reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer