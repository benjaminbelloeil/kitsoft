import { createClient as createServerClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/server-admin';
import { Usuario } from '@/interfaces/user';

/**
 * Server-side function to get all users
 * Use this only in server components or API routes
 */
export async function getAllUsers(): Promise<Usuario[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('usuarios')
    .select('*')
    .order('id_usuario');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data as Usuario[];
}

/**
 * Server-side function to get all users with their roles and login information
 * This ensures the initial server-rendered view has complete user data
 */
export async function getAllUsersWithRolesAndAuth(): Promise<any[]> {
  try {
    const supabase = await createServerClient();
    
    // Get all users from the usuarios table
    const { data: users, error } = await supabase
      .from('usuarios')
      .select(`
        id_usuario,
        nombre,
        apellido,
        titulo,
        url_avatar
      `);
    
    if (error) {
      console.error('Error fetching users:', error);
      return [];
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
        // Get user's current role from usuarios_niveles
        const { data: userNivel, error: nivelError } = await supabase
          .from('usuarios_niveles')
          .select(`
            niveles:id_nivel_actual(id_nivel, numero, titulo)
          `)
          .eq('id_usuario', user.id_usuario)
          .order('fecha_cambio', { ascending: false })
          .limit(1)
          .single();
        
        // Get auth data from our map
        const authData = authUserMap.get(user.id_usuario);
        const email = authData?.email || null;
        const lastLogin = authData?.lastSignIn || null;
        const registered = !!authData?.email;
        const hasLoggedIn = !!lastLogin;
        const role = userNivel?.niveles || null;
        
        return {
          ...user,
          email,
          registered,
          role,
          lastLogin,
          hasLoggedIn
        };
      })
    );
    
    return usersWithRoles;
  } catch (error) {
    console.error('Error in getAllUsersWithRolesAndAuth:', error);
    return [];
  }
}

// Add more server-side user functions here as needed