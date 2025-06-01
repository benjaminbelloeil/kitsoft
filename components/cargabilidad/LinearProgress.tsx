'use client';

import { getProjectHexColor } from '../proyectos/utils/projectUtils';

interface Props {
  value: number;
  label: string;
  projectId?: string;
  color?: string;
}

export const LinearProgress = ({ value, label, projectId, color }: Props) => {
  const getColor = (value: number) => {
    if (value < 50) return "#10B981";
    if (value < 80) return "#F59E0B";
    return "#EF4444";
  };

  const projectColor = color || (projectId ? getProjectHexColor(null, projectId) : getColor(value));
  
  // Ensure value is a valid number
  const safeValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, value) : 0;
  
  return (
    <div className="w-full bg-gray-50 p-2 rounded-lg mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-700">{Math.round(safeValue)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="h-2.5 rounded-full transition-all duration-300"
          style={{ 
            width: `${safeValue}%`, 
            backgroundColor: projectColor,
            minWidth: safeValue > 0 ? '16px' : '0px' // Ensure small percentages are clearly visible
          }}
        />
      </div>
    </div>
  );
};
