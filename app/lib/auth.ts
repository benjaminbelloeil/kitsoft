import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Server-side utility to get the authenticated user
 * Redirects to login if no user is found
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  return user;
}

/**
 * Get the authenticated user without redirecting
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
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