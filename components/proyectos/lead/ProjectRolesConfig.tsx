'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiLoader, FiTag, FiCheck } from 'react-icons/fi';
import { Project, Role } from '@/interfaces/project';
import { useNotifications } from '@/context/notification-context';

interface ProjectRolesConfigProps {
  project: Project | null;
  allRoles: Role[];
  onConfigUpdated: () => void;
}

export default function ProjectRolesConfig({
  project,
  allRoles,
  onConfigUpdated
}: ProjectRolesConfigProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [isConfiguring, setIsConfiguring] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const { setNotifications } = useNotifications();
  const searchRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initialRolesRef = useRef<string[]>([]);
  const lastSavedRolesRef = useRef<string[]>([]);
  const projectIdRef = useRef<string | null>(null);

  // Function to check if roles have actually changed
  const areRolesChanged = useCallback((currentRoles: string[], initialRoles: string[]) => {
    // First quick check: different lengths means different content
    if (currentRoles.length !== initialRoles.length) {
      console.log('Role arrays have different lengths, roles changed');
      return true;
    }
    
    // Convert to sets for efficient comparison
    const currentSet = new Set(currentRoles);
    const initialSet = new Set(initialRoles);
    
    // Check if any role in initialRoles is missing from currentRoles
    for (const roleId of initialRoles) {
      if (!currentSet.has(roleId)) {
        console.log(`Role ${roleId} was removed, roles changed`);
        return true;
      }
    }
    
    // Check if any role in currentRoles is missing from initialRoles
    for (const roleId of currentRoles) {
      if (!initialSet.has(roleId)) {
        console.log(`Role ${roleId} was added, roles changed`);
        return true;
      }
    }
    
    console.log('No role changes detected');
    return false;
  }, []);

  // Update selected roles when project changes and store project ID
  useEffect(() => {
    if (project) {
      if (projectIdRef.current !== project.id_proyecto) {
        // Project has changed, reset everything
        projectIdRef.current = project.id_proyecto;
        
        // Ensure project.roles is defined before mapping
        const roles = project.roles || [];
        const projectRoleIds = roles.map(role => role.id_rol);
        
        console.log('Project changed, updating role IDs:', projectRoleIds);
        setSelectedRoles(projectRoleIds);
        initialRolesRef.current = [...projectRoleIds];
        lastSavedRolesRef.current = [...projectRoleIds];
        setShowSavedIndicator(false);
        
        // Clear any pending save operations
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = null;
        }
      }
    } else {
      projectIdRef.current = null;
      setSelectedRoles([]);
      initialRolesRef.current = [];
      lastSavedRolesRef.current = [];
    }
  }, [project]);

  // Click outside handler to hide results when clicking elsewhere
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Auto-save after role selection changes with a longer delay
  useEffect(() => {
    // Skip on initial component mount or when project changes
    if (!project) return;
    
    // Clear any existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    console.log('Selected roles changed:', selectedRoles);
    console.log('Last saved roles:', lastSavedRolesRef.current);
    
    // Only proceed if roles have actually changed from LAST SAVED state
    if (areRolesChanged(selectedRoles, lastSavedRolesRef.current)) {
      console.log('Roles have changed, scheduling save');
      // Set new timeout for auto-save (2000ms delay)
      saveTimeoutRef.current = setTimeout(() => {
        console.log('Auto-save triggered');
        saveRoleConfiguration();
      }, 2000);
    } else {
      // If returning to same state as last saved, make sure we update the UI
      console.log('Roles unchanged, updating UI');
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 3000);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoles]);

  // Handler for toggling a role selection
  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => {
      // Use functional update to ensure we get the latest state
      const newRoles = prev.includes(roleId)
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId];
      
      return newRoles;
    });
    
    // Hide saved indicator when a change is made
    setShowSavedIndicator(false);
  };

  // Handler to save role configuration
  const saveRoleConfiguration = async () => {
    if (!project) return;
    
    // Add debug log to see the state of selectedRoles and lastSavedRolesRef
    console.log('Saving roles configuration:');
    console.log('Current selectedRoles:', selectedRoles);
    console.log('Last saved roles:', lastSavedRolesRef.current);
    console.log('Project ID:', project.id_proyecto);
    console.log('Has changed:', areRolesChanged(selectedRoles, lastSavedRolesRef.current));
    
    // Only save if roles have actually changed from last saved state
    if (!areRolesChanged(selectedRoles, lastSavedRolesRef.current)) {
      console.log('No changes detected, not saving');
      return;
    }
    
    try {
      setIsConfiguring(true);
      console.log('Sending updated roles to server...');
      
      // Make a local copy of selected roles to prevent race conditions
      const rolesToSave = [...selectedRoles];
      
      const response = await fetch('/api/lead/project-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: project.id_proyecto,
          roleIds: rolesToSave
        }),
      });

      // Add debug log for response
      console.log('API Response status:', response.status);
      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Error al configurar roles');
      }
      
      // Update lastSavedRolesRef with what was actually saved
      lastSavedRolesRef.current = [...rolesToSave];
      console.log('Updated lastSavedRolesRef:', lastSavedRolesRef.current);
      
      // Show saved indicator for 3 seconds
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 3000);
      
      // Show success notification
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Roles configurados',
          message: `Roles configurados para el proyecto "${project.titulo}" con éxito`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
      
      // Instead of optimistic UI updates, let's always call onConfigUpdated to ensure data freshness
      console.log('Calling onConfigUpdated to refresh project data');
      onConfigUpdated();
      
      // Update the local reference to what the server now has
      if (project) {
        // Update the project.roles with the newly saved roles
        project.roles = rolesToSave.map(roleId => {
          const role = allRoles.find(r => r.id_rol === roleId);
          return {
            id_rol: roleId,
            nombre: role?.nombre || 'Rol desconocido',
            descripcion: role?.descripcion || null
          };
        });
      }
      
    } catch (error) {
      console.error('Error saving role config:', error);
      setNotifications(prev => [
        {
          id: Date.now().toString(),
          title: 'Error',
          message: `No se pudieron configurar los roles: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          date: new Date(),
          read: false,
          type: 'project'
        },
        ...prev
      ]);
      
      // On error, revert to the last successfully saved roles
      setSelectedRoles([...lastSavedRolesRef.current]);
    } finally {
      setIsConfiguring(false);
    }
  };

  // Filter roles based on search term
  const filteredRoles = searchTerm 
    ? allRoles.filter(role =>
        role.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : allRoles;
    
  // Get selected role objects for display
  const selectedRoleObjects = selectedRoles
    .map(id => allRoles.find(role => role.id_rol === id))
    .filter(role => role !== undefined) as Role[];

  if (!project) {
    return null;
  }

  return (
    <div className="mt-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Configurar roles necesarios
      </label>
      
      {/* Search input with icon */}
      <div className="relative mb-1" ref={searchRef}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch className="text-gray-400" />
        </div>
        
        <input
          type="text"
          placeholder="Buscar y seleccionar roles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF]"
        />
        
        {/* Results panel that appears when focused or has search term */}
        {(isFocused || searchTerm) && (
          <div className="absolute z-10 mt-1 w-full border border-gray-300 rounded-lg bg-white shadow-lg">
            <div className="max-h-40 overflow-y-auto p-2 space-y-1">
              {filteredRoles.length > 0 ? (
                filteredRoles.map(role => (
                  <div
                    key={role.id_rol}
                    className="flex items-center p-2 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleRole(role.id_rol);
                    }}
                  >
                    <input
                      type="checkbox"
                      id={`role-${project.id_proyecto}-${role.id_rol}`}
                      checked={selectedRoles.includes(role.id_rol)}
                      onChange={() => toggleRole(role.id_rol)} 
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleRole(role.id_rol);
                      }}
                      className="mr-2 h-4 w-4 text-[#A100FF] focus:ring-[#A100FF40] border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor={`role-${project.id_proyecto}-${role.id_rol}`}
                      className="text-sm text-gray-700 cursor-pointer flex-grow"
                    >
                      {role.nombre}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-2">No se encontraron roles.</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Selected roles display card */}
      <div className="mt-3 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center">
            <FiTag className="text-[#A100FF] mr-2" />
            <h3 className="text-sm font-medium text-gray-700">
              Roles seleccionados
            </h3>
          </div>
          {isConfiguring && (
            <div className="flex items-center text-xs text-gray-500">
              <FiLoader className="animate-spin mr-1 text-[#A100FF]" />
              Guardando...
            </div>
          )}
          {!isConfiguring && showSavedIndicator && (
            <div className="flex items-center text-xs text-green-600">
              <FiCheck className="mr-1" />
              Guardado
            </div>
          )}
        </div>
        
        <div className="p-3">
          {selectedRoleObjects.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedRoleObjects.map(role => (
                <div 
                  key={role.id_rol}
                  className="group relative inline-flex items-center bg-gradient-to-r from-[#A100FF10] to-[#A100FF20] text-[#A100FF] text-sm rounded-md px-3 py-1.5 border border-[#A100FF30] shadow-sm"
                >
                  {role.nombre}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleRole(role.id_rol);
                    }}
                    className="ml-1.5 hover:bg-[#A100FF20] rounded-full p-0.5"
                    title="Eliminar rol"
                    type="button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-2">
              No hay roles seleccionados para este proyecto.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
