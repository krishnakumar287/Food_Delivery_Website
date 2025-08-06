import React, { useState } from 'react'
import './Header.css'

const Header = () => {
  const [email, setEmail] = useState('')
  const [showNotification, setShowNotification] = useState(false)
  
  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      // In a real app, you would send this to your backend
      console.log('Subscribing email:', email)
      setShowNotification(true)
      setEmail('')
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 3000)
    }
  }
  
  const scrollToMenu = () => {
    const menuElement = document.getElementById('food-display')
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' })
    }
  }
  
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Delicious Food Delivered to Your Doorstep</h2>
            <p>Enjoy the best selection of local restaurants delivered fast and fresh. Order your favorites and discover new tastes right from the comfort of your home.</p>
            
            <div className="header-actions">
                <button className="primary-btn" onClick={scrollToMenu}>Explore Menu</button>
                
                <form className="header-subscribe" onSubmit={handleSubscribe}>
                    <input 
                        type="email" 
                        placeholder="Enter email for exclusive deals" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        aria-label="Email for promotions"
                    />
                    <button type="submit">Get Deals</button>
                </form>
            </div>
            
            {showNotification && (
                <div className="toast-notification success">
                    <p>Thanks for subscribing! Check your email for deals.</p>
                    <button onClick={() => setShowNotification(false)}>✕</button>
                </div>
            )}
        </div>
    </div>
  )
}

export default Header