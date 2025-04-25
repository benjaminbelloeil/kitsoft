/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import { FiTrash2, FiCalendar, FiEdit2, FiAward, FiStar, FiTrendingUp, FiChevronDown } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";
import { motion } from "framer-motion";
import { ExperienceSkill, skillLevelClasses, skillLevelLabels } from "./ExperienceEditForm";

interface ExperienceItem {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrentPosition?: boolean;
  skills?: ExperienceSkill[];
}

interface ExperienceListProps {
  experiences: ExperienceItem[];
  onEdit: (experience: ExperienceItem) => void;
  onRemove: (index: number, id?: string) => void;
  isAddingExperience: boolean;
}

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

// Get icon for skill level
const getSkillLevelIcon = (level: number) => {
  switch (level) {
    case 1: return <FiStar size={12} className="mr-1" />;
    case 2: return <FiTrendingUp size={12} className="mr-1" />;
    case 3: return <FiAward size={12} className="mr-1" />;
    default: return <FiStar size={12} className="mr-1" />;
  }
};

const ExperienceList = ({ 
  experiences, 
  onEdit, 
  onRemove, 
  isAddingExperience 
}: ExperienceListProps) => {
  if (experiences.length === 0) {
    return <EmptyState />;
  }

  return (
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
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                    {exp.position}
                  </h3>
                  
                  <div className="flex items-center">
                    <p className="company-name text-gray-700 font-medium flex items-center gap-1">
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
                
                {/* Enhanced skills display */}
                {exp.skills && exp.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {exp.skills.map((skill, skillIndex) => (
                      <SkillBadge 
                        key={skillIndex} 
                        skill={skill} 
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="self-start p-3 flex flex-col gap-2">
                <button 
                  className="p-1.5 text-gray-400 hover:text-[#A100FF] hover:bg-[#A100FF10] rounded-full transition-all duration-300"
                  onClick={() => onEdit(exp)}
                  title="Editar experiencia"
                  disabled={isAddingExperience}
                >
                  <FiEdit2 size={15} />
                </button>
                <button 
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-300"
                  onClick={() => onRemove(index, exp.id)}
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
  );
};

// Separate component for skill badges to manage state independently
const SkillBadge = ({ skill }: { skill: ExperienceSkill }) => {
  return (
    <motion.span 
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs border shadow-sm transition-all duration-200 ${skillLevelClasses[skill.level]}`}
    >
      {getSkillLevelIcon(skill.level)}
      <span className="font-medium">{skill.name}</span>
      <span className="ml-1.5 px-1.5 py-0.5 bg-white bg-opacity-60 rounded-full text-[10px] font-medium">
        {skillLevelLabels[skill.level]}
      </span>
    </motion.span>
  );
};

// Empty state component
const EmptyState = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="text-center py-10 text-gray-500"
  >
    <svg 
      className="mx-auto h-10 w-10 text-gray-300 mb-3"
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={1.5} 
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
      />
    </svg>
    <p>No has añadido ninguna experiencia laboral.</p>
    <p className="text-sm">Haz clic en &ldquo;Añadir Experiencia&rdquo; para empezar.</p>
  </motion.div>
);

export default ExperienceList;
export type { ExperienceItem };
