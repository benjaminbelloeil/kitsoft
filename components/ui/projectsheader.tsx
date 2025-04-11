'use client';

import { useState, useEffect } from 'react';
import { getProjectsByStatus } from '@/app/lib/data';

interface ProjectsHeaderProps {
  userName?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ProjectsHeader({ 
  userName = "Nombre de usuario", 
  viewMode = 'grid',
  onViewModeChange
}: ProjectsHeaderProps) {
  // Estados para las métricas
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    completionRate: 0,
    pendingTasks: 0,
    averageCarga: 0
  });
  
  // Cargar datos al inicializar el componente
  useEffect(() => {
    calculateMetrics();
  }, []);
  
  // Función para calcular todas las métricas
  const calculateMetrics = () => {
    const activeProjects = getProjectsByStatus('active');
    
    // Valores iniciales
    let totalTasks = 0;
    let completedTasks = 0;
    let pendingTasks = 0;
    let totalCarga = 0;
    
    // Obtener la fecha actual y la de una semana después
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Procesar cada proyecto
    activeProjects.forEach(project => {
      // Conteo de tareas
      if (project.tasks && Array.isArray(project.tasks)) {
        const projectTasks = project.tasks;
        totalTasks += projectTasks.length;
        
        // Tareas completadas
        const completed = projectTasks.filter(t => t.completed).length;
        completedTasks += completed;
        
        // Tareas pendientes que vencen pronto
        const pendingCloseTasks = projectTasks.filter(task => {
          if (task.completed) return false;
          
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        });
        
        pendingTasks += pendingCloseTasks.length;
      }
      
      // Cargabilidad
      if (typeof project.cargabilidad === 'number') {
        totalCarga += project.cargabilidad;
      }
    });
    
    // Calcular porcentajes y promedios
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;
      
    const averageCarga = activeProjects.length > 0 
      ? Math.round(totalCarga / activeProjects.length) 
      : 0;
    
    // Actualizar el estado con todas las métricas
    setMetrics({
      totalTasks,
      completedTasks,
      completionRate,
      pendingTasks,
      averageCarga
    });
  };
  
  // Desestructurar métricas para facilitar su uso
  const { totalTasks, completedTasks, completionRate, pendingTasks, averageCarga } = metrics;

  return (
    <div className="mb-6">
      {/* Sección superior del header */}
      <div className="bg-[#A100FF] rounded-t-xl p-4 md:p-6 text-white flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Proyectos Activos</h1>
            <p className="text-sm opacity-90">Resumen de métricas</p>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-4 text-lg font-medium">{userName}</span>
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="rgba(255,255,255,0.2)" 
                strokeWidth="10"
              />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#00E676" 
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45 * completionRate / 100} ${2 * Math.PI * 45 * (100 - completionRate) / 100}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-white">
              {completionRate}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección inferior con métricas */}
      <div className="bg-white rounded-b-xl shadow-md p-4 flex flex-col md:flex-row justify-between border-t border-gray-100">
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm mb-1">Tareas Completadas</p>
          <div className="flex items-center">
            <span className="text-xl font-bold mr-2">{completedTasks}/{totalTasks}</span>
            <span className="text-sm bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md">
              {completionRate}%
            </span>
          </div>
        </div>
        
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm mb-1">Vencimientos próximos</p>
          <span className="text-xl font-bold">{pendingTasks} tarea{pendingTasks !== 1 ? 's' : ''}</span>
        </div>
        
        <div className="mb-4 md:mb-0">
          <p className="text-gray-500 text-sm mb-1">Cargabilidad media</p>
          <span className="text-xl font-bold">{averageCarga}%</span>
        </div>
        
        <div className="flex justify-end items-center">
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
    </div>
  );
}