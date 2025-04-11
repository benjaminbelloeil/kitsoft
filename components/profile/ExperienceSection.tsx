/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiTrash2, FiX, FiCalendar, FiBriefcase, FiCheck, FiEdit2 } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri"; // Added a building icon
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import { SkeletonExperience } from "./SkeletonProfile";
import { getUserExperiences, createUserExperience, updateUserExperience, deleteUserExperience } from "@/utils/database/client/experienceSync";
import { addSkillToExperience, updateSkillLevel, removeSkillFromExperience } from "@/utils/database/client/skillsSync";
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
  onSkillsChanged?: (skills: Array<{ id: string, name: string, level: number }>) => void;
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

// Create a cache object outside the component to store fetched experiences
const experiencesCache: Record<string, any> = {};

export default function ExperienceSection({ initialExperiences, loading = false, onSkillsChanged }: ExperienceSectionProps) {
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

  const formRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | "auto">("auto");

  // Fetch user ID and experiences on component mount only
  useEffect(() => {
    const fetchUserId = async () => {
      if (isFetchingExperiences || hasFetchedExperiences.current) return;
      
      setIsFetchingExperiences(true);
      
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setUserId(user.id);
          
          // If we have a user ID, check cache first before fetching from DB
          if (user.id) {
            if (experiencesCache[user.id]) {
              // Use cached experiences if available
              const cachedExperiences = experiencesCache[user.id];
              setExperiences(cachedExperiences);
              updateGlobalSkills(cachedExperiences);
              hasFetchedExperiences.current = true;
              return;
            }
            
            const fetchedExperiences = await getUserExperiences(user.id);
            if (fetchedExperiences && fetchedExperiences.length > 0) {
              
              const formattedExperiences = fetchedExperiences.map(exp => {
                // Map the skills correctly from the DB format
                const mappedSkills = Array.isArray(exp.habilidades) 
                  ? exp.habilidades.map((skill: any) => ({
                      id: skill.id_habilidad,
                      name: skill.titulo || '',
                      level: skill.nivel_experiencia || 1
                    })) 
                  : [];
                
                return {
                  id: exp.id_experiencia,
                  company: exp.compañia,
                  position: exp.posicion,
                  startDate: exp.fecha_inicio,
                  endDate: exp.fecha_fin,
                  description: exp.descripcion,
                  isCurrentPosition: exp.fecha_fin === null,
                  skills: mappedSkills
                };
              });
              
              // Store in cache for future reference
              experiencesCache[user.id] = formattedExperiences;
              
              setExperiences(formattedExperiences);
              updateGlobalSkills(formattedExperiences);
            }
            
            hasFetchedExperiences.current = true;
          }
        }
      } catch (error) {
        console.error("Error fetching user experiences:", error);
      } finally {
        setIsFetchingExperiences(false);
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

  const handleAddExperience = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    
    try {
      const { success, id } = await createUserExperience(userId, newExperience);
      
      if (success && id) {
        // Add skills to experience
        if (newExperience.skills && newExperience.skills.length > 0) {
          for (const skill of newExperience.skills) {
            const response = await addSkillToExperience(
              skill.name, 
              id, 
              userId, 
              skill.level
            );
            
            if (response.success && response.skillId) {
              // Update the skill ID for future reference
              skill.id = response.skillId;
            }
          }
        }

        const finalExperience = {
          ...newExperience,
          id,
          endDate: newExperience.isCurrentPosition ? null : newExperience.endDate
        };
        
        const updatedExperiences = [...experiences, finalExperience];
        // Update cache
        if (userId) {
          experiencesCache[userId] = updatedExperiences;
        }
        
        setExperiences(updatedExperiences);
        updateGlobalSkills(updatedExperiences);
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
        // Get the existing experience to compare skills
        const existingExperience = experiences.find(exp => exp.id === editingExperienceId);
        const existingSkills = existingExperience?.skills || [];
        
        // Find skills that need to be removed (present in existing but not in new)
        const skillsToRemove = existingSkills.filter(existingSkill => 
          !newExperience.skills?.some(newSkill => 
            newSkill.id === existingSkill.id
          )
        );
        
        // Remove skills that are no longer associated with this experience
        for (const skill of skillsToRemove) {
          if (skill.id) {
            await removeSkillFromExperience(skill.id, editingExperienceId, userId);
          }
        }
        
        // Update or add skills for the experience
        if (newExperience.skills) {
          for (const skill of newExperience.skills) {
            // Check if this skill is already linked to the experience
            const isLinkedToExperience = existingSkills.some(existingSkill => existingSkill.id === skill.id);
            if (skill.id && isLinkedToExperience) {
              // Update existing skill level
              await updateSkillLevel(
                skill.id,
                editingExperienceId,
                userId,
                skill.level
              );
            } else {
              // Add new skill to experience (even if it exists in habilidades)
              const response = await addSkillToExperience(
                skill.name,
                editingExperienceId,
                userId,
                skill.level
              );
              if (response.success && response.skillId) {
                skill.id = response.skillId;
              }
            }
          }
        }

        const updatedExperiences = experiences.map(exp => 
          exp.id === editingExperienceId 
            ? { ...newExperience, id: editingExperienceId, endDate: newExperience.isCurrentPosition ? null : newExperience.endDate } 
            : exp
        );
        
        // Update cache
        if (userId) {
          experiencesCache[userId] = updatedExperiences;
        }
        
        setExperiences(updatedExperiences);
        updateGlobalSkills(updatedExperiences);
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
    if (!userId || !id) return;
    
    try {
      // Get the experience to find its skills
      const experienceToRemove = experiences.find(exp => exp.id === id);
      if (experienceToRemove?.skills) {
        // Remove all skills associated with this experience
        for (const skill of experienceToRemove.skills) {
          if (skill.id) {
            await removeSkillFromExperience(skill.id, id, userId);
          }
        }
      }
      
      const { success } = await deleteUserExperience(id, userId);
      
      if (success) {
        const updatedExperiences = [...experiences];
        updatedExperiences.splice(index, 1);
        
        // Update cache
        if (userId) {
          experiencesCache[userId] = updatedExperiences;
        }
        
        setExperiences(updatedExperiences);
        updateGlobalSkills(updatedExperiences);
      } else {
        console.error("Error deleting experience");
      }
    } catch (error) {
      console.error("Error removing experience:", error);
    }
  };

  // Handle canceling edit
  const handleCancelEdit = () => {
    // Just set flag to start exit animation
    setIsAddingExperience(false);
    setResetFormState(true);
  };

  const handleAnimationComplete = () => {
    if (resetFormState) {
      setNewExperience({
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrentPosition: false
      });
      setIsEditingExperience(false);
      setEditingExperienceId(null);
      setResetFormState(false);
    }
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
              type: "tween", // Using tween instead of spring for more predictable animation
              duration: 0.4,
              ease: "easeInOut"
            }}
            className="overflow-hidden"
          >
            <div 
              ref={formRef}
              className="p-6 border border-[#A100FF20] rounded-lg bg-gradient-to-b from-[#A100FF08] to-transparent backdrop-blur-sm shadow-md"
            >
              <h3 className="font-medium mb-5 text-lg text-gray-800 border-b pb-2 border-[#A100FF20]">
                {isEditingExperience ? 'Editar experiencia laboral' : 'Nueva experiencia laboral'}
              </h3>
              
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="transition-all duration-300 focus-within:scale-[1.01]">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Empresa</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        <RiBuilding4Line size={16} />
                      </span>
                      <input
                        type="text"
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300"
                        value={newExperience.company}
                        onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                        placeholder="Nombre de la empresa"
                      />
                    </div>
                  </div>
                  
                  <div className="transition-all duration-300 focus-within:scale-[1.01]">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Posición</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        <FiBriefcase size={16} />
                      </span>
                      <input
                        type="text"
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300"
                        value={newExperience.position}
                        onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                        placeholder="Título del cargo"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="transition-all duration-300 focus-within:scale-[1.01]">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de inicio</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        <FiCalendar size={16} />
                      </span>
                      <input
                        type="date"
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300 cursor-pointer"
                        value={newExperience.startDate}
                        onChange={(e) => setNewExperience({...newExperience, startDate: e.target.value})}
                        style={{colorScheme: 'light'}}
                      />
                    </div>
                  </div>
                  
                  <div className={`transition-all duration-300 focus-within:scale-[1.01] ${newExperience.isCurrentPosition ? 'opacity-50' : ''}`}>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de fin</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-gray-500">
                        <FiCalendar size={16} />
                      </span>
                      <input
                        type="date"
                        className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300 cursor-pointer"
                        value={newExperience.endDate || ''}
                        onChange={(e) => setNewExperience({...newExperience, endDate: e.target.value})}
                        disabled={newExperience.isCurrentPosition}
                        style={{colorScheme: 'light'}}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center my-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-[#A100FF40] transition-all duration-300">
                  <label className="flex items-center w-full cursor-pointer" onClick={(e) => {
                    e.preventDefault();
                    handleCurrentPositionChange({
                      target: { checked: !newExperience.isCurrentPosition }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }}>
                    <div className="relative">
                      <input
                        id="current-position"
                        type="checkbox"
                        checked={newExperience.isCurrentPosition}
                        onChange={handleCurrentPositionChange}
                        className="sr-only"
                      />
                      <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${newExperience.isCurrentPosition ? 'bg-[#A100FF]' : 'bg-gray-300'}`}>
                        <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-md ${newExperience.isCurrentPosition ? 'translate-x-5' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700 select-none">
                      Trabajo actualmente aquí
                    </span>
                  </label>
                </div>
                
                <div className="transition-all duration-300 focus-within:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300"
                    rows={3} // Fixed height to prevent layout issues
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                    placeholder="Describe tus responsabilidades y logros en este cargo"
                    style={{ resize: "none" }} // Prevent user resizing
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4 sticky bottom-0">
                  <button 
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-sm font-medium flex items-center gap-2"
                    onClick={handleCancelEdit}
                    type="button"
                    disabled={isSaving}
                  >
                    <FiX size={16} className="text-white" />
                    <span className="text-white">Cancelar</span>
                  </button>
                  <button 
                    className="px-4 py-2.5 bg-gradient-to-r from-[#A100FF] to-[#8A00E3] rounded-lg hover:from-[#8A00E3] hover:to-[#7500C0] transition-all duration-300 shadow-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    onClick={isEditingExperience ? handleUpdateExperience : handleAddExperience}
                    disabled={isSaving || !newExperience.company || !newExperience.position || !newExperience.startDate || (!newExperience.endDate && !newExperience.isCurrentPosition)}
                    type="button"
                  >
                    <FiCheck size={16} className="text-white" />
                    <span className="text-white">
                      {isEditingExperience ? 'Guardar cambios' : 'Agregar'}
                      {isSaving && '...'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {experiences.length === 0 && !isAddingExperience && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-10 text-gray-500"
        >
          <FiBriefcase size={40} className="text-gray-300 mx-auto mb-3" />
          <p>No has añadido ninguna experiencia laboral.</p>
          <p className="text-sm">Haz clic en &ldquo;Añadir Experiencia&rdquo; para empezar.</p>
        </motion.div>
      )}
      
      <div className="mt-4">
        {experiences.map((exp, index) => (
          <motion.div 
            key={exp.id || index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4 last:mb-0"
          >
            <div className="group">
              <div className="flex flex-col md:flex-row items-start rounded-lg overflow-hidden bg-white transition-all duration-300 ease-in-out hover:shadow-md border border-gray-100 hover:border-[#A100FF20]">
                <div className="w-full md:w-1 md:h-auto bg-gray-200 group-hover:bg-[#A100FF] transition-colors duration-300 md:self-stretch flex-shrink-0"></div>
                
                <div className="flex-grow p-4">
                  <div className="flex flex-col mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 group-hover:text-[#A100FF] transition-colors duration-300">
                      {exp.position}
                    </h3>
                    
                    <div className="flex items-center">
                      <p className="text-[#A100FF] font-medium flex items-center gap-1">
                        <RiBuilding4Line size={14} className="text-gray-500" />
                        {exp.company}
                      </p>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1.5">
                      <FiCalendar size={12} className="text-gray-400" />
                      <span className="inline-block">
                        {formatDateDisplay(exp.startDate)}
                        {exp.endDate ? 
                          <span> — {formatDateDisplay(exp.endDate)}</span> : 
                          <span className="text-[#A100FF80]"> — Presente</span>
                        }
                      </span>
                    </div>
                  </div>
                  
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-gray-600 text-sm whitespace-pre-line mt-2">{exp.description}</p>
                  </div>
                </div>
                
                <div className="self-start p-3 flex flex-col gap-2">
                  <button 
                    className="p-1.5 text-gray-400 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-full transition-all duration-300"
                    onClick={() => handleEditExperience(exp)}
                    title="Editar experiencia"
                    disabled={isAddingExperience}
                  >
                    <FiEdit2 size={15} />
                  </button>
                  <button 
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                    onClick={() => handleRemoveExperience(index, exp.id)}
                    title="Eliminar experiencia"
                    disabled={isAddingExperience}
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
