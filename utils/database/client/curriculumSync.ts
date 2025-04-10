import { createClient } from '@/utils/supabase/client';

/**
 * Updates a user's curriculum in storage and database
 * Ensures old files are deleted before uploading new ones
 * Preserves original filename metadata
 */
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

    // First check if user exists and has a current curriculum
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('url_curriculum')
      .eq('id_usuario', userId)
      .single();

    if (userError) {
      console.error('Error checking user curriculum:', userError);
      // User might not exist in the usuarios table
      if (userError.code === 'PGRST116') {
        // Try to create a minimal user record first to satisfy RLS
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({ id_usuario: userId })
          .select();

        if (insertError) {
          console.error('Error creating user record:', insertError);
          return { success: false, error: 'Error de permisos: No se pudo crear el registro de usuario' };
        }
      } else {
        return { success: false, error: `Error al verificar usuario: ${userError.message}` };
      }
    }

    // If user has an existing curriculum, clean it up first
    if (userData?.url_curriculum) {
      // Extract the path from the URL
      const urlParts = userData.url_curriculum.split('/');
      const bucketPath = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
      
      // Alternative path extraction if the above doesn't work
      const storagePath = userData.url_curriculum.split('usuarios/')[1];
      
      // Try both path extraction methods
      try {
        // Try the first path format
        const { error: removeError } = await supabase.storage
          .from('usuarios')
          .remove([bucketPath]);
          
        if (removeError) {
          console.error('Error removing file with first path format:', removeError);
          
          // Try the second path format
          if (storagePath) {
            const { error: removeError2 } = await supabase.storage
              .from('usuarios')
              .remove([storagePath]);
              
            if (removeError2) {
              console.error('Error removing file with second path format:', removeError2);
            } else {
              console.log('Successfully removed old file with second path format');
            }
          }
        } else {
          console.log('Successfully removed old file with first path format');
        }
      } catch (err) {
        console.error('Error in file removal process:', err);
        // Continue with upload even if deletion fails
      }
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

      // Preserve the original filename but make it safe for storage
      // We will store this in the metadata to retrieve the original filename later
      const originalName = file.name;

      // Create a safe path name, using the original filename but ensuring it's URL-safe
      const safeName = encodeURIComponent(originalName);
      const filePath = `Curriculum/${userId}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
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

    // Check if the user exists again or create a new user record if needed
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ url_curriculum: finalUrl })
      .eq('id_usuario', userId);

    if (updateError) {
      console.error('Error actualizando el currículum:', updateError);
      
      // If this is an RLS error, try using upsert instead
      if (updateError.code === 'PGRST109') {
        const { error: upsertError } = await supabase
          .from('usuarios')
          .upsert({ 
            id_usuario: userId,
            url_curriculum: finalUrl
          });
          
        if (upsertError) {
          console.error('Error en upsert de currículum:', upsertError);
          return { success: false, error: `Error de permisos: ${upsertError.message}` };
        }
      } else {
        return { success: false, error: updateError.message };
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en updateUserCurriculum:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
};

/**
 * Completely removes a user's curriculum from storage and database
 */
const deleteUserCurriculum = async (
  userId: string,
  filename: string,
  setStatus?: (msg: string) => void
): Promise<void> => {
  const supabase = createClient();
  
  // For encoded filenames, try to use the full path
  // This is important since the filename might contain URL-encoded characters
  let path = `Curriculum/${filename}`;
  
  // If the path doesn't already include the userId, prefix it
  if (!filename.startsWith(userId)) {
    path = `Curriculum/${userId}-${filename}`;
  }

  try {
    // Delete file from storage
    const { error: deleteError } = await supabase.storage.from('usuarios').remove([path]);

    if (deleteError) {
      console.error('Error deleting file from storage:', deleteError);
      setStatus?.('Error al eliminar el archivo del bucket');
      return;
    }

    // Update database to remove reference
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ url_curriculum: null })
      .eq('id_usuario', userId);

    if (updateError) {
      console.error('Error updating database:', updateError);
      setStatus?.('Error al actualizar la base de datos');
    } else {
      setStatus?.('Currículum eliminado.');
    }
  } catch (err) {
    console.error('Unexpected error in deleteUserCurriculum:', err);
    setStatus?.('Error inesperado al eliminar el currículum');
  }
};

/**
 * Retrieves a user's curriculum from storage
 */
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
    
    // Get the original file name by decoding URL and removing userId prefix
    let displayName = fileName;
    if (fileName.includes('-')) {
      displayName = fileName.substring(fileName.indexOf('-') + 1);
      // Decode URL-encoded filename
      try {
        displayName = decodeURIComponent(displayName);
      } catch (e) {
        console.error('Error decoding filename:', e);
      }
    }

    const response = await fetch(data.url_curriculum);
    const blob = await response.blob();

    return new File([blob], displayName, { type: blob.type });
  } catch (err) {
    console.error('Error al obtener el archivo del currículum:', err);
    return null;
  }
};

export { deleteUserCurriculum, updateUserCurriculum, getUserCurriculum };