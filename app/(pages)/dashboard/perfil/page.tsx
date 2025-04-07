"use client";
import { useState } from "react";
import { userData } from "@/app/lib/data"; // Import userData from data.ts
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { Project } from '@/interfaces/project';
import { Experience } from '@/interfaces/experience';

// Import profile components
import ProfileHeader from "@/components/profile/ProfileHeader";
import CargabilidadSection from "@/components/profile/CargabilidadSection";
import ResumeUpload from "@/components/profile/ResumeUpload";
import CertificatesSection from "@/components/profile/CertificatesSection";
import SkillsSection from "@/components/profile/SkillsSection";
import ExperienceSection from "@/components/profile/ExperienceSection";

// Adapt the imported userData to match the new schema
// This would be replaced by actual database fetching in production
const adaptedUserData: UserProfile = {
  ID_Usuario: "some-uuid",
  Nombre: userData.name.split(' ')[0] || "",
  Apellido: userData.name.split(' ').slice(1).join(' ') || "",
  Titulo: userData.title,
  Bio: userData.bio,
  URL_Avatar: userData.avatar,
  direccion: {
    CP: "12345",
    Pais: userData.location.split(', ')[2] || "México",
    Estado: userData.location.split(', ')[1] || "CDMX",
    Ciudad: userData.location.split(', ')[0] || "Ciudad de México",
    Tipo: "Principal"
  },
  telefono: {
    Codigo_Pais: "+52",
    Codigo_Estado: "55",
    Numero: userData.phone.replace(/\D/g, '') || "12345678",
    Tipo: "Principal"
  },
  correo: {
    Correo: userData.email,
    Tipo: "Principal"
  },
  projects: userData.projects as Project[],
  skills: userData.skills,
  experience: userData.experience as Experience[]
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(adaptedUserData);

  const handleProfileUpdate = (updatedData: UserProfileUpdate) => {
    setUserProfile({
      ...userProfile,
      ...updatedData
    });
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Profile Header Section */}
      <ProfileHeader 
        userData={userProfile} 
        onProfileUpdate={handleProfileUpdate}
      />

      {/* Add margin-bottom to the grid container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Cargabilidad section */}
        <div className="md:col-span-2">
          <CargabilidadSection projects={userProfile.projects} />
        </div>

        {/* Resume and Certificate column */}
        <div className="md:col-span-1 flex flex-col h-full">
          {/* Resume upload section */}
          <ResumeUpload />
          
          {/* Certificate section */}
          <CertificatesSection />
        </div>
      </div>

      {/* Skills section */}
      <SkillsSection initialSkills={userProfile.skills} />

      {/* Experience section */}
      <ExperienceSection initialExperiences={userProfile.experience} />
    </div>
  );
}