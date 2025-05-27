import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // Check authentication - only admins should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is an admin
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

    // Get all people leads using a more reliable approach
    const { data: peopleLeads, error: peopleLeadsError } = await supabase
      .rpc('get_people_leads') // We'll create this function
      .select('*');

    // If the function doesn't exist, use direct SQL query
    if (peopleLeadsError && peopleLeadsError.message?.includes('function')) {
      // Get people lead level ID first
      const { data: peopleLeadLevel } = await supabase
        .from('niveles')
        .select('id_nivel')
        .eq('numero', 2)
        .single();
        
      if (!peopleLeadLevel) {
        return NextResponse.json([]);
      }
      
      // Get users with People Lead level
      const { data: userNiveles } = await supabase
        .from('usuarios_niveles')
        .select('id_usuario')
        .eq('id_nivel_actual', peopleLeadLevel.id_nivel);
        
      if (!userNiveles || userNiveles.length === 0) {
        return NextResponse.json([]);
      }
      
      const userIds = userNiveles.map(un => un.id_usuario);
      
      // Get user details
      const { data: finalPeopleLeads, error: finalError } = await supabase
        .from('usuarios')
        .select('id_usuario, nombre, apellido, titulo, url_avatar')
        .in('id_usuario', userIds);
        
      if (finalError) {
        console.error('Error fetching user details:', finalError);
        return NextResponse.json({ error: 'Error fetching people leads' }, { status: 500 });
      }
      
      return NextResponse.json(finalPeopleLeads || []);
    }

    if (peopleLeadsError) {
      console.error('Error fetching people leads:', peopleLeadsError);
      return NextResponse.json({ error: 'Error fetching people leads' }, { status: 500 });
    }

    return NextResponse.json(peopleLeads || []);
  } catch (error) {
    console.error('Error in GET /api/admin/leads/list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
