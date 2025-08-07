import React, { useState, useContext } from 'react';
import './TopDishItem.css';
import { StoreContext } from '../context/StoreContext';
import { assets } from '../../assets/assets';

const TopDishItem = ({ id, name, description, price, image, rank }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  // ✅ Return early if id is missing (prevents runtime errors)
  if (!id) return null;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const openModal = () => {
    setShowModal(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setShowModal(false);
    document.body.style.overflow = 'auto';
  };

  const formatDescription = (text) => {
    if (!text) return '';
    return text.length > 80 ? text.substring(0, 80) + '...' : text;
  };
  
  // Function to verify and fix image URL if needed
  const getImageUrl = () => {
    if (!image) {
      return 'https://via.placeholder.com/300x200?text=Food+Image';
    }
    
    // If it's already a full URL (includes http or https), use it directly
    if (image.startsWith('http')) {
      return image;
    }
    
    // For relative paths, make sure they go to the uploads folder
    if (image.includes('/uploads/')) {
      return image;
    } else {
      return `${url}/uploads/${image}`;
    }
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
          src={getImageUrl()} 
          alt={name} 
          className="top-dish-image" 
          onLoad={() => console.log(`Image loaded successfully: ${name}`)}
          onError={(e) => {
            console.error("Image failed to load:", image);
            e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
          }}
        />

        <div className="top-dish-actions">
          <button className="quick-view-btn" onClick={openModal}>
            Quick View
          </button>
        </div>

        {cartItems?.[id] ? (
          <div className="top-dish-counter">
            <img 
              src={assets.remove_icon_red} 
              alt="Remove" 
              onClick={(e) => {
                e.stopPropagation();
                removeFromCart(id);
              }}
            />
            <p>{cartItems[id]}</p>
            <img 
              src={assets.add_icon_green} 
              alt="Add" 
              onClick={(e) => {
                e.stopPropagation();
                addToCart(id);
              }}
            />
          </div>
        ) : (
          <img 
            src={assets.add_icon_white} 
            alt="Add" 
            className="add-icon"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(id);
            }}
          />
        )}
      </div>

      <div className="top-dish-info">
        <div className="top-dish-name-rating">
          <p>{name}</p>
        </div>
        <div className="top-dish-desc">{formatDescription(description)}</div>
        <div className="top-dish-price">${price?.toFixed(2)}</div>
      </div>

      {showModal && (
        <div className="food-item-details-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={closeModal}>&times;</button>
            <div className="modal-body">
              <img 
                src={getImageUrl()} 
                alt={name} 
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/500x300?text=Food+Image';
                }}
              />
              <div className="modal-info">
                <h3>{name}</h3>
                <p className="modal-description">{description}</p>
                <p className="modal-price">${price?.toFixed(2)}</p>
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
