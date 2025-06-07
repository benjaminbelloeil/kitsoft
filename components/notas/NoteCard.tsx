'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Pin, 
  MoreVertical, 
  Edit3, 
  Trash2
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
  priority: 'alta' | 'media' | 'baja';
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

interface NoteCardProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onTogglePin: (noteId: string) => void;
}

const categoryLabels = {
  personal: 'Personal',
  trabajo: 'Trabajo', 
  proyecto: 'Proyecto',
  reunión: 'Reunión',
  idea: 'Idea'
};

// Helper function to get category colors
const getCategoryColors = (category: string) => {
  const colorMap: Record<string, string> = {
    personal: '#60A5FA', // blue-400
    trabajo: '#4ADE80',   // green-400
    proyecto: '#A78BFA',  // purple-400
    reunión: '#FB923C',   // orange-400
    idea: '#FACC15'       // yellow-400
  };
  
  return colorMap[category] || '#9CA3AF'; // gray-400
};

export default function NoteCard({ note, onUpdate, onDelete, onTogglePin }: NoteCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };

  const handleSaveEdit = async () => {
    if (editTitle.trim() && editContent.trim()) {
      setIsSaving(true);
      try {
        await onUpdate({
          ...note,
          title: editTitle.trim(),
          content: editContent.trim()
        });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating note:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(false);
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      layout
      className="relative group"
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div 
        className="bg-white rounded-lg transition-all duration-200 overflow-hidden relative shadow-sm"
        style={{ 
          border: `2px solid ${getCategoryColors(note.category)}`,
        }}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* Pin indicator */}
        {note.isPinned && (
          <div className="absolute top-3 right-3 z-10">
            <Pin className="w-3.5 h-3.5 text-gray-400 fill-current" />
          </div>
        )}

        {/* Actions dropdown */}
        {showActions && !isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-3 right-8 z-20"
          >
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 rounded-md bg-white hover:bg-gray-50 transition-colors shadow-sm border border-gray-200"
              >
                <MoreVertical className="w-3.5 h-3.5 text-gray-600" />
              </button>
              
              <div className="absolute right-0 top-7 bg-white rounded-md shadow-lg border border-gray-200 py-1 min-w-[120px] z-30">
                <button
                  onClick={() => {
                    onTogglePin(note.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Pin className="w-3 h-3" />
                  {note.isPinned ? 'Desfijar' : 'Fijar'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-gray-700"
                >
                  <Edit3 className="w-3 h-3" />
                  Editar
                </button>
                <button
                  onClick={() => {
                    onDelete(note.id);
                    setShowActions(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 text-gray-700 flex items-center gap-2"
                >
                  <Trash2 className="w-3 h-3" />
                  Eliminar
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="p-4">
          {isEditing ? (
            // Edit mode
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full text-base font-medium bg-transparent border-b border-gray-200 focus:border-gray-400 focus:outline-none pb-1"
                placeholder="Título de la nota..."
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full text-sm bg-transparent border border-gray-200 rounded-md p-2 focus:border-gray-400 focus:outline-none resize-none"
                rows={4}
                placeholder="Contenido de la nota..."
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 min-w-[70px] ${
                    isSaving 
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-gray-900 hover:bg-gray-800'
                  } text-white`}
                >
                  {isSaving ? (
                    <div className="flex items-center justify-center">
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    'Guardar'
                  )}
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 leading-tight mb-2 text-base">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                    note.category === 'personal' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : note.category === 'trabajo'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : note.category === 'proyecto'
                      ? 'bg-purple-50 text-purple-700 border-purple-200'
                      : note.category === 'reunión'
                      ? 'bg-orange-50 text-orange-700 border-orange-200'
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      note.category === 'personal' 
                        ? 'bg-blue-500' 
                        : note.category === 'trabajo'
                        ? 'bg-green-500'
                        : note.category === 'proyecto'
                        ? 'bg-purple-500'
                        : note.category === 'reunión'
                        ? 'bg-orange-500'
                        : 'bg-yellow-500'
                    }`}></span>
                    {categoryLabels[note.category]}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full border flex items-center gap-1 ${
                    note.priority === 'alta' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : note.priority === 'media'
                      ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                      : 'bg-green-50 text-green-700 border-green-200'
                  }`}>
                    {note.priority === 'alta' && <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                    {note.priority === 'media' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span>}
                    {note.priority === 'baja' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>}
                    {note.priority}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{truncateContent(note.content)}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-2 border-t border-gray-200 font-medium">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span>{formatDate(note.updatedAt)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
