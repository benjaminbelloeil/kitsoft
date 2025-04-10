import React, { useState } from "react";
import { FiPlus, FiTrash2, FiSave, FiX } from "react-icons/fi";
import { Skeleton } from "@/components/ui/skeleton";

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

export default function ExperienceSection({ initialExperiences, loading = false }: ExperienceSectionProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    position: "",
    period: "",
    description: ""
  });
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const handleAddExperience = () => {
    setExperiences([...experiences, newExperience]);
    setNewExperience({ company: "", position: "", period: "", description: "" });
    setIsAddingExperience(false);
  };

  const handleRemoveExperience = (index: number) => {
    const updatedExperiences = [...experiences];
    updatedExperiences.splice(index, 1);
    setExperiences(updatedExperiences);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 animate-pulse">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
          <div className="flex items-center">
            <Skeleton className="h-9 w-9 rounded-md mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
        
        <div className="space-y-6">
          {[1, 2].map((_, index) => (
            <div 
              key={index} 
              className="border-l-3 border-gray-200 pl-6 relative p-4 rounded-r-lg mb-2"
            >
              <div className="absolute -left-1.5 top-6 h-4 w-4 rounded-full bg-gray-200"></div>
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div className="w-full">
                  <Skeleton className="h-5 w-48 mb-2" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24 mb-3" />
                  <Skeleton className="h-4 w-full max-w-md" />
                </div>
                <div className="mt-2 md:mt-0 md:ml-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
      <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-100">
        <h2 className="text-xl font-bold flex items-center">
          <span className="bg-[#A100FF20] p-2 rounded-md mr-2 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
            </svg>
          </span>
          Experiencia
        </h2>
        <button 
          className="px-3 py-2 bg-[#A100FF] rounded-md hover:bg-[#8500D4] fast-transition flex items-center gap-1 shadow-sm"
          onClick={() => setIsAddingExperience(true)}
        >
          <FiPlus size={16} className="text-white !important" />
          <span className="text-white !important">Añadir</span>
        </button>
      </div>
      
      {isAddingExperience && (
        <div className="mb-6 p-6 border border-[#A100FF20] rounded-lg bg-[#A100FF05] shadow-md">
          <h3 className="font-medium mb-4 text-lg text-gray-800">Nueva experiencia</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  value={newExperience.company}
                  onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Posición</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                  value={newExperience.position}
                  onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                placeholder="Ej: 2020 - Presente"
                value={newExperience.period}
                onChange={(e) => setNewExperience({...newExperience, period: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF]"
                rows={3}
                value={newExperience.description}
                onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <button 
                className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 fast-transition shadow font-medium flex items-center gap-1"
                onClick={() => setIsAddingExperience(false)}
              >
                <FiX size={16} className="text-white !important" />
                <span className="text-white !important">Cancelar</span>
              </button>
              <button 
                className="px-4 py-2 bg-[#A100FF] rounded hover:bg-[#8500D4] fast-transition shadow font-medium flex items-center gap-1"
                onClick={handleAddExperience}
              >
                <FiSave size={16} className="text-white !important" />
                <span className="text-white !important">Guardar</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <div 
            key={index} 
            className="border-l-3 border-gray-200 pl-6 relative hover:border-l-[#A100FF] fast-transition group p-4 rounded-r-lg hover:bg-[#A100FF05] mb-2"
          >
            <div className="absolute -left-1.5 top-6 h-4 w-4 rounded-full bg-gray-200 group-hover:bg-[#A100FF] fast-transition shadow"></div>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start">
              <div>
                <h3 className="font-medium text-lg text-gray-800">{exp.position}</h3>
                <p className="text-[#A100FF] font-medium">{exp.company}</p>
                <p className="text-gray-600 text-sm">{exp.period}</p>
                <p className="text-gray-700 mt-2">{exp.description}</p>
              </div>
              <div className="mt-2 md:mt-0 md:ml-4">
                <button 
                  className="text-red-500 hover:text-red-700 fast-transition p-2 hover:bg-red-50 rounded-full"
                  onClick={() => handleRemoveExperience(index)}
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
