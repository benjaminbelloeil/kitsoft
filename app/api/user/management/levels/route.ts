import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a Supabase client
    const supabase = await createClient();

    // Check authentication - only admins should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is an admin - first get their current level ID
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Get the level details to check if admin
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Check if the user is admin (level number 1)
    if (nivelError || nivelData?.numero !== 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all levels
    const { data: levels, error } = await supabase
      .from('niveles')
      .select('id_nivel, numero, titulo')
      .order('numero');
    
    if (error) {
      console.error('Error fetching levels:', error);
      return NextResponse.json({ error: 'Error fetching levels' }, { status: 500 });
    }
    
    return NextResponse.json(levels);
  } catch (error) {
    console.error('Error in GET /api/user/management/levels:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
