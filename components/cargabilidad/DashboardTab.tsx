'use client';

import { WeeklyLoadChart } from './WeeklyLoadChart';
import { LinearProgress } from './LinearProgress';
<<<<<<< Updated upstream
import { CircularProgress } from './CircularProgress';
import { FiBarChart2, FiPieChart, FiCalendar } from 'react-icons/fi';
=======
import { CircularProgress } from '../ui/CircularProgress';
import { FiBarChart2, FiPieChart, FiCalendar, FiActivity } from 'react-icons/fi';
>>>>>>> Stashed changes

interface Project {
  name: string;
  load: number;
  deadline?: string;
  hours?: number;
  color?: string;
}

interface Props {
  projects: Project[];
  weeklyLoad: number[];
  availableHours: number;
  totalHoursPerWeek: number;
}

export const DashboardTab = ({ projects, weeklyLoad, availableHours, totalHoursPerWeek }: Props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiBarChart2 className="text-indigo-600" />
          Mi Carga Semanal
        </h3>
        <WeeklyLoadChart data={weeklyLoad} />
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiPieChart className="text-indigo-600" />
          Cargabilidad por Proyecto
        </h3>
        <div className="space-y-4">
          {projects.map((project, index) => (
            <LinearProgress
              key={index}
              value={(project.load) }
              label={project.name}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4">Mi Tiempo Disponible</h3>
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

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiCalendar className="text-indigo-600" />
          Próximos Plazos
        </h3>
        <div className="space-y-3">
          {projects
            .filter(p => p.deadline)
            .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
            .map((project, index) => {
              const today = new Date();
              const deadline = new Date(project.deadline!);
              const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.deadline}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    daysLeft < 7 ? 'bg-red-100 text-red-800'
                    : daysLeft < 15 ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                  }`}>
                    {daysLeft} días
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
