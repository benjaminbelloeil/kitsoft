'use client';

import { FiFileText, FiSearch, FiX } from "react-icons/fi";
import { BookOpen, Pin } from "lucide-react";

interface NotesHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalNotes: number;
  pinnedNotes: number;
}

export default function NotesHeader({
  searchQuery,
  setSearchQuery,
  totalNotes,
  pinnedNotes
}: NotesHeaderProps) {
  return (
    <div className="max-w-[1400px] mx-auto py-6 px-4 sm:px-6 lg:px-8 mb-2">
      {/* Header card with white background and enhanced styling */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div>
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <div className="flex items-center">
              <div className="bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] p-3 rounded-lg mr-4 shadow-sm border border-[#A100FF10]">
                <FiFileText className="h-6 w-6 text-[#A100FF]" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-black">Mis Notas</h1>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full inline-flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {totalNotes} Total
                    </span>
                    {pinnedNotes > 0 && (
                      <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full inline-flex items-center">
                        <Pin className="w-3 h-3 mr-1" />
                        {pinnedNotes} Fijadas
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mt-2 max-w-2xl">
                  Organiza tus ideas, proyectos y recordatorios en un solo lugar. Crea, edita y gestiona tus notas de manera eficiente.
                </p>
              </div>
            </div>
            
            {/* Enhanced Search bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar en tus notas..."
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
  );
}
