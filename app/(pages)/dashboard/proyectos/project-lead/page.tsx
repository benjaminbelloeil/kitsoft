/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ThumbsUp, CheckCircle, Clock, MessageSquare, Send, User, FolderOpen, Users, Clock as ClockIcon } from "lucide-react";
import { useUser } from "@/context/user-context";
import ProjectLeadHeader from '@/components/proyectos/project-lead/ProjectLeadHeader';
import ProjectLeadSkeleton from '@/components/proyectos/project-lead/ProjectLeadSkeleton';
import UnauthorizedState from '@/components/auth/UnauhtorizedState';
import { useNotificationState, NotificationContainer } from '@/components/ui/toast-notification';

export default function ProjectLeadPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { userId, isProjectLead } = useUser();
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [hourAssignments, setHourAssignments] = useState<Record<string, number>>({});
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [savingHours, setSavingHours] = useState<string | null>(null);
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [editingUserAssignment, setEditingUserAssignment] = useState<string | null>(null);
  // Use the toast notification system
  const notifications = useNotificationState();
  
  // Fetch projects data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/project-lead/proyectos');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoadingProjects(false);
      }
    };

    const fetchAvailableUsers = async () => {
      try {
        const response = await fetch('/api/user/all');
        if (response.ok) {
          const users = await response.json();
          setAvailableUsers(users);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    if (isProjectLead) {
      fetchProjects();
      fetchAvailableUsers();
    }
  }, [isProjectLead]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-dropdown-container')) {
        setEditingUserAssignment(null);
      }
    };

    if (editingUserAssignment) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [editingUserAssignment]);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 second loading simulation
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isProjectLead) {
    return <UnauthorizedState />;
  }  

  // Helper function to calculate total assigned hours for a project
  const getTotalAssignedHours = (projectId: string) => {
    const project = projects.find((p: any) => p.id_proyecto === projectId);
    if (!project) return 0;
    
    return project.assignedUsers.reduce((total: number, user: any) => {
      return total + (hourAssignments[user.id_usuario_proyecto] ?? user.horas);
    }, 0);
  };

  // Helper function to check if hour assignment is valid
  const isValidAssignment = (projectId: string) => {
    const project = projects.find((p: any) => p.id_proyecto === projectId);
    if (!project) return false;
    
    const totalAssigned = getTotalAssignedHours(projectId);
    return totalAssigned <= project.horas_totales;
  };

  // Save hour assignments
  const saveHourAssignments = async (projectId: string) => {
    setSavingHours(projectId);
    try {
      const response = await fetch(`/api/project-lead/proyectos/${projectId}/hours`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hourAssignments }),
      });

      if (response.ok) {
        // Refresh projects data
        const projectsResponse = await fetch('/api/project-lead/proyectos');
        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setProjects(data);
          setHourAssignments({}); // Reset local assignments
          notifications.showSuccess('¡Horas asignadas con éxito!');
        }
      } else {
        const error = await response.json();
        notifications.showError(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error saving hour assignments:', error);
      notifications.showError('Error al guardar las asignaciones');
    } finally {
      setSavingHours(null);
    }
  };

  // Handle user change for a project role
  const handleUserChange = async (projectId: string, userProjectId: string, newUserId: string) => {
    try {
      const response = await fetch(`/api/project-lead/proyectos/${projectId}/change-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          userProjectId,
          newUserId 
        }),
      });

      if (response.ok) {
        // Refresh projects data
        const projectsResponse = await fetch('/api/project-lead/proyectos');
        if (projectsResponse.ok) {
          const data = await projectsResponse.json();
          setProjects(data);
          setEditingUserAssignment(null);
          notifications.showSuccess('¡Usuario cambiado con éxito!');
        }
      } else {
        const error = await response.json();
        notifications.showError(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error changing user:', error);
      notifications.showError('Error al cambiar el usuario');
    }
  };

  // Filter users based on selected project
  const getFilteredRecipients = () => {
    if (!selectedProject) return [];
    
    // Find the selected project and return its assigned users
    const project = projects.find((p) => p.id_proyecto === selectedProject);
    if (!project || !project.assignedUsers) return [];
    
    // Convert assigned users to the format expected by the feedback component
    return project.assignedUsers.map((user: any) => ({
      id: user.id_usuario,
      name: `${user.nombre} ${user.apellido || ''}`.trim(),
      role: user.rol_nombre,
      avatar: user.url_avatar || null
    }));
  };

  // Toggle category selection
  const toggleCategory = (category: string) => {
    if (categories.includes(category)) {
      setCategories(categories.filter(cat => cat !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  // Handle feedback submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
	// TODO: connect to backend!!
	console.log('This is where I work.')
    console.log({
      project: selectedProject,
      recipient: selectedRecipient,
      rating,
      categories,
      message
    });

	console.log({
		mensaje: message,
		valoracion: rating,
		id_usuario: selectedRecipient,
		id_autor: userId,
		id_proyecto: selectedProject
	});
    
    // Reset form
    setSelectedProject("");
    setSelectedRecipient("");
    setRating(0);
    setCategories([]);
    setMessage("");
    
    // Show success notification using the toast system
    notifications.showSuccess("Retroalimentación enviada con éxito!");
  };

  // Helper function to calculate real-time user cargabilidad percentage
  const calculateUserCargabilidad = (userHours: number, projectTotalHours: number) => {
    if (projectTotalHours > 0 && userHours > 0) {
      return Math.round((userHours / projectTotalHours) * 100);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <ProjectLeadSkeleton key="skeleton" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Header */}
            <ProjectLeadHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
            {/* Side by Side Layout - Project Management and Feedback */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[600px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* Project Management Section - Takes 1/2 of the width */}
                <motion.div 
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full"
                    whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="p-6 border-b border-gray-100"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="flex items-center">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-br from-[#3B82F610] to-[#3B82F620] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#3B82F610]"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <FolderOpen className="w-5 h-5 text-[#3B82F6]" />
                        </motion.div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            Gestión de Proyectos
                          </h2>
                          <p className="text-sm text-gray-500">
                            Asigna horas de trabajo a los usuarios
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <div className="p-4">
                      {/* Projects List */}
                      <div className="space-y-3">
                        {loadingProjects ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B82F6] mx-auto"></div>
                            <p className="text-sm text-gray-500 mt-2">Cargando proyectos...</p>
                          </div>
                        ) : projects.length === 0 ? (
                          <div className="text-center py-8">
                            <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500">No tienes proyectos asignados</p>
                          </div>
                        ) : (
                          projects.map((project: any, index: number) => (
                          <motion.div 
                            key={project.id_proyecto} 
                            className="border border-gray-200 rounded-lg overflow-hidden transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                          >
                            <div className="p-3">
                              <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-sm text-gray-800">{project.titulo}</h3>
                                <div className="flex items-center space-x-3 text-xs text-gray-500">
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-1" />
                                    {project.assignedUsers?.length || 0} usuarios
                                  </div>
                                  <div className="flex items-center">
                                    <ClockIcon className="w-4 h-4 mr-1" />
                                    {project.assignedHours}/{project.horas_totales}h
                                  </div>
                                </div>
                              </div>
                              
                              {/* Enhanced Progress bar */}
                              <div className="w-full bg-gray-200 rounded-full h-3 mb-3 relative overflow-hidden shadow-inner">
                                <motion.div 
                                  className="bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#2563EB] h-3 rounded-full relative"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${project.assignedPercentage}%` }}
                                  transition={{ duration: 1, delay: 0.7 + index * 0.1, ease: "easeOut" }}
                                >
                                  {/* Animated shine effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse opacity-60"></div>
                                  {/* Subtle glow effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-[#3B82F680] to-[#2563EB80] blur-sm"></div>
                                </motion.div>
                              </div>
                              <div className="flex justify-between items-center text-xs mb-2">
                                <span className="text-gray-600 font-medium">{project.assignedPercentage}% horas asignadas</span>
                                <span className="text-[#3B82F6] font-semibold">{project.availableHours}h disponibles</span>
                              </div>
                              
                              {/* Project actions */}
                              <div className="flex justify-end">
                                <motion.button 
                                  onClick={() => setExpandedProject(expandedProject === project.id_proyecto ? null : project.id_proyecto)}
                                  className="px-3 py-1.5 text-xs bg-[#3B82F610] hover:bg-[#3B82F620] text-[#3B82F6] rounded-md transition-all font-medium border border-[#3B82F620] hover:border-[#3B82F630]"
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {expandedProject === project.id_proyecto ? 'Ocultar asignación' : 'Asignar horas'}
                                </motion.button>
                              </div>
                            </div>

                            {/* Expandable hour assignment section */}
                            <AnimatePresence>
                              {expandedProject === project.id_proyecto && (
                                <motion.div 
                                  className="border-t border-gray-200 bg-gray-50 p-3"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                      <h4 className="font-medium text-sm text-gray-800">Asignación de Horas</h4>
                                      <div className="text-xs">
                                        <span className={`font-semibold ${isValidAssignment(project.id_proyecto) ? 'text-[#3B82F6]' : 'text-red-500'}`}>
                                          {project.horas_totales - getTotalAssignedHours(project.id_proyecto)}h
                                        </span>
                                        <span className="text-gray-600 ml-1">disponibles</span>
                                      </div>
                                    </div>
                                    
                                    {/* User hour assignments */}
                                    <div className="space-y-2">
                                      {project.assignedUsers?.map((user: any, userIndex: number) => (
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
                                              {editingUserAssignment === user.id_usuario_proyecto && (
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
                                                  {/* Inner content that will only appear when container is expanded */}
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
                                                        
                                                        const isCurrentUser = availableUser.id_usuario === user.id_usuario;
                                                        
                                                        return (
                                                          <motion.button
                                                            key={availableUser.id_usuario}
                                                            onClick={() => handleUserChange(
                                                              project.id_proyecto, 
                                                              user.id_usuario_proyecto, 
                                                              availableUser.id_usuario
                                                            )}
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
                                              )}
                                            </AnimatePresence>
                                          </motion.div>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    {/* Save and Cancel buttons */}
                                    <div className="mt-3 flex justify-between">
                                      <motion.button 
                                        onClick={() => {
                                          setExpandedProject(null);
                                          setHourAssignments({});
                                        }}
                                        className="px-3 py-1.5 text-xs font-medium rounded-md transition-all bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        Cancelar
                                      </motion.button>
                                      <motion.button 
                                        onClick={() => saveHourAssignments(project.id_proyecto)}
                                        disabled={!isValidAssignment(project.id_proyecto) || savingHours === project.id_proyecto}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                                          isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto
                                            ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300 shadow-sm'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                        whileHover={isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto ? { scale: 1.05 } : {}}
                                        whileTap={isValidAssignment(project.id_proyecto) && savingHours !== project.id_proyecto ? { scale: 0.95 } : {}}
                                      >
                                        {savingHours === project.id_proyecto ? 'Guardando...' : 'Guardar Asignación'}
                                      </motion.button>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )))}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              
                {/* Feedback Form Section - Takes 1/2 of the width */}
                <motion.div 
                  className="lg:col-span-1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                >
                  <motion.div 
                    className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden h-full"
                    whileHover={{ y: -2, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div 
                      className="p-6 border-b border-gray-100"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <div className="flex items-center">
                        <motion.div 
                          className="w-10 h-10 bg-gradient-to-br from-[#EA580C20] to-[#EA580C10] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#EA580C20]"
                          whileHover={{ scale: 1.1, rotate: -5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <MessageSquare className="w-5 h-5 text-[#EA580C]" />
                        </motion.div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-800">
                            Enviar Retroalimentación
                          </h2>
                          <p className="text-sm text-gray-500">
                            Comparte tu retroalimentación con los miembros del equipo.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <motion.form 
                      onSubmit={handleSubmitFeedback} 
                      className="p-6 flex flex-col h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                    >
                      {/* Project selector */}
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                      >
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="h-2 w-2 bg-[#3B82F6] mr-2 rounded-full"></span>
                          Seleccionar proyecto:
                        </label>
                        <motion.select
                          value={selectedProject}
                          onChange={(e) => setSelectedProject(e.target.value)}
                          className="w-full p-3 border border-gray-200 rounded-md text-sm focus:border-[#3B82F640] focus:ring-1 focus:ring-[#3B82F620] transition-all"
                          whileFocus={{ scale: 1.02 }}
                        >
                          <option value="">Selecciona un proyecto</option>
                          {projects.map((project) => (
                            <option key={project.id_proyecto} value={project.id_proyecto}>
                              {project.titulo}
                            </option>
                          ))}
                        </motion.select>
                      </motion.div>

                      {/* Recipient selector */}
                      <motion.div 
                        className="mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                      >
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="h-2 w-2 bg-[#14B8A6] mr-2 rounded-full"></span>
                          Seleccionar destinatario:
                        </label>
                        <div className="bg-white rounded-md border border-gray-200 shadow-inner p-3">
                          <div className="grid grid-cols-1 gap-1.5 max-h-20 overflow-y-auto">
                            {getFilteredRecipients().slice(0, 3).map((recipient: {id: string, name: string, role: string, avatar: string | null}, index: number) => (
                              <motion.div
                                key={recipient.id}
                                onClick={() => setSelectedRecipient(recipient.id)}
                                className={`flex items-center p-1.5 rounded-md border text-xs ${
                                  selectedRecipient === recipient.id
                                    ? "border-[#14B8A6] bg-[#14B8A608]" 
                                    : "border-gray-200 hover:border-[#14B8A640] hover:bg-[#14B8A605]"
                                } cursor-pointer transition-all`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                              >
                                <div className="h-5 w-5 rounded-full bg-[#14B8A610] mr-2 flex items-center justify-center overflow-hidden border border-gray-200">
                                  {recipient.avatar ? (
                                    <img 
                                      src={recipient.avatar} 
                                      alt={recipient.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <User className="h-3 w-3 text-[#14B8A6]" />
                                  )}
                                </div>
                                <div className="ml-1.5 overflow-hidden">
                                  <p className="text-xs font-medium text-gray-800 truncate">{recipient.name}</p>
                                  <p className="text-[10px] text-gray-500 truncate">{recipient.role}</p>
                                </div>
                              </motion.div>
                            ))}
                            {getFilteredRecipients().length === 0 && selectedProject && (
                              <p className="text-xs text-gray-500 py-2 text-center">No hay usuarios asignados a este proyecto</p>
                            )}
                            {!selectedProject && (
                              <p className="text-xs text-gray-500 py-2 text-center">Selecciona un proyecto primero</p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                          
                      <div className="grid grid-cols-1 gap-4 mb-4">
                        {/* Rating box */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 1.0 }}
                        >
                          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <span className="h-2 w-2 bg-[#F59E0B] mr-2 rounded-full"></span>
                            Valoración:
                          </label>
                          <div className="flex flex-col h-[80px] p-4 bg-white rounded-md border border-gray-200 shadow-inner">
                            <div className="flex justify-center items-center flex-grow">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                  <Star
                                    className={`h-6 w-6 mx-1.5 cursor-pointer transition-all ${
                                      (hoverRating || rating) >= star 
                                        ? "text-[#F59E0B] fill-[#F59E0B] scale-110" 
                                        : "text-gray-300"
                                    }`}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <div className="text-center text-sm font-medium text-gray-700 pt-1">
                              {rating > 0 
                                ? `${rating}/5 - ${rating > 3 ? 'Excelente' : rating > 2 ? 'Bueno' : 'Regular'}`
                                : 'Selecciona una valoración'}
                            </div>
                          </div>
                        </motion.div>
                        
                        {/* Category selector */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 1.1 }}
                        >
                          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                            <span className="h-2 w-2 bg-[#06B6D4] mr-2 rounded-full"></span>
                            Categoría: <span className="ml-1 text-xs text-gray-500 font-normal">(múltiple)</span>
                          </label>
                          <div className="flex flex-col h-[100px] p-3 bg-white rounded-md border border-gray-200 shadow-inner overflow-auto">
                            <div className="grid grid-rows-2 grid-cols-2 gap-3 h-full">
                              {[
                                { id: "colaboracion", name: "Colaboración", icon: <ThumbsUp className="h-4 w-4 min-w-4" /> },
                                { id: "calidad", name: "Calidad", icon: <CheckCircle className="h-4 w-4 min-w-4" /> },
                                { id: "cumplimiento", name: "Cumplimiento", icon: <Clock className="h-4 w-4 min-w-4" /> },
                                { id: "comunicacion", name: "Comunicación", icon: <MessageSquare className="h-4 w-4 min-w-4" /> }
                              ].map((cat, index) => (
                                <motion.button
                                  type="button"
                                  key={cat.id}
                                  onClick={() => toggleCategory(cat.name)}
                                  className={`
                                    flex items-center py-3 px-3 
                                    text-xs rounded-md transition-all 
                                    ${categories.includes(cat.name) 
                                      ? "bg-[#06B6D408] border-[#06B6D4] text-[#06B6D4] font-medium shadow-sm" 
                                      : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-[#06B6D405]"
                                    } 
                                    border
                                  `}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3, delay: 1.2 + index * 0.1 }}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <div className="flex-shrink-0 mr-2">{cat.icon}</div>
                                  <span className="truncate text-left">{cat.name}</span>
                                  {categories.includes(cat.name) && (
                                    <motion.span 
                                      className="w-2 h-2 bg-[#06B6D4] rounded-full ml-auto"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ duration: 0.2 }}
                                    />
                                  )}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Message area */}
                      <motion.div 
                        className="mb-3"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                      >
                        <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <span className="h-2 w-2 bg-[#6366F1] mr-2 rounded-full"></span>
                          Mensaje:
                        </label>
                        <motion.textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full h-[120px] rounded-md border border-gray-200 p-3 text-sm 
                                    focus:border-[#6366F140] focus:ring-1 focus:ring-[#6366F120] resize-none
                                    shadow-inner bg-[#6366F105]"
                          placeholder="Escribe tu retroalimentación detallada aquí..."
                          whileFocus={{ scale: 1.02 }}
                        />
                      </motion.div>
                      
                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={!selectedProject || !selectedRecipient || !rating || categories.length === 0 || !message}
                        className={`w-full py-3 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                          selectedProject && selectedRecipient && rating && categories.length > 0 && message
                            ? "bg-gradient-to-r from-[#3B82F6] to-[#6366F1] hover:from-[#2563EB] hover:to-[#4F46E5] shadow-md text-white" 
                            : "bg-gray-200 cursor-not-allowed text-gray-500"
                        }`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 1.7 }}
                        whileHover={selectedProject && selectedRecipient && rating && categories.length > 0 && message ? { scale: 1.02 } : {}}
                        whileTap={selectedProject && selectedRecipient && rating && categories.length > 0 && message ? { scale: 0.98 } : {}}
                      >
                        <Send className="h-4 w-4" />
                        <span>Enviar Retroalimentación</span>
                      </motion.button>
                    </motion.form>
                  </motion.div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Toast Notifications Container */}
      <NotificationContainer
        notifications={notifications.notifications}
        onClose={(id) => {
          const updatedNotifications = notifications.notifications.filter(n => n.id !== id);
          notifications.clearNotifications();
          updatedNotifications.forEach(n => {
            if (n.id !== id) {
              notifications.showNotification(n.type, n.message);
            }
          });
        }}
      />    </div>
  );
}