/* eslint-disable @typescript-eslint/no-explicit-any */

export interface SkillData {
  id_habilidad: string;
  titulo: string;
}

export interface UserSkill {
  id_habilidad: string;
  id_usuario: string;
  nivel_experiencia: number;
  titulo?: string; // For convenience when joining with habilidades table
}

export interface ExperienceSkill {
  id_habilidad: string;
  id_experiencia: string;
  nivel_experiencia: number;
  titulo?: string; // For convenience when joining with habilidades table
}

/**
 * Get all available skills from the database
 */
export async function getAllSkills(): Promise<SkillData[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('habilidades')
      .select('*')
      .order('titulo');
    
    if (error) {
      console.error('Error fetching skills:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getAllSkills:', err);
    return [];
  }
}

/**
 * Search for skills that match a query string
 */
export async function searchSkills(query: string): Promise<SkillData[]> {
  try {
    const res = await fetch(`/api/skills/search?query=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error searching skills:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in searchSkills:', err);
    return [];
  }
}

/**
 * Get all skills for a specific user
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  try {
    const res = await fetch(`/api/skills/user?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching user skills:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getUserSkills:', err);
    return [];
  }
}

/**
 * Get all skills for a specific experience
 */
export async function getExperienceSkills(experienceId: string): Promise<ExperienceSkill[]> {
  try {
    const res = await fetch(`/api/skills/experience?experienceId=${encodeURIComponent(experienceId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching experience skills:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getExperienceSkills:', err);
    return [];
  }
}

/**
 * Add a skill to an experience and to the user
 */
export async function addSkillToExperience(
  skillName: string, 
  experienceId: string, 
  userId: string, 
  level: number
): Promise<{ success: boolean; error?: string; skillId?: string }> {
  try {
    const res = await fetch('/api/skills/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skillName,
        experienceId,
        userId,
        level
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error adding skill to experience:', errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { 
      success: true, 
      skillId: data.skillId 
    };
  } catch (err: any) {
    console.error('Exception in addSkillToExperience:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Remove a skill from an experience (and optionally from the user)
 */
export async function removeSkillFromExperience(
  skillId: string,
  experienceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/skills/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skillId,
        experienceId,
        userId
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error removing skill from experience:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in removeSkillFromExperience:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Update skill level for an existing experience skill
 */
export async function updateSkillLevel(
  skillId: string,
  experienceId: string,
  userId: string,
  level: number
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch('/api/skills/update-level', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        skillId,
        experienceId,
        userId,
        level
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error updating skill level:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateSkillLevel:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}
