// app/dashboard/certificaciones/components/ProgressBar.tsx
import React from 'react';
import { Award, BookOpen, Check, Clock, Info, TrendingUp } from 'lucide-react';

const CareerPathVisualizer = ({ 
  paths, 
  activePath, 
  onPathChange 
}: { 
  paths: any[], 
  activePath: number, 
  onPathChange: (pathId: number) => void 
}) => {
  const currentPath = paths.find(p => p.id === activePath);
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start mb-6 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-bold flex items-center ">
            <TrendingUp className="mr-2 bg-purple-500 text-white rounded-full p-1" size={20} /> 
            Mi Trayectoria Profesional
          </h2>
          <p className="text-gray-600 text-sm">Visualiza y planifica tu crecimiento profesional en Accenture</p>
        </div>
        <div className="flex">
          <label htmlFor="path-select" className="sr-only">Seleccionar trayectoria profesional</label>
          <select 
            id="path-select"
            value={activePath}
            onChange={(e) => onPathChange(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md text-sm p-2 bg-white"
            aria-label="Seleccionar trayectoria profesional"
          >
            {paths.map(path => (
              <option key={path.id} value={path.id}>{path.title}</option>
            ))}
          </select>
        </div>
      </div>
      
      {currentPath && (
        <>
          <div className="mb-6">
            <h3 className={`text-lg font-semibold mb-1 text-[${currentPath.color}]`}>
              {currentPath.title}
            </h3>
            <p className="text-gray-600 text-sm">{currentPath.description}</p>
          </div>
          
          <div className="relative">
            {/* Path visualization */}
            <div className="flex items-center justify-between mb-8 relative">
              <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 z-0"></div>
              
              {currentPath.levels.map((level: any, index: number) => {
                let bgColor = "bg-gray-200";
                let textColor = "text-gray-500";
                let borderColor = "border-gray-200";
                
                if (level.completed) {
                  bgColor = "bg-purple-600";
                  textColor = "text-white";
                  borderColor = "border-purple-600";
                } else if (level.current) {
                  bgColor = "bg-white";
                  textColor = "text-purple-600";
                  borderColor = "border-purple-600";
                }
                
                return (
                  <div key={level.id} className="relative z-10 flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full ${bgColor} ${level.current ? 'border-2' : ''} ${borderColor} flex items-center justify-center ${textColor} font-bold text-sm mb-2`}
                    >
                      {level.completed ? <Check size={16} /> : index + 1}
                    </div>
                    <div className="text-sm font-medium">{level.name}</div>
                    <div className={`text-xs ${level.completed ? 'text-green-600' : (level.current ? 'text-blue-600' : 'text-gray-500')}`}>
                      {level.completed ? 'Completado' : (level.current ? 'Actual' : 'Pendiente')}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Skills and requirements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <BookOpen className="mr-2 text-purple-600" size={16} /> Habilidades Clave
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Consultoría Estratégica
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    Arquitectura de Soluciones
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                    Gestión de Proyectos Técnicos
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Liderazgo Técnico
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Award className="mr-2 text-purple-600" size={16} /> Certificaciones Recomendadas
                </h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <Check className="mr-2 text-green-500" size={14} />
                    Arquitectura de Soluciones
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 text-green-500" size={14} />
                    Inteligencia Artificial y ML
                  </li>
                  <li className="flex items-center">
                    <Clock className="mr-2 text-yellow-500" size={14} />
                    AWS Solutions Architect
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Azure Cloud Architect
                  </li>
                </ul>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center">
                  <Info className="mr-2 text-purple-600" size={16} /> Próximos Pasos
                </h4>
                <p className="text-sm text-gray-700 mb-3">
                  Para avanzar al siguiente nivel, completa estos cursos recomendados:
                </p>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={14} />
                    Fundamentos de Cloud Computing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-gray-300 mr-2"></div>
                    Gestión Avanzada de Proyectos
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CareerPathVisualizer;