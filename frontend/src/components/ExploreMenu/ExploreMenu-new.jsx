import React, { useRef, useEffect, useState } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  const menuListRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleMotionPreferenceChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleMotionPreferenceChange);
    return () => mediaQuery.removeEventListener('change', handleMotionPreferenceChange);
  }, []);
  
  // Add horizontal scroll functionality with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (menuListRef.current) {
        if (e.key === 'ArrowRight') {
          menuListRef.current.scrollLeft += 100;
        } else if (e.key === 'ArrowLeft') {
          menuListRef.current.scrollLeft -= 100;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle category selection
  const handleCategorySelect = (menuName) => {
    setCategory(prev => prev === menuName ? 'All' : menuName);
    
    // Add a subtle bounce animation to the selected item if motion is not reduced
    if (!prefersReducedMotion) {
      const selectedItem = document.querySelector(`.explore-menu-list-item[data-category="${menuName}"]`);
      if (selectedItem) {
        selectedItem.animate([
          { transform: 'translateY(-8px)' },
          { transform: 'translateY(-12px)' },
          { transform: 'translateY(-8px)' }
        ], {
          duration: 300,
          easing: 'ease-in-out'
        });
      }
    }
    
    // Optional: Add analytics tracking
    if (window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'menu_category',
        content_id: menuName
      });
    }
  };

  return (
    <section className='explore-menu' id='explore-menu'>
        <div className="explore-menu-header">
          <h2>Our <span className="accent-text">Categories</span></h2>
          <p className='explore-menu-text'>
            Select a category to browse our delicious offerings
          </p>
        </div>
        
        <div className="explore-menu-container">
          <button 
            className="scroll-button scroll-left" 
            onClick={() => menuListRef.current.scrollLeft -= 200}
            aria-label="Scroll menu categories left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="explore-menu-list" ref={menuListRef} role="tablist">
              <div 
                onClick={() => handleCategorySelect('All')} 
                className={`explore-menu-list-item ${category === 'All' ? 'active' : ''} ${hoveredItem === 'All' ? 'hovered' : ''}`}
                role="tab"
                aria-selected={category === 'All'}
                tabIndex={0}
                data-category="All"
                onMouseEnter={() => setHoveredItem('All')}
                onMouseLeave={() => setHoveredItem(null)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCategorySelect('All');
                    }
                }}
              >
                <div className="menu-icon-container">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="16"></line>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                  </svg>
                </div>
                <p>All</p>
              </div>
              
              {menu_list.map((item, index) => {
                  const isActive = category === item.menu_name;
                  const isHovered = hoveredItem === item.menu_name;
                  return (
                      <div 
                          onClick={() => handleCategorySelect(item.menu_name)} 
                          key={index} 
                          className={`explore-menu-list-item ${isActive ? 'active' : ''} ${isHovered ? 'hovered' : ''}`}
                          role="tab"
                          aria-selected={isActive}
                          tabIndex={0}
                          data-category={item.menu_name}
                          onMouseEnter={() => setHoveredItem(item.menu_name)}
                          onMouseLeave={() => setHoveredItem(null)}
                          onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleCategorySelect(item.menu_name);
                              }
                          }}
                      >
                          <div className="menu-image-container">
                              <img 
                                  className={isActive ? 'active' : ''}
                                  src={item.menu_image} 
                                  alt={`${item.menu_name} category`} 
                              />
                              {isActive && <div className="active-indicator"></div>}
                          </div>
                          <p>{item.menu_name}</p>
                      </div>
                  )
              })}
          </div>
          
          <button 
            className="scroll-button scroll-right" 
            onClick={() => menuListRef.current.scrollLeft += 200}
            aria-label="Scroll menu categories right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
    </section>
  )
}

export default ExploreMenu
