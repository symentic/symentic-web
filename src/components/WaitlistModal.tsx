import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'
import '../styles/WaitlistModal.css'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  source?: string
}

const client = generateClient<Schema>()

const WaitlistModal: React.FC<WaitlistModalProps> = ({ isOpen, onClose, source = 'homepage' }) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setErrorMessage('Please enter your email address')
      setStatus('error')
      return
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address')
      setStatus('error')
      return
    }

    setIsSubmitting(true)
    setStatus('idle')
    setErrorMessage('')

    try {
      await client.models.Waitlist.create({
        email: email.trim().toLowerCase(),
        signedUpAt: new Date().toISOString(),
        source: source
      })

      setStatus('success')
      setEmail('')
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
        setStatus('idle')
      }, 2000)
      
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
      setStatus('idle')
      setEmail('')
      setErrorMessage('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="waitlist-overlay"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="waitlist-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={handleClose}
              className="waitlist-close"
              disabled={isSubmitting}
            >
              <X size={20} />
            </button>

            <div className="waitlist-content">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="waitlist-success"
                >
                  <CheckCircle className="waitlist-success-icon" />
                  <h2 className="waitlist-success-title">You're on the list!</h2>
                  <p className="waitlist-success-description">
                    Thank you for joining our waitlist. We'll notify you as soon as Symentic is ready!
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="waitlist-header">
                    <Mail className="waitlist-icon" />
                    <h2 className="waitlist-title">Join the Waitlist</h2>
                    <p className="waitlist-description">
                      Be the first to know when Symentic launches. Get early access and exclusive updates.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="waitlist-form">
                    <div className="waitlist-input-container">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className={`waitlist-input ${status === 'error' ? 'waitlist-input-error' : ''}`}
                        disabled={isSubmitting}
                        autoFocus
                      />
                      {status === 'error' && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="waitlist-error"
                        >
                          <AlertCircle size={16} />
                          <span>{errorMessage}</span>
                        </motion.div>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                      className="waitlist-submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="waitlist-spinner" />
                          Joining...
                        </>
                      ) : (
                        'Join Waitlist'
                      )}
                    </motion.button>
                  </form>

                  <div className="waitlist-benefits">
                    <h3 className="waitlist-benefits-title">What you'll get:</h3>
                    <ul className="waitlist-benefits-list">
                      <li>Early access when we launch</li>
                      <li>Exclusive product updates</li>
                      <li>Special pricing for early adopters</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default WaitlistModal 