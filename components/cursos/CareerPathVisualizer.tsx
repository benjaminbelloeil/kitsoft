/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/certificaciones/components/ProgressBar.tsx
import React from 'react';
import { Award, BookOpen, Check, Clock, Info, TrendingUp, MapPin, AlertCircle } from 'lucide-react';

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
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Mi Trayectoria Profesional</h2>
              <p className="text-gray-600 text-sm">Visualiza y planifica tu crecimiento profesional en Accenture</p>
            </div>
          </div>
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
            <h3 className="text-lg font-semibold mb-1 text-gray-800">
              {currentPath.title}
            </h3>
            <p className="text-gray-600 text-sm">{currentPath.description}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 mb-6 shadow-md border border-gray-100">
            {/* Compact Timeline Design */}
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              {/* Timeline items */}
              <div className="space-y-4">
                {currentPath.levels.map((level: any, index: number) => {
                  let statusConfig = {
                    bgColor: "bg-gray-50",
                    textColor: "text-gray-700",
                    borderColor: "border-gray-200",
                    iconBg: "bg-gray-100",
                    iconColor: "text-gray-500",
                    statusIcon: AlertCircle,
                    statusText: "Pendiente"
                  };
                  
                  if (level.completed) {
                    statusConfig = {
                      bgColor: "bg-green-50",
                      textColor: "text-green-800",
                      borderColor: "border-green-200",
                      iconBg: "bg-green-500",
                      iconColor: "text-white",
                      statusIcon: Check,
                      statusText: "Completado"
                    };
                  } else if (level.current) {
                    statusConfig = {
                      bgColor: "bg-purple-50",
                      textColor: "text-purple-800",
                      borderColor: "border-purple-200",
                      iconBg: "bg-purple-500",
                      iconColor: "text-white",
                      statusIcon: MapPin,
                      statusText: "Actual"
                    };
                  }
                  
                  const StatusIcon = statusConfig.statusIcon;
                  
                  return (
                    <div key={level.id} className="relative flex items-center">
                      {/* Icon */}
                      <div className={`relative z-10 flex-shrink-0 w-12 h-12 ${statusConfig.iconBg} rounded-full flex items-center justify-center border-4 border-white shadow-md`}>
                        {level.completed ? (
                          <Check size={18} className={statusConfig.iconColor} />
                        ) : level.current ? (
                          <MapPin size={18} className={statusConfig.iconColor} />
                        ) : (
                          <span className={`text-sm font-bold ${statusConfig.iconColor}`}>{index + 1}</span>
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className={`ml-4 flex-1 p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} transition-all duration-200 hover:shadow-sm`}>
                        <div className="flex items-center justify-between">
                          <h4 className={`text-base font-semibold ${statusConfig.textColor}`}>{level.name}</h4>
                          <div className={`flex items-center text-xs px-2 py-1 rounded-full font-medium ${
                            level.completed 
                              ? 'bg-green-100 text-green-700' 
                              : level.current 
                                ? 'bg-purple-100 text-purple-700' 
                                : 'bg-gray-100 text-gray-600'
                          }`}>
                            <StatusIcon size={12} className="mr-1" />
                            {statusConfig.statusText}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                          {level.completed 
                            ? 'Has completado exitosamente este nivel de tu carrera profesional.' 
                            : level.current 
                              ? 'Estás trabajando actualmente en este nivel. ¡Sigue así!' 
                              : 'Este nivel estará disponible una vez que completes los anteriores.'
                          }
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skills and requirements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold mb-4 flex items-center text-gray-800">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="text-purple-600" size={18} />
                </div>
                Habilidades Clave
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Consultoría Estratégica</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Arquitectura de Soluciones</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-yellow-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Gestión de Proyectos Técnicos</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-gray-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Liderazgo Técnico</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold mb-4 flex items-center text-gray-800">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Award className="text-blue-600" size={18} />
                </div>
                Certificaciones Recomendadas
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Arquitectura de Soluciones</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Check className="text-green-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Inteligencia Artificial y ML</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-yellow-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">AWS Solutions Architect</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-gray-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Azure Cloud Architect</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <h4 className="font-bold mb-4 flex items-center text-gray-800">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                  <Info className="text-orange-600" size={18} />
                </div>
                Próximos Pasos
              </h4>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Para avanzar al siguiente nivel, completa estos cursos recomendados:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-blue-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Fundamentos de Cloud Computing</span>
                </li>
                <li className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <Clock className="text-gray-600" size={14} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Gestión Avanzada de Proyectos</span>
                </li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CareerPathVisualizer;