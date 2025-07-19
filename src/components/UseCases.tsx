import React from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Mail, 
  FileText, 
  Users, 
  Calendar, 
  BarChart3,
  ArrowUpRight 
} from 'lucide-react'
import '../styles/UseCases.css'

interface UseCase {
  icon: React.ComponentType<any>
  title: string
  description: string
  features: string[]
  color: string
}

const UseCases: React.FC = () => {
  const useCases: UseCase[] = [
    {
      icon: MessageCircle,
      title: 'Auto Conversation Summaries',
      description: 'Automatically summarize Slack threads, Discord channels, and meeting notes.',
      features: ['Real-time analysis', 'Key points extraction', 'Action items identification'],
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Customer Support Agents',
      description: 'Deploy intelligent support bots that understand context and escalate when needed.',
      features: ['24/7 availability', 'Context retention', 'Smart escalation'],
      color: 'green'
    },
    {
      icon: Calendar,
      title: 'Workflow Automation',
      description: 'Create specialized agents that trigger actions based on conversation patterns.',
      features: ['Custom triggers', 'Multi-platform sync', 'Automated follow-ups'],
      color: 'purple'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
      }
    }
  }

  const cardHoverVariants = {
    rest: { 
      scale: 1,
      y: 0
    },
    hover: { 
      scale: 1.02,
      y: -8,
      transition: {
        duration: 0.3
      }
    }
  }

  return (
    <section className="use-cases">
      {/* Enhanced background effects */}
      <div className="use-cases-background">
        <div className="use-cases-glow use-cases-glow-1"></div>
        <div className="use-cases-glow use-cases-glow-2"></div>
        <div className="use-cases-glow use-cases-glow-3"></div>
        <div className="use-cases-glow use-cases-glow-4"></div>
      </div>

      <div className="use-cases-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="use-cases-header"
        >
          <h2 className="use-cases-title">
            Endless <span className="use-cases-title-gradient">possibilities</span>
          </h2>
          <p className="use-cases-description">
            From simple automation to complex multi-agent workflows, our platform adapts to your needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="use-cases-grid"
        >
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="use-case"
              >
                <motion.div
                  variants={cardHoverVariants}
                  initial="rest"
                  whileHover="hover"
                  className="use-case-card"
                  data-color={useCase.color}
                >
                  {/* Enhanced gradient overlay */}
                  <div className="use-case-overlay"></div>
                  
                  {/* Animated border glow */}
                  <div className="use-case-glow"></div>
                  
                  {/* Header with enhanced styling */}
                  <div className="use-case-header">
                    <motion.div 
                      className="use-case-icon-container"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Icon className="use-case-icon" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                      viewport={{ once: true }}
                    >
                      <ArrowUpRight className="use-case-arrow" />
                    </motion.div>
                  </div>

                  {/* Enhanced content with flex grow */}
                  <div className="use-case-content">
                    <h3 className="use-case-title">
                      {useCase.title}
                    </h3>
                    
                    <p className="use-case-description">
                      {useCase.description}
                    </p>

                    {/* Enhanced features with animated dots */}
                    <div className="use-case-features">
                      {useCase.features.map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          className="use-case-feature"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * idx, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          <motion.div 
                            className="use-case-feature-dot"
                            whileHover={{ scale: 1.5 }}
                            animate={{ 
                              scale: [1, 1.1, 1],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: idx * 0.2
                            }}
                          />
                          <span>{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Progress indicator */}
                  <div className="use-case-progress">
                    <div className="use-case-progress-bg">
                      <motion.div 
                        className="use-case-progress-bar"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        transition={{ duration: 1.5, delay: 0.3 + index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Enhanced hover glow effect */}
                <div className="use-case-hover-glow"></div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Enhanced Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="use-cases-bottom-cta"
        >
          <motion.div 
            className="use-cases-cta-card"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="use-cases-cta-title">
              Don't see your use case?
            </h3>
            <p className="use-cases-cta-description">
              Our platform is designed to evolve. With our developer APIs, you can build custom agents for any workflow.
            </p>
            <motion.button 
              className="use-cases-cta-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore API Docs
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default UseCases 