/* eslint-disable @typescript-eslint/no-explicit-any */
import { Certificate } from '@/interfaces/certificate';

/**
 * Get all certificates for a specific user
 */
export async function getUserCertificates(userId: string): Promise<Certificate[]> {
  try {
    const res = await fetch(`/api/certificate/user?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

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