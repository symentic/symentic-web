import React from 'react'
import styles from '../../styles/dashboard/Dashboard.module.css'

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className={`${styles.profileCard} ${styles.skeleton}`}>
      <div className={styles.profileHeader}>
        <div className={styles.skeletonLine} style={{ width: '60%', height: '20px' }} />
        <div className={styles.skeletonLine} style={{ width: '40%', height: '16px', marginTop: '8px' }} />
        <div className={styles.skeletonLine} style={{ width: '80%', height: '14px', marginTop: '8px' }} />
      </div>
      
      <div className={styles.profileMeta}>
        <div className={styles.skeletonLine} style={{ width: '80px', height: '24px' }} />
        <div style={{ display: 'flex', gap: '8px' }}>
          <div className={styles.skeletonLine} style={{ width: '60px', height: '20px' }} />
          <div className={styles.skeletonLine} style={{ width: '60px', height: '20px' }} />
        </div>
      </div>
    </div>
  )
}