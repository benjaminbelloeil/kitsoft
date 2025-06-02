// app/dashboard/certificaciones/components/ProgressBar.tsx
import React from 'react';
import { colorClasses } from './TrajectoryUtils';

interface ProgressBarProps {
  progress: number;
  category: string;
  showLabel?: boolean;
  height?: 'sm' | 'md' | 'lg';
  colorClass?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  progress, 
  category, 
  showLabel = true,
  height = 'sm'
}) => {
  const courseColor = colorClasses[category as keyof typeof colorClasses] || colorClasses.accenture;
  
  // Determinar la altura de la barra de progreso
  const heightClass = {
    sm: 'h-2',
    md: 'h-2.5',
    lg: 'h-3'
  }[height];

  return (
    <div>
      {showLabel && (
        <div className="flex justify-between text-sm mb-1">
          <span>Progreso</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass}`}>
        <div 
          className={`${heightClass} rounded-full ${courseColor.bg}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;