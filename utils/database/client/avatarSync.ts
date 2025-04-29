import { File } from '@/interfaces';

/**
 * Uploads a user avatar image and updates the database reference
 * @param userId The user ID
 * @param file The image file to upload
 * @returns Success status and URL or error message
 */
const updateUserAvatar = async (
  userId: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Create form data for the file upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);

    // Upload the file
    const uploadResponse = await fetch('/api/avatar/upload', {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Avatar upload failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to upload avatar' };
    }

    const uploadResult = await uploadResponse.json();

    // Update the database reference with the new URL
    const updateResponse = await fetch('/api/avatar/update', {
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
      console.error('Avatar database update failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to update avatar in database' };
    }

    return { success: true, url: uploadResult.url };
  } catch (error: any) {
    console.error('Unexpected error in updateUserAvatar:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Deletes a user avatar and removes the database reference
 * @param userId The user ID
 * @param filename The filename to delete from storage
 * @returns Success status or error message
 */
const deleteUserAvatar = async (
  userId: string,
  filename: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/avatar/delete', {
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
      console.error('Avatar deletion failed:', errorData);
      return { success: false, error: errorData.error || 'Failed to delete avatar' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error in deleteUserAvatar:', error);
    return { success: false, error: error.message || 'An unexpected error occurred' };
  }
};

/**
 * Gets the avatar URL for a specific user
 * @param userId The user ID
 * @returns The avatar URL or null if not found
 */
const getUserAvatar = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/avatar/get?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to get avatar URL:', errorData);
      return null;
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching avatar URL:', error);
    return null;
  }
};

export { updateUserAvatar, deleteUserAvatar, getUserAvatar };