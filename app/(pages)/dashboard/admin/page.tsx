/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { 
  FiUsers, 
  FiSettings, 
  FiActivity, 
  FiDatabase, 
  FiSearch,
  FiEdit2,
  FiCheck,
  FiX,
  FiUser,
  FiRefreshCw,
  FiUserCheck,
  FiUserX,
  FiFilter,
  FiChevronDown,
  FiAlertCircle,
  FiTrash2,
  FiMail
} from "react-icons/fi";
import { 
  getAllUsersWithRoles, 
  getAllRoles,
  updateUserRole,
  deleteUser,
  User,
  UserRole
} from "@/utils/database/client/userManagementSync";
import { 
  useNotificationState, 
  NotificationContainer 
} from "@/components/ui/toast-notification";
import PlaceholderAvatar from "@/components/ui/placeholder-avatar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const notifications = useNotificationState();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{userId: string, roleId: string} | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Modal animation variants
  const modalBackdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } }
  };

  const modalContentVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        damping: 25, 
        stiffness: 500, 
        duration: 0.3 
      } 
    }
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        duration: 0.2 
      } 
    }
  };

  // Load users and roles
  const loadData = async () => {
    setLoading(true);
    
    try {
      const [usersData, rolesData] = await Promise.all([
        getAllUsersWithRoles(),
        getAllRoles()
      ]);
      
      setUsers(usersData);
      setRoles(rolesData);
    } catch (error) {
      console.error("Error loading data:", error);
      notifications.showError("Error al cargar los datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter users by search term and role filter
  const filteredUsers = users.filter(user => {
    const fullName = `${user.nombre || ""} ${user.apellido || ""}`.toLowerCase();
    const searchTerm = search.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm) || 
                        (user.titulo || "").toLowerCase().includes(searchTerm) ||
                        (user.role?.titulo || "").toLowerCase().includes(searchTerm) ||
                        (user.email || "").toLowerCase().includes(searchTerm);
    
    // Apply role filter
    if (filter === "all") return matchesSearch;
    if (filter === "admin") return matchesSearch && user.role?.numero === 1;
    if (filter === "empleado") return matchesSearch && user.role?.numero === 0;
    if (filter === "unregistered") return matchesSearch && !user.registered;
    
    return matchesSearch;
  });

  // Start editing a user's role
  const startEditing = (userId: string, currentRoleId?: string) => {
    setEditingUser(userId);
    setSelectedRole(currentRoleId || null);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingUser(null);
    setSelectedRole(null);
  };

  // Confirm role change
  const confirmRoleChange = (userId: string, roleId: string) => {
    setPendingAction({ userId, roleId });
    setShowConfirmModal(true);
  };

  // Execute the role change
  const executeRoleChange = async () => {
    if (!pendingAction) return;
    
    const { userId, roleId } = pendingAction;
    setShowConfirmModal(false);
    setPendingAction(null);
    
    try {
      const result = await updateUserRole(userId, roleId);
      
      if (result.success) {
        notifications.showSuccess("Rol actualizado con éxito");
        
        // Update the local state immediately
        const newRole = roles.find(r => r.id_nivel === roleId);
        
        setUsers(prevUsers => 
          prevUsers.map(user => {
            if (user.id_usuario === userId) {
              return {
                ...user,
                registered: true,
                role: newRole || user.role
              };
            }
            return user;
          })
        );

        // Refresh data from server to ensure consistency
        await refreshData();
      } else {
        notifications.showError(`Error al actualizar rol: ${result.error}`);
      }
    } catch (err) {
      notifications.showError("Error al actualizar rol");
      console.error("Error updating role:", err);
    }
    
    // Reset editing state
    setEditingUser(null);
    setSelectedRole(null);
  };

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  // Confirm user deletion
  const confirmDelete = (userId: string) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  // Execute user deletion
  const executeUserDelete = async () => {
    if (!userToDelete) return;
    
    try {
      const result = await deleteUser(userToDelete);
      
      if (result.success) {
        notifications.showSuccess("Usuario eliminado con éxito");
        
        // Update local state to remove the user
        setUsers(prevUsers => 
          prevUsers.filter(user => user.id_usuario !== userToDelete)
        );
      } else {
        notifications.showError(`Error al eliminar usuario: ${result.error}`);
      }
    } catch (err) {
      notifications.showError("Error al eliminar usuario");
      console.error("Error deleting user:", err);
    }
    
    // Reset state
    setUserToDelete(null);
    setShowDeleteModal(false);
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

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Administración</h1>
      
      <div className="mb-8">
        <p className="text-gray-600">
          Bienvenido al panel de administración. Aquí puedes gestionar usuarios, configurar el sistema y acceder a herramientas administrativas.
        </p>
      </div>
      
      {/* Tabs navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-4 sm:space-x-8">
          <button
            onClick={() => setActiveTab("users")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "users"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              <span className="hidden sm:inline">Gestión de</span> Usuarios
            </div>
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "settings"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiSettings className="mr-2" />
              Configuración
            </div>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`whitespace-nowrap py-3 px-3 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === "logs"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center">
              <FiActivity className="mr-2" />
              Registros
            </div>
          </button>
        </nav>
      </div>
      
      {/* User Management Tab */}
      {activeTab === "users" && (
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
                
                <AnimatePresence>
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
                </AnimatePresence>
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
              {filteredUsers.length} resultado{filteredUsers.length !== 1 && 's'} de búsqueda
            </div>
          </div>
          
          {/* User list */}
          <div className="space-y-4 mb-6">
            {loading ? (
              // Loading skeleton
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 animate-pulse">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-gray-200 rounded-full h-12 w-12"></div>
                      <div className="ml-4 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                      <div className="bg-gray-200 rounded h-8 w-24"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              // Actual user list
              <>
                {filteredUsers.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center border border-gray-100">
                    <div className="bg-gray-50 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <FiUsers className="text-gray-400 text-4xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron usuarios</h3>
                    <p className="text-gray-500">
                      {search ? "Intenta con otra búsqueda." : "No hay usuarios disponibles."}
                    </p>
                  </div>
                ) : (
                  filteredUsers.map(user => (
                    <motion.div 
                      key={user.id_usuario} 
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
                          
                          <p className="text-sm text-gray-500 truncate">
                            {user.titulo || "Sin título profesional"}
                          </p>
                        </div>
                        
                        <div className="ml-4 flex items-center">
                          {editingUser === user.id_usuario ? (
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
                              
                              {/* Save button - added admin-action-btn class */}
                              <button 
                                onClick={() => selectedRole && confirmRoleChange(user.id_usuario, selectedRole)}
                                disabled={!selectedRole}
                                className={`p-2 text-white rounded-full focus:outline-none focus:ring-0 admin-action-btn ${
                                  selectedRole ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
                                }`}
                                title="Guardar"
                              >
                                <FiCheck size={16} className="text-white" />
                              </button>
                              
                              {/* Cancel button - added admin-action-btn class */}
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
                              
                              {/* Edit button - added admin-action-btn class */}
                              <button 
                                onClick={() => startEditing(user.id_usuario, user.role?.id_nivel)}
                                className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors focus:outline-none focus:ring-0 admin-action-btn"
                                title="Editar rol"
                              >
                                <FiEdit2 size={16} className="text-indigo-500 group-hover:text-purple-600" />
                              </button>
                              
                              {/* Delete button - added admin-action-btn class */}
                              <button 
                                onClick={() => confirmDelete(user.id_usuario)}
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
                  ))
                )}
              </>
            )}
          </div>
        </motion.div>
      )}
      
      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-center text-purple-800 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FiSettings className="text-2xl text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Configuración</h2>
              <p className="text-sm text-gray-500">Ajustes y preferencias del sistema</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
            <p className="text-gray-500">Las opciones de configuración estarán disponibles próximamente.</p>
          </div>
        </div>
      )}
      
      {/* Activity Logs Tab */}
      {activeTab === "logs" && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
          <div className="flex items-center text-purple-800 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <FiActivity className="text-2xl text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Registros de Actividad</h2>
              <p className="text-sm text-gray-500">Monitoreo de acciones y eventos del sistema</p>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6 text-center bg-gray-50">
            <p className="text-gray-500">Los registros de actividad estarán disponibles próximamente.</p>
          </div>
        </div>
      )}
      
      {/* Additional admin sections */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
          <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <FiDatabase className="text-purple-600" />
          </div>
          Datos y Configuraciones
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col p-6 rounded-xl border border-gray-200 bg-white transition-all hover:shadow-md hover:border-gray-300">
            <div className="flex items-center mb-4">
              <span className="p-2 rounded-lg bg-amber-100 text-amber-600">
                <FiActivity size={20} />
              </span>
              <h3 className="ml-3 font-medium text-lg">Reportes</h3>
            </div>
            <p className="text-gray-600 text-sm">
              Genera y exporta reportes del sistema
            </p>
          </div>
          
          <div className="flex items-center justify-center p-6 rounded-xl border border-gray-200 bg-gray-50">
            <p className="text-gray-500 text-center">
              Más funcionalidades próximamente...
            </p>
          </div>
        </div>
      </div>
      
      {/* Role Change Confirmation Modal with transparent backdrop */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-100"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4 p-2 rounded-full bg-purple-100">
                  <FiAlertCircle className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar cambio de rol</h3>
              </div>
              <p className="text-gray-600 mb-6 pl-12">
                ¿Estás seguro que deseas cambiar el rol de este usuario? 
                Este cambio modificará los permisos del usuario en el sistema.
              </p>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={executeRoleChange}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Confirmar
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced User Deletion Confirmation Modal with improved transparent backdrop and warning text */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30"
            variants={modalBackdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-gray-100"
              variants={modalContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center mb-4">
                <div className="mr-4 p-3 rounded-full bg-red-100">
                  <FiAlertCircle className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Confirmar eliminación</h3>
              </div>
              
              <div className="pl-12 space-y-3">
                <p className="text-gray-700">
                  ¿Estás seguro que deseas eliminar este usuario?
                </p>
                
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-2">
                  <div className="flex items-center">
                    <FiAlertCircle className="text-red-600 mr-2 flex-shrink-0" size={16} />
                    <p className="text-red-700 text-sm">
                      Esta acción <span className="font-medium">no se puede deshacer</span> y eliminará:
                    </p>
                  </div>
                  <ul className="mt-2 text-sm text-red-700 list-disc pl-5 space-y-1">
                    <li>Todos los datos personales del usuario</li>
                    <li>Experiencia laboral y habilidades</li>
                    <li>Certificaciones y curriculum</li>
                    <li>Configuración y preferencias</li>
                  </ul>
                </div>
                
                <p className="text-gray-600 text-sm">
                  El usuario tendrá que volver a registrarse si necesita acceder a la plataforma de nuevo.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={executeUserDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <FiTrash2 className="mr-2" size={16} />
                  Eliminar Usuario
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Notification container */}
      <NotificationContainer
        notifications={notifications.notifications}
        onClose={(id) => {
          notifications.clearNotifications();
        }}
      />
      
      {/* Click outside handler for dropdown */}
      {dropdownOpen && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
}
