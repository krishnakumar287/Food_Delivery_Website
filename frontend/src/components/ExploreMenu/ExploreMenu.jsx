import React, { useRef, useEffect } from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({category, setCategory}) => {
  const menuListRef = useRef(null);
  
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
    
    // Optional: Add analytics tracking
    if (window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'menu_category',
        content_id: menuName
      });
    }
  };

  return (
    <div className='explore-menu' id='explore-menu'>
        <div className="explore-menu-header">
          <h1>Explore Our Menu</h1>
          <p className='explore-menu-text'>
            Discover our diverse selection of mouth-watering dishes, from savory classics to innovative culinary creations.
          </p>
        </div>
        
        <div className="explore-menu-container">
          <button 
            className="scroll-arrow scroll-left" 
            onClick={() => menuListRef.current.scrollLeft -= 200}
            aria-label="Scroll menu categories left"
          >
            &#10094;
          </button>
          
          <div className="explore-menu-list" ref={menuListRef} role="tablist">
              {menu_list.map((item, index) => {
                  const isActive = category === item.menu_name;
                  return (
                      <div 
                          onClick={() => handleCategorySelect(item.menu_name)} 
                          key={index} 
                          className={`explore-menu-list-item ${isActive ? 'active' : ''}`}
                          role="tab"
                          aria-selected={isActive}
                          tabIndex={0}
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
            className="scroll-arrow scroll-right" 
            onClick={() => menuListRef.current.scrollLeft += 200}
            aria-label="Scroll menu categories right"
          >
            &#10095;
          </button>
        </div>
        
        <div className="category-indicator">
          <p>Currently viewing: <span>{category}</span></p>
        </div>
        
        <hr/>
    </div>
  )
}

export default ExploreMenu