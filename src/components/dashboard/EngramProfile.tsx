import React from 'react'
import styles from '../../styles/dashboard/Dashboard.module.css'

interface EngramProfileProps {
  name: string
  email?: string
  role?: string
  userType?: string
  tags?: string[]
  onClick?: () => void
}

export const EngramProfile: React.FC<EngramProfileProps> = ({
  name,
  email,
  role,
  userType,
  tags,
  onClick
}) => {
  return (
    <div className={styles.profileCard} onClick={onClick}>
      <div className={styles.profileHeader}>
        <h3 className={styles.profileName}>{name}</h3>
        {role && <p className={styles.profileRole}>{role}</p>}
        {email && <p className={styles.profileEmail}>{email}</p>}
      </div>
      
      <div className={styles.profileMeta}>
        {userType && (
          <span className={`${styles.userType} ${styles[userType]}`}>
            {userType}
          </span>
        )}
        
        {tags && tags.length > 0 && (
          <div className={styles.profileTags}>
            {tags.map((tag, index) => (
              <span key={index} className={styles.profileTag}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}