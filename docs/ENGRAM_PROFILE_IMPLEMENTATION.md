# Engram Profile DynamoDB Implementation

This document describes the implementation of the Engram Profile feature with DynamoDB using AWS Amplify Gen2.

## Overview

The Engram Profile system stores user profiles with a composite key structure that supports efficient querying by business and user type.

## DynamoDB Schema

### Primary Key Structure
- **PK (Partition Key)**: `BUSINESS#<businessId>` (e.g., `BUSINESS#T096L62N0MB`)
- **SK (Sort Key)**: `USER#<userId>` (e.g., `USER#U096L62NHB7`)

### Global Secondary Index (GSI1)
- **GSI1PK**: `BUSINESS#<businessId>`
- **GSI1SK**: `TYPE#<userType>#USER#<userId>` (e.g., `TYPE#internal#USER#U096L62NHB7`)

This structure allows for:
1. Direct access to a specific user profile
2. Listing all users for a business
3. Querying users by business and type

## Implementation Details

### 1. Data Model (`amplify/data/resource.ts`)

The Amplify data model includes:
- Composite keys (PK, SK)
- Business and user identifiers
- Profile information (name, email, role, etc.)
- Slack integration fields
- Timestamps and counters
- GSI fields for efficient querying

### 2. Service Layer (`src/services/engramProfileService.ts`)

The service provides:
- **CRUD Operations**: Create, Read, Update, Delete profiles
- **Query Methods**: List by business, query by type, search profiles
- **Business Logic**: Interaction tracking, key generation
- **Error Handling**: Comprehensive error messages

Key methods:
- `createProfile()`: Creates a new Engram profile
- `getProfile()`: Retrieves a specific profile
- `listProfilesByBusiness()`: Lists all profiles for a business
- `queryProfilesByBusinessAndType()`: Filters profiles by user type
- `updateProfile()`: Updates profile information
- `recordInteraction()`: Tracks user interactions
- `searchProfiles()`: Searches profiles by name, email, or role

### 3. UI Components

#### Dashboard (`src/pages/dashboard/Dashboard.tsx`)
- Main interface for viewing and managing profiles
- Includes search, filtering, and profile creation

#### CreateProfileModal (`src/components/dashboard/CreateProfileModal.tsx`)
- Form for creating new Engram profiles
- Validates required fields
- Supports tags and Slack profile data

#### EngramProfile (`src/components/dashboard/EngramProfile.tsx`)
- Display component for individual profile cards

## Usage

### Creating a Profile

```typescript
import { EngramProfileService } from './services/engramProfileService'

const newProfile = await EngramProfileService.createProfile({
  businessId: 'T096L62N0MB',
  userId: 'U096L62NHB7',
  name: 'John Doe',
  email: 'john@example.com',
  userType: 'internal',
  role: 'Developer',
  tags: ['team', 'developer']
})
```

### Querying Profiles

```typescript
// Get all profiles for a business
const profiles = await EngramProfileService.listProfilesByBusiness('T096L62N0MB')

// Search profiles
const results = await EngramProfileService.searchProfiles('T096L62N0MB', 'john')

// Get a specific profile
const profile = await EngramProfileService.getProfile('T096L62N0MB', 'U096L62NHB7')
```

## Testing

Use the test utilities in `src/utils/testEngramProfile.ts`:

1. Open the browser console
2. Run test functions:
   ```javascript
   // Run all tests
   engramTests.runAllEngramTests()
   
   // Or run individual tests
   engramTests.testCreateEngramProfile()
   engramTests.testListEngramProfiles('T096L62N0MB')
   ```

## Deployment

1. Deploy the Amplify backend:
   ```bash
   npx ampx sandbox
   # or for production
   npx ampx pipeline-deploy --branch main
   ```

2. The DynamoDB table will be created automatically with the correct indexes

## Important Notes

1. **Composite Keys**: The system uses composite keys for efficient querying. Always use the helper methods in the service layer to generate keys.

2. **Business Context**: The current implementation uses a hardcoded business ID. In production, this should come from user authentication/context.

3. **Error Handling**: The service layer includes comprehensive error handling. Always wrap service calls in try-catch blocks.

4. **Timestamps**: The system automatically manages `firstSeen`, `lastUpdated`, and `lastInteraction` timestamps.

5. **Interaction Tracking**: Use `recordInteraction()` to track user activity and maintain accurate interaction counts.