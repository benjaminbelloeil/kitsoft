'use client';

import { Project } from '@/interfaces/cargabilidad';
import { getProjectHexColor } from '../proyectos/utils/projectUtils';

interface Props {
  data: number[];
  projects?: Project[]; // Add projects prop for stacked bars
}

export const WeeklyLoadChart = ({ data, projects = [] }: Props) => {
  const days = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
  const maxHours = 8; // Fixed 8 hours for consistent visualization scaling

  return (
    <div className="h-full flex flex-col">
      {/* Grid layout with bordered columns like WorkSummary */}
      <div className="grid grid-cols-7 gap-2 flex-grow">
        {data.map((value, index) => {
          const isWorkingDay = index < 5; // Monday to Friday
          const heightPercentage = (value / maxHours) * 100;
          
          return (
            <div key={index} className="flex flex-col h-full">
              {/* Day label at top */}
              <div className="text-xs font-medium text-gray-600 border-t border-l border-r border-gray-200 rounded-t-sm pt-1 px-1 bg-gray-50 w-full text-center">
                {days[index]}
              </div>
              
              {/* Chart area with border */}
              <div className="relative flex-grow w-full border border-gray-200 bg-gray-50 flex items-end border-t-0">
                {isWorkingDay && projects.length > 0 && value > 0 ? (
                  // Stacked bar showing projects
                  <div 
                    className="absolute bottom-0 w-full flex flex-col rounded-t-sm overflow-hidden"
                    style={{ height: `${heightPercentage}%`, minHeight: '6px' }}
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
                      backgroundColor: value > 0 ? (isWorkingDay ? '#6366f1' : '#9CA3AF') : '#e5e7eb',
                      minHeight: value > 0 ? '6px' : '0px'
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
    </div>
  );
};
