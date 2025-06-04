/* eslint-disable @typescript-eslint/no-explicit-any */
// app/dashboard/certificaciones/components/ProgressBar.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, BookOpen, Check, Clock, Info, TrendingUp, MapPin, AlertCircle, Plus, Star, ChevronDown } from 'lucide-react';
import TrajectoryFormModal from '@/components/trajectory/TrajectoryFormModal';

// Helper function to get status configuration
const getStatusConfig = (level: any) => {
  if (level.completed) {
    return {
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
      iconBg: "bg-green-500",
      iconColor: "text-white",
      statusIcon: Check,
      statusText: "Completado"
    };
  }
  
  if (level.current) {
    return {
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
      borderColor: "border-blue-200",
      iconBg: "bg-blue-500",
      iconColor: "text-white",
      statusIcon: MapPin,
      statusText: "Actual"
    };
  }
  
  return {
    bgColor: "bg-gray-50",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    statusIcon: AlertCircle,
    statusText: "Pendiente"
  };
};

// Helper function to get level description
const getLevelDescription = (level: any) => {
  if (level.completed) {
    return 'Has completado exitosamente este nivel de tu carrera profesional.';
  }
  
  if (level.current) {
    return 'Estás trabajando actualmente en este nivel. ¡Sigue así!';
  }
  
  return 'Este nivel estará disponible una vez que completes los anteriores.';
};

// Helper function to get certificate and status badge classes
const getBadgeClasses = (level: any) => {
  if (level.completed) {
    return 'bg-green-100 text-green-700';
  }
  
  if (level.current) {
    return 'bg-blue-100 text-blue-700';
  }
  
  return 'bg-gray-100 text-gray-600';
};

// Helper function to sort certificates by completion status
const sortCertificatesByCompletion = (a: any, b: any) => {
  const aCompleted = a.completed ? 1 : 0;
  const bCompleted = b.completed ? 1 : 0;
  return aCompleted - bCompleted;
};

// Helper function to get certificate status styling
const getCertificateStatusClasses = (completed: boolean) => {
  if (completed) {
    return 'bg-green-100 text-green-700';
  }
  return 'bg-yellow-100 text-yellow-700';
};

// Helper function to get certificate status text
const getCertificateStatusText = (completed: boolean) => {
  if (completed) {
    return 'Completado';
  }
  return 'Pendiente';
};

// Helper function to get certificate background color
const getCertificateBackgroundColor = (completed: boolean) => {
  if (completed) {
    return 'bg-green-100';
  }
  return 'bg-yellow-100';
};

// Helper function to render certificate icon
const renderCertificateIcon = (completed: boolean) => {
  if (completed) {
    return <Check className="text-green-600" size={16} />;
  }
  return <Clock className="text-yellow-600" size={16} />;
};

