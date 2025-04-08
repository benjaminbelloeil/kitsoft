"use client";
import { useState, useEffect } from "react";
import { userData } from "@/app/lib/data"; // Keep this import for other sections
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { Project } from '@/interfaces/project';
import { Experience } from '@/interfaces/experience';
import { createClient } from '@/utils/supabase/client';
import { saveUserProfile, getUserCompleteProfile } from '@/utils/database/client/profileSync';

// Import profile components
import ProfileHeader from "@/components/profile/ProfileHeader";
import CargabilidadSection from "@/components/profile/CargabilidadSection";
import ResumeUpload from "@/components/profile/ResumeUpload";
import CertificatesSection from "@/components/profile/CertificatesSection";
import SkillsSection from "@/components/profile/SkillsSection";
import ExperienceSection from "@/components/profile/ExperienceSection";

// Transform experience data to match the component's interface
const transformExperienceForComponent = (exp: Experience) => ({
  company: exp.Empresa,
  position: exp.Titulo,
  period: `${exp.Fecha_Inicio}${exp.Fecha_Fin ? ` - ${exp.Fecha_Fin}` : ' - Presente'}`,
  description: exp.Descripcion
});

export default function ProfilePage() {
  // Create an empty profile with placeholder header data
  const emptyProfile: UserProfile = {
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
    experience: userData.experience ? userData.experience.map(exp => ({
      Empresa: exp.company,
      Titulo: exp.position,
      Descripcion: exp.description,
      Fecha_Inicio: exp.period.split(' - ')[0],
      Fecha_Fin: exp.period.includes('Presente') ? null : exp.period.split(' - ')[1]
    })) : []
  };

  const [userProfile, setUserProfile] = useState<UserProfile>(emptyProfile);
  const [isNewUser, setIsNewUser] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          setLoading(false);
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
          // If profile exists, use it but keep the projects/skills/experience
          setUserProfile(prev => {
            console.log("Updating user profile with:", profileData);
            return {
              ...profileData,
              // Ensure these properties exist
              projects: prev.projects || [],
              skills: prev.skills || [],
              experience: prev.experience || []
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
        setLoading(false);
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
        alert('Perfil guardado exitosamente');
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
        alert(error || 'Error al guardar el perfil. Verifica la consola para más detalles.');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert('Error inesperado al guardar el perfil. Verifica la consola para más detalles.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-pulse text-gray-500">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Profile Header Section */}
      <ProfileHeader 
        userData={userProfile} 
        onProfileUpdate={handleProfileUpdate}
        isNewUser={isNewUser}
        isSaving={saving}
      />

      {/* Rest of the page content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Cargabilidad section */}
        <div className="md:col-span-2">
          <CargabilidadSection projects={userProfile.projects || []} />
        </div>

        <div className="md:col-span-1 flex flex-col h-full">
          <ResumeUpload />
          <CertificatesSection />
        </div>
      </div>

      <SkillsSection initialSkills={userProfile.skills ? userProfile.skills.map(skill => skill.Nombre) : []} />

      <ExperienceSection 
        initialExperiences={(userProfile.experience || []).map(transformExperienceForComponent)} 
      />
    </div>
  );
}