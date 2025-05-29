/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

/**
 * Server-side utility to check if a user has admin privileges
 * This calls the secure API route instead of directly accessing the database
 */
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    // Get the base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kitsoft.vercel.app';
    
    // Get the cookies for authentication
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    
    // Call the secure API route
    const response = await fetch(`${baseUrl}/api/user/level/is-admin?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Cookie': cookieHeader,
        'Content-Type': 'application/json',
      },
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
 * Server-side utility to check if the current authenticated user has admin privileges
 * Returns both the user and admin status
 */
export async function checkCurrentUserIsAdmin(): Promise<{ user: any; isAdmin: boolean }> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { user: null, isAdmin: false };
    }
    
    const isAdmin = await checkIsAdmin(user.id);
    return { user, isAdmin };
  } catch (error) {
    console.error('Error checking current user admin status:', error);
    return { user: null, isAdmin: false };
  }
}
