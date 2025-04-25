/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

// Create a Supabase client with admin privileges for server-side operations
// This should only be used in server-side contexts
export const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

/**
 * Deletes a user from the Supabase authentication system
 * This function should only be called from server-side code
 */
export async function deleteAuthUser(userId: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }
  
  try {
    const { error } = await adminClient.auth.admin.deleteUser(userId);
    if (error) {
      console.error('Error deleting auth user:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteAuthUser:', err);
    return { success: false, error: err.message || 'Unknown error' };
  }
}
