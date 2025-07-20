import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Brain, Zap, ArrowRight } from 'lucide-react'
import '../styles/HowItWorks.css'
import ComingSoonModal from './ComingSoonModal'

interface Step {
  step: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title: string
  description: string
  details: string[]
}

const HowItWorks: React.FC = () => {
  const [showComingSoon, setShowComingSoon] = useState<boolean>(false)
  const steps: Step[] = [
    {
      step: '01',
      icon: MessageSquare,
      title: 'Bots join your platforms',
      description: 'Deploy autonomous agents directly into Slack, Discord, and soon Notion, Gmail, and more.',
      details: ['Seamless integration', 'Zero configuration', 'Instant deployment']
    },
    {
      step: '02',
      icon: Brain,
      title: 'They observe and learn context',
      description: 'AI agents intelligently parse conversations, understand patterns, and build contextual memory.',
      details: ['Context understanding', 'Pattern recognition', 'Continuous learning']
    },
    {
      step: '03',
      icon: Zap,
      title: 'They spawn helpers or expose APIs',
      description: 'Based on needs, agents create specialized child bots or expose developer APIs for custom automation.',
      details: ['Dynamic spawning', 'API endpoints', 'Custom workflows']
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  const cardHoverVariants = {
    rest: { scale: 1 },
    hover: { 
      scale: 1.02,
      transition: {
        duration: 0.4
      }
    }
  }

  return (
    <section className="how-it-works">
      {/* Enhanced background effects */}
      <div className="how-it-works-background">
        <div className="how-it-works-glow how-it-works-glow-1"></div>
        <div className="how-it-works-glow how-it-works-glow-2"></div>
        <div className="how-it-works-glow how-it-works-glow-3"></div>
      </div>

      <div className="how-it-works-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="how-it-works-header"
        >
          <h2 className="how-it-works-title">
            How it <span className="how-it-works-title-gradient">works</span>
          </h2>
          <div className="how-it-works-description">
            <p>
              Three simple steps to deploy intelligent, context-aware AI agents that grow with your needs
            </p>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="how-it-works-steps"
        >
          {/* Enhanced connection lines for desktop */}
          <div className="how-it-works-connection">
            <div className="how-it-works-connection-bg"></div>
            <motion.div 
              className="how-it-works-connection-progress"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ duration: 2, delay: 1 }}
              viewport={{ once: true }}
            />
          </div>
          
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="how-it-works-step"
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="how-it-works-card"
                >
                  {/* Enhanced gradient overlay */}
                  <div className="how-it-works-card-overlay"></div>
                  
                  {/* Animated border glow */}
                  <div className="how-it-works-card-glow"></div>
                  
                  {/* Step indicator with enhanced styling */}
                  <div className="how-it-works-step-header">
                    <div className="how-it-works-step-indicator">
                      <motion.div 
                        className="how-it-works-step-number"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span>{step.step}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="how-it-works-step-icon" />
                      </motion.div>
                    </div>
                    
                    {/* Floating indicator */}
                    <motion.div 
                      className="how-it-works-floating-dot"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>

                  {/* Enhanced content */}
                  <div className="how-it-works-content">
                    <h3 className="how-it-works-step-title">
                      {step.title}
                    </h3>
                    
                    <p className="how-it-works-step-description">
                      {step.description}
                    </p>

                    {/* Enhanced details with better styling */}
                    <div className="how-it-works-details">
                      {step.details.map((detail, idx) => (
                        <motion.div 
                          key={idx} 
                          className="how-it-works-detail"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <motion.div 
                            className="how-it-works-detail-dot"
                            whileHover={{ scale: 1.5 }}
                          />
                          <span>{detail}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="how-it-works-progress">
                    <div className="how-it-works-progress-bg">
                      <motion.div 
                        className="how-it-works-progress-bar"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.2 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>

                  {/* Arrow connector for mobile */}
                  {index < steps.length - 1 && (
                    <div className="how-it-works-arrow">
                      <motion.div
                        animate={{ y: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <ArrowRight className="how-it-works-arrow-icon" />
                      </motion.div>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Enhanced call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="how-it-works-cta"
        >
          <p className="how-it-works-cta-text">Ready to see it in action?</p>
          <motion.button 
            onClick={() => setShowComingSoon(true)}
            className="how-it-works-cta-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Try Demo</span>
            <ArrowRight className="how-it-works-cta-icon" />
          </motion.button>
        </motion.div>
      </div>

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />
    </section>
  )
}

export default HowItWorks 