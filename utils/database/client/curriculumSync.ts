import { createClient } from '@/utils/supabase/client';

const updateUserCurriculum = async (
  userId: string,
  file?: File,
  setStatus?: (msg: string) => void
): Promise<{ success: boolean; error?: string }> => {
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

    setStatus?.('Actualizando perfil...');
    
    // Update the user's curriculum URL in the database
    const res = await fetch('/api/curriculum/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, url: finalUrl }),
    });

    if (!res.ok) {
      const error = await res.text();
      setStatus?.('Error al actualizar el perfil');
      console.error('Error updating curriculum URL:', error);
      return { success: false, error };
    }

    setStatus?.('Currículum actualizado correctamente');
    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en updateUserCurriculum:', err);
    setStatus?.('Error inesperado al actualizar el currículum');
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

  const { success, error } = await updateUserCurriculum(userId);

  if (!success || error) {
    setStatus?.('Error al actualizar la base de datos');
  } else {
    setStatus?.('Currículum eliminado.');
  }
};

const getUserCurriculum = async (userId: string): Promise<File | null> => {
  try {
    // Use fetch API to get the user's curriculum URL
    const res = await fetch(`/api/curriculum/get?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching curriculum URL:', await res.text());
      return null;
    }

    const data = await res.json();

    if (!data?.url) {
      return null;
    }

    const parts = data.url_curriculum.split('/').pop()?.split('-') ?? [];
    const filename = parts.slice(5).join('-') || 'curriculum.pdf';

    const response = await fetch(data.url);
    const blob = await response.blob();

    return new File([blob], filename, { type: blob.type });
  } catch (err) {
    console.error('Error inesperado en getUserCurriculum:', err);
    return null;
  }
};

export { deleteUserCurriculum, updateUserCurriculum, getUserCurriculum };