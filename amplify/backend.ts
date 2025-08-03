import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { aws_iam as iam } from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
});

// Grant permissions to access the existing DynamoDB table
const authenticatedUserIamRole = backend.auth.resources.authenticatedUserIamRole;
authenticatedUserIamRole.addToPrincipalPolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:PutItem", 
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:UpdateItem",
      "dynamodb:DeleteItem",
      "dynamodb:BatchGetItem",
      "dynamodb:BatchWriteItem"
    ],
    resources: [
      "arn:aws:dynamodb:us-east-1:842733143746:table/SymenticProfileEngrams-prod",
      "arn:aws:dynamodb:us-east-1:842733143746:table/SymenticProfileEngrams-prod/index/*"
    ],
  })
);

// Also grant permissions to unauthenticated users if needed
const unauthenticatedUserIamRole = backend.auth.resources.unauthenticatedUserIamRole;
unauthenticatedUserIamRole.addToPrincipalPolicy(
  new iam.PolicyStatement({
    actions: [
      "dynamodb:GetItem",
      "dynamodb:PutItem",
      "dynamodb:Query",
      "dynamodb:Scan"
    ],
    resources: [
      "arn:aws:dynamodb:us-east-1:842733143746:table/SymenticProfileEngrams-prod",
      "arn:aws:dynamodb:us-east-1:842733143746:table/SymenticProfileEngrams-prod/index/*"
    ],
  })
);
