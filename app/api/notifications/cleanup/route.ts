import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cleanupOldNotifications } from '@/utils/notifications/notificationService';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication - only allow admin users to clean up notifications
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userLevelData, error: userLevelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (userLevelError) {
      return NextResponse.json({ error: 'Unable to verify permissions' }, { status: 403 });
    }

    const { data: levelData, error: levelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (levelError || levelData.numero !== 1) {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    const { daysOld = 30 } = await request.json();

    console.log(`🧹 Cleaning up notifications older than ${daysOld} days...`);
    
    const result = await cleanupOldNotifications(daysOld);
    
    if (result.success) {
      console.log(`✅ Cleanup completed. Deleted ${result.deleted} old notifications.`);
      return NextResponse.json({
        success: true,
        message: `Successfully deleted ${result.deleted} old notifications`,
        deleted: result.deleted
      });
    } else {
      console.error('❌ Cleanup failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in notification cleanup:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
