/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { FiPlus, FiTrash2, FiX, FiCalendar, FiBriefcase, FiCheck, FiEdit2, FiSearch } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";
import { AiFillTag } from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonExperience } from "./SkeletonProfile";
import { getUserExperiences, createUserExperience, updateUserExperience, deleteUserExperience } from "@/utils/database/client/experienceSync";
import { searchSkills, addSkillToExperience, removeSkillFromExperience, updateSkillLevel } from "@/utils/database/client/skillsSync";
import { createClient } from '@/utils/supabase/client';
import { EventEmitter } from '@/utils/eventEmitter';

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface ExperienceSkill {
  id?: string;
  name: string;
  level: number; // 1 = Beginner, 2 = Intermediate, 3 = Professional
}

interface ExperienceWithDates {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrentPosition?: boolean;
  skills?: ExperienceSkill[]; // Update to include the level
}

interface ExperienceSectionProps {
  initialExperiences: Experience[];
  loading?: boolean;
}

// Map level number to label
const skillLevelLabels: Record<number, string> = {
  1: 'Principiante',
  2: 'Intermedio', 
  3: 'Profesional'
};

// Map level number to CSS class
const skillLevelClasses: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 border-blue-200',
  2: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
  3: 'bg-green-100 text-green-700 border-green-200'
};

const extractDatesFromPeriod = (period: string): { startDate: string, endDate: string | null } => {
  const parts = period.split(' - ');
  const startDate = parts[0] || '';
  let endDate: string | null = parts[1] || null;

  if (endDate === 'Presente') {
    endDate = null;
  }

  return { startDate, endDate };
};

const formatDateRange = (startDate: string, endDate: string | null): string => {
  return `${startDate}${endDate ? ` - ${endDate}` : ' - Presente'}`;
};

// Format date for display (e.g. "January 2023")
const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
  } catch (error) {
    return dateString; // Fallback to original string if parsing fails
  }
};

