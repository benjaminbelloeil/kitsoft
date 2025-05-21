/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';
import { certificado, usuario_certificado } from '@/interfaces/certificate'; // Asegúrate que estén bien definidos en tu proyecto

const supabase = createClient();

const allowedTypes = ['application/pdf'];
const maxSizeMB = 10;

/** 1. Obtener todos los certificados */
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

/** 2. Subir un registro tipo usuario_certificado */
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

/** 3. Obtener todos los certificados de un usuario */
export const getCertificadosPorUsuario = async (
  userId: string
): Promise<usuario_certificado[]> => {
  try {
    if (!userId || typeof userId !== 'string') {
      console.warn("⚠️ ID de usuario no válido:", userId);
      return [];
    }

    const { data, error } = await supabase
      .from('usuarios_certificados')
      .select('*')
      .eq('id_usuario', userId);

    if (error) {
      throw new Error(JSON.stringify(error));
    }

    return data;
  } catch (err: any) {
    console.error('Error al obtener certificados del usuario:', {
      userId,
      mensaje: err?.message ?? String(err),
      errorString: JSON.stringify(err),
      raw: err,
    });
    return [];
  }
};

/** 4. Subir archivo del certificado y retornar su URL */
export const uploadCertificadoFile = async (
  userId: string,
  file: File,
  setStatus?: (msg: string) => void
): Promise<string | null> => {
  const supabase = createClient();

  const allowedTypes = ['application/pdf'];
  const maxSizeMB = 10;

  if (!allowedTypes.includes(file.type)) {
    setStatus?.('Tipo de archivo no permitido. Solo se permite PDF.');
    return null;
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    setStatus?.('El archivo excede el tamaño máximo de 10MB.');
    return null;
  }

  const fallbackExt = file.type.split('/').pop();
  const extension = file.name.includes('.') ? file.name.split('.').pop() : fallbackExt;

  if (!extension) {
    setStatus?.('El archivo debe tener una extensión válida como .pdf.');
    return null;
  }

  const baseName = file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : 'archivo';
  const safeName = `${baseName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}.${extension}`;
  const filePath = `Certificados/${userId}-${safeName}`;

  console.log("Uploading file for user:", userId);
  console.log("Sanitized file name:", safeName);
  console.log("Uploading to path:", filePath);

  const { error: uploadError } = await supabase.storage
    .from('usuarios')
    .upload(filePath, file, {
      upsert: true,
      cacheControl: '3600',
    });

  if (uploadError) {
    console.error("Upload failed:", uploadError);
    setStatus?.(`Error al subir el archivo: ${uploadError.message}`);
    return null;
  }

  const { data: publicUrlData } = supabase.storage
    .from('usuarios')
    .getPublicUrl(filePath);

  return publicUrlData?.publicUrl ?? null;
};

/** 5. Obtener archivo desde la URL pública */
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

/** 6. Obtener nombre del certificado desde su ID */
export const getNombreCertificadoPorId = async (
  id_certificado: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('certificados')
      .select('curso')
      .eq('id_certificado', id_certificado)
      .single();

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
/** 7. Eliminar certificado y su archivo en el bucket */
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
  } catch (err) {
    console.error('Error inesperado al eliminar certificado:', err);
    return { success: false, error: 'Error inesperado al eliminar certificado' };
  }
};
