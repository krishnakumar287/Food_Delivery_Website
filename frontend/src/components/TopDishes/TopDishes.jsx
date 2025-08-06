import React, { useContext, useState, useEffect } from 'react';
import './TopDishes.css';
import { StoreContext } from '../context/StoreContext';
import TopDishItem from './TopDishItem';
import { useInView } from 'react-intersection-observer';

const TopDishes = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [topDishes, setTopDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryChanging, setCategoryChanging] = useState(false);
  
  // Use Intersection Observer for scroll animations
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  // Effect to handle category changes
  useEffect(() => {
    if (food_list.length > 0) {
      // Show brief loading state when category changes
      setCategoryChanging(true);
      
      // Simulate a short delay to show loading state
      setTimeout(() => {
        // Filter dishes based on selected category
        const filteredList = category === 'All' 
          ? [...food_list] 
          : food_list.filter(item => item.category === category);
        
        // Sort by a random value to simulate "popular" dishes for this demo
        // In production, you'd sort by actual ratings or order counts
        const sorted = [...filteredList]
          .sort(() => 0.5 - Math.random())
          .slice(0, 6); // Show top 6 dishes
        
        setTopDishes(sorted);
        setIsLoading(false);
        setCategoryChanging(false);
      }, 300);
    }
  }, [food_list, category]); // Added category as a dependency

  return (
    <section className="top-dishes-section" ref={ref}>
      <div className={`top-dishes-container ${inView ? 'animate-in' : ''}`}>
        <div className="top-dishes-header">
          <h2>
            <span className="accent-text">Top {category !== 'All' ? category : 'Dishes'}</span> 
            {category === 'All' ? ' Near You' : ''}
          </h2>
          <p className="top-dishes-subtitle">
            {category === 'All' 
              ? 'Discover the most loved dishes in your neighborhood, fresh and ready to be delivered'
              : `Explore our popular ${category.toLowerCase()} selection, handpicked for your enjoyment`}
          </p>
        </div>
        
        {(isLoading || categoryChanging) ? (
          <div className="top-dishes-skeleton">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="dish-skeleton-card">
                <div className="skeleton-img"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))}
          </div>
        ) : topDishes.length > 0 ? (
          <div className="top-dishes-grid">
            {topDishes.map((item, index) => (
              <div 
                key={item._id} 
                className="top-dish-wrapper"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TopDishItem 
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  rank={index + 1}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-dishes-message">
            <p>No top dishes available in this category.</p>
            <p>Try selecting a different category or check back later!</p>
          </div>
        )}
        
        <div className="view-all-container">
          <button className="view-all-btn">
            View All {category !== 'All' ? category : 'Popular Dishes'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TopDishes;
