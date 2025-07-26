import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Sparkles, CheckCircle, AlertCircle } from 'lucide-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
import '../styles/CTA.css'
import ComingSoonModal from './ComingSoonModal'

const client = generateClient<Schema>()

interface Stat {
  number: string
  label: string
}

const CTA: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email) || isSubmitting) return

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Save email to waitlist
      await client.models.Waitlist.create({
        email: email.trim(),
        signedUpAt: new Date().toISOString(),
        source: 'homepage'
      })

      setSubmitStatus('success')
      setEmail('') // Clear the form
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    } catch (error) {
      console.error('Error saving to waitlist:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stats: Stat[] = [
    { number: '0+', label: 'Messages Analyzed' },
    { number: '0+', label: 'Agents Deployed' },
    { number: '0+', label: 'Companies Onboard' },
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
                disabled={false}
              />
            </div>
            
            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === 'success'}
              className={`cta-submit-button ${submitStatus === 'success' ? 'cta-submit-success' : ''}`}
              whileHover={!isSubmitting ? { scale: 1.05 } : {}}
              whileTap={!isSubmitting ? { scale: 0.95 } : {}}
            >
              {submitStatus === 'success' ? (
                <>
                  <CheckCircle className="cta-submit-icon" />
                  <span>You're on the list!</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="cta-spinner" />
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

          {submitStatus === 'error' && (
            <div className="cta-error-message">
              <AlertCircle className="cta-error-icon" />
              <span>Something went wrong. Please try again.</span>
            </div>
          )}

          <p className="cta-form-note">
            {submitStatus === 'success' 
              ? "Thank you! We'll notify you when early access opens." 
              : "No spam, ever. We'll notify you when early access opens."}
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

        {/* Business Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="cta-contact-section"
        >
          <p className="cta-contact-text">
            Questions or want to set up a meeting?
          </p>
          <motion.a
            href="mailto:hi@symentic.dev"
            className="cta-contact-email"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact us at hi@symentic.dev
          </motion.a>
        </motion.div>

        {/* Enhanced footer links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
          className="cta-footer"
        >
          <div className="cta-footer-links">
            <motion.button 
              onClick={() => setShowComingSoon(true)}
              className="cta-footer-link cta-footer-button"
              whileHover={{ scale: 1.05 }}
            >
              Documentation
            </motion.button>
            <motion.button 
              onClick={() => setShowComingSoon(true)}
              className="cta-footer-link cta-footer-button"
              whileHover={{ scale: 1.05 }}
            >
              Discord Community
            </motion.button>
            <motion.button 
              onClick={() => setShowComingSoon(true)}
              className="cta-footer-link cta-footer-button"
              whileHover={{ scale: 1.05 }}
            >
              GitHub
            </motion.button>
            <motion.button 
              onClick={() => setShowComingSoon(true)}
              className="cta-footer-link cta-footer-button"
              whileHover={{ scale: 1.05 }}
            >
              Blog
            </motion.button>
          </div>
          
          <div className="cta-footer-copyright">
            © 2025 Symentic Platform. All rights reserved.
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

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />
    </section>
  )
}

export default CTA 