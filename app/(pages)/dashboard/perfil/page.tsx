"use client";
import { useState, useEffect } from "react";
import { userData } from "@/app/lib/data"; // Keep this import for other sections
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { Project } from '@/interfaces/project';
import { createClient } from '@/utils/supabase/client';
import { saveUserProfile, getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { NotificationContainer, useNotificationState } from "@/components/ui/toast-notification";

// Import profile components
import ProfileHeader from "@/components/profile/ProfileHeader";
import ResumeUpload from "@/components/profile/ResumeUpload";
import CertificatesSection from "@/components/profile/CertificatesSection";
import SkillsSection from "@/components/profile/SkillsSection";
import ExperienceSection from "@/components/profile/ExperienceSection";

export default function ProfilePage() {
  // Create an empty profile with placeholder header data
  const emptyProfile: UserProfile = {
    id_usuario: "user-id", // Required by UserProfile interface
    ID_Usuario: "user-id", // This will be replaced with the actual user ID
    Nombre: "",
    Apellido: "",
    Titulo: "",
    Bio: "",
    URL_Avatar: "placeholder-avatar.png",
    // Keep other dummy data for the rest of the components
    projects: userData.projects as Project[],
    skills: userData.skills ? userData.skills.map(skill => ({ 
      Nombre: skill, 
      Nivel: 3, 
      Categoria: 'General' 
    })) : [],
    experience: [] // Remove dummy experience data
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(emptyProfile);
  const [isNewUser, setIsNewUser] = useState(true);
  const [, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullyLoaded, setFullyLoaded] = useState(false);
  const [globalSkills, setGlobalSkills] = useState<Array<{id: string, name: string, level: number}>>([]);

  // Global notification state
  const notificationState = useNotificationState();

  // Fetch user data on component mount
  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      const supabase = createClient();
      
      try {
        // First get the current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error("No authenticated user found");
          setTimeout(() => {
            setLoading(false);
            setFullyLoaded(true);
          }, 300);
          return;
        }
        
        console.log("Current authenticated user:", user.id);
        
        // Update the empty profile with the correct user ID
        setUserProfile(prev => ({
          ...prev,
          ID_Usuario: user.id
        }));
        
        // Try to fetch complete profile
        console.log("Fetching profile data for user:", user.id);
        const profileData = await getUserCompleteProfile(user.id);
        console.log("Profile data received:", profileData);
        
        if (profileData) {
          // If profile exists, use it but keep the projects/skills
          setUserProfile(prev => {
            console.log("Updating user profile with:", profileData);
            return {
              ...profileData,
              // Ensure these properties exist
              projects: prev.projects || [],
              skills: prev.skills || [],
              experience: [] // Remove dummy experiences
            };
          });
          setIsNewUser(false);
        } else {
          console.log("No profile data found, user is new");
          // It's a new user, keep the empty profile but with the correct ID
          setIsNewUser(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        // Add a slight delay to ensure all components load at the same time
        setTimeout(() => {
          setLoading(false);
          setFullyLoaded(true);
        }, 300);
      }
    }
    
    fetchUserData();
  }, []);

  const handleProfileUpdate = async (updatedData: UserProfileUpdate) => {
    setSaving(true);
    
    try {
      console.log("Saving profile with data:", updatedData);
      
      // Simple update approach that keeps the user ID unchanged
      const userId = userProfile.ID_Usuario;
      
      // Create a safe update object with the fixed user ID
      const safeUpdateData = {
        ...updatedData,
        ID_Usuario: userId,
        // Keep placeholder for now, this will be replaced with actual image URL later
        URL_Avatar: updatedData.URL_Avatar || '/placeholder-avatar.png'
      };
      
      // Save to the database
      const { success, error } = await saveUserProfile(safeUpdateData);
      
      if (success) {
        notificationState.showSuccess('Perfil guardado exitosamente');
        setIsNewUser(false); // User has now created/updated their profile
        
        // Refresh the profile data to ensure we have the latest
        const refreshedProfile = await getUserCompleteProfile(userId);
        if (refreshedProfile) {
          setUserProfile(prev => ({
            ...refreshedProfile,
            projects: prev.projects,
            skills: prev.skills,
            experience: prev.experience
          }));
        }
      } else {
        console.error("Error saving profile:", error);
        notificationState.showError(error || 'Error al guardar el perfil. Verifica la consola para más detalles.');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notificationState.showError('Error inesperado al guardar el perfil. Verifica la consola para más detalles.');
    } finally {
      setSaving(false);
    }
  };

  // Handler for skills changes from ExperienceSection
  const handleSkillsChanged = (skills: Array<{id: string, name: string, level: number}>) => {
    setGlobalSkills(skills);
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Global notification container */}
      <NotificationContainer 
        notifications={notificationState.notifications} 
        onClose={(id) => {
          const filtered = notificationState.notifications.filter(n => n.id !== id);
          notificationState.clearNotifications();
          filtered.forEach(n => {
            if (n.type === 'success') notificationState.showSuccess(n.message);
            if (n.type === 'error') notificationState.showError(n.message);
            if (n.type === 'info') notificationState.showInfo(n.message);
          });
        }} 
      />

      {/* Profile Header Section */}
      <ProfileHeader 
        userData={userProfile} 
        onProfileUpdate={handleProfileUpdate}
        isNewUser={isNewUser}
        isSaving={saving}
        loading={!fullyLoaded}
      />

      {/* Resume and Certificates section - replacing Cargabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Resume section */}
        <div className="md:col-span-1 flex">
          <ResumeUpload 
            userId={userProfile.ID_Usuario}
            notificationState={notificationState} 
            loading={!fullyLoaded}
            className="w-full" 
          />
        </div>

        {/* Certificates section */}
        <div className="md:col-span-1 flex">
          <CertificatesSection loading={!fullyLoaded} className="w-full" />
        </div>
      </div>

      <SkillsSection 
        loading={!fullyLoaded}
        externalSkills={globalSkills} initialSkills={[]}      />

      {/* Pass empty array as initialExperiences to let ExperienceSection load directly from database */}
      <ExperienceSection 
        initialExperiences={[]} 
        loading={!fullyLoaded}
        onSkillsChanged={handleSkillsChanged}
      />
    </div>
  );
}