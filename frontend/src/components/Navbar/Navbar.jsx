import React, { useContext, useState, useEffect, useRef } from 'react'
import './Navbar.css'
import { assets } from './../../assets/assets';
import {Link, useNavigate, useLocation} from 'react-router-dom'
import { StoreContext } from './../context/StoreContext';

const Navbar = ({setShowLogin}) => {
  const [menu, setMenu] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  
  const profileDropdownRef = useRef(null);
  
  const {getTotalCartAmount, getTotalCartItems, token, setToken} = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Handle scroll event for sticky navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Function to handle smooth scrolling to hash links
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Set active menu based on current route
  useEffect(() => {
    // Handle different route conditions
    if (location.hash === '#app-download') {
      setMenu('mobile-app');
    } else if (location.hash === '#explore-menu') {
      setMenu('menu');
    } else if (location.hash === '#footer') {
      setMenu('contact-us');
    } else if (location.pathname === '/') {
      // Only set home as active when there's no hash
      setMenu('home');
    }
  }, [location.pathname, location.hash]);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setProfileDropdownOpen(false);
    navigate("/");
  }
  
  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, implement search functionality here
    console.log('Searching for:', searchQuery);
    setSearchActive(false);
    setSearchQuery('');
  }
  
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-left">
          <button 
            className={`mobile-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            aria-controls="navbar-menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          
          <Link to='/' className="logo-container">
            <img src={assets.logo} alt="Food Delivery Logo" className='logo' />
          </Link>
        </div>
        
        <ul id="navbar-menu" className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`} role="menu">
          <li>
            <Link 
              to='/' 
              onClick={() => {
                // Set the menu to home without preventing default navigation
                setMenu('home');
                setMobileMenuOpen(false);
                // If needed, scroll to top of page
                window.scrollTo(0, 0);
              }} 
              className={menu === 'home' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li>
            <a 
              href='#explore-menu' 
              onClick={(e) => {
                e.preventDefault();
                setMenu('menu');
                setMobileMenuOpen(false);
                // Get the section ID without the # symbol
                const sectionId = 'explore-menu';
                scrollToSection(sectionId);
                // Update URL with hash for bookmarking without page reload
                window.history.pushState(null, '', `#${sectionId}`);
              }} 
              className={menu === 'menu' ? 'active' : ''}
            >
              Menu
            </a>
          </li>
          <li>
            <a 
              href='#app-download' 
              onClick={(e) => {
                e.preventDefault();
                setMenu('mobile-app');
                setMobileMenuOpen(false);
                // Get the section ID without the # symbol
                const sectionId = 'app-download';
                scrollToSection(sectionId);
                // Update URL with hash for bookmarking without page reload
                window.history.pushState(null, '', `#${sectionId}`);
              }} 
              className={menu === 'mobile-app' ? 'active' : ''}
            >
              Mobile App
            </a>
          </li>
          <li>
            <a 
              href='#footer' 
              onClick={(e) => {
                e.preventDefault();
                setMenu('contact-us');
                setMobileMenuOpen(false);
                // Get the section ID without the # symbol
                const sectionId = 'footer';
                scrollToSection(sectionId);
                // Update URL with hash for bookmarking without page reload
                window.history.pushState(null, '', `#${sectionId}`);
              }} 
              className={menu === 'contact-us' ? 'active' : ''}
            >
              Contact Us
            </a>
          </li>
          
          {/* Mobile-only menu items */}
          <div className="mobile-menu-extras">
            {!token ? 
              <button 
                className="mobile-signin-btn" 
                onClick={() => {
                  setShowLogin(true);
                  setMobileMenuOpen(false);
                }}
              >
                Sign In
              </button>
            : 
              <>
                <li onClick={() => {
                  navigate('/myorders');
                  setMobileMenuOpen(false);
                }}>
                  <img src={assets.bag_icon} alt="Orders" />
                  <p>My Orders</p>
                </li>
                <li onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}>
                  <img src={assets.logout_icon} alt="Logout" />
                  <p>Logout</p>
                </li>
              </>
            }
          </div>
        </ul>
        
        <div className="navbar-right">
          <div className={`search-container ${searchActive ? 'active' : ''}`}>
            <button 
              className="search-icon-btn" 
              onClick={() => setSearchActive(!searchActive)}
              aria-label="Search"
            >
              <img src={assets.search_icon} alt="Search" />
            </button>
            
            {searchActive && (
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" aria-label="Submit search">
                  <img src={assets.search_icon} alt="Search" />
                </button>
              </form>
            )}
          </div>
          
          <div className="cart-icon-container">
            <Link 
              to='/cart' 
              className={`cart-icon ${getTotalCartItems() > 0 ? 'has-items' : ''}`}
            >
              <img src={assets.basket_icon} alt="Cart" />
              {getTotalCartItems() > 0 && (
                <span className="cart-count">{getTotalCartItems()}</span>
              )}
            </Link>
          </div>
          
          {!token ? 
            <button 
              className="signin-btn" 
              onClick={() => setShowLogin(true)}
            >
              Sign In
            </button>
          : 
            <div 
              className={`navbar-profile ${profileDropdownOpen ? 'active' : ''}`}
              ref={profileDropdownRef}
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setProfileDropdownOpen(!profileDropdownOpen);
                }
              }}
              tabIndex="0"
              aria-haspopup="true"
              aria-expanded={profileDropdownOpen}
            >
              <img src={assets.profile_icon} alt="Profile" />
              <div className={`nav-profile-dropdown ${profileDropdownOpen ? 'active' : ''}`}>
                <div className="dropdown-item dropdown-item-animation" onClick={() => {
                  navigate('/myorders');
                  setProfileDropdownOpen(false);
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <p>My Orders</p>
                </div>
                
                <div className="dropdown-divider"></div>
                <div className="dropdown-item dropdown-item-animation logout-item" onClick={logout}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  <p>Logout</p>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      
      {/* Backdrop for mobile menu */}
      <div 
        className={`menu-backdrop ${mobileMenuOpen ? 'active' : ''}`} 
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      ></div>
    </nav>
  );
}

export default Navbar;
