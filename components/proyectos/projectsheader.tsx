'use client';

import { useState, useEffect } from 'react';
import { getProjectsByStatus } from '@/app/lib/data';
import { FiFolder, FiGrid, FiList } from 'react-icons/fi';

interface ProjectsHeaderProps {
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ProjectsHeader({ 
  viewMode = 'grid',
  onViewModeChange
}: ProjectsHeaderProps) {
  // Estados para las métricas
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    nearEndDate: 0
  });
  
  // Cargar datos al inicializar el componente
  useEffect(() => {
    calculateMetrics();
  }, []);
  
  // Función para calcular todas las métricas
  const calculateMetrics = async () => {
    try {
      // Fetch actual active projects from API instead of static data
      const response = await fetch('/api/user/proyectos?status=active');
      if (!response.ok) {
        console.error('Failed to fetch active projects for count');
        return;
      }
      
      const activeProjects = await response.json();
      
      // Obtener la fecha actual y la de 30 días en adelante
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endingSoon = new Date(today);
      endingSoon.setDate(today.getDate() + 30);
      
      // Calcular métricas
      let projectsEndingSoon = 0;
      
      // Procesar cada proyecto (adapt to API response structure)
      activeProjects.forEach((projectAssignment: { proyectos: { fecha_fin?: string } }) => {
        const project = projectAssignment.proyectos;
        // Proyectos que terminan pronto
        if (project?.fecha_fin) {
          const endDate = new Date(project.fecha_fin);
          if (endDate >= today && endDate <= endingSoon) {
            projectsEndingSoon++;
          }
        }
      });
      
      // Actualizar el estado con todas las métricas
      setMetrics({
        totalProjects: activeProjects.length,
        nearEndDate: projectsEndingSoon
      });
    } catch (error) {
      console.error('Error fetching active projects count:', error);
      // Fallback to static data if API fails
      const activeProjects = getProjectsByStatus('active');
      setMetrics({
        totalProjects: activeProjects.length,
        nearEndDate: 0
      });
    }
  };
  
  // Desestructurar métricas para facilitar su uso
  const { totalProjects } = metrics;

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Header card with white background and simpler styling - matching retroalimentacion */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
                <FiFolder className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Proyectos
                  <span className="ml-2 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full inline-flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {totalProjects} Activos
                  </span>
                </h1>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Portal centralizado para empleados donde pueden ver y gestionar sus proyectos asignados, revisar detalles e interactuar con su equipo.
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* View mode buttons with updated styling */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => onViewModeChange && onViewModeChange('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#A100FF] shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                  aria-label="Vista en cuadrícula"
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onViewModeChange && onViewModeChange('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#A100FF] shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                  aria-label="Vista en lista"
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}