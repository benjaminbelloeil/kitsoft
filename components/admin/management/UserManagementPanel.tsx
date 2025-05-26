/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiUserCheck,
  FiUserX,
  FiSearch
} from "react-icons/fi";
import { 
  getAllLevels,
  deleteUser
} from "@/utils/database/client/userManagementSync";
import { User, UserRole } from "@/interfaces/user";
import UserList from "@/components/admin/management/UserList";
import { useNotificationState } from "@/components/ui/toast-notification";
import LevelChangeModal from "../modals/LevelChangeModal";
import DeleteUserModal from "../modals/DeleteUserModal";

// Cache key for user management data
const USER_MANAGEMENT_DATA_KEY = 'user_management_data';
const USER_MANAGEMENT_TIMESTAMP_KEY = 'user_management_timestamp';

interface UserManagementPanelProps {
  serverUsers?: User[];
}

export default function UserManagementPanel({ serverUsers = [] }: UserManagementPanelProps) {
  const [users, setUsers] = useState<User[]>(serverUsers);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(serverUsers.length === 0);
  const [search, setSearch] = useState("");
  const [filter] = useState<string>("all");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const notifications = useNotificationState();
  const [pendingLevelChange, setPendingLevelChange] = useState<{userId: string, levelId: string} | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToDeleteName, setUserToDeleteName] = useState<string>("");

  // Animation variants for the main container
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  // Animation variants for individual sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  // Initialize with server data and fetch levels
  useEffect(() => {
    if (serverUsers.length > 0) {
      setUsers(serverUsers);
      setLoading(false);
      
      // Cache the server data
      localStorage.setItem(USER_MANAGEMENT_DATA_KEY, JSON.stringify({
        users: serverUsers,
        roles: roles // This will be empty initially, but updated after fetching levels
      }));
      localStorage.setItem(USER_MANAGEMENT_TIMESTAMP_KEY, Date.now().toString());
    } else {
      // If no server users were provided, refresh from API
      refreshData();
    }
    
    // Always fetch levels since they're needed for the level change functionality
    const fetchLevels = async () => {
      try {
        const levelsData = await getAllLevels();
        setRoles(levelsData);
        
        // Update the cache with levels
        const cachedData = localStorage.getItem(USER_MANAGEMENT_DATA_KEY);
        if (cachedData) {
          const parsedCache = JSON.parse(cachedData);
          localStorage.setItem(USER_MANAGEMENT_DATA_KEY, JSON.stringify({
            ...parsedCache,
            roles: levelsData
          }));
        }
      } catch (error) {
        console.error("Error fetching levels:", error);
      }
    };
    
    fetchLevels();
  }, [serverUsers]);

  // Update cache function
  const updateCache = (updatedUsers: User[]) => {
    try {
      const currentCache = localStorage.getItem(USER_MANAGEMENT_DATA_KEY);
      if (currentCache) {
        const parsedCache = JSON.parse(currentCache);
        localStorage.setItem(USER_MANAGEMENT_DATA_KEY, JSON.stringify({
          ...parsedCache,
          users: updatedUsers
        }));
      }
    } catch (error) {
      console.error("Error updating cache:", error);
    }
  };

  // Refresh data via API
  const refreshData = async () => {
    try {
      // Fetch updated users through API
      const res = await fetch('/api/admin/users/list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add cache-busting query parameter
        cache: 'no-store',
      });
      
      if (!res.ok) {
        throw new Error('Failed to refresh user data');
      }
      
      const usersData = await res.json();
      
      // Update the state and cache
      setUsers(usersData);
      updateCache(usersData);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      notifications.showError("Error al actualizar los datos de usuarios");
    }
  };

  // Handler for confirming level change
  const handleConfirmLevelChange = (userId: string, levelId: string) => {
    setPendingLevelChange({ userId, levelId });
    setShowConfirmModal(true);
  };

  // Handler for confirming user deletion
  const handleConfirmDelete = (userId: string) => {
    const userToDelete = users.find(u => u.id_usuario === userId);
    const userName = userToDelete ? 
      `${userToDelete.nombre || ''} ${userToDelete.apellido || ''}`.trim() : 
      'Usuario';
    
    setUserToDelete(userId);
    setUserToDeleteName(userName || 'Usuario sin nombre');
    setShowDeleteModal(true);
  };

  // Update users state after level change
  const updateUserLevel = (userId: string, levelId: string) => {
    const newLevel = roles.find(r => r.id_nivel === levelId);
    
    const updatedUsers = users.map(user => {
      if (user.id_usuario === userId) {
        return {
          ...user,
          registered: true,
          role: newLevel || user.role
        };
      }
      return user;
    });

    setUsers(updatedUsers);
    updateCache(updatedUsers);
  };

  // Update users state after user deletion
  const removeUserFromState = (userId: string) => {
    const updatedUsers = users.filter(user => user.id_usuario !== userId);
    setUsers(updatedUsers);
    updateCache(updatedUsers);
  };

  // Handle level change using API
  const handleLevelChange = async () => {
    if (pendingLevelChange) {
      try {
        // Call API to update the level
        const res = await fetch('/api/admin/users/update-level', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: pendingLevelChange.userId,
            levelId: pendingLevelChange.levelId
          }),
        });

        if (!res.ok) {
          throw new Error('Failed to update level');
        }

        // Find the level details
        const selectedLevel = roles.find(level => level.id_nivel === pendingLevelChange.levelId);
        
        notifications.showSuccess(
          selectedLevel ? `El usuario ahora tiene nivel de ${selectedLevel.titulo}` : "Nivel actualizado con éxito"
        );
        
        // Update the local state
        updateUserLevel(pendingLevelChange.userId, pendingLevelChange.levelId);
        
        // Refresh data to ensure we have the latest level information
        setTimeout(() => {
          refreshData();
        }, 500);
      } catch (error) {
        console.error("Error changing level:", error);
        notifications.showError("Ocurrió un error al cambiar el nivel");
      } finally {
        // Close modal and clean up
        setShowConfirmModal(false);
        setPendingLevelChange(null);
      }
    }
  };

  // Handle user deletion using API
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    
    try {
      const result = await deleteUser(userToDelete); // This function now uses API
      
      if (result.success) {
        // Remove from local state
        removeUserFromState(userToDelete);
        notifications.showSuccess("Usuario eliminado con éxito");
        
        // Refresh data to ensure our list is up-to-date
        setTimeout(() => {
          refreshData();
        }, 500);
      } else {
        notifications.showError(result.error || "Error al eliminar el usuario");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      notifications.showError("Error inesperado al eliminar el usuario");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  return (
    <>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100 admin-content-panel"
        id="admin-panel-users"
      >
        {/* Search Bar */}
        <motion.div 
          className="mb-6"
          variants={sectionVariants}
        >
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Buscar usuarios por nombre, email o rol..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute left-0 top-0 h-full flex items-center justify-center pl-3">
              <FiSearch className="text-gray-400 h-4 w-4" />
            </div>
          </div>
        </motion.div>
        <motion.div 
          className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 flex items-center text-sm"
          variants={sectionVariants}
        >
          <motion.div 
            className="flex gap-1 items-center mr-2 text-gray-600"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FiUserCheck className="text-green-600" />
            </motion.div>
            <motion.span 
              className="font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {users.filter(u => u.registered).length}
            </motion.span> 
            Usuarios registrados
          </motion.div>
          <div className="border-l border-gray-300 h-5 mx-3"></div>
          <motion.div 
            className="flex gap-1 items-center mr-1 text-gray-600"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FiUserX className="text-gray-500" />
            </motion.div>
            <motion.span 
              className="font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              {users.filter(u => !u.registered).length}
            </motion.span> 
            Sin registrar
          </motion.div>
          <div className="border-l border-gray-300 h-5 mx-3 hidden sm:block"></div>
          <div className="ml-auto text-sm text-gray-500 hidden sm:block">
            {users.filter(u => {
              if (filter === "all") return true;
              if (filter === "admin") return u.role?.numero === 1;
              if (filter === "empleado") return u.role?.numero === 0;
              if (filter === "unregistered") return !u.registered;
              return true;
            }).length} resultado{users.length !== 1 && 's'} de búsqueda
          </div>
        </motion.div>
        
        <motion.div variants={sectionVariants}>
          <UserList
            users={users}
            roles={roles}
            loading={loading}
            search={search}
            filter={filter}
            onConfirmRoleChange={handleConfirmLevelChange}
            onConfirmDelete={handleConfirmDelete}
          />
        </motion.div>
      </motion.div>

      {/* Animated Modals */}
      <AnimatePresence>
        {showConfirmModal && (
          <LevelChangeModal 
            isOpen={showConfirmModal}
            onClose={() => setShowConfirmModal(false)}
            onConfirm={handleLevelChange}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <DeleteUserModal
            isOpen={showDeleteModal}
            isDeleting={isDeleting}
            onClose={() => !isDeleting && setShowDeleteModal(false)}
            onConfirm={handleDeleteUser}
            userName={userToDeleteName}
          />
        )}
      </AnimatePresence>
    </>
  );
}
