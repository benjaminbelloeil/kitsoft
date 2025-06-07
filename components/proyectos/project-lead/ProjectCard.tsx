/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Clock as ClockIcon } from 'lucide-react';
import UserAssignmentCard from './UserAssignmentCard';

interface ProjectCardProps {
  project: any;
  index: number;
  expandedProject: string | null;
  setExpandedProject: (projectId: string | null) => void;
  hourAssignments: Record<string, number>;
  setHourAssignments: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  editingUserAssignment: string | null;
  setEditingUserAssignment: (id: string | null) => void;
  availableUsers: any[];
  projects: any[];
  handleUserChange: (projectId: string, userAssignmentId: string, newUserId: string) => void;
  calculateUserCargabilidad: (userHours: number, projectTotalHours: number) => number;
  getTotalAssignedHours: (projectId: string) => number;
  isValidAssignment: (projectId: string) => boolean;
  saveHourAssignments: (projectId: string) => void;
  savingHours: string | null;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  expandedProject,
  setExpandedProject,
  hourAssignments,
  setHourAssignments,
  editingUserAssignment,
  setEditingUserAssignment,
  availableUsers,
  projects,
  handleUserChange,
  calculateUserCargabilidad,
  getTotalAssignedHours,
  isValidAssignment,
  saveHourAssignments,
  savingHours
}) => {
  return (
    <motion.div 
      key={project.id_proyecto} 
      className="border border-gray-200 rounded-lg overflow-hidden transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="p-3">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-sm text-gray-800">{project.titulo}</h3>
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {project.assignedUsers?.length || 0} usuarios
            </div>
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1" />
              {project.assignedHours}/{project.horas_totales}h
            </div>
          </div>
        </div>
        
        {/* Enhanced Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-3 mb-3 relative overflow-hidden shadow-inner">
          <motion.div 
            className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#2563EB] h-3 rounded-full relative"
            initial={{ width: 0 }}
            animate={{ width: `${project.assignedPercentage}%` }}
            transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
          >
            {/* Animated shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-60"></div>
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F680] to-[#2563EB80] blur-sm"></div>
          </motion.div>
        </div>
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-gray-600 font-medium">{project.assignedPercentage}% horas asignadas</span>
          <span className="text-[#3B82F6] font-semibold">{project.availableHours}h disponibles</span>
        </div>
        
        {/* Project actions */}
        <div className="flex justify-end">
          <motion.button 
            onClick={() => setExpandedProject(expandedProject === project.id_proyecto ? null : project.id_proyecto)}
            className="px-3 py-1.5 text-xs bg-[#3B82F610] hover:bg-[#3B82F620] text-[#3B82F6] rounded-md transition-all font-medium border border-[#3B82F620] hover:border-[#3B82F630]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {expandedProject === project.id_proyecto ? 'Ocultar asignación' : 'Asignar horas'}
          </motion.button>
        </div>
      </div>

      {/* Expandable hour assignment section */}
      <AnimatePresence>
        {expandedProject === project.id_proyecto && (
          <motion.div 
            className="border-t border-gray-200 bg-gray-50 p-3"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-sm text-gray-800">Asignación de Horas</h4>
                <div className="text-xs">
                  <span className={`font-semibold ${isValidAssignment(project.id_proyecto) ? 'text-[#3B82F6]' : 'text-red-500'}`}>
                    {project.horas_totales - getTotalAssignedHours(project.id_proyecto)}h
                  </span>
                  <span className="text-gray-600 ml-1">disponibles</span>
                </div>
              </div>
              
              {/* User hour assignments */}
              <div className="space-y-2">
                {project.assignedUsers?.map((user: any, userIndex: number) => (
                  <UserAssignmentCard
                    key={user.id_usuario_proyecto}
                    user={user}
                    userIndex={userIndex}
                    project={project}
                    hourAssignments={hourAssignments}
                    setHourAssignments={setHourAssignments}
                    editingUserAssignment={editingUserAssignment}
                    setEditingUserAssignment={setEditingUserAssignment}
                    availableUsers={availableUsers}
                    projects={projects}
                    onUserChange={handleUserChange}
                    calculateUserCargabilidad={calculateUserCargabilidad}
                  />
                ))}
              </div>
              
              {/* Save and Cancel buttons */}
              <div className="mt-3 flex justify-between">
                <motion.button 
                  onClick={() => {
                    setExpandedProject(null);
                    setHourAssignments({});
                  }}
                  className="px-3 py-1.5 text-xs font-medium rounded-md transition-all bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancelar
                </motion.button>
                <motion.button 
                  onClick={() => saveHourAssignments(project.id_proyecto)}
                  disabled={!isValidAssignment(project.id_proyecto) || savingHours === project.id_proyecto}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto
                      ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300 shadow-sm'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                  whileHover={isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto ? { scale: 1.05 } : {}}
                  whileTap={isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto ? { scale: 0.95 } : {}}
                >
                  {savingHours === project.id_proyecto ? 'Guardando...' : 'Guardar Asignación'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectCard;
