'use client';

import { Project } from '@/interfaces/cargabilidad';
import { getProjectHexColor } from '../proyectos/utils/projectUtils';
import { motion } from 'framer-motion';
import { FiPieChart } from 'react-icons/fi';

interface Props {
  projects: Project[];
}

export const ProjectLoadChart = ({ projects }: Props) => {
  return (
    <div className="h-full overflow-y-auto pr-2">
      <div className="space-y-3">
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
        <motion.div 
          className="text-center py-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 bg-[#6366F108] rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <FiPieChart className="h-8 w-8 text-[#6366F1]" />
          </motion.div>
          <motion.h3 
            className="text-gray-800 font-medium mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            No hay proyectos asignados
          </motion.h3>
          <motion.p 
            className="text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            Los proyectos aparecerán aquí cuando sean asignados
          </motion.p>
        </motion.div>
      )}
      </div>
    </div>
  );
};
