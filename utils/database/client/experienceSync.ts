/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Define interfaces
interface Experience {
  id_experiencia?: string;
  compañia: string;
  posicion: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  id_usuario: string;
}

interface ExperienceCreateData {
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate: string | null;
  isCurrentPosition?: boolean;
}

// Convert database experience format to component format
export const formatExperienceForComponent = (data: any): ExperienceCreateData => {
  return {
    company: data.compañia || '',
    position: data.posicion || '',
    description: data.descripcion || '',
    startDate: data.fecha_inicio || '',
    endDate: data.fecha_fin || null,
    isCurrentPosition: data.fecha_fin === null
  };
};

/**
 * Get all experiences for a specific user
 */
export async function getUserExperiences(userId: string): Promise<any[]> {
  try {
    const res = await fetch(`/api/experience/user?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching user experiences:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getUserExperiences:', err);
    return [];
  }
}

/**
 * Create a new experience for a user
 */
export async function createUserExperience(
  userId: string,
  experienceData: ExperienceCreateData
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const res = await fetch('/api/experience/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, experienceData }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error creating user experience:', errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { 
      success: true, 
      id: data.id 
    };
  } catch (err: any) {
    console.error('Exception in createUserExperience:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Update an existing experience
 */
export async function updateUserExperience(
  experienceId: string,
  userId: string,
  experienceData: ExperienceCreateData
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/experience/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experienceId, userId, experienceData }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error updating user experience:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateUserExperience:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Delete an experience
 */
export async function deleteUserExperience(
  experienceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/experience/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ experienceId, userId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error deleting user experience:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteUserExperience:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Bulk sync experiences for a user
 * This is useful when you want to update multiple experiences at once
 */
export async function syncUserExperiences(
  userId: string,
  experiences: ExperienceCreateData[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/experience/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, experiences }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error syncing user experiences:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in syncUserExperiences:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}
