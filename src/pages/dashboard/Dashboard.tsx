import React, { useState, useEffect } from 'react'
import type { Schema } from '../../../amplify/data/resource'
import { EngramProfile } from '../../components/dashboard/EngramProfile'
import { Sidebar } from '../../components/dashboard/Sidebar'
import { SearchBar } from '../../components/dashboard/SearchBar'
import { ProfileGrid } from '../../components/dashboard/ProfileGrid'
import { ProfileDetail } from '../../components/dashboard/ProfileDetail'
import { CreateProfileModal } from '../../components/dashboard/CreateProfileModal'
import { EngramProfileService } from '../../services/engramProfileService'
import '../../styles/dashboard/Dashboard.css'

const Dashboard: React.FC = () => {
  const [engrams, setEngrams] = useState<Schema['EngramProfile']['type'][]>([])
  const [filteredEngrams, setFilteredEngrams] = useState<Schema['EngramProfile']['type'][]>([])
  const [selectedEngram, setSelectedEngram] = useState<Schema['EngramProfile']['type'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  
  // Business ID for demo purposes
  const businessId = 'T096L62N0MB'

  useEffect(() => {
    fetchEngrams()
  }, [])

  useEffect(() => {
    filterEngrams()
  }, [searchQuery, selectedFilter, engrams])

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

    setFilteredEngrams(filtered)
  }

  return (
    <div className="dashboard">
      <Sidebar 
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        engramCount={filteredEngrams.length}
        totalCount={engrams.length}
      />
      
      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Engram Console</h1>
          <div className="header-actions">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by name, email, or role..."
            />
            <button 
              className="create-profile-btn"
              onClick={() => setShowCreateModal(true)}
            >
              + Create Profile
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {isLoading ? (
            <div className="dashboard-loading">
              <div className="loading-spinner"></div>
              <p>Loading engram profiles...</p>
            </div>
          ) : error ? (
            <div className="dashboard-error">
              <p>{error}</p>
              <button onClick={fetchEngrams}>Retry</button>
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