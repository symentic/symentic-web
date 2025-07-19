import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Check, Code, Zap, Database, Bot } from 'lucide-react'
import '../styles/DeveloperAPI.css'

interface ApiExample {
  title: string
  icon: React.ComponentType<any>
  endpoint: string
  description: string
  request: string
  response: string
}

interface Feature {
  icon: React.ComponentType<any>
  title: string
  description: string
}

type TabKey = 'messages' | 'createBot' | 'memory'

const DeveloperAPI: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('messages')

  const handleCopy = (code: string, tabName: string): void => {
    navigator.clipboard.writeText(code)
    setCopiedCode(tabName)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const apiExamples: Record<TabKey, ApiExample> = {
    messages: {
      title: 'Message Analysis',
      icon: Code,
      endpoint: 'POST /api/v1/messages/analyze',
      description: 'Analyze conversations and extract insights',
      request: `curl -X POST "https://api.symentic.dev/v1/messages/analyze" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "platform": "slack",
    "channel_id": "C1234567890",
    "messages": [
      {
        "id": "msg_123",
        "content": "Can we schedule a demo for next week?",
        "author": "john@company.com",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }'`,
      response: `{
  "analysis": {
    "intent": "scheduling_request",
    "sentiment": "positive",
    "entities": [
      {"type": "time", "value": "next week"},
      {"type": "action", "value": "demo"}
    ],
    "suggested_actions": [
      {
        "type": "calendar_integration",
        "priority": "high",
        "description": "Schedule demo meeting"
      }
    ]
  },
  "confidence": 0.92
}`
    },
    createBot: {
      title: 'Create Agent',
      icon: Bot,
      endpoint: 'POST /api/v1/agents/create',
      description: 'Deploy a new specialized agent',
      request: `curl -X POST "https://api.symentic.dev/v1/agents/create" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "support-agent",
    "type": "customer_support",
    "platform": "discord",
    "config": {
      "channels": ["general", "support"],
      "triggers": ["@support", "help", "issue"],
      "capabilities": ["ticket_creation", "escalation"]
    },
    "parent_agent": "main-discord-bot"
  }'`,
      response: `{
  "agent": {
    "id": "agent_abc123",
    "name": "support-agent",
    "status": "deploying",
    "platform": "discord",
    "created_at": "2024-01-15T10:35:00Z",
    "endpoints": {
          "webhook": "https://api.symentic.dev/webhooks/agent_abc123",
    "status": "https://api.symentic.dev/v1/agents/agent_abc123/status"
    }
  }
}`
    },
    memory: {
      title: 'Agent Memory',
      icon: Database,
      endpoint: 'GET /api/v1/agents/{id}/memory',
      description: 'Access agent contextual memory',
      request: `curl -X GET "https://api.symentic.dev/v1/agents/agent_abc123/memory" \\
  -H "Authorization: Bearer your-api-key" \\
  -G -d "limit=50" \\
  -d "type=conversation"`,
      response: `{
  "memories": [
    {
      "id": "mem_789",
      "type": "conversation",
      "context": "Support ticket discussion",
      "summary": "User experiencing login issues",
      "relevance_score": 0.95,
      "created_at": "2024-01-15T09:30:00Z"
    }
  ],
  "total": 127,
  "has_more": true
}`
    }
  }

  const features: Feature[] = [
    {
      icon: Zap,
      title: 'Real-time Events',
      description: 'WebSocket connections for live agent updates and notifications'
    },
    {
      icon: Code,
      title: 'RESTful APIs',
      description: 'Clean, predictable APIs following REST principles'
    },
    {
      icon: Database,
      title: 'GraphQL Support',
      description: 'Flexible queries for complex data relationships'
    },
    {
      icon: Bot,
      title: 'SDK Libraries',
      description: 'Official SDKs for Python, Node.js, Go, and more'
    }
  ]

  return (
    <section className="developer-api">
      {/* Enhanced background effects */}
      <div className="developer-api-background">
        <div className="developer-api-glow developer-api-glow-1"></div>
        <div className="developer-api-glow developer-api-glow-2"></div>
        <div className="developer-api-glow developer-api-glow-3"></div>
      </div>

      <div className="developer-api-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="developer-api-header"
        >
          <h2 className="developer-api-title">
            Built for <span className="developer-api-title-gradient">developers</span>
          </h2>
          <p className="developer-api-description">
            Powerful APIs to build custom automations, dashboards, and integrations on top of your AI agent infrastructure
          </p>
        </motion.div>

        <div className="developer-api-content">
          {/* Left side - API Examples */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="developer-api-examples"
          >
            {/* Enhanced Tab Navigation */}
            <div className="developer-api-tabs">
              {Object.entries(apiExamples).map(([key, example]) => {
                const Icon = example.icon
                const tabKey = key as TabKey
                return (
                  <motion.button
                    key={key}
                    onClick={() => setActiveTab(tabKey)}
                    className={`developer-api-tab ${activeTab === key ? 'active' : ''}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="developer-api-tab-icon" />
                    <span>{example.title}</span>
                  </motion.button>
                )
              })}
            </div>

            {/* Enhanced API Example */}
            <motion.div 
              className="developer-api-example"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="developer-api-example-header">
                <div className="developer-api-example-controls">
                  <div className="developer-api-controls">
                    <div className="developer-api-control developer-api-control-green"></div>
                    <div className="developer-api-control developer-api-control-yellow"></div>
                    <div className="developer-api-control developer-api-control-red"></div>
                  </div>
                </div>
                <motion.code 
                  className="developer-api-endpoint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {apiExamples[activeTab].endpoint}
                </motion.code>
                <motion.p 
                  className="developer-api-endpoint-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {apiExamples[activeTab].description}
                </motion.p>
              </div>

              {/* Request */}
              <div className="developer-api-section">
                <div className="developer-api-section-header">
                  <h4 className="developer-api-section-title">Request</h4>
                  <motion.button
                    onClick={() => handleCopy(apiExamples[activeTab].request, `${activeTab}-request`)}
                    className="developer-api-copy-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedCode === `${activeTab}-request` ? (
                      <Check className="developer-api-copy-icon" />
                    ) : (
                      <Copy className="developer-api-copy-icon" />
                    )}
                    <span>{copiedCode === `${activeTab}-request` ? 'Copied' : 'Copy'}</span>
                  </motion.button>
                </div>
                <pre className="developer-api-code-block">
                  <code>{apiExamples[activeTab].request}</code>
                </pre>
              </div>

              {/* Response */}
              <div className="developer-api-section">
                <div className="developer-api-section-header">
                  <h4 className="developer-api-section-title">Response</h4>
                  <motion.button
                    onClick={() => handleCopy(apiExamples[activeTab].response, `${activeTab}-response`)}
                    className="developer-api-copy-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {copiedCode === `${activeTab}-response` ? (
                      <Check className="developer-api-copy-icon" />
                    ) : (
                      <Copy className="developer-api-copy-icon" />
                    )}
                    <span>{copiedCode === `${activeTab}-response` ? 'Copied' : 'Copy'}</span>
                  </motion.button>
                </div>
                <pre className="developer-api-code-block">
                  <code>{apiExamples[activeTab].response}</code>
                </pre>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Features */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="developer-api-features"
          >
            <div className="developer-api-features-section">
              <h3 className="developer-api-features-title">Developer-First Experience</h3>
              <div className="developer-api-features-list">
                {features.map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="developer-api-feature"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div 
                        className="developer-api-feature-icon-container"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="developer-api-feature-icon" />
                      </motion.div>
                      <div className="developer-api-feature-content">
                        <h4 className="developer-api-feature-title">{feature.title}</h4>
                        <p className="developer-api-feature-description">{feature.description}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            {/* Enhanced Quick Start */}
            <motion.div 
              className="developer-api-quickstart"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="developer-api-quickstart-title">Quick Start</h4>
              <div className="developer-api-quickstart-steps">
                {[
                  'Get your API key from the dashboard',
                  'Install our SDK: npm install @symentic/sdk',
                  'Start building with intelligent agents'
                ].map((step, index) => (
                  <motion.div 
                    key={index}
                    className="developer-api-quickstart-step"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="developer-api-quickstart-number"
                      whileHover={{ scale: 1.1 }}
                    >
                      {index + 1}
                    </motion.div>
                    <span className="developer-api-quickstart-text">
                      {step.includes('npm') ? (
                        <>
                          Install our SDK: <code className="developer-api-quickstart-code">npm install @symentic/sdk</code>
                        </>
                      ) : step}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.button 
                className="developer-api-quickstart-button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View Full Documentation
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default DeveloperAPI 