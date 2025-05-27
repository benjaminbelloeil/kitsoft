import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/server-admin';
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

    // Get all users with their basic information - removing email field since it may not exist in usuarios
    const { data: users, error } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        url_avatar,
        id_peoplelead
      `);
    
    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json({ error: 'Error fetching users' }, { status: 500 });
    }

    // Get all auth users with their emails using adminClient
    const { data: authUsers, error: authError } = await adminClient
      .auth
      .admin
      .listUsers();

    if (authError) {
      console.error('Error fetching auth users:', authError);
      // Continue without email data if there's an error
    }

    // Map of user IDs to auth data for quick lookups
    const authUserMap = new Map();
    if (authUsers?.users) {
      authUsers.users.forEach(authUser => {
        authUserMap.set(authUser.id, {
          email: authUser.email,
          lastSignIn: authUser.last_sign_in_at
        });
      });
    }

    // For each user, get their most recent role from usuarios_niveles
    const usersWithRoles = await Promise.all(
      users.map(async (user) => {
        // Get user's current role ID from usuarios_niveles
        const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
          .from('usuarios_niveles')
          .select('id_nivel_actual')
          .eq('id_usuario', user.id_usuario)
          .order('fecha_cambio', { ascending: false })
          .limit(1)
          .single();
        
        // Initialize role as null
        let role = null;
        
        // If we have a nivel record, get the actual level details
        if (userNivelesRecord && !nivelesRecordError) {
          const { data: nivelData, error: nivelError } = await supabase
            .from('niveles')
            .select('id_nivel, numero, titulo')
            .eq('id_nivel', userNivelesRecord.id_nivel_actual)
            .single();
            
          if (!nivelError && nivelData) {
            role = nivelData;
          }
        }
        
        // Get auth data from our map
        const authData = authUserMap.get(user.id_usuario);
        const email = authData?.email || null;
        const lastLogin = authData?.lastSignIn || null;
        const registered = !!authData?.email;
        
        return {
          ...user,
          email,
          registered,
          role,
          lastLogin,
          hasLoggedIn: !!lastLogin,
          ID_PeopleLead: user.id_peoplelead
        };
      })
    );
    
    return NextResponse.json({ users: usersWithRoles });
  } catch (error) {
    console.error('Error in GET /api/admin/users/list:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
