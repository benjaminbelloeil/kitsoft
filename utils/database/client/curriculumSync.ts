import { File } from '@/interfaces';

/**
 * Uploads a user curriculum document and updates the database reference
 * @param userId The user ID
 * @param file The document file to upload
 * @returns Success status and URL or error message
 */
const updateUserCurriculum = async (
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    // Upload the file
    const uploadResponse = await fetch('/api/curriculum/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Curriculum upload failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to upload curriculum' };
    }

    const uploadResult = await uploadResponse.json();

    // Update the database reference with the new URL
    const updateResponse = await fetch('/api/curriculum/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        url: uploadResult.url,
      }),
    });

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      console.error('Curriculum database update failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to update curriculum in database' };
    }

    return { success: true, url: uploadResult.url };
  } catch (error: any) {
    console.error('Unexpected error in updateUserCurriculum:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Deletes a user curriculum document and removes the database reference
 * @param userId The user ID
 * @param filename The filename to delete from storage
 * @returns Success status or error message
 */
const deleteUserCurriculum = async (
  userId: string,
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/curriculum/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        filename,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Curriculum deletion failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to delete curriculum' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error in deleteUserCurriculum:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Gets the curriculum URL for a specific user
 * @param userId The user ID
 * @returns The curriculum URL or null if not found
 */
const getUserCurriculum = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/curriculum/get?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to get curriculum URL:', errorData);
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching curriculum URL:', error);
    return null;
  }
};

export { updateUserCurriculum, deleteUserCurriculum, getUserCurriculum };