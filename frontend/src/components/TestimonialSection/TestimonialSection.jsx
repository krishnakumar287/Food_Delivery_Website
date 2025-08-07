import React, { useState, useEffect } from 'react';
import './TestimonialSection.css';
import { useInView } from 'react-intersection-observer';

const testimonials = [
  {
    id: 1,
    name: "Emma Thompson",
    rating: 5,
    comment: "The food delivery service is absolutely incredible! The food always arrives hot and fresh, and the delivery is consistently on time. I can't imagine ordering from anywhere else now.",
    image: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    comment: "I've tried many food delivery services, but this one stands out for its exceptional quality and service. The app is so user-friendly, and the variety of restaurants is impressive!",
    image: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Sarah Johnson",
    rating: 4,
    comment: "Great selection of restaurants and super reliable delivery. The only reason I'm giving 4 stars instead of 5 is that I wish they had more vegan options, but otherwise perfect!",
    image: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const TestimonialSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      const interval = setInterval(() => {
        setActiveTestimonial(prev => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <section className="testimonial-section" ref={ref}>
      <div className="testimonial-container">
        <div className="testimonial-header">
          <h2>What Our <span className="accent-text">Customers</span> Say</h2>
          <p className="testimonial-subtitle">Don't just take our word for it, hear from our satisfied customers</p>
        </div>
        
        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className={`testimonial-card ${index === activeTestimonial ? 'active' : ''} ${inView ? 'in-view' : ''}`}
              style={{ '--delay': `${index * 0.2}s` }}
            >
              <div className="testimonial-image">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <div className="testimonial-content">
                <div className="testimonial-rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < testimonial.rating ? 'star filled' : 'star'}>★</span>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.comment}"</p>
                <p className="testimonial-name">{testimonial.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button 
              key={index} 
              className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
              onClick={() => setActiveTestimonial(index)}
              aria-label={`View testimonial ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
