import React from 'react'
import { Menu } from 'lucide-react'
import '../styles/Header.css'

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img 
            src="/src/assets/symentic.png"
            alt="Symentic Logo" 
            className="header-logo-image"
          />
          <span className="header-logo-text">Symentic</span>
        </div>
        
        <nav className="header-nav">
          <a href="#how-it-works" className="header-nav-link">How it Works</a>
          <a href="#use-cases" className="header-nav-link">Use Cases</a>
          <a href="#developer-api" className="header-nav-link">Developer API</a>
          <a href="#docs" className="header-nav-link">Docs</a>
        </nav>
        
        <div className="header-actions">
          <button className="header-button-secondary">
            Sign In
          </button>
          <button className="header-button-primary">
            Join Waitlist
          </button>
        </div>
        
        <button className="header-mobile-menu">
          <Menu size={24} />
        </button>
      </div>
    </header>
  )
}

export default Header 