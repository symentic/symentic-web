import React from 'react'
import { X, Mail, Tag, User, Clock, Shield, Globe, CheckCircle, Activity, Calendar, Hash } from 'lucide-react'
import styles from '../../styles/dashboard/Modal.module.css'

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
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal} ${styles.detailModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.detailHeader}>
          <button className={styles.detailCloseButton} onClick={onClose}>
            <X size={20} />
          </button>
          
          <div className={styles.detailProfileHeader}>
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt={name} className={styles.detailAvatar} />
            ) : (
              <div className={styles.detailAvatarPlaceholder}>
                <User size={32} />
              </div>
            )}
            <div className={styles.detailHeaderInfo}>
              <h2 className={styles.detailName}>{name}</h2>
              {role && <p className={styles.detailRole}>{role}</p>}
              {email && (
                <p className={styles.detailEmail}>
                  <Mail size={14} />
                  {email}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className={styles.detailSections}>
          <section className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <User size={16} />
              Basic Information
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>User Type</span>
                <span className={styles.detailValue}>{userType || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Source</span>
                <span className={styles.detailValue}>{source || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>User ID</span>
                <span className={styles.detailValue}>{userId || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Business ID</span>
                <span className={styles.detailValue}>{businessId || 'N/A'}</span>
              </div>
            </div>
          </section>

          {description && (
            <section className={styles.detailSection}>
              <h3 className={styles.detailSectionTitle}>Description</h3>
              <p>{description}</p>
            </section>
          )}

          <section className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <Hash size={16} />
              Slack Profile
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Display Name</span>
                <span className={styles.detailValue}>{displayName || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Real Name</span>
                <span className={styles.detailValue}>{realName || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Title</span>
                <span className={styles.detailValue}>{title || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Timezone</span>
                <span className={styles.detailValue}>{timezone || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Status</span>
                <span className={styles.detailValue}>{statusText || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Permissions</span>
                <div className={styles.detailBadges}>
                  {isOwner && (
                    <span className={`${styles.badge} ${styles.owner}`}>
                      <Shield size={12} />
                      Owner
                    </span>
                  )}
                  {isAdmin && (
                    <span className={`${styles.badge} ${styles.admin}`}>
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                  {!isOwner && !isAdmin && (
                    <span className={`${styles.badge} ${styles.member}`}>
                      <User size={12} />
                      Member
                    </span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.detailSection}>
            <h3 className={styles.detailSectionTitle}>
              <Activity size={16} />
              Activity & Timeline
            </h3>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>First Seen</span>
                <span className={styles.detailValue}>{formatDate(firstSeen)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Interaction</span>
                <span className={styles.detailValue}>{formatDate(lastInteraction)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Last Updated</span>
                <span className={styles.detailValue}>{formatDate(lastUpdated)}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Interaction Count</span>
                <span className={`${styles.detailValue} ${styles.detailCount}`}>
                  {interactionCount || '0'}
                </span>
              </div>
            </div>
          </section>

          {consent && (
            <section className={styles.detailSection}>
              <h3 className={styles.detailSectionTitle}>
                <CheckCircle size={16} />
                Consent Information
              </h3>
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Consent Given</span>
                  <span className={`${styles.detailValue} ${consentGiven ? styles.consentYes : styles.consentNo}`}>
                    {consentGiven ? (
                      <><CheckCircle size={14} /> Yes</>
                    ) : (
                      <>No</>
                    )}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Method</span>
                  <span className={styles.detailValue}>{consentMethod || 'N/A'}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Timestamp</span>
                  <span className={styles.detailValue}>{formatDate(consentTimestamp)}</span>
                </div>
              </div>
            </section>
          )}

          {tags.length > 0 && (
            <section className={styles.detailSection}>
              <h3 className={styles.detailSectionTitle}>
                <Tag size={16} />
                Tags
              </h3>
              <div className={styles.detailTags}>
                {tags.map((tag, index) => (
                  <span key={index} className={styles.detailTag}>
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