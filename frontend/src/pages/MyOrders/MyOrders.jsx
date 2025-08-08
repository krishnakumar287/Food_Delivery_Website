import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from './../../components/context/StoreContext';
import axios from 'axios';
import { assets } from './../../assets/assets';
import TrackingPopup from '../../components/TrackingPopup/TrackingPopup';

const MyOrders = () => {
  const {url, token} = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [pollingInterval, setPollingInterval] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(url+'/api/order/userorders',{},{headers:{token}});
      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Unable to fetch your orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if(token) {
      fetchOrders();
    }
    
    // Cleanup any polling interval when component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [token]);

  // Helper function to determine status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'delivered':
        return 'status-delivered';
      case 'in transit':
        return 'status-transit';
      case 'processing':
        return 'status-processing';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }
  
  // Format date from ISO string
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  }

  // Open tracking popup with selected order
  const openTrackingPopup = (order) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
    
    // Start polling for updates while popup is open (every 15 seconds)
    const interval = setInterval(async () => {
      if (order?._id) {
        try {
          const response = await axios.post(
            url + '/api/order/userorders',
            {},
            { headers: { token } }
          );
          
          if (response.data.success) {
            const updatedOrders = response.data.data;
            const updatedOrder = updatedOrders.find(o => o._id === order._id);
            
            // If order status has changed, update the selected order
            if (updatedOrder && updatedOrder.status !== order.status) {
              setSelectedOrder(updatedOrder);
              
              // Also update the entire orders list
              setData(updatedOrders);
            }
          }
        } catch (error) {
          console.error("Error polling for order updates:", error);
        }
      }
    }, 15000);
    
    setPollingInterval(interval);
  }

  // Close tracking popup
  const closeTrackingPopup = () => {
    setIsTrackingOpen(false);
    
    // Clear polling interval when popup is closed
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }

  return (
    <div className='my-orders-page'>
      <div className="orders-header">
        <div className="orders-title-section">
          <h1 className="my-orders-page-title">My Orders</h1>
          <p className="orders-subtitle">Track and manage your orders</p>
        </div>
        <div className="orders-stats">
          <div className="order-stat">
            <span className="stat-value">{data.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="order-stat">
            <span className="stat-value">{data.filter(order => order.status.toLowerCase() === 'delivered').length}</span>
            <span className="stat-label">Delivered</span>
          </div>
          <div className="order-stat">
            <span className="stat-value">{data.filter(order => order.status.toLowerCase() !== 'delivered' && order.status.toLowerCase() !== 'cancelled').length}</span>
            <span className="stat-label">Active</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your orders...</p>
        </div>
      ) : error ? (
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button className="retry-button" onClick={fetchOrders}>Try Again</button>
        </div>
      ) : data.length === 0 ? (
        <div className="empty-orders">
          <img src={assets.parcel_icon} alt="No orders" className="empty-icon" />
          <h3>No orders yet!</h3>
          <p>Your order history will appear here</p>
        </div>
      ) : (
        <div className="my-orders-page-container">
          {data.map((order, index) => {
            const orderDate = formatDate(order.createdAt || new Date());
            return (
              <div key={index} className="my-orders-page-order">
                <div className="order-top">
                  <div className="order-header">
                    <div className="order-icon-wrapper">
                      <img src={assets.parcel_icon} alt="" className="my-orders-page-order-icon" />
                    </div>
                    <div className="order-details">
                      <div className="order-id">Order #{order._id?.substring(0, 8) || index}</div>
                      <div className="order-date">{orderDate}</div>
                    </div>
                  </div>
                  <div className={`order-status ${getStatusColor(order.status)}`}>
                    <span className="status-dot"></span>
                    <span className="status-text">{order.status}</span>
                  </div>
                </div>
                
                <div className="order-items-container">
                  <p className="my-orders-page-order-items">
                    {order.items.map((item, index) => {
                      if(index === order.items.length-1) {
                        return item.name + " × " + item.quantity;
                      } else {
                        return item.name + " × " + item.quantity + ", ";
                      }
                    })}
                  </p>
                </div>
                
                <div className="order-footer">
                  <div className="order-info">
                    <p className="my-orders-page-order-amount">${order.amount?.toFixed(2)}</p>
                    <p className="my-orders-page-order-count">{order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}</p>
                  </div>
                  <button 
                    className="my-orders-page-track-button"
                    onClick={() => openTrackingPopup(order)}
                  >
                    <i className="track-icon"></i>Track Order
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tracking Popup */}
      {isTrackingOpen && selectedOrder && (
        <TrackingPopup 
          isOpen={isTrackingOpen}
          onClose={closeTrackingPopup}
          order={selectedOrder}
        />
      )}
    </div>
  )
}

export default MyOrders;

