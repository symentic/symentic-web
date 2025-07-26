import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import Dashboard from './pages/dashboard/Dashboard'
import { ThemeProvider } from './contexts/ThemeContext'
import './App.css'

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/internal/dashboard" element={<Dashboard />} />
          <Route path="/*" element={
            <div className="app">
              <Header />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about-us" element={<AboutUsPage />} />
              </Routes>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 