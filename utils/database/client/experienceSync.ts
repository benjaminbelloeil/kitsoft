/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';
import { getExperienceSkills } from './skillsSync';

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

// Convert component experience format to database format
const formatExperienceForDb = (data: ExperienceCreateData, userId: string, experienceId?: string): Experience => {
  // If it's marked as current position, set fecha_fin to null
  // Otherwise, use the provided end date or today's date if none provided
  const fechaFin = data.isCurrentPosition ? 
    null : 
    (data.endDate || new Date().toISOString().split('T')[0]);
  
  return {
    ...(experienceId && { id_experiencia: experienceId }),
    compañia: data.company,
    posicion: data.position,
    descripcion: data.description,
    fecha_inicio: data.startDate,
    fecha_fin: fechaFin,
    id_usuario: userId
  };
};

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
  const supabase = createClient();
  
  try {
    // Fetch the experiences
    const { data: experiences, error } = await supabase
      .from('experiencia')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_inicio', { ascending: false });
    
    if (error) {
      console.error('Error fetching user experiences:', error);
      return [];
    }
    
    if (!experiences || experiences.length === 0) {
      return [];
    }
    
    // Fetch skills for each experience
    const experiencesWithSkills = await Promise.all(
      experiences.map(async (exp) => {
        // Get the skills for this experience
        try {
          const expSkills = await supabase
            .from('experiencias_habilidades')
            .select(`
              id_habilidad,
              nivel_experiencia,
              habilidades (
                id_habilidad,
                titulo
              )
            `)
            .eq('id_experiencia', exp.id_experiencia);
            
          // Transform skills to the format expected by the UI
          const skills = expSkills.data ? expSkills.data.map(skillRecord => ({
            id_habilidad: skillRecord.id_habilidad,
            nivel_experiencia: skillRecord.nivel_experiencia,
            titulo: skillRecord.habilidades ? skillRecord.habilidades.titulo : 'Unnamed skill'
          })) : [];
          
          return {
            ...exp,
            habilidades: skills
          };
        } catch (skillError) {
          console.error(`Error fetching skills for experience ${exp.id_experiencia}:`, skillError);
          return {
            ...exp,
            habilidades: []
          };
        }
      })
    );
    
    return experiencesWithSkills;
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
  const supabase = createClient();
  
  try {
    // Format the experience data for the database
    const dbExperience = formatExperienceForDb(experienceData, userId);
    
    // Generate a UUID for the new experience
    dbExperience.id_experiencia = crypto.randomUUID();
    
    const { data, error } = await supabase
      .from('experiencia')
      .insert(dbExperience)
      .select();
    
    if (error) {
      console.error('Error creating experience:', error);
      return { success: false, error: error.message };
    }
    
    return { 
      success: true, 
      id: data && data[0] ? data[0].id_experiencia : undefined
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
  const supabase = createClient();
  
  try {
    // Format the experience data for the database
    const dbExperience = formatExperienceForDb(experienceData, userId, experienceId);
    
    const { error } = await supabase
      .from('experiencia')
      .update(dbExperience)
      .eq('id_experiencia', experienceId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this experience
    
    if (error) {
      console.error('Error updating experience:', error);
      return { success: false, error: error.message };
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
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('experiencia')
      .delete()
      .eq('id_experiencia', experienceId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this experience
    
    if (error) {
      console.error('Error deleting experience:', error);
      return { success: false, error: error.message };
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
  const supabase = createClient();
  
  try {
    // First get all existing experiences for this user
    const { data: existingExp, error: fetchError } = await supabase
      .from('experiencia')
      .select('id_experiencia')
      .eq('id_usuario', userId);
      
    if (fetchError) {
      console.error('Error fetching existing experiences:', fetchError);
      return { success: false, error: fetchError.message };
    }
    
    // Format all experiences for the database
    const dbExperiences = experiences.map(exp => {
      // Give each experience a UUID
      return formatExperienceForDb(exp, userId, crypto.randomUUID());
    });
    
    // Use upsert to handle both inserts and updates
    const { error: upsertError } = await supabase
      .from('experiencia')
      .upsert(dbExperiences);
      
    if (upsertError) {
      console.error('Error syncing experiences:', upsertError);
      return { success: false, error: upsertError.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in syncUserExperiences:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}
