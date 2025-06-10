'use client';

import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { Project } from '@/interfaces/cargabilidad';
import { getProjectHexColor } from '../../utils/projectUtils';

interface ReadOnlyWeeklyLoadSectionProps {
  projects: Project[];
  loading: boolean;
}

export default function ReadOnlyWeeklyLoadSection({ 
  projects, 
  loading 
}: ReadOnlyWeeklyLoadSectionProps) {
  // Calculate weekly load distribution (Monday-Sunday)
  const calculateWeeklyLoadChart = (projectsData: Project[]): number[] => {
    const totalWeeklyHours = projectsData.reduce((sum, project) => sum + project.hoursPerWeek, 0);
    const dailyHours = totalWeeklyHours / 5; // Distribute across 5 working days (Mon-Fri)
    
    // Return array for Monday through Sunday (last 2 days will be 0 for weekend)
    return [
      dailyHours, // Monday
      dailyHours, // Tuesday  
      dailyHours, // Wednesday
      dailyHours, // Thursday
      dailyHours, // Friday
      0, // Saturday
      0  // Sunday
    ];
  };

  const weeklyLoad = calculateWeeklyLoadChart(projects);
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const maxHours = 8; // Fixed 8 hours for consistent visualization scaling
  const totalWeeklyHours = projects.reduce((sum, project) => sum + project.hoursPerWeek, 0);
  const availableHours = Math.max(0, 40 - totalWeeklyHours); // Assuming 40h work week

  if (loading) {
    return (
      <div className="h-full flex flex-col p-6 pt-16">
        {/* Summary Stats Skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="h-5 w-10 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
            <div className="h-3 w-14 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="h-5 w-10 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto"></div>
          </div>
        </div>

        {/* Chart Skeleton */}
        <div className="grid grid-cols-7 gap-2 h-32 mb-4">
          {Array.from({ length: 7 }).map((_, index) => (
            <div key={index} className="flex flex-col h-full">
              <div className="h-5 w-full bg-gray-200 rounded-t animate-pulse mb-1"></div>
              <div className="flex-grow bg-gray-200 animate-pulse"></div>
              <div className="h-5 w-full bg-gray-200 rounded-b animate-pulse mt-1"></div>
            </div>
          ))}
        </div>

        {/* Project Legend Skeleton */}
        <div className="pt-4 border-t border-gray-100">
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col p-6 pt-16">
      {projects.length === 0 ? (
        <motion.div 
          className="flex flex-col items-center justify-center flex-grow text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-[#A100FF15] to-[#A100FF25] rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <FiClock className="h-8 w-8 text-[#A100FF]" />
          </motion.div>
          <h4 className="text-gray-700 font-semibold mb-2 text-base">Sin proyectos asignados</h4>
          <p className="text-gray-500 text-sm">No hay carga de trabajo semanal</p>
        </motion.div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-2 bg-gradient-to-br from-[#A100FF08] to-[#A100FF15] rounded-lg border border-[#A100FF20]">
              <div className="text-lg font-bold text-[#A100FF]">{totalWeeklyHours}h</div>
              <div className="text-xs text-gray-600">Asignadas</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-lg border border-gray-200">
              <div className="text-lg font-bold text-gray-700">{availableHours}h</div>
              <div className="text-xs text-gray-600">Disponibles</div>
            </div>
          </div>

          {/* Weekly Chart - Similar to cargabilidad design */}
          <div className="grid grid-cols-7 gap-2 h-32 mb-4">
            {weeklyLoad.map((value, index) => {
              const isWorkingDay = index < 5; // Monday to Friday
              const heightPercentage = Math.min((value / maxHours) * 100, 100);
              
              return (
                <div key={index} className="flex flex-col h-full">
                  {/* Day label at top */}
                  <div className="text-xs font-medium text-gray-600 border-t border-l border-r border-gray-200 rounded-t-sm pt-1 px-1 bg-gray-50 w-full text-center">
                    {days[index]}
                  </div>
                  
                  {/* Chart area with border - same design as cargabilidad */}
                  <div className="relative flex-grow w-full border border-gray-200 bg-gray-50 flex items-end border-t-0">
                    {isWorkingDay && projects.length > 0 && value > 0 ? (
                      // Stacked bar showing projects
                      <div 
                        className="absolute bottom-0 w-full flex flex-col rounded-t-sm overflow-hidden"
                        style={{ height: `${heightPercentage}%`, minHeight: '4px' }}
                      >
                        {projects.map((project) => {
                          const projectDailyHours = project.hoursPerWeek / 5; // Hours per day for this project
                          const projectHeightPercentage = value > 0 ? (projectDailyHours / value) * 100 : 0;
                          const projectColor = getProjectHexColor(project.color, project.id_proyecto);
                          
                          return (
                            <div
                              key={project.id_proyecto}
                              className="w-full transition-all duration-300"
                              style={{
                                height: `${projectHeightPercentage}%`,
                                backgroundColor: projectColor,
                                minHeight: projectDailyHours > 0 ? '2px' : '0px'
                              }}
                              title={`${project.titulo}: ${Math.round(projectDailyHours * 10) / 10}h`}
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
                          backgroundColor: value > 0 ? (isWorkingDay ? '#A100FF' : '#9CA3AF') : '#e5e7eb',
                          minHeight: value > 0 ? '4px' : '0px'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Hours label at bottom */}
                  <div className="text-xs font-medium text-gray-700 py-1 border-l border-r border-b border-gray-200 rounded-b-sm bg-gray-50 text-center">
                    {Math.round(value * 10) / 10}h
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compact Project Legend */}
          {projects.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Proyectos</h4>
              <div className="space-y-2">
                {projects.slice(0, 3).map((project) => {
                  const projectColor = getProjectHexColor(project.color, project.id_proyecto);
                  return (
                    <div key={project.id_proyecto} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: projectColor }}
                        />
                        <span className="text-gray-700 truncate">{project.titulo}</span>
                      </div>
                      <span className="text-gray-500 font-medium">{project.hoursPerWeek}h</span>
                    </div>
                  );
                })}
                {projects.length > 3 && (
                  <div className="text-sm text-gray-500 text-center pt-2">
                    +{projects.length - 3} más
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
