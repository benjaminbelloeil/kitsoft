// Create a module-level flag to track initialization
let initialRoleCheckComplete = false;

/**
 * Manages user roles with protection against duplicate role creation
 * @param userId - The user's ID from Supabase Auth
 * @returns The role number and success status
 */
export async function ensureUserHasRole(userId: string): Promise<{ success: boolean; roleNumber?: number }> {
  // Skip if we've already run this once in the current session
  if (initialRoleCheckComplete) {
    console.log('Role check already performed in this session, skipping');
    return { success: true };
  }
  
  try {
    console.log('Starting role check for user', userId);
    
    // First clean up potential duplicate roles
    await cleanupUserRoles(userId);
    
    // Get the user role status through API
    const res = await fetch(`/api/user/role/ensure?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error('Error ensuring user role:', await res.text());
      return { success: false };
    }
    
    const data = await res.json();
    initialRoleCheckComplete = true;
    
    console.log(`User ${userId} has role number: ${data.roleNumber}`);
    
    return { 
      success: true, 
      roleNumber: data.roleNumber 
    };
  } catch (err) {
    console.error('Exception in ensureUserHasRole:', err);
    return { success: false };
  } finally {
    // Mark that we've completed the initial check
    initialRoleCheckComplete = true;
  }
}

/**
 * Checks if a user has admin privileges
 * @param userId - The user's ID from Supabase Auth
 */
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/role/admin-check?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error('Error checking admin status:', await res.text());
      return false;
    }
    
    const data = await res.json();
    console.log(`User ${userId} is admin: ${data.isAdmin}`);
    return data.isAdmin;
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
  try {
    const res = await fetch('/api/user/role/cleanup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      console.error('Error cleaning up user roles:', await res.text());
      return false;
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
  try {
    const res = await fetch('/api/user/role/reset', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      console.error('Error resetting user role:', await res.text());
      return false;
    }
    
    // Reset the role check state to force a refresh on next auth check
    resetRoleCheckState();
    
    return true;
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
  try {
    console.log(`Changing role for user ${userId} to role number ${newRoleNumber}`);
    
    const res = await fetch('/api/user/role/change', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newRoleNumber }),
    });
    
    if (!res.ok) {
      console.error('Error changing user role:', await res.text());
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