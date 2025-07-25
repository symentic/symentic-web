import React from 'react'
import { X, Calendar, Mail, Shield, Clock, Tag, User } from 'lucide-react'

interface ProfileDetailProps {
  engram: any
  onClose: () => void
}

export const ProfileDetail: React.FC<ProfileDetailProps> = ({
  engram,
  onClose
}) => {
  const name = engram.name || 'Unknown'
  const email = engram.email
  const role = engram.role
  const description = engram.description
  const userType = engram.userType
  const businessId = engram.businessId
  const userId = engram.userId
  const source = engram.source
  const firstSeen = engram.firstSeen
  const lastInteraction = engram.lastInteraction
  const lastUpdated = engram.lastUpdated
  const interactionCount = engram.interactionCount
  const tags = engram.tags || []
  
  const slackProfile = engram.slackProfile
  const displayName = slackProfile?.displayName
  const realName = slackProfile?.realName
  const profilePictureUrl = slackProfile?.profilePictureUrl
  const isAdmin = slackProfile?.isAdmin
  const isOwner = slackProfile?.isOwner
  const timezone = slackProfile?.timezone
  const title = slackProfile?.title
  const statusText = slackProfile?.statusText

  const consent = engram.consent
  const consentGiven = consent?.given
  const consentMethod = consent?.method
  const consentTimestamp = consent?.timestamp

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="profile-detail-overlay" onClick={onClose}>
      <div className="profile-detail" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="detail-header">
          <div className="detail-info">
            <h2>{name}</h2>
            {role && <p className="detail-role">{role}</p>}
            {email && (
              <p className="detail-email">
                <Mail size={16} />
                {email}
              </p>
            )}
          </div>
        </div>

        <div className="detail-sections">
          <section className="detail-section">
            <h3>Basic Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">User Type</span>
                <span className="detail-value">{userType || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Source</span>
                <span className="detail-value">{source || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">User ID</span>
                <span className="detail-value">{userId || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Business ID</span>
                <span className="detail-value">{businessId || 'N/A'}</span>
              </div>
            </div>
          </section>

          {description && (
            <section className="detail-section">
              <h3>Description</h3>
              <p>{description}</p>
            </section>
          )}

          <section className="detail-section">
            <h3>Slack Profile</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Display Name</span>
                <span className="detail-value">{displayName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Real Name</span>
                <span className="detail-value">{realName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Title</span>
                <span className="detail-value">{title || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Timezone</span>
                <span className="detail-value">{timezone || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Status</span>
                <span className="detail-value">{statusText || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Permissions</span>
                <span className="detail-value">
                  {isOwner && <span className="badge owner">Owner</span>}
                  {isAdmin && <span className="badge admin">Admin</span>}
                  {!isOwner && !isAdmin && <span>Member</span>}
                </span>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <h3>Activity & Timeline</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">First Seen</span>
                <span className="detail-value">{formatDate(firstSeen)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Interaction</span>
                <span className="detail-value">{formatDate(lastInteraction)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{formatDate(lastUpdated)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Interaction Count</span>
                <span className="detail-value">{interactionCount || '0'}</span>
              </div>
            </div>
          </section>

          {consent && (
            <section className="detail-section">
              <h3>Consent Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Consent Given</span>
                  <span className="detail-value">
                    {consentGiven ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Method</span>
                  <span className="detail-value">{consentMethod || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Timestamp</span>
                  <span className="detail-value">{formatDate(consentTimestamp)}</span>
                </div>
              </div>
            </section>
          )}

          {tags.length > 0 && (
            <section className="detail-section">
              <h3>Tags</h3>
              <div className="detail-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="detail-tag">
                    <Tag size={14} />
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}