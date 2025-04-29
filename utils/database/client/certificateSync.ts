/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';
import { Certificate } from '@/interfaces/certificate';

/**
 * Get all certificates for a specific user
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('usuarios_certificados')
      .select(`
        *,
        certificados (
          id_certificado,
          nombre,
          emisor,
          descripcion
        )
      `)
      .eq('id_usuario', userId)
      .order('fecha_emision', { ascending: false });
    
    if (error) {
      console.error('Error fetching user certificates:', error);
      return [];
    }
    
    // Transform the data to match the Certificate interface
    return data ? data.map(item => ({
      id_usuario_certificado: item.id_usuario_certificado,
      id_certificado: item.id_certificado,
      id_usuario: item.id_usuario,
      fecha_emision: item.fecha_emision,
      fecha_expiracion: item.fecha_expiracion,
      url_certificado: item.url_certificado,
      nombre: item.certificados ? item.certificados.nombre : '',
      emisor: item.certificados ? item.certificados.emisor : '',
      descripcion: item.certificados ? item.certificados.descripcion : ''
    })) : [];
  } catch (err) {
    console.error('Exception in getUserCertificates:', err);
    return [];
  }
}

/**
 * Add a certificate to a user's profile
 */
export async function addUserCertificate(
  userId: string,
  certificateData: {
    id_certificado: string;
    fecha_emision: string;
    fecha_expiracion?: string | null;
    url_certificado?: string | null;
  }
): Promise<{ success: boolean; error?: string; id?: string }> {
  const supabase = createClient();
  
  try {
    // Generate a UUID for the new certificate association
    const id_usuario_certificado = crypto.randomUUID();
    
    const { error } = await supabase
      .from('usuarios_certificados')
      .insert({
        id_usuario_certificado,
        id_certificado: certificateData.id_certificado,
        id_usuario: userId,
        fecha_emision: certificateData.fecha_emision,
        fecha_expiracion: certificateData.fecha_expiracion || null,
        url_certificado: certificateData.url_certificado || null
      });
    
    if (error) {
      console.error('Error adding certificate:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, id: id_usuario_certificado };
  } catch (err: any) {
    console.error('Exception in addUserCertificate:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Update an existing user certificate
 */
export async function updateUserCertificate(
  certificateId: string,
  userId: string,
  certificateData: {
    fecha_emision?: string;
    fecha_expiracion?: string | null;
    url_certificado?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    const { error } = await supabase
      .from('usuarios_certificados')
      .update(certificateData)
      .eq('id_usuario_certificado', certificateId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this certificate
    
    if (error) {
      console.error('Error updating certificate:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateUserCertificate:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Delete a user certificate
 */
export async function deleteUserCertificate(
  certificateId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();
  
  try {
    // First check if there's a certificate file to delete from storage
    const { data: certData } = await supabase
      .from('usuarios_certificados')
      .select('url_certificado')
      .eq('id_usuario_certificado', certificateId)
      .eq('id_usuario', userId)
      .single();
    
    // Delete the file if it exists
    if (certData?.url_certificado) {
      try {
        const filePath = certData.url_certificado.split('/').pop();
        if (filePath) {
          await supabase.storage
            .from('certificados')
            .remove([`${userId}/${filePath}`]);
        }
      } catch (fileErr) {
        console.error('Error deleting certificate file:', fileErr);
        // Continue with database deletion even if file deletion fails
      }
    }
    
    // Delete from database
    const { error } = await supabase
      .from('usuarios_certificados')
      .delete()
      .eq('id_usuario_certificado', certificateId)
      .eq('id_usuario', userId);
    
    if (error) {
      console.error('Error deleting certificate:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteUserCertificate:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Get all available certificate types
 */
export async function getAllCertificateTypes(): Promise<any[]> {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('certificados')
      .select('*')
      .order('nombre');
    
    if (error) {
      console.error('Error fetching certificate types:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in getAllCertificateTypes:', err);
    return [];
  }
}

/**
 * Upload a certificate file and get a URL
 */
export async function uploadCertificateFile(
  userId: string, 
  file: File,
  setStatus?: (message: string) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  const supabase = createClient();
  
  try {
    if (!file) {
      return { success: false, error: 'No se proporcionó ningún archivo' };
    }
    
    setStatus?.('Subiendo certificado...');
    
    // Create a safe filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const path = `${userId}/${Date.now()}-${safeName}`;
    
    // Upload to storage
    const { data, error } = await supabase.storage
      .from('certificados')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) {
      console.error('Error uploading certificate file:', error);
      return { success: false, error: error.message };
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('certificados')
      .getPublicUrl(data.path);
    
    setStatus?.('Archivo subido correctamente');
    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('Error inesperado en uploadCertificateFile:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
}