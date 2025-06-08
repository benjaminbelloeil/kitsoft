// Server-side utility to check for first-time login and send welcome notification
import { adminClient } from '@/utils/supabase/server-admin';
import { createWelcomeNotification } from '@/utils/notifications/notificationService';

/**
 * Checks if this is a user's first login and sends welcome notification if needed
 * Uses adminClient to get auth user data directly from Supabase auth
 */
export async function checkAndSendWelcomeNotification(userId: string): Promise<{ success: boolean; isFirstLogin: boolean; error?: string }> {
  try {
    // Get auth user data directly from Supabase auth using admin client
    const { data: authUser, error: authError } = await adminClient.auth.admin.getUserById(userId);

    if (authError) {
      console.error('Error fetching auth user data:', authError);
      return { success: false, isFirstLogin: false, error: 'Failed to check login status' };
    }

    if (!authUser || !authUser.user) {
      return { success: false, isFirstLogin: false, error: 'User not found in auth system' };
    }

    const user = authUser.user;

    // Parse the dates
    const createdAt = new Date(user.created_at);
    const lastSignInAt = user.last_sign_in_at ? new Date(user.last_sign_in_at) : null;

    // Determine if this is first login
    let isFirstLogin = false;
    
    if (!lastSignInAt) {
      // No previous sign in - definitely first login
      isFirstLogin = true;
    } else {
      // Check if last_sign_in_at is very close to created_at (within 10 seconds)
      // This handles the case where both get set almost simultaneously on first login
      const timeDifference = Math.abs(lastSignInAt.getTime() - createdAt.getTime());
      const tenSecondsInMs = 10 * 1000;
      isFirstLogin = timeDifference <= tenSecondsInMs;
    }

    if (isFirstLogin) {
      console.log(`🎉 First login detected for user: ${userId}`);
      
      // Send welcome notification
      const notificationResult = await createWelcomeNotification(userId);
      
      if (notificationResult.success) {
        console.log(`✅ Welcome notification sent to user: ${userId}`);
        return { success: true, isFirstLogin: true };
      } else {
        console.error(`❌ Failed to send welcome notification:`, notificationResult.error);
        return { success: false, isFirstLogin: true, error: notificationResult.error };
      }
    } else {
      console.log(`👋 Returning user login: ${userId}`);
      return { success: true, isFirstLogin: false };
    }

  } catch (error) {
    console.error('Error in checkAndSendWelcomeNotification:', error);
    return { success: false, isFirstLogin: false, error: 'Unexpected error occurred' };
  }
}
