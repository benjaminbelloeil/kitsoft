import { createClient } from '@/utils/supabase/client';

// Create a module-level flag to track initialization
let initialRoleCheckComplete = false;

/**
 * Manages user roles with protection against duplicate role creation
 * @param userId - The user's ID from Supabase Auth
 * @returns The role number and success status
 */
export async function ensureUserHasRole(userId: string): Promise<{ success: boolean; roleNumber?: number }> {
  const supabase = createClient();
  
  // Skip if we've already run this once in the current session
  if (initialRoleCheckComplete) {
    console.log('Role check already performed in this session, skipping');
    return { success: true };
  }
  
  try {
    console.log('Starting role check for user', userId);
    
    // First check and clean up potential duplicate roles
    await cleanupUserRoles(userId);
    
    // First get existing role count for this user
    const { count, error: countError } = await supabase
      .from('usuarios_niveles')
      .select('id_historial', { count: 'exact', head: true })
      .eq('id_usuario', userId);
    
    if (countError) {
      console.error('Error checking role count:', countError);
      return { success: false };
    }
    
    console.log(`Found ${count} existing role records for user ${userId}`);
    
    // Handle based on count of existing roles
    if (count === 0) {
      // No roles - need to create one
      console.log('No roles found, creating default staff role');
      return await createStaffRole(userId);
    } else if (count === 1) {
      // Exactly one role - perfect!
      console.log('User has exactly one role, checking role type');
      const { data: roleData } = await supabase
        .from('usuarios_niveles')
        .select(`
          id_nivel_actual,
          niveles:id_nivel_actual(numero)
        `)
        .eq('id_usuario', userId)
        .single();
        
      initialRoleCheckComplete = true;
      
      // Log the role number for debugging
      console.log(`User ${userId} has role number: ${roleData?.niveles?.[0]?.numero}`);
      
      return { 
        success: true, 
        roleNumber: roleData?.niveles?.[0]?.numero 
      };
    } else {
      // Multiple roles - clean up and keep only the most recent
      console.log('Multiple roles detected, cleaning up');
      return await cleanupAndGetRole(userId);
    }
  } catch (err) {
    console.error('Exception in ensureUserHasRole:', err);
    return { success: false };
  } finally {
    // Mark that we've completed the initial check
    initialRoleCheckComplete = true;
  }
}

/**
 * Creates the default staff role for a new user
 */
async function createStaffRole(userId: string): Promise<{ success: boolean; roleNumber?: number }> {
  const supabase = createClient();
  
  try {
    // Get the ID of the staff role (level 0)
    const { data: staffRole, error: staffRoleError } = await supabase
      .from('niveles')
      .select('id_nivel, numero')
      .eq('numero', 0)
      .single();
    
    if (staffRoleError || !staffRole) {
      console.error('Error fetching staff role:', staffRoleError);
      return { success: false };
    }
    
    // Do another quick check to make sure a role wasn't created in the meantime
    const { count } = await supabase
      .from('usuarios_niveles')
      .select('id_historial', { count: 'exact', head: true })
      .eq('id_usuario', userId);
      
    if (count && count > 0) {
      console.log('Role was created while we were checking, skipping creation');
      return { success: true, roleNumber: 0 };
    }
    
    // Create new staff role
    const { error: insertError } = await supabase
      .from('usuarios_niveles')
      .insert({
        id_historial: crypto.randomUUID(),
        id_nivel_actual: staffRole.id_nivel,
        id_nivel_previo: null, // No previous role
        fecha_cambio: new Date().toISOString(),
        id_usuario: userId
      });
    
    if (insertError) {
      console.error('Error assigning staff role to user:', insertError);
      return { success: false };
    }
    
    console.log(`Successfully assigned staff role to user ${userId}`);
    return { success: true, roleNumber: staffRole.numero };
  } catch (err) {
    console.error('Error in createStaffRole:', err);
    return { success: false };
  }
}

/**
 * Cleans up multiple role entries for a user and keeps only the most recent one
 */
