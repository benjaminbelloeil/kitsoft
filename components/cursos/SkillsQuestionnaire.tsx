import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

interface SkillsQuestionnaireProps {
  onSubmit: (skills: string[], currentPosition: string, desiredPosition: string) => void;
  onCancel: () => void;
}

const SkillsQuestionnaire: React.FC<SkillsQuestionnaireProps> = ({ onSubmit, onCancel }) => {
  const [currentPosition, setCurrentPosition] = useState('');
  const [desiredPosition, setDesiredPosition] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('technology');

  const skillCategories = {
    technology: [
      'JavaScript/TypeScript',
      'React',
      'Angular',
      'Vue',
      'Node.js',
      'Python',
      'Java',
      'Cloud Computing',
      'DevOps',
      'Microservicios',
      'Inteligencia Artificial',
      'Machine Learning',
      'Blockchain',
      'Mobile Development',
      'UX/UI Design'
    ],
    leadership: [
      'Liderazgo de Equipos',
      'Gestión de Proyectos',
      'Comunicación Efectiva',
      'Resolución de Problemas',
      'Mentoría',
      'Negociación',
      'Planificación Estratégica',
      'Agile/Scrum',
      'Toma de Decisiones'
    ],
    business: [
      'Análisis de Negocios',
      'Consultoría',
      'Gestión de Cuentas',
      'Desarrollo de Negocios',
      'Marketing Digital',
      'Finanzas',
      'Análisis de Datos',
      'Gestión de Productos',
      'Innovación'
    ]
  };

  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      if (selectedSkills.length < 5) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(selectedSkills, currentPosition, desiredPosition);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Cuestionario de Habilidades</h2>
        <button 
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
      </div>
      
      <div className="space-y-6 mb-8">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ¿Hacia dónde quieres dirigir tu carrera?
          </label>
          <input
            type="text"
            value={desiredPosition}
            onChange={(e) => setDesiredPosition(e.target.value)}
            placeholder="Ej: Líder Técnico Senior"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Selecciona hasta 5 habilidades que deseas desarrollar:</h3>
        <p className="text-gray-600 text-sm mb-4">
          Has seleccionado {selectedSkills.length} de 5 habilidades
        </p>
        
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'technology' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('technology')}
          >
            Tecnología
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'leadership' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('leadership')}
          >
            Liderazgo
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'business' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('business')}
          >
            Negocios
          </button>
        </div>
        
        {/* Skills grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {skillCategories[activeTab as keyof typeof skillCategories].map((skill) => (
            <div 
              key={skill}
              onClick={() => handleSkillToggle(skill)}
              className={`p-3 border rounded-md cursor-pointer transition-colors ${
                selectedSkills.includes(skill) 
                  ? 'bg-purple-100 border-purple-500' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center">
                {selectedSkills.includes(skill) && (
                  <Check size={16} className="text-purple-600 mr-2" />
                )}
                <span className={selectedSkills.includes(skill) ? 'text-purple-700' : ''}>
                  {skill}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-200">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          disabled={ !desiredPosition || selectedSkills.length === 0}
          className={`px-4 py-2 rounded-md text-white ${
             !desiredPosition || selectedSkills.length === 0
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SkillsQuestionnaire;