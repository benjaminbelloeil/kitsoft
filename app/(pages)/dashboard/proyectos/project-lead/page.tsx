/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/user-context";
import { createClient } from "@/utils/supabase/client";
import ProjectLeadHeader from '@/components/proyectos/project-lead/ProjectLeadHeader';
import ProjectLeadSkeleton from '@/components/proyectos/project-lead/ProjectLeadSkeleton';
import UnauthorizedState from '@/components/auth/UnauhtorizedState';
import { useNotificationState, NotificationContainer } from '@/components/ui/toast-notification';
import ProjectManagementSection from '@/components/proyectos/project-lead/ProjectManagementSection';
import FeedbackFormSection from '@/components/proyectos/project-lead/FeedbackFormSection';

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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  // Use the toast notification system
  const notifications = useNotificationState();
  const supabase = createClient();
  
  // Fetch current user ID
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      } catch (error) {
        console.error('Error getting current user:', error);
      }
    };

    if (isProjectLead) {
      getCurrentUser();
    }
  }, [isProjectLead, supabase.auth]);
  
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
    const allRecipients = project.assignedUsers.map((user: any) => ({
      id: user.id_usuario,
      name: `${user.nombre} ${user.apellido || ''}`.trim(),
      role: user.rol_nombre,
      avatar: user.url_avatar || null
    }));
    
    // Filter out the current user (project lead) from the recipient list
    return allRecipients.filter((recipient: any) => recipient.id !== currentUserId);
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
    
    if (!selectedProject || !selectedRecipient || !rating || categories.length === 0 || !message) {
      notifications.showError("Por favor completa todos los campos requeridos");
      return;
    }

    setSubmittingFeedback(true);

    try {
      const values = {
        mensaje: message,
        valoracion: rating,
        id_usuario: selectedRecipient,
        id_autor: userId,
        id_proyecto: selectedProject,
        categorias: categories
      }

      const response = await fetch('/api/retroalimentacion',
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values)
        }
      )

      if (response.ok) {
        // Reset form
        setSelectedProject("");
        setSelectedRecipient("");
        setRating(0);
        setCategories([]);
        setMessage("");
        
        // Show success notification using the toast system
        notifications.showSuccess("Retroalimentación enviada con éxito!");
      }
      else {
        notifications.showError("Error enviando la retroalimentación");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      notifications.showError("Error enviando la retroalimentación");
    } finally {
      setSubmittingFeedback(false);
    }
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
                {/* Project Management Section */}
                <ProjectManagementSection
                  projects={projects}
                  loadingProjects={loadingProjects}
                  expandedProject={expandedProject}
                  setExpandedProject={setExpandedProject}
                  hourAssignments={hourAssignments}
                  setHourAssignments={setHourAssignments}
                  editingUserAssignment={editingUserAssignment}
                  setEditingUserAssignment={setEditingUserAssignment}
                  availableUsers={availableUsers}
                  handleUserChange={handleUserChange}
                  calculateUserCargabilidad={calculateUserCargabilidad}
                  getTotalAssignedHours={getTotalAssignedHours}
                  isValidAssignment={isValidAssignment}
                  saveHourAssignments={saveHourAssignments}
                  savingHours={savingHours}
                />
              
                {/* Feedback Form Section */}
                <FeedbackFormSection
                  projects={projects}
                  selectedProject={selectedProject}
                  setSelectedProject={setSelectedProject}
                  selectedRecipient={selectedRecipient}
                  setSelectedRecipient={setSelectedRecipient}
                  rating={rating}
                  setRating={setRating}
                  hoverRating={hoverRating}
                  setHoverRating={setHoverRating}
                  categories={categories}
                  setCategories={setCategories}
                  message={message}
                  setMessage={setMessage}
                  submittingFeedback={submittingFeedback}
                  handleSubmitFeedback={handleSubmitFeedback}
                  getFilteredRecipients={getFilteredRecipients}
                  toggleCategory={toggleCategory}
                />
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