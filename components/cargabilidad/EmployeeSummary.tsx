'use client';

import React from 'react';
import { FiPieChart, FiCheckCircle, FiClock, FiFileText } from 'react-icons/fi';
import { CircularProgress } from './CircularProgress';

interface Props {
  name: string;
  role: string;
  totalLoad: number;
  totalUsedHours: number;
  availableHours: number;
  totalHoursPerWeek: number;
  projects?: Array<{
    name: string;
    hours: number;
    color: string;
  }>;
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
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      {/* Header with slanted purple background */}
      <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 pt-6 pb-10">
        {/* SVG for diagonal cut */}
        <svg 
          className="absolute bottom-0 left-0 w-full text-white" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          
        </svg>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-6">
          <div className="text-white z-10">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>  
              Mi Cargabilidad
            </h1>
            <p className="mt-1 opacity-90 text-white">{name} - {role}</p>
          </div>

          {/* CircularProgress positioned to overlap the wave */}
          <div className="absolute right-6 md:right-10 top-16 md:top-8 z-10">
            <div className="bg-white rounded-full p-1 shadow-lg">
              <CircularProgress value={totalLoad} size="medium" />
            </div>
          </div>
        </div>
      </div>

      {/* Linear progress bar */}
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Distribución de horas ({totalUsedHours}/{totalHoursPerWeek}h)</h3>
        <div className="h-5 w-full bg-gray-100 rounded-full overflow-hidden">
          {projects.length > 0 ? (
            <div className="flex h-full">
              {projects.map((project, index) => {
                const widthPercentage = (project.hours / totalHoursPerWeek) * 100;
                return (
                  <div
                    key={index}
                    className={`h-full bg-${project.color}-500`}
                    style={{ width: `${widthPercentage}%` }}
                    title={`${project.name}: ${project.hours}h (${widthPercentage.toFixed(1)}%)`}
                  />
                );
              })}
            </div>
          ) : (
            <div 
              className="h-full bg-purple-500" 
              style={{ width: `${(totalUsedHours / totalHoursPerWeek) * 100}%` }}
            />
          )}
        </div>
        <div className="flex justify-end mt-1">
          <p className="text-xs text-gray-500">
            {availableHours >= 0 ? 
              `${availableHours}h disponibles` : 
              `${Math.abs(availableHours)}h excedidas`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
        <SummaryItem 
          icon={<div className='bg-purple-100 p-2 rounded-xl shadow-md'><FiPieChart className='text-purple-600'/></div>} 
          title="Carga Total" 
          value={`${totalLoad.toFixed(1)}%`} 
          color="purple" 
        />
        <SummaryItem 
          icon={<div className='bg-blue-100 p-2 rounded-xl shadow-md'><FiClock className='text-blue-600'/></div>} 
          title="Horas Asignadas" 
          value={`${totalUsedHours} de ${totalHoursPerWeek}h`} 
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