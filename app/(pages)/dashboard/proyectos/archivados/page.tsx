/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { userData } from "@/app/lib/data";
import { useState, useEffect, useRef } from 'react';
import {
  getProjectsByStatus,
  calculateProjectProgress,
} from '@/app/lib/data';
import ArchivedProjectsHeader from '@/components/proyectos/archivados/archivedprojectsheader';
import ArchivedProjectsSkeleton from '@/components/proyectos/archivados/ArchivedPSkeleton';

export default function ArchivedProjectsPage() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const modalRef = useRef<HTMLDivElement>(null);

  const archivedProjects = getProjectsByStatus('archived');

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

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Simula un retraso de 1.5 segundo
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ArchivedProjectsSkeleton/>
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header simplificado */}
        <ArchivedProjectsHeader 
          userName={userData.name} 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Content Section */}
        {archivedProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-2">No hay proyectos archivados</h2>
            <p className="text-gray-500 mb-6">
              No has archivado ningún proyecto todavía.
            </p>
          </div>
        ) : (
          viewMode === 'grid' ? (
            // Vista de grid
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {archivedProjects.map(project => {
                const progress = calculateProjectProgress(project.id);
                const completedTasks = project.tasks.filter(t => t.completed).length;
                const totalTasks = project.tasks.length;
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
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                          Archivado
                        </span>
                      </div>
                      <p className="text-sm text-white opacity-90">{project.client}</p>
                    </div>

                    <div className="p-5">
                      <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.description}</p>

                      <div className="relative w-full h-24 flex flex-col justify-center">
                        <div className="absolute left-0 w-16 h-16">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="#E6E6E6" strokeWidth="10" />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={
                                project.color === 'emerald' ? '#10B981' : 
                                project.color === 'blue' ? '#3B82F6' : 
                                project.color === 'purple' ? '#A855F7' : 
                                '#A100FF'
                              }
                              strokeWidth="10"
                              strokeDasharray={`${2 * Math.PI * 45 * progress / 100} ${2 * Math.PI * 45 * (100 - progress) / 100}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                            {progress}%
                          </div>
                        </div>
                        
                        <div className="ml-20">
                          <p className="text-sm text-gray-500 mb-1">Tareas completadas</p>
                          <p className="font-medium">{completedTasks}/{totalTasks}</p>
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
              {archivedProjects.map(project => {
                const progress = calculateProjectProgress(project.id);
                const completedTasks = project.tasks.filter(t => t.completed).length;
                const totalTasks = project.tasks.length;
                const projectColor = getProjectColor(project.color);

                return (
                  <div
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all overflow-hidden"
                  >
                    <div className={`${projectColor} p-4 rounded-t-xl`}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-gray-800">
                          Archivado
                        </span>
                      </div>
                      <p className="text-sm text-white opacity-90">{project.client}</p>
                    </div>

                    <div className="p-5 flex items-center">
                      <div className="relative w-16 h-16 flex-shrink-0 mr-6">
                        <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="#E6E6E6" strokeWidth="10" />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke={
                              project.color === 'emerald' ? '#10B981' : 
                              project.color === 'blue' ? '#3B82F6' : 
                              project.color === 'purple' ? '#A855F7' : 
                              '#A100FF'
                            }
                            strokeWidth="10"
                            strokeDasharray={`${2 * Math.PI * 45 * progress / 100} ${2 * Math.PI * 45 * (100 - progress) / 100}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                          {progress}%
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                        <div className="mt-2">
                          <span className="text-sm text-gray-500">
                            Tareas completadas: {completedTasks}/{totalTasks}
                          </span>
                        </div>
                      </div>

                      <div className="ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

        {/* Modal de detalle de proyecto */}
        {selectedProject && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div 
              ref={modalRef}
              className="bg-white rounded-xl shadow-xl max-w-2xl w-full" 
              style={{
                maxHeight: '85vh',
                overflowY: 'auto',
              }}
            >
              <div className="p-6 border-b bg-white sticky top-0 z-10">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-500 hover:text-[#A100FF] transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div>
                    <span className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800">
                      Archivado
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h1 className="text-2xl font-bold">{selectedProject.name}</h1>
                  <p className="text-gray-600">{selectedProject.client}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                  <p className="text-gray-700">{selectedProject.description}</p>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold">Tareas</h2>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke="#E6E6E6" 
                          strokeWidth="10"
                        />
                        <circle 
                          cx="50" cy="50" r="45" 
                          fill="none" 
                          stroke={calculateProjectProgress(selectedProject.id) > 50 ? "#00C853" : "#A100FF"} 
                          strokeWidth="10"
                          strokeDasharray={`${2 * Math.PI * 45 * calculateProjectProgress(selectedProject.id) / 100} ${2 * Math.PI * 45 * (100 - calculateProjectProgress(selectedProject.id)) / 100}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-bold">
                        {calculateProjectProgress(selectedProject.id)}%
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Tareas completadas</p>
                      <p className="text-lg font-semibold">
                        {selectedProject.tasks.filter((t: any) => t.completed).length}/{selectedProject.tasks.length}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedProject.tasks.map((task: any) => (
                      <div 
                        key={task.id} 
                        className="border border-gray-200 rounded-lg p-4 mb-3 hover:border-gray-300 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className={`mt-0.5 w-5 h-5 rounded-full flex-shrink-0 mr-3 flex items-center justify-center ${
                            task.completed ? 'bg-green-500' : 'border-2 border-gray-300'
                          }`}>
                            {task.completed && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                {task.name}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {new Date(task.dueDate).toLocaleDateString('es-ES')}
                              </span>
                            </div>
                            {task.description && (
                              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
                            )}
                            {task.assignedTo && (
                              <p className="mt-2 text-xs text-gray-500">
                                Asignado a: {task.assignedTo}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold">Detalles del proyecto</h2>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Cargabilidad:</span>
                      <span className="font-semibold">{selectedProject.cargabilidad}%</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Fecha de inicio:</span>
                      <span className="font-semibold">{new Date(selectedProject.startDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span className="text-gray-600">Fecha de fin:</span>
                      <span className="font-semibold">{new Date(selectedProject.endDate).toLocaleDateString('es-ES')}</span>
                    </div>
                    {selectedProject.archivedDate && (
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-gray-600">Fecha de archivado:</span>
                        <span className="font-semibold">{new Date(selectedProject.archivedDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}