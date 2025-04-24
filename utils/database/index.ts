export * from './client';
export * from './server';

// Export functions for working with duplicate entries
export { cleanupDuplicateEntries } from './client/userManagementSync';
export { cleanupUserRoles } from './client/userRoleSync';

// This approach uses the index.ts files you created in each directory
// But be careful about importing server code in client components

// Add future database utility exports here
