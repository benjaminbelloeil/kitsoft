import React, { useState } from "react";
import { FiPlus, FiX, FiCheck } from "react-icons/fi";
import { SkillsSectionProps } from '@/interfaces/skill';
import { Skeleton } from "@/components/ui/skeleton";

interface Props extends SkillsSectionProps {
  loading?: boolean;
}

export default function SkillsSection({ initialSkills, loading = false }: Props) {
  const [skills, setSkills] = useState<string[]>(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [isAddingSkill, setIsAddingSkill] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
      setIsAddingSkill(false);
    }
  };

  const handleRemoveSkill = (indexToRemove: number) => {
    setSkills(skills.filter((_, index) => index !== indexToRemove));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-pulse">
        <div className="flex items-center pb-3 border-b border-gray-100 mb-6">
          <Skeleton className="h-9 w-9 rounded-md mr-2" />
          <Skeleton className="h-6 w-32" />
        </div>
        
        <div className="flex flex-wrap gap-3">
          {[...Array(8)].map((_, i) => (
            <Skeleton 
              key={i} 
              className={`h-8 rounded-md ${i < 3 ? 'w-24' : i < 5 ? 'w-32' : 'w-20'}`} 
            />
          ))}
          <Skeleton className="h-8 w-32 rounded-md" />
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
      
      <div className="flex flex-wrap gap-3">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="px-3 py-1.5 bg-[#A100FF15] text-[#A100FF] rounded-md text-sm border border-[#A100FF20] shadow-sm flex items-center gap-1"
          >
            <span>{skill}</span>
            <button
              className="ml-1 text-red-500 hover:text-red-700 transition-colors"
              onClick={() => handleRemoveSkill(index)}
              title="Remove skill"
            >
              <FiX size={16} />
            </button>
          </div>
        ))}

        {isAddingSkill ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] w-48"
                placeholder="Nueva habilidad"
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddSkill();
                  }
                }}
              />
            </div>
            <div className="flex gap-1">
              <button
                onClick={handleAddSkill}
                className="px-3 py-2 bg-[#A100FF] rounded hover:bg-[#8500D4] transition-colors shadow flex items-center gap-1"
              >
                <FiCheck size={16} className="text-white !important" />
                <span className="text-white !important">Añadir</span>
              </button>
              <button
                onClick={() => setIsAddingSkill(false)}
                className="px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition-colors shadow flex items-center gap-1"
              >
                <FiX size={16} className="text-white !important" />
                <span className="text-white !important">Cancelar</span>
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="px-3 py-1.5 bg-[#A100FF] rounded flex items-center gap-1 hover:bg-[#8500D4] transition-colors shadow-sm"
            onClick={() => setIsAddingSkill(true)}
          >
            <FiPlus size={16} className="text-white !important" />
            <span className="text-white !important">Añadir habilidad</span>
          </button>
        )}
      </div>
    </div>
  );
}
