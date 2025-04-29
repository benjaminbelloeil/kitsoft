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
      // Create a FormData object to handle file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      
      setStatus?.('Subiendo currículum...');
      
      // Use fetch API to upload the file
      const uploadRes = await fetch('/api/curriculum/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadRes.ok) {
        const error = await uploadRes.text();
        setStatus?.('Error al subir el archivo');
        console.error('Error uploading curriculum:', error);
        return { success: false, error: 'Error al subir el archivo' };
      }
      
      const uploadData = await uploadRes.json();
      finalUrl = uploadData.url;
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
  try {
    const safeName = filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    
    setStatus?.('Eliminando currículum...');
    
    // Use fetch API to delete the file
    const deleteRes = await fetch('/api/curriculum/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, filename: safeName }),
    });

    if (!deleteRes.ok) {
      setStatus?.('Error al eliminar el archivo');
      console.error('Error deleting curriculum:', await deleteRes.text());
      return;
    }

    // Update the user's curriculum URL in the database
    const { success, error } = await updateUserCurriculum(userId);

    if (!success || error) {
      setStatus?.('Error al actualizar la base de datos');
    } else {
      setStatus?.('Currículum eliminado.');
    }
  } catch (err) {
    console.error('Error inesperado en deleteUserCurriculum:', err);
    setStatus?.('Error inesperado al eliminar el currículum');
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

    const parts = data.url.split('/').pop()?.split('-') ?? [];
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