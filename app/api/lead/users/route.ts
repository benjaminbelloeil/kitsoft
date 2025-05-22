/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isProjectLead } from '@/app/lib/auth';

/**
 * GET handler for fetching all users that can be assigned to projects
 */
export async function GET(request: Request) {
  try {
    // Check if current user is a project lead
    const isUserProjectLead = await isProjectLead();
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }
    
    const supabase = await createClient();
    
    // Get the levels that correspond to regular employees (level 0)
    const { data: level, error: levelError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', 0)
      .single();
      
    if (levelError) {
      console.error('Error fetching employee level:', levelError);
      return NextResponse.json(
        { error: 'Error al obtener nivel de empleado' }, 
        { status: 500 }
      );
    }
    
    // Fetch users with the employee level
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        email,
        foto_url,
        activo
      `)
      .eq('id_nivel', level.id_nivel)
      .eq('activo', true)
      .order('nombre', { ascending: true });
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Error al obtener usuarios' }, 
        { status: 500 }
      );
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in GET users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
