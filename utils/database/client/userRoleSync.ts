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
      console.log(`User ${userId} has role number: ${roleData?.niveles?.numero}`);
      
      return { 
        success: true, 
        roleNumber: roleData?.niveles?.numero 
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
      roleNumber: mostRecentRole.niveles?.numero 
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
    const isAdmin = userRole.niveles.numero === 1;
    console.log(`User ${userId} has role number: ${userRole.niveles.numero}, isAdmin: ${isAdmin}`);
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
 * Clean up duplicate role entries for a user
 * @param userId - The user's ID from Supabase Auth
 */
export async function cleanupUserRoles(userId: string): Promise<void> {
  // Since we now handle cleanup in the main function, just call that
  await ensureUserHasRole(userId);
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
