/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Built on first use rather than at import time: an empty URL makes createClient
// throw, which would break `next build` while collecting page data for any route
// that imports this module.
let cachedAdminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (!cachedAdminClient) {
    cachedAdminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://unconfigured.invalid',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'unconfigured'
    );
  }
  return cachedAdminClient;
}

// Supabase client with admin privileges, for server-side contexts only.
export const adminClient = new Proxy({} as SupabaseClient, {
  get(_target, property) {
    const client = getAdminClient() as unknown as Record<string | symbol, unknown>;
    const value = client[property];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

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
