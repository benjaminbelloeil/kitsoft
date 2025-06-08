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

    // Check if user is admin (nivel 1)
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

    const { targetUserId, userName } = await request.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'Missing required field: targetUserId' },
        { status: 400 }
      );
    }

    // Get target user data if userName not provided
    let finalUserName = userName;
    if (!finalUserName) {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('nombre, apellido')
        .eq('id_usuario', targetUserId)
        .single();

      finalUserName = userData && userData.nombre 
        ? `${userData.nombre} ${userData.apellido || ''}`.trim()
        : 'Usuario';
    }

    console.log(`🎉 Testing welcome notification for user: ${targetUserId} (${finalUserName})`);
    
    const result = await createWelcomeNotification(targetUserId, finalUserName);
    
    if (result.success) {
      console.log(`✅ Welcome notification test completed successfully`);
      return NextResponse.json({
        success: true,
        message: `Welcome notification sent to ${finalUserName}`,
        userId: targetUserId
      });
    } else {
      console.error('❌ Welcome notification test failed:', result.error);
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Unexpected error in welcome notification test:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
