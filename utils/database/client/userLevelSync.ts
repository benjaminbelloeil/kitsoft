// Create a module-level flag to track initialization
let initialLevelCheckComplete = false;

/**
 * Manages user levels with protection against duplicate level creation
 * @param userId - The user's ID from Supabase Auth
 * @returns The level number and success status
 */
export async function ensureUserHasLevel(userId: string): Promise<{ success: boolean; levelNumber?: number }> {
  // Skip if we've already run this once in the current session
  if (initialLevelCheckComplete) {
    console.log('Level check already performed in this session, skipping');
    return { success: true };
  }
  
  try {
    console.log('Starting level check for user', userId);
    
    // First clean up potential duplicate levels
    await cleanupUserLevels(userId);
    
    // Get the user level status through API
    const res = await fetch(`/api/user/level/ensure?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      console.error('Error ensuring user level:', await res.text());
      return { success: false };
    }
    
    const data = await res.json();
    initialLevelCheckComplete = true;
    
    console.log(`User ${userId} has level number: ${data.levelNumber}`);
    
    return { 
      success: true, 
      levelNumber: data.levelNumber 
    };
  } catch (err) {
    console.error('Exception in ensureUserHasLevel:', err);
    return { success: false };
  } finally {
    // Mark that we've completed the initial check
    initialLevelCheckComplete = true;
  }
}

/**
 * Checks if a user has admin privileges
 * @param userId - The user's ID from Supabase Auth
 */
export async function checkUserIsAdmin(userId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/level/is-admin?userId=${encodeURIComponent(userId)}`, {
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
export function resetLevelCheckState() {
  initialLevelCheckComplete = false;
}

/**
 * Clean up duplicate level entries for a user - enhanced version
 * @param userId - The user's ID from Supabase Auth
 */
export async function cleanupUserLevels(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/maintenance/cleanup-levels', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      console.error('Error cleaning up user levels:', await res.text());
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in cleanupUserLevels:', err);
    return false;
  }
}

/**
 * Completely resets a user's level to staff level (for testing or fixing issues)
 * @param userId - The user's ID from Supabase Auth
 */
export async function resetUserLevel(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/admin/users/reset-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });
    
    if (!res.ok) {
      console.error('Error resetting user level:', await res.text());
      return false;
    }
    
    // Reset the level check state to force a refresh on next auth check
    resetLevelCheckState();
    
    return true;
  } catch (err) {
    console.error('Exception in resetUserLevel:', err);
    return false;
  }
}

/**
 * Changes a user's level in the database
 * @param userId - The user's ID from Supabase Auth
 * @param newLevelNumber - The new level number to assign (0 for staff, 1 for admin)
 * @returns Success status of the operation
 */
export async function changeUserLevel(userId: string, newLevelNumber: number): Promise<boolean> {
  try {
    console.log(`Changing level for user ${userId} to level number ${newLevelNumber}`);
    
    const res = await fetch('/api/admin/users/change-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newLevelNumber }),
    });
    
    if (!res.ok) {
      console.error('Error changing user level:', await res.text());
      return false;
    }
    
    console.log(`Successfully changed level for user ${userId} to ${newLevelNumber}`);
    
    // Reset the level check state to force a refresh on next auth check
    resetLevelCheckState();
    
    return true;
  } catch (err) {
    console.error('Exception in changeUserLevel:', err);
    return false;
  }
}