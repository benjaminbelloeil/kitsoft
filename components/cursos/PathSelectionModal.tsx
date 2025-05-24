import React from 'react';
import { Check, ChevronRight, X, Award, BarChart } from 'lucide-react';

interface Level {
  id: string;
  name: string;
  completed: boolean;
  current?: boolean;
}

interface CareerPath {
  id: number;
  title: string;
  description: string;
  levels: Level[];
  color: string;
  skills: string[];
  certifications?: { name: string; status: 'completed' | 'in-progress' | 'pending' }[];
  nextSteps?: string[];
}

interface PathSelectionModalProps {
  paths: CareerPath[];
  userSkills: string[];
  onPathSelect: (pathId: number) => void;
  onClose: () => void;
}

const PathSelectionModal: React.FC<PathSelectionModalProps> = ({ 
  paths, 
  userSkills,
  onPathSelect, 
  onClose 
}) => {
  // Calculate path match score based on user skills
  const getPathMatchScore = (path: CareerPath) => {
    if (!userSkills.length || !path.skills.length) return 0;
    
    const matchedSkills = path.skills.filter(skill => 
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    
    return Math.round((matchedSkills.length / Math.max(5, path.skills.length)) * 100);
  };
  
  // Sort paths by match score
  const sortedPaths = [...paths].sort((a, b) => 
    getPathMatchScore(b) - getPathMatchScore(a)
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-gray-800/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center border-b border-gray-200 p-6">
          <div>
            <h2 className="text-2xl font-bold">Trayectorias profesionales recomendadas</h2>
            <p className="text-gray-600">Basadas en tus habilidades y preferencias</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {sortedPaths.map((path) => {
              const matchScore = getPathMatchScore(path);
              const matchedSkills = path.skills.filter(skill => 
                userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
              );
              
              return (
                <div 
                  key={path.id}
                  className="border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-xl font-semibold" style={{ color: path.color }}>
                          {path.title}
                        </h3>
                        <p className="text-gray-600">{path.description}</p>
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <div className="flex items-center mb-1">
                          <BarChart size={16} className="text-purple-600 mr-1" />
                          <span className="text-sm font-medium">Coincidencia</span>
                        </div>
                        <div className="h-2 w-32 bg-gray-200 rounded-full mb-1">
                          <div 
                            className="h-2 rounded-full bg-purple-600" 
                            style={{ width: `${matchScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold ${
                          matchScore > 70 ? 'text-green-600' : matchScore > 40 ? 'text-yellow-600' : 'text-gray-600'
                        }`}>
                          {matchScore}% coincidencia
                        </span>
                      </div>
                    </div>
                    
                    {userSkills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Habilidades coincidentes:</p>
                        <div className="flex flex-wrap gap-2">
                          {matchedSkills.map(skill => (
                            <span 
                              key={skill} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              <Check size={12} className="mr-1" /> {skill}
                            </span>
                          ))}
                          {matchedSkills.length === 0 && (
                            <span className="text-sm text-gray-500 italic">
                              No hay coincidencias directas con tus habilidades seleccionadas
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Path progression visualization */}
                    <div className="relative flex items-center justify-between mb-5">
                      <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-0.5 bg-gray-200 z-0"></div>
                      {path.levels.map((level, index) => (
                        <div key={level.id} className="relative z-10 flex flex-col items-center">
                          <div className={`w-4 h-4 rounded-full ${
                            level.completed ? 'bg-purple-600' : 'bg-gray-200'
                          }`}></div>
                          <span className="text-xs mt-1 hidden md:inline">{level.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Award size={16} className="mr-1" />
                        <span>
                          {path.levels.length} niveles • {path.certifications?.length || 0} certificaciones
                        </span>
                      </div>
                      <button
                        onClick={() => onPathSelect(path.id)}
                        className="flex items-center text-purple-600 hover:text-purple-800 font-medium text-sm"
                      >
                        Seleccionar trayectoria
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="border-t border-gray-200 p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathSelectionModal;