import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import AboutUsPage from './pages/AboutUsPage'
import CommunityPage from './pages/CommunityPage'
import BlogPostPage from './pages/BlogPostPage'
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
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
              </Routes>
            </div>
          } />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App 