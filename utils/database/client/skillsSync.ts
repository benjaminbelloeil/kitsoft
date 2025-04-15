import { createClient } from '@/utils/supabase/client';

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
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('habilidades')
      .select('*')
      .ilike('titulo', `%${query}%`)
      .order('titulo')
      .limit(10);
    
    if (error) {
      console.error('Error searching skills:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in searchSkills:', err);
    return [];
  }
}

/**
 * Get all skills for a specific user
 */
export async function getUserSkills(userId: string): Promise<UserSkill[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('usuarios_habilidades')
      .select(`
        *,
        habilidades (
          id_habilidad,
          titulo
        )
      `)
      .eq('id_usuario', userId);
    
    if (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }
    
    // Transform data to include skill titles directly
    return data ? data.map(item => ({
      id_habilidad: item.id_habilidad,
      id_usuario: item.id_usuario,
      nivel_experiencia: item.nivel_experiencia,
      titulo: item.habilidades ? item.habilidades.titulo : undefined
    })) : [];
  } catch (err) {
    console.error('Exception in getUserSkills:', err);
    return [];
  }
}

/**
 * Get all skills for a specific experience
 */
export async function getExperienceSkills(experienceId: string): Promise<ExperienceSkill[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('experiencias_habilidades')
      .select(`
        *,
        habilidades (
          id_habilidad,
          titulo
        )
      `)
      .eq('id_experiencia', experienceId);
    
    if (error) {
      console.error('Error fetching experience skills:', error);
      return [];
    }
    
    // Transform data to include skill titles directly
    return data ? data.map(item => ({
      id_habilidad: item.id_habilidad,
      id_experiencia: item.id_experiencia,
      nivel_experiencia: item.nivel_experiencia,
      titulo: item.habilidades ? item.habilidades.titulo : undefined
    })) : [];
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
  const supabase = createClient();
  
  try {
    // First check if the skill exists
    let skillId: string;
    
    const { data: existingSkill } = await supabase
      .from('habilidades')
      .select('id_habilidad')
      .ilike('titulo', skillName)
      .single();
    
    if (existingSkill) {
      skillId = existingSkill.id_habilidad;
    } else {
      // Create the skill if it doesn't exist
      skillId = crypto.randomUUID();
      const { error: createError } = await supabase
        .from('habilidades')
        .insert({
          id_habilidad: skillId,
          titulo: skillName
        });
      
      if (createError) {
        console.error('Error creating skill:', createError);
        return { success: false, error: createError.message };
      }
    }
    
    // Add the skill to the experience
    const { error: expSkillError } = await supabase
      .from('experiencias_habilidades')
      .upsert({
        id_habilidad: skillId,
        id_experiencia: experienceId,
        nivel_experiencia: level
      });
    
    if (expSkillError) {
      console.error('Error adding skill to experience:', expSkillError);
      return { success: false, error: expSkillError.message };
    }
    
    // Also add/update the skill for the user
    const { error: userSkillError } = await supabase
      .from('usuarios_habilidades')
      .upsert({
        id_habilidad: skillId,
        id_usuario: userId,
        nivel_experiencia: level
      });
    
    if (userSkillError) {
      console.error('Error adding skill to user:', userSkillError);
      // Don't return error here, as the main operation (adding to experience) succeeded
    }
    
    return { success: true, skillId };
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
  experienceId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('experiencias_habilidades')
      .delete()
      .eq('id_habilidad', skillId)
      .eq('id_experiencia', experienceId);
    
    if (error) {
      console.error('Error removing skill from experience:', error);
      return { success: false, error: error.message };
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
  const supabase = createClient();
  
  try {
    // Update skill in experience
    const { error: expError } = await supabase
      .from('experiencias_habilidades')
      .update({ nivel_experiencia: level })
      .eq('id_habilidad', skillId)
      .eq('id_experiencia', experienceId);
    
    if (expError) {
      console.error('Error updating experience skill level:', expError);
      return { success: false, error: expError.message };
    }
    
    // Also update the user's skill level if needed
    const { error: userError } = await supabase
      .from('usuarios_habilidades')
      .update({ nivel_experiencia: level })
      .eq('id_habilidad', skillId)
      .eq('id_usuario', userId);
    
    if (userError) {
      console.error('Error updating user skill level:', userError);
      // Don't fail the operation, as the main update succeeded
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateSkillLevel:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}
