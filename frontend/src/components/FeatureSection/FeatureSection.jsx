import React, { useState, useEffect, useRef } from 'react';
import './FeatureSection.css';

const FeatureSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const featureRefs = useRef([]);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
          
          // Animate cards sequentially
          const cards = document.querySelectorAll('.feature-card');
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, 150 * index);
          });
        }
      },
      { threshold: 0.2 }
    );
    
    const sectionElement = document.querySelector('.feature-section');
    if (sectionElement) {
      observer.observe(sectionElement);
    }
    
    return () => {
      if (sectionElement) {
        observer.unobserve(sectionElement);
      }
    };
  }, []);

  const handleMouseEnter = (index) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      ),
      title: "Lightning Fast Delivery",
      description: "Our optimized delivery network ensures your food arrives hot and fresh in 30 minutes or less.",
      stat: "30",
      unit: "min",
      highlight: "Guaranteed delivery or it's free"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
        </svg>
      ),
      title: "Customer Satisfaction",
      description: "Join our community of satisfied customers who love our diverse menu and exceptional service.",
      stat: "98",
      unit: "%",
      highlight: "Satisfaction guaranteed"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      ),
      title: "Best Value Pricing",
      description: "Enjoy premium quality food at competitive prices with exclusive deals and promotions.",
      stat: "20",
      unit: "%",
      desc: "off",
      highlight: "First order discount"
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
          <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
        </svg>
      ),
      title: "24/7 Customer Support",
      description: "Our dedicated team is always available to assist you with any questions or special requests.",
      stat: "24",
      unit: "/7",
      highlight: "Always here for you"
    }
  ];

  return (
    <section className={`feature-section ${isVisible ? 'visible' : ''}`} id="why-choose-us">
      <div className="feature-container">
        <div className="feature-header">
          <span className="section-tag">WHY CHOOSE US</span>
          <h2>Serving <span className="accent-text">Happiness</span> One Dish at a Time</h2>
          <p className="feature-subtitle">Experience exceptional food delivery with perks that make us the preferred choice of food lovers everywhere</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`feature-card ${activeIndex === index ? 'active' : ''}`}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              ref={el => featureRefs.current[index] = el}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              
              {feature.highlight && (
                <div className="feature-highlight">
                  <span className="highlight-dot"></span>
                  {feature.highlight}
                </div>
              )}
              
              <div className="feature-stat">
                <span className="stat-number">{feature.stat}</span>
                <span className="stat-unit">{feature.unit}</span>
                {feature.desc && <span className="stat-desc">{feature.desc}</span>}
              </div>
            </div>
          ))}
        </div>
        
        <div className="feature-cta">
          <button className="feature-button primary" onClick={() => document.getElementById('food-display').scrollIntoView({ behavior: 'smooth' })}>
            Order Now
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
          <button className="feature-button secondary" onClick={() => window.location.href = '/about'}>
            Learn More
          </button>
        </div>
        
        <div className="satisfaction-badge">
          <div className="badge-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <div className="badge-content">
            <p className="badge-title">100% Satisfaction Guarantee</p>
            <p className="badge-text">Not satisfied with your order? We'll make it right or refund your money.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
