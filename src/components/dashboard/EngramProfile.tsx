import React from 'react'

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
    <div className="engram-profile" onClick={onClick}>
      <div className="profile-header">
        <div className="profile-info">
          <h3>{name}</h3>
          {role && <p className="profile-role">{role}</p>}
          {email && <p className="profile-email">{email}</p>}
        </div>
      </div>
      
      <div className="profile-meta">
        {userType && (
          <span className={`user-type ${userType}`}>
            {userType}
          </span>
        )}
        
        {tags && tags.length > 0 && (
          <div className="profile-tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}