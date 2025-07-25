import React, { useState } from 'react'
import { EngramProfileService, CreateEngramProfileInput } from '../../services/engramProfileService'

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
  const [formData, setFormData] = useState<Partial<CreateEngramProfileInput>>({
    businessId,
    userType: 'internal',
    tags: []
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
      
      await EngramProfileService.createProfile({
        ...formData,
        businessId,
        userId: formData.userId!,
        name: formData.name!,
        email: formData.email!,
        userType: formData.userType as 'internal' | 'external'
      })
      
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating profile:', err)
      setError('Failed to create profile. Please try again.')
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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Create New Engram Profile</h2>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">User ID *</label>
            <input
              type="text"
              id="userId"
              value={formData.userId || ''}
              onChange={e => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              placeholder="e.g., U096L62NHB7"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="name">Name *</label>
            <input
              type="text"
              id="name"
              value={formData.name || ''}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email || ''}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input
              type="text"
              id="role"
              value={formData.role || ''}
              onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Team Member, Developer"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Brief description of the user"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <select
              id="userType"
              value={formData.userType}
              onChange={e => setFormData(prev => ({ ...prev, userType: e.target.value as 'internal' | 'external' }))}
            >
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="source">Source</label>
            <input
              type="text"
              id="source"
              value={formData.source || ''}
              onChange={e => setFormData(prev => ({ ...prev, source: e.target.value }))}
              placeholder="e.g., slack, manual"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="tags">Tags (Press Enter to add)</label>
            <input
              type="text"
              id="tags"
              onKeyDown={handleTagInput}
              placeholder="Add tags..."
            />
            <div className="tags-list">
              {formData.tags?.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="form-group slack-section">
            <h3>Slack Profile (Optional)</h3>
            
            <label htmlFor="slackUserId">Slack User ID</label>
            <input
              type="text"
              id="slackUserId"
              value={formData.slackProfile?.slackUserId || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                slackProfile: {
                  ...prev.slackProfile,
                  slackUserId: e.target.value
                }
              }))}
            />
            
            <label htmlFor="displayName">Display Name</label>
            <input
              type="text"
              id="displayName"
              value={formData.slackProfile?.displayName || ''}
              onChange={e => setFormData(prev => ({
                ...prev,
                slackProfile: {
                  ...prev.slackProfile,
                  displayName: e.target.value
                }
              }))}
            />
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}