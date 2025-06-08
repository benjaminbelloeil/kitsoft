// API endpoint to check for first-time login and send welcome notification
import { createClient } from '@/utils/supabase/server';
import { checkAndSendWelcomeNotification } from '../../../../utils/notifications/welcome-check-server';

/**
 * API endpoint to check for first-time login and send welcome notification
 */
export async function POST() {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await checkAndSendWelcomeNotification(user.id);
    
    return Response.json(result);
  } catch (error) {
    console.error('Error in welcome check API:', error);
    return Response.json({ 
      success: false, 
      isFirstLogin: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
