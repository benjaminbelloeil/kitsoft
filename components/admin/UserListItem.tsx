/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiEdit2, FiCheck, FiX, FiTrash2, FiMail, FiClock } from "react-icons/fi";
import { User, UserRole } from '@/utils/database/client/userManagementSync';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';

interface UserListItemProps {
  user: User;
  roles: UserRole[];
  onConfirmRoleChange: (userId: string, roleId: string) => void;
  onConfirmDelete: (userId: string) => void;
}

export default function UserListItem({ 
  user, 
  roles, 
  onConfirmRoleChange, 
  onConfirmDelete 
}: UserListItemProps) {
  const [editingUser, setEditingUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Start editing a user's role
  const startEditing = (currentRoleId?: string) => {
    setEditingUser(true);
    setSelectedRole(currentRoleId || null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(false);
    setSelectedRole(null);
  };

  // Get badge color based on role
  const getRoleBadgeStyle = (user: User) => {
    if (!user.registered) return 'bg-gray-100 text-gray-800';
    if (user.role?.numero === 1) return 'bg-purple-100 text-purple-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  // Get role label text
  const getRoleLabel = (user: User) => {
    if (!user.registered) return "Sin registrar";
    return user.role?.titulo || "Empleado"; 
  };

  // Format the last login date if available
  const formatLastLogin = (lastLogin: string | null | undefined) => {
    if (!lastLogin) return null;
    
    const date = new Date(lastLogin);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return null;
    
    // Format date in Spanish
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const lastLoginDate = formatLastLogin(user.lastLogin);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-xl shadow-sm p-4 transition-all duration-200 hover:shadow border border-gray-100"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {user.url_avatar ? (
            <img 
              src={user.url_avatar} 
              alt={`${user.nombre || ''} ${user.apellido || ''}`} 
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <PlaceholderAvatar size={48} />
          )}
        </div>
        
        <div className="ml-4 flex-1">
          <div className="flex items-baseline">
            <h3 className="text-lg font-medium text-gray-900">
              {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : "Usuario sin nombre"}
            </h3>
          </div>
          
          {/* Email display */}
          <div className="flex items-center text-sm text-gray-500 truncate">
            {user.email ? (
              <>
                <FiMail className="mr-1 text-gray-400" size={14} />
                <span>{user.email}</span>
              </>
            ) : (
              <span className="text-gray-400">Sin correo electrónico</span>
            )}
          </div>
          
          {/* Show last login as a small text under the title - only if there is a last login */}
          {lastLoginDate && (
            <div className="flex items-center text-xs text-gray-400 mt-1">
              <FiClock className="mr-1" size={12} />
              <span>Último acceso: {lastLoginDate}</span>
            </div>
          )}
          
          <p className="text-sm text-gray-500 truncate">
            {user.titulo || "Sin título profesional"}
          </p>
        </div>
        
        <div className="ml-4 flex items-center">
          {editingUser ? (
            <div className="flex items-center space-x-2">
              <select
                className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-0"
                value={selectedRole || ""}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="" disabled>Seleccionar rol</option>
                {roles.map(role => (
                  <option key={role.id_nivel} value={role.id_nivel}>
                    {role.titulo}
                  </option>
                ))}
              </select>
              
              <button 
                onClick={() => {
                  if (selectedRole) {
                    onConfirmRoleChange(user.id_usuario, selectedRole);
                    cancelEditing();
                  }
                }}
                disabled={!selectedRole}
                className={`p-2 text-white rounded-full focus:outline-none focus:ring-0 admin-action-btn ${
                  selectedRole ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
                title="Guardar"
              >
                <FiCheck size={16} className="text-white" />
              </button>
              
              <button 
                onClick={cancelEditing}
                className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-0 admin-action-btn"
                title="Cancelar"
              >
                <FiX size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <span 
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(user)}`}
              >
                <FiUser className="mr-1.5" />
                {getRoleLabel(user)}
              </span>
              
              <button 
                onClick={() => startEditing(user.role?.id_nivel)}
                className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors focus:outline-none focus:ring-0 admin-action-btn"
                title="Editar rol"
              >
                <FiEdit2 size={16} className="text-indigo-500 group-hover:text-purple-600" />
              </button>
              
              <button 
                onClick={() => onConfirmDelete(user.id_usuario)}
                className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-0 admin-action-btn"
                title="Eliminar usuario"
              >
                <FiTrash2 size={16} className="text-rose-500 group-hover:text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
