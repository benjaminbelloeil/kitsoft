/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { motion } from "framer-motion";
import { User } from "lucide-react";

interface UserDropdownProps {
  isOpen: boolean;
  availableUsers: any[];
  projects: any[];
  currentUser: any;
  onUserChange: (newUserId: string) => void;
}

export default function UserDropdown({ 
  isOpen, 
  availableUsers, 
  projects, 
  currentUser, 
  onUserChange 
}: UserDropdownProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="bg-gray-50 border-t border-gray-200 overflow-hidden"
      initial={{ height: 0, opacity: 0 }}
      animate={{ 
        height: "auto", 
        opacity: 1,
        transition: {
          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
          opacity: { duration: 0.2 }
        }
      }}
      exit={{ 
        height: 0, 
        opacity: 0,
        transition: {
          height: { duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] },
          opacity: { duration: 0.1, delay: 0 }
        }
      }}
    >
      <div className="p-3">
        <div className="mb-3">
          <h4 className="font-medium text-sm text-gray-800">Seleccionar Usuario</h4>
        </div>
        
        <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
          {availableUsers.map((availableUser: any) => {
            // Calculate current user's total hours across all projects
            const userTotalHours = projects.reduce((total: number, proj: any) => {
              const userInProject = proj.assignedUsers?.find((u: any) => u.id_usuario === availableUser.id_usuario);
              return total + (userInProject ? userInProject.horas : 0);
            }, 0);
            
            const isCurrentUser = availableUser.id_usuario === currentUser.id_usuario;
            
            return (
              <motion.button
                key={availableUser.id_usuario}
                onClick={() => onUserChange(availableUser.id_usuario)}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  isCurrentUser
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
                whileHover={{ backgroundColor: isCurrentUser ? '#dbeafe' : '#f9fafb' }}
                whileTap={{ scale: 0.99 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {availableUser.url_avatar ? (
                      <img 
                        src={availableUser.url_avatar} 
                        alt={`${availableUser.nombre} ${availableUser.apellido}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-gray-500" />
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-xs truncate">
                        {availableUser.nombre} {availableUser.apellido}
                      </div>
                      {isCurrentUser && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                          Actual
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500 mt-0.5">
                      {availableUser.rol_nombre}
                    </div>
                    
                    {/* Hours and Workload */}
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs">
                        <span className="text-gray-500">Horas:</span>
                        <span className={`ml-1 font-medium ${
                          userTotalHours > 40 ? 'text-red-600' : 
                          userTotalHours > 35 ? 'text-yellow-600' : 
                          'text-green-600'
                        }`}>
                          {userTotalHours}h
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <div className={`h-1.5 w-1.5 rounded-full ${
                          userTotalHours > 40 ? 'bg-red-400' : 
                          userTotalHours > 35 ? 'bg-yellow-400' : 
                          userTotalHours > 0 ? 'bg-green-400' : 'bg-gray-300'
                        }`}></div>
                        <span className="text-xs text-gray-500">
                          {userTotalHours > 40 ? 'No disponible' : 
                           userTotalHours > 35 ? 'Alto' : 
                           userTotalHours > 0 ? 'Normal' : 'Disponible'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
