import React, { useState, useContext } from 'react';
import './TopDishItem.css';
import { StoreContext } from '../context/StoreContext';

const TopDishItem = ({ id, name, description, price, image, rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const formatDescription = (text) => {
    if (text.length > 80) {
      return text.substring(0, 80) + '...';
    }
    return text;
  };

  return (
    <div 
      className={`top-dish-item-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="top-dish-rank">{rank}</div>
      
      <div className="top-dish-img-container">
        <img 
          src={`${url}/${image}`} 
          alt={name} 
          className="top-dish-image" 
        />
        
        <div className="top-dish-actions">
          <button className="quick-view-btn" onClick={openModal}>
            Quick View
          </button>
        </div>
        
        {cartItems[id] ? (
          <div className="top-dish-counter">
            <img 
              src="/assets/remove_icon_red.png" 
              alt="Remove" 
              onClick={() => removeFromCart(id)}
            />
            <p>{cartItems[id]}</p>
            <img 
              src="/assets/add_icon_green.png" 
              alt="Add" 
              onClick={() => addToCart(id)}
            />
          </div>
        ) : (
          <img 
            src="/assets/add_icon_white.png" 
            alt="Add" 
            className="add-icon"
            onClick={() => addToCart(id)}
          />
        )}
      </div>
      
      <div className="top-dish-info">
        <div className="top-dish-name-rating">
          <p>{name}</p>
        </div>
        <div className="top-dish-desc">{formatDescription(description)}</div>
        <div className="top-dish-price">${price.toFixed(2)}</div>
      </div>
      
      {showModal && (
        <div className="food-item-details-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <img src={`${url}/${image}`} alt={name} />
              <div className="modal-info">
                <h3>{name}</h3>
                <p className="modal-description">{description}</p>
                <p className="modal-price">${price.toFixed(2)}</p>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => {
                    addToCart(id);
                    closeModal();
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopDishItem;
