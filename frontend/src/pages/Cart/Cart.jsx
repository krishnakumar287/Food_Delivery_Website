import React, { useContext } from 'react';
import './Cart.css';
import './cart-title.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems = {}, food_list = [], removeFromCart, addToCart, getTotalCartAmount, getTotalCartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const hasItems = food_list && food_list.length > 0 && Object.values(cartItems).some(qty => qty > 0);
  const itemCount = getTotalCartItems();
  
  // Function to verify and fix image URL if needed
  const getImageUrl = (image) => {
    if (!image) {
      return 'https://via.placeholder.com/100x100?text=Food';
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
    <div className='cart-page'>
      <div className='cart-container'>
        <div className='cart-header fade-in'>
          <h1 className="cart-title">
            Your Cart {itemCount > 0 && <span className="cart-item-count">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>}
          </h1>
          <p className="cart-subtitle">Review your items and proceed to checkout</p>
        </div>
        
        {!hasItems ? (
          <div className='empty-cart slide-up'>
            <div className='empty-cart-icon'>🛒</div>
            <h2 className='empty-cart-title'>Your cart is empty</h2>
            <p className='empty-cart-description'>Looks like you haven't added any items to your cart yet. Browse our menu and discover delicious meals!</p>
            <button className='start-shopping-btn' onClick={() => navigate('/')}>Start Shopping</button>
          </div>
        ) : (
          <div className='cart-content'>
            <div className='cart-items-section slide-up'>
              <div className='cart-items-header'>
                <div>Image</div>
                <div>Product</div>
                <div>Price</div>
                <div>Quantity</div>
                <div>Total</div>
                <div>Action</div>
              </div>
              
              <div className='cart-items-list'>
                {food_list.map((item) => (
                  cartItems[String(item._id)] > 0 ? (
                    <div key={item._id} className='cart-item'>
                      {/* Desktop Layout */}
                      <div className='cart-item-desktop'>
                        <img 
                          className='cart-item-image'
                          src={getImageUrl(item.image)} 
                          alt={item.name} 
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100x100?text=Food';
                          }}
                        />
                        <div className='cart-item-name'>{item.name}</div>
                        <div className='cart-item-price'>${item.price.toFixed(2)}</div>
                        
                        <div className='quantity-controls'>
                          <button 
                            className='quantity-btn'
                            onClick={() => removeFromCart(item._id)}
                          >-</button>
                          <span className='quantity-display'>{cartItems[String(item._id)]}</span>
                          <button 
                            className='quantity-btn'
                            onClick={() => addToCart(item._id)}
                          >+</button>
                        </div>
                        
                        <div className='cart-item-total'>${(item.price * cartItems[String(item._id)]).toFixed(2)}</div>
                        
                        <button 
                          className='remove-btn'
                          onClick={() => {
                            // Remove all of this item
                            for(let i=0; i<cartItems[String(item._id)]; i++) {
                              removeFromCart(item._id);
                            }
                          }}
                        >×</button>
                      </div>
                      
                      {/* Mobile Layout */}
                      <div className='cart-item-mobile'>
                        <div className='mobile-item-header'>
                          <img 
                            className='mobile-item-image'
                            src={getImageUrl(item.image)} 
                            alt={item.name} 
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100x100?text=Food';
                            }}
                          />
                          <div className='mobile-item-info'>
                            <div className='mobile-item-name'>{item.name}</div>
                            <div className='mobile-item-price'>${item.price.toFixed(2)}</div>
                          </div>
                          <button 
                            className='mobile-remove-btn'
                            onClick={() => {
                              // Remove all of this item
                              for(let i=0; i<cartItems[String(item._id)]; i++) {
                                removeFromCart(item._id);
                              }
                            }}
                          >×</button>
                        </div>
                        
                        <div className='mobile-item-footer'>
                          <div className='mobile-quantity-controls'>
                            <button 
                              className='quantity-btn'
                              onClick={() => removeFromCart(item._id)}
                            >-</button>
                            <span className='quantity-display'>{cartItems[String(item._id)]}</span>
                            <button 
                              className='quantity-btn'
                              onClick={() => addToCart(item._id)}
                            >+</button>
                          </div>
                          
                          <div className='mobile-total-section'>
                            <div className='mobile-total-label'>Total:</div>
                            <div className='mobile-total-amount'>${(item.price * cartItems[String(item._id)]).toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : null
                ))}
              </div>
            </div>
            
            <div className='cart-summary slide-up'>
              <div className='summary-card'>
                <h2 className='summary-title'>Order Summary</h2>
                
                <div className='summary-row'>
                  <span>Subtotal</span>
                  <span>${getTotalCartAmount().toFixed(2)}</span>
                </div>
                
                <hr className='summary-divider' />
                
                <div className='summary-row'>
                  <span>Delivery Fee</span>
                  <span>${getTotalCartAmount() === 0 ? '0.00' : '2.00'}</span>
                </div>
                
                <hr className='summary-divider' />
                
                <div className='summary-total'>
                  <span className='total-label'>Total</span>
                  <span className='total-amount'>${(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2).toFixed(2)}</span>
                </div>
                
                <button 
                  className='checkout-btn'
                  onClick={() => navigate('/order')}
                >PROCEED TO CHECKOUT</button>
                
                <div className='promo-section'>
                  <h3 className='promo-title'>Have a promo code?</h3>
                  <p className='promo-description'>Enter your code below to get a discount</p>
                  
                  <div className='promo-input-container'>
                    <input 
                      className='promo-input'
                      type='text' 
                      placeholder='Enter promo code' 
                    />
                    <button className='promo-btn'>Apply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;