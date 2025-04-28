/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { DashboardTab } from '@/components/cargabilidad/DashboardTab';
import { HistoryTab } from '@/components/cargabilidad/RecordTab';
import { LoadAlert } from '@/components/cargabilidad/LoadAlert';
import { FiBarChart2 } from 'react-icons/fi';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import CargabilidadSkeleton from '@/components/cargabilidad/CargabilidadSkeleton';

export const PROJECT_COLORS = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
];

export interface Project {
  name: string;
  load: number;
  deadline?: string;
  hoursPerWeek: number;
  color?: string; // Color del proyecto, opcional
}

interface HistoryEntry {
  week: string;
  totalHours: number;
  availableHours: number;
  projects: {
    name: string;
    hours: number;
  }[];
}

const PersonalLoadPage = () => {
  const [projects, setProjects] = useState<Project[]>([
    { name: 'Expediente Alfa', load: 15, deadline: '2025-05-15', hoursPerWeek: 10, color: PROJECT_COLORS[0] },
    { name: 'Delta Zero', load: 25, deadline: '2025-06-30', hoursPerWeek: 10, color: PROJECT_COLORS[1] },
  ]);

  // Añadimos 'history' a las opciones de pestañas
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history'>('dashboard');

  const employee = {
    name: "Carlos Rodríguez",
    role: "Desarrollador Full Stack",
    totalHoursPerWeek: 40
  };

  const totalUsedHours = projects.reduce((sum, p) => sum + p.hoursPerWeek, 0);
  const availableHours = employee.totalHoursPerWeek - totalUsedHours;
  const totalLoad = Math.min(100, (totalUsedHours / employee.totalHoursPerWeek) * 100);
  const weeklyLoad = [45, 60, 78, 65, 70, 30, 20];

  // Datos de historial de ejemplo para el componente HistoryTab
  const historyData: HistoryEntry[] = [
    {
      week: '2025-01-05',
      totalHours: 32,
      availableHours: 8,
      projects: [
        { name: 'Expediente Alfa', hours: 15 },
        { name: 'Delta Zero', hours: 8 },
        { name: 'Omega UX', hours: 9 }
      ]
    },
    {
      week: '2025-01-12',
      totalHours: 38,
      availableHours: 2,
      projects: [
        { name: 'Expediente Alfa', hours: 16 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 12 }
      ]
    },
    {
      week: '2025-01-19',
      totalHours: 43,
      availableHours: -3,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 8 },
        { name: 'Omega UX', hours: 17 }
      ]
    },
    {
      week: '2025-01-26',
      totalHours: 42,
      availableHours: -2,
      projects: [
        { name: 'Expediente Alfa', hours: 20 },
        { name: 'Delta Zero', hours: 7 },
        { name: 'Omega UX', hours: 15 }
      ]
    },
    {
      week: '2025-02-02',
      totalHours: 39,
      availableHours: 1,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 9 },
        { name: 'Omega UX', hours: 12 }
      ]
    },
    {
      week: '2025-02-09',
      totalHours: 37,
      availableHours: 3,
      projects: [
        { name: 'Expediente Alfa', hours: 17 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 10 }
      ]
    },
    {
      week: '2025-02-16',
      totalHours: 35,
      availableHours: 5,
      projects: [
        { name: 'Expediente Alfa', hours: 15 },
        { name: 'Delta Zero', hours: 8 },
        { name: 'Omega UX', hours: 12 }
      ]
    },
    {
      week: '2025-02-23',
      totalHours: 40,
      availableHours: 0,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 12 }
      ]
    },
    {
      week: '2025-03-02',
      totalHours: 42,
      availableHours: -2,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 14 }
      ]
    },
    {
      week: '2025-03-09',
      totalHours: 45,
      availableHours: -5,
      projects: [
        { name: 'Expediente Alfa', hours: 20 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 15 }
      ]
    },
    {
      week: '2025-03-16',
      totalHours: 42,
      availableHours: -2,
      projects: [
        { name: 'Expediente Alfa', hours: 19 },
        { name: 'Delta Zero', hours: 8 },
        { name: 'Omega UX', hours: 15 }
      ]
    },
    {
      week: '2025-03-23',
      totalHours: 38,
      availableHours: 2,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 8 },
        { name: 'Omega UX', hours: 12 }
      ]
    },
    {
      week: '2025-03-30',
      totalHours: 40,
      availableHours: 0,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 9 },
        { name: 'Omega UX', hours: 13 }
      ]
    },
    {
      week: '2025-04-06',
      totalHours: 41,
      availableHours: -1,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 9 },
        { name: 'Omega UX', hours: 14 }
      ]
    },
    {
      week: '2025-04-13',
      totalHours: 50,
      availableHours: -10,
      projects: [
        { name: 'Expediente Alfa', hours: 18 },
        { name: 'Delta Zero', hours: 10 },
        { name: 'Omega UX', hours: 22 }
      ]
    }
  ];

  const AvailableHoursRatio = availableHours / employee.totalHoursPerWeek;

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

  const [loading, setLoading] = useState(true);

  // Use effect to simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  // If loading, show skeleton
  if (loading) {
    return <CargabilidadSkeleton />;
  }

  return (
    <main className="min-h-screen bg-gray-50 py-6">
      {/* Header card with purple icon */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
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
                  <p className="text-gray-600 mt-2 max-w-2xl">
                    Visualiza y gestiona tu cargabilidad por proyectos. Equilibra tus horas de trabajo para un rendimiento óptimo.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <p className={`text-sm font-medium ${utilColor(totalLoad)}`}>
                  {utilLabel(totalLoad)}
                </p>
                <div
                  className={`relative w-20 h-20 ${utilBgColor(totalLoad)} rounded-full flex items-center justify-center shadow-sm border border-gray-100`}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: totalLoad }, { value: 100 - totalLoad }]}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={22}
                        outerRadius={30}
                        stroke="transparent"
                        cornerRadius={4}
                      >
                        <Cell fill={utilBarColor(totalLoad)} />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <span className="absolute inset-0 flex items-center justify-center text-md font-bold">
                    {Math.round(totalLoad)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Show alert only if overloaded */}
        {AvailableHoursRatio < 0 && <LoadAlert totalLoad={totalLoad} />}
        
        {/* Redesigned weekly stats summary card - no header, more visual approach */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300">
          <div className="p-4">
            {/* Progress bar visualization of weekly hours */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#A100FF]"></div>
                  <span className="text-sm font-medium text-gray-700">Distribución Semanal</span>
                </div>
                <span className="text-sm text-gray-500">{totalUsedHours}h / {employee.totalHoursPerWeek}h</span>
              </div>
              
              <div className="h-8 w-full flex overflow-hidden rounded-lg shadow-sm">
                {projects.map((project) => {
                  const w = `${(project.hoursPerWeek / employee.totalHoursPerWeek) * 100}%`;
                  return (
                    <div
                      key={project.name}
                      className={`${project.color} flex items-center justify-center relative group`}
                      style={{ width: w }}
                    >
                      <span className="text-[10px] font-semibold text-white truncate px-2">
                        {project.hoursPerWeek}h
                      </span>
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {project.name}: {project.hoursPerWeek}h
                      </div>
                    </div>
                  );
                })}
                {availableHours > 0 && (
                  <div
                    style={{ width: `${(availableHours / employee.totalHoursPerWeek) * 100}%` }}
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
                availableHours < 0 
                  ? 'bg-red-50 text-red-700 border border-red-100' 
                  : availableHours < 8 
                    ? 'bg-amber-50 text-amber-700 border border-amber-100'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}>
                <span className="font-medium mr-1">
                  {availableHours < 0 
                    ? `Sobrecarga: ${Math.abs(availableHours)}h` 
                    : `Disponible: ${availableHours}h`}
                </span>
              </div>
              
              {projects.map((project) => (
                <div key={project.name} className="inline-flex items-center gap-1.5 bg-white rounded-full px-2.5 py-1 border border-gray-100 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${project.color}`}></div>
                  <span className="text-xs font-medium text-gray-700">{project.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Improved tabs with more visual appeal - removed surrounding borders */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          {/* Updated tabs with cleaner styling - no surrounding borders */}
          <div className="flex px-4 pt-4 gap-2 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-5 py-2.5 rounded-t-lg font-medium text-sm transition-all duration-200 relative
                ${activeTab === 'dashboard'
                  ? 'text-[#A100FF] bg-white'
                  : 'text-gray-600 hover:text-[#A100FF] hover:bg-[#A100FF05]'
                }
              `}
            >
              <span>Dashboard</span>
              {activeTab === 'dashboard' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#A100FF]"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-5 py-2.5 rounded-t-lg font-medium text-sm transition-all duration-200 relative
                ${activeTab === 'history'
                  ? 'text-[#A100FF] bg-white'
                  : 'text-gray-600 hover:text-[#A100FF] hover:bg-[#A100FF05]'
                }
              `}
            >
              <span>Historial</span>
              {activeTab === 'history' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#A100FF]"></span>
              )}
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'dashboard' ? (
              <DashboardTab
                projects={projects}
                weeklyLoad={weeklyLoad}
                availableHours={availableHours}
                totalHoursPerWeek={employee.totalHoursPerWeek}
              />
            ) : activeTab === 'history' ? (
              <HistoryTab
                historyData={historyData}
                maxWeeklyHours={employee.totalHoursPerWeek}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PersonalLoadPage;