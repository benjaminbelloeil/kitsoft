"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
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
    URL_Avatar: "",
    // Keep other dummy data for the rest of the components
    skills: [], // Will be populated from database
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
        
        // Update the empty profile with the correct user ID
        setUserProfile(prev => ({
          ...prev,
          ID_Usuario: user.id
        }));
        
        // Try to fetch complete profile
        const profileData = await getUserCompleteProfile(user.id);
        
        if (profileData) {
          // If profile exists, use it but keep the projects/skills
          setUserProfile(prev => ({
            ...profileData,
            // Ensure these properties exist
            projects: prev.projects || [],
            skills: prev.skills || [],
            experience: [] // Remove dummy experiences
          }));
          setIsNewUser(false);
        } else {
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
      // Simple update approach that keeps the user ID unchanged
      const userId = userProfile.ID_Usuario;
      
      // Create a safe update object with the fixed user ID
      const safeUpdateData = {
        ...updatedData,
        ID_Usuario: userId,
        // Keep null for now, this will be replaced with actual image URL later
        URL_Avatar: updatedData.URL_Avatar || null
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
    <AnimatePresence mode="wait">
      <motion.div 
        className="max-w-5xl mx-auto py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
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
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <ProfileHeader 
            userData={userProfile} 
            onProfileUpdate={handleProfileUpdate}
            isNewUser={isNewUser}
            isSaving={saving}
            loading={!fullyLoaded}
          />
        </motion.div>

        {/* Resume and Certificates section - replacing Cargabilidad */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          {/* Resume section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
          >
            <ResumeUpload 
              userId={userProfile.ID_Usuario}
              notificationState={notificationState} 
              loading={!fullyLoaded}
            />
          </motion.div>

          {/* Certificates section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
            whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
          >
            <CertificatesSection userID={userProfile.ID_Usuario} loading={!fullyLoaded} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
        >
          <SkillsSection 
            loading={!fullyLoaded}
            externalSkills={globalSkills} initialSkills={[]}      />
        </motion.div>

        {/* Pass empty array as initialExperiences to let ExperienceSection load directly from database */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
          whileHover={{ y: -2, boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)" }}
        >
          <ExperienceSection 
            initialExperiences={[]} 
            loading={!fullyLoaded}
            onSkillsChanged={handleSkillsChanged}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}