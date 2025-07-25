import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../../amplify/data/resource'

const client = generateClient<Schema>()

export interface CreateEngramProfileInput {
  businessId: string
  userId: string
  name: string
  email: string
  description?: string
  role?: string
  userType: 'internal' | 'external'
  source?: string
  tags?: string[]
  expertise?: string[]
  enrichments?: any[]
  consent?: {
    given: boolean
    method: string
    timestamp: string
  }
  slackProfile?: {
    slackUserId: string
    displayName?: string
    realName?: string
    title?: string
    statusText?: string
    timezone?: string
    profilePictureUrl?: string
    isAdmin?: boolean
    isOwner?: boolean
  }
}

export class EngramProfileService {
  // Helper function to create composite keys
  private static createPK(businessId: string): string {
    return `BUSINESS#${businessId}`
  }

  private static createSK(userId: string): string {
    return `USER#${userId}`
  }

  private static createGSI1SK(userType: string, userId: string): string {
    return `TYPE#${userType}#USER#${userId}`
  }

  private static createProfileId(businessId: string, userId: string): string {
    return `profile_${businessId}_${userId}`
  }

  // Create a new Engram profile
  static async createProfile(input: CreateEngramProfileInput) {
    try {
      const now = new Date().toISOString()
      
      const profileData = {
        PK: this.createPK(input.businessId),
        SK: this.createSK(input.userId),
        businessId: input.businessId,
        userId: input.userId,
        name: input.name,
        email: input.email,
        description: input.description || 'Team Member at the organization',
        role: input.role || 'Team Member',
        userType: input.userType,
        source: input.source || 'manual',
        tags: input.tags || [],
        expertise: input.expertise || [],
        enrichments: input.enrichments || [],
        interactionCount: 0,
        firstSeen: now,
        lastInteraction: now,
        lastUpdated: now,
        consent: input.consent || {
          given: true,
          method: 'terms_acceptance',
          timestamp: now
        },
        slackProfile: input.slackProfile,
        GSI1PK: this.createPK(input.businessId),
        GSI1SK: this.createGSI1SK(input.userType, input.userId),
        id: this.createProfileId(input.businessId, input.userId)
      }

      const { data, errors } = await client.models.EngramProfile.create(profileData)
      
      if (errors) {
        throw new Error(`Failed to create profile: ${errors[0].message}`)
      }

      return data
    } catch (error) {
      console.error('Error creating Engram profile:', error)
      throw error
    }
  }

  // Get a specific profile by business ID and user ID
  static async getProfile(businessId: string, userId: string) {
    try {
      const { data, errors } = await client.models.EngramProfile.get({
        PK: this.createPK(businessId),
        SK: this.createSK(userId)
      })

      if (errors) {
        console.error('Error getting profile:', errors)
        return null
      }

      return data
    } catch (error) {
      console.error('Error getting Engram profile:', error)
      // Return null if profile not found instead of throwing
      return null
    }
  }

  // List all profiles for a business
  static async listProfilesByBusiness(businessId: string) {
    try {
      const { data, errors } = await client.models.EngramProfile.list({
        filter: {
          businessId: {
            eq: businessId
          }
        }
      })

      if (errors) {
        throw new Error(`Failed to list profiles: ${errors[0].message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error listing Engram profiles:', error)
      throw error
    }
  }

  // Query profiles by business and user type using GSI
  static async queryProfilesByBusinessAndType(businessId: string, userType?: string) {
    try {
      // If we have the GSI query field available, use it
      const queryInput = {
        GSI1PK: this.createPK(businessId)
      }

      if (userType) {
        // This would use the GSI to filter by user type more efficiently
        // For now, we'll use the list with filters
        const { data, errors } = await client.models.EngramProfile.list({
          filter: {
            businessId: {
              eq: businessId
            },
            userType: {
              eq: userType as 'internal' | 'external'
            }
          }
        })

        if (errors) {
          throw new Error(`Failed to query profiles: ${errors[0].message}`)
        }

        return data || []
      } else {
        return this.listProfilesByBusiness(businessId)
      }
    } catch (error) {
      console.error('Error querying Engram profiles:', error)
      throw error
    }
  }

  // Update a profile
  static async updateProfile(
    businessId: string, 
    userId: string, 
    updates: Partial<CreateEngramProfileInput>
  ) {
    try {
      const now = new Date().toISOString()
      
      const updateData: any = {
        PK: this.createPK(businessId),
        SK: this.createSK(userId),
        lastUpdated: now,
        ...updates
      }

      // Update GSI1SK if userType changes
      if (updates.userType) {
        updateData.GSI1SK = this.createGSI1SK(updates.userType, userId)
      }

      const { data, errors } = await client.models.EngramProfile.update(updateData)

      if (errors) {
        throw new Error(`Failed to update profile: ${errors[0].message}`)
      }

      return data
    } catch (error) {
      console.error('Error updating Engram profile:', error)
      throw error
    }
  }

  // Delete a profile
  static async deleteProfile(businessId: string, userId: string) {
    try {
      const { data, errors } = await client.models.EngramProfile.delete({
        PK: this.createPK(businessId),
        SK: this.createSK(userId)
      })

      if (errors) {
        throw new Error(`Failed to delete profile: ${errors[0].message}`)
      }

      return data
    } catch (error) {
      console.error('Error deleting Engram profile:', error)
      throw error
    }
  }

  // Update interaction count and last interaction
  static async recordInteraction(businessId: string, userId: string) {
    try {
      const profile = await this.getProfile(businessId, userId)
      
      if (!profile) {
        throw new Error('Profile not found')
      }

      const now = new Date().toISOString()
      const currentCount = profile.interactionCount || 0

      const { data, errors } = await client.models.EngramProfile.update({
        PK: this.createPK(businessId),
        SK: this.createSK(userId),
        interactionCount: currentCount + 1,
        lastInteraction: now,
        lastUpdated: now
      })

      if (errors) {
        throw new Error(`Failed to record interaction: ${errors[0].message}`)
      }

      return data
    } catch (error) {
      console.error('Error recording interaction:', error)
      throw error
    }
  }

  // Search profiles by name, email, or role
  static async searchProfiles(businessId: string, searchQuery: string) {
    try {
      const query = searchQuery.toLowerCase()
      
      const { data, errors } = await client.models.EngramProfile.list({
        filter: {
          businessId: {
            eq: businessId
          },
          or: [
            {
              name: {
                contains: query
              }
            },
            {
              email: {
                contains: query
              }
            },
            {
              role: {
                contains: query
              }
            }
          ]
        }
      })

      if (errors) {
        throw new Error(`Failed to search profiles: ${errors[0].message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error searching Engram profiles:', error)
      throw error
    }
  }
}