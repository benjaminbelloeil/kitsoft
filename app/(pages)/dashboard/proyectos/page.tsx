// app/dashboard/proyectos/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  getProjectsByStatus, 
  calculateProjectProgress, 
  colorClasses 
} from '@/app/lib/data';

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

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold">Proyectos Activos</h1>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => setViewMode('grid')}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === 'grid' ? 'bg-[#A100FF] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Grid
          </button>
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center px-3 py-1.5 rounded-md ${
              viewMode === 'list' ? 'bg-[#A100FF] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Lista
          </button>
        </div>
      </div>

      {activeProjects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
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
              const progress = calculateProjectProgress(project.id);
              const projectColorClasses = colorClasses[project.color] || colorClasses.accenture;
              
              return (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className={`bg-white border rounded-lg shadow-sm overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-md ${projectColorClasses.border}`}
                >
                  <div className={`h-1 ${projectColorClasses.bg}`}></div>
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold">{project.name}</h3>
                      <p className="text-sm text-gray-600">{project.client}</p>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-4 line-clamp-2">{project.description}</p>
                    
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${projectColorClasses.bg}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end items-center">
                      <div className="flex">
                        <span className="text-xs text-gray-500">
                          {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tareas
                        </span>
                      </div>
                      <div className="ml-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
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
              const progress = calculateProjectProgress(project.id);
              const projectColorClasses = colorClasses[project.color] || colorClasses.accenture;
              
              return (
                <div 
                  key={project.id}
                  onClick={() => setSelectedProject(project)}
                  className="bg-white border rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-4 flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      {/* Eliminado el div que creaba la línea morada */}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.client}</p>
                        </div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Activo
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-700 line-clamp-1">{project.description}</p>
                      <div className="mt-2 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className={`h-2 rounded-full ${projectColorClasses.bg}`}
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">{progress}%</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {project.tasks.filter(t => t.completed).length}/{project.tasks.length} tareas
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

      {/* Modal de detalle de proyecto - SIMPLIFICADO Y FORZADO A SER SCROLLABLE */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
             style={{ backdropFilter: 'blur(1px)' }}>
          <div 
            ref={modalRef}
            className="bg-white rounded-lg shadow-lg" 
            style={{
              width: '600px',
              maxHeight: '85vh',
              overflowY: 'auto',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            <div className="p-6 border-b bg-white sticky top-0">
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
                  <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                    Activo
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
              
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Tareas</h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Progreso:</span>
                    <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
                      <div 
                        className={`h-2.5 rounded-full ${colorClasses[selectedProject.color]?.bg || colorClasses.accenture.bg}`}
                        style={{ width: `${calculateProjectProgress(selectedProject.id)}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{calculateProjectProgress(selectedProject.id)}%</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {selectedProject.tasks.map((task: any) => (
                    <div 
                      key={task.id} 
                      className="border rounded-lg p-4 mb-3"
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
              
              <div className="mt-8 pt-6 border-t">
                <h2 className="text-xl font-semibold mb-4">Detalles del proyecto</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cargabilidad:</span>
                    <span className="font-semibold">{selectedProject.cargabilidad}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de inicio:</span>
                    <span className="font-semibold">{new Date(selectedProject.startDate).toLocaleDateString('es-ES')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de fin:</span>
                    <span className="font-semibold">{new Date(selectedProject.endDate).toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}