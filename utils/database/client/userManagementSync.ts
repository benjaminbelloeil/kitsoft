/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface User {
  id_usuario: string;
  nombre?: string;
  apellido?: string;
  titulo?: string;
  email?: string;
  url_avatar?: string | null;
  registered: boolean;
  role?: {
    id_nivel?: string;
    numero?: number;
    titulo?: string;
  };
  lastLogin?: string | null;
  hasLoggedIn?: boolean; // New field to track if the user has ever logged in
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
  try {
    const res = await fetch('/api/admin/users/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching users with roles:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getAllUsersWithRoles:', err);
    return [];
  }
}

/**
 * Get all available levels
 */
export async function getAllLevels(): Promise<UserRole[]> {
  try {
    const res = await fetch('/api/admin/levels/list', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching levels:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getAllLevels:', err);
    return [];
  }
}

/**
 * Update a user's level - completely replaces the previous implementation
 * to fix issues with level changes not persisting
 */
export async function updateUserLevel(
  userId: string, 
  levelId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Updating level for user ${userId} to ${levelId}`);
    
    const res = await fetch('/api/admin/users/update-level', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, levelId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error updating user level:', errorText);
      return { success: false, error: errorText };
    }

    console.log(`Successfully updated level for user ${userId}`);
    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateUserRole:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Cleans up duplicate entries for a user in auth-related tables
 * @param userId - The user's ID from Supabase Auth
 */
export async function cleanupDuplicateEntries(userId: string): Promise<boolean> {
  try {
    console.log(`Cleaning up potential duplicate entries for user ${userId}`);
    
    const res = await fetch('/api/admin/users/cleanup-duplicates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      console.error('Error cleaning up duplicate entries:', await res.text());
      return false;
    }

    const { success } = await res.json();
    return success;
  } catch (err) {
    console.error('Exception in cleanupDuplicateEntries:', err);
    return false;
  }
}

/**
 * Completely deletes a user and all associated data including authentication
 * Uses a rollback mechanism to prevent partial deletions
 */
export async function deleteUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log(`Starting complete deletion of user: ${userId}`);

    const res = await fetch('/api/admin/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      try {
        // Try to parse the error as JSON
        const errorData = JSON.parse(errorText);
        return { success: false, error: errorData.error || errorText };
      } catch (e) {
        // If parsing fails, just return the error text
        return { success: false, error: errorText };
      }
    }

    const data = await res.json();
    return { 
      success: data.success,
      error: data.error
    };
  } catch (err: any) {
    console.error('Exception in deleteUser:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}