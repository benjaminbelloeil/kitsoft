'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FiBarChart2, FiClock } from 'react-icons/fi';
import { getProjectHexColor } from '../proyectos/utils/projectUtils';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface ProjectInfo {
  name: string;
  hours?: number;
  hoursPerWeek?: number;
  color?: string | null;
  load?: number;
  deadline?: string;
  id?: string; // Project ID for consistent color generation
  id_proyecto?: string; // For cargabilidad compatibility
}

export interface HeaderCardProps {
  name?: string;
  position?: string;
  projects?: ProjectInfo[];
  totalHours?: number;
  assignedHours?: number;
  totalLoad?: number;
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const utilLabel = (u: number) =>
  u >= 90 ? 'Sobrecargado' : u >= 70 ? 'Nivel óptimo' : 'Baja ocupación';

const utilColor = (u: number) =>
  u >= 90 ? 'text-rose-600' : u >= 70 ? 'text-emerald-600' : 'text-amber-600';

const utilBgColor = (u: number) =>
  u >= 90
    ? 'bg-rose-200/30 border border-rose-200/50'
    : u >= 70
    ? 'bg-emerald-200/30 border border-emerald-200/50'
    : 'bg-amber-200/30 border border-amber-200/50';

const utilBarColor = (u: number) =>
  u >= 90 ? '#F43F5E' : u >= 70 ? '#10B981' : '#F59E0B';

const projectHours = (p: ProjectInfo) => p.hours ?? p.hoursPerWeek ?? 0;

// -----------------------------------------------------------------------------
// HEADER CARD COMPONENT
// -----------------------------------------------------------------------------
export function HeaderCard({ projects = [], totalHours = 40, assignedHours, totalLoad }: HeaderCardProps) {
  const calculatedTotalLoad = totalLoad ?? Math.min(100, (assignedHours ?? 0) / totalHours * 100);
  const availableHours = Math.max(totalHours - (assignedHours ?? 0), 0);

  return (
    <div className='rounded-xl shadow-sm border border-gray-100 bg-white'>
      <div className="border-b border-gray-200 p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
                <FiBarChart2 size={24} className="text-[#A100FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Mi Cargabilidad
                </h1>
                <p className="text-sm text-gray-600 mt-2 max-w-xl">
                  Visualiza y gestiona tu cargabilidad por proyectos. Equilibra tus horas de trabajo para un rendimiento óptimo.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <p className={`text-sm font-medium ${utilColor(calculatedTotalLoad)}`}>
                {utilLabel(calculatedTotalLoad)}
              </p>
              <div
                className={`relative w-20 h-20 ${utilBgColor(calculatedTotalLoad)} rounded-full flex items-center justify-center shadow-sm border border-gray-100`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[{ value: calculatedTotalLoad }, { value: 100 - calculatedTotalLoad }]}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius={22}
                      outerRadius={30}
                      stroke="transparent"
                      cornerRadius={4}
                    >
                      <Cell fill={utilBarColor(calculatedTotalLoad)} />
                      <Cell fill="#E5E7EB" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="absolute inset-0 flex items-center justify-center text-md font-bold">
                  {Math.round(calculatedTotalLoad)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly distribution section */}
      <div className="overflow-hidden transition-all duration-300">
        <div className="p-4">
          {/* Progress bar visualization of weekly hours */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#A100FF08] flex items-center justify-center">
                  <FiClock className="h-4 w-4 text-[#A100FF]" />
                </div>
                <span className="text-sm font-medium text-gray-700">Distribución Semanal</span>
              </div>
              <span className="text-sm text-gray-500">{assignedHours ?? 0}h / {totalHours}h</span>
            </div>
            
            <div className="h-8 w-full flex overflow-hidden rounded-lg shadow-sm">
              {projects.map((project) => {
                const hoursPerWeek = projectHours(project);
                const w = `${(hoursPerWeek / totalHours) * 100}%`;
                const projectColor = getProjectHexColor(project.color, project.id_proyecto || project.id || project.name);
                return (
                  <div
                    key={project.name}
                    className="flex items-center justify-center relative group"
                    style={{ 
                      width: w, 
                      backgroundColor: projectColor
                    }}
                  >
                    <span className="text-[10px] font-semibold text-white truncate px-2">
                      {hoursPerWeek}h
                    </span>
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                      {project.name}: {hoursPerWeek}h
                    </div>
                  </div>
                );
              })}
              {availableHours > 0 && (
                <div
                  style={{ width: `${(availableHours / totalHours) * 100}%` }}
                  className="bg-gray-200 flex items-center justify-center relative group"
                >
                  <span className="text-[10px] font-semibold text-gray-700 truncate px-2">
                    {availableHours}h
                  </span>
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                    Disponible: {availableHours}h
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Status pills row */}
          <div className="flex flex-wrap items-center mt-4 gap-2">
            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
              availableHours <= 0 
                ? 'bg-red-50 text-red-700 border border-red-100' 
                : availableHours < 8 
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              <span className="font-medium mr-1">
                {availableHours <= 0 
                  ? `Sobrecarga: ${Math.abs(availableHours)}h` 
                  : `Disponible: ${availableHours}h`}
              </span>
            </div>
            
            {projects.map((project) => {
              const projectColor = getProjectHexColor(project.color, project.id_proyecto || project.id || project.name);
              return (
                <div key={project.name} className="inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 border border-gray-100 shadow-sm">
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: projectColor }}
                  ></div>
                  <span className="text-xs font-medium text-gray-700">{project.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Exportamos HeaderCard como componente principal y con alias para compatibilidad
export const EmployeeSummary = HeaderCard;
export default HeaderCard;
