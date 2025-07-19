import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Check, Sparkles } from 'lucide-react'
import '../styles/CTA.css'

interface Stat {
  number: string
  label: string
}

const CTA: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsLoading(false)
    setIsSubmitted(true)
    setEmail('')

    // Reset after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
    }, 3000)
  }

  const stats: Stat[] = [
    { number: '10K+', label: 'Messages Analyzed' },
    { number: '150+', label: 'Agents Deployed' },
    { number: '50+', label: 'Companies Onboard' },
    { number: '99.9%', label: 'Uptime' }
  ]

  return (
    <section className="cta">
      {/* Enhanced background effects */}
      <div className="cta-background">
        <div className="cta-glow cta-glow-1"></div>
        <div className="cta-glow cta-glow-2"></div>
        <div className="cta-glow cta-glow-3"></div>
      </div>

      <div className="cta-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="cta-header"
        >
          <motion.div 
            className="cta-badge"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="cta-badge-icon" />
            <span className="cta-badge-text">Early Access</span>
          </motion.div>

          <h2 className="cta-title">
            Ready to deploy your
            <span className="cta-title-gradient">
              first AI agent?
            </span>
          </h2>
          
          <p className="cta-description">
            Join the waitlist for early access to the platform that's redefining how teams interact with AI infrastructure.
          </p>
        </motion.div>

        {/* Enhanced email signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="cta-signup"
        >
          <form onSubmit={handleSubmit} className="cta-form">
            <div className="cta-input-container">
              <Mail className="cta-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="cta-input"
                required
                disabled={isLoading || isSubmitted}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isLoading || isSubmitted}
              className="cta-submit-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitted ? (
                <>
                  <Check className="cta-submit-icon" />
                  <span>Added to Waitlist!</span>
                </>
              ) : isLoading ? (
                <>
                  <div className="cta-submit-spinner"></div>
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>Join Waitlist</span>
                  <ArrowRight className="cta-submit-icon" />
                </>
              )}
            </motion.button>
          </form>

          <p className="cta-form-note">
            No spam, ever. We'll notify you when early access opens.
          </p>
        </motion.div>

        {/* Enhanced stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="cta-stats"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              viewport={{ once: true }}
              className="cta-stat"
              whileHover={{ scale: 1.05 }}
            >
              <div className="cta-stat-number">
                {stat.number}
              </div>
              <div className="cta-stat-label">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="cta-footer"
        >
          <div className="cta-footer-links">
            <motion.a 
              href="#" 
              className="cta-footer-link"
              whileHover={{ scale: 1.05 }}
            >
              Documentation
            </motion.a>
            <motion.a 
              href="#" 
              className="cta-footer-link"
              whileHover={{ scale: 1.05 }}
            >
              Discord Community
            </motion.a>
            <motion.a 
              href="#" 
              className="cta-footer-link"
              whileHover={{ scale: 1.05 }}
            >
              GitHub
            </motion.a>
            <motion.a 
              href="#" 
              className="cta-footer-link"
              whileHover={{ scale: 1.05 }}
            >
              Blog
            </motion.a>
          </div>
          
          <div className="cta-footer-copyright">
            © 2024 Symentic Platform. All rights reserved.
          </div>
        </motion.div>

        {/* Enhanced floating elements */}
        <div className="cta-floating-element cta-floating-element-1">
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="cta-floating-dot cta-floating-dot-1"
          />
        </div>
        
        <div className="cta-floating-element cta-floating-element-2">
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="cta-floating-dot cta-floating-dot-2"
          />
        </div>
      </div>
    </section>
  )
}

export default CTA 