/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { FiPlus, FiTrash2, FiX, FiCalendar, FiBriefcase, FiCheck } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri"; // Added a building icon
import { motion, AnimatePresence } from "framer-motion"; // Import framer-motion
import { SkeletonExperience } from "./SkeletonProfile";

interface Experience {
  company: string;
  position: string;
  period: string;
  description: string;
}

interface ExperienceWithDates {
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrentPosition?: boolean;
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
      isCurrentPosition: endDate === null
    };
  });

  const [experiences, setExperiences] = useState<ExperienceWithDates[]>(initialExperiencesWithDates);
  const [newExperience, setNewExperience] = useState<ExperienceWithDates>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrentPosition: false
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const handleAddExperience = () => {
    const finalExperience = {
      ...newExperience,
      endDate: newExperience.isCurrentPosition ? null : newExperience.endDate
    };

    setExperiences([...experiences, finalExperience]);
    setNewExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrentPosition: false
    });
    setIsAddingExperience(false);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  const handleCurrentPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewExperience({
      ...newExperience,
      isCurrentPosition: e.target.checked,
      endDate: e.target.checked ? null : newExperience.endDate
    });
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
        >
          <FiPlus size={16} className="text-white" />
          <span className="text-white font-medium">Añadir Experiencia</span>
        </button>
      </div>
      
      {/* Animation wrapper for the form */}
      <AnimatePresence>
        {isAddingExperience && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: "auto", marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-6 border border-[#A100FF20] rounded-lg bg-gradient-to-b from-[#A100FF08] to-transparent backdrop-blur-sm shadow-md">
              <h3 className="font-medium mb-5 text-lg text-gray-800 border-b pb-2 border-[#A100FF20]">Nueva experiencia laboral</h3>
              
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
                
                {/* Sticky button container to ensure they're always visible */}
                <div className="flex justify-end space-x-3 pt-4 sticky bottom-0">
                  <button 
                    className="px-4 py-2.5 bg-gradient-to-r from-red-600 to-red-700 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-sm font-medium flex items-center gap-2"
                    onClick={() => setIsAddingExperience(false)}
                    type="button"
                  >
                    <FiX size={16} className="text-white" />
                    <span className="text-white">Cancelar</span>
                  </button>
                  <button 
                    className="px-4 py-2.5 bg-gradient-to-r from-[#A100FF] to-[#8A00E3] rounded-lg hover:from-[#8A00E3] hover:to-[#7500C0] transition-all duration-300 shadow-sm font-medium flex items-center gap-2 disabled:opacity-50"
                    onClick={handleAddExperience}
                    disabled={!newExperience.company || !newExperience.position || !newExperience.startDate || (!newExperience.endDate && !newExperience.isCurrentPosition)}
                    type="button"
                  >
                    <FiCheck size={16} className="text-white" />
                    <span className="text-white">Agregar</span>
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
      
      {/* Improved experience timeline design with better date positioning */}
      <div className="mt-4">
        {experiences.map((exp, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4 last:mb-0"
          >
            <div className="group">
              {/* Experience card with reduced spacing */}
              <div className="flex flex-col md:flex-row items-start rounded-lg overflow-hidden bg-white transition-all duration-300 ease-in-out hover:shadow-md border border-gray-100 hover:border-[#A100FF20]">
                {/* Left color accent - changes color on hover */}
                <div className="w-full md:w-1 md:h-auto bg-gray-200 group-hover:bg-[#A100FF] transition-colors duration-300 md:self-stretch flex-shrink-0"></div>
                
                {/* Content section with restructured layout */}
                <div className="flex-grow p-4">
                  {/* Company and position header */}
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
                    
                    {/* Date badge - now styled as a subtle inline element under company */}
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
                  
                  {/* Description - separated from header info */}
                  <div className="pt-1 border-t border-gray-100">
                    <p className="text-gray-600 text-sm whitespace-pre-line mt-2">{exp.description}</p>
                  </div>
                </div>
                
                {/* Delete button */}
                <div className="self-start p-3">
                  <button 
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                    onClick={() => handleRemoveExperience(index)}
                    title="Eliminar experiencia"
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
