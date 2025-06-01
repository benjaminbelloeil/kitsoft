'use client';

import { Project } from '@/interfaces/cargabilidad';
import { getProjectHexColor } from '../proyectos/utils/projectUtils';

interface Props {
  data: number[];
  projects?: Project[]; // Add projects prop for stacked bars
}

export const WeeklyLoadChart = ({ data, projects = [] }: Props) => {
  const max = Math.max(...data, 8); // Ensure at least 8 hours as max for proper scaling
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const chartHeight = 96; // 96px = h-24 in Tailwind

  return (
    <div className="flex items-end h-32 gap-1 w-full pt-4">
      {data.map((value, index) => {
        const heightPx = max > 0 ? Math.max((value / max) * chartHeight, value > 0 ? 4 : 0) : 0;

        // For working days (Mon-Fri), show stacked bars by project
        const isWorkingDay = index < 5;
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="relative w-full">
              {/* Hours label on top of bar */}
              {value > 0 && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600">
                  {Math.round(value * 10) / 10}h
                </div>
              )}
              
              {isWorkingDay && projects.length > 0 ? (
                // Stacked bar showing projects
                <div className="w-full flex flex-col rounded-t-sm overflow-hidden" style={{ height: `${heightPx}px` }}>
                  {projects.map((project) => {
                    const projectDailyHours = project.hoursPerWeek / 5; // Hours per day for this project
                    const projectHeightPercentage = value > 0 ? (projectDailyHours / value) * 100 : 0;
                    // Use the same color function as project cards for consistency
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
                      />
                    );
                  })}
                </div>
              ) : (
                // Single color bar for weekends or when no projects
                <div
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${heightPx}px`,
                    backgroundColor: '#9CA3AF', // Gray for weekends
                    minHeight: value > 0 ? '4px' : '0px'
                  }}
                />
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">{days[index]}</span>
          </div>
        );
      })}
    </div>
  );
};
