import React, { useRef, useState } from "react";
import { FiPlus, FiX, FiCalendar, FiBriefcase, FiCheck, FiSearch } from "react-icons/fi";
import { RiBuilding4Line } from "react-icons/ri";
import { searchSkills } from "@/utils/database/client/skillsSync";

// Import skill level utilities
const skillLevelLabels: Record<number, string> = {
  1: 'Principiante',
  2: 'Intermedio', 
  3: 'Profesional'
};

const skillLevelClasses: Record<number, string> = {
  1: 'bg-blue-100 text-blue-700 border-blue-200',
  2: 'bg-yellow-100 text-yellow-700 border-yellow-200', 
  3: 'bg-green-100 text-green-700 border-green-200'
};

interface ExperienceSkill {
  id?: string;
  name: string;
  level: number;
}

interface ExperienceFormData {
  id?: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string | null;
  description: string;
  isCurrentPosition?: boolean;
  skills?: ExperienceSkill[];
}

interface ExperienceEditFormProps {
  formData: ExperienceFormData;
  onFormChange: (data: ExperienceFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  isSaving: boolean;
}

const ExperienceEditForm = ({ 
  formData, 
  onFormChange, 
  onSave, 
  onCancel, 
  isEditing, 
  isSaving 
}: ExperienceEditFormProps) => {
  const [skillInput, setSkillInput] = useState("");
  const [skillSearchResults, setSkillSearchResults] = useState<Array<{id: string, titulo: string}>>([]);
  const [selectedSkill, setSelectedSkill] = useState<{id?: string, name: string, level: number} | null>(null);
  const [showSkillLevelSelect, setShowSkillLevelSelect] = useState(false);
  const [, setIsSearching] = useState(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle current position checkbox change
  const handleCurrentPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormChange({
      ...formData,
      isCurrentPosition: e.target.checked,
      endDate: e.target.checked ? null : formData.endDate
    });
  };
  
  // Skills handling functions
  const handleAddSkill = (skillId?: string, skillTitle?: string) => {
    if (selectedSkill) {
      const newSkill = {
        id: skillId || selectedSkill.id,
        name: skillTitle || selectedSkill.name,
        level: selectedSkill.level
      };
      
      if (!formData.skills?.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
        onFormChange({
          ...formData,
          skills: [...(formData.skills || []), newSkill]
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
      
      if (!formData.skills?.some(s => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
        onFormChange({
          ...formData,
          skills: [...(formData.skills || []), newSkill]
        });
      }
      
      setSelectedSkill(null);
      setShowSkillLevelSelect(false);
      setSkillInput("");
    }
  };

  const handleUpdateSkillLevel = (skillIndex: number, level: number) => {
    if (formData.skills) {
      const updatedSkills = [...formData.skills];
      updatedSkills[skillIndex] = {
        ...updatedSkills[skillIndex],
        level
      };
      
      onFormChange({
        ...formData,
        skills: updatedSkills
      });
    }
  };

  const handleRemoveSkill = (skillIndex: number) => {
    if (formData.skills) {
      const updatedSkills = [...formData.skills];
      updatedSkills.splice(skillIndex, 1);
      
      onFormChange({
        ...formData,
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

  // Search for skills when input changes
  React.useEffect(() => {
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

    const debounceTimeout = setTimeout(handleSkillSearch, 300);
    return () => clearTimeout(debounceTimeout);
  }, [skillInput]);
  
  // Handle clicks outside search results
  React.useEffect(() => {
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

  return (
    <div 
      ref={formRef}
      className="p-6 border border-[#A100FF20] rounded-lg bg-gradient-to-b from-[#A100FF08] to-transparent backdrop-blur-sm shadow-md"
    >
      <h3 className="font-medium mb-5 text-lg text-gray-800 border-b pb-2 border-[#A100FF20]">
        {isEditing ? 'Editar experiencia laboral' : 'Nueva experiencia laboral'}
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
                value={formData.company}
                onChange={(e) => onFormChange({...formData, company: e.target.value})}
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
                value={formData.position}
                onChange={(e) => onFormChange({...formData, position: e.target.value})}
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
                value={formData.startDate}
                onChange={(e) => onFormChange({...formData, startDate: e.target.value})}
                style={{colorScheme: 'light'}}
              />
            </div>
          </div>
          
          <div className={`transition-all duration-300 focus-within:scale-[1.01] ${formData.isCurrentPosition ? 'opacity-50' : ''}`}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Fecha de fin</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">
                <FiCalendar size={16} />
              </span>
              <input
                type="date"
                className="w-full p-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF] focus:border-[#A100FF] bg-white transition-all duration-300 cursor-pointer"
                value={formData.endDate || ''}
                onChange={(e) => onFormChange({...formData, endDate: e.target.value})}
                disabled={formData.isCurrentPosition}
                style={{colorScheme: 'light'}}
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center my-3 bg-gray-50 p-3 rounded-lg border border-gray-200 hover:border-[#A100FF40] transition-all duration-300">
          <label className="flex items-center w-full cursor-pointer" onClick={(e) => {
            e.preventDefault();
            handleCurrentPositionChange({
              target: { checked: !formData.isCurrentPosition }
            } as React.ChangeEvent<HTMLInputElement>);
          }}>
            <div className="relative">
              <input
                id="current-position"
                type="checkbox"
                checked={formData.isCurrentPosition}
                onChange={handleCurrentPositionChange}
                className="sr-only"
              />
              <div className={`w-10 h-5 rounded-full transition-colors duration-300 ease-in-out ${formData.isCurrentPosition ? 'bg-[#A100FF]' : 'bg-gray-300'}`}>
                <div className={`absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out shadow-md ${formData.isCurrentPosition ? 'translate-x-5' : 'translate-x-0'}`}></div>
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
            value={formData.description}
            onChange={(e) => onFormChange({...formData, description: e.target.value})}
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
              {formData.skills && formData.skills.length > 0 ? (
                formData.skills.map((skill, index) => (
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
            onClick={onCancel}
            type="button"
            disabled={isSaving}
          >
            <FiX size={16} className="text-white" />
            <span className="text-white">Cancelar</span>
          </button>
          <button 
            className="px-4 py-2.5 bg-gradient-to-r from-[#A100FF] to-[#8A00E3] rounded-lg hover:from-[#8A00E3] hover:to-[#7500C0] transition-all duration-300 shadow-sm font-medium flex items-center gap-2 disabled:opacity-50"
            onClick={onSave}
            disabled={isSaving || !formData.company || !formData.position || !formData.startDate || (!formData.endDate && !formData.isCurrentPosition)}
            type="button"
          >
            <FiCheck size={16} className="text-white" />
            <span className="text-white">
              {isEditing ? 'Guardar cambios' : 'Agregar'}
              {isSaving && '...'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEditForm;
export { skillLevelLabels, skillLevelClasses };
export type { ExperienceFormData, ExperienceSkill };
