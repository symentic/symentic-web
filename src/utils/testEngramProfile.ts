import { EngramProfileService, CreateEngramProfileInput } from '../services/engramProfileService'

// Test data that matches your DynamoDB structure
const testProfile: CreateEngramProfileInput = {
  businessId: 'T096L62N0MB',
  userId: 'U096L62NHB7',
  name: 'William Zhang',
  email: 'zhengwu1117@gmail.com',
  description: 'Team Member at the organization',
  role: 'Team Member',
  userType: 'internal',
  source: 'slack',
  tags: ['owner', 'admin', 'team'],
  expertise: [],
  enrichments: [],
  consent: {
    given: true,
    method: 'terms_acceptance',
    timestamp: new Date().toISOString()
  },
  slackProfile: {
    slackUserId: 'U096L62NHB7',
    displayName: 'zhengwu1117',
    realName: 'William Zhang',
    title: '',
    statusText: '',
    timezone: 'America/New_York',
    profilePictureUrl: 'https://avatars.slack-edge.com/2025-07-20/9224201186421_f6f6fb9315daf502a055_512.png',
    isAdmin: true,
    isOwner: true
  }
}

// Function to test creating an Engram profile
export async function testCreateEngramProfile() {
  try {
    console.log('Creating test Engram profile...')
    const result = await EngramProfileService.createProfile(testProfile)
    console.log('Profile created successfully:', result)
    return result
  } catch (error) {
    console.error('Error creating test profile:', error)
    throw error
  }
}

// Function to test getting an Engram profile
export async function testGetEngramProfile(businessId: string, userId: string) {
  try {
    console.log(`Getting Engram profile for business: ${businessId}, user: ${userId}`)
    const result = await EngramProfileService.getProfile(businessId, userId)
    console.log('Profile retrieved successfully:', result)
    return result
  } catch (error) {
    console.error('Error getting profile:', error)
    throw error
  }
}

// Function to test listing all profiles for a business
export async function testListEngramProfiles(businessId: string) {
  try {
    console.log(`Listing all profiles for business: ${businessId}`)
    const result = await EngramProfileService.listProfilesByBusiness(businessId)
    console.log(`Found ${result.length} profiles:`, result)
    return result
  } catch (error) {
    console.error('Error listing profiles:', error)
    throw error
  }
}

// Function to test updating an Engram profile
export async function testUpdateEngramProfile(businessId: string, userId: string) {
  try {
    console.log(`Updating profile for business: ${businessId}, user: ${userId}`)
    const updates = {
      role: 'Senior Developer',
      tags: ['owner', 'admin', 'team', 'developer'],
      description: 'Senior Developer and Technical Lead'
    }
    const result = await EngramProfileService.updateProfile(businessId, userId, updates)
    console.log('Profile updated successfully:', result)
    return result
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error
  }
}

// Function to test recording an interaction
export async function testRecordInteraction(businessId: string, userId: string) {
  try {
    console.log(`Recording interaction for business: ${businessId}, user: ${userId}`)
    const result = await EngramProfileService.recordInteraction(businessId, userId)
    console.log('Interaction recorded successfully:', result)
    return result
  } catch (error) {
    console.error('Error recording interaction:', error)
    throw error
  }
}

// Function to test searching profiles
export async function testSearchProfiles(businessId: string, searchQuery: string) {
  try {
    console.log(`Searching profiles in business: ${businessId} with query: "${searchQuery}"`)
    const result = await EngramProfileService.searchProfiles(businessId, searchQuery)
    console.log(`Found ${result.length} matching profiles:`, result)
    return result
  } catch (error) {
    console.error('Error searching profiles:', error)
    throw error
  }
}

// Function to run all tests
export async function runAllEngramTests() {
  const businessId = 'T096L62N0MB'
  const userId = 'U096L62NHB7'
  
  try {
    console.log('Starting Engram profile tests...\n')
    
    // Test 1: Create profile
    console.log('Test 1: Create Profile')
    await testCreateEngramProfile()
    console.log('\n')
    
    // Test 2: Get profile
    console.log('Test 2: Get Profile')
    await testGetEngramProfile(businessId, userId)
    console.log('\n')
    
    // Test 3: List profiles
    console.log('Test 3: List Profiles')
    await testListEngramProfiles(businessId)
    console.log('\n')
    
    // Test 4: Update profile
    console.log('Test 4: Update Profile')
    await testUpdateEngramProfile(businessId, userId)
    console.log('\n')
    
    // Test 5: Record interaction
    console.log('Test 5: Record Interaction')
    await testRecordInteraction(businessId, userId)
    console.log('\n')
    
    // Test 6: Search profiles
    console.log('Test 6: Search Profiles')
    await testSearchProfiles(businessId, 'William')
    console.log('\n')
    
    console.log('All tests completed successfully!')
  } catch (error) {
    console.error('Test suite failed:', error)
  }
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).engramTests = {
    testCreateEngramProfile,
    testGetEngramProfile,
    testListEngramProfiles,
    testUpdateEngramProfile,
    testRecordInteraction,
    testSearchProfiles,
    runAllEngramTests
  }
  
  console.log('Engram test functions loaded. Available functions:')
  console.log('- engramTests.testCreateEngramProfile()')
  console.log('- engramTests.testGetEngramProfile(businessId, userId)')
  console.log('- engramTests.testListEngramProfiles(businessId)')
  console.log('- engramTests.testUpdateEngramProfile(businessId, userId)')
  console.log('- engramTests.testRecordInteraction(businessId, userId)')
  console.log('- engramTests.testSearchProfiles(businessId, searchQuery)')
  console.log('- engramTests.runAllEngramTests()')
}