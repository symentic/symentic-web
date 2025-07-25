import React from 'react'
import { EngramProfile } from './EngramProfile'

interface ProfileGridProps {
  engrams: any[]
  selectedEngram: any | null
  onSelectEngram: (engram: any) => void
}

export const ProfileGrid: React.FC<ProfileGridProps> = ({
  engrams,
  selectedEngram,
  onSelectEngram
}) => {
  if (engrams.length === 0) {
    return (
      <div className="profile-grid-empty">
        <p>No engram profiles found.</p>
      </div>
    )
  }

  return (
    <div className="profile-grid">
      {engrams.map((engram) => {
        const name = engram.name || 'Unknown'
        const email = engram.email || undefined
        const role = engram.role || undefined
        const userType = engram.userType || undefined
        const tags = engram.tags || []
        
        return (
          <EngramProfile
            key={engram.id}
            name={name}
            email={email}
            role={role}
            userType={userType}
            tags={tags}
            onClick={() => onSelectEngram(engram)}
          />
        )
      })}
    </div>
  )
}