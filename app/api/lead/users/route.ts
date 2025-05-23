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
    
    // Fetch all users
    const { data: allUsers, error: usersError } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        bio,
        url_avatar,
        url_curriculum,
        fecha_inicio_empleo,
        id_peoplelead
      `)
      .order('nombre', { ascending: true });
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Error al obtener usuarios' }, 
        { status: 500 }
      );
    }
    
    // Log all users for debugging
    console.log('All users found:', allUsers?.length);
    
    // Get the current authenticated user's email
    const { data: { user: authUser }, error: authUserError } = await supabase.auth.getUser();
    const currentUserEmail = authUser?.email || '';
    
    // Map the users to match the User interface
    const mappedUsers = (allUsers || []).map(user => ({
      ...user,
      // Use actual email for the current user, generate placeholder emails for others
      email: user.id_usuario === authUser?.id ? 
             currentUserEmail : 
             `user-${user.id_usuario.substring(0, 8)}@example.com`,
      foto_url: user.url_avatar, // Map to match interface
      activo: true // Set as active since we're returning all users and there's no way to filter
    }));
    
    return NextResponse.json(mappedUsers);
  } catch (error) {
    console.error('Error in GET users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
