/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * GET handler for fetching all roles available in the system
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
      );
    }
    
    // Check if current user is a project lead directly
    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return NextResponse.json(
        { error: 'Error al verificar permisos' },
        { status: 500 }
      );
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return NextResponse.json(
        { error: 'Error al verificar permisos' },
        { status: 500 }
      );
    }

    // Check if numero equals 3 (Project Lead)
    const isUserProjectLead = levelDetails.numero === 3;
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }
    
    // Fetch all roles from the database
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*')
      .order('nombre', { ascending: true });
      
    if (error) {
      console.error('Error fetching roles:', error);
      return NextResponse.json(
        { error: 'Error al obtener roles' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error in GET roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
