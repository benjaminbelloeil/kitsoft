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
    return { success: true };
  }
  
  try {
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
      return { success: false };
    }
    
    const data = await res.json();
    initialLevelCheckComplete = true;
    
    return { 
      success: true, 
      levelNumber: data.levelNumber 
    };
  } catch {
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
      return false;
    }
    
    const data = await res.json();
    return data.isAdmin;
  } catch {
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
      return false;
    }
    
    return true;
  } catch {
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
      return false;
    }
    
    // Reset the level check state to force a refresh on next auth check
    resetLevelCheckState();
    
    return true;
  } catch {
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
    const res = await fetch('/api/admin/users/change-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, newLevelNumber }),
    });
    
    if (!res.ok) {
      return false;
    }
    
    // Reset the level check state to force a refresh on next auth check
    resetLevelCheckState();
    
    return true;
  } catch {
    return false;
  }
}