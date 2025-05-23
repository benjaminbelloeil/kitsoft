'use client';

import { useState, useEffect } from 'react';
import { FiUserPlus, FiUsers } from 'react-icons/fi';
import { Project, Role, User } from '@/interfaces/project';
import ProjectRolesConfig from './ProjectRolesConfig';

interface ProjectAssignmentProps {
  projects: Project[];
  roles: Role[];
  users: User[];
  selectedProject: Project | null;
  onSelectProject: (project: Project) => void;
  onAssignUser: (userId: string, roleId: string, hours: number) => Promise<void>;
  isAssigning: boolean;
  onProjectUpdated?: () => Promise<void>;
}

export default function ProjectAssignment({
  projects,
  roles,
  users,
  selectedProject,
  onSelectProject,
  onAssignUser,
  isAssigning,
  onProjectUpdated
}: ProjectAssignmentProps) {
  // Form state
  const [userId, setUserId] = useState<string>('');
  const [roleId, setRoleId] = useState<string>('');
  const [hours, setHours] = useState<number>(0);
  
  // Reset form when project changes
  useEffect(() => {
    setUserId('');
    setRoleId('');
    setHours(0);
  }, [selectedProject]);
  
  // Filter out users already assigned to this project
  const availableUsers = users.filter(user => {
    if (!selectedProject) return true;
    
    // Ensure selectedProject.usuarios is always an array
    const assignedUsers = selectedProject.usuarios || [];
    
    // Check if user is already assigned to this project
    const alreadyAssigned = assignedUsers.some(
      assigned => assigned.id_usuario === user.id_usuario
    );
    
    return !alreadyAssigned;
  });

  // Filter roles to show only those configured for the selected project
  const availableRoles = roles.filter(role => {
    if (!selectedProject) return false;
    
    // Check if this role is configured for this project
    return selectedProject.roles?.some(
      projectRole => projectRole.id_rol === role.id_rol
    );
  });
  
  // Handle roles configuration update
  const handleRolesConfigUpdated = async () => {
    if (onProjectUpdated) {
      await onProjectUpdated();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject || !userId || !roleId || hours <= 0) {
      return;
    }
    
    await onAssignUser(userId, roleId, hours);
    
    // Reset form after submission
    setUserId('');
    setRoleId('');
    setHours(0);
  };
  
  // Calculate remaining hours
  const getAvailableHours = () => {
    if (!selectedProject) return 0;
    
    const totalHours = selectedProject.horas_totales || 0;
    const assignedHours = selectedProject.usuarios?.reduce(
      (sum, user) => sum + (user.horas || 0),
      0
    ) || 0;
    
    return totalHours - assignedHours;
  };
  
  const availableHours = getAvailableHours();

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] flex items-center justify-center mr-4 shadow-lg border border-[#A100FF20]">
          <FiUserPlus className="w-5 h-5 text-[#A100FF]" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Asignación de Usuarios</h2>
          <p className="text-sm text-gray-500">
            Asigna usuarios y roles a los proyectos
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-grow flex flex-col">
        <div className="space-y-5 flex-grow">
          {/* Project Selection */}
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              Proyecto *
            </label>
            <select
              id="project"
              value={selectedProject?.id_proyecto || ''}
              onChange={(e) => {
                const projectId = e.target.value;
                const project = projects.find(p => p.id_proyecto === projectId);
                if (project) {
                  onSelectProject(project);
                }
              }}
              className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
              required
            >
              <option value="" disabled>Seleccionar proyecto</option>
              {projects.map((project) => (
                <option key={project.id_proyecto} value={project.id_proyecto}>
                  {project.titulo}
                </option>
              ))}
            </select>
            
            {selectedProject && (
              <div className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Horas disponibles:</span>{' '}
                <span className={availableHours > 0 ? 'text-green-600' : 'text-red-600'}>
                  {availableHours}
                </span>
                {' '}de{' '}
                <span className="text-gray-600">{selectedProject.horas_totales}</span>
              </div>
            )}
            {selectedProject && (
              <ProjectRolesConfig
                project={selectedProject}
                allRoles={roles} // Assuming 'roles' here are all available roles
                onConfigUpdated={handleRolesConfigUpdated}
              />
            )}
          </div>
          
          {/* Only show the rest of the form if a project is selected */}
          {selectedProject && (
            <>
              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Rol *
                </label>
                <select
                  id="role"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
                  required
                  disabled={availableRoles.length === 0}
                >
                  <option value="" disabled>Seleccionar rol</option>
                  {availableRoles.length > 0 ? (
                    availableRoles.map((role) => (
                      <option key={role.id_rol} value={role.id_rol}>
                        {role.nombre}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay roles disponibles para este proyecto</option>
                  )}
                </select>
                {availableRoles.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    No hay roles configurados para este proyecto.
                  </p>
                )}
              </div>
              
              {/* User Selection */}
              <div>
                <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
                  Usuario *
                </label>
                <select
                  id="user"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
                  required
                  disabled={availableUsers.length === 0}
                >
                  <option value="" disabled>Seleccionar usuario</option>
                  {availableUsers.length > 0 ? (
                    availableUsers.map((user) => (
                      <option key={user.id_usuario} value={user.id_usuario}>
                        {user.nombre} {user.apellido || ''}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No hay usuarios disponibles</option>
                  )}
                </select>
                {availableUsers.length === 0 && (
                  <p className="mt-2 text-sm text-amber-600">
                    Todos los usuarios ya están asignados a este proyecto.
                  </p>
                )}
              </div>
              
              {/* Hours Input */}
              <div>
                <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                  Horas asignadas *
                </label>
                <input
                  id="hours"
                  type="number"
                  min="1"
                  max={availableHours > 0 ? availableHours : undefined}
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
                  required
                  disabled={availableHours <= 0}
                />
                {availableHours <= 0 && (
                  <p className="mt-2 text-sm text-red-600">
                    No hay horas disponibles para asignar.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
        
        {/* Submit Button */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="w-full py-3 px-4 bg-[#A100FF] text-white font-medium rounded-lg hover:bg-[#8A00FF] focus:outline-none focus:ring-2 focus:ring-[#A100FF40] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={
              isAssigning || 
              !selectedProject || 
              !userId || 
              !roleId || 
              hours <= 0 || 
              hours > availableHours
            }
          >
            {isAssigning ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Asignando...
              </>
            ) : (
              <>
                <FiUsers className="mr-2" />
                Asignar Usuario
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
