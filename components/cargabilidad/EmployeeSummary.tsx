'use client';

import React, { useEffect, useState } from 'react';
import { FiPieChart, FiCheckCircle, FiClock } from 'react-icons/fi';
import { CircularProgress } from './CircularProgress';

interface Project {
  name: string;
  load?: number;
  deadline?: string;
  hoursPerWeek: number;
  color: string; // Color ya viene asignado desde page.tsx
}

interface Props {
  name: string;
  role: string;
  totalLoad: number;
  totalUsedHours: number;
  availableHours: number;
  totalHoursPerWeek: number;
  projects: Project[];
}

export const EmployeeSummary = ({
  name,
  role,
  totalLoad,
  totalUsedHours,
  availableHours,
  totalHoursPerWeek,
  projects = []
}: Props) => {
  const availableRatio = availableHours / totalHoursPerWeek;
  
  // Estado para controlar la animación de carga
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Simular un tiempo de carga
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    // Animación de entrada
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => {
      clearTimeout(loadingTimer);
      clearTimeout(visibilityTimer);
    };
  }, []);

  return (
    <div className={`bg-white border border-gray-100  rounded-xl shadow-md overflow-hidden mb-6 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header with slanted purple background */}
      <div className="h-20 relative border-b border-gray-300 underline-color-black rounded-t-xl">
        {/* SVG for diagonal cut */}
        <svg 
          className="absolute bottom-0 left-0 w-full text-black" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6">
          <div className="text-white z-10">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-black">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>  
              Mi Cargabilidad
            </h1>
            <p className="mt-1 opacity-90 text-black">{name} - {role}</p>
          </div>

          {/* CircularProgress positioned to overlap the wave */}
          <div className="absolute right-6 md:right-10 top-16 md:top-4 z-10">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <CircularProgress value={totalLoad} size="small" />
            </div>
          </div>
        </div>
      </div>

      {/* Linear progress bar with project divisions */}
      <div className="px-6 pt-6 pb-2">
        {isLoading ? (
          // Barra de carga animada
          <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200">
            <div className="h-full bg-gray-300 animate-pulse"></div>
          </div>
        ) : (
          // Barra con proyectos - usando los colores asignados en page.tsx
          <div className="w-full h-6 rounded-full overflow-hidden bg-gray-200 flex text-white text-xs font-medium">
            {/* Proyectos con sus colores asignados */}
            {projects.map((project, index) => {
              const projectRatio = project.hoursPerWeek / totalHoursPerWeek;
              return (
                <div
                  key={index}
                  className={`flex items-center justify-center h-full ${project.color} transition-all duration-700 ease-out`}
                  style={{ 
                    width: `${projectRatio * 100}%`,
                    transitionDelay: `${index * 150}ms`,
                    transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                    transformOrigin: 'left'
                  }}
                >
                  {projectRatio > 0.1 && (
                    <span className="px-2 truncate text-white">{project.hoursPerWeek}h carga</span>
                  )}
                </div>
              );
            })}

            {/* Horas disponibles */}
            {availableHours > 0 && (
              <div
                className="flex items-center justify-center h-full bg-gray-100 transition-all duration-700 ease-out"
                style={{ 
                  width: `${(availableHours / totalHoursPerWeek) * 100}%`,
                  transitionDelay: `${projects.length * 150}ms`,
                  transform: isVisible ? 'scaleX(1)' : 'scaleX(0)',
                  transformOrigin: 'left'
                }}
              >
                {availableRatio > 0.075 && (
                  <span className="px-2 truncate text-gray-800">{availableHours}h disponibles</span>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className='relative'>
          <p className="absolute left-1/2 -translate-x-1/2 mt-1 text-xs text-gray-500">         
            {(totalUsedHours / totalHoursPerWeek * 100).toFixed(1)}% de cargabilidad semanal        
          </p>
          {availableRatio <= 0.075 && (
            <span className="absolute right-0 mt-1 mr-1 text-xs text-gray-500"> 
              {availableHours}h disponibles
            </span>
          )}
        </div>
      </div>

      {/* Leyenda de proyectos */}
      <div className="px-6 pt-2 pb-2">
        <div className="flex flex-wrap gap-3">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-1 ${project.color}`}></div>
              <span className="text-xs text-gray-600">{project.name} ({project.hoursPerWeek}h)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-3">
        <SummaryItem 
          icon={<div className='bg-purple-100 p-2 rounded-xl shadow-md'><FiPieChart className='text-purple-600'/></div>} 
          title="Carga Total" 
          value={`${totalLoad.toFixed(1)}%`} 
          color="purple" 
        />
        <SummaryItem 
          icon={<div className='bg-blue-100 p-2 rounded-xl shadow-md'><FiClock className='text-blue-600'/></div>} 
          title="Horas Asignadas" 
          value={`${totalUsedHours}h de ${totalHoursPerWeek}h`} 
          color="blue" 
        />
        <SummaryItem 
          icon={
            <div className={`${availableHours >= 0 ? 'bg-green-100' : 'bg-red-100'} p-2 rounded-xl shadow-md`}>
              <FiCheckCircle className={availableHours >= 0 ? 'text-green-600' : 'text-red-600'} />
            </div>
          } 
          title="Horas Disponibles" 
          value={`${Math.abs(availableHours)}h ${availableHours >= 0 ? 'disponibles' : 'excedidas'}`} 
          color={availableHours >= 0 ? 'green' : 'red'} 
        />
      </div>
    </div>
  );
};

const SummaryItem = ({ icon, title, value, color }: { icon: React.ReactNode; title: string; value: string; color: string }) => {
  const colorClasses = {
    purple: 'bg-purple-50',
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    red: 'bg-red-50'
  };

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} p-4 rounded-lg flex items-center gap-3`}>
      <div>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
};