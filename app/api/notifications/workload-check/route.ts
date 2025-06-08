/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';
import { checkWorkloadAndNotify } from '@/utils/notifications/notificationService';
import { createClient } from '@/utils/supabase/server';

/**
 * POST /api/notifications/workload-check
 * Manually trigger workload check and send notifications to People Leads
 * This endpoint can be called manually or via a cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin/people_lead permissions
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role to verify permissions
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_usuario', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow admins and people leads to trigger workload checks
    if (!['admin', 'people_lead'].includes(userData.rol)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Run the workload check
    const result = await checkWorkloadAndNotify();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to check workload' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Workload check completed successfully',
      processed: result.processed,
      notifications: result.notifications
    });

  } catch (error) {
    console.error('Error in workload check endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/notifications/workload-check
 * Get status of workload monitoring system
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user role
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('rol')
      .eq('id_usuario', user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Only allow admins and people leads to view workload status
    if (!['admin', 'people_lead'].includes(userData.rol)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Get count of people leads and their team members
    const { data: peopleLeads, error: peopleLeadsError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('rol', 'people_lead');

    if (peopleLeadsError) {
      return NextResponse.json(
        { error: 'Failed to fetch people leads' },
        { status: 500 }
      );
    }

    // Get count of team members
    const { data: teamMembers, error: teamMembersError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .not('people_lead_id', 'is', null);

    if (teamMembersError) {
      return NextResponse.json(
        { error: 'Failed to fetch team members' },
        { status: 500 }
      );
    }

    // Get recent workload notifications (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentNotifications, error: notificationsError } = await supabase
      .from('notificaciones')
      .select('tipo, fecha')
      .in('tipo', ['workload_low', 'workload_overload'])
      .gte('fecha', sevenDaysAgo.toISOString());

    if (notificationsError) {
      return NextResponse.json(
        { error: 'Failed to fetch recent notifications' },
        { status: 500 }
      );
    }

    const lowWorkloadNotifications = recentNotifications?.filter(n => n.tipo === 'workload_low').length || 0;
    const overloadNotifications = recentNotifications?.filter(n => n.tipo === 'workload_overload').length || 0;

    return NextResponse.json({
      status: 'active',
      peopleLeadsCount: peopleLeads?.length || 0,
      teamMembersCount: teamMembers?.length || 0,
      recentNotifications: {
        lowWorkload: lowWorkloadNotifications,
        overload: overloadNotifications,
        total: lowWorkloadNotifications + overloadNotifications
      },
      lastWeek: sevenDaysAgo.toISOString()
    });

  } catch (error) {
    console.error('Error getting workload check status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
