/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from 'react';
import { 
  getAllUsersWithRoles, 
  getAllLevels, 
  updateUserLevel 
} from '@/utils/database/client/userManagementSync';
import { 
  useNotificationState, 
  NotificationContainer 
} from '@/components/ui/toast-notification';
import { FiSearch, FiEdit2, FiCheck, FiX, FiUser, FiUsers } from 'react-icons/fi';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';

interface User {
  id_usuario: string;
  nombre?: string;
  apellido?: string;
  titulo?: string;
  url_avatar?: string | null | undefined;
  role?: {
    id_nivel?: string;
    numero?: number;
    titulo?: string;
  };
}

interface Role {
  id_nivel: string;
  numero: number;
  titulo: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const notifications = useNotificationState();
  const [, setNotifications] = useState<any[]>([]);

  // Load users and roles
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      
      const [usersData, levelsData] = await Promise.all([
        getAllUsersWithRoles(),
        getAllLevels()
      ]);
      
      setUsers(usersData);
      setRoles(levelsData);
      setLoading(false);
    }
    
    loadData();
  }, []);

  // Filter users by search term
  const filteredUsers = users.filter(user => {
    const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    
    return fullName.includes(searchTerm) || 
           user.titulo?.toLowerCase().includes(searchTerm) ||
           user.role?.titulo?.toLowerCase().includes(searchTerm);
  });

  // Start editing a user's level
  const startEditing = (userId: string, currentLevelId?: string) => {
    setEditingUser(userId);
    setSelectedRole(currentLevelId || null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setSelectedRole(null);
  };

  // Save the level change
  const saveRoleChange = async (userId: string) => {
    if (!selectedRole) return;
    
    try {
      const result = await updateUserLevel(userId, selectedRole);
      
      if (result.success) {
        notifications.showSuccess('Nivel actualizado con éxito');
        
        // Update the local state
        setUsers(prevUsers => 
          prevUsers.map(user => {
            if (user.id_usuario === userId) {
              const newLevel = roles.find(r => r.id_nivel === selectedRole);
              return {
                ...user,
                role: newLevel
              };
            }
            return user;
          })
        );
      } else {
        notifications.showError(`Error al actualizar nivel: ${result.error}`);
      }
    } catch (err) {
      notifications.showError('Error al actualizar nivel');
      console.error('Error updating level:', err);
    }
    
    // Reset editing state
    setEditingUser(null);
    setSelectedRole(null);
  };

  // Handle notification dismissal
  const handleCloseNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Display a skeleton loader while loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center text-purple-800">
          <FiUsers className="mr-2 text-2xl" />
          <h2 className="text-xl font-semibold">Gestión de Usuarios</h2>
          <span className="ml-3 bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {users.length} usuarios
          </span>
        </div>
        
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white 
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 
                      focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Buscar usuarios..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-4 mb-10">
        {filteredUsers.map(user => (
          <div 
            key={user.id_usuario} 
            className="bg-white rounded-lg shadow-md p-4 transition-all duration-200 hover:shadow-lg border border-gray-100"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {user.url_avatar ? (
                  <img 
                    src={user.url_avatar} 
                    alt={`${user.nombre} ${user.apellido}`} 
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <PlaceholderAvatar size={48} />
                )}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-baseline">
                  <h3 className="text-lg font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </h3>
                  {!user.nombre && !user.apellido && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Usuario sin nombre)
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 truncate">
                  {user.titulo || 'Sin título profesional'}
                </p>
              </div>
              
              <div className="ml-4">
                {editingUser === user.id_usuario ? (
                  <div className="flex items-center space-x-2">
                    <select
                      className="border border-gray-300 rounded-md text-sm px-3 py-2 focus:outline-none focus:ring-0"
                      value={selectedRole || ''}
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
                      onClick={() => saveRoleChange(user.id_usuario)}
                      className="p-2 text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:ring-0 admin-action-btn"
                      title="Guardar"
                    >
                      <FiCheck size={16} />
                    </button>
                    
                    <button 
                      onClick={cancelEditing}
                      className="p-2 text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-0 admin-action-btn"
                      title="Cancelar"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <span 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium
                        ${user.role?.numero === 1 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'}`}
                    >
                      <FiUser className="mr-1" />
                      {user.role?.titulo || 'Staff'}
                    </span>
                    
                    <button 
                      onClick={() => startEditing(user.id_usuario, user.role?.id_nivel)}
                      className="p-2 text-gray-500 hover:text-purple-600 focus:outline-none focus:ring-0 admin-action-btn"
                      title="Editar rol"
                    >
                      <FiEdit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <FiUsers className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron usuarios</h3>
            <p className="text-gray-500">
              {search ? 'Intenta con otra búsqueda.' : 'No hay usuarios disponibles.'}
            </p>
          </div>
        )}
      </div>
      
      {/* Notification container */}
      <NotificationContainer
        notifications={notifications.notifications}
        onClose={(id) => handleCloseNotification(id)}
      />
    </div>
  );
}
