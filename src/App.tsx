import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import UseCases from './components/UseCases'
import DeveloperAPI from './components/DeveloperAPI'
import CTA from './components/CTA'
import './App.css'

const App: React.FC = () => {
  return (
    <div className="app">
      <Header />
      <div className="app-content">
        <Hero />
        <div className="section-bg-primary section-spacing">
          <HowItWorks />
        </div>
        <div className="section-bg-secondary section-spacing">
          <UseCases />
        </div>
        <div className="section-bg-tertiary section-spacing">
          <DeveloperAPI />
        </div>
        <div className="section-spacing">
          <CTA />
        </div>
      </div>
    </div>
  )
}

export default App 