// Timeline Item Component to reduce cognitive complexity
const TimelineItem = ({ 
  level, 
  index, 
  isExpanded, 
  onToggleExpansion 
}: { 
  level: any, 
  index: number, 
  isExpanded: boolean, 
  onToggleExpansion: () => void 
}) => {
  const statusConfig = getStatusConfig(level);
  const StatusIcon = statusConfig.statusIcon;
  const hasCertificates = level.certificates && level.certificates.length > 0;

  const handleClick = () => {
    if (hasCertificates) {
      onToggleExpansion();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (hasCertificates && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onToggleExpansion();
    }
  };

  const renderIcon = () => {
    if (level.completed) {
      return <Check size={18} className={statusConfig.iconColor} />;
    }
    
    if (level.current) {
      return <MapPin size={18} className={statusConfig.iconColor} />;
    }
    
    return <span className={`text-sm font-bold ${statusConfig.iconColor}`}>{index + 1}</span>;
  };

  return (
    <div className="relative">
      <div className="flex items-start">
        {/* Icon */}
        <div className={`relative z-10 flex-shrink-0 w-12 h-12 ${statusConfig.iconBg} rounded-full flex items-center justify-center border-4 border-white shadow-md`}>
          {renderIcon()}
        </div>
        
        {/* Content */}
        <div className="ml-4 flex-1">
          {hasCertificates ? (
            <button 
              className={`w-full text-left p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} transition-all duration-200 ${
                level.current ? 'shadow-md ring-2 ring-blue-200/50' : 'hover:shadow-sm'
              } cursor-pointer hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-300`}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              aria-expanded={isExpanded}
              aria-label={`${level.name} - Ver certificaciones`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className={`text-base font-semibold ${statusConfig.textColor}`}>
                    {level.name}
                    {level.current && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Actual</span>}
                  </h4>
                  {hasCertificates && (
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="ml-2 text-gray-400"
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {hasCertificates && (
                    <span className={`text-xs px-2 py-1 rounded-full ${getBadgeClasses(level)}`}>
                      {level.certificates.length} certificación{level.certificates.length !== 1 ? 'es' : ''}
                    </span>
                  )}
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeClasses(level)}`}>
                    <StatusIcon size={12} className="mr-1" />
                    {statusConfig.statusText}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {getLevelDescription(level)}
              </p>
            </button>
          ) : (
            <div className={`p-4 rounded-lg border ${statusConfig.borderColor} ${statusConfig.bgColor} ${
              level.current ? 'shadow-md ring-2 ring-blue-200/50' : ''
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <h4 className={`text-base font-semibold ${statusConfig.textColor}`}>
                    {level.name}
                    {level.current && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Actual</span>}
                  </h4>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`flex items-center text-xs px-2 py-1 rounded-full font-medium ${getBadgeClasses(level)}`}>
                    <StatusIcon size={12} className="mr-1" />
                    {statusConfig.statusText}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                {getLevelDescription(level)}
              </p>
            </div>
          )}
          
          {/* Certificate Dropdown */}
          <AnimatePresence>
            {isExpanded && hasCertificates && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <h5 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                    <Award size={16} className="mr-2 text-black" />
                    Certificaciones de este nivel
                  </h5>
                  <div className="space-y-2">
                    {level.certificates.map((certificate: any, certIndex: number) => (
                      <motion.div
                        key={certificate.id ?? `cert-${level.id}-${certIndex}`}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: certIndex * 0.1 }}
                        className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 ${getCertificateBackgroundColor(certificate.completed)} rounded-full flex items-center justify-center mr-3`}>
                          {renderCertificateIcon(certificate.completed)}
                        </div>
                        <div className="flex-1">
                          <h6 className="text-sm font-medium text-gray-800">
                            {certificate.name ?? `Certificación ${certIndex + 1}`}
                          </h6>
                          {certificate.description && (
                            <p className="text-xs text-gray-600 mt-1">
                              {certificate.description}
                            </p>
                          )}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificateStatusClasses(certificate.completed)}`}>
                          {getCertificateStatusText(certificate.completed)}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// Skills Section Component
const SkillsSection = ({ currentPath, allLevelsCompleted, getKeySkills }: { 
  currentPath: any, 
  allLevelsCompleted: boolean, 
  getKeySkills: (path: any) => string[] 
}) => {
  const renderCompletedState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check className="text-green-600" size={32} />
      </div>
      <h5 className="font-semibold text-gray-800 mb-2">¡Trayectoria Completada!</h5>
      <p className="text-sm text-gray-600">Has dominado todas las habilidades clave de esta trayectoria profesional.</p>
    </div>
  );

  const renderSkillsList = () => {
    const skills = getKeySkills(currentPath);
    
    if (skills.length === 0) {
      return (
        <ul className="space-y-3">
          <li className="flex items-center p-2 rounded-lg">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <AlertCircle className="text-gray-600" size={14} />
            </div>
            <span className="text-sm text-gray-500">No hay habilidades definidas aún</span>
          </li>
        </ul>
      );
    }

    return (
      <>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Habilidades clave que aprenderás en el nivel actual:
        </p>
        <ul className="space-y-3">
          {skills.map((skill: string, skillIndex: number) => (
            <li key={`skill-${skill}-${skillIndex}`} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <Star className="text-gray-600" size={14} />
              </div>
              <span className="text-sm font-medium text-gray-700">{skill}</span>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <h4 className="font-bold mb-4 flex items-center text-gray-800">
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
          <BookOpen className="text-purple-600" size={18} />
        </div>
        Habilidades Clave
      </h4>
      {allLevelsCompleted ? renderCompletedState() : renderSkillsList()}
    </div>
  );
};

// Certifications Section Component
const CertificationsSection = ({ currentPath, allLevelsCompleted, getRecommendedCertifications }: { 
  currentPath: any, 
  allLevelsCompleted: boolean, 
  getRecommendedCertifications: (path: any) => any[] 
}) => {
  const renderCompletedState = () => (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Award className="text-green-600" size={32} />
      </div>
      <h5 className="font-semibold text-gray-800 mb-2">¡Certificaciones Completadas!</h5>
      <p className="text-sm text-gray-600">Has obtenido todas las certificaciones disponibles en esta trayectoria.</p>
    </div>
  );

  const renderCertificationsList = () => {
    const certifications = getRecommendedCertifications(currentPath);
    
    if (certifications.length === 0) {
      return (
        <ul className="space-y-3">
          <li className="flex items-center p-2 rounded-lg">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <AlertCircle className="text-gray-600" size={14} />
            </div>
            <span className="text-sm text-gray-500">No hay certificaciones definidas aún</span>
          </li>
        </ul>
      );
    }

    return (
      <>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Certificaciones para el nivel actual:
        </p>
        <ul className="space-y-3">
          {certifications.map((cert: any, certIndex: number) => (
            <li key={`cert-${cert.name}-${certIndex}`} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={`flex-shrink-0 w-6 h-6 ${cert.completed ? 'bg-green-100' : 'bg-yellow-100'} rounded-full flex items-center justify-center mr-3`}>
                {cert.completed ? (
                  <Check className="text-green-600" size={14} />
                ) : (
                  <Clock className="text-yellow-600" size={14} />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{cert.name}</span>
                {cert.level && (
                  <span className="text-xs text-gray-500">Nivel: {cert.level}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <h4 className="font-bold mb-4 flex items-center text-gray-800">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <Award className="text-blue-600" size={18} />
        </div>
        Certificaciones
      </h4>
      {allLevelsCompleted ? renderCompletedState() : renderCertificationsList()}
    </div>
  );
};

// Next Steps Section Component
const NextStepsSection = ({ currentPath, allLevelsCompleted, getNextSteps }: { 
  currentPath: any, 
  allLevelsCompleted: boolean, 
  getNextSteps: (path: any) => any[] 
}) => {
  const renderCompletedState = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check className="text-green-600" size={32} />
      </div>
      <h5 className="font-semibold text-gray-800 mb-2">¡Trayectoria Completada!</h5>
      <p className="text-sm text-gray-600">Has completado todos los niveles de esta trayectoria profesional.</p>
    </div>
  );

  const renderNextStepsList = () => {
    const nextSteps = getNextSteps(currentPath);
    
    if (nextSteps.length === 0) {
      return (
        <div className="flex items-center p-2 rounded-lg">
          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center mr-3">
            <AlertCircle className="text-gray-600" size={14} />
          </div>
          <span className="text-sm text-gray-500">No hay próximos pasos definidos aún</span>
        </div>
      );
    }

    return (
      <>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          Próximas certificaciones que tendrás en el proximo nivel:
        </p>
        <ul className="space-y-3">
          {nextSteps.map((cert: any, stepIndex: number) => (
            <li key={`step-${cert.name}-${stepIndex}`} className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Clock className="text-blue-600" size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">{cert.name}</span>
                {cert.description && (
                  <span className="text-xs text-gray-500">{cert.description}</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <h4 className="font-bold mb-4 flex items-center text-gray-800">
        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
          <Info className="text-orange-600" size={18} />
        </div>
        Próximos Pasos
      </h4>
      {allLevelsCompleted ? renderCompletedState() : renderNextStepsList()}
    </div>
  );
};

const CareerPathVisualizer = ({ 
  paths, 
  activePath, 
  onPathChange,
  onPathCreated,
  onPathCompleted 
}: { 
  paths: any[], 
  activePath: number, 
  onPathChange: (pathId: number) => void,
  onPathCreated?: () => void,
  onPathCompleted?: () => void 
}) => {
  const currentPath = paths.find(p => p.id === activePath);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set());
  
  // Add debugging log and check completion status
  const [allLevelsCompleted, setAllLevelsCompleted] = useState(false);
  
  useEffect(() => {
    if (currentPath) {


      // Check if all levels are completed and trigger completion check
      const completed = currentPath.levels.length > 0 && 
        currentPath.levels.every((level: any) => level.completed);
      
      setAllLevelsCompleted(completed);
      
      if (completed && !currentPath.completed && onPathCompleted) {

        onPathCompleted();
      }
    }
  }, [currentPath, onPathCompleted]);

  const handleAddTrajectory = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleLevelExpansion = (levelId: string) => {
    setExpandedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(levelId)) {
        newSet.delete(levelId);
      } else {
        newSet.add(levelId);
      }
      return newSet;
    });
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleTrajectorySubmit = (trajectoryData: any) => {
    // Handle the trajectory submission

    setIsModalOpen(false);
    // Trigger refresh of paths
    if (onPathCreated) {
      onPathCreated();
    }
  };

  // Helper functions for dynamic data
  const getNextLevel = (path: any) => {
    if (!path?.levels) return null;
    
    // Find the current level
    const currentLevelIndex = path.levels.findIndex((level: any) => level.current);
    
    // If we found a current level and it's not the last one
    if (currentLevelIndex >= 0 && currentLevelIndex < path.levels.length - 1) {
      return path.levels[currentLevelIndex + 1];
    }
    
    // If no current level or if it's the last level, find the first incomplete level
    const firstIncompleteLevelIndex = path.levels.findIndex((level: any) => !level.completed);
    if (firstIncompleteLevelIndex >= 0) {
      return path.levels[firstIncompleteLevelIndex];
    }
    
    // Default to the last level if all are completed
    return path.levels.length > 0 ? path.levels[path.levels.length - 1] : null;
  };

  const getKeySkills = (path: any) => {
    if (!path?.levels) return [];
    
    const nextLevel = getNextLevel(path);
    if (!nextLevel?.certificates) return [];
    
    // Extract unique skills from certificates in the next level
    const skills = nextLevel.certificates.reduce((acc: string[], cert: any) => {
      if (cert.name && !acc.includes(cert.name)) {
        acc.push(cert.name);
      }
      return acc;
    }, []);
    
    return skills.slice(0, 4); // Limit to 4 skills
  };

  const getRecommendedCertifications = (path: any) => {
    if (!path?.levels) return [];
    
    // Find the current level instead of the next level
    const currentLevelIndex = path.levels.findIndex((level: any) => level.current);
    
    if (currentLevelIndex >= 0) {
      const currentLevel = path.levels[currentLevelIndex];
      if (currentLevel?.certificates) {
        return currentLevel.certificates.slice(0, 4).map((cert: any) => ({
          name: cert.name,
          completed: cert.completed ?? false,
          level: currentLevel.name ?? currentLevel.title
        }));
      }
    }
    
    // Fallback to first incomplete level if no current level
    const firstIncompleteLevelIndex = path.levels.findIndex((level: any) => !level.completed);
    if (firstIncompleteLevelIndex >= 0) {
      const level = path.levels[firstIncompleteLevelIndex];
      if (level?.certificates) {
        return level.certificates.slice(0, 4).map((cert: any) => ({
          name: cert.name,
          completed: cert.completed ?? false,
          level: level.name ?? level.title
        }));
      }
    }
    
    return [];
  };

  const getNextSteps = (path: any) => {
    if (!path?.levels) return [];
    
    // Specifically look for level 3 certificates
    const level3 = path.levels.find((level: any) => level.name?.includes("3") ?? level.title?.includes("3"));
    
    if (level3?.certificates) {
      // Return certificates from level 3, prioritizing incomplete ones
      const certs = [...level3.certificates]
        .sort(sortCertificatesByCompletion)
        .slice(0, 3);
      
      return certs;
    }
    
    // Fallback to the next level if level 3 is not found
    const nextLevel = getNextLevel(path);
    if (!nextLevel?.certificates) return [];
    
    const certs = [...nextLevel.certificates]
      .sort(sortCertificatesByCompletion)
      .slice(0, 3);
    
    return certs;
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
          {paths.length > 0 && (
            <>
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
            </>
          )}
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
        {(() => {
          if (isModalOpen) {
            return (
              <TrajectoryFormModal
                key="form"
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handleTrajectorySubmit}
              />
            );
          }
          
          if (paths.length === 0) {
            return (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                className="mt-6 bg-gray-50/50 rounded-xl border border-gray-200 overflow-hidden"
              >
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    ¡Comienza tu trayectoria profesional!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Haz clic en el botón <span className="inline-flex items-center mx-1 px-1 py-0.5 bg-purple-100 text-purple-600 rounded text-sm"><Plus className="w-3 h-3" /></span> para crear tu primera trayectoria y la IA generara automáticamente los niveles de aprendizaje.
                  </p>
                </div>
              </motion.div>
            );
          }
          
          if (currentPath) {
            return (
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
                    {currentPath.levels.map((level: any, index: number) => (
                      <TimelineItem
                        key={level.id ?? `level-${index}`}
                        level={level}
                        index={index}
                        isExpanded={expandedLevels.has(level.id)}
                        onToggleExpansion={() => toggleLevelExpansion(level.id)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Skills and requirements */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <SkillsSection 
                  currentPath={currentPath}
                  allLevelsCompleted={allLevelsCompleted}
                  getKeySkills={getKeySkills}
                />
                
                <CertificationsSection 
                  currentPath={currentPath}
                  allLevelsCompleted={allLevelsCompleted}
                  getRecommendedCertifications={getRecommendedCertifications}
                />
                
                <NextStepsSection 
                  currentPath={currentPath}
                  allLevelsCompleted={allLevelsCompleted}
                  getNextSteps={getNextSteps}
                />
              </div>
                </div>
              </motion.div>
            );
          }
          
          return null;
        })()}
      </AnimatePresence>
    </div>
  );
};

export default CareerPathVisualizer;