import { Client, Project, Role } from '@/interfaces/project';

/**
 * Fetch all projects from the API
 * @returns {Promise<Project[]>} Array of projects
 */
export async function fetchProjects(): Promise<Project[]> {
  try {
    const response = await fetch('/api/manager/proyectos');
    if (!response.ok) {
      throw new Error('Failed to fetch projects');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

/**
 * Fetch all clients from the API
 * @returns {Promise<Client[]>} Array of clients
 */
export async function fetchClients(): Promise<Client[]> {
  try {
    const response = await fetch('/api/manager/clients');
    if (!response.ok) {
      throw new Error('Failed to fetch clients');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
}

/**
 * Enhance projects with client information
 * @param {Project[]} projects - Array of projects to enhance
 * @param {Client[]} clients - Array of clients
 * @returns {Project[]} Enhanced projects with client names
 */
export function enhanceProjectsWithClientInfo(projects: Project[], clients: Client[]): Project[] {
  return projects.map(project => {
    const client = clients.find((c) => c.id_cliente === project.id_cliente);
    return {
      ...project,
      cliente: client?.nombre || 'Cliente Desconocido'
    };
  });
}

/**
 * Create a new project
 * @param {Partial<Project>} projectData - Project data to create
 * @returns {Promise<Project>} Created project
 */
export async function createProject(projectData: Partial<Project>): Promise<Project> {
  try {
    const response = await fetch('/api/manager/proyectos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error creating project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

/**
 * Update an existing project
 * @param {string} projectId - ID of the project to update
 * @param {Partial<Project>} projectData - Updated project data
 * @returns {Promise<Project>} Updated project
 */
export async function updateProject(projectId: string, projectData: Partial<Project>): Promise<Project> {
  try {
    const response = await fetch(`/api/manager/proyectos/${projectId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error updating project');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
}

/**
 * Archive a project (mark as inactive)
 * @param {string} projectId - ID of the project to archive
 * @returns {Promise<void>}
 */
export async function archiveProject(projectId: string): Promise<void> {
  try {
    const response = await fetch(`/api/manager/proyectos/${projectId}`, {
      method: 'DELETE', // This actually just marks as inactive
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error archiving project');
    }
  } catch (error) {
    console.error('Error archiving project:', error);
    throw error;
  }
}

/**
 * Fetch all roles from the API
 * @returns {Promise<Role[]>} Array of roles
 */
export async function fetchRoles(): Promise<Role[]> {
  try {
    const response = await fetch('/api/manager/roles', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Ensure cookies are sent
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Roles API error:', response.status, errorText);
      throw new Error(`Failed to fetch roles: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

/**
 * Fetch roles for a specific project
 * @param {string} projectId - ID of the project to get roles for
 * @returns {Promise<Role[]>} Array of roles associated with the project
 */
export async function fetchProjectRoles(projectId: string): Promise<Role[]> {
  try {
    const response = await fetch(`/api/manager/proyectos/${projectId}/roles`);
    if (!response.ok) {
      throw new Error('Failed to fetch project roles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching project roles:', error);
    throw error;
  }
}

/**
 * Update the roles for a project
 * @param {string} projectId - ID of the project to update roles for
 * @param {string[]} roleIds - Array of role IDs to assign to the project
 * @returns {Promise<void>}
 */
export async function updateProjectRoles(projectId: string, roleIds: string[]): Promise<void> {
  try {
    const response = await fetch(`/api/manager/proyectos/${projectId}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roleIds }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error updating project roles');
    }
  } catch (error) {
    console.error('Error updating project roles:', error);
    throw error;
  }
}
