'use client';

import { useState, useEffect } from 'react';
import { getProjectsByStatus } from '@/app/lib/data';

interface ArchivedProjectsHeaderProps {
  userName?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ArchivedProjectsHeader({ 
  userName = "Nombre de usuario", 
  viewMode = 'grid',
  onViewModeChange
}: ArchivedProjectsHeaderProps) {
  const [archivedCount, setArchivedCount] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [, setTotalTasks] = useState(0);
  const [avgTasksPerProject, setAvgTasksPerProject] = useState(0);
  
  useEffect(() => {
    // Obtener proyectos archivados
    const archivedProjects = getProjectsByStatus('archived');
    setArchivedCount(archivedProjects.length);
    
    // Contar tareas totales y completadas
    let tasksCompleted = 0;
    let tasksTotal = 0;
    
    archivedProjects.forEach(project => {
      if (project.tasks && Array.isArray(project.tasks)) {
        tasksTotal += project.tasks.length;
        tasksCompleted += project.tasks.filter(t => t.completed).length;
      }
    });
    
    setTotalTasks(tasksTotal);
    setCompletedTasks(tasksCompleted);
    
    // Calcular promedio de tareas por proyecto
    if (archivedProjects.length > 0) {
      // Usar toFixed(2) para obtener 2 decimales y convertirlo de nuevo a número
      const avg = tasksTotal / archivedProjects.length;
      setAvgTasksPerProject(Number(avg.toFixed(2)));
    }
  }, []);

  return (
    <div className="mb-6">
      {/* Header principal */}
      <div className="bg-white border border-gray-50 shadow-md rounded-t-xl p-4 md:p-6 text-white">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
            <div>
              <h1 className="text-xl font-bold text-black">Proyectos Archivados</h1>
              <p className="text-sm opacity-90 text-black">Historial de proyectos</p>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-lg font-medium mr-3 text-black">{userName}</span>
            <div className="bg-gray-50 border border-gray-100 px-4 py-2 rounded-md">
              <span className="text-lg font-semibold text-gray-800">{archivedCount} proyecto{archivedCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de botones y métricas */}
      <div className="bg-white rounded-b-xl shadow-md p-4 flex justify-between items-center border-t border-gray-100">
        <div>
          <span className="text-gray-700">Total de tareas completadas: <b>{completedTasks}</b> | Tareas promedio por proyecto: <b>{avgTasksPerProject}</b></span>
        </div>
        
        <div className="flex rounded-md overflow-hidden">
          <button 
            onClick={() => onViewModeChange && onViewModeChange('grid')}
            className={`flex items-center px-3 py-1.5 ${
              viewMode === 'grid' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => onViewModeChange && onViewModeChange('list')}
            className={`flex items-center px-3 py-1.5 ${
              viewMode === 'list' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}