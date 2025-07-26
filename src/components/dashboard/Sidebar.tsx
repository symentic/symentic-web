import React from 'react'
import { Users, Filter, Home, Shield} from 'lucide-react'
import symenticLogo from '../../assets/symentic.png'
import styles from '../../styles/dashboard/Dashboard.module.css'

interface SidebarProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
  engramCount: number
  totalCount: number
}

export const Sidebar: React.FC<SidebarProps> = ({
  selectedFilter,
  onFilterChange,
  engramCount,
  totalCount
}) => {
  const filters = [
    { id: 'all', label: 'Engrams', icon: <Home size={18} /> },
    { id: 'internal', label: 'Internal', icon: <Shield size={18} /> },
    { id: 'external', label: 'External', icon: <Users size={18} /> },
  ]

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.logo}>
          <img src={symenticLogo} alt="Symentic" className={styles.logoImg} />
          <h2 className={styles.logoText}>Symentic</h2>
        </div>
        <p className={styles.subtitle}>Engram Management</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{engramCount}</span>
          <span className={styles.statLabel}>Filtered</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{totalCount}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
      </div>

      <div className={styles.filters}>
        <h3 className={styles.filtersTitle}>
          <Filter size={14} />
          Filters
        </h3>
        <ul className={styles.filterList}>
          {filters.map(filter => (
            <li 
              key={filter.id}
              className={`${styles.filterItem} ${selectedFilter === filter.id ? styles.active : ''}`}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.footer}>
        <p>© 2025 Symentic</p>
      </div>
    </div>
  )
}