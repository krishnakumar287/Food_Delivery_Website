import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../components/context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const {getTotalCartAmount, token, food_list, cartItems, url} = useContext(StoreContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);

  const [data, setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"USA",
    phone:""
  });

  const validateForm = () => {
    const errors = {};
    
    if (!data.firstName.trim()) errors.firstName = "First name is required";
    if (!data.lastName.trim()) errors.lastName = "Last name is required";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(data.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    if (!data.street.trim()) errors.street = "Street address is required";
    if (!data.city.trim()) errors.city = "City is required";
    if (!data.state.trim()) errors.state = "State is required";
    
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!data.zipcode.trim()) {
      errors.zipcode = "Zip code is required";
    } else if (!zipRegex.test(data.zipcode)) {
      errors.zipcode = "Please enter a valid zip code (e.g., 12345 or 12345-6789)";
    }
    
    if (!data.country.trim()) errors.country = "Country is required";
    
    const phoneRegex = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!phoneRegex.test(data.phone)) {
      errors.phone = "Please enter a valid phone number (e.g., 123-456-7890)";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data =>({...data,[name]:value}));
    
    // Clear the error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ""});
    }
  }

  const placeOrder = async (event) =>{
    event.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(formErrors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let orderItems = [];
      food_list.map((item, index)=>{
        if(cartItems[item._id]>0){
          let itemInfo = {...item}; // Create a copy to avoid mutating the original
          itemInfo["quantity"] = cartItems[item._id];
          orderItems.push(itemInfo);
        }
        return null;
      });
      
      let orderData = {
        address: data,
        items: orderItems,
        amount: getTotalCartAmount() + 2,
      };

      const response = await axios.post(url+'/api/order/place', orderData, {headers:{token}});
      
      if(response.data.success){
        const {session_url} = response.data;
        window.location.replace(session_url);
      } else {
        alert('There was an error processing your order. Please try again.');
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const navigate = useNavigate();

  // Get Order Items for Summary
  const getOrderItems = () => {
    return food_list.filter(item => cartItems[item._id] > 0);
  };

  // Toggle mobile order summary
  const toggleOrderSummary = () => {
    setOrderSummaryOpen(!orderSummaryOpen);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    // Strip all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format the phone number
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  // Handle phone input with formatting
  const handlePhoneChange = (e) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value);
    setData({...data, phone: formattedPhoneNumber});
    
    if (formErrors.phone) {
      setFormErrors({...formErrors, phone: ""});
    }
  };

  useEffect(()=>{
    if(!token){
      navigate('/cart');
    } else if(getTotalCartAmount()===0){
      navigate('/cart');
    }
    
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  },[token, navigate, getTotalCartAmount]);

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <div className="place-order-header">
          <div className="header-content">
            <h1 className="title">Checkout</h1>
            <div className="checkout-badge">Secure Payment</div>
          </div>
          <p className="place-order-subtitle">
            Please fill in your delivery details to complete your order
          </p>
          <div className="security-note">
            <span className="security-icon">🔒</span>
            Your information is encrypted and secure
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="form-step">
          <div className="step completed">
            <div className="step-number">1</div>
            <div className="step-label">Cart</div>
          </div>
          <div className="step active">
            <div className="step-number">2</div>
            <div className="step-label">Delivery</div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-label">Payment</div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">👤</span> 
            Full Name <span className="form-required">*</span>
          </label>
          <div className="multi-fields">
            <div className="field-container">
              <div className="input-wrapper">
                <input 
                  required 
                  name='firstName' 
                  onChange={onChangeHandler} 
                  value={data.firstName} 
                  type="text" 
                  placeholder='First Name'
                  className={formErrors.firstName ? 'error-input' : ''}
                />
                <span className="field-icon">
                  {data.firstName ? '✓' : ''}
                </span>
              </div>
              {formErrors.firstName && <div className="form-hint error">{formErrors.firstName}</div>}
            </div>
            <div className="field-container">
              <div className="input-wrapper">
                <input 
                  required 
                  name='lastName' 
                  onChange={onChangeHandler} 
                  value={data.lastName} 
                  type="text" 
                  placeholder='Last Name'
                  className={formErrors.lastName ? 'error-input' : ''}
                />
                <span className="field-icon">
                  {data.lastName ? '✓' : ''}
                </span>
              </div>
              {formErrors.lastName && <div className="form-hint error">{formErrors.lastName}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">
            <span className="label-icon">📱</span>
            Contact Information <span className="form-required">*</span>
          </label>
          <div className="input-wrapper">
            <input 
              required 
              name='email' 
              onChange={onChangeHandler} 
              value={data.email} 
              type="email" 
              placeholder='Email address'
              className={formErrors.email ? 'error-input' : ''}
            />
            <span className="field-icon email-icon">
              {data.email ? (formErrors.email ? '❌' : '✓') : '@'}
            </span>
          </div>
          {formErrors.email && <div className="form-hint error">{formErrors.email}</div>}
          
          <div className="input-wrapper">
            <input 
              required 
              name='phone' 
              onChange={handlePhoneChange} 
              value={data.phone} 
              type="tel" 
              placeholder='Phone number'
              className={formErrors.phone ? 'error-input' : ''}
            />
            <span className="field-icon phone-icon">
              {data.phone ? (formErrors.phone ? '❌' : '✓') : '☎️'}
            </span>
          </div>
          {formErrors.phone && <div className="form-hint error">{formErrors.phone}</div>}
          <div className="form-hint info">
            <span className="info-icon">ℹ️</span>
            We'll use this to contact you about your order if needed
          </div>
        </div>
        
        <div className="form-group address-form">
          <label className="form-label">
            <span className="label-icon">🏠</span>
            Delivery Address <span className="form-required">*</span>
          </label>
          
          <div className="address-card">
            <div className="input-wrapper">
              <input 
                required 
                name='street' 
                onChange={onChangeHandler} 
                value={data.street} 
                type="text" 
                placeholder='Street address'
                className={formErrors.street ? 'error-input' : ''}
              />
              <span className="field-icon">
                {data.street ? '✓' : '📍'}
              </span>
            </div>
            {formErrors.street && <div className="form-hint error">{formErrors.street}</div>}
            
            <div className="address-grid">
              <div className="field-container">
                <div className="input-wrapper">
                  <input 
                    required 
                    name='city' 
                    onChange={onChangeHandler} 
                    value={data.city} 
                    type="text" 
                    placeholder='City'
                    className={formErrors.city ? 'error-input' : ''}
                  />
                  <span className="field-icon">
                    {data.city ? '✓' : '🏙️'}
                  </span>
                </div>
                {formErrors.city && <div className="form-hint error">{formErrors.city}</div>}
              </div>
              
              <div className="field-container">
                <div className="input-wrapper">
                  <input 
                    required 
                    name='state' 
                    onChange={onChangeHandler} 
                    value={data.state} 
                    type="text" 
                    placeholder='State'
                    className={formErrors.state ? 'error-input' : ''}
                  />
                  <span className="field-icon">
                    {data.state ? '✓' : '🗺️'}
                  </span>
                </div>
                {formErrors.state && <div className="form-hint error">{formErrors.state}</div>}
              </div>
            </div>
            
            <div className="address-grid">
              <div className="field-container">
                <div className="input-wrapper">
                  <input 
                    required 
                    name='zipcode' 
                    onChange={onChangeHandler} 
                    value={data.zipcode} 
                    type="text" 
                    placeholder='Zip code'
                    className={formErrors.zipcode ? 'error-input' : ''}
                  />
                  <span className="field-icon">
                    {data.zipcode ? '✓' : '#️⃣'}
                  </span>
                </div>
                {formErrors.zipcode && <div className="form-hint error">{formErrors.zipcode}</div>}
              </div>
              
              <div className="field-container">
                <div className="input-wrapper">
                  <select
                    required 
                    name='country' 
                    onChange={onChangeHandler} 
                    value={data.country}
                    className={formErrors.country ? 'error-input' : ''}
                  >
                    <option value="">Select Country</option>
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="Mexico">Mexico</option>
                  </select>
                  <span className="field-icon">
                    {data.country ? '✓' : '🌎'}
                  </span>
                </div>
                {formErrors.country && <div className="form-hint error">{formErrors.country}</div>}
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Order Summary Toggle */}
        <div className="mobile-summary-toggle" onClick={toggleOrderSummary}>
          {orderSummaryOpen ? 'Hide Order Summary' : 'Show Order Summary'} 
          (${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2})
        </div>
      </div>

      <div className="place-order-right">
        <div className={`order-summary ${orderSummaryOpen ? 'open' : ''}`}>
          <h2 className="summary-title">Order Summary</h2>
          
          <div className="order-items">
            {getOrderItems().map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-image-container">
                  <img 
                    className="item-image" 
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/50x50?text=Food';
                    }}
                  />
                  <div className="item-quantity">{cartItems[item._id]}</div>
                </div>
                <div className="item-details">
                  <div className="item-name">{item.name}</div>
                  <div className="item-price">${item.price.toFixed(2)} × {cartItems[item._id]}</div>
                </div>
                <div className="item-total">${(item.price * cartItems[item._id]).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="summary-item">
            <span>Subtotal</span>
            <span>${getTotalCartAmount().toFixed(2)}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-item">
            <span>Delivery Fee</span>
            <span>${getTotalCartAmount() === 0 ? '0.00' : '2.00'}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-total">
            <span className="summary-total-label">Total</span>
            <span className="summary-total-value">${(getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2).toFixed(2)}</span>
          </div>
          
          <div className="payment-security">
            <div className="payment-icons">
              <span className="payment-icon">💳</span>
              <span className="payment-icon">🔒</span>
            </div>
            <div className="payment-text">Secure Payment</div>
          </div>
          
          <button 
            type='submit'
            className="place-order-button"
            disabled={isSubmitting}
          >
            <span className="button-icon">{isSubmitting ? '⏳' : '🔒'}</span>
            <span className="button-text">{isSubmitting ? 'Processing...' : 'PROCEED TO PAYMENT'}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
export default PlaceOrder;

