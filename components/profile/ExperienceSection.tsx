/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiBriefcase } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonExperience } from "./SkeletonProfile";
import { getUserExperiences, createUserExperience, updateUserExperience, deleteUserExperience } from "@/utils/database/client/experienceSync";
import { addSkillToExperience, updateSkillLevel } from "@/utils/database/client/skillsSync";
import { createClient } from '@/utils/supabase/client';
import ExperienceEditForm, { ExperienceFormData, ExperienceSkill } from "./experience/ExperienceEditForm";
import ExperienceList, { ExperienceItem } from "./experience/ExperienceList";

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface ExperienceSectionProps {
  initialExperiences: Experience[];
  loading?: boolean;
}

const extractDatesFromPeriod = (period: string): { startDate: string, endDate: string | null } => {
  const parts = period.split(' - ');
  const startDate = parts[0] || '';
  let endDate: string | null = parts[1] || null;

  if (endDate === 'Presente') {
    endDate = null;
  }

  return { startDate, endDate };
};

export default function ExperienceSection({ initialExperiences, loading = false }: ExperienceSectionProps) {
  const initialExperiencesWithDates: ExperienceItem[] = initialExperiences.map(exp => {
    const { startDate, endDate } = extractDatesFromPeriod(exp.period);
    return {
      company: exp.company,
      position: exp.position,
      startDate,
      endDate,
      description: exp.description,
      isCurrentPosition: endDate === null,
      skills: [] // Initialize empty skills array
    };
  });

  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiencesWithDates);
  const [newExperience, setNewExperience] = useState<ExperienceFormData>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentPosition: false,
    skills: [] // Initialize empty skills array
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [resetFormState, setResetFormState] = useState(false);

  const [formHeight, setFormHeight] = useState<number | "auto">("auto");
  const formRef = useRef<HTMLDivElement>(null);

  // Fetch user ID and experiences on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // If we have a user ID and no initial experiences, try to fetch from database
        if (user.id && initialExperiences.length === 0) {
          const fetchedExperiences = await getUserExperiences(user.id);
          if (fetchedExperiences && fetchedExperiences.length > 0) {
            const formattedExperiences = fetchedExperiences.map(exp => ({
              id: exp.id_experiencia,
              company: exp.compañia,
              position: exp.posicion,
              startDate: exp.fecha_inicio,
              endDate: exp.fecha_fin,
              description: exp.descripcion,
              isCurrentPosition: exp.fecha_fin === null,
              skills: exp.habilidades ? exp.habilidades.map((skill: any) => ({
                id: skill.id_habilidad,
                name: skill.titulo,
                level: skill.nivel_experiencia || 1
              })) : []
            }));
            setExperiences(formattedExperiences);
          }
        }
      }
    };
    
    fetchUserId();
  }, [initialExperiences]);

  // Effect to capture form height when it's displayed
  useEffect(() => {
    if (isAddingExperience && formRef.current) {
      // Set a timeout to ensure the form has rendered completely
      setTimeout(() => {
        if (formRef.current) {
          const height = formRef.current.offsetHeight;
          setFormHeight(height);
        }
      }, 50);
    }
  }, [isAddingExperience]);

  // Handle adding a new experience
  const handleAddExperience = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    
    try {
      const { success, id } = await createUserExperience(userId, newExperience);
      
      if (success && id) {
        // Add skills to experience
        if (newExperience.skills && newExperience.skills.length > 0) {
          for (const skill of newExperience.skills) {
            await addSkillToExperience(
              skill.name, 
              id, 
              userId, 
              skill.level
            );
          }
        }

        const finalExperience = {
          ...newExperience,
          id,
          endDate: newExperience.isCurrentPosition ? null : newExperience.endDate
        };
        
        setExperiences([...experiences, finalExperience]);
        resetForm();
      } else {
        console.error("Error saving experience");
      }
    } catch (error) {
      console.error("Exception saving experience:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle editing an experience
  const handleEditExperience = (experience: ExperienceItem) => {
    setNewExperience({
      ...experience,
      skills: experience.skills || []
    });
    setEditingExperienceId(experience.id || null);
    setIsEditingExperience(true);
    setIsAddingExperience(true);
  };

  // Handle updating an experience
  const handleUpdateExperience = async () => {
    if (!userId || !editingExperienceId) return;
    
    setIsSaving(true);
    
    try {
      const { success } = await updateUserExperience(editingExperienceId, userId, newExperience);
      
      if (success) {
        // Update the skills for the experience
        if (newExperience.skills) {
          // First, ensure all new skills are added with correct levels
          for (const skill of newExperience.skills) {
            if (skill.id) {
              // Update existing skill level
              await updateSkillLevel(
                skill.id,
                editingExperienceId,
                userId,
                skill.level
              );
            } else {
              // Add new skill
              await addSkillToExperience(
                skill.name,
                editingExperienceId,
                userId,
                skill.level
              );
            }
          }
        }

        const updatedExperiences = experiences.map(exp => 
          exp.id === editingExperienceId 
            ? { ...newExperience, id: editingExperienceId, endDate: newExperience.isCurrentPosition ? null : newExperience.endDate } 
            : exp
        );
        
        setExperiences(updatedExperiences);
        resetForm();
      } else {
        console.error("Error updating experience");
      }
    } catch (error) {
      console.error("Exception updating experience:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle removing an experience
  const handleRemoveExperience = async (index: number, id?: string) => {
    if (id && userId) {
      const { success } = await deleteUserExperience(id, userId);
      
      if (success) {
        const updatedExperiences = [...experiences];
        updatedExperiences.splice(index, 1);
        setExperiences(updatedExperiences);
      } else {
        console.error("Error deleting experience");
      }
    } else {
      const updatedExperiences = [...experiences];
      updatedExperiences.splice(index, 1);
      setExperiences(updatedExperiences);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    setIsAddingExperience(false);
    setResetFormState(true);
  };

  // Reset form after operation completes
  const resetForm = () => {
    setNewExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrentPosition: false,
      skills: []
    });
    setIsEditingExperience(false);
    setEditingExperienceId(null);
    setIsAddingExperience(false);
  };

  // Handle animation completion
  const handleAnimationComplete = () => {
    if (resetFormState) {
      resetForm();
      setResetFormState(false);
    }
  };

  if (loading) {
    return <SkeletonExperience />;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-all duration-300">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold flex items-center">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
            <FiBriefcase className="h-5 w-5 text-[#A100FF]" />
          </span>
          Experiencia
        </h2>
        <button 
          className="px-3 py-2 bg-gradient-to-r from-[#A100FF] to-[#8A00E3] rounded-md hover:from-[#8A00E3] hover:to-[#7500C0] transition-all duration-300 flex items-center gap-2 shadow-sm"
          onClick={() => setIsAddingExperience(true)}
          disabled={isAddingExperience}
        >
          <FiPlus size={16} className="text-white" />
          <span className="text-white font-medium">Añadir Experiencia</span>
        </button>
      </div>
      
      <AnimatePresence mode="wait" onExitComplete={handleAnimationComplete}>
        {isAddingExperience && (
          <motion.div
            key="experience-form" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: formHeight,
              marginBottom: 32
            }}
            exit={{ 
              opacity: 0, 
              height: 0,
              marginBottom: 0 
            }}
            transition={{ 
              type: "tween",
              duration: 0.4,
              ease: "easeInOut"
            }}
            className="overflow-hidden"
          >
            <div ref={formRef}>
              <ExperienceEditForm
                formData={newExperience}
                onFormChange={setNewExperience}
                onSave={isEditingExperience ? handleUpdateExperience : handleAddExperience}
                onCancel={handleCancelEdit}
                isEditing={isEditingExperience}
                isSaving={isSaving}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isAddingExperience && (
        <ExperienceList
          experiences={experiences}
          onEdit={handleEditExperience}
          onRemove={handleRemoveExperience}
          isAddingExperience={isAddingExperience}
        />
      )}
    </div>
  );
}
