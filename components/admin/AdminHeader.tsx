'use client';

import { FiSettings, FiSearch, FiX } from "react-icons/fi";

interface AdminHeaderProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

export default function AdminHeader({
  searchQuery = '',
  setSearchQuery
}: AdminHeaderProps) {
  return (
    <div className="container px-0">
      {/* Header card with white background and enhanced styling */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 relative overflow-hidden mb-8">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#A100FF05] -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-[#A100FF05] -ml-10 -mb-10"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] p-3 rounded-lg mr-4 shadow-sm border border-[#A100FF10]">
                <FiSettings className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <div>
                  <h1 className="text-2xl font-bold text-black">Panel de Administración</h1>
                </div>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Administra los usuarios del sistema, gestiona roles y permisos, y accede a herramientas administrativas centralizadas.
                </p>
              </div>
            </div>
            
            {/* Enhanced Search bar (if search functionality is needed) */}
            {setSearchQuery && (
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar en panel de administración..."
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
