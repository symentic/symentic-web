import React, { useState } from 'react'
import { ExistingExistingEngramProfileService, CreateEngramProfileInput } from '../../services/existingExistingEngramProfileService'
import { RefreshCw, UserPlus, AlertCircle, Info, X } from 'lucide-react'
import styles from '../../styles/dashboard/Modal.module.css'

interface CreateProfileModalProps {
  businessId: string
  onClose: () => void
  onSuccess: () => void
}

export const CreateProfileModal: React.FC<CreateProfileModalProps> = ({
  businessId,
  onClose,
  onSuccess
}) => {
  const generateUserId = () => {
    // Generate a unique user ID in Slack-like format
    const prefix = 'U'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  const [formData, setFormData] = useState<Partial<CreateEngramProfileInput>>({
    businessId,
    userType: 'internal',
    tags: [],
    userId: generateUserId()
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.userId || !formData.name || !formData.email) {
      setError('Please fill in all required fields')
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      
      const profileData: CreateEngramProfileInput = {
        businessId,
        userId: formData.userId!,
        name: formData.name!,
        email: formData.email!,
        userType: formData.userType as 'internal' | 'external',
        description: formData.description,
        role: formData.role,
        source: formData.source || 'manual',
        tags: formData.tags || [],
        expertise: [],
        enrichments: []
      }
      
      // Only add slackProfile if slackUserId is provided
      if (formData.slackProfile?.slackUserId) {
        profileData.slackProfile = {
          slackUserId: formData.slackProfile.slackUserId,
          displayName: formData.slackProfile.displayName,
          realName: formData.slackProfile.realName,
          title: formData.slackProfile.title,
          statusText: formData.slackProfile.statusText,
          timezone: formData.slackProfile.timezone,
          profilePictureUrl: formData.slackProfile.profilePictureUrl,
          isAdmin: formData.slackProfile.isAdmin || false,
          isOwner: formData.slackProfile.isOwner || false
        }
      }
      
      await ExistingEngramProfileService.createProfile(profileData)
      
      onSuccess()
      onClose()
    } catch (err: any) {
      console.error('Error creating profile:', err)
      
      // Handle specific error cases
      if (err.message?.includes('ConditionalCheckFailedException') || err.message?.includes('Profile already exists')) {
        setError(`A profile already exists for User ID: ${formData.userId}`)
      } else if (err.name === 'ConditionalCheckFailedException') {
        setError(`A profile already exists for User ID: ${formData.userId}`)
      } else {
        setError(err.message || 'Failed to create profile. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault()
      const newTag = e.currentTarget.value.trim()
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag]
      }))
      e.currentTarget.value = ''
    }
  }

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }))
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.title}>
            <div className={styles.titleIcon}>
              <UserPlus size={24} />
            </div>
            Create New Engram Profile
          </h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.modalContent}>
          {error && (
            <div className={styles.error}>
              <AlertCircle size={20} className={styles.errorIcon} />
              {error}
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={`${styles.formGroup} ${styles.required}`}>
                <label className={styles.label} htmlFor="userId">
                  User ID
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, userId: generateUserId() }))}
                    className={styles.generateButton}
                    title="Generate new ID"
                  >
                    <RefreshCw size={14} />
                  </button>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="userId"
                  value={formData.userId || ''}
                  onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
                  placeholder="e.g., U096L62NHB7"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
          
              <div className={`${styles.formGroup} ${styles.required}`}>
                <label className={styles.label} htmlFor="name">Name</label>
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  value={formData.name || ''}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  required
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
            </div>
          
            <div className={`${styles.formGroup} ${styles.required}`}>
              <label className={styles.label} htmlFor="email">Email</label>
              <input
                className={styles.input}
                type="email"
                id="email"
                value={formData.email || ''}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john.doe@example.com"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="role">Role</label>
                <input
                  className={styles.input}
                  type="text"
                  id="role"
                  value={formData.role || ''}
                  onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
                  placeholder="e.g., Developer"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
          
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Description
                <span className={styles.labelHelper}>(Optional)</span>
              </label>
              <textarea
                className={styles.textarea}
                id="description"
                value={formData.description || ''}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                placeholder="Brief description of the user's role and responsibilities"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </div>
          
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="userType">User Type</label>
                <select
                  className={styles.select}
                  id="userType"
                  value={formData.userType}
                  onChange={e => setFormData(prev => ({ ...prev, userType: e.target.value as 'internal' | 'external' }))}
                >
                  <option value="internal">Internal</option>
                  <option value="external">External</option>
                </select>
              </div>
            </div>
          
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="source">
                  Source
                  <span className={styles.labelHelper}>(Optional)</span>
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="source"
                  value={formData.source || ''}
                  onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., slack, manual"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </div>
          
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="tags">
                  Tags
                  <span className={styles.labelHelper}>(Press Enter)</span>
                </label>
                <div className={styles.tagInputField}>
                  <input
                    className={styles.input}
                    type="text"
                    id="tags"
                    onKeyDown={handleTagInput}
                    placeholder="Add tags..."
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                {formData.tags && formData.tags.length > 0 && (
                  <div className={styles.tagList}>
                    {formData.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className={styles.tagRemove}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Slack Profile</h3>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="slackUserId">Slack User ID</label>
                  <input
                    className={styles.input}
                    type="text"
                    id="slackUserId"
                    value={formData.slackProfile?.slackUserId || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      slackProfile: {
                        ...prev.slackProfile,
                        slackUserId: e.target.value
                      } as any
                    }))}
                    placeholder="U123456789"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="displayName">Display Name</label>
                  <input
                    className={styles.input}
                    type="text"
                    id="displayName"
                    value={formData.slackProfile?.displayName || ''}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      slackProfile: {
                        ...prev.slackProfile,
                        displayName: e.target.value
                      } as any
                    }))}
                    placeholder="@johndoe"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>
              </div>
            </div>
          
          </form>
        </div>
        
        <div className={styles.actions}>
          <div className={styles.actionsLeft}>
            <Info size={16} />
            <span>Fields marked with * are required</span>
          </div>
          <div className={styles.actionsRight}>
            <button className={`${styles.button} ${styles.cancelButton}`} type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button className={`${styles.button} ${styles.submitButton}`} type="submit" onClick={handleSubmit} disabled={isLoading}>
              <UserPlus size={16} />
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}