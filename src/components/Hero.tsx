import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Zap } from 'lucide-react'
import '../styles/Hero.css'
import ComingSoonModal from './ComingSoonModal'
import WaitlistModal from './WaitlistModal'

interface TreeNode {
  id: string
  name: string
  x: number
  y: number
  type: 'root' | 'platform' | 'task' | 'specialist'
  opacity?: number
  scale?: number
  shouldShow?: boolean
}

interface TreeLink {
  id: string
  source: TreeNode
  target: TreeNode
  progress: number
  opacity: number
}

// Define the tree structure with positions (wider spread)
const treeStructure = {
  nodes: {
    'root': { id: 'root', name: 'Main Agent', x: 300, y: 300, type: 'root' as const },
    'discord': { id: 'discord', name: 'Discord Agent', x: 150, y: 200, type: 'platform' as const },
    'slack': { id: 'slack', name: 'Slack Agent', x: 450, y: 200, type: 'platform' as const },
    'notion': { id: 'notion', name: 'Notion Agent', x: 300, y: 150, type: 'platform' as const },
    'summarizer': { id: 'summarizer', name: 'Summarizer', x: 50, y: 100, type: 'task' as const },
    'support': { id: 'support', name: 'Support Agent', x: 500, y: 120, type: 'task' as const },
    'scheduler': { id: 'scheduler', name: 'Scheduler', x: 500, y: 250, type: 'task' as const },
    'analytics': { id: 'analytics', name: 'Analytics', x: 300, y: 50, type: 'task' as const },
    'memory': { id: 'memory', name: 'Memory Agent', x: 600, y: 80, type: 'specialist' as const },
    'processor': { id: 'processor', name: 'Data Processor', x: 350, y: 10, type: 'specialist' as const }
  },
  connections: [
    { from: 'root', to: 'discord' },
    { from: 'root', to: 'slack' },
    { from: 'root', to: 'notion' },
    { from: 'discord', to: 'summarizer' },
    { from: 'slack', to: 'support' },
    { from: 'slack', to: 'scheduler' },
    { from: 'notion', to: 'analytics' },
    { from: 'support', to: 'memory' },
    { from: 'analytics', to: 'processor' }
  ]
}

// Animation phases for organic growth - nodes appear after lines complete
const growthPhases = [
  {
    description: 'Deploying Main Agent',
    nodes: ['root'],
    links: [],
    duration: 1500
  },
  {
    description: 'Connecting to Platform Agents',
    nodes: ['root'],
    links: ['root-discord', 'root-slack', 'root-notion'],
    duration: 3000
  },
  {
    description: 'Platform Agents Online',
    nodes: ['root', 'discord', 'slack', 'notion'],
    links: ['root-discord', 'root-slack', 'root-notion'],
    duration: 1000
  },
  {
    description: 'Extending to Task Specialists',
    nodes: ['root', 'discord', 'slack', 'notion'],
    links: ['root-discord', 'root-slack', 'root-notion', 'discord-summarizer', 'slack-support', 'slack-scheduler', 'notion-analytics'],
    duration: 3500
  },
  {
    description: 'Task Specialists Active',
    nodes: ['root', 'discord', 'slack', 'notion', 'summarizer', 'support', 'scheduler', 'analytics'],
    links: ['root-discord', 'root-slack', 'root-notion', 'discord-summarizer', 'slack-support', 'slack-scheduler', 'notion-analytics'],
    duration: 1000
  },
  {
    description: 'Deploying Advanced Agents',
    nodes: ['root', 'discord', 'slack', 'notion', 'summarizer', 'support', 'scheduler', 'analytics'],
    links: ['root-discord', 'root-slack', 'root-notion', 'discord-summarizer', 'slack-support', 'slack-scheduler', 'notion-analytics', 'support-memory', 'analytics-processor'],
    duration: 3000
  },
  {
    description: 'Network Complete',
    nodes: ['root', 'discord', 'slack', 'notion', 'summarizer', 'support', 'scheduler', 'analytics', 'memory', 'processor'],
    links: ['root-discord', 'root-slack', 'root-notion', 'discord-summarizer', 'slack-support', 'slack-scheduler', 'notion-analytics', 'support-memory', 'analytics-processor'],
    duration: 2000
  }
]

