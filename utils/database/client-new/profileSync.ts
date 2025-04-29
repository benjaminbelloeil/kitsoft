/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';

/**
 * Saves complete user profile data to the database
 * Using lowercase table names to avoid case sensitivity issues
 */
export async function saveUserProfile(profileData: UserProfileUpdate): Promise<{success: boolean, error?: string}> {
  try {
    console.log("Starting profile save with: ", JSON.stringify(profileData, null, 2));
    
    // Basic validation
    if (!profileData.ID_Usuario) {
      return { success: false, error: 'ID de usuario no proporcionado' };
    }
    
    // Send the profile data to the API
    const res = await fetch('/api/profile/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error saving profile:', errorText);
      return { success: false, error: errorText || 'Error saving profile' };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in saveUserProfile:', error);
    return { success: false, error: `Error inesperado: ${error?.message || 'Error desconocido'}` };
  }
}

/**
 * Fetches the complete user profile including related data
 */
export async function getUserCompleteProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log(`Fetching profile for user ID: ${userId}`);
    
    // Send the request to the API
    const res = await fetch(`/api/profile/get?userId=${encodeURIComponent(userId)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Error fetching profile: ${errorText}`);
      return null;
    }
    
    const profileData = await res.json();
    return profileData;
  } catch (error) {
    console.error('Unexpected error in getUserCompleteProfile:', error);
    return null;
  }
}