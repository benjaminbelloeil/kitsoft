'use client';

import { useState } from 'react';
import { FiInfo, FiLayers, FiClock, FiUsers, FiFilter } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Project, Role, User } from '@/interfaces/project';

interface ProjectUsersListProps {
  project: Project | null;
  users: User[];
  roles: Role[];
}

export default function ProjectUsersList({
  project,
  users,
  roles
}: ProjectUsersListProps) {
  const [filterRole, setFilterRole] = useState<string>('all');

  // Get assigned users for the current project
  const assignedUsers = project?.usuarios || [];

  // Filter assigned users by role
  const filteredUsers = filterRole === 'all' 
    ? assignedUsers
    : assignedUsers.filter(user => user.id_rol === filterRole);
    
  // Map of role IDs to role names
  const roleMap = roles.reduce((acc, role) => {
    acc[role.id_rol] = role.nombre;
    return acc;
  }, {} as Record<string, string>);
  
  // User name map
  const userMap = users.reduce((acc, user) => {
    acc[user.id_usuario] = `${user.nombre} ${user.apellido || ''}`;
    return acc;
  }, {} as Record<string, string>);

  // Calculate hours stats
  const totalAssignedHours = assignedUsers.reduce((sum, user) => sum + (user.horas || 0), 0);
  const totalProjectHours = project?.horas_totales || 0;
  const remainingHours = totalProjectHours - totalAssignedHours;
  const percentAssigned = totalProjectHours > 0 ? Math.round((totalAssignedHours / totalProjectHours) * 100) : 0;

  if (!project) {
    return (
      <motion.div 
        key="empty"
        className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center h-full flex flex-col justify-center items-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="w-20 h-20 bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] rounded-full flex items-center justify-center mb-6 border-2 border-[#A100FF20] shadow-lg"
        >
          <FiInfo className="h-8 w-8 text-[#A100FF]" />
        </div>
        
        <h2 
          className="text-2xl font-semibold mb-3 text-gray-800"
        >
          Selecciona un proyecto
        </h2>
        
        <p 
          className="text-gray-600 mb-8 max-w-md mx-auto"
        >
          Selecciona un proyecto para ver los usuarios asignados y gestionar las asignaciones.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full flex flex-col"
    >
      {/* Project Users List Display */}
      <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#A100FF20]">
              <FiUsers className="w-5 h-5 text-[#A100FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Usuarios Asignados
              </h2>
              <p className="text-sm text-gray-500">
                Proyecto: <span className="font-medium">{project.titulo}</span>
              </p>
            </div>
          </div>

          {/* Project hours summary */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
              <div className="text-blue-800 text-xs font-medium mb-1 flex items-center">
                <FiClock className="mr-1" /> HORAS ASIGNADAS
              </div>
              <div className="text-lg font-bold text-blue-900">
                {totalAssignedHours}
                <span className="text-xs font-normal text-blue-600 ml-1">
                  ({percentAssigned}%)
                </span>
              </div>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100">
              <div className="text-green-800 text-xs font-medium mb-1 flex items-center">
                <FiClock className="mr-1" /> HORAS TOTALES
              </div>
              <div className="text-lg font-bold text-green-900">
                {totalProjectHours}
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
              <div className="text-amber-800 text-xs font-medium mb-1 flex items-center">
                <FiClock className="mr-1" /> HORAS RESTANTES
              </div>
              <div className="text-lg font-bold text-amber-900">
                {remainingHours}
              </div>
            </div>
          </div>

          {/* Progress bar for hours allocation */}
          <div className="mb-4">
            <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#A100FF]" 
                style={{
                  width: `${percentAssigned}%`,
                  transition: 'width 0.5s ease'
                }}
              ></div>
            </div>
          </div>

          {/* Role filter */}
          <div className="flex items-center">
            <FiFilter className="mr-2 text-gray-500" />
            <span className="text-sm text-gray-600 mr-2">Filtrar por rol:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="border border-gray-200 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
            >
              <option value="all">Todos</option>
              {roles.map(role => (
                <option key={role.id_rol} value={role.id_rol}>
                  {role.nombre}
                </option>
              ))}
            </select>
            <span className="ml-auto text-sm text-gray-500">
              {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {filteredUsers.length > 0 ? (
          <>
            {/* Table Header */}
            <div className="bg-gray-50 sticky top-0 z-10 shadow-sm border-b border-gray-200">
              <div className="grid grid-cols-5 px-6 py-3">
                <div className="text-xs font-semibold text-gray-600 uppercase">Usuario</div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Rol</div>
                <div className="text-xs font-semibold text-gray-600 uppercase">Horas</div>
                <div className="text-xs font-semibold text-gray-600 uppercase">% del Proyecto</div>
                <div className="text-xs font-semibold text-gray-600 uppercase text-center">Estado</div>
              </div>
            </div>
            
            {/* User Rows */}
            <div className="overflow-y-auto flex-grow">
              {filteredUsers.map((user, index) => {
                // Calculate the percentage of project hours for this user
                const userHoursPercent = totalProjectHours > 0 
                  ? Math.round(((user.horas || 0) / totalProjectHours) * 100) 
                  : 0;
                
                return (
                  <div 
                    key={user.id_usuario_proyecto} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors`}
                    style={{
                      opacity: 1,
                      transform: 'translateY(0px)',
                      transition: `opacity 0.2s, transform 0.2s ${index * 0.03}s`
                    }}
                  >
                    <div className="grid grid-cols-5 px-6 py-4 gap-2 items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {userMap[user.id_usuario] || 'Usuario desconocido'}
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center">
                        <FiLayers className="mr-2 text-[#A100FF]" />
                        {roleMap[user.id_rol] || 'Rol desconocido'}
                      </div>
                      
                      <div className="text-sm text-gray-600 flex items-center">
                        <FiClock className="mr-2 text-blue-500" />
                        {user.horas || 0}
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>{userHoursPercent}%</span>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full" 
                              style={{ width: `${userHoursPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                          Activo
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiUsers className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay usuarios asignados
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                {filterRole !== 'all' 
                  ? 'No hay usuarios asignados con el rol seleccionado para este proyecto.'
                  : 'Este proyecto aún no tiene usuarios asignados. Utiliza el formulario de asignación para agregar usuarios.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
