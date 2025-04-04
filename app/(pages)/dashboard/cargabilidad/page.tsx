'use client';

import { useState } from 'react';
import { CircularProgress } from '@/components/cargabilidad/CircularProgress';
import { LinearProgress } from '@/components/cargabilidad/LinearProgress';
import { WeeklyLoadChart } from '@/components/cargabilidad/WeeklyLoadChart';
import { ProjectCard } from '@/components/cargabilidad/ProjectCard';
import { DashboardTab } from '@/components/cargabilidad/DashboardTab';
import { EmployeeSummary } from '@/components/cargabilidad/EmployeeSummary';
import { Tabs } from '@/components/cargabilidad/Tabs';

interface Project {
  name: string;
  load: number;
  deadline?: string;
  hoursPerWeek: number;
}

const PersonalLoadPage = () => {
  const [projects, setProjects] = useState<Project[]>([
    { name: 'Expediente Alfa', load: 65, deadline: '2025-05-15', hoursPerWeek: 18 },
    { name: 'Delta Zero', load: 35, deadline: '2025-06-30', hoursPerWeek: 10 },
    { name: 'Omega UX', load: 80, deadline: '2025-04-30', hoursPerWeek: 22 },
  ]);

  const [activeTab, setActiveTab] = useState<'projects' | 'dashboard'>('projects');

  const employee = {
    name: "Carlos Rodríguez",
    role: "Desarrollador Full Stack",
    totalHoursPerWeek: 40
  };

  const totalUsedHours = projects.reduce((sum, p) => sum + p.hoursPerWeek, 0);
  const availableHours = employee.totalHoursPerWeek - totalUsedHours;
  const totalLoad = Math.min(100, (totalUsedHours / employee.totalHoursPerWeek) * 100);
  const weeklyLoad = [45, 60, 78, 65, 70, 30, 20];

  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <EmployeeSummary
          name={employee.name}
          role={employee.role}
          totalLoad={totalLoad}
          totalUsedHours={totalUsedHours}
          availableHours={availableHours}
          totalHoursPerWeek={employee.totalHoursPerWeek}
        />

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="p-6">
            {activeTab === 'projects' ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {projects.map((project, index) => (
                    <ProjectCard
                      key={index}
                      project={project}
                      onEdit={() => {}}
                      onDelete={() =>
                        setProjects(projects.filter((_, i) => i !== index))
                      }
                    />
                  ))}
                </div>
              </div>
            ) : (
              <DashboardTab
                projects={projects}
                weeklyLoad={weeklyLoad}
                availableHours={availableHours}
                totalHoursPerWeek={employee.totalHoursPerWeek}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PersonalLoadPage;
