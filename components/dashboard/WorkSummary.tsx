"use client";

import { BarChart2 } from "lucide-react";
import { getProjectHexColor } from "../proyectos/utils/projectUtils";

interface DayWork {
  day: string;
  hours: number;
  color: string;
}

interface Project {
  id: string;
  name: string;
  hoursPerWeek: number;
  color: string;
}

interface WorkSummaryProps {
  workload: DayWork[];
  projects?: Project[];
}

export default function WorkSummary({ workload, projects = [] }: WorkSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col min-h-[400px]">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
          Resumen Semanal de Trabajo
        </h2>
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="grid grid-cols-7 gap-2 flex-grow">
          {workload.map((day, index) => {
            const isWorkingDay = index < 5; // Monday to Friday
            const maxHours = Math.max(...workload.map(d => d.hours), 8); // At least 8 hours for scaling
            const heightPercentage = maxHours > 0 ? (day.hours / maxHours) * 100 : 0;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
                <div className="relative h-32 w-full flex items-end">
                  {isWorkingDay && projects.length > 0 && day.hours > 0 ? (
                    // Stacked bar showing projects
                    <div 
                      className="w-full flex flex-col rounded-t-sm overflow-hidden"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {projects.map((project) => {
                        const projectDailyHours = project.hoursPerWeek / 5; // Hours per day for this project
                        const projectHeightPercentage = day.hours > 0 ? (projectDailyHours / day.hours) * 100 : 0;
                        const projectColor = getProjectHexColor(null, project.id);
                        
                        return (
                          <div
                            key={project.id}
                            className="w-full transition-all duration-300"
                            style={{
                              height: `${projectHeightPercentage}%`,
                              backgroundColor: projectColor,
                              minHeight: projectDailyHours > 0 ? '2px' : '0px'
                            }}
                            title={`${project.name}: ${Math.round(projectDailyHours * 10) / 10}h`}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    // Single color bar for weekends or when no projects
                    <div
                      className="w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${heightPercentage}%`,
                        backgroundColor: day.hours > 0 ? '#6366f1' : '#e5e7eb',
                        minHeight: day.hours > 0 ? '4px' : '0px'
                      }}
                    />
                  )}
                </div>
                <div className="mt-1 text-xs font-medium text-gray-700">{day.hours}h</div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-auto bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Reporte Semanal</h4>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })} - {new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { 
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <div className="md:text-right mt-4 md:mt-0">
              {(() => {
                const totalHours = workload.reduce((sum, day) => sum + day.hours, 0);
                const workingDayHours = workload.slice(0, 5).reduce((sum, day) => sum + day.hours, 0); // Mon-Fri only
                const utilizationPercentage = workingDayHours > 0 ? Math.round((workingDayHours / 40) * 100) : 0;
                
                return (
                  <>
                    <div className="text-lg font-bold text-indigo-700">{Math.round(totalHours * 10) / 10} horas</div>
                    <div className="text-sm text-gray-600">
                      de 40 horas totales ({utilizationPercentage}%)
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
