import { Usuario } from '@/interfaces/user';

/**
 * This function can be used to get a user's profile from the usuario table
 * @param userId - The user's ID from Supabase Auth
 * @returns The user profile or null
 */
export async function getUserProfile(userId: string): Promise<Usuario | null> {
  try {
    const res = await fetch(`/api/user/profile?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching user profile:', await res.text());
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getUserProfile:', err);
    return null;
  }
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
  try {
    const res = await fetch('/api/user/profile/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, userData }),
    });

    if (!res.ok) {
      console.error('Error updating user profile:', await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Exception in updateUserProfile:', err);
    return false;
  }
}

/**
 * Manual function to ensure a user exists in the usuario table
 * This should rarely be needed as the database trigger handles this automatically
 */
export async function ensureUserExists(userId: string): Promise<boolean> {
  try {
    const res = await fetch('/api/user/ensure', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      console.error('Error ensuring user exists:', await res.text());
      return false;
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in ensureUserExists:', err);
    return false;
  }
}

/**
 * Function to fetch the user's auth details and update profile fields
 * This can be used to synchronize user email from auth to profile
 */
export async function syncUserAuthDetails(): Promise<boolean> {
  try {
    const res = await fetch('/api/user/sync-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error syncing user auth details:', await res.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('Error in syncUserAuthDetails:', err);
    return false;
  }
}

/**
 * Get the authenticated user's email from Supabase Auth
 * @returns The user's email or null if not authenticated
 */
export async function getAuthUserEmail(): Promise<string | null> {
  try {
    const res = await fetch('/api/user/email', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching auth user email:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.email;
  } catch (err) {
    console.error('Error in getAuthUserEmail:', err);
    return null;
  }
}

/**
 * Client-side function to get all users
 * Use this in client components
 */
export async function getAllUsersClient(): Promise<Usuario[]> {
  try {
    const res = await fetch('/api/user/all', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching all users:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Error in getAllUsersClient:', err);
    return [];
  }
}
