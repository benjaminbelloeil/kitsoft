'use client';

import { useState, useEffect } from 'react';
import { getProjectsByStatus } from '@/app/lib/data';

interface ArchivedProjectsHeaderProps {
  userName?: string;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ArchivedProjectsHeader({ 
  userName = "Nombre de usuario", 
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
    <div className="mb-6">
      {/* Header principal */}
      <div className="bg-[#A100FF] rounded-t-xl p-4 md:p-6 text-white flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#A100FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold">Proyectos Archivados</h1>
            <p className="text-sm opacity-90">Historial de proyectos</p>
          </div>
        </div>

        <div className="flex items-center">
          <span className="mr-4 text-lg font-medium">{userName}</span>
          <div className="bg-white bg-opacity-10 px-4 py-2 rounded-md">
            <span className="text-lg font-semibold">{archivedCount} proyecto{archivedCount !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>
      
      {/* Sección de botones de visualización */}
      <div className="bg-white rounded-b-xl shadow-md p-4 flex justify-end border-t border-gray-100">
        <div className="flex rounded-md overflow-hidden">
          <button 
            onClick={() => onViewModeChange && onViewModeChange('grid')}
            className={`flex items-center px-3 py-1.5 ${
              viewMode === 'grid' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button 
            onClick={() => onViewModeChange && onViewModeChange('list')}
            className={`flex items-center px-3 py-1.5 ${
              viewMode === 'list' ? 'bg-[#A100FF] text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}