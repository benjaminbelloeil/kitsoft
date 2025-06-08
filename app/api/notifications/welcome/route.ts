import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createWelcomeNotification } from '@/utils/notifications/notificationService';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, userName } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      );
    }

    // Only allow admins or the user themselves to trigger welcome notifications
    if (userId !== user.id) {
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
        return NextResponse.json({ error: 'Unauthorized - Only admins can send welcome notifications for other users' }, { status: 403 });
      }
    }

    console.log('📧 Creating welcome notification...');
    
    const result = await createWelcomeNotification(userId, userName);
    
    if (result.success) {
      const displayName = userName || 'new user';
      console.log(`✅ Welcome notification sent to ${displayName}`);
      return NextResponse.json({
        success: true,
        message: 'Welcome notification sent successfully'
      });
    } else {
      console.error('❌ Failed to send welcome notification:', result.error);
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in welcome notification:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
