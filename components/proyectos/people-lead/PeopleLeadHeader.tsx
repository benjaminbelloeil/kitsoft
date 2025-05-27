'use client';

import { FiUsers, FiSearch, FiX } from "react-icons/fi";

interface PeopleLeadHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalUsers: number;
  activeUsers: number;
}

export default function PeopleLeadHeader({
  searchQuery,
  setSearchQuery,
  totalUsers,
  activeUsers
}: PeopleLeadHeaderProps) {
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
                <FiUsers className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <div>
                  <h1 className="text-3xl font-bold text-black">Gestión de Equipo</h1>
                </div>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Gestiona y supervisa a los miembros de tu equipo asignados.
                </p>
              </div>
            </div>
            
            {/* Enhanced Search bar (expanded) */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar usuarios por nombre o email..."
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
          
          {/* Statistics */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Total de Usuarios</p>
                  <p className="text-2xl font-bold text-blue-700">{totalUsers}</p>
                </div>
                <div className="bg-blue-200 p-2 rounded-lg">
                  <FiUsers className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Usuarios Activos</p>
                  <p className="text-2xl font-bold text-green-700">{activeUsers}</p>
                </div>
                <div className="bg-green-200 p-2 rounded-lg">
                  <FiUsers className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}