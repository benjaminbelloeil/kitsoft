/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';
import { Certificate } from '@/interfaces/certificate';

export interface CertificateUploadData {
  file: File;
  obtainedDate: string;
  expirationDate?: string | null;
  skillId?: string;
  skillLevel?: number;
}

/**
 * Get all certificates for a specific user
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('usuarios_certificados')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_inicio', { ascending: false });
    
    if (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getUserCertificates:', err);
    return [];
  }
}

/**
 * Upload a certificate file and save certificate data
 */
export async function uploadCertificate(
  userId: string, 
  certificateData: CertificateUploadData
): Promise<{ success: boolean; error?: string; certificateId?: string }> {
  const supabase = createClient();
  
  try {
    if (!certificateData.file || !certificateData.obtainedDate) {
      return { success: false, error: 'Missing required data' };
    }

    // Upload file to Supabase Storage
    const fileExt = certificateData.file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    const filePath = `Certificados/${fileName}`;
    
    // Add content type to avoid upload errors
    const options = {
      contentType: certificateData.file.type,
      cacheControl: '3600'
    };
    
    const { error: uploadError } = await supabase.storage
      .from('usuarios')
      .upload(filePath, certificateData.file, options);
      
    if (uploadError) {
      console.error('Error uploading certificate file:', uploadError);
      return { success: false, error: uploadError.message };
    }
    
    const { data: urlData } = supabase.storage
      .from('usuarios')
      .getPublicUrl(filePath);
      
    const fileUrl = urlData?.publicUrl;
    
    if (!fileUrl) {
      return { success: false, error: 'Failed to get public URL' };
    }
    
    // Create certificate record in database
    const certificateId = crypto.randomUUID();
    
    const { error: insertError } = await supabase
      .from('usuarios_certificados')
      .insert({
        id_certificado: certificateId,
        id_usuario: userId,
        fecha_inicio: certificateData.obtainedDate,
        fecha_fin: certificateData.expirationDate || null,
        url_archivo: fileUrl
      });
      
    if (insertError) {
      console.error('Error inserting certificate record:', insertError);
      return { success: false, error: insertError.message };
    }
    
    // If skill is provided, associate it with user
    if (certificateData.skillId && certificateData.skillLevel) {
      await addSkillToUser(userId, certificateData.skillId, certificateData.skillLevel);
    }
    
    return { success: true, certificateId };
  } catch (err: any) {
    console.error('Exception in uploadCertificate:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Delete a certificate and its associated file
 */
export async function deleteCertificate(
  userId: string, 
  certificateId: string,
  fileUrl: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const filePath = `Certificados/${fileName}`;
    
    // Delete file from storage
    const { error: storageError } = await supabase.storage
      .from('usuarios')
      .remove([filePath]);
      
    if (storageError) {
      console.error('Error deleting certificate file:', storageError);
      // Continue with deletion of database record even if file deletion fails
    }
    
    // Delete certificate record from database
    const { error: deleteError } = await supabase
      .from('usuarios_certificados')
      .delete()
      .eq('id_certificado', certificateId)
      .eq('id_usuario', userId);
      
    if (deleteError) {
      console.error('Error deleting certificate record:', deleteError);
      return { success: false, error: deleteError.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteCertificate:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}

/**
 * Add a skill to the user's profile
 * This follows the same pattern as in Experience section
 */
async function addSkillToUser(
  userId: string,
  skillId: string,
  level: number
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    // Check if the user already has this skill
    const { data: existingSkill } = await supabase
      .from('usuarios_habilidades')
      .select('nivel_experiencia')
      .eq('id_usuario', userId)
      .eq('id_habilidad', skillId)
      .single();
    
    if (existingSkill) {
      // Update skill level if the new level is higher
      if (level > existingSkill.nivel_experiencia) {
        const { error } = await supabase
          .from('usuarios_habilidades')
          .update({ nivel_experiencia: level })
          .eq('id_usuario', userId)
          .eq('id_habilidad', skillId);
          
        if (error) {
          return { success: false, error: error.message };
        }
      }
      // Otherwise do nothing (keep the higher level)
      return { success: true };
    } else {
      // Insert new skill association
      const { error } = await supabase
        .from('usuarios_habilidades')
        .insert({
          id_usuario: userId,
          id_habilidad: skillId,
          nivel_experiencia: level
        });
        
      if (error) {
        return { success: false, error: error.message };
      }
      
      return { success: true };
    }
  } catch (err: any) {
    console.error('Exception in addSkillToUser:', err);
    return { success: false, error: err.message || 'An unexpected error occurred' };
  }
}
