'use client';

import { FiFileText } from "react-icons/fi";
import { BookOpen, Pin } from "lucide-react";

interface NotesHeaderProps {
  totalNotes: number;
  pinnedNotes: number;
}

export default function NotesHeader({
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
          </div>
        </div>
      </div>
    </div>
  );
}
