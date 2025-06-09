import { NextRequest, NextResponse } from 'next/server';
import { checkWorkloadAndNotify } from '@/utils/notifications/notificationService';

/**
 * POST /api/cron/workload-check
 * Automated endpoint for periodic workload monitoring
 * This endpoint should be called by a cron job service (like Vercel Cron or external cron)
 */
export async function POST(request: NextRequest) {
  try {
    // Check if this is a Vercel cron job or manual call with secret
    const authHeader = request.headers.get('authorization');
    const vercelCronHeader = request.headers.get('vercel-cron');
    const expectedSecret = process.env.CRON_SECRET;

    // Allow Vercel cron jobs (they include a special header)
    const isVercelCron = vercelCronHeader === '1';
    const hasValidSecret = expectedSecret && authHeader === `Bearer ${expectedSecret}`;

    if (!isVercelCron && !hasValidSecret) {
      console.error('Invalid authorization for cron job');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting automated workload check...');

    // Run the workload check
    const result = await checkWorkloadAndNotify();

    if (!result.success) {
      console.error('Automated workload check failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to check workload' },
        { status: 500 }
      );
    }

    console.log(`Automated workload check completed: ${result.processed} users processed, ${result.notifications} notifications sent`);

    return NextResponse.json({
      message: 'Automated workload check completed successfully',
      processed: result.processed,
      notifications: result.notifications,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in automated workload check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/workload-check
 * Health check for the cron endpoint
 */
export async function GET() {
  return NextResponse.json({
    message: 'Workload monitoring cron endpoint is active',
    timestamp: new Date().toISOString()
  });
}