export default function ExperienceSection({ initialExperiences, loading = false }: ExperienceSectionProps) {
  const initialExperiencesWithDates: ExperienceWithDates[] = initialExperiences.map(exp => {
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

  const [experiences, setExperiences] = useState<ExperienceWithDates[]>(initialExperiencesWithDates);
  const [newExperience, setNewExperience] = useState<ExperienceWithDates>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentPosition: false,
    skills: [] // Initialize empty skills array
  });
  const [skillInput, setSkillInput] = useState("");
  const [skillSearchResults, setSkillSearchResults] = useState<Array<{id: string, titulo: string}>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<{id?: string, name: string, level: number} | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [resetFormState, setResetFormState] = useState(false);
  const [showSkillLevelSelect, setShowSkillLevelSelect] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [formHeight, setFormHeight] = useState<number | "auto">("auto");

  // Fetch user ID on component mount
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

  // Effect to handle skill search
  useEffect(() => {
    const handleSkillSearch = async () => {
      if (skillInput.trim().length < 2) {
        setSkillSearchResults([]);
        return;
      }

      setIsSearching(true);
      const results = await searchSkills(skillInput);
      setSkillSearchResults(results);
      setIsSearching(false);
    };

    // Debounce the search to avoid excessive API calls
    const debounceTimeout = setTimeout(handleSkillSearch, 300);

    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [skillInput]);

  // Effect to handle clicks outside of search results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSkillSearchResults([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
        setNewExperience({
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          isCurrentPosition: false,
          skills: []
        });
        setSkillInput("");
        setIsAddingExperience(false);
        
        // Use event emitter to notify other components about new skills
        if (newExperience.skills && newExperience.skills.length > 0) {
          EventEmitter.emit('skillsUpdated', newExperience.skills.map(skill => skill.name));
        }
      } else {
        console.error("Error saving experience");
      }
    } catch (error) {
      console.error("Exception saving experience:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditExperience = (experience: ExperienceWithDates) => {
    setNewExperience({
      ...experience,
      skills: experience.skills || []
    });
    setEditingExperienceId(experience.id || null);
    setIsEditingExperience(true);
    setIsAddingExperience(true);
  };

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
        setNewExperience({
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
          isCurrentPosition: false,
          skills: []
        });
        setSkillInput("");
        setIsEditingExperience(false);
        setEditingExperienceId(null);
        setIsAddingExperience(false);
        
        // Use event emitter to notify other components about updated skills
        const allSkills = updatedExperiences.reduce((acc: string[], exp) => {
          if (exp.skills && exp.skills.length > 0) {
            return [...acc, ...exp.skills.map(skill => skill.name)];
          }
          return acc;
        }, []);
        
        if (allSkills.length > 0) {
          EventEmitter.emit('skillsUpdated', allSkills);
        }
      } else {
        console.error("Error updating experience");
      }
    } catch (error) {
      console.error("Exception updating experience:", error);
    } finally {
      setIsSaving(false);
    }
  };

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

  const handleCancelEdit = () => {
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
        isCurrentPosition: false,
        skills: []
      });
      setSkillInput("");
      setIsEditingExperience(false);
      setEditingExperienceId(null);
      setResetFormState(false);
    }
  };

  const handleCurrentPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExperience({
      ...newExperience,
      isCurrentPosition: e.target.checked,
      endDate: e.target.checked ? null : newExperience.endDate
    });
  };

  const handleAddSkill = (skillId?: string, skillTitle?: string) => {
    if (selectedSkill) {
      const newSkill = {
        id: skillId || selectedSkill.id,
        name: skillTitle || selectedSkill.name,
        level: selectedSkill.level
      };
      
      if (!newExperience.skills?.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
        setNewExperience({
          ...newExperience,
          skills: [...(newExperience.skills || []), newSkill]
        });
      }
      
      setSelectedSkill(null);
      setShowSkillLevelSelect(false);
      setSkillInput("");
      setSkillSearchResults([]);
    } else if (skillTitle) {
      setSelectedSkill({
        id: skillId,
        name: skillTitle,
        level: 1
      });
      setShowSkillLevelSelect(true);
      setSkillInput("");
    } else if (skillInput.trim()) {
      setSelectedSkill({
        name: skillInput.trim(),
        level: 1
      });
      setShowSkillLevelSelect(true);
    }
  };

  const handleSkillLevelSelect = (level: number) => {
    if (selectedSkill) {
      const newSkill = {
        id: selectedSkill.id,
        name: selectedSkill.name,
        level
      };
      
      if (!newExperience.skills?.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
        setNewExperience({
          ...newExperience,
          skills: [...(newExperience.skills || []), newSkill]
        });
      }
      
      setSelectedSkill(null);
      setShowSkillLevelSelect(false);
      setSkillInput("");
    }
  };

  const handleUpdateSkillLevel = (skillIndex: number, level: number) => {
    if (newExperience.skills) {
      const updatedSkills = [...newExperience.skills];
      updatedSkills[skillIndex] = {
        ...updatedSkills[skillIndex],
        level
      };
      
      setNewExperience({
        ...newExperience,
        skills: updatedSkills
      });
    }
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (newExperience.skills) {
      const updatedSkills = [...newExperience.skills];
      updatedSkills.splice(skillIndex, 1);
      
      setNewExperience({
        ...newExperience,
        skills: updatedSkills
      });
    }
  };

  const handleSkillInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (skillSearchResults.length > 0) {
        const firstResult = skillSearchResults[0];
        handleAddSkill(firstResult.id, firstResult.titulo);
      } else if (skillInput.trim()) {
        handleAddSkill(undefined, skillInput.trim());
      }
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
                    rows={3}
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                    placeholder="Describe tus responsabilidades y logros en este cargo"
                    style={{ resize: "none" }}
                  />
                </div>
                
                <div className="transition-all duration-300 focus-within:scale-[1.01]">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Habilidades adquiridas
                  </label>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
                    {showSkillLevelSelect && selectedSkill && (
                      <div className="mb-4 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Selecciona tu nivel de experiencia para <span className="text-[#A100FF]">{selectedSkill.name}</span>:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleSkillLevelSelect(1)}
                            className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md text-sm border border-blue-200 hover:bg-blue-200 transition-colors"
                          >
                            Principiante
                          </button>
                          <button
                            onClick={() => handleSkillLevelSelect(2)}
                            className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-md text-sm border border-yellow-200 hover:bg-yellow-200 transition-colors"
                          >
                            Intermedio
                          </button>
                          <button
                            onClick={() => handleSkillLevelSelect(3)}
                            className="px-3 py-1.5 bg-green-100 text-green-700 rounded-md text-sm border border-green-200 hover:bg-green-200 transition-colors"
                          >
                            Profesional
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedSkill(null);
                              setShowSkillLevelSelect(false);
                            }}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md text-sm border border-gray-200 hover:bg-gray-200 transition-colors ml-auto"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {!showSkillLevelSelect && (
                      <div className="relative" ref={searchRef}>
                        <div className="flex items-center mb-3">
                          <div className="relative flex-grow">
                            <span className="absolute left-3 top-2.5 text-gray-500">
                              <FiSearch size={16} />
                            </span>
                            <input
                              type="text"
                              className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white shadow-sm transition-all duration-300"
                              value={skillInput}
                              onChange={(e) => setSkillInput(e.target.value)}
                              placeholder="Buscar o añadir una habilidad (ej. React, Python)"
                              onKeyDown={handleSkillInputKeyDown}
                            />
                          </div>
                          <button 
                            className="ml-2 h-[38px] px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 transition-all duration-300 font-medium flex items-center gap-1 shadow-sm disabled:opacity-50 text-sm"
                            onClick={() => handleAddSkill()}
                            disabled={!skillInput.trim()}
                            type="button"
                          >
                            <FiPlus size={14} /> Añadir
                          </button>
                        </div>

                        {skillSearchResults.length > 0 && (
                          <div className="absolute z-10 w-full bg-white mt-1 border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                            {skillSearchResults.map((skill) => (
                              <div
                                key={skill.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                onClick={() => handleAddSkill(skill.id, skill.titulo)}
                              >
                                {skill.titulo}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {newExperience.skills && newExperience.skills.length > 0 ? (
                        newExperience.skills.map((skill, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-md shadow-sm border transition-all duration-300 ${skillLevelClasses[skill.level]}`}
                          >
                            <span className="text-sm font-medium">{skill.name}</span>
                            <div className="relative ml-1 group">
                              <span className="text-xs px-1 rounded bg-white bg-opacity-50">
                                {skillLevelLabels[skill.level]}
                              </span>
                              
                              <div className="absolute hidden group-hover:flex flex-col bg-white border border-gray-200 rounded-md shadow-lg p-1 z-10 right-0 top-full mt-1 w-32">
                                <button 
                                  className="text-xs px-2 py-1 hover:bg-blue-100 text-blue-700 rounded text-left"
                                  onClick={() => handleUpdateSkillLevel(index, 1)}
                                >
                                  Principiante
                                </button>
                                <button 
                                  className="text-xs px-2 py-1 hover:bg-yellow-100 text-yellow-700 rounded text-left"
                                  onClick={() => handleUpdateSkillLevel(index, 2)}
                                >
                                  Intermedio
                                </button>
                                <button 
                                  className="text-xs px-2 py-1 hover:bg-green-100 text-green-700 rounded text-left"
                                  onClick={() => handleUpdateSkillLevel(index, 3)}
                                >
                                  Profesional
                                </button>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveSkill(index)}
                              className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                              title="Eliminar habilidad"
                            >
                              <FiX size={16} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm italic px-2 py-2">
                          Añade las competencias adquiridas en esta posición.
                        </p>
                      )}
                    </div>
                  </div>
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
                  
                  {exp.skills && exp.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {exp.skills.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className={`px-2 py-0.5 rounded text-xs border ${skillLevelClasses[skill.level]}`}
                        >
                          {skill.name}
                          <span className="ml-1 text-xs opacity-80">
                            • {skillLevelLabels[skill.level]}
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
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
