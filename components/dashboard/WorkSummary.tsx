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
  // Check if there are any hours assigned
  const totalHours = workload.reduce((sum, day) => sum + day.hours, 0);
  const hasHours = totalHours > 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col min-h-[300px]">
      <div className="p-3 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
          Resumen Semanal de Trabajo
        </h2>
      </div>
      
      <div className="p-4 pb-4 pl-4 pr-4 pt-0 flex-grow flex flex-col justify-start">
        {!hasHours ? (
          /* Empty State - No hours assigned */
          <div className="flex flex-col items-center justify-center py-8 px-4 mb-4 flex-grow">
            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3 border border-indigo-100">
              <BarChart2 className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">Sin horas asignadas</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Cuando tengas horas de trabajo asignadas, aquí verás tu resumen semanal.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-2 flex-grow my-4">
          {workload.map((day, index) => {
            const isWorkingDay = index < 5; // Monday to Friday
            const maxHours = 8; // Fixed 8 hours for scaling
            // Use fixed 8-hour scale for consistent visualization
            const heightPercentage = (day.hours / maxHours) * 100;
            
            return (
              <div key={index} className="flex flex-col h-full">
                <div className="text-xs font-medium text-gray-600 border-t border-l border-r border-gray-200 rounded-t-sm pt-1 px-1 bg-gray-50 w-full text-center">{day.day}</div>
                <div className="relative flex-grow w-full border border-gray-200 bg-gray-50 flex items-end border-t-0">
                  {isWorkingDay && projects.length > 0 && day.hours > 0 ? (
                    // Stacked bar showing projects
                    <div 
                      className="absolute bottom-0 w-full flex flex-col rounded-t-sm overflow-hidden"
                      style={{ height: `${heightPercentage}%`, minHeight: '6px' }}
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
                      className="absolute bottom-0 w-full rounded-t-sm transition-all duration-500"
                      style={{
                        height: `${heightPercentage}%`,
                        backgroundColor: day.hours > 0 ? '#6366f1' : '#e5e7eb',
                        minHeight: day.hours > 0 ? '6px' : '0px'
                      }}
                    />
                  )}
                </div>
                <div className="text-xs font-medium text-black py-1 border-l border-r border-b border-gray-200 rounded-b-sm bg-gray-50 text-center">{day.hours}h</div>
              </div>
            );            })}
        </div>
        
        <div className="mt-auto bg-white/80 backdrop-blur-xl rounded-xl p-3 border border-gray-200/60 shadow-lg shadow-black/5 relative overflow-hidden">
          {/* Glossy overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 text-sm">Reporte Semanal</h4>
              <p className="text-xs text-gray-600 mt-0.5">
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
            <div className="md:text-right mt-2 md:mt-0">
              {(() => {
                const totalHours = workload.reduce((sum, day) => sum + day.hours, 0);
                const workingDayHours = workload.slice(0, 5).reduce((sum, day) => sum + day.hours, 0); // Mon-Fri only
                const utilizationPercentage = workingDayHours > 0 ? Math.round((workingDayHours / 40) * 100) : 0;
                
                return (
                  <>
                    <div className="text-base font-bold text-black">{Math.round(totalHours * 10) / 10} horas</div>
                    <div className="text-xs text-gray-600">
                      de 40 horas totales ({utilizationPercentage}%)
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
}
