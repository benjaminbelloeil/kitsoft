'use client';

import { Project } from '@/interfaces/cargabilidad';
import { getProjectHexColor } from '../proyectos/utils/projectUtils';

interface Props {
  projects: Project[];
}

export const ProjectLoadChart = ({ projects }: Props) => {
  return (
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {projects.map((project) => {
        const safeLoad = typeof project.load === 'number' && !isNaN(project.load) ? Math.max(0, project.load) : 0;
        // Use the same color function as project cards for consistency
        const projectColor = getProjectHexColor(project.color, project.id_proyecto);
        
        return (
          <div key={project.id_proyecto} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 truncate">{project.name}</span>
              <span className="text-sm font-semibold text-gray-800">{Math.round(safeLoad)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="h-2 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${safeLoad}%`, 
                  backgroundColor: projectColor,
                  minWidth: safeLoad > 0 ? '4px' : '0px'
                }}
              />
            </div>
          </div>
        );
      })}
      
      {projects.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No hay proyectos asignados
        </div>
      )}
    </div>
  );
};
