'use client';

import { useState } from 'react';
import { ProjectCard } from '@/components/cargabilidad/ProjectCard';
import { DashboardTab } from '@/components/cargabilidad/DashboardTab';
import { HistoryTab } from '@/components/cargabilidad/RecordTab'; // Importamos el nuevo componente
import { EmployeeSummary } from '@/components/cargabilidad/EmployeeSummary';
import { LoadAlert } from '@/components/cargabilidad/LoadAlert';
import { Tabs } from '@/components/cargabilidad/Tabs';

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

interface Project {
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
    { name: 'Expediente Alfa', load: 15, deadline: '2025-05-15', hoursPerWeek: 20, color: PROJECT_COLORS[0] },
    { name: 'Delta Zero', load: 25, deadline: '2025-06-30', hoursPerWeek: 12, color: PROJECT_COLORS[1] },
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

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Sistema de Alarma de cargabildad */}

        {/* <LoadAlert totalLoad={totalLoad} /> */}
        
        {/* Tarjetas de Proyectos */}
        {/* Resumen de Cargabilidad de Empleado */}
        <EmployeeSummary
          name={employee.name}
          role={employee.role}
          totalLoad={totalLoad}
          totalUsedHours={totalUsedHours}
          availableHours={availableHours}
          totalHoursPerWeek={employee.totalHoursPerWeek}
          projects={projects} // Pasamos los proyectos al componente
        />
        
        <div className="bg-white rounded-xl shadow-md mb-6">
          {/* Actualizamos el componente Tabs para incluir la pestaña de historial */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'dashboard'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-3 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-b-2 border-indigo-600 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Historial
              </button>
            </nav>
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