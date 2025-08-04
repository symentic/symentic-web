import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Zap, Code } from 'lucide-react'
import '../styles/ComingSoonModal.css'

interface ComingSoonModalProps {
  isOpen: boolean
  onClose: () => void
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose }) => {
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="coming-soon-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="coming-soon-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              onClick={onClose}
              className="modal-close-button"
              title="Close"
            >
              ×
            </div>

            <div className="coming-soon-content">
              <motion.div 
                className="coming-soon-icon-container"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Clock className="coming-soon-icon" />
              </motion.div>

              <h2 className="coming-soon-title">Coming Soon!</h2>
              
              <p className="coming-soon-description">
                We're working hard to bring you this feature. Our team is building something amazing!
              </p>

              <div className="coming-soon-features">
                <div className="coming-soon-feature">
                  <Zap className="coming-soon-feature-icon" />
                  <span>Lightning fast</span>
                </div>
                <div className="coming-soon-feature">
                  <Code className="coming-soon-feature-icon" />
                  <span>Developer friendly</span>
                </div>
              </div>

              <div className="coming-soon-timeline">
                <p className="coming-soon-eta">Expected launch: <strong>Q4 2025</strong></p>
              </div>

              <div className="coming-soon-actions">
                <Link to="/about-us" onClick={onClose}>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="coming-soon-notify-button"
                  >
                    Learn About Our Team
                  </motion.button>
                </Link>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="coming-soon-close-button"
                >
                  Got it!
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ComingSoonModal 