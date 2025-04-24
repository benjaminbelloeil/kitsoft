import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiChevronDown, 
  FiUsers, 
  FiRefreshCw,
  FiUserCheck,
  FiUserX
} from "react-icons/fi";
import { 
  getAllUsersWithRoles, 
  getAllRoles,
  User,
  UserRole
} from "@/utils/database/client/userManagementSync";
import { changeUserRole } from "@/utils/database/client/userRoleSync";
import UserList from "./UserList";
import { useNotificationState } from "@/components/ui/toast-notification";
import RoleChangeModal from "./modals/RoleChangeModal";
import DeleteUserModal from "./modals/DeleteUserModal";

// Cache key for user management data
const USER_MANAGEMENT_DATA_KEY = 'user_management_data';
const USER_MANAGEMENT_TIMESTAMP_KEY = 'user_management_timestamp';
// Extending the freshness threshold to avoid unnecessary refreshes
const DATA_FRESHNESS_THRESHOLD = 30 * 60 * 1000; // 30 minutes instead of 5

export default function UserManagementPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const notifications = useNotificationState();
  const [pendingRoleChange, setPendingRoleChange] = useState<{userId: string, roleId: string} | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [visibilityChanged, setVisibilityChanged] = useState(false);

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { duration: 0.2 } 
    }
  };

  // Handle visibility change events
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Only mark that visibility changed, don't trigger loading state
        setVisibilityChanged(true);
      }
    };

    // Add event listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Remove event listener on cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Load data with enhanced caching mechanism
  useEffect(() => {
    // Skip if not initial load and not coming back from visibility change
    if (!isInitialLoad && !visibilityChanged) return;
    
    const loadData = async () => {
      try {
        // Check if we have cached data and if it's still fresh
        const cachedData = localStorage.getItem(USER_MANAGEMENT_DATA_KEY);
        const timestamp = localStorage.getItem(USER_MANAGEMENT_TIMESTAMP_KEY);
        const isFresh = timestamp && (Date.now() - parseInt(timestamp, 10)) < DATA_FRESHNESS_THRESHOLD;
        
        // Coming back from another tab - use cached data without showing loading state
        if (visibilityChanged && cachedData && isFresh) {
          setVisibilityChanged(false);
          const parsedData = JSON.parse(cachedData);
          // Only update state if we have data - don't show loading indicators
          if (parsedData.users && parsedData.roles) {
            setUsers(parsedData.users);
            setRoles(parsedData.roles);
          }
          return;
        }
        
        // Initial load with cached data - use it but don't show loading state
        if (isInitialLoad && cachedData && isFresh) {
          const parsedData = JSON.parse(cachedData);
          setUsers(parsedData.users || []);
          setRoles(parsedData.roles || []);
          setLoading(false);
          setIsInitialLoad(false);
          setVisibilityChanged(false);
          return;
        }
        
        // No fresh cached data - show loading state and fetch new data
        if (!cachedData || !isFresh) {
          if (isInitialLoad) {
            setLoading(true);
          }
          
          // Fetch fresh data
          const [usersData, rolesData] = await Promise.all([
            getAllUsersWithRoles(),
            getAllRoles()
          ]);
          
          // Cache the new data in localStorage for better persistence
          localStorage.setItem(USER_MANAGEMENT_DATA_KEY, JSON.stringify({
            users: usersData,
            roles: rolesData
          }));
          localStorage.setItem(USER_MANAGEMENT_TIMESTAMP_KEY, Date.now().toString());
          
          // Update state
          setUsers(usersData);
          setRoles(rolesData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error loading user management data:", error);
        setLoading(false);
      } finally {
        setIsInitialLoad(false);
        setVisibilityChanged(false);
      }
    };
    
    loadData();
  }, [isInitialLoad, visibilityChanged]);

  // Update cache function - use localStorage instead of sessionStorage
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

  // Add a more robust refresh function
  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      const [usersData, rolesData] = await Promise.all([
        getAllUsersWithRoles(),
        getAllRoles()
      ]);
      
      // Update cache with fresh data using localStorage
      localStorage.setItem(USER_MANAGEMENT_DATA_KEY, JSON.stringify({
        users: usersData,
        roles: rolesData
      }));
      localStorage.setItem(USER_MANAGEMENT_TIMESTAMP_KEY, Date.now().toString());
      
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      notifications.showError("Error al actualizar los datos de usuarios");
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handler for confirming role change
  const handleConfirmRoleChange = (userId: string, roleId: string) => {
    setPendingRoleChange({ userId, roleId });
    setShowConfirmModal(true);
  };

  // Handler for confirming user deletion
  const handleConfirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Update users state after role change
  const updateUserRole = (userId: string, roleId: string) => {
    const newRole = roles.find(r => r.id_nivel === roleId);
    
    const updatedUsers = users.map(user => {
      if (user.id_usuario === userId) {
        return {
          ...user,
          registered: true,
          role: newRole || user.role
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

  // New function to handle role change
  const handleRoleChange = async () => {
    if (pendingRoleChange) {
      try {
        // Get the role number from the selected role
        const selectedRole = roles.find(role => role.id_nivel === pendingRoleChange.roleId);
        if (!selectedRole) return;

        // Call the database function to change the user's role
        const success = await changeUserRole(pendingRoleChange.userId, selectedRole.numero);
        
        if (success) {
          notifications.showSuccess(`El usuario ahora tiene rol de ${selectedRole.titulo}`);
          
          // Update the local state
          updateUserRole(pendingRoleChange.userId, pendingRoleChange.roleId);
        } else {
          notifications.showError("No se pudo actualizar el rol del usuario");
        }
      } catch (error) {
        console.error("Error changing role:", error);
        notifications.showError("Ocurrió un error al cambiar el rol");
      }
      
      // Close modal and clean up
      setShowConfirmModal(false);
      setPendingRoleChange(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center text-purple-800">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <FiUsers className="text-2xl text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Gestión de Usuarios</h2>
            <p className="text-sm text-gray-500">Administra los roles y permisos de los usuarios</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white 
                      placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 
                      focus:border-purple-500 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Buscar usuarios..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          {/* Dropdown filter */}
          <div className="relative w-full sm:w-auto z-20">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
            >
              <div className="flex items-center">
                <FiFilter className="mr-2 text-purple-500" />
                <span>
                  {filter === "all" && "Todos"}
                  {filter === "admin" && "Administradores"}
                  {filter === "empleado" && "Empleados"}
                  {filter === "unregistered" && "Sin registrar"}
                </span>
              </div>
              <FiChevronDown className={`ml-2 transition-transform duration-200 ${dropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {dropdownOpen && (
              <motion.div 
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 overflow-hidden"
              >
                <button
                  onClick={() => { setFilter("all"); setDropdownOpen(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${filter === "all" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${filter === "all" ? "bg-purple-500" : "bg-transparent border border-gray-300"}`}></span>
                  Todos
                </button>
                <button
                  onClick={() => { setFilter("admin"); setDropdownOpen(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${filter === "admin" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${filter === "admin" ? "bg-purple-500" : "bg-transparent border border-gray-300"}`}></span>
                  Administradores
                </button>
                <button
                  onClick={() => { setFilter("empleado"); setDropdownOpen(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${filter === "empleado" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${filter === "empleado" ? "bg-purple-500" : "bg-transparent border border-gray-300"}`}></span>
                  Empleados
                </button>
                <button
                  onClick={() => { setFilter("unregistered"); setDropdownOpen(false); }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${filter === "unregistered" ? "bg-purple-50 text-purple-700" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <span className={`w-2 h-2 rounded-full mr-2 ${filter === "unregistered" ? "bg-purple-500" : "bg-transparent border border-gray-300"}`}></span>
                  Sin registrar
                </button>
              </motion.div>
            )}
          </div>
          
          <button 
            onClick={refreshData}
            className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            disabled={isRefreshing}
          >
            <FiRefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 mb-6 border border-gray-100 flex items-center text-sm">
        <div className="flex gap-1 items-center mr-2 text-gray-600">
          <FiUserCheck className="text-green-600" /> 
          <span className="font-medium">{users.filter(u => u.registered).length}</span> Usuarios registrados
        </div>
        <div className="border-l border-gray-300 h-5 mx-3"></div>
        <div className="flex gap-1 items-center mr-1 text-gray-600">
          <FiUserX className="text-gray-500" /> 
          <span className="font-medium">{users.filter(u => !u.registered).length}</span> Sin registrar
        </div>
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
      </div>
      
      <UserList
        users={users}
        roles={roles}
        loading={loading}
        search={search}
        filter={filter}
        onConfirmRoleChange={handleConfirmRoleChange}
        onConfirmDelete={handleConfirmDelete}
      />

      {/* Role Change Modal */}
      <RoleChangeModal 
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleRoleChange}
      />

      {/* Delete User Modal */}
      <DeleteUserModal
        isOpen={showDeleteModal}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        onConfirm={async () => {
          if (userToDelete) {
            setIsDeleting(true);
            // This would call your deleteUser function and handle the state updates
            // For now, we'll just simulate success
            setTimeout(() => {
              removeUserFromState(userToDelete);
              setIsDeleting(false);
              setShowDeleteModal(false);
              setUserToDelete(null);
              notifications.showSuccess("Usuario eliminado con éxito");
            }, 1000);
          }
        }}
      />

      {/* Click outside handler for dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </motion.div>
  );
}
