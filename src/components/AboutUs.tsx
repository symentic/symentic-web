import React from 'react'
import { motion } from 'framer-motion'
import { Linkedin } from 'lucide-react'
import '../styles/AboutUs.css'
import leoHeadshot from '../assets/leoheadshot.jpeg'
import willHeadshot from '../assets/willheadshot.jpeg'
import richardHeadshot from '../assets/richardheadshot.jpg'

interface Founder {
  name: string
  role: string
  linkedin: string
  profileImage?: string
}

const AboutUs: React.FC = () => {
  const founders: Founder[] = [
    {
      name: "Leo Gao",
      role: "Co-Founder & CEO",
      linkedin: "https://www.linkedin.com/in/leogao25/",
      profileImage: leoHeadshot
    },
    {
      name: "William Zhang",
      role: "Co-Founder & CTO",
      linkedin: "https://www.linkedin.com/in/williamzhang04/",
      profileImage: willHeadshot
    },
    {
      name: "Richard Huang",
      role: "Co-Founder & CPO",
      linkedin: "https://www.linkedin.com/in/richxhuang/",
      profileImage: richardHeadshot
    },
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
            Establishing the standard for human context layers in enterprises. Allowing agents to work symbiotically with colleagues and clients. Our agents act with intent. 
          </p>
        </motion.div>

        {/* Founders Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="about-us-founders"
        >
          <h3 className="about-us-section-title">The Team</h3>
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
                  {founder.profileImage && (
                    <div className="about-us-founder-image-container">
                      <img 
                        src={founder.profileImage} 
                        alt={`${founder.name} headshot`}
                        className="about-us-founder-image"
                      />
                    </div>
                  )}
                  <div className="about-us-founder-header">
                    <h4 className="about-us-founder-name">{founder.name}</h4>
                    <span className="about-us-founder-role">{founder.role}</span>
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

            <div className="about-us-contact-email-section">
              <span className="about-us-contact-label">Get in touch at </span>
              <motion.a
                href="mailto:hi@symentic.dev"
                className="about-us-contact-email-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                hi@symentic.dev
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutUs 