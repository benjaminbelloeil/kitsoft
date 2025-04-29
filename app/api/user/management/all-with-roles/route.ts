/* eslint-disable @typescript-eslint/no-unused-vars */
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
    
    // Check if the current user is an admin
    const { data: adminCheck, error: adminError } = await supabase
      .from('usuarios_roles')
      .select(`
        id_nivel,
        nivel!inner(
          numero
        )
      `)
      .eq('id_usuario', user.id)
      .eq('nivel.numero', 1);
      
    if (adminError || !adminCheck || adminCheck.length === 0) {
      return NextResponse.json(
        { error: 'Only admins can view all users' },
        { status: 403 }
      );
    }
    
    // Get all users with their roles
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        url_avatar,
        auth_usuarios!inner (
          email,
          last_sign_in_at
        ),
        usuarios_roles (
          nivel (
            id_nivel,
            numero,
            titulo
          )
        )
      `);
      
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Error fetching users' },
        { status: 500 }
      );
    }
    
    // Format data to match the expected User interface
    // Format data to match the expected User interface
    const formattedUsers = users.map(user => ({
      id_usuario: user.id_usuario,
      nombre: user.nombre,
      apellido: user.apellido,
      titulo: user.titulo,
      email: user.auth_usuarios?.[0]?.email,
      url_avatar: user.url_avatar,
      registered: true,
      role: user.usuarios_roles?.[0]?.nivel || null,
      lastLogin: user.auth_usuarios?.[0]?.last_sign_in_at || null,
      hasLoggedIn: !!user.auth_usuarios?.[0]?.last_sign_in_at
    }));
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Unexpected error in get all users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}