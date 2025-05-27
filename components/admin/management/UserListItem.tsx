/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiEdit2, FiCheck, FiX, FiTrash2, FiMail, FiClock, FiUserX } from "react-icons/fi";
import { User, UserRole } from '@/interfaces/user';
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
    if (!user.registered || !user.hasLoggedIn) return 'bg-gray-100 text-gray-800';
    if (user.role?.numero === 1) return 'bg-purple-100 text-purple-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  // Get role label text
  const getRoleLabel = (user: User) => {
    if (!user.registered || !user.hasLoggedIn) return "Sin registrar";
    return user.role?.titulo || "Sin rol"; 
  };

  // Get the appropriate icon for the user's status
  const getRoleIcon = (user: User) => {
    if (!user.registered || !user.hasLoggedIn) return <FiUserX className="mr-1.5" />;
    return <FiUser className="mr-1.5" />;
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
  
  // Determine if the user email exists
  const hasEmail = user.email && user.email.trim() !== '';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -1,
        zIndex: 5
      }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="bg-white rounded-xl shadow-sm px-5 py-7 border-2 border-gray-100 hover:border-gray-200 relative z-0 cursor-pointer transition-all duration-200 hover:shadow-md"
      style={{ 
        isolation: 'isolate',
        willChange: 'transform'
      }}
    >
      <div className="flex items-center">
        <motion.div 
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          {user.url_avatar ? (
            <img 
              src={user.url_avatar} 
              alt={`${user.nombre || ''} ${user.apellido || ''}`} 
              className="h-12 w-12 rounded-full object-cover border border-gray-200"
            />
          ) : (
            <PlaceholderAvatar size={48} />
          )}
        </motion.div>
        
        <motion.div 
          className="ml-4 flex-1 min-w-0"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="flex items-baseline">
            <motion.h3 
              className="text-lg font-medium text-gray-900 truncate"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {user.nombre && user.apellido ? `${user.nombre} ${user.apellido}` : "Usuario sin nombre"}
            </motion.h3>
          </div>
          
          {/* Email display */}
          <motion.div 
            className="flex items-center text-sm text-gray-500 truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {hasEmail ? (
              <>
                <FiMail className="mr-1 text-gray-400" size={14} />
                <span>{user.email}</span>
              </>
            ) : (
              <span className="text-gray-400">Sin correo electrónico</span>
            )}
          </motion.div>
          
          {/* Show last login as a small text under the title - only if there is a last login */}
          {lastLoginDate && (
            <motion.div 
              className="flex items-center text-xs text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <FiClock className="mr-1" size={12} />
              <span>Último acceso: {lastLoginDate}</span>
            </motion.div>
          )}
          
          <motion.p 
            className="text-sm text-gray-500 truncate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {user.titulo || "Sin título profesional"}
          </motion.p>
        </motion.div>
        
        {/* Actions section - Keep original horizontal layout */}
        <div className="ml-6 flex items-center">
          <AnimatePresence mode="wait">
            {editingUser ? (
              <motion.div 
                key="editing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2"
              >
                <motion.select
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  value={selectedRole || ""}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="" disabled>Seleccionar rol</option>
                  {roles.map(role => (
                    <option key={role.id_nivel} value={role.id_nivel}>
                      {role.titulo}
                    </option>
                  ))}
                </motion.select>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (selectedRole) {
                      onConfirmRoleChange(user.id_usuario, selectedRole);
                      cancelEditing();
                    }
                  }}
                  disabled={!selectedRole}
                  className={`p-2 text-white rounded-full focus:outline-none focus:ring-0 admin-action-btn transition-all ${
                    selectedRole ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  title="Guardar"
                >
                  <FiCheck size={16} className="text-white" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelEditing}
                  className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-0 admin-action-btn transition-all"
                  title="Cancelar"
                >
                  <FiX size={16} className="text-white" />
                </motion.button>
              </motion.div>
            ) : (
              <motion.div 
                key="viewing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3"
              >
                <motion.span 
                  whileHover={{ scale: 1.05 }}
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all ${getRoleBadgeStyle(user)}`}
                >
                  {getRoleIcon(user)}
                  {getRoleLabel(user)}
                </motion.span>
                
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => startEditing(user.role?.id_nivel)}
                  className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors focus:outline-none focus:ring-0 admin-action-btn"
                  title="Editar rol"
                >
                  <FiEdit2 size={16} className="text-indigo-500 group-hover:text-purple-600" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onConfirmDelete(user.id_usuario)}
                  className="p-2 text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-0 admin-action-btn"
                  title="Eliminar usuario"
                >
                  <FiTrash2 size={16} className="text-rose-500 group-hover:text-red-600" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
