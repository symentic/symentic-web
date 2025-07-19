import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Users, Brain, Code } from 'lucide-react'
import '../styles/AboutUs.css'

interface Founder {
  name: string
  role: string
  linkedin: string
  bio: string
  expertise: string[]
}

const AboutUs: React.FC = () => {
  const founders: Founder[] = [
    {
      name: "Leo Gao",
      role: "Co-Founder & CEO",
      linkedin: "https://www.linkedin.com/in/leogao25/",
      bio: "Deep expertise in machine learning, distributed systems, and AI infrastructure at scale.",
      expertise: ["Product Vision", "System Architecture", "AI Research"]
    },
    {
      name: "William Zhang",
      role: "Co-Founder & CTO",
      linkedin: "https://www.linkedin.com/in/williamzhang04/",
      bio: "Passionate about building the future of autonomous AI systems and symbiotic agent networks.",
      expertise: ["AI Strategy", "Product Vision", "Team Leadership"]
    },
  ]

  const values = [
    {
      icon: Brain,
      title: "Intelligence First",
      description: "We believe AI should augment human capabilities, not replace them."
    },
    {
      icon: Users,
      title: "Symbiotic Design",
      description: "Building systems where AI agents work together seamlessly across platforms."
    },
    {
      icon: Code,
      title: "Developer Focused",
      description: "Creating tools that empower developers to build the next generation of AI applications."
    }
  ]

  return (
    <section id="about-us" className="about-us">
      <div className="about-us-background">
        <div className="about-us-glow about-us-glow-1"></div>
        <div className="about-us-glow about-us-glow-2"></div>
      </div>

      <div className="about-us-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="about-us-header"
        >
          <h2 className="about-us-title">
            About <span className="about-us-title-gradient">Symentic</span>
          </h2>
          <p className="about-us-subtitle">
            We're building the infrastructure for autonomous AI that works symbiotically across platforms, 
            enabling intelligent agents to collaborate and learn from each other.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="about-us-mission"
        >
          <h3 className="about-us-section-title">Our Mission</h3>
          <p className="about-us-mission-text">
            To democratize access to intelligent AI systems that can autonomously collaborate, 
            learn, and adapt across different platforms and environments. We envision a future 
            where AI agents work together seamlessly, creating a symbiotic ecosystem that 
            amplifies human potential.
          </p>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="about-us-values"
        >
          <h3 className="about-us-section-title">Our Values</h3>
          <div className="about-us-values-grid">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="about-us-value"
                  whileHover={{ y: -5 }}
                >
                  <div className="about-us-value-icon-container">
                    <Icon className="about-us-value-icon" />
                  </div>
                  <h4 className="about-us-value-title">{value.title}</h4>
                  <p className="about-us-value-description">{value.description}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Founders Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="about-us-founders"
        >
          <h3 className="about-us-section-title">Meet the Founders</h3>
          <div className="about-us-founders-grid">
            {founders.map((founder, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                viewport={{ once: true }}
                className="about-us-founder"
                whileHover={{ y: -8 }}
              >
                <div className="about-us-founder-content">
                  <div className="about-us-founder-header">
                    <h4 className="about-us-founder-name">{founder.name}</h4>
                    <span className="about-us-founder-role">{founder.role}</span>
                  </div>
                  
                  <p className="about-us-founder-bio">{founder.bio}</p>
                  
                  <div className="about-us-founder-expertise">
                    {founder.expertise.map((skill, skillIndex) => (
                      <span key={skillIndex} className="about-us-expertise-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                  
                  <motion.a
                    href={founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-us-linkedin-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Linkedin className="about-us-linkedin-icon" />
                    <span>Connect on LinkedIn</span>
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
          className="about-us-contact"
        >
          <div className="about-us-contact-content">
            <h3 className="about-us-contact-title">Join Our Journey</h3>
            <p className="about-us-contact-text">
              We're always looking for talented individuals who share our vision. 
              If you're passionate about AI, autonomous systems, and building the future, 
              we'd love to hear from you.
            </p>
            <motion.button 
              className="about-us-contact-button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get in Touch
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutUs 