/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/user-context';
import ArchivedProjectsHeader from '@/components/proyectos/archivados/ArchiveProjectsHeader';
import ArchivedProjectsSkeleton from '@/components/proyectos/archivados/ArchivedSkeleton';
import EmptyArchivedProjectsState from '@/components/proyectos/EmptyArchivedProjectsState';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';
import { 
  FiInfo, 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiX,
  FiChevronRight,
  FiMail,
  FiPhone,
  FiMapPin,
  FiExternalLink,
  FiUser,
  FiClipboard
} from 'react-icons/fi';

export default function ArchivedProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [archivedProjects, setArchivedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  // Fetch user's archived projects
  useEffect(() => {
    const fetchArchivedProjects = async () => {
      try {
        const response = await fetch('/api/user/proyectos?status=archived');
        if (response.ok) {
          const data = await response.json();
          setArchivedProjects(data);
        } else {
          console.error('Failed to fetch archived projects');
        }
      } catch (error) {
        console.error('Error fetching archived projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedProjects();
  }, []);

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

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : 'unset';
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

  if (loading) {
    return <ArchivedProjectsSkeleton/>
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="min-h-screen bg-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header simplificado con botones de cambio de vista integrados */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <ArchivedProjectsHeader 
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </motion.div>

        {/* Content Section */}
        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Content Section */}
          {archivedProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <EmptyArchivedProjectsState />
            </motion.div>
          ) : (
            viewMode === 'grid' ? (
              // Vista de grid
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {archivedProjects.map((project, index) => {
                  const projectColor = getProjectColor(project.color);

                  return (
                    <motion.div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      whileHover={{ y: -8, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className={`${projectColor} p-4 rounded-t-xl`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                            Archivado
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
                            <p className="text-sm text-gray-500 mb-1">Fecha fin</p>
                            <p className="font-medium">{new Date(project.endDate).toLocaleDateString('es-ES')}</p>
                          </div>
                        </div>
                        
                        {/* Equipo del proyecto */}
                        <div className="flex -space-x-2 overflow-hidden">
                          {/* Mostrar avatars (4 máximo) */}
                          {[1, 2, 3].map((member, index) => (
                            <div key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white relative">
                              <img
                                src={`https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 10}.jpg`}
                                alt={`Usuario ${index + 1}`}
                                className="h-full w-full object-cover rounded-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const placeholder = target.parentElement?.querySelector('.placeholder-avatar');
                                  if (placeholder) (placeholder as HTMLElement).style.display = 'block';
                                }}
                              />
                              <div className="placeholder-avatar absolute inset-0 hidden">
                                <PlaceholderAvatar size={28} />
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
                            +2
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              // Vista de lista
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {archivedProjects.map((project, index) => {
                  const projectColor = getProjectColor(project.color);
                  
                  return (
                    <motion.div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300 overflow-hidden"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                      whileHover={{ y: -4, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div className={`${projectColor} p-4 rounded-t-xl`}>
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                            Archivado
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
                              <div key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white relative">
                                <img
                                  src={`https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 10}.jpg`}
                                  alt={`Usuario ${index + 1}`}
                                  className="h-full w-full object-cover rounded-full"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const placeholder = target.parentElement?.querySelector('.placeholder-avatar');
                                    if (placeholder) (placeholder as HTMLElement).style.display = 'block';
                                  }}
                                />
                                <div className="placeholder-avatar absolute inset-0 hidden">
                                  <PlaceholderAvatar size={28} />
                                </div>
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
                    </motion.div>
                  );
                })}
              </motion.div>
            )
          )}
        </motion.div>

        {/* Modal de detalle de proyecto archivado (mejorado visualmente) */}
        {selectedProject && (
          <AnimatePresence>
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="fixed inset-0 bg-gradient-to-br from-gray-900/40 to-black/60 backdrop-blur-[2px]"
                onClick={() => setSelectedProject(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div 
                ref={modalRef}
                className="bg-white rounded-xl shadow-xl max-w-4xl w-full relative overflow-hidden" 
                style={{
                  maxHeight: '85vh',
                  overflowY: 'auto',
                }}
                initial={{ opacity: 0, scale: 0.9, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 50 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* ...existing modal content... */}
                <motion.div 
                  className={`${getProjectColor(selectedProject.color)} p-6 rounded-t-xl relative overflow-hidden`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 -mr-20 -mt-20"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/10 -ml-10 -mb-10"></div>
                  
                  <div className="relative z-10 flex justify-between items-center">
                    <div>
                      <div className="flex items-center space-x-3 mb-1">
                        <h1 className="text-2xl font-bold text-white">{selectedProject.name}</h1>
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                          Archivado
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">Cliente: {selectedProject.client}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedProject(null)}
                      className="text-white bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-all hover:rotate-90 duration-300 z-20 h-8 w-8 flex items-center justify-center"
                      aria-label="Cerrar ventana"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
                
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
                        <p className="mt-3 text-sm text-gray-500">Este proyecto se centró en desarrollar soluciones innovadoras para {selectedProject.client}, mejorando su presencia digital y eficiencia operativa.</p>
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
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md group-hover:border-[#A100FF20] transition-all relative">
                              <img 
                                src={`https://randomuser.me/api/portraits/${member % 2 ? 'men' : 'women'}/${member + 10}.jpg`}
                                alt={`Miembro del equipo ${member}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const placeholder = target.parentElement?.querySelector('.placeholder-avatar');
                                  if (placeholder) (placeholder as HTMLElement).style.display = 'block';
                                }}
                              />
                              <div className="placeholder-avatar absolute inset-0 hidden">
                                <PlaceholderAvatar size={48} />
                              </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-500 rounded-full border-2 border-white"></div>
                          </div>
                          <span className="text-xs text-gray-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Usuario {member}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Two column layout for project details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Project details... */}
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
                              </div>
                            </div>
                          </div>
                          
                          {selectedProject.archivedDate && (
                            <div className="flex items-center justify-between py-3 hover:bg-gray-50 transition-all duration-300 rounded-lg px-2 bg-gray-50/70">
                              <div className="flex items-center">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mr-4 shadow-sm">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs">Fecha de archivado</span>
                                  <p className="font-semibold text-gray-800">{new Date(selectedProject.archivedDate).toLocaleDateString('es-ES', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {/* Enhanced Cargabilidad with pulse animation */}
                          <div className="flex flex-col bg-gradient-to-r from-green-50 to-transparent p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
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
                    
                    {/* Client information */}
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
                              <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                              Cliente archivado
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
                  
                  {/* Zoom Meeting Section for archived projects */}
                  <div className="mt-3 bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center pb-2 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      Reuniones de Zoom anteriores
                    </h2>
                    
                    <div className="p-4 border border-gray-100 rounded-md bg-gray-50 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        No se pueden programar nuevas reuniones para proyectos archivados. Para programar una reunión, restaure el proyecto.
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 border border-gray-100 rounded-md bg-white hover:bg-gray-50 transition-all">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">Reunión de cierre de proyecto</p>
                            <p className="text-xs text-gray-500">{new Date(selectedProject.archivedDate).toLocaleDateString('es-ES')} - 60 min</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600">Finalizada</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
