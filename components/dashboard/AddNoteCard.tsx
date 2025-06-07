"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, FileText, ChevronRight, Calendar, Pin } from "lucide-react";
import { Note } from "@/interfaces/note";
import { getUserNotes } from "@/utils/database/client/notesSync";

export default function AddNoteCard() {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const notes = await getUserNotes();
        // Get the 2 most recent notes by updatedAt
        const sortedNotes = notes
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 2);
        setRecentNotes(sortedNotes);
      } catch (error) {
        console.error('Error fetching recent notes:', error);
        setRecentNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNotes();
  }, []);

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "alta": return "text-red-700 bg-red-50";
      case "media": return "text-yellow-700 bg-yellow-50";
      case "baja": return "text-green-700 bg-green-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-amber-500" />
          Mis Notas
        </h2>
        <Link href="/dashboard/notas" className="text-sm font-medium text-amber-500 hover:text-amber-600 flex items-center">
          Ver todas <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        {/* Loading State */}
        {loading ? (
          <div className="space-y-3 mb-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="p-3 border border-gray-100 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : recentNotes.length > 0 ? (
          /* Recent Notes Preview */
          <div className="space-y-1 mb-4">
            {recentNotes.map((note) => {
              return (
                <Link key={note.id} href={`/dashboard/notas?note=${note.id}`} className="block">
                  <div className="p-3 rounded-lg cursor-pointer transition-all duration-200 bg-white hover:shadow-sm border-2 border-gray-100 hover:border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm line-clamp-1 flex-1">
                        {note.title}
                      </h4>
                      {note.isPinned && (
                        <Pin className="h-3.5 w-3.5 text-gray-600 ml-2 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                      {note.content}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${getPriorityColor(note.priority)} ${
                          note.priority === 'alta' 
                            ? 'border-red-200' 
                            : note.priority === 'media'
                            ? 'border-yellow-200'
                            : 'border-green-200'
                        }`}>
                          {note.priority === 'alta' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                          {note.priority === 'media' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>}
                          {note.priority === 'baja' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
                          {note.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-50 border border-gray-200 px-2 py-1 rounded-full">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span className="font-semibold text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          /* Empty State - Matching other cards' style */
          <div className="flex flex-col items-center justify-center py-8 px-4 mb-4">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 border border-amber-100">
              <FileText className="w-6 h-6 text-amber-500" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No hay notas aún</h3>
            <p className="text-sm text-gray-500 text-center max-w-sm">
              Crea tu primera nota para comenzar a organizar tus ideas y pensamientos.
            </p>
          </div>
        )}

        {/* Create New Note Button - Always at bottom */}
        <Link href="/dashboard/notas" className="block">
          <div className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-all bg-white shadow-sm hover:shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Plus className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Crear nueva nota</h3>
                  <p className="text-sm text-gray-500">Organiza tus ideas y pensamientos</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
