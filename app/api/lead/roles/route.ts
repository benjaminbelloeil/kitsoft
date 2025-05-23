/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isProjectLead } from '@/app/lib/auth';

/**
 * GET handler for fetching all roles available in the system
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if current user is a project lead
    const isUserProjectLead = await isProjectLead();
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }

    // Need to get the user for other operations
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
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
