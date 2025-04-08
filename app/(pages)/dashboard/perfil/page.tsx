"use client";
import { useState } from "react";
import { userData } from "@/app/lib/data"; // Import userData from data.ts
import { UserProfile, UserProfileUpdate } from '@/interfaces/user';
import { Project } from '@/interfaces/project';
import { Experience } from '@/interfaces/experience';
import { Skill } from '@/interfaces/skill';
import { Direccion } from '@/interfaces/address';
import { Telefono, Correo } from '@/interfaces/contact';

// Import profile components
import ProfileHeader from "@/components/profile/ProfileHeader";
import CargabilidadSection from "@/components/profile/CargabilidadSection";
import ResumeUpload from "@/components/profile/ResumeUpload";
import CertificatesSection from "@/components/profile/CertificatesSection";
import SkillsSection from "@/components/profile/SkillsSection";
import ExperienceSection from "@/components/profile/ExperienceSection";

// Transform string skills to Skill objects if needed
const transformSkills = (skillStrings: string[]): Skill[] => {
  return skillStrings.map(skill => ({
    Nombre: skill,
    Nivel: 3, // Default level
    Categoria: 'General' // Default category
  }));
};

// Transform experience data to match the interface
interface RawExperience {
  company: string;
  position: string;
  description: string;
  period: string;
}

const transformExperience = (exp: RawExperience[]): Experience[] => {
  return exp.map(item => ({
    Empresa: item.company,
    Titulo: item.position,
    Descripcion: item.description,
    Fecha_Inicio: item.period.split(' - ')[0],
    Fecha_Fin: item.period.split(' - ')[1] || null
  }));
};

// Transform experience data to match the component's interface
const transformExperienceForComponent = (exp: Experience) => ({
  company: exp.Empresa,
  position: exp.Titulo,
  period: `${exp.Fecha_Inicio}${exp.Fecha_Fin ? ` - ${exp.Fecha_Fin}` : ' - Presente'}`,
  description: exp.Descripcion
});

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
    ID_Correo: "email-id",
    ID_Usuario: "some-uuid",
    Correo: userData.email,
    Tipo: "Principal"
  },
  projects: userData.projects as Project[],
  skills: Array.isArray(userData.skills) ? transformSkills(userData.skills) : [],
  experience: transformExperience(userData.experience),
  certificates: [] // Initialize empty certificates array
};

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile>(adaptedUserData);

  const handleProfileUpdate = (updatedData: UserProfileUpdate) => {
    setUserProfile(prev => {
      // Create a new profile with the base updates
      const newProfile: UserProfile = {
        ...prev,
        ...updatedData,
        direccion: updatedData.direccion ? {
          ...(prev.direccion || {} as Direccion),
          ...updatedData.direccion
        } : prev.direccion,
        telefono: updatedData.telefono ? {
          ...(prev.telefono || {} as Telefono),
          ...updatedData.telefono
        } : prev.telefono,
        correo: updatedData.correo ? {
          ...(prev.correo || {} as Correo),
          ...updatedData.correo
        } : prev.correo
      };
      
      return newProfile;
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
          <CargabilidadSection projects={userProfile.projects || []} />
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
      <SkillsSection initialSkills={userProfile.skills ? userProfile.skills.map(skill => skill.Nombre) : []} />

      {/* Experience section */}
      <ExperienceSection 
        initialExperiences={(userProfile.experience || []).map(transformExperienceForComponent)} 
      />
    </div>
  );
}