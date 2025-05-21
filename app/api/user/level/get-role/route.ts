import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Check if a specific userId was passed as a query parameter
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || user.id;
    
    // If checking another user, ensure the requesting user is an admin first
    if (targetUserId !== user.id) {
      // Check if the current user is an admin
      const { data: adminCheck, error: adminCheckError } = await supabase
        .from('usuarios_niveles')
        .select('id_nivel_actual')
        .eq('id_usuario', user.id)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      if (adminCheckError || !adminCheck) {
        return NextResponse.json({ error: 'Not authorized to check other users' }, { status: 403 });
      }
      
      const { data: adminLevel, error: adminLevelError } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', adminCheck.id_nivel_actual)
        .single();
        
      if (adminLevelError || adminLevel?.numero !== 1) {
        return NextResponse.json({ error: 'Not authorized to check other users' }, { status: 403 });
      }
    }
    
    // Get the target user's current level from usuarios_niveles
    const { data: userNivel, error: nivelError } = await supabase
      .from('usuarios_niveles')
      .select(`
        id_nivel_actual
      `)
      .eq('id_usuario', targetUserId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (nivelError || !userNivel) {
      return NextResponse.json(
        { error: 'No user level found' },
        { status: 404 }
      );
    }
    
    // Get the level details
    const { data: nivelData, error: levelDetailsError } = await supabase
      .from('niveles')
      .select('id_nivel, numero, titulo, descripcion')
      .eq('id_nivel', userNivel.id_nivel_actual)
      .single();
    
    if (levelDetailsError || !nivelData) {
      return NextResponse.json(
        { error: 'Level details not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(nivelData);
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
