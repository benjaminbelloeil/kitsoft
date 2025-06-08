'use client';

import { motion } from 'framer-motion';
import { Pin, Calendar } from 'lucide-react';
import { Note } from '@/interfaces/note';
import { getPriorityColor } from './constants';

interface NoteListItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (note: Note) => void;
}

export default function NoteListItem({ note, isSelected, onSelect }: NoteListItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onSelect(note)}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isSelected 
          ? 'bg-gray-100 shadow-sm border-gray-300' 
          : 'bg-white hover:shadow-sm border-gray-200'
      }`}
    >
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
            {new Date(note.createdAt).toLocaleDateString('es-ES', { 
              day: 'numeric', 
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