async function cleanupAndGetRole(userId: string): Promise<{ success: boolean; roleNumber?: number }> {
  const supabase = createClient();
  
  try {
    // Get all roles for this user ordered by date
    const { data: roles, error: rolesError } = await supabase
      .from('usuarios_niveles')
      .select(`
        id_historial, 
        fecha_cambio,
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false });
      
    if (rolesError || !roles || roles.length === 0) {
      console.error('Error fetching roles for cleanup:', rolesError);
      return { success: false };
    }
    
    // Keep the most recent role
    const mostRecentRole = roles[0];
    const idsToDelete = roles.slice(1).map(role => role.id_historial);
    
    // Delete the older roles
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('usuarios_niveles')
        .delete()
        .in('id_historial', idsToDelete);
        
      if (deleteError) {
        console.error('Error deleting duplicate roles:', deleteError);
        // Continue anyway since we have the most recent role
      } else {
        console.log(`Successfully deleted ${idsToDelete.length} duplicate roles`);
      }
    }
    
    return { 
      success: true, 
      roleNumber: mostRecentRole.niveles?.[0]?.numero 
    };
  } catch (err) {
    console.error('Error in cleanupAndGetRole:', err);
    return { success: false };
  }
}

/**
 * Checks if a user has admin privileges
 * @param userId - The user's ID from Supabase Auth
 */
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Get the user's current role
    const { data: userRole, error } = await supabase
      .from('usuarios_niveles')
      .select(`
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
    
    if (!userRole || !userRole.niveles) {
      console.log('No role found for user:', userId);
      return false;
    }
    
    // Check if the user is an admin (level 1)
    const isAdmin = userRole.niveles[0]?.numero === 1;
    console.log(`User ${userId} has role number: ${userRole.niveles[0]?.numero}, isAdmin: ${isAdmin}`);
    return isAdmin;
  } catch (err) {
    console.error('Exception in checkUserIsAdmin:', err);
    return false;
  }
}

/**
 * Reset the module state (useful for testing)
 */
export function resetRoleCheckState() {
  initialRoleCheckComplete = false;
}

/**
 * Clean up duplicate role entries for a user - enhanced version
 * @param userId - The user's ID from Supabase Auth
 */
export async function cleanupUserRoles(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // Get all roles for this user ordered by date (most recent first)
    const { data: roles, error: rolesError } = await supabase
      .from('usuarios_niveles')
      .select(`
        id_historial, 
        fecha_cambio,
        id_nivel_actual,
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false });
      
    if (rolesError) {
      console.error('Error fetching roles for cleanup:', rolesError);
      return false;
    }
    
    if (!roles || roles.length <= 1) {
      // No duplicates to clean up
      return true;
    }
    
    console.log(`Found ${roles.length} role entries for user ${userId}, cleaning up...`);
    
    // Filter out null entries first (these are likely corrupted)
    const validRoles = roles.filter(r => r.id_nivel_actual !== null);
    
    if (validRoles.length === 0) {
      // All roles are null - delete all and create a fresh one
      const { error: deleteError } = await supabase
        .from('usuarios_niveles')
        .delete()
        .eq('id_usuario', userId);
        
      if (deleteError) {
        console.error('Error deleting null role entries:', deleteError);
        return false;
      }
      
      // Create a new staff role
      const result = await createStaffRole(userId);
      return result.success;
    }
    
    // Keep the most recent valid role
    const mostRecentValidRole = validRoles[0];
    const idsToDelete = roles
      .filter(role => role.id_historial !== mostRecentValidRole.id_historial)
      .map(role => role.id_historial);
    
    // Delete the older/invalid roles
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('usuarios_niveles')
        .delete()
        .in('id_historial', idsToDelete);
        
      if (deleteError) {
        console.error('Error deleting duplicate roles:', deleteError);
        return false;
      }
      
      console.log(`Successfully deleted ${idsToDelete.length} duplicate role entries`);
    }
    
    return true;
  } catch (err) {
    console.error('Error in cleanupUserRoles:', err);
    return false;
  }
}

/**
 * Completely resets a user's role to staff level (for testing or fixing issues)
 * @param userId - The user's ID from Supabase Auth
 */
export async function resetUserRole(userId: string): Promise<boolean> {
  const supabase = createClient();
  
  try {
    // First delete all existing role entries
    const { error: deleteError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
      
    if (deleteError) {
      console.error('Error deleting existing roles:', deleteError);
      return false;
    }
    
    // Create a fresh staff role
    const result = await createStaffRole(userId);
    return result.success;
  } catch (err) {
    console.error('Exception in resetUserRole:', err);
    return false;
  }
}

/**
 * Changes a user's role in the database
 * @param userId - The user's ID from Supabase Auth
 * @param newRoleNumber - The new role number to assign (0 for staff, 1 for admin)
 * @returns Success status of the operation
 */
export async function changeUserRole(userId: string, newRoleNumber: number): Promise<boolean> {
  const supabase = createClient();
  
  try {
    console.log(`Changing role for user ${userId} to role number ${newRoleNumber}`);
    
    // Get the user's current role information
    const { data: currentRole, error: currentRoleError } = await supabase
      .from('usuarios_niveles')
      .select(`
        id_historial,
        id_nivel_actual,
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (currentRoleError) {
      console.error('Error fetching current role:', currentRoleError);
      return false;
    }
    
    const currentRoleNumber = currentRole?.niveles?.[0]?.numero;
    const currentRoleId = currentRole?.id_nivel_actual;
    
    // If the role is already the requested one, no need to change
    if (currentRoleNumber === newRoleNumber) {
      console.log(`User ${userId} already has role ${newRoleNumber}, no change needed`);
      return true;
    }
    
    // Get the ID of the new role
    const { data: newRole, error: newRoleError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', newRoleNumber)
      .single();
    
    if (newRoleError || !newRole) {
      console.error(`Error fetching role with number ${newRoleNumber}:`, newRoleError);
      return false;
    }
    
    // Update the existing role entry, preserving the previous role ID
    const { error: updateError } = await supabase
      .from('usuarios_niveles')
      .update({
        id_nivel_actual: newRole.id_nivel,
        id_nivel_previo: currentRoleId, // Store the current role as the previous role
        fecha_cambio: new Date().toISOString(),
      })
      .eq('id_historial', currentRole.id_historial);
    
    if (updateError) {
      console.error('Error updating user role:', updateError);
      return false;
    }
    
    console.log(`Successfully changed role for user ${userId} to ${newRoleNumber}`);
    
    // Reset the role check state to force a refresh on next auth check
    resetRoleCheckState();
    
    return true;
  } catch (err) {
    console.error('Exception in changeUserRole:', err);
    return false;
  }
}
