import React, { useState, useEffect } from 'react';
import './TrackingPopup.css';

const TrackingPopup = ({ isOpen, onClose, order }) => {
  const [animationState, setAnimationState] = useState('closed');
  
  // Format time difference
  const getTimeDifference = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const now = new Date();
    const orderTime = new Date(timestamp);
    const diffMs = now - orderTime;
    
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 60) return `${minutes} min${minutes !== 1 ? 's' : ''} ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    
    const days = Math.floor(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  };

  // Format date and time
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };
  
  // Get tracking history or generate from current status
  const getTrackingHistory = () => {
    // If there's a tracking history on the order, use it
    if (order?.trackingHistory && order.trackingHistory.length > 0) {
      return order.trackingHistory;
    }
    
    // Otherwise, infer from the current status and timestamps
    const currentStatus = order?.status?.toLowerCase() || 'processing';
    
    return [
      {
        status: "Order Confirmed",
        timestamp: order?.createdAt,
        completed: true
      },
      {
        status: "Food Processing",
        timestamp: currentStatus !== "order confirmed" ? order?.updatedAt : null,
        completed: currentStatus !== "order confirmed"
      },
      {
        status: "Out for Delivery",
        timestamp: (currentStatus === "out for delivery" || currentStatus === "delivered") ? order?.updatedAt : null,
        completed: currentStatus === "out for delivery" || currentStatus === "delivered"
      },
      {
        status: "Delivered",
        timestamp: currentStatus === "delivered" ? order?.updatedAt : null,
        completed: currentStatus === "delivered"
      }
    ];
  };
  
  // Generate tracking stages for display
  const getStages = () => {
    const history = getTrackingHistory();
    const standardStages = [
      { id: 1, name: "Order Confirmed", standardStatus: ["order confirmed"] },
      { id: 2, name: "Food Processing", standardStatus: ["food processing"] },
      { id: 3, name: "Ready for Pickup", standardStatus: ["ready for pickup"] },
      { id: 4, name: "Out for Delivery", standardStatus: ["out for delivery"] },
      { id: 5, name: "Delivered", standardStatus: ["delivered"] }
    ];
    
    // Map each standard stage to its completion status and timestamp
    return standardStages.map(stage => {
      const matchingHistory = history.find(h => 
        stage.standardStatus.includes(h.status?.toLowerCase())
      );
      
      // Check if any previous stages are complete to determine if this is the current stage
      const isPreviousCompleted = stage.id === 1 || standardStages
        .filter(s => s.id < stage.id)
        .every(s => history.some(h => s.standardStatus.includes(h.status?.toLowerCase())));
      
      // Special handling for cancelled orders
      const isCancelled = history.some(h => h.status?.toLowerCase() === "cancelled");
      
      return {
        ...stage,
        completed: !!matchingHistory && !isCancelled,
        timestamp: matchingHistory ? 
          getTimeDifference(matchingHistory.timestamp) : 
          (isPreviousCompleted && !isCancelled ? "In Progress" : "Pending"),
        exact_time: matchingHistory ? formatDateTime(matchingHistory.timestamp) : ""
      };
    });
  };
  
  // Control animation states
  useEffect(() => {
    if (isOpen) {
      setAnimationState('opening');
      document.body.style.overflow = 'hidden';
      
      // After animation completes, set to fully open state
      const timer = setTimeout(() => setAnimationState('open'), 400);
      return () => clearTimeout(timer);
    } else {
      if (animationState !== 'closed') {
        setAnimationState('closing');
        
        // Reset after close animation completes
        const timer = setTimeout(() => {
          setAnimationState('closed');
          document.body.style.overflow = 'auto';
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, animationState]);
  
  // Only render if we're at least in opening state
  if (animationState === 'closed') return null;
  
  // Calculate progress percentage
  const calculateProgress = () => {
    const stages = getStages();
    const completedStages = stages.filter(stage => stage.completed).length;
    
    // If the order is cancelled, show special progress
    if (order?.status?.toLowerCase() === "cancelled") {
      return 100; // Full red progress bar for cancelled
    }
    
    return (completedStages / stages.length) * 100;
  };
  
  // Get the current status display text
  const getStatusDisplayText = () => {
    const status = order?.status?.toLowerCase();
    
    if (status === "cancelled") {
      return "Order Cancelled";
    } else if (status === "delivered") {
      return "Delivered Successfully";
    } else if (status === "out for delivery") {
      return "Out for Delivery";
    } else if (status === "ready for pickup") {
      return "Ready for Pickup";
    } else if (status === "food processing") {
      return "Food is Being Prepared";
    } else {
      return "Order Received";
    }
  };
  
  const isCancelled = order?.status?.toLowerCase() === "cancelled";
  
  return (
    <div 
      className={`tracking-popup ${animationState}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tracking-title"
    >
      <div 
        className={`tracking-popup-content ${animationState} ${isCancelled ? 'cancelled' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="tracking-close-btn" 
          onClick={onClose}
          aria-label="Close tracking popup"
        >
          &times;
        </button>
        
        <div className="tracking-header">
          <h2 id="tracking-title">Order Tracking</h2>
          <div className="tracking-order-id">Order #{order?._id?.substring(0, 8)}</div>
        </div>
        
        <div className={`tracking-status ${isCancelled ? 'cancelled' : ''}`}>
          <div className="tracking-progress-container">
            <div 
              className={`tracking-progress-bar ${isCancelled ? 'cancelled' : ''}`} 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
          <div className={`tracking-status-text ${isCancelled ? 'cancelled' : ''}`}>
            {getStatusDisplayText()}
          </div>
        </div>
        
        <div className="tracking-timeline">
          {getStages().map((stage) => (
            <div key={stage.id} className={`tracking-stage ${stage.completed ? 'completed' : ''} ${isCancelled ? 'cancelled' : ''}`}>
              <div className="tracking-stage-icon-container">
                <div className={`tracking-stage-icon ${isCancelled ? 'cancelled' : ''}`}>
                  {stage.completed && <span className="tracking-check">✓</span>}
                </div>
                {stage.id !== getStages().length && <div className={`tracking-stage-line ${isCancelled ? 'cancelled' : ''}`}></div>}
              </div>
              <div className="tracking-stage-content">
                <div className={`tracking-stage-name ${isCancelled ? 'cancelled' : ''}`}>{stage.name}</div>
                <div className="tracking-stage-time">
                  {stage.timestamp}
                  {stage.exact_time && (
                    <span className="tracking-exact-time">{stage.exact_time}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="tracking-footer">
          <div className="tracking-estimated-time">
            {!isCancelled && order?.status?.toLowerCase() !== "delivered" && (
              <>
                <span className="tracking-time-icon">⏱️</span> 
                <span>
                  {order?.status?.toLowerCase() === "out for delivery" 
                    ? "Estimated arrival: 10-15 minutes" 
                    : "Estimated delivery time: 30-45 minutes"}
                </span>
              </>
            )}
            {isCancelled && (
              <div className="tracking-cancelled-message">
                <span className="tracking-cancelled-icon">❌</span>
                <span>This order has been cancelled.</span>
              </div>
            )}
          </div>
          <button className="tracking-support-btn" onClick={(e) => e.preventDefault()}>
            Need Help?
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrackingPopup;
