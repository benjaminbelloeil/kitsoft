/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import UserDropdown from './UserDropdown';

interface UserAssignmentCardProps {
  user: any;
  userIndex: number;
  hourAssignments: Record<string, number>;
  setHourAssignments: (assignments: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>)) => void;
  editingUserAssignment: string | null;
  setEditingUserAssignment: (id: string | null) => void;
  availableUsers: any[];
  projects: any[];
  project: any;
  onUserChange: (projectId: string, userProjectId: string, newUserId: string) => void;
  calculateUserCargabilidad: (userHours: number, projectTotalHours: number) => number;
}

export default function UserAssignmentCard({
  user,
  userIndex,
  hourAssignments,
  setHourAssignments,
  editingUserAssignment,
  setEditingUserAssignment,
  availableUsers,
  projects,
  project,
  onUserChange,
  calculateUserCargabilidad
}: UserAssignmentCardProps) {
  return (
    <div key={user.id_usuario_proyecto}>
      {/* Normal user card - always visible */}
      <motion.div 
        className={`flex flex-col rounded-lg border ${
          editingUserAssignment === user.id_usuario_proyecto 
            ? "border-gray-300 bg-white overflow-hidden" 
            : "border-gray-200 bg-white"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: userIndex * 0.1 }}
        style={{ 
          overflow: editingUserAssignment === user.id_usuario_proyecto ? "hidden" : "visible"
        }}
      >
        {/* User info section - always visible */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-[#3B82F610] flex items-center justify-center mr-2 overflow-hidden">
              {user.url_avatar ? (
                <img 
                  src={user.url_avatar} 
                  alt={`${user.nombre} ${user.apellido}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-3 w-3 text-[#3B82F6]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-800">{user.nombre} {user.apellido}</p>
              <div className="flex items-center space-x-2">
                <p className="text-[10px] text-gray-500">{user.rol_nombre}</p>
                {/* Show user's cargabilidad percentage - real-time calculation */}
                {(() => {
                  const currentHours = hourAssignments[user.id_usuario_proyecto] ?? user.horas;
                  const cargabilidad = calculateUserCargabilidad(currentHours, project.horas_totales);
                  return cargabilidad > 0 ? (
                    <span className="text-[10px] font-medium text-[#3B82F6] bg-[#3B82F610] px-1 py-0.5 rounded">
                      {cargabilidad}% del proyecto
                    </span>
                  ) : null;
                })()}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="relative user-dropdown-container">
              <motion.button
                onClick={() => setEditingUserAssignment(
                  editingUserAssignment === user.id_usuario_proyecto 
                    ? null 
                    : user.id_usuario_proyecto
                )}
                className={`p-1 hover:bg-[#3B82F610] rounded transition-all ${
                  editingUserAssignment === user.id_usuario_proyecto 
                    ? "text-[#3B82F6] bg-[#3B82F610]" 
                    : "text-gray-400 hover:text-[#3B82F6]"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                title="Cambiar usuario"
              >
                <User className="h-3 w-3" />
              </motion.button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              min="0"
              max={project.horas_totales}
              value={hourAssignments[user.id_usuario_proyecto] !== undefined 
                ? hourAssignments[user.id_usuario_proyecto].toString() 
                : user.horas.toString()}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                const numValue = value === '' ? 0 : parseInt(value);
                setHourAssignments((prev: Record<string, number>) => ({
                  ...prev,
                  [user.id_usuario_proyecto]: numValue
                }));
              }}
              onFocus={(e) => e.target.select()}
              className="w-12 px-1 py-1 text-xs text-center border border-gray-300 rounded-md focus:ring-1 focus:ring-[#3B82F620] focus:border-[#3B82F6] focus:outline-none"
              placeholder="0"
            />
            <span className="text-xs text-gray-600">h</span>
          </div>
        </div>

        {/* Dropdown user selection - animated in the same card */}
        <AnimatePresence initial={false}>
          <UserDropdown
            isOpen={editingUserAssignment === user.id_usuario_proyecto}
            availableUsers={availableUsers}
            projects={projects}
            currentUser={user}
            onUserChange={(newUserId: string) => onUserChange(
              project.id_proyecto, 
              user.id_usuario_proyecto, 
              newUserId
            )}
          />
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
