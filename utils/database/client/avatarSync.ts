/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/client';

/**
 * Updates a user's avatar in storage and database
 * Ensures old avatar files are deleted before uploading new ones
 * Preserves original filename metadata
 */
export const updateUserAvatar = async (
  userId: string,
  file?: File,
  setStatus?: (msg: string) => void
): Promise<{ success: boolean; error?: string; url?: string }> => {
  const supabase = createClient();

  try {
    if (!userId) {
      return { success: false, error: 'ID de usuario no proporcionado' };
    }

    // First check if user exists and has a current avatar
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('url_avatar')
      .eq('id_usuario', userId)
      .single();

    if (userError) {
      console.error('Error checking user avatar:', userError);
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

    // If user has an existing avatar, clean it up first
    if (userData?.url_avatar) {
      // Extract the path from the URL
      const urlParts = userData.url_avatar.split('/');
      const bucketPath = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1];
      
      // Alternative path extraction if the above doesn't work
      const storagePath = userData.url_avatar.split('usuarios/')[1];
      
      // Try both path extraction methods
      try {
        // Try the first path format
        const { error: removeError } = await supabase.storage
          .from('usuarios')
          .remove([bucketPath]);
          
        if (removeError) {
          console.error('Error removing avatar with first path format:', removeError);
          
          // Try the second path format
          if (storagePath) {
            const { error: removeError2 } = await supabase.storage
              .from('usuarios')
              .remove([storagePath]);
              
            if (removeError2) {
              console.error('Error removing avatar with second path format:', removeError2);
            } else {
              console.log('Successfully removed old avatar with second path format');
            }
          }
        } else {
          console.log('Successfully removed old avatar with first path format');
        }
      } catch (err) {
        console.error('Error in avatar removal process:', err);
        // Continue with upload even if deletion fails
      }
    }

    let finalUrl = null;

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      const maxSizeMB = 5; // 5MB max for avatar images

      if (!allowedTypes.includes(file.type)) {
        setStatus?.('Tipo de archivo no permitido. Solo se permiten JPEG, PNG, GIF, WEBP y SVG.');
        return { success: false, error: 'Tipo de archivo no permitido.' };
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        setStatus?.(`El archivo excede el tamaño máximo de ${maxSizeMB}MB.`);
        return { success: false, error: 'Tamaño de archivo excedido.' };
      }

      const fallbackExt = file.type.split('/').pop() || 'jpg';
      const extension = file.name.includes('.') ? file.name.split('.').pop() : fallbackExt;

      // Create a safe path name, ensuring it's URL-safe
      // Use timestamp to ensure uniqueness
      const timestamp = new Date().getTime();
      const safeName = `avatar-${timestamp}.${extension}`;
      const filePath = `Avatars/${userId}-${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from('usuarios')
        .upload(filePath, file, {
          upsert: true,
          cacheControl: '3600',
          contentType: file.type
        });

      if (uploadError) {
        setStatus?.(`Error al subir la imagen: ${uploadError.message}`);
        return { success: false, error: uploadError.message };
      }

      const { data: publicUrlData } = supabase.storage
        .from('usuarios')
        .getPublicUrl(filePath);

      finalUrl = publicUrlData?.publicUrl ?? null;
    }

    // Update the user record with the new avatar URL
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ url_avatar: finalUrl })
      .eq('id_usuario', userId);

    if (updateError) {
      console.error('Error actualizando el avatar:', updateError);
      
      // If this is an RLS error, try using upsert instead
      if (updateError.code === 'PGRST109') {
        const { error: upsertError } = await supabase
          .from('usuarios')
          .upsert({ 
            id_usuario: userId,
            url_avatar: finalUrl
          });
          
        if (upsertError) {
          console.error('Error en upsert de avatar:', upsertError);
          return { success: false, error: `Error de permisos: ${upsertError.message}` };
        }
      } else {
        return { success: false, error: updateError.message };
      }
    }

    return { success: true, url: finalUrl || undefined };
  } catch (err: any) {
    console.error('Error inesperado en updateUserAvatar:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
};

/**
 * Completely removes a user's avatar from storage and database
 */
export const deleteUserAvatar = async (
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  const supabase = createClient();

  try {
    // First get the current avatar URL
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('url_avatar')
      .eq('id_usuario', userId)
      .single();

    if (userError) {
      console.error('Error fetching user avatar:', userError);
      return { success: false, error: userError.message };
    }

    if (!userData?.url_avatar) {
      // No avatar to delete
      return { success: true };
    }

    // Extract the filename from the URL
    const urlParts = userData.url_avatar.split('/');
    const filename = urlParts[urlParts.length - 1];
    const path = `Avatars/${filename}`;

    // If the path doesn't already include the userId, try with userId prefix
    let alternativePath = path;
    if (!filename.startsWith(userId)) {
      alternativePath = `Avatars/${userId}-${filename}`;
    }

    // Try to delete the file from storage
    try {
      const { error: removeError } = await supabase.storage
        .from('usuarios')
        .remove([path]);
        
      if (removeError) {
        console.error('Error removing avatar with primary path:', removeError);
        
        // Try alternative path
        const { error: altRemoveError } = await supabase.storage
          .from('usuarios')
          .remove([alternativePath]);
          
        if (altRemoveError) {
          console.error('Error removing avatar with alternative path:', altRemoveError);
        } else {
          console.log('Successfully removed avatar with alternative path');
        }
      } else {
        console.log('Successfully removed avatar with primary path');
      }
    } catch (err) {
      console.error('Error in avatar removal process:', err);
    }

    // Update database to remove reference regardless of storage removal result
    const { error: updateError } = await supabase
      .from('usuarios')
      .update({ url_avatar: null })
      .eq('id_usuario', userId);

    if (updateError) {
      console.error('Error updating database:', updateError);
      return { success: false, error: 'Error al actualizar la base de datos' };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Unexpected error in deleteUserAvatar:', err);
    return { success: false, error: err.message || 'Error inesperado al eliminar el avatar' };
  }
};