import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiTool, FiStar, FiAward, FiTrendingUp } from "react-icons/fi";

interface Skill {
  id: string;
  name: string;
  level: number;
}

interface ReadOnlySkillsSectionProps {
  skills: Skill[];
  loading?: boolean;
}

// Get icon for skill level
const getSkillLevelIcon = (level: number) => {
  switch (level) {
    case 1: return <FiStar className="mr-1.5" />;
    case 2: return <FiTrendingUp className="mr-1.5" />;
    case 3: return <FiAward className="mr-1.5" />;
    default: return <FiStar className="mr-1.5" />;
  }
};

export default function ReadOnlySkillsSection({ skills, loading = false }: ReadOnlySkillsSectionProps) {
  const [skillGroups, setSkillGroups] = useState<{
    beginner: Array<{id: string, name: string, level: number}>,
    intermediate: Array<{id: string, name: string, level: number}>,
    professional: Array<{id: string, name: string, level: number}>
  }>({
    beginner: [],
    intermediate: [],
    professional: []
  });

  // Group skills by level
  useEffect(() => {
    if (skills.length > 0) {
      const grouped = {
        beginner: skills.filter(skill => skill.level === 1),
        intermediate: skills.filter(skill => skill.level === 2),
        professional: skills.filter(skill => skill.level === 3)
      };
      setSkillGroups(grouped);
    }
  }, [skills]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gray-200 rounded-md mr-3"></div>
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
      <h2 className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100">
        <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </span>
        Habilidades
      </h2>
      
      {skills.length > 0 ? (
        <div className="space-y-5">
          {/* Professional skills */}
          {skillGroups.professional.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <FiAward className="text-emerald-500 mr-2" /> Nivel Profesional
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroups.professional.map((skill, index) => (
                  <motion.span
                    key={skill.id || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                  >
                    {getSkillLevelIcon(3)}
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          
          {/* Intermediate skills */}
          {skillGroups.intermediate.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <FiTrendingUp className="text-amber-500 mr-2" /> Nivel Intermedio
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroups.intermediate.map((skill, index) => (
                  <motion.span
                    key={skill.id || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100"
                  >
                    {getSkillLevelIcon(2)}
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
          
          {/* Beginner skills */}
          {skillGroups.beginner.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <FiStar className="text-blue-500 mr-2" /> Nivel Principiante
              </h3>
              <div className="flex flex-wrap gap-2">
                {skillGroups.beginner.map((skill, index) => (
                  <motion.span
                    key={skill.id || index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3, delay: index * 0.03 }}
                    className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                  >
                    {getSkillLevelIcon(1)}
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full py-10 flex flex-col items-center justify-center"
        >
          <div className="bg-gradient-to-r from-[#A100FF10] to-transparent p-4 rounded-full mb-3">
            <FiTool size={36} className="text-[#A100FF60]" />
          </div>
          <h3 className="text-base font-medium text-gray-700 mb-2">Sin habilidades registradas</h3>
          <p className="text-gray-500 text-center text-sm">
            Este usuario no tiene habilidades registradas.
          </p>
        </motion.div>
      )}
    </div>
  );
}
