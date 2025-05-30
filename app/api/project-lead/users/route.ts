import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication - only authenticated users should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get project lead level ID first (numero = 3)
    const { data: projectLeadLevel, error: levelError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', 3)
      .single();
      
    if (levelError || !projectLeadLevel) {
      console.error('Error finding project lead level:', levelError);
      return NextResponse.json({ error: 'Project lead level not found' }, { status: 500 });
    }
      
    // Get users with Project Lead level from usuarios_niveles
    const { data: userNiveles, error: userNivelesError } = await supabase
      .from('usuarios_niveles')
      .select('id_usuario')
      .eq('id_nivel_actual', projectLeadLevel.id_nivel);
        
    if (userNivelesError) {
      console.error('Error fetching project lead users from usuarios_niveles:', userNivelesError);
      return NextResponse.json({ error: 'Error fetching project leads' }, { status: 500 });
    }

    if (!userNiveles || userNiveles.length === 0) {
      return NextResponse.json([]);
    }
      
    const userIds = userNiveles.map(un => un.id_usuario);
      
    // Get user details for project leads
    const { data: projectLeads, error: usersError } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        url_avatar,
        fecha_inicio_empleo
      `)
      .in('id_usuario', userIds);

    if (usersError) {
      console.error('Error fetching project lead user details:', usersError);
      return NextResponse.json({ error: 'Error fetching project lead details' }, { status: 500 });
    }

    return NextResponse.json(projectLeads || []);
  } catch (error) {
    console.error('Unexpected error in project-lead users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
