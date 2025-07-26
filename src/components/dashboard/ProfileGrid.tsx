import React from 'react'
import { EngramProfile } from './EngramProfile'
import { Users } from 'lucide-react'
import styles from '../../styles/dashboard/Dashboard.module.css'

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
      <div className={styles.empty}>
        <Users className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>No profiles found</h3>
        <p className={styles.emptyText}>Try adjusting your filters or create a new profile to get started.</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
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