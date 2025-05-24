/* eslint-disable @typescript-eslint/no-explicit-any */
import { certificado } from '@/interfaces/certificate';

/**
 * Get all certificates for a specific user
 */
export async function getUserCertificates(userId: string): Promise<certificado[]> {
  try {
    const res = await fetch(`/api/certificate/user?userId=${encodeURIComponent(userId)}`);

    if (!res.ok) {
      console.error('Error fetching user certificates:', await res.text());
      return [];
    }

    return await res.json();
  } catch (err) {
    console.error('Exception in getUserCertificates:', err);
    return [];
  }
}

/**
 * Get certificates for a user - alias for compatibility
 */
export const getCertificadosPorUsuario = getUserCertificates;

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
  try {
    const res = await fetch('/api/certificate/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ certificateId, userId, certificateData }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error updating certificate:', errorText);
      return { success: false, error: errorText };
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