import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkProjectDeadlines } from '@/utils/notifications/notificationService';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication - this endpoint should be secured for admin access or cron jobs
    const { data: { user } } = await supabase.auth.getUser();
    
    // For now, allow any authenticated user to trigger this for testing
    // In production, you'd want to secure this with API keys or admin-only access
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🔍 Checking project deadlines for notifications...');
    
    const result = await checkProjectDeadlines();
    
    if (result.success) {
      console.log(`✅ Deadline check completed. Created ${result.notificationsCreated} notifications.`);
      return NextResponse.json({
        success: true,
        message: `Deadline check completed successfully`,
        notificationsCreated: result.notificationsCreated
      });
    } else {
      console.error('❌ Deadline check failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in deadline check:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Alternative GET endpoint for easier testing/manual triggers
export async function GET(request: NextRequest) {
  return POST(request);
}
