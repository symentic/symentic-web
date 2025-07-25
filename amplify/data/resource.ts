import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  
<<<<<<< HEAD
  Waitlist: a
    .model({
      email: a.string().required(),
      signedUpAt: a.datetime(),
      source: a.string(), // e.g. "homepage", "about-us", etc.
    })
=======
  EngramProfile: a
    .model({
      // Composite key fields
      PK: a.string().required(), // BUSINESS#T096L62N0MB
      SK: a.string().required(), // USER#U096L62NHB7
      
      // Business and User IDs
      businessId: a.string().required(),
      userId: a.string().required(),
      
      // Profile data
      name: a.string().required(),
      email: a.email().required(),
      description: a.string(),
      role: a.string(),
      userType: a.enum(['internal', 'external']),
      source: a.string(),
      
      // Arrays
      tags: a.string().array(),
      expertise: a.string().array(),
      enrichments: a.json().array(),
      
      // Counters and timestamps
      interactionCount: a.integer().default(0),
      firstSeen: a.datetime(),
      lastInteraction: a.datetime(),
      lastUpdated: a.datetime(),
      
      // Consent object
      consent: a.customType({
        given: a.boolean(),
        method: a.string(),
        timestamp: a.datetime(),
      }),
      
      // Slack profile
      slackProfile: a.customType({
        slackUserId: a.string(),
        displayName: a.string(),
        realName: a.string(),
        title: a.string(),
        statusText: a.string(),
        timezone: a.string(),
        profilePictureUrl: a.url(),
        isAdmin: a.boolean(),
        isOwner: a.boolean(),
      }),
      
      // GSI fields
      GSI1PK: a.string(), // BUSINESS#T096L62N0MB
      GSI1SK: a.string(), // TYPE#internal#USER#U096L62NHB7
      
      // Additional fields
      id: a.string(), // profile_T096L62N0MB_U096L62NHB7
      customFields: a.json(),
    })
    .identifier(['PK', 'SK'])
    .secondaryIndexes((index) => [
      index('GSI1PK').sortKeys(['GSI1SK']).queryField('engramsByBusinessAndType'),
    ])
>>>>>>> e0b2c7a (d)
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
