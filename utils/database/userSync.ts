import { createClient } from '@/utils/supabase/client';
import { createClient as createServerClient } from '@/utils/supabase/server';

// Types for the usuario table matching the actual database schema
export interface Usuario {
  ID_Usuario: string;
  Nombre?: string | null;
  Apellido?: string | null;
  Titulo?: string | null;
  Bio?: string | null;
  URL_Avatar?: string | null;
  URL_Curriculum?: string | null;
  Fecha_Inicio_Empleo?: string | null;
  ID_PeopleLead?: string | null;
}

/**
 * This function can be used to get a user's profile from the usuario table
 * @param userId - The user's ID from Supabase Auth
 * @returns The user profile or null
 */
export async function getUserProfile(userId: string): Promise<Usuario | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
    .eq('ID_Usuario', userId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as Usuario;
}

/**
 * This function updates a user's profile in the usuario table
 * Use this to update fields like nombre, apellido, titulo, etc.
 * @param userId - The user's ID from Supabase Auth
 * @param userData - The user data to update
 * @returns True if successful, false otherwise
 */
export async function updateUserProfile(
  userId: string, 
  userData: Partial<Omit<Usuario, 'ID_Usuario'>>
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('Usuarios')
    .update(userData)
    .eq('ID_Usuario', userId);
  
  if (error) {
    console.error('Error updating user profile:', error);
    return false;
  }
  
  return true;
}

/**
 * Server-side function to get all users
 * Use this only in server components or API routes
 */
export async function getAllUsers(): Promise<Usuario[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('Usuarios')
    .select('*')
    .order('ID_Usuario');
  
  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  
  return data as Usuario[];
}

/**
 * Manual function to ensure a user exists in the usuario table
 * This should rarely be needed as the database trigger handles this automatically
 */
export async function ensureUserExists(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  // First check if user already exists
  const { data: existingUser } = await supabase
    .from('Usuarios')
    .select('ID_Usuario')
    .eq('ID_Usuario', userId)
    .single();
  
  if (existingUser) {
    return true; // User already exists
  }
  
  // If not, create the user
  const { error } = await supabase
    .from('Usuarios')
    .insert({
      ID_Usuario: userId
    });
  
  if (error) {
    console.error('Error creating user profile:', error);
    return false;
  }
  
  return true;
}

/**
 * Function to fetch the user's auth details and update profile fields
 * This can be used to synchronize user email from auth to profile
 */
export async function syncUserAuthDetails(): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Get user data from auth
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    if (userError || !userData.user) {
      console.error('Error fetching auth user:', userError);
      return false;
    }
    
    // We don't need to update any fields since we removed created_at and updated_at
    // This function could be used later if we need to sync other fields
    return true;
  } catch (err) {
    console.error('Error in syncUserAuthDetails:', err);
    return false;
  }
}