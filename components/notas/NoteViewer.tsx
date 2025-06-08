'use client';

import { Pin, Trash2, Calendar } from 'lucide-react';
import { Note } from '@/interfaces/note';
import { categories, getCategoryColors, getPriorityColor } from './constants';

interface NoteViewerProps {
  note: Note;
  onTogglePin: (noteId: string) => void;
  onDelete: (noteId: string) => void;
  onEdit: (field: 'title' | 'content', value: string) => void;
}

export default function NoteViewer({
  note,
  onTogglePin,
  onDelete,
  onEdit
}: NoteViewerProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Note Toolbar */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Priority Badge */}
            <div className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm border-2 ${getPriorityColor(note.priority)} ${
              note.priority === 'alta' 
                ? 'border-red-200 ring-2 ring-red-100' 
                : note.priority === 'media'
                ? 'border-yellow-200 ring-2 ring-yellow-100'
                : 'border-green-200 ring-2 ring-green-100'
            }`}>
              <span className="flex items-center gap-1.5">
                {note.priority === 'alta' && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                {note.priority === 'media' && <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>}
                {note.priority === 'baja' && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                {note.priority} prioridad
              </span>
            </div>
            
            {/* Category Badge */}
            <div className={`px-4 py-2 rounded-full font-semibold text-sm shadow-sm border-2 flex items-center gap-2 ${
              (() => {
                const categoryColor = categories.find(cat => cat.id === note.category)?.color || 'gray';
                const colors = getCategoryColors(categoryColor);
                return `${colors.bg} ${colors.text} ${colors.border}`;
              })()
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                (() => {
                  const categoryColor = categories.find(cat => cat.id === note.category)?.color || 'gray';
                  const colors = getCategoryColors(categoryColor);
                  return colors.dot;
                })()
              }`}></div>
              {(() => {
                const categoryIcon = categories.find(cat => cat.id === note.category)?.icon;
                const CategoryIcon = categoryIcon;
                return CategoryIcon ? <CategoryIcon className="h-4 w-4" /> : null;
              })()}
              <span className="capitalize">{note.category}</span>
            </div>
            
            {/* Date Badge */}
            <div className="px-4 py-2 bg-white rounded-full font-medium text-sm text-gray-700 shadow-sm border border-gray-200 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(note.updatedAt).toLocaleDateString('es-ES', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric' 
              })}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTogglePin(note.id)}
              className={`p-2 rounded-lg transition-all ${
                note.isPinned
                  ? 'text-purple-600 bg-purple-100'
                  : 'text-gray-600 hover:text-purple-600 hover:bg-purple-100'
              }`}
              title={note.isPinned ? "Desanclar" : "Anclar"}
            >
              <Pin className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(note.id)}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
              title="Eliminar nota"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Note Title and Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Note Title */}
        <div className="p-6 pb-3">
          <input
            type="text"
            value={note.title}
            onChange={(e) => onEdit('title', e.target.value)}
            className="w-full text-2xl font-semibold text-gray-800 bg-transparent border-none outline-none placeholder-gray-400"
            placeholder="Título de la nota"
          />
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 mx-6"></div>
        
        {/* Note Content */}
        <div className="flex-1 p-6 pt-3">
          <textarea
            value={note.content}
            onChange={(e) => onEdit('content', e.target.value)}
            className="w-full h-full resize-none border-none outline-none text-gray-700 leading-relaxed text-base bg-transparent placeholder-gray-400"
            placeholder="Escribe el contenido de tu nota..."
          />
        </div>
      </div>
    </div>
  );
}
