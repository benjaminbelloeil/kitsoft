/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import { SkillsSectionProps } from '@/interfaces/skill';
import { SkeletonSkills } from "./SkeletonProfile";
import { motion } from "framer-motion";
import { FiTool, FiStar, FiAward, FiTrendingUp } from "react-icons/fi";
import { createClient } from '@/utils/supabase/client';
import { getUserSkills } from "@/utils/database/client/skillsSync";

// Get icon for skill level
const getSkillLevelIcon = (level: number) => {
  switch (level) {
    case 1: return <FiStar className="mr-1.5" />;
    case 2: return <FiTrendingUp className="mr-1.5" />;
    case 3: return <FiAward className="mr-1.5" />;
    default: return <FiStar className="mr-1.5" />;
  }
};

interface Props extends SkillsSectionProps {
  loading?: boolean;
  externalSkills?: Array<{id: string, name: string, level: number}>;
}

export default function SkillsSection({ loading = false, externalSkills = [], initialSkills = [] }: Props) {
  const [skills, setSkills] = useState<Array<{id: string, name: string, level: number}>>([]);
  const [skillGroups, setSkillGroups] = useState<{
    beginner: Array<{id: string, name: string, level: number}>,
    intermediate: Array<{id: string, name: string, level: number}>,
    professional: Array<{id: string, name: string, level: number}>
  }>({
    beginner: [],
    intermediate: [],
    professional: []
  });
  const [, setFetched] = useState(false);

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

  // Fetch skills from database when component mounts or externalSkills change
  useEffect(() => {
    if (externalSkills && externalSkills.length > 0) {
      // Use the externally provided skills if available
      setSkills(externalSkills);
      setFetched(true);
    } else {
      // Otherwise fetch from the database
      const fetchSkillsFromDatabase = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) return;
        
        try {
          const fetchedSkills = await getUserSkills(user.id);
          if (!fetchedSkills || fetchedSkills.length === 0) return;
          
          const formattedSkills = fetchedSkills.map(skill => ({
            id: skill.id_habilidad,
            name: skill.titulo || '',
            level: skill.nivel_experiencia
          }));
          
          setSkills(formattedSkills);
          setFetched(true);
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      
      fetchSkillsFromDatabase();
    }
  }, [externalSkills]);

  if (loading) {
    return <SkeletonSkills />;
  }

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -2 }}
    >
      <motion.h2 
        className="text-xl font-bold mb-6 flex items-center pb-3 border-b border-gray-100"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.span 
          className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.2 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
        </motion.span>
        Habilidades
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {skills.length > 0 ? (
          <motion.div 
            className="space-y-5"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
          >
            {/* Professional skills */}
            {skillGroups.professional.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3 
                  className="text-sm font-medium text-gray-500 mb-3 flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <FiAward className="text-emerald-500 mr-2" /> Nivel Profesional
                </motion.h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroups.professional.map((skill, index) => (
                    <motion.span
                      key={skill.id || index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100 hover:shadow-md"
                    >
                      <motion.span
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getSkillLevelIcon(3)}
                      </motion.span>
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Intermediate skills */}
            {skillGroups.intermediate.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3 
                  className="text-sm font-medium text-gray-500 mb-3 flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <FiTrendingUp className="text-amber-500 mr-2" /> Nivel Intermedio
                </motion.h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroups.intermediate.map((skill, index) => (
                    <motion.span
                      key={skill.id || index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100 hover:shadow-md"
                    >
                      <motion.span
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getSkillLevelIcon(2)}
                      </motion.span>
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
            
            {/* Beginner skills */}
            {skillGroups.beginner.length > 0 && (
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.h3 
                  className="text-sm font-medium text-gray-500 mb-3 flex items-center"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <FiStar className="text-blue-500 mr-2" /> Nivel Principiante
                </motion.h3>
                <div className="flex flex-wrap gap-2">
                  {skillGroups.beginner.map((skill, index) => (
                    <motion.span
                      key={skill.id || index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm border shadow-sm transition-all duration-200 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:shadow-md"
                    >
                      <motion.span
                        whileHover={{ rotate: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {getSkillLevelIcon(1)}
                      </motion.span>
                      {skill.name}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="w-full py-10 flex flex-col items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <motion.div 
              className="bg-[#A100FF08] rounded-full p-3 inline-flex mb-3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <FiTool className="h-6 w-6 text-[#A100FF]" />
            </motion.div>
            <motion.h3 
              className="text-base font-medium text-gray-700 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            >
              Sin habilidades registradas
            </motion.h3>
            <motion.p 
              className="text-gray-500 text-center text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              Añade habilidades en tus experiencias profesionales.
            </motion.p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
