/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';
import ProjectCard from './ProjectCard';

interface ProjectManagementSectionProps {
  projects: any[];
  loadingProjects: boolean;
  expandedProject: string | null;
  setExpandedProject: (projectId: string | null) => void;
  hourAssignments: Record<string, number>;
  setHourAssignments: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  editingUserAssignment: string | null;
  setEditingUserAssignment: (id: string | null) => void;
  availableUsers: any[];
  handleUserChange: (projectId: string, userAssignmentId: string, newUserId: string) => void;
  calculateUserCargabilidad: (userHours: number, projectTotalHours: number) => number;
  getTotalAssignedHours: (projectId: string) => number;
  isValidAssignment: (projectId: string) => boolean;
  saveHourAssignments: (projectId: string) => void;
  savingHours: string | null;
}

const ProjectManagementSection: React.FC<ProjectManagementSectionProps> = ({
  projects,
  loadingProjects,
  expandedProject,
  setExpandedProject,
  hourAssignments,
  setHourAssignments,
  editingUserAssignment,
  setEditingUserAssignment,
  availableUsers,
  handleUserChange,
  calculateUserCargabilidad,
  getTotalAssignedHours,
  isValidAssignment,
  saveHourAssignments,
  savingHours
}) => {
  return (
    <motion.div 
      className="lg:col-span-1"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3 }}
    >
      <motion.div 
        className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full"
        whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ duration: 0.2 }}
      >
        <motion.div 
          className="p-6 border-b border-gray-100"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center">
            <motion.div 
              className="w-10 h-10 bg-gradient-to-br from-[#3B82F610] to-[#3B82F620] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#3B82F610]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <FolderOpen className="w-5 h-5 text-[#3B82F6]" />
            </motion.div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Gestión de Proyectos
              </h2>
              <p className="text-sm text-gray-500">
                Asigna horas de trabajo a los usuarios
              </p>
            </div>
          </div>
        </motion.div>

        <div className="p-4">
          {/* Projects List */}
          <div className="space-y-3">
            {loadingProjects ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6] mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Cargando proyectos...</p>
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No tienes proyectos asignados</p>
              </div>
            ) : (
              projects.map((project: any, index: number) => (
                <ProjectCard
                  key={project.id_proyecto}
                  project={project}
                  index={index}
                  expandedProject={expandedProject}
                  setExpandedProject={setExpandedProject}
                  hourAssignments={hourAssignments}
                  setHourAssignments={setHourAssignments}
                  editingUserAssignment={editingUserAssignment}
                  setEditingUserAssignment={setEditingUserAssignment}
                  availableUsers={availableUsers}
                  projects={projects}
                  handleUserChange={handleUserChange}
                  calculateUserCargabilidad={calculateUserCargabilidad}
                  getTotalAssignedHours={getTotalAssignedHours}
                  isValidAssignment={isValidAssignment}
                  saveHourAssignments={saveHourAssignments}
                  savingHours={savingHours}
                />
              ))
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProjectManagementSection;
