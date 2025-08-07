import React, { useContext } from 'react';
import './Cart.css';
import { StoreContext } from '../../components/context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems = {}, food_list = [], removeFromCart, getTotalCartAmount, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const hasItems = food_list && food_list.length > 0 && Object.values(cartItems).some(qty => qty > 0);
  
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
    <div className='cart'>
      {!hasItems ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#888', fontSize: '1.2rem' }}>
          Your cart is empty. Add some items!
        </div>
      ) : (
        <>
          <div className='cart-items'>
            <div className='cart-items-title'>
              <p>Items</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <br />
            <hr />
            {food_list.map((item) => (
              cartItems[String(item._id)] > 0 ? (
                <div key={item._id}>
                  <div className='cart-items-title cart-items-item'>
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x100?text=Food';
                      }}
                    />
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                    <p>{cartItems[String(item._id)]}</p>
                    <p>${item.price * cartItems[String(item._id)]}</p>
                    <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                  </div>
                  <hr />
                </div>
              ) : null
            ))}
          </div>
          <div className='cart-bottom'>
            <div className='cart-total'>
              <h2>Cart Total</h2>
              <div>
                <div className='cart-total-detail'>
                  <p>Subtotal</p>
                  <p>${getTotalCartAmount()}</p>
                </div>
                <hr />
                <div className='cart-total-detail'>
                  <p>Delivery Fee</p>
                  <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
                </div>
                <hr />
                <div className='cart-total-detail'>
                  <b>Total</b>
                  <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                </div>
              </div>
              <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
            </div>
            <div className='cart-promocode'>
              <div>
                <p>If you have a promo code, enter it here</p>
                <div className='cart-promocode-input'>
                  <input type='text' placeholder='Promo Code' />
                  <button>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;