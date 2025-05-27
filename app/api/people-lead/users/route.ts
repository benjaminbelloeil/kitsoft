import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication - only people leads should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is a people lead
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
    
    // Get the level details to check if people lead
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Check if the user is people lead (level number 2)
    if (nivelError || nivelData?.numero !== 2) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all users assigned to this people lead (WITHOUT the correo field)
    const { data: assignedUsers, error: usersError } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        url_avatar,
        fecha_inicio_empleo
      `)
      .eq('id_peoplelead', user.id);

    if (usersError) {
      console.error('Error fetching assigned users:', usersError);
      return NextResponse.json({ error: 'Error fetching assigned users' }, { status: 500 });
    }

    // Get emails for each user from the correos table
    const usersWithEmails = await Promise.all(
      (assignedUsers || []).map(async (user) => {
        const { data: emailData } = await supabase
          .from('correos')
          .select('correo')
          .eq('id_usuario', user.id_usuario)
          .limit(1)
          .single();
        
        return {
          ...user,
          correo: emailData?.correo || 'No email'
        };
      })
    );

    return NextResponse.json({ users: usersWithEmails || [] });
  } catch (error) {
    console.error('Error in GET /api/people-lead/users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
