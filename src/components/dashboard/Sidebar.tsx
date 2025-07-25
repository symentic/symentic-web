import React from 'react'
import { Users, Filter, Home, Shield} from 'lucide-react'
import symenticLogo from '../../assets/symentic.png'

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
    <div className="dashboard-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src={symenticLogo} alt="Symentic" />
          <h2>Symentic</h2>
        </div>
        <p className="sidebar-subtitle">Engram Management Console</p>
      </div>

      <div className="sidebar-stats">
        <div className="stat">
          <span className="stat-value">{engramCount}</span>
          <span className="stat-label">Filtered</span>
        </div>
        <div className="stat">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">Total</span>
        </div>
      </div>

      <div className="sidebar-filters">
        <h3>
          <Filter size={16} />
          Filters
        </h3>
        <ul>
          {filters.map(filter => (
            <li 
              key={filter.id}
              className={selectedFilter === filter.id ? 'active' : ''}
              onClick={() => onFilterChange(filter.id)}
            >
              {filter.icon}
              <span>{filter.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <p>© 2025 Symentic</p>
      </div>
    </div>
  )
}