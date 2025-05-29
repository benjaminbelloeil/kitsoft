import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Check if an error is a refresh token error
 */
function isRefreshTokenError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  
  const authError = error as { message?: string; code?: string };
  return Boolean(
    authError.message?.includes('Invalid Refresh Token') ||
    authError.message?.includes('refresh_token_not_found') ||
    authError.code === 'refresh_token_not_found' ||
    authError.message?.includes('JWT expired') ||
    authError.message?.includes('Invalid JWT')
  );
}

/**
 * Server-side utility to get the authenticated user
 * Redirects to login if no user is found
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) {
    // If it's a refresh token error, redirect with a specific message
    if (isRefreshTokenError(error)) {
      redirect('/login?message=session_expired');
    }
    redirect('/login');
  }
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Get the authenticated user without redirecting
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // Log refresh token errors for debugging
  if (error && isRefreshTokenError(error)) {
    console.log('Refresh token error in getCurrentUser:', error);
  }
  
  return user;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  // If there's a refresh token error, consider user as not authenticated
  if (error && isRefreshTokenError(error)) {
    return false;
  }
  
  return !!user;
}

/**
 * Check if the current user has admin privileges
 */
export async function isAdmin(): Promise<boolean> {
  try {
    // Use the API endpoint to check admin status
    const response = await fetch('/api/user/level/is-admin', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if the current user has project lead privileges (level 3)
 */
export async function isProjectLead(): Promise<boolean> {
  try {
    // Use the API endpoint to check project lead status
    const response = await fetch('/api/user/level/is-project-lead', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isProjectLead === true;
  } catch (error) {
    console.error('Error checking project lead status:', error);
    return false;
  }
}

/**
 * Check if the current user has people lead privileges (level 2)
 */
export async function isPeopleLead(): Promise<boolean> {
  try {
    // Use the API endpoint to check people lead status
    const response = await fetch('/api/user/level/is-people-lead', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isPeopleLead === true;
  } catch (error) {
    console.error('Error checking people lead status:', error);
    return false;
  }
}

/**
 * Check if the current user has project manager privileges (level 4)
 */
export async function isProjectManager(): Promise<boolean> {
  try {
    // Use the API endpoint to check project manager status
    const response = await fetch('/api/user/level/is-project-manager', {
      method: 'GET',
      credentials: 'include',
    });
    
    if (!response.ok) {
      return false;
    }
    
    const data = await response.json();
    return data.isProjectManager === true;
  } catch (error) {
    console.error('Error checking project manager status:', error);
    return false;
  }
}

/**
 * Sign the user out
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}