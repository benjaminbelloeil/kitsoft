'use client';

import { FiFolder, FiSearch, FiX } from "react-icons/fi";

interface ProjectManagerHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalProjects: number;
  activeProjects: number;
}

export default function ProjectManagerHeader({
  searchQuery,
  setSearchQuery,
  totalProjects,
  activeProjects
}: ProjectManagerHeaderProps) {
  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-8">
      {/* Header card with white background and enhanced styling */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#A100FF05] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#A100FF05] -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] p-3 rounded-lg mr-4 shadow-sm border border-[#A100FF10]">
                <FiFolder className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-black">Gestión de Proyectos</h1>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-50 to-green-100 text-green-800 text-xs font-medium rounded-full inline-flex items-center border border-green-200 shadow-sm">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                    {activeProjects} Activos
                  </span>
                </div>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Administra todos los proyectos desde un solo lugar. Crea, edita y gestiona los proyectos del sistema.
                </p>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {/* Enhanced project stats with better visual appeal */}
              <div className="flex gap-3 text-sm">
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                  <span className="text-gray-500">Total:</span>
                  <span className="ml-1 font-semibold text-gray-800">{totalProjects}</span>
                </div>
                <div className="px-3 py-2 bg-green-50 rounded-md border border-green-100 shadow-sm transition-all hover:shadow-md hover:border-green-200">
                  <span className="text-green-700">Activos:</span>
                  <span className="ml-1 font-semibold text-green-800">{activeProjects}</span>
                </div>
                <div className="px-3 py-2 bg-gray-50 rounded-md border border-gray-100 shadow-sm transition-all hover:shadow-md hover:border-gray-200">
                  <span className="text-gray-500">Inactivos:</span>
                  <span className="ml-1 font-semibold text-gray-600">{totalProjects - activeProjects}</span>
                </div>
              </div>
              
              {/* Enhanced Search bar (expanded) */}
              <div className="flex">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Buscar proyectos por título, cliente o descripción..."
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-0 top-0 h-full flex items-center justify-center pl-3">
                    <FiSearch className="text-gray-400 h-4 w-4" />
                  </div>
                  
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiX className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
