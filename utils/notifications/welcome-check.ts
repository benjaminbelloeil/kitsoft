// Client-side utility to check for welcome notification after login
import { createClient } from '@/utils/supabase/client';

/**
 * Call this function after successful login to check if welcome notification should be sent
 * This should be called from the client side after authentication
 */
export async function checkWelcomeNotificationAfterLogin(): Promise<{ success: boolean; isFirstLogin: boolean; error?: string }> {
  try {
    const response = await fetch('/api/notifications/check-welcome', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, isFirstLogin: false, error: errorData.error || 'Failed to check welcome notification' };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error checking welcome notification:', error);
    return { success: false, isFirstLogin: false, error: 'Network error' };
  }
}

/**
 * Alternative approach: Check auth user data directly from client
 * (Use this if the API approach doesn't work due to RLS policies)
 */
export async function checkFirstLoginDirectly(): Promise<{ success: boolean; isFirstLogin: boolean; error?: string }> {
  try {
    const supabase = createClient();
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, isFirstLogin: false, error: 'User not authenticated' };
    }

    // Get user session info
    const { data: session } = await supabase.auth.getSession();
    if (!session.session) {
      return { success: false, isFirstLogin: false, error: 'No active session' };
    }

    // Check if we can determine first login from the session/user data
    // Note: This might not be as reliable as the auth_user_view approach
    const lastSignIn = user.last_sign_in_at;
    const createdAt = user.created_at;

    if (!lastSignIn || !createdAt) {
      return { success: false, isFirstLogin: false, error: 'Unable to determine login status' };
    }

    // Check if this could be first login
    const lastSignInDate = new Date(lastSignIn);
    const createdAtDate = new Date(createdAt);
    const timeDifference = Math.abs(lastSignInDate.getTime() - createdAtDate.getTime());
    const tenSecondsInMs = 10 * 1000;
    
    const isFirstLogin = timeDifference <= tenSecondsInMs;

    if (isFirstLogin) {
      // Call the welcome notification API
      const welcomeResult = await checkWelcomeNotificationAfterLogin();
      return welcomeResult;
    }

    return { success: true, isFirstLogin: false };
  } catch (error) {
    console.error('Error in checkFirstLoginDirectly:', error);
    return { success: false, isFirstLogin: false, error: 'Unexpected error occurred' };
  }
}
