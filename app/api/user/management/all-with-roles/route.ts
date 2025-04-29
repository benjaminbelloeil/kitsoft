import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Create a Supabase client with admin privileges
    const supabase = await createClient();

    // Check authentication - only admins should access this
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if the user is an admin
    const { data: userRole, error: roleError } = await supabase
      .from('usuarios_niveles')
      .select(`
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (roleError || !userRole?.niveles?.numero === 1) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get all users with their current role
    const { data: users, error } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        email,
        url_avatar,
        auth_registered:registered,
        last_login
      `);
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }

    // For each user, get their most recent role
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        // Get user's current role
        const { data: userNivel, error: nivelError } = await supabase
          .from('usuarios_niveles')
          .select(`
            niveles:id_nivel_actual(id_nivel, numero, titulo)
          `)
          .eq('id_usuario', user.id_usuario)
          .order('fecha_cambio', { ascending: false })
          .limit(1)
          .single();
        
        // Check if user is registered (has any auth data)
        const { data: authData, error: authError } = await supabase
          .from('auth.users')
          .select('id, email, last_sign_in_at')
          .eq('id', user.id_usuario)
          .maybeSingle();
        
        const role = userNivel?.niveles;
        const registered = !!user.auth_registered || !!authData;
        const lastLogin = authData?.last_sign_in_at || null;
        
        return {
          ...user,
          registered,
          role,
          lastLogin,
          hasLoggedIn: !!lastLogin
        };
      })
    );
    
    return NextResponse.json(usersWithRoles);
  } catch (error) {
    console.error('Error in GET /api/user/management/all-with-roles:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}