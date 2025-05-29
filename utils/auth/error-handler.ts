/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Global auth error handler utility
 * Handles common authentication errors across the application
 */

import { createClient } from '@/utils/supabase/client';

/**
 * Check if an error is related to invalid refresh tokens
 */
export function isInvalidRefreshTokenError(error: any): boolean {
  if (!error) return false;
  
  const errorMessage = error.message || error.error_description || '';
  const errorCode = error.code || '';
  
  return (
    errorMessage.includes('Invalid Refresh Token') ||
    errorMessage.includes('refresh_token_not_found') ||
    errorCode === 'refresh_token_not_found' ||
    errorMessage.includes('Invalid JWT') ||
    errorMessage.includes('JWT expired')
  );
}

/**
 * Handle authentication errors globally
 * This should be called whenever an API request fails with auth errors
 */
export async function handleAuthError(error: any): Promise<void> {
  if (isInvalidRefreshTokenError(error)) {
    console.log('Auth error detected, clearing session:', error);
    
    const supabase = createClient();
    
    try {
      // Sign out to clear all auth state
      await supabase.auth.signOut();
    } catch (signOutError) {
      console.error('Error during sign out:', signOutError);
    }
    
    // Clear any remaining auth data
    if (typeof window !== 'undefined') {
      // Clear localStorage
      const authKeys = [
        'supabase.auth.token',
        'sb-access-token', 
        'sb-refresh-token',
        'supabase-auth-token'
      ];
      
      authKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Redirect to login
      window.location.href = '/login';
    }
  }
}

/**
 * Wrapper for fetch calls that handles auth errors
 */
export async function fetchWithAuthHandler(url: string, options?: RequestInit): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Check if the response indicates an auth error
    if (response.status === 401) {
      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { error: responseText };
      }
      
      if (isInvalidRefreshTokenError(responseData)) {
        await handleAuthError(responseData);
        throw new Error('Authentication session expired');
      }
    }
    
    return response;
  } catch (error) {
    if (isInvalidRefreshTokenError(error)) {
      await handleAuthError(error);
      throw new Error('Authentication session expired');
    }
    throw error;
  }
}
