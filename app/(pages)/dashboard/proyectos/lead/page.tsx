'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotifications } from '@/context/notification-context';
import ProjectLeadHeader from '@/components/proyectos/lead/ProjectLeadHeader';
import ProjectLeadSkeleton from '@/components/proyectos/lead/ProjectLeadSkeleton';
import ProjectAssignment from '@/components/proyectos/lead/ProjectAssignment';
import ProjectUsersList from '@/components/proyectos/lead/ProjectUsersList';
import { Project, Role, User } from '@/interfaces/project';

export default function ProjectLeadPage() {
  // State for projects, roles, users, and current selections
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAssigning, setIsAssigning] = useState<boolean>(false);
  
  const { setNotifications } = useNotifications();

  // Function to fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Fetch projects assigned to the project lead
      const projectsResponse = await fetch('/api/lead/projects');
      const projectsData = await projectsResponse.json();
      
      // Check if the response has an error property
      if (projectsData.error) {
        console.error('Projects API returned an error:', projectsData.error);
        setProjects([]);
        setFilteredProjects([]);
      } else {
        setProjects(Array.isArray(projectsData) ? projectsData : []);
        setFilteredProjects(Array.isArray(projectsData) ? projectsData : []);
      }
      
      // Fetch all available roles for projects
      const rolesResponse = await fetch('/api/lead/roles');
      const rolesData = await rolesResponse.json();
      setRoles(Array.isArray(rolesData) ? rolesData : []);
      
      // Fetch available users that can be assigned to projects
      const usersResponse = await fetch('/api/lead/users');
      const usersData = await usersResponse.json();
      setUsers(Array.isArray(usersData) ? usersData : []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load projects, roles and users on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Filter projects based on search query
  useEffect(() => {
    // Check if projects is an array first
    if (!Array.isArray(projects)) {
      setFilteredProjects([]);
      return;
    }
    
    if (searchQuery) {
      const filtered = projects.filter(project => {
        // Check for null/undefined project or its properties
        if (!project) return false;
        
        const matchesTitle = project.titulo ? 
          project.titulo.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        const matchesDescription = project.descripcion ? 
          project.descripcion.toLowerCase().includes(searchQuery.toLowerCase()) : false;
        
        return matchesTitle || matchesDescription;
      });
      setFilteredProjects(filtered);
    } else {
      setFilteredProjects(projects);
    }
  }, [searchQuery, projects]);

  // Handle project selection
  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  // Handle user assignment to project
  const handleAssignUser = async (userId: string, roleId: string, hours: number) => {
    if (!selectedProject) return;
    
    try {
      setIsAssigning(true);
      
      const response = await fetch('/api/lead/assign-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          projectId: selectedProject.id_proyecto,
          roleId,
          hours
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error assigning user to project');
      }
      
      // Show success notification
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Usuario asignado',
          message: `Usuario asignado al proyecto "${selectedProject.titulo}" con éxito`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
      
      // Refresh project data
      const projectsResponse = await fetch('/api/lead/projects');
      const projectsData = await projectsResponse.json();
      
      // Check if the response has an error property
      if (!projectsData.error) {
        const projects = Array.isArray(projectsData) ? projectsData : [];
        setProjects(projects);
        setFilteredProjects(projects);
        
        // Update selected project with the new data
        const updatedSelectedProject = projects.find(
          (p: Project) => p.id_proyecto === selectedProject.id_proyecto
        );
        setSelectedProject(updatedSelectedProject || null);
      } else {
        console.error('Error refreshing projects:', projectsData.error);
      }
      
    } catch (error) {
      console.error('Error assigning user:', error);
      // Show error notification
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Error',
          message: `No se pudo asignar el usuario al proyecto: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          date: new Date(),
          read: false,
          type: 'project' // Using 'project' type since 'error' is not a valid notification type
        },
        ...prev
      ]);
    } finally {
      setIsAssigning(false);
    }
  };

  // If loading, show skeleton
  if (isLoading) {
    return <ProjectLeadSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <ProjectLeadHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalProjects={Array.isArray(projects) ? projects.length : 0}
        assignedUsers={Array.isArray(projects) ? projects.reduce((count, project) => count + (project.usuarios?.length || 0), 0) : 0}
      />

      {/* Two-Column Layout */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Project Assignment Form */}
          <div>
            <ProjectAssignment
              projects={filteredProjects}
              roles={roles}
              users={users}
              selectedProject={selectedProject}
              onSelectProject={handleSelectProject}
              onAssignUser={handleAssignUser}
              isAssigning={isAssigning}
              onProjectUpdated={fetchData} // Add this line
            />
          </div>
          
          {/* Right Column - Project Users List */}
          <div>
            <AnimatePresence mode="wait">
              <ProjectUsersList
                project={selectedProject}
                users={users}
                roles={roles}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}