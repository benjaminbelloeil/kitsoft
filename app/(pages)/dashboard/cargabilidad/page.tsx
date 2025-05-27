/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardTab } from '@/components/cargabilidad/DashboardTab';
import { HistoryTab } from '@/components/cargabilidad/RecordTab';
import { LoadAlert } from '@/components/cargabilidad/LoadAlert';
import { HeaderCard } from '@/components/cargabilidad/EmployeeSummary';
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
    <AnimatePresence mode="wait">
      <motion.main 
        className="min-h-screen bg-gray-50 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header card with animation */}
        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <HeaderCard
              name={employee.name}
              position={employee.role}
              projects={projects}
              totalHours={employee.totalHoursPerWeek}
              assignedHours={totalUsedHours}
              totalLoad={totalLoad}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Show alert only if overloaded */}
          {AvailableHoursRatio < 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <LoadAlert totalLoad={totalLoad} />
            </motion.div>
          )}
          
          {/* Improved tabs with more visual appeal - removed surrounding borders */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
          >
            {/* Updated tabs with cleaner styling - no surrounding borders */}
            <motion.div 
              className="flex px-4 pt-4 gap-2 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <motion.button
                onClick={() => setActiveTab('dashboard')}
                className={`px-5 py-2.5 rounded-t-lg font-medium text-sm transition-all duration-200 relative
                  ${activeTab === 'dashboard'
                    ? 'text-[#A100FF] bg-white'
                    : 'text-gray-600 hover:text-[#A100FF] hover:bg-[#A100FF05]'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Dashboard</span>
                {activeTab === 'dashboard' && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#A100FF]"
                    layoutId="activeTab"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
              <motion.button
                onClick={() => setActiveTab('history')}
                className={`px-5 py-2.5 rounded-t-lg font-medium text-sm transition-all duration-200 relative
                  ${activeTab === 'history'
                    ? 'text-[#A100FF] bg-white'
                    : 'text-gray-600 hover:text-[#A100FF] hover:bg-[#A100FF05]'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Historial</span>
                {activeTab === 'history' && (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[#A100FF]"
                    layoutId="activeTab"
                    transition={{ duration: 0.2 }}
                  />
                )}
              </motion.button>
            </motion.div>

            <motion.div 
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' ? (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DashboardTab
                      projects={projects}
                      weeklyLoad={weeklyLoad}
                      availableHours={availableHours}
                      totalHoursPerWeek={employee.totalHoursPerWeek}
                    />
                  </motion.div>
                ) : activeTab === 'history' ? (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <HistoryTab
                      historyData={historyData}
                      maxWeeklyHours={employee.totalHoursPerWeek}
                    />
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
};

export default PersonalLoadPage;