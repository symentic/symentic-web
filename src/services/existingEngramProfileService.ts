import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand, DeleteCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { fetchAuthSession } from 'aws-amplify/auth';

// Initialize the DynamoDB client with Amplify credentials
let docClient: DynamoDBDocumentClient | null = null;

async function getDocClient() {
  if (!docClient) {
    const session = await fetchAuthSession();
    const client = new DynamoDBClient({
      region: "us-east-1",
      credentials: session.credentials,
    });
    docClient = DynamoDBDocumentClient.from(client, {
      marshallOptions: {
        removeUndefinedValues: true
      }
    });
  }
  return docClient;
}

const TABLE_NAME = "SymenticProfileEngrams-prod";

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

export class ExistingEngramProfileService {
  // Helper function to create composite keys
  private static createPK(businessId: string): string {
    // Pattern: symentic_ + first 6 characters of businessId in lowercase
    // e.g., T096L62N0MB -> symentic_t096l6
    // e.g., T0A1B2C3D4 -> symentic_t0a1b2
    return `symentic_${businessId.toLowerCase().substring(0, 6)}`
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
      const docClient = await getDocClient();
      const now = new Date().toISOString();
      
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
      };

      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: profileData,
        ConditionExpression: "attribute_not_exists(PK) AND attribute_not_exists(SK)"
      });

      await docClient.send(command);
      return profileData;
    } catch (error: any) {
      if (error.name === 'ConditionalCheckFailedException') {
        throw new Error('Profile already exists for this user');
      }
      console.error('Error creating Engram profile:', error);
      throw error;
    }
  }

  // Get a specific profile by business ID and user ID
  static async getProfile(businessId: string, userId: string) {
    try {
      const docClient = await getDocClient();
      const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: this.createPK(businessId),
          SK: this.createSK(userId)
        }
      });

      const response = await docClient.send(command);
      return response.Item || null;
    } catch (error) {
      console.error('Error getting Engram profile:', error);
      return null;
    }
  }

  // List all profiles for a business
  static async listProfilesByBusiness(businessId: string) {
    try {
      const docClient = await getDocClient();
      const command = new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": this.createPK(businessId)
        }
      });

      const response = await docClient.send(command);
      return response.Items || [];
    } catch (error) {
      console.error('Error listing Engram profiles:', error);
      throw error;
    }
  }

  // List all profiles from all businesses
  static async listAllProfiles() {
    try {
      const docClient = await getDocClient();
      const items: any[] = [];
      let lastEvaluatedKey: any = undefined;
      
      // Scan in batches to get all profiles
      do {
        const command = new ScanCommand({
          TableName: TABLE_NAME,
          ExclusiveStartKey: lastEvaluatedKey,
          FilterExpression: "begins_with(SK, :sk)",
          ExpressionAttributeValues: {
            ":sk": "USER#"
          }
        });

        const response = await docClient.send(command);
        if (response.Items) {
          items.push(...response.Items);
        }
        lastEvaluatedKey = response.LastEvaluatedKey;
      } while (lastEvaluatedKey);
      
      return items;
    } catch (error) {
      console.error('Error listing all Engram profiles:', error);
      throw error;
    }
  }

  // Query profiles by business and user type using GSI
  static async queryProfilesByBusinessAndType(businessId: string, userType?: string) {
    try {
      const docClient = await getDocClient();
      
      if (userType) {
        // Use GSI to query by business and type
        const command = new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "GSI1", // You may need to verify the actual GSI name in your table
          KeyConditionExpression: "GSI1PK = :pk AND begins_with(GSI1SK, :sk)",
          ExpressionAttributeValues: {
            ":pk": this.createPK(businessId),
            ":sk": `TYPE#${userType}#`
          }
        });

        const response = await docClient.send(command);
        return response.Items || [];
      } else {
        return this.listProfilesByBusiness(businessId);
      }
    } catch (error) {
      console.error('Error querying Engram profiles:', error);
      throw error;
    }
  }

  // Update a profile
  static async updateProfile(
    businessId: string, 
    userId: string, 
    updates: Partial<CreateEngramProfileInput>
  ) {
    try {
      const docClient = await getDocClient();
      const now = new Date().toISOString();
      
      // Build update expression dynamically
      const updateExpressions: string[] = ['lastUpdated = :lastUpdated'];
      const expressionAttributeValues: any = {
        ':lastUpdated': now
      };

      // Add each update field
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined && key !== 'businessId' && key !== 'userId') {
          updateExpressions.push(`${key} = :${key}`);
          expressionAttributeValues[`:${key}`] = value;
        }
      });

      // Update GSI1SK if userType changes
      if (updates.userType) {
        updateExpressions.push('GSI1SK = :GSI1SK');
        expressionAttributeValues[':GSI1SK'] = this.createGSI1SK(updates.userType, userId);
      }

      const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: this.createPK(businessId),
          SK: this.createSK(userId)
        },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW"
      });

      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error('Error updating Engram profile:', error);
      throw error;
    }
  }

  // Delete a profile
  static async deleteProfile(businessId: string, userId: string) {
    try {
      const docClient = await getDocClient();
      const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: this.createPK(businessId),
          SK: this.createSK(userId)
        },
        ReturnValues: "ALL_OLD"
      });

      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error('Error deleting Engram profile:', error);
      throw error;
    }
  }

  // Update interaction count and last interaction
  static async recordInteraction(businessId: string, userId: string) {
    try {
      const docClient = await getDocClient();
      const now = new Date().toISOString();

      const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
          PK: this.createPK(businessId),
          SK: this.createSK(userId)
        },
        UpdateExpression: "SET interactionCount = interactionCount + :inc, lastInteraction = :now, lastUpdated = :now",
        ExpressionAttributeValues: {
          ":inc": 1,
          ":now": now
        },
        ReturnValues: "ALL_NEW"
      });

      const response = await docClient.send(command);
      return response.Attributes;
    } catch (error) {
      console.error('Error recording interaction:', error);
      throw error;
    }
  }

  // Search profiles by name, email, or role
  static async searchProfiles(businessId: string, searchQuery: string) {
    try {
      const query = searchQuery.toLowerCase();
      
      // First, get all profiles for the business
      const profiles = await this.listProfilesByBusiness(businessId);
      
      // Filter in memory (not ideal for large datasets, but works for now)
      return profiles.filter(profile => {
        const nameMatch = profile.name?.toLowerCase().includes(query);
        const emailMatch = profile.email?.toLowerCase().includes(query);
        const roleMatch = profile.role?.toLowerCase().includes(query);
        return nameMatch || emailMatch || roleMatch;
      });
    } catch (error) {
      console.error('Error searching Engram profiles:', error);
      throw error;
    }
  }
}