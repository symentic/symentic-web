import React, { useState, useEffect } from 'react'
import type { Schema } from '../../../amplify/data/resource'
import { EngramProfile } from '../../components/dashboard/EngramProfile'
import { Sidebar } from '../../components/dashboard/Sidebar'
import { SearchBar } from '../../components/dashboard/SearchBar'
import { TagFilter } from '../../components/dashboard/TagFilter'
import { ProfileGrid } from '../../components/dashboard/ProfileGrid'
import { ProfileDetail } from '../../components/dashboard/ProfileDetail'
import { CreateProfileModal } from '../../components/dashboard/CreateProfileModal'
import { ProfileSkeleton } from '../../components/dashboard/ProfileSkeleton'
import { EngramProfileService } from '../../services/engramProfileService'
import { useTheme } from '../../contexts/ThemeContext'
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts'
import { Sun, Moon } from 'lucide-react'
import styles from '../../styles/dashboard/Dashboard.module.css'

const Dashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [engrams, setEngrams] = useState<Schema['EngramProfile']['type'][]>([])
  const [filteredEngrams, setFilteredEngrams] = useState<Schema['EngramProfile']['type'][]>([])
  const [selectedEngram, setSelectedEngram] = useState<Schema['EngramProfile']['type'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Business ID for demo purposes
  const businessId = 'T096L62N0MB'
  
  // Keyboard shortcuts
  useKeyboardShortcuts({
    'cmd+k': () => {
      const searchInput = document.querySelector(`.${styles.searchInput}`) as HTMLInputElement
      searchInput?.focus()
    },
    'cmd+n': () => setShowCreateModal(true),
    'cmd+shift+t': () => toggleTheme(),
    'escape': () => {
      setSelectedEngram(null)
      setShowCreateModal(false)
    },
    '1': () => setSelectedFilter('all'),
    '2': () => setSelectedFilter('internal'),
    '3': () => setSelectedFilter('external'),
  })

  useEffect(() => {
    fetchEngrams()
  }, [])

  useEffect(() => {
    filterEngrams()
  }, [searchQuery, selectedFilter, selectedTags, engrams])

  const fetchEngrams = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const data = await EngramProfileService.listProfilesByBusiness(businessId)
      
      if (data) {
        setEngrams(data)
      }
    } catch (err) {
      console.error('Error fetching engrams:', err)
      setError('Failed to fetch engram profiles. Please check your Amplify configuration and ensure the backend is deployed.')
    } finally {
      setIsLoading(false)
    }
  }

  const getAllUniqueTags = () => {
    const tagSet = new Set<string>()
    engrams.forEach(engram => {
      if (engram.tags) {
        engram.tags.forEach(tag => tagSet.add(tag))
      }
    })
    return Array.from(tagSet).sort()
  }

  const filterEngrams = () => {
    let filtered = engrams

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(engram => {
        const name = engram.name?.toLowerCase() || ''
        const email = engram.email?.toLowerCase() || ''
        const role = engram.role?.toLowerCase() || ''
        const query = searchQuery.toLowerCase()
        
        return name.includes(query) || email.includes(query) || role.includes(query)
      })
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(engram => {
        const userType = engram.userType || ''
        return userType === selectedFilter
      })
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(engram => {
        const engramTags = engram.tags || []
        return selectedTags.some(tag => engramTags.includes(tag))
      })
    }

    setFilteredEngrams(filtered)
  }

  return (
    <div className={styles.dashboard}>
      <Sidebar 
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        engramCount={filteredEngrams.length}
        totalCount={engrams.length}
      />
      
      <div className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>Engram Console</h1>
          <div className={styles.headerActions}>
            <button 
              className={styles.themeToggle}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle theme (⌘+Shift+T)"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, or role... (⌘+K)"
            />
            <button 
              className={styles.createButton}
              onClick={() => setShowCreateModal(true)}
              title="Create new profile (⌘+N)"
            >
              + Create Profile
            </button>
          </div>
        </div>

        <TagFilter
          availableTags={getAllUniqueTags()}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
        />

        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.grid}>
              {[...Array(6)].map((_, i) => (
                <ProfileSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className={styles.error}>
              <p className={styles.errorText}>{error}</p>
              <button className={styles.retryButton} onClick={fetchEngrams}>Retry</button>
            </div>
          ) : (
            <>
              <ProfileGrid 
                engrams={filteredEngrams}
                selectedEngram={selectedEngram}
                onSelectEngram={setSelectedEngram}
              />
              
              {selectedEngram && (
                <ProfileDetail 
                  engram={selectedEngram}
                  onClose={() => setSelectedEngram(null)}
                />
              )}
            </>
          )}
        </div>
      </div>
      
      {showCreateModal && (
        <CreateProfileModal
          businessId={businessId}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            fetchEngrams()
            setShowCreateModal(false)
          }}
        />
      )}
    </div>
  )
}

export default Dashboard