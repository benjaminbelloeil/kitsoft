/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';

export interface User {
  id_usuario: string;
  nombre: string;
  apellido: string;
  titulo: string;
  url_avatar: string | null;
  email?: string; // Added email field
  role?: {
    id_nivel?: string;
    numero?: number;
    titulo?: string;
  };
  registered?: boolean;
}

export interface UserRole {
  id_nivel: string;
  numero: number; 
  titulo: string;
}

/**
 * Get all users with their current role status and email
 */
export async function getAllUsersWithRoles(): Promise<User[]> {
  const supabase = createClient();
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select('*')
      .order('nombre');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return [];
    }
    
    // For each user, get their current role and email
    const usersWithRoles = await Promise.all((users || []).map(async (user) => {
      // Get the role for this user
      const { data: roleData } = await supabase
        .from('usuarios_niveles')
        .select(`
          id_nivel_actual,
          niveles:id_nivel_actual (
            id_nivel,
            numero,
            titulo
          )
        `)
        .eq('id_usuario', user.id_usuario)
        .order('fecha_cambio', { ascending: false })
        .limit(1)
        .single();
      
      // Get the email for this user
      const { data: emailData } = await supabase
        .from('correos')
        .select('correo')
        .eq('id_usuario', user.id_usuario)
        .limit(1)
        .maybeSingle();
      
      // Check if user has any role entry (registered)
      const registered = roleData !== null;
      
      return {
        ...user,
        registered,
        role: roleData?.niveles || null,
        email: emailData?.correo || null
      };
    }));
    
    return usersWithRoles;
  } catch (err) {
    console.error('Exception in getAllUsersWithRoles:', err);
    return [];
  }
}

/**
 * Get all available roles
 */
export async function getAllRoles(): Promise<UserRole[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('niveles')
      .select('*')
      .order('numero');
    
    if (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getAllRoles:', err);
    return [];
  }
}

/**
 * Update a user's role - completely replaces the previous implementation
 * to fix issues with role changes not persisting
 */
export async function updateUserRole(
  userId: string, 
  roleId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    console.log(`Updating role for user ${userId} to ${roleId}`);
    
    // Delete existing role entries for this user to avoid conflicts
    const { error: deleteError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
    
    if (deleteError) {
      console.error('Error cleaning up previous roles:', deleteError);
      // Continue anyway as the insert might still work
    }
    
    // Insert new role with a short delay to ensure deletion completes
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const { error: insertError } = await supabase
      .from('usuarios_niveles')
      .insert({
        id_historial: crypto.randomUUID(),
        id_nivel_actual: roleId,
        id_nivel_previo: null, // We don't need to track previous since we deleted it
        fecha_cambio: new Date().toISOString(),
        id_usuario: userId
      });
    
    if (insertError) {
      console.error('Error inserting new role:', insertError);
      return { success: false, error: insertError.message };
    }
    
    console.log(`Successfully updated role for user ${userId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateUserRole:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Delete a user completely from the system
 * This removes all related data from various tables
 */
export async function deleteUser(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    console.log(`Deleting user ${userId}`);
    
    // Delete from various tables in sequence to handle foreign keys
    // Starting with the most dependent tables first
    
    // 1. Delete user's role assignments
    const { error: roleError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
      
    if (roleError) {
      console.error('Error deleting user roles:', roleError);
      // Continue anyway, as we want to delete as much as possible
    }
    
    // 2. Delete user's skills
    const { error: skillsError } = await supabase
      .from('usuarios_habilidades')
      .delete()
      .eq('id_usuario', userId);
      
    if (skillsError) {
      console.error('Error deleting user skills:', skillsError);
    }
    
    // 3. Delete user's certificates
    const { error: certsError } = await supabase
      .from('usuarios_certificados')
      .delete()
      .eq('id_usuario', userId);
      
    if (certsError) {
      console.error('Error deleting user certificates:', certsError);
    }
    
    // 4. Delete user's experiences
    const { error: expError } = await supabase
      .from('experiencia')
      .delete()
      .eq('id_usuario', userId);
      
    if (expError) {
      console.error('Error deleting user experiences:', expError);
    }
    
    // 5. Delete user's emails
    const { error: emailError } = await supabase
      .from('correos')
      .delete()
      .eq('id_usuario', userId);
      
    if (emailError) {
      console.error('Error deleting user emails:', emailError);
    }
    
    // 6. Delete user's phone details
    const { error: phoneError } = await supabase
      .from('telefono')
      .delete()
      .eq('id_usuario', userId);
      
    if (phoneError) {
      console.error('Error deleting user phone:', phoneError);
    }
    
    // 7. Delete user's address
    const { error: addressError } = await supabase
      .from('direccion')
      .delete()
      .eq('id_usuario', userId);
      
    if (addressError) {
      console.error('Error deleting user address:', addressError);
    }
    
    // Finally delete the user record
    const { error: userError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', userId);
      
    if (userError) {
      console.error('Error deleting user record:', userError);
      return { success: false, error: userError.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteUser:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
