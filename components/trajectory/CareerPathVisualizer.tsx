/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/certificaciones/components/ProgressBar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, Check, Clock, Info, TrendingUp, MapPin, AlertCircle, Plus } from 'lucide-react';
import TrajectoryFormModal from '@/components/trajectory/TrajectoryFormModal';

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTrajectory = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleTrajectorySubmit = (trajectoryData: any) => {
    // Handle the trajectory submission
    console.log('Trajectory submitted:', trajectoryData);
    setIsModalOpen(false);
    // You can add additional logic here to refresh the paths or update the UI
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex justify-between items-start border-b border-gray-200 pb-4">
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
        <div className="flex items-center space-x-2 relative">
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
          <button
            onClick={handleAddTrajectory}
            className="flex items-center justify-center w-10 h-10 bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-purple-200/50 backdrop-blur-sm"
            title="Agregar nueva trayectoria"
            aria-label="Agregar nueva trayectoria"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Trajectory Form Extension */}
      <AnimatePresence mode="wait">
        {isModalOpen ? (
          <TrajectoryFormModal
            key="form"
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSubmit={handleTrajectorySubmit}
          />
        ) : currentPath ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
            className="mt-6 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
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
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default CareerPathVisualizer;