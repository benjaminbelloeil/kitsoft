import { createClient as createServerClient } from '@/utils/supabase/server';
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

// Add more server-side user functions here as needed