import { NextRequest, NextResponse } from 'next/server';
import { checkWorkloadAndNotify } from '@/utils/notifications/notificationService';

/**
 * POST /api/cron/workload-check
 * Automated endpoint for periodic workload monitoring
 * This endpoint should be called by a cron job service (like Vercel Cron or external cron)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret) {
      console.error('CRON_SECRET environment variable not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    if (!authHeader || authHeader !== `Bearer ${expectedSecret}`) {
      console.error('Invalid or missing authorization header for cron job');
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
