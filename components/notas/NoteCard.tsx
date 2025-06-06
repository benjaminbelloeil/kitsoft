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
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  color: string;
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

export default function NoteCard({ note, onUpdate, onDelete, onTogglePin }: NoteCardProps) {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short' 
    });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim() && editContent.trim()) {
      onUpdate({
        ...note,
        title: editTitle.trim(),
        content: editContent.trim()
      });
      setIsEditing(false);
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
      whileHover={{ y: -1 }}
      transition={{ duration: 0.15 }}
    >
      <div 
        className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors duration-200 overflow-hidden relative"
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
                  className="px-3 py-1.5 text-xs bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          ) : (
            // View mode
            <>
              <div className="mb-3">
                <h3 className="font-medium text-gray-900 leading-tight mb-2">
                  {note.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{categoryLabels[note.category]}</span>
                  <span>•</span>
                  <span className="capitalize">{note.priority}</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {truncateContent(note.content)}
                </p>
              </div>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {note.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                        +{note.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
                {formatDate(note.updatedAt)}
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
