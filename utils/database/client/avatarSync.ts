/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Update user avatar using the secure API endpoint
 */
export async function updateUserAvatar(
  userId: string,
  file?: File,
  setStatus?: (msg: string) => void
): Promise<{ success: boolean; error?: string; url?: string }> {
  try {
    if (!userId) {
      return { success: false, error: 'No se proporcionó un ID de usuario' };
    }

    if (!file) {
      // Just update database to remove avatar reference
      const res = await fetch('/api/avatar/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, url: null }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Error removing avatar reference:', errorText);
        return { success: false, error: errorText };
      }

      return { success: true };
    }

    // File is provided, upload it first
    setStatus?.('Subiendo avatar...');

    // Create form data for file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    const uploadRes = await fetch('/api/avatar/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      console.error('Error uploading avatar:', errorText);
      return { success: false, error: errorText };
    }

    // Get URL from upload response
    const { url } = await uploadRes.json();

    // Update database with new URL
    setStatus?.('Actualizando perfil con nuevo avatar...');

    const updateRes = await fetch('/api/avatar/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, url }),
    });

    if (!updateRes.ok) {
      const errorText = await updateRes.text();
      console.error('Error updating avatar in database:', errorText);
      return { success: false, error: errorText };
    }

    setStatus?.('Avatar actualizado con éxito');
    return { success: true, url };
  } catch (err: any) {
    console.error('Error inesperado en updateUserAvatar:', err);
    return { success: false, error: err.message || 'Error desconocido' };
  }
}

/**
 * Delete user avatar using the secure API endpoint
 */
export async function deleteUserAvatar(
  userId: string,
  filename: string,
  setStatus?: (msg: string) => void
): Promise<{ success: boolean; error?: string }> {
  try {
    setStatus?.('Eliminando avatar...');
    
    const res = await fetch(`/api/avatar/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, filename }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error deleting avatar:', errorText);
      setStatus?.('Error al eliminar el avatar');
      return { success: false, error: errorText };
    }

    setStatus?.('Avatar eliminado con éxito');
    return { success: true };
  } catch (err: any) {
    console.error('Error inesperado en deleteUserAvatar:', err);
    setStatus?.('Error al eliminar el avatar');
    return { success: false, error: err.message || 'Error desconocido' };
  }
}

/**
 * Get user avatar URL
 */
export async function getUserAvatarUrl(userId: string): Promise<string | null> {
  try {
    const res = await fetch(`/api/avatar/get?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.error('Error fetching avatar URL:', await res.text());
      return null;
    }

    const data = await res.json();
    return data.url;
  } catch (err) {
    console.error('Error inesperado en getUserAvatarUrl:', err);
    return null;
  }
}