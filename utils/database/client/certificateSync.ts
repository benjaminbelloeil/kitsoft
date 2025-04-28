/* eslint-disable @typescript-eslint/no-explicit-any */
import { Certificate } from '@/interfaces/certificate';

const supabase = createClient();

const allowedTypes = ['application/pdf'];
const maxSizeMB = 10;

/**
 * Obtiene todos los certificados disponibles en la base de datos.
 * @returns Una promesa que resuelve un arreglo de objetos certificado.
 */
export const getAllCertificados = async (): Promise<certificado[]> => {
  const { data, error } = await supabase
    .from('certificados')
    .select('*');

  if (error) {
    console.error('Error al obtener certificados:', error);
    return [];
  }

  return data;
};

/**
 * Inserta o actualiza un registro de usuario_certificado en la base de datos.
 * @param entry Objeto usuario_certificado a insertar o actualizar.
 * @returns Una promesa que resuelve un objeto indicando éxito o error.
 */
export const addUsuarioCertificado = async (
  entry: usuario_certificado
): Promise<{ success: boolean; error?: string }> => {
  const { error } = await supabase
    .from('usuarios_certificados')
    .upsert([entry], { onConflict: 'id_certificado,id_usuario' });

  if (error) {
    console.error('Error al registrar certificado del usuario:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

/**
 * Obtiene todos los certificados asociados a un usuario específico.
 * @param userId ID del usuario para filtrar los certificados.
 * @returns Una promesa que resuelve un arreglo de usuario_certificado.
 */
export const getCertificadosPorUsuario = async (
  userId: string
): Promise<usuario_certificado[]> => {
  try {
    if (!userId || typeof userId !== 'string' || userId.length !== 36) {
      console.warn("⚠️ ID de usuario inválido, no haciendo consulta:", userId);
      return [];
    }

    const { data, error } = await supabase
      .from('usuarios_certificados')
      .select('*')
      .eq('id_usuario', userId);

    if (error && (error.message || error.code)) {
      console.error('Error real de Supabase al obtener certificados:', error);
      return [];
    }

    return data ?? [];
  } catch (err: any) {
    console.error('Error inesperado en getCertificadosPorUsuario:', {
      userId,
      mensaje: err?.message ?? String(err),
      errorString: JSON.stringify(err),
      raw: err,
    });
    return [];
  }
}

/**
 * Sube un archivo de certificado para un usuario y retorna su URL pública.
 * @param userId ID del usuario al que pertenece el certificado.
 * @param file Archivo a subir.
 * @param setStatus Función opcional para actualizar el estado o mensajes.
 * @returns Una promesa que resuelve la URL pública del archivo o null si falla.
 */
export const uploadCertificadoFile = async (
  userId: string,
  certificateData: {
    id_certificado: string;
    fecha_emision: string;
    fecha_expiracion?: string | null;
    url_certificado?: string | null;
  }
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const res = await fetch('/api/certificate/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, certificateData }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error adding certificate:', errorText);
      return { success: false, error: errorText };
    }

    const data = await res.json();
    return { success: true, id: data.id };
  } catch (err: any) {
    console.error('Exception in addUserCertificate:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Add a user certificate - alias for compatibility
 */
export const addUsuarioCertificado = addUserCertificate;

  return publicUrlData?.publicUrl ?? null;
};

/**
 * Descarga un archivo desde una URL pública y lo retorna como un objeto File.
 * @param url URL pública del archivo a descargar.
 * @returns Una promesa que resuelve un objeto File o null si falla.
 */
export const getArchivoDesdeUrl = async (
  url: string
): Promise<File | null> => {
  try {
    if (!url || typeof url !== 'string') {
      console.error("URL no válida o no proporcionada.");
      return null;
    }

    const lastSegment = url.split('/').pop();
    const filename = decodeURIComponent(lastSegment || 'certificado.pdf');

    const response = await fetch(url);
    const blob = await response.blob();

    return new File([blob], filename, { type: blob.type });
  } catch (err) {
    console.error('Error al obtener archivo desde la URL:', err);
    return null;
  }
};

/**
 * Obtiene el nombre del certificado (curso) a partir de su ID.
 * @param id_certificado ID del certificado a buscar.
 * @returns Una promesa que resuelve el nombre del curso o null si no se encuentra.
 */
export const getNombreCertificadoPorId = async (
  id_certificado: string
): Promise<string | null> => {
  try {
    const res = await fetch('/api/certificate/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateId, userId, certificateData }),
    });

    if (error) {
      console.error('Error al obtener el nombre del certificado:', error);
      return null;
    }

    return data?.curso ?? null;
  } catch (err) {
    console.error('Error inesperado en getNombreCertificadoPorId:', err);
    return null;
  }
};

/**
 * Elimina un certificado y su archivo asociado en el bucket de almacenamiento.
 * @param entry Objeto usuario_certificado que contiene la información para eliminar.
 * @returns Una promesa que resuelve un objeto indicando éxito o error.
 */
export const deleteUsuarioCertificado = async (
  entry: usuario_certificado
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient();

  try {
    if (!entry.url_archivo) {
      console.error('No se proporcionó la URL del archivo para eliminar.');
      return { success: false, error: 'URL del archivo no disponible.' };
    }

    // 1. Eliminar archivo del bucket
    const parts = entry.url_archivo.split('/');
    const bucketFilePath = parts.slice(parts.indexOf('usuarios') + 1).join('/');

    const { error: deleteFileError } = await supabase.storage
      .from('usuarios')
      .remove([bucketFilePath]);

    if (deleteFileError) {
      console.error('Error al eliminar archivo del bucket:', deleteFileError);
      return { success: false, error: 'No se pudo eliminar el archivo del bucket' };
    }

    // 2. Eliminar registro en la tabla usuarios_certificados
    const { error: deleteRowError } = await supabase
      .from('usuarios_certificados')
      .delete()
      .match({ id_certificado: entry.id_certificado, id_usuario: entry.id_usuario });

    if (deleteRowError) {
      console.error('Error al eliminar certificado del usuario:', deleteRowError);
      return { success: false, error: 'No se pudo eliminar el registro de la base de datos' };
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
  try {
    const res = await fetch('/api/certificate/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateId, userId }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error deleting certificate:', errorText);
      return { success: false, error: errorText };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in deleteUserCertificate:', err);
    return { success: false, error: err.message || 'Error inesperado' };
  }
}

/**
 * Delete user certificate - alias for compatibility
 */
export const deleteUsuarioCertificado = deleteUserCertificate;

/**
 * Get all available certificate types
 */
export async function getAllCertificateTypes(): Promise<any[]> {
  try {
    const res = await fetch('/api/certificate/types', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching certificate types:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getAllCertificateTypes:', err);
    return [];
  }
}

/**
 * Get all certificates - alias for compatibility 
 */
export const getAllCertificados = getAllCertificateTypes;

/**
 * Upload a certificate file and get a URL
 */
export async function uploadCertificateFile(
  userId: string, 
  file: File,
  setStatus?: (message: string) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    if (!file) {
      return { success: false, error: 'No se proporcionó ningún archivo' };
    }
    
    setStatus?.('Subiendo certificado...');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    const res = await fetch('/api/certificate/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error uploading certificate file:', errorText);
      return { success: false, error: errorText };
    }
    
    const data = await res.json();
    setStatus?.('Archivo subido correctamente');
    return { success: true, url: data.url };
  } catch (err: any) {
    console.error('Error inesperado en uploadCertificateFile:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
}

/**
 * Upload certificate file - alias for compatibility
 */
export const uploadCertificadoFile = uploadCertificateFile;

/**
 * Get file from URL - needed for file display
 */
export async function getFileFromUrl(url: string): Promise<Blob | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching file: ${response.statusText}`);
    }
    return await response.blob();
  } catch (error) {
    console.error('Error in getFileFromUrl:', error);
    return null;
  }
}

/**
 * Get file from URL - alias for compatibility
 */
export const getArchivoDesdeUrl = getFileFromUrl;

/**
 * Get certificate name by ID
 */
export async function getCertificateNameById(certificateId: string): Promise<string> {
  try {
    const res = await fetch(`/api/certificate/name?id=${encodeURIComponent(certificateId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching certificate name:', await res.text());
      return 'Certificado';
    }

    const data = await res.json();
    return data.name || 'Certificado';
  } catch (err) {
    console.error('Exception in getCertificateNameById:', err);
    return 'Certificado';
  }
}

/**
 * Get certificate name by ID - alias for compatibility
 */
export const getNombreCertificadoPorId = getCertificateNameById;