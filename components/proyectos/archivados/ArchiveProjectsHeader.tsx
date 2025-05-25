'use client';

import { useState, useEffect } from 'react';
import { getProjectsByStatus } from '@/app/lib/data';
import { FiArchive, FiGrid, FiList } from 'react-icons/fi';

interface ArchivedProjectsHeaderProps {
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ArchivedProjectsHeader({ 
  viewMode = 'grid',
  onViewModeChange
}: ArchivedProjectsHeaderProps) {
  const [archivedCount, setArchivedCount] = useState(0);
  
  useEffect(() => {
    // Obtener proyectos archivados
    const archivedProjects = getProjectsByStatus('archived');
    setArchivedCount(archivedProjects.length);
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Header card with white background and simpler styling - matching active projects */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
                <FiArchive className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-black">
                  Proyectos Archivados
                  <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full inline-flex items-center">
                    <span className="w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                    {archivedCount} {archivedCount !== 1 ? 'Proyectos' : 'Proyecto'}
                  </span>
                </h1>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Visualiza el historial de proyectos completados y sus detalles. Estos proyectos pueden ser restaurados si necesitan ser reactivados.
                </p>
              </div>
            </div>
            
            <div className="flex items-center">
              {/* View mode buttons with updated styling */}
              <div className="flex bg-gray-100 p-1 rounded-lg">
                <button 
                  onClick={() => onViewModeChange && onViewModeChange('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#A100FF] shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                  aria-label="Vista en cuadrícula"
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => onViewModeChange && onViewModeChange('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#A100FF] shadow-sm' 
                      : 'text-gray-500 hover:bg-gray-200'
                  }`}
                  aria-label="Vista en lista"
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}