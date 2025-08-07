import React from 'react'
import './AppDownlaod.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download' id='app-download'>
        <div className="app-download-content">
          <h2>Get the <span className="accent-text">Mobile App</span></h2>
          <p>Download our app for a faster, more convenient experience</p>
          <div className="app-download-platforms">
              <img src={assets.play_store} alt="Download on Google Play" />
              <img src={assets.app_store} alt="Download on App Store" />
          </div>
        </div>
        <div className="app-download-image">
          <div className="phone-mockup"></div>
        </div>
    </div>
  )
}

export default AppDownload