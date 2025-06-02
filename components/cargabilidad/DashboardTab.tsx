'use client';

import { WeeklyLoadChart } from './WeeklyLoadChart';
import { ProjectLoadChart } from './ProjectLoadChart';
import { CircularProgress } from './CircularProgress';
import { FiBarChart2, FiPieChart, FiCalendar, FiActivity } from 'react-icons/fi';
import { Project } from '@/interfaces/cargabilidad';
import { motion } from 'framer-motion';

interface Props {
  projects: Project[];
  weeklyLoad: number[];
  availableHours: number;
  totalHoursPerWeek: number;
}

export const DashboardTab = ({ projects, weeklyLoad, availableHours, totalHoursPerWeek }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#A100FF08] flex items-center justify-center">
            <FiBarChart2 className="text-[#A100FF]" />
          </div>
          Mi Carga Semanal
        </h3>
        <div className="h-48">
          <WeeklyLoadChart data={weeklyLoad} projects={projects} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#6366F108] flex items-center justify-center">
            <FiPieChart className="text-[#6366F1]" />
          </div>
          Cargabilidad por Proyecto
        </h3>
        <div className="h-48">
          <ProjectLoadChart projects={projects} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#10B98108] flex items-center justify-center">
            <FiActivity className="h-4 w-4 text-[#10B981]" />
          </div>
          Mi Tiempo Disponible
        </h3>
        <div className="flex flex-col items-center">
          <CircularProgress value={Math.max(0, (availableHours / totalHoursPerWeek) * 100)} />
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold">{Math.max(0, availableHours)}h</p>
            <p className="text-gray-500">disponibles de {totalHoursPerWeek}h semanales</p>
          </div>
          {availableHours < 0 && (
            <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 w-full">
              <p className="text-red-600 text-sm font-medium text-center">
                ⚠️ Tienes una sobrecarga de {Math.abs(availableHours)} horas semanales
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#F59E0B08] flex items-center justify-center">
            <FiCalendar className="text-[#F59E0B]" />
          </div>
          Próximos Plazos
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {projects
            .filter(p => p.deadline)
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
            .map((project, index) => {
              const today = new Date();
              const deadline = new Date(project.deadline!);
              const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.deadline}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    daysLeft < 7 ? 'bg-red-100 text-red-800'
                    : daysLeft < 15 ? 'bg-amber-100 text-amber-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                    {daysLeft} días
                  </span>
                </div>
              );
            })}
          
          {projects.filter(p => p.deadline).length === 0 && (
            <motion.div 
              className="text-center py-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div 
                className="w-16 h-16 bg-[#F59E0B08] rounded-full flex items-center justify-center mx-auto mb-4"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <FiCalendar className="h-8 w-8 text-[#F59E0B]" />
              </motion.div>
              <motion.h3 
                className="text-gray-800 font-medium mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                No hay plazos próximos
              </motion.h3>
              <motion.p 
                className="text-gray-500 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                Los proyectos con fechas límite aparecerán aquí
              </motion.p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
