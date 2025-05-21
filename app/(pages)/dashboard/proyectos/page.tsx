/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  getProjectsByStatus, 
} from '@/app/lib/data';
import ProjectsHeader from '@/components/proyectos/projectsheader';
import ProyectosSkeleton from '@/components/proyectos/ProyectosSkeleton';
import { 
  FiInfo, 
  FiUsers, 
  FiCalendar, 
  FiVideo,
  FiX,
  FiPlus,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiClock,
  FiUser,
  FiClipboard
} from 'react-icons/fi';

export default function ProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const modalRef = useRef<HTMLDivElement>(null);
  
  const activeProjects = getProjectsByStatus('active');

  // Cerrar el modal al hacer clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedProject(null);
      }
    };

    if (selectedProject) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedProject]);

  // Obtener el color adecuado para el proyecto
  const getProjectColor = (color: string) => {
    switch(color) {
      case 'emerald': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'accenture':
      default: return 'bg-[#A100FF]';
    }
  };

  const [loading, setLoading] = useState(true);
  //Use effect para simular la carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simula un retraso de 1.5 segundo para la carga
    return () => clearTimeout(timer);
  }, []);

  // If loading, show skeleton
  if (loading) {
    return <ProyectosSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      
        {/* Header simplificado con botones de cambio de vista integrados */}
        <ProjectsHeader 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Section */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          {activeProjects.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-medium mb-2">No hay proyectos activos</h2>
              <p className="text-gray-500 mb-6">
                Todos tus proyectos están actualmente archivados.
              </p>
            </div>
          ) : (
            
            viewMode === 'grid' ? (
              // Vista de grid
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProjects.map(project => {
                  const projectColor = getProjectColor(project.color);
                  
                  return (
                    <div 
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                    >
                      <div className={`${projectColor} p-4 rounded-t-xl`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-800">
                            Activo
                          </span>
                        </div>
                        <p className="text-sm text-white opacity-90">Cliente: {project.client}</p>
                      </div>
                      
                      <div className="p-5">
                        <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.description || 'Sin descripción'}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Cargabilidad</p>
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                              <p className="font-medium">{project.cargabilidad}%</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Fecha inicio</p>
                            <p className="font-medium">{new Date(project.startDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        
                        {/* Equipo del proyecto */}
                        <div className="flex -space-x-2 overflow-hidden">
                          {/* Mostrar avatars (4 máximo) */}
                          {[1, 2, 3].map((member, index) => (
                            <div key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white">
                              <img
                                src={`https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 10}.jpg`}
                                alt={`Usuario ${index + 1}`}
                                className="h-full w-full object-cover rounded-full"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                }}
                              />
                            </div>
                          ))}
                          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
                            +2
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Vista de lista
              <div className="space-y-4">
                {activeProjects.map(project => {
                  const projectColor = getProjectColor(project.color);
                  
                  return (
                    <div 
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300 overflow-hidden"
                    >
                      <div className={`${projectColor} p-4 rounded-t-xl`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-800">
                            Activo
                          </span>
                        </div>
                        <p className="text-sm text-white opacity-90">Cliente: {project.client}</p>
                      </div>
                      
                      <div className="p-5 flex items-center">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                          <div className="mt-4 flex justify-between">
                            <div>
                              <span className="text-sm text-gray-500 flex items-center">
                                Cargabilidad: 
                                <div className="flex items-center ml-1">
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></div>
                                  <b>{project.cargabilidad}%</b>
                                </div>
                              </span>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">
                                Fecha fin: <b>{new Date(project.endDate).toLocaleDateString('es-ES')}</b>
                              </span>
                            </div>
                          </div>
                          
                          {/* Team members */}
                          <div className="mt-3 flex -space-x-2 overflow-hidden">
                            {[1, 2, 3].map((member, index) => (
                              <div key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white">
                                <img
                                  src={`https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 10}.jpg`}
                                  alt={`Usuario ${index + 1}`}
                                  className="h-full w-full object-cover rounded-full"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                                  }}
                                />
                              </div>
                            ))}
                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
                              +2
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <FiChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Modal de detalle de proyecto (mejorado visualmente) */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-[2px]"
              onClick={() => setSelectedProject(null)}
            ></div>
            <div 
              ref={modalRef}
              className="bg-white rounded-xl shadow-xl max-w-4xl w-full relative overflow-hidden" 
              style={{
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              {/* Encabezado del modal con color del proyecto - Improved UI */}
              <div 
                className={`${getProjectColor(selectedProject.color)} p-6 rounded-t-xl relative overflow-hidden`}
                style={{
                  background: `linear-gradient(135deg, ${getProjectColor(selectedProject.color).replace('bg-', '')} 0%, ${getProjectColor(selectedProject.color).replace('bg-', '')}/80 100%)`,
                }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 -ml-10 -mb-10"></div>
                
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h1 className="text-2xl font-bold text-white">{selectedProject.name}</h1>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-green-800 shadow-sm">
                        Activo
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">Cliente: {selectedProject.client}</p>
                  </div>                    <button 
                    onClick={() => setSelectedProject(null)}
                    className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-all hover:rotate-90 duration-300 z-20 h-8 w-8 flex items-center justify-center"
                    aria-label="Cerrar ventana"
                  >
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-8">
                {/* Description section - Full width and scrollable */}
                <div className="mb-5">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A100FF20] to-[#A100FF30] flex items-center justify-center mr-3 shadow-sm">
                      <FiInfo className="h-5 w-5 text-[#A100FF]" />
                    </div>
                    Descripción del proyecto
                  </h2>
                  <div className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 max-h-[250px] overflow-y-auto">
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <p className="leading-relaxed">{selectedProject.description || "Sin descripción disponible."}</p>
                      <p className="mt-3 text-sm text-gray-500">Este proyecto se centra en desarrollar soluciones innovadoras para {selectedProject.client}, mejorando su presencia digital y eficiencia operativa.</p>
                    </div>
                  </div>
                </div>
                
                {/* Assigned team members */}
                <div className="mb-5">
                  <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F110] to-[#6366F130] flex items-center justify-center mr-3 shadow-sm">
                      <FiUsers className="h-5 w-5 text-[#6366F1]" />
                    </div>
                    Equipo asignado
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {/* Mock data for team members - Replace with actual data */}
                    {[1, 2, 3, 4].map(member => (
                      <div key={member} className="flex flex-col items-center group">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md group-hover:border-[#A100FF20] transition-all">
                            <img 
                              src={`https://randomuser.me/api/portraits/${member % 2 ? 'men' : 'women'}/${member + 10}.jpg`}
                              alt={`Miembro del equipo ${member}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-avatar.png';
                              }}
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <span className="text-xs text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Usuario {member}</span>
                      </div>
                    ))}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#A100FF10] border-2 border-dashed border-[#A100FF] flex items-center justify-center cursor-pointer hover:bg-[#A100FF20] transition-all">
                        <FiPlus className="h-5 w-5 text-[#A100FF]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two column layout for project details */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Columna izquierda */}
                  <div className="h-full flex flex-col">
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex-grow">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center pb-2 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10B98108] to-[#10B98120] flex items-center justify-center mr-3 shadow-sm">
                          <FiClipboard className="h-5 w-5 text-[#10B981]" />
                        </div>
                        Detalles del proyecto
                      </h2>
                      
                      <div className="space-y-6 text-sm">
                        {/* Enhanced Date Sections */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 rounded-lg px-2">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-4 shadow-sm">
                              <FiCalendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Fecha de inicio</span>
                              <p className="font-semibold text-gray-800">{new Date(selectedProject.startDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 hover:bg-gray-50 transition-all duration-300 rounded-lg px-2">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mr-4 shadow-sm">
                              <FiClock className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Fecha de fin</span>
                              <p className="font-semibold text-gray-800">{new Date(selectedProject.endDate).toLocaleDateString('es-ES', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}</p>
                              {/* Days remaining calculation */}
                              {(() => {
                                const today = new Date();
                                const endDate = new Date(selectedProject.endDate);
                                const diffTime = endDate.getTime() - today.getTime();
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                
                                if (diffDays > 0) {
                                  return (
                                    <span className="text-xs text-gray-500">
                                      Quedan {diffDays} días
                                    </span>
                                  );
                                } else if (diffDays === 0) {
                                  return <span className="text-xs text-orange-500 font-medium">¡Finaliza hoy!</span>;
                                } else {
                                  return null;
                                }
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        {/* Enhanced Cargabilidad with pulse animation */}
                        <div className="flex flex-col bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <div className="h-3 w-3 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                              <span className="text-gray-700 font-medium">Cargabilidad:</span>
                            </div>
                            <span className="font-bold text-green-600">{selectedProject.cargabilidad}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-inner transition-all duration-500" 
                              style={{ width: `${selectedProject.cargabilidad}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Columna derecha - Información del cliente - Enhanced design */}
                  <div className="h-full flex flex-col">
                    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex-grow">
                      <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center pb-2 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] flex items-center justify-center mr-3 shadow-sm">
                          <FiUser className="h-5 w-5 text-[#A100FF]" />
                        </div>
                        Información del cliente
                      </h2>
                      
                      <div className="flex items-center mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mr-4 overflow-hidden border-4 border-white shadow-md">
                          {selectedProject.url_logo ? (
                            <img 
                              src={`https://${selectedProject.url_logo}/favicon.ico`} 
                              alt={`Logo de ${selectedProject.client}`}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-company.png';
                              }}
                            />
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800 mb-1">{selectedProject.client}</h3>
                          <p className="text-sm text-gray-500 flex items-center">
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            Cliente activo
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 text-sm bg-white p-4 rounded-lg border border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2">Información de contacto</h4>
                        <div className="flex items-center text-gray-700 hover:text-[#A100FF] transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-[#A100FF08] flex items-center justify-center mr-3 group-hover:bg-[#A100FF15] transition-all">
                          <FiMail className="h-4 w-4 text-[#A100FF]" />
                          </div>
                          <span className="group-hover:font-medium">contacto@{selectedProject.client.toLowerCase().replace(/\s+/g, '')}.com</span>
                        </div>
                        <div className="flex items-center text-gray-700 hover:text-[#A100FF] transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-[#A100FF08] flex items-center justify-center mr-3 group-hover:bg-[#A100FF15] transition-all">
                          <FiPhone className="h-4 w-4 text-[#A100FF]" />
                          </div>
                          <span className="group-hover:font-medium">+34 91 XXX XX XX</span>
                        </div>
                        <div className="flex items-center text-gray-700 hover:text-[#A100FF] transition-colors group">
                          <div className="w-8 h-8 rounded-full bg-[#A100FF08] flex items-center justify-center mr-3 group-hover:bg-[#A100FF15] transition-all">
                          <FiMapPin className="h-4 w-4 text-[#A100FF]" />
                          </div>
                          <span className="group-hover:font-medium">Madrid, España</span>
                        </div>
                      </div>
                      
                      {selectedProject.url_logo && (
                        <div className="mt-5 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600 mb-2 font-medium">Sitio web del cliente:</p>
                          <a 
                            href={`https://${selectedProject.url_logo}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#A100FF] hover:text-[#8000CC] flex items-center p-3 rounded-lg border border-gray-100 bg-white hover:bg-[#A100FF08] transition-all group"
                          >
                            <div className="flex-1 truncate">
                              {selectedProject.url_logo}
                            </div>
                            <div className="ml-2 p-2 rounded-full bg-[#A100FF15] group-hover:bg-[#A100FF25] transition-all">
                              <FiExternalLink className="h-4 w-4 text-[#A100FF] group-hover:rotate-12 transition-all duration-300" />
                            </div>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Zoom Meeting Section - moved closer to project details */}
                <div className="mt-3 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                  <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center pb-2 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3 shadow-sm">
                      <FiVideo className="h-5 w-5 text-blue-600" />
                    </div>
                    Programar reunión de Zoom
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="date"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                          defaultValue="2025-05-25"
                          id="zoom-meeting-date"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="time"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                          defaultValue="10:00"
                          id="zoom-meeting-time"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duración</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <select
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                          defaultValue="60"
                          id="zoom-meeting-duration"
                        >
                          <option value="30">30 minutos</option>
                          <option value="60">1 hora</option>
                          <option value="90">1 hora 30 minutos</option>
                          <option value="120">2 horas</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Participantes</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                          placeholder="Añadir correos electrónicos separados por comas"
                          defaultValue={`${selectedProject.client.toLowerCase().replace(/\s+/g, '')}@email.com, equipo@kitsoft.com`}
                          id="zoom-meeting-participants"
                        />
                      </div>
                    </div>
                    
                    <div className="col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                          type="text"
                          className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 pr-12 sm:text-sm border-gray-300 rounded-md py-2 bg-white"
                          defaultValue={`Reunión: Proyecto ${selectedProject.name} - Actualización`}
                          id="zoom-meeting-subject"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-end items-center">
                    <button 
                      id="zoom-meeting-button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                      onClick={() => {
                        // Get the button
                        const button = document.getElementById('zoom-meeting-button');
                        
                        // Collect form data
                        const date = (document.getElementById('zoom-meeting-date') as HTMLInputElement).value;
                        const time = (document.getElementById('zoom-meeting-time') as HTMLInputElement).value;
                        const duration = (document.getElementById('zoom-meeting-duration') as HTMLSelectElement).value;
                        const participants = (document.getElementById('zoom-meeting-participants') as HTMLInputElement).value;
                        const subject = (document.getElementById('zoom-meeting-subject') as HTMLInputElement).value;
                        
                        // In a real app, we would send this data to a backend API
                        console.log('Scheduling Zoom meeting:', { date, time, duration, participants, subject });
                        
                        // Show success animation on the button
                        if (button) {
                          // Add success class for animation
                          button.classList.add('bg-green-600');
                          button.innerHTML = '<svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Procesando...';
                          
                          // After 1.5 seconds, show success check mark
                          setTimeout(() => {
                            button.classList.remove('bg-green-600');
                            button.classList.add('bg-green-600');
                            button.innerHTML = '<svg class="h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Reunión programada';
                            
                            // Reset button after 3 more seconds
                            setTimeout(() => {
                              button.classList.remove('bg-green-600');
                              button.innerHTML = '<svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Programar reunión';
                            }, 3000);
                          }, 1500);
                        }
                      }}
                    >
                      <FiClock className="h-4 w-4 mr-2" />
                      Programar reunión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}