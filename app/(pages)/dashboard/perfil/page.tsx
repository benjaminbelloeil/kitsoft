/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { userData } from "@/app/lib/data"; // Import userData from data.ts

// Import profile components
import ProfileHeader from "@/components/profile/ProfileHeader";
import CargabilidadSection from "@/components/profile/CargabilidadSection";
import ResumeUpload from "@/components/profile/ResumeUpload";
import CertificatesSection from "@/components/profile/CertificatesSection";
import SkillsSection from "@/components/profile/SkillsSection";
import ExperienceSection from "@/components/profile/ExperienceSection";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(userData);

  const handleProfileUpdate = (updatedData: any) => {
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