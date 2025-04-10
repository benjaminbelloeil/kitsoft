import { createClient } from '@/utils/supabase/client';

const updateUserCurriculum = async (
  userId: string,
  file?: File,
  setStatus?: (msg: string) => void
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient();

  try {
    if (!userId) {
      return { success: false, error: 'ID de usuario no proporcionado' };
    }

    let finalUrl = null;

    if (file) {
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSizeMB = 10;

      if (!allowedTypes.includes(file.type)) {
        setStatus?.('Tipo de archivo no permitido. Solo se permiten PDF, DOC y DOCX.');
        return { success: false, error: 'Tipo de archivo no permitido.' };
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setStatus?.('El archivo excede el tamaño máximo de 10MB.');
        return { success: false, error: 'Tamaño de archivo excedido.' };
      }

      const fallbackExt = file.type.split('/').pop();
      const extension = file.name.includes('.') ? file.name.split('.').pop() : fallbackExt;

      if (!extension) {
        setStatus?.('El archivo debe tener una extensión válida como .pdf o .docx.');
        return { success: false, error: 'Extensión inválida.' };
      }

      const baseName = file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : 'archivo';
      const safeName = `${baseName.replace(/[^a-zA-Z0-9.\-_]/g, '_')}.${extension}`;
      const filePath = `Curriculum/${userId}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
        });

      if (uploadError) {
        setStatus?.(`Error al subir el archivo: ${uploadError.message}`);
        return { success: false, error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('usuarios')
        .getPublicUrl(filePath);

      finalUrl = publicUrlData?.publicUrl ?? null;
    }

    const { error } = await supabase
      .from('usuarios')
      .update({ url_curriculum: finalUrl })
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error actualizando el currículum:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en updateUserCurriculum:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
};

const deleteUserCurriculum = async (
  userId: string,
  filename: string,
  setStatus?: (msg: string) => void
): Promise<void> => {
  const supabase = createClient();
  const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  const path = `Curriculum/${userId}-${safeName}`;

  const { error: deleteError } = await supabase.storage.from('usuarios').remove([path]);

  if (deleteError) {
    setStatus?.('Error al eliminar el archivo del bucket');
    return;
  }

  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ url_curriculum: null })
    .eq('id_usuario', userId);

  if (updateError) {
    setStatus?.('Error al actualizar la base de datos');
  } else {
    setStatus?.('Currículum eliminado.');
  }
};

const getUserCurriculum = async (userId: string): Promise<File | null> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('url_curriculum')
      .eq('id_usuario', userId)
      .single();

    if (error) {
      console.error('Error al obtener el URL del currículum:', error);
      return null;
    }

    if (!data?.url_curriculum) {
      return null;
    }

    // Extract filename from the URL path
    const fileName = data.url_curriculum.split('/').pop() || 'curriculum.pdf';
    // Remove the userId prefix if it exists
    const displayName = fileName.includes('-') ? 
      fileName.substring(fileName.indexOf('-') + 1) : 
      fileName;

    const response = await fetch(data.url_curriculum);
    const blob = await response.blob();

    return new File([blob], displayName, { type: blob.type });
  } catch (err) {
    console.error('Error al obtener el archivo del currículum:', err);
    return null;
  }
};

export { deleteUserCurriculum, updateUserCurriculum, getUserCurriculum };