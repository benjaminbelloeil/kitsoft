/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectManagerHeader from '@/components/proyectos/manager/ProjectManagerHeader';
import ProjectManagerSkeleton from '@/components/proyectos/manager/ProjectManagerSkeleton';
import ProjectForm from '@/components/proyectos/manager/ProjectForm';
import ProjectList from '@/components/proyectos/manager/ProjectList';
import { useNotifications } from '@/context/notification-context';
import { Client, Project } from '@/interfaces/project';

export default function ProjectManagementPage() {
  // State management
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const { setNotifications } = useNotifications();
  const formRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Form state for creating/editing
  const [formData, setFormData] = useState<Partial<Project>>({
    titulo: '',
    descripcion: '',
    id_cliente: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_fin: '',
    horas_totales: 0,
    activo: true,
  });
  
  // Load projects and clients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects from our API
        const projectsResponse = await fetch('/api/manager/proyectos');
        const projectsData = await projectsResponse.json();
        
        // Fetch clients for dropdown selection
        const clientsResponse = await fetch('/api/clients');
        const clientsData = await clientsResponse.json();
        
        console.log('Clients data fetched:', clientsData); // Debug - check if clients are loaded
        
        setProjects(projectsData);
        setClients(clientsData);
        
        // Map client names to projects for display
        const enhancedProjects = projectsData.map((project: Project) => {
          const client = clientsData.find((c: Client) => c.id_cliente === project.id_cliente);
          return {
            ...project,
            cliente: client?.nombre || 'Cliente Desconocido'
          };
        });
        
        setProjects(enhancedProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        resetForm();
      }
    };
    
    if (selectedProject) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [selectedProject]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedProject]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Helper function to safely handle potentially null form values
  const safeFormValue = (value: string | null | undefined): string => {
    return value ?? '';
  };
  
  // Handle create project form submission
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const response = await fetch('/api/manager/proyectos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating project');
      }
      
      const newProject = await response.json();
      
      // Add client name for display
      const client = clients.find((c: Client) => c.id_cliente === newProject.id_cliente);
      newProject.cliente = client?.nombre || 'Cliente Desconocido';
      
      // Update projects list with new project
      setProjects(prev => [newProject, ...prev]);
      
      // Reset form for new entries
      resetForm();
      
      // Display success notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Proyecto creado',
          message: `Proyecto "${newProject.titulo}" creado con éxito`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Error creating project:', error);
      
      // Display error notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Error',
          message: `Error al crear el proyecto: ${error instanceof Error ? error.message : 'Intente nuevamente'}`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } finally {
      setIsCreating(false);
    }
  };
  
  // Handle edit project form submission
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/manager/proyectos/${selectedProject.id_proyecto}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error updating project');
      }
      
      const updatedProject = await response.json();
      
      // Add client name for display
      const client = clients.find((c: Client) => c.id_cliente === updatedProject.id_cliente);
      updatedProject.cliente = client?.nombre || 'Cliente Desconocido';
      
      // Update projects list with the edited project
      setProjects(prev => prev.map(p => 
        p.id_proyecto === updatedProject.id_proyecto ? updatedProject : p
      ));
      
      // Reset form and clear selection
      resetForm();
      
      // Display success notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Proyecto actualizado',
          message: `Proyecto "${updatedProject.titulo}" actualizado con éxito`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Error updating project:', error);
      
      // Display error notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Error',
          message: `Error al actualizar el proyecto: ${error instanceof Error ? error.message : 'Intente nuevamente'}`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Handle project archiving (marking as inactive)
  const handleArchiveProject = async (projectId: string) => {
    // The confirmation is now handled by our modal component
    // This built-in confirm is only a fallback and shouldn't be triggered
    
    const projectToArchive = projects.find(p => p.id_proyecto === projectId);
    setIsArchiving(true);
    
    try {
      const response = await fetch(`/api/manager/proyectos/${projectId}`, {
        method: 'DELETE', // This actually just marks as inactive
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error archiving project');
      }
      
      // Update the project status to inactive instead of removing it
      setProjects(prev => prev.map(p => 
        p.id_proyecto === projectId 
          ? { ...p, activo: false }
          : p
      ));
      
      // If we were editing this project, update the form data with inactive status
      if (selectedProject?.id_proyecto === projectId) {
        setFormData(prev => ({ ...prev, activo: false }));
      }
      
      // Display success notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Proyecto archivado',
          message: `Proyecto "${projectToArchive?.titulo || 'seleccionado'}" archivado con éxito`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } catch (error) {
      console.error('Error archiving project:', error);
      
      // Display error notification using notification context
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Error',
          message: `Error al archivar el proyecto: ${error instanceof Error ? error.message : 'Intente nuevamente'}`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
    } finally {
      setIsArchiving(false);
    }
  };
  
  // Reset form and clear selection
  const resetForm = () => {
    setSelectedProject(null);
    setIsEditing(false);
    setFormData({
      titulo: '',
      descripcion: '',
      id_cliente: '',
      fecha_inicio: new Date().toISOString().split('T')[0],
      fecha_fin: '',
      horas_totales: 0,
      activo: true,
    });
  };
  
  // Handle selection of a project to edit
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      titulo: project.titulo,
      descripcion: project.descripcion || '',
      id_cliente: project.id_cliente,
      fecha_inicio: project.fecha_inicio,
      fecha_fin: project.fecha_fin || '',
      horas_totales: project.horas_totales,
      activo: project.activo,
    });
    setIsEditing(true);
  };
  
  // Filter projects based on search query
  const filteredProjects = searchQuery
    ? projects.filter(project => 
        project.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.cliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.descripcion && project.descripcion.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : projects;
    
  // If loading, show skeleton
  if (loading) {
    return <ProjectManagerSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ProjectManagerHeader
        searchQuery={searchQuery || ''}
        setSearchQuery={setSearchQuery}
        totalProjects={projects.length}
        activeProjects={projects.filter(p => p.activo).length}
      />

      {/* Two-Column Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Project Form Card */}
          <div>
            <ProjectForm 
              formData={formData}
              setFormData={setFormData}
              clients={clients}
              isEditing={isEditing}
              isCreating={isCreating}
              isUpdating={isUpdating}
              isArchiving={isArchiving}
              selectedProject={selectedProject}
              handleInputChange={handleInputChange}
              handleCreateProject={handleCreateProject}
              handleUpdateProject={handleUpdateProject}
              handleArchiveProject={handleArchiveProject}
              resetForm={resetForm}
            />
          </div>
          
          {/* Right Column - Project List */}
          <div>
            <AnimatePresence mode="wait">
              <ProjectList
                projects={projects}
                filteredProjects={filteredProjects}
                selectedProject={selectedProject}
                handleSelectProject={handleSelectProject}
                handleArchiveProject={handleArchiveProject}
                isArchiving={isArchiving}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