const Hero: React.FC = () => {
  const [currentPhase, setCurrentPhase] = useState<number>(0)
  const [visibleNodes, setVisibleNodes] = useState<TreeNode[]>([])
  const [visibleLinks, setVisibleLinks] = useState<TreeLink[]>([])
  const [viewBox] = useState<string>('0 0 650 450') // Better spacing for full container
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [showComingSoon, setShowComingSoon] = useState(false)
  const [showWaitlist, setShowWaitlist] = useState(false)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)
  const svgRef = useRef<SVGSVGElement>(null)
  const treeContainerRef = useRef<HTMLDivElement>(null)

  // Generate particle positions once and keep them stable
  const particles = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
      colorType: i % 3 // 0, 1, or 2 for different colors
    }))
  }, []) // Empty dependency array means this only runs once

  useEffect(() => {
    const phase = growthPhases[currentPhase]
    if (!phase) return

    const startTime = Date.now()
    const prevNodes = new Set(visibleNodes.map(n => n.id))
    const prevLinks = new Set(visibleLinks.map(l => l.id))

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / phase.duration, 1)
      
      // Smooth easing
      const ease = progress < 0.5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2

      // Update nodes - only show if they should be visible in this phase
      const currentNodes: TreeNode[] = phase.nodes.map(nodeId => {
        const nodeData = treeStructure.nodes[nodeId as keyof typeof treeStructure.nodes]
        const isNew = !prevNodes.has(nodeId)
        
        return {
          ...nodeData,
          opacity: isNew ? ease : 1,
          scale: isNew ? ease : 1,
          shouldShow: true
        }
      })

      // Update links - animate new links growing
      const currentLinks: TreeLink[] = phase.links.map(linkId => {
        const [sourceId, targetId] = linkId.split('-')
        const source = treeStructure.nodes[sourceId as keyof typeof treeStructure.nodes]
        const target = treeStructure.nodes[targetId as keyof typeof treeStructure.nodes]
        const isNew = !prevLinks.has(linkId)
        
        return {
          id: linkId,
          source,
          target,
          progress: isNew ? ease : 1,
          opacity: isNew ? ease : 1
        }
      })

      setVisibleNodes(currentNodes)
      setVisibleLinks(currentLinks)

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        // Move to next phase
        setTimeout(() => {
          setCurrentPhase(prev => (prev + 1) % growthPhases.length)
        }, 800)
      }
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase])

  // Reset animation
  useEffect(() => {
    if (currentPhase === growthPhases.length - 1) {
      setTimeout(() => {
        setCurrentPhase(0)
        setVisibleNodes([])
        setVisibleLinks([])
        setPan({ x: 0, y: 0 })
        setZoom(1)
      }, 3000)
    }
  }, [currentPhase])

  // Prevent page scroll when over tree container and handle zoom
  useEffect(() => {
    const treeContainer = treeContainerRef.current
    if (!treeContainer) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      
      // Get the mouse position relative to the SVG
      const rect = treeContainer.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      
      // Calculate zoom delta
      const delta = e.deltaY * -0.001
      const newZoom = Math.min(Math.max(0.3, zoom + delta), 3)
      const zoomFactor = newZoom / zoom
      
      // Adjust pan to zoom into mouse position
      const newPanX = mouseX - (mouseX - pan.x) * zoomFactor
      const newPanY = mouseY - (mouseY - pan.y) * zoomFactor
      
      setZoom(newZoom)
      setPan({ x: newPanX, y: newPanY })
    }

    treeContainer.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      treeContainer.removeEventListener('wheel', handleWheel)
    }
  }, [zoom, pan]) // Include zoom and pan in dependencies for proper zoom-to-mouse behavior

  // Mouse interactions for zoom and pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }



  // Calculate transform for interactivity
  const transform = `translate(${pan.x}, ${pan.y}) scale(${zoom})`

  const nodeColors = {
    root: '#06B6D4',
    platform: '#8B5CF6',
    task: '#10B981',
    specialist: '#F59E0B'
  }

  return (
    <section className="hero">
      {/* Animated background dots */}
      <div className="hero-background">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`hero-dot ${particle.colorType === 0 ? 'hero-dot-cyan' : particle.colorType === 1 ? 'hero-dot-purple' : 'hero-dot-emerald'}`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.animationDelay,
            }}
          />
        ))}
      </div>

      <div className="hero-container">
        <div className="hero-grid">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="hero-text-content"
            >
              <div className="hero-badge">
                <Zap className="hero-badge-icon" />
                <span className="hero-badge-text">Agents that know your enterprise</span>
              </div>
              
              <h1 className="hero-heading">
                Enterprise
                <span className="hero-heading-gradient">
                  Symbiotic 
                </span>
                Agents
              </h1>
              
              <p className="hero-description">
              Agents who know everyone in your enterprise. Automate with social context and intent. 
              </p>
              
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hero-buttons"
            >
              <button 
                onClick={() => setShowWaitlist(true)}
                className="hero-button-primary"
              >
                <span>Join Waitlist</span>
                <ArrowRight className="hero-button-primary-icon" />
              </button>
              
              <button 
                onClick={() => setShowComingSoon(true)}
                className="hero-button-secondary"
              >
                View Docs
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hero-status"
            >
              <div className="hero-status-item">
                <div className="hero-status-dot hero-status-dot-green"></div>
                <span>Persistent Human Context</span>
              </div>
              <div className="hero-status-item">
                <div className="hero-status-dot hero-status-dot-green"></div>
                <span>Agent Integration</span>
              </div>
              <div className="hero-status-item">
                <div className="hero-status-dot hero-status-dot-green"></div>
                <span>Enterprise Tooling</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Interactive Tree Animation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hero-tree"
          >
            <div ref={treeContainerRef} className="hero-tree-container">
              <div className="hero-tree-header">
                <div className="hero-tree-title">Agent Network</div>
                <div className="hero-tree-subtitle">
                  {growthPhases[currentPhase]?.description || 'Growing Network'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>
                  Scroll to zoom • Drag to pan
                </div>
              </div>
              
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox={viewBox}
                style={{ 
                  background: 'transparent',
                  cursor: isDragging ? 'grabbing' : 'grab',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <g transform={transform}>
                  {/* Render links with growth animation */}
                  {visibleLinks.map(link => {
                    const { source, target, progress, opacity } = link
                    const endX = source.x + (target.x - source.x) * progress
                    const endY = source.y + (target.y - source.y) * progress
                    
                    return (
                      <g key={link.id}>
                        {/* Main link line */}
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={endX}
                          y2={endY}
                          stroke="rgba(148, 163, 184, 0.8)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          opacity={opacity}
                        />
                        
                        {/* Growing particle at tip */}
                        {progress < 1 && progress > 0.1 && (
                          <>
                            <circle
                              cx={endX}
                              cy={endY}
                              r="5"
                              fill="#06B6D4"
                              opacity={opacity}
                            >
                              <animate
                                attributeName="r"
                                values="4;7;4"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                            <circle
                              cx={endX}
                              cy={endY}
                              r="10"
                              fill="#06B6D4"
                              opacity={opacity * 0.3}
                            >
                              <animate
                                attributeName="r"
                                values="8;14;8"
                                dur="1s"
                                repeatCount="indefinite"
                              />
                            </circle>
                          </>
                        )}
                      </g>
                    )
                  })}
                  
                  {/* Render nodes only when they should be shown */}
                  {visibleNodes.filter(node => node.shouldShow).map(node => {
                    const opacity = node.opacity ?? 1
                    const scale = node.scale ?? 1
                    
                    return (
                      <g key={node.id}>
                        {/* Node glow */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={16 * scale}
                          fill={nodeColors[node.type]}
                          opacity={opacity * 0.3}
                        />
                        
                        {/* Main node */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={10 * scale}
                          fill={nodeColors[node.type]}
                          opacity={opacity}
                        />
                        
                        {/* Inner highlight */}
                        <circle
                          cx={node.x - 3}
                          cy={node.y - 3}
                          r={3 * scale}
                          fill="white"
                          opacity={opacity * 0.8}
                        />
                        
                        {/* Node label */}
                        <text
                          x={node.x}
                          y={node.y + 25 * scale}
                          textAnchor="middle"
                          fill="#F1F5F9"
                          fontSize="12"
                          fontFamily="Inter, system-ui, sans-serif"
                          opacity={opacity}
                        >
                          {node.name}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      <ComingSoonModal 
        isOpen={showComingSoon} 
        onClose={() => setShowComingSoon(false)} 
      />

      <WaitlistModal 
        isOpen={showWaitlist} 
        onClose={() => setShowWaitlist(false)} 
        source="hero"
      />
    </section>
  )
}

export default Hero 