import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import '../styles/Header.css'
import symenticLogo from '../assets/symentic.png'
import ComingSoonModal from './ComingSoonModal'

const Header: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false)

  const handleComingSoon = () => {
    setShowComingSoon(true)
  }

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If section doesn't exist, navigate to home page first
      window.location.href = `/#${sectionId}`
    }
  }

  return (
    <>
      <header className="header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <img 
              src={symenticLogo}
              alt="Symentic Logo" 
              className="header-logo-image"
            />
            <span className="header-logo-text">Symentic</span>
          </Link>
          
          <nav className="header-nav">
            <a 
              href="#how-it-works" 
              onClick={(e) => {
                e.preventDefault()
                handleSectionClick('how-it-works')
              }}
              className="header-nav-link"
            >
              How it Works
            </a>
            <Link to="/about-us" className="header-nav-link">About Us</Link>
            <a 
              href="#developer-api" 
              onClick={(e) => {
                e.preventDefault()
                handleSectionClick('developer-api')
              }}
              className="header-nav-link"
            >
              Developer API
            </a>
            <button 
              onClick={handleComingSoon}
              className="header-nav-link header-nav-button"
            >
              Docs
            </button>
          </nav>
          
          <div className="header-actions">
            <button 
              onClick={handleComingSoon}
              className="header-button-secondary"
            >
              Sign In
            </button>
            <button 
              onClick={handleComingSoon}
              className="header-button-primary"
            >
              Join Waitlist
            </button>
          </div>
          
          <button className="header-mobile-menu">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />
    </>
  )
}

export default Header 