import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import '../styles/Header.css'
import symenticLogo from '../assets/symentic.png'
import ComingSoonModal from './ComingSoonModal'
import WaitlistModal from './WaitlistModal'

const Header: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleComingSoon = () => {
    setShowComingSoon(true)
  }

  const handleWaitlist = () => {
    setShowWaitlist(true)
  }

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If section doesn't exist, navigate to home page first
      window.location.href = `/#${sectionId}`
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
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
          
          <nav className={`header-nav ${isMobileMenuOpen ? 'header-nav-mobile-open' : ''}`}>
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
            <Link to="/about-us" className="header-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <button 
              onClick={handleComingSoon}
              className="header-nav-link header-nav-button"
            >
              Docs
            </button>
          </nav>
          
          <div className={`header-actions ${isMobileMenuOpen ? 'header-actions-mobile-open' : ''}`}>
            <button 
              onClick={handleComingSoon}
              className="header-button-secondary"
            >
              Sign In
            </button>
            <button 
              onClick={handleWaitlist}
              className="header-button-primary"
            >
              Join Waitlist
            </button>
          </div>
          
          <button className="header-mobile-menu" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        source="header"
      />
    </>
  )
}

export default Header 