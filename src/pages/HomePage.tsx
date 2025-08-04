import React from 'react'
import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import CTA from '../components/CTA'

const HomePage: React.FC = () => {
  return (
    <div className="app-content">
      <Hero />
      <div id="how-it-works" className="section-spacing">
        <HowItWorks />
      </div>
      <div id="docs" className="section-spacing">
        <CTA />
      </div>
    </div>
  )
}

export default HomePage 