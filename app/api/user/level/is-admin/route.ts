import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
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
        return NextResponse.json({ isAdmin: false, error: 'Not authorized to check other users' }, { status: 403 });
      }
      
      const { data: adminLevel, error: adminLevelError } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', adminCheck.id_nivel_actual)
        .single();
        
      if (adminLevelError || adminLevel?.numero !== 1) {
        return NextResponse.json({ isAdmin: false, error: 'Not authorized to check other users' }, { status: 403 });
      }
    }
    
    // Get target user's level from usuarios_niveles
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', targetUserId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json({ isAdmin: false }, { status: 200 });
    }
    
    // Get the level details to check if admin
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Admin is level number 1
    const isAdmin = !nivelError && nivelData?.numero === 1;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}
