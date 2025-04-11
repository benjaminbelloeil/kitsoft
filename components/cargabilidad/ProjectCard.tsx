'use client';

import { FiCalendar, FiClock, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { CircularProgress } from './CircularProgress';

interface Props {
  project: {
    name: string;
    load: number;
    deadline?: string;
    hoursPerWeek: number;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onEdit, onDelete }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex flex-col items-center text-center">
      
      <h2 className="text-lg font-semibold mt-4">{project.name}</h2>
      <CircularProgress value={project.load} />
      {project.deadline && (
        <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
          <FiCalendar size={14} />
          <span>Fecha límite: {project.deadline}</span>
        </div>
      )}

      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
        <FiClock size={14} />
        <span>{project.hoursPerWeek} horas/semana</span>
      </div>
      
      <div className="flex gap-3 mt-4 text-gray-500 text-sm">
        <button title='Editar' className="hover:text-indigo-600 cursor-pointer p-2 hover:bg-indigo-50 rounded-full transition-colors" onClick={onEdit}>
          <FiEdit2 size={16} title="Editar" />
        </button>
        <button title='Eliminar' className="hover:text-red-600 cursor-pointer p-2 hover:bg-red-50 rounded-full transition-colors" onClick={onDelete}>
          <FiTrash2 size={16} title="Eliminar" />
        </button>
      </div>
    </div>
  );
};
