// filepath: /Users/benjaminbelloeil/Desktop/Career/Programs/kitsoft/app/(pages)/dashboard/proyectos/manager/page.tsx
/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  FiInfo, 
  FiUsers, 
  FiCalendar, 
  FiClock, 
  FiX, 
  FiEdit,
  FiPlus,
  FiSave,
  FiTrash2,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectManagerHeader from '@/components/proyectos/manager/ProjectManagerHeader';
import ProjectManagerSkeleton from '@/components/proyectos/manager/ProjectManagerSkeleton';
import { useNotifications } from '@/context/notification-context';

// Define types for the project and client data
interface Client {
  id_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  url_logo: string | null;
}

interface Project {
  id_proyecto: string;
  titulo: string;
  descripcion: string | null;
  id_cliente: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  horas_totales: number;
  cliente?: string; // For UI display - will be populated from a separate API call or state
}

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
    if (!confirm('¿Estás seguro que deseas archivar este proyecto? Los proyectos archivados no aparecerán en la lista de proyectos activos.')) {
      return;
    }
    
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
      
      // Remove from projects list if it was active
      setProjects(prev => prev.filter(p => p.id_proyecto !== projectId));
      
      // If we were editing this project, reset the form
      if (selectedProject?.id_proyecto === projectId) {
        resetForm();
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
            <motion.div 
              className="bg-white rounded-xl shadow-md border border-gray-200 p-6 h-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#A100FF20]">
                  <FiFileText className="w-5 h-5 text-[#A100FF]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {isEditing ? 'Editar Proyecto' : 'Crear Proyecto'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {isEditing 
                      ? 'Modifica los datos del proyecto seleccionado' 
                      : 'Completa el formulario para crear un nuevo proyecto'}
                  </p>
                </div>
              </div>
              
              <form onSubmit={isEditing ? handleUpdateProject : handleCreateProject} className="space-y-5">
                <div className="relative">
                  <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    placeholder="Ingresa el título del proyecto"
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all"
                  />
                </div>
                
                <div className="relative">
                  <label htmlFor="id_cliente" className="block text-sm font-medium text-gray-700 mb-1">Cliente *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
                      <FiUsers className="h-4 w-4" />
                    </div>
                    <select
                      id="id_cliente"
                      name="id_cliente"
                      value={formData.id_cliente}
                      onChange={handleInputChange}
                      required
                      className="w-full appearance-none border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] focus:bg-[#FCFAFF] transition-all text-gray-800 font-medium"
                      style={{ 
                        fontSize: '0.95rem',
                        background: 'linear-gradient(to bottom, #ffffff, #f9f9f9)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                      }}
                    >
                      <option 
                        value="" 
                        disabled 
                        className="text-gray-400"
                        style={{
                          background: 'white',
                          padding: '8px',
                          borderBottom: '1px solid #f0f0f0'
                        }}
                      >
                        Selecciona un cliente
                      </option>
                      {clients && clients.length > 0 ? clients.map((client: Client) => (
                        <option 
                          key={client.id_cliente} 
                          value={client.id_cliente}
                          className="py-2 font-medium text-gray-800"
                          style={{ 
                            padding: '10px', 
                            background: 'white',
                            borderBottom: '1px solid #f0f0f0'
                          }}
                        >
                          {client.nombre}
                        </option>
                      )) : (
                        <option value="" disabled>Cargando clientes...</option>
                      )}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#A100FF]">
                      <FiChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                  
                  {/* Client information card - Fixed DOM nesting */}
                  {formData.id_cliente && (
                    <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                      style={{
                        opacity: 1,
                        transform: 'translateY(0)',
                        transition: 'opacity 0.2s ease, transform 0.2s ease'
                      }}
                    >
                      {(() => {
                        const selectedClient = clients.find(c => c.id_cliente === formData.id_cliente);
                        if (!selectedClient) return null;
                        
                        return (
                          <div className="flex flex-col space-y-3">
                            {/* Client logo - optimized for horizontal logos */}
                            {selectedClient.url_logo ? (
                              <div className="bg-white p-2 rounded-md border border-gray-100 shadow-sm w-full h-14 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={selectedClient.url_logo} 
                                  alt={selectedClient.nombre}
                                  className="max-w-full max-h-12 object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-full h-12 bg-gray-100 rounded-md flex items-center justify-center text-lg font-medium text-gray-600">
                                {selectedClient.nombre.charAt(0)}
                              </div>
                            )}
                            
                            {/* Client details */}
                            <div className="flex flex-col space-y-2">                                
                              <div className="grid grid-cols-1 gap-2 text-xs text-gray-600">
                                {selectedClient.correo && (
                                  <div className="flex items-center">
                                    <span className="w-20 text-gray-500">Correo:</span>
                                    <span className="font-medium">{selectedClient.correo}</span>
                                  </div>
                                )}
                                
                                {selectedClient.telefono && (
                                  <div className="flex items-center">
                                    <span className="w-20 text-gray-500">Teléfono:</span>
                                    <span className="font-medium">{selectedClient.telefono}</span>
                                  </div>
                                )}
                                
                                {selectedClient.direccion && (
                                  <div className="flex items-start">
                                    <span className="w-20 text-gray-500">Dirección:</span>
                                    <span className="font-medium">{selectedClient.direccion}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
                
                <div className="relative">
                  <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion || ''}
                    onChange={handleInputChange}
                    rows={3}
                    maxLength={500}
                    placeholder="Describe el proyecto brevemente"
                    className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all resize-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label htmlFor="fecha_inicio" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
                        <FiCalendar className="h-4 w-4" />
                      </div>
                      <input
                        type="date"
                        id="fecha_inicio"
                        name="fecha_inicio"
                        value={formData.fecha_inicio}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all [color-scheme:light]"
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label htmlFor="fecha_fin" className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
                        <FiCalendar className="h-4 w-4" />
                      </div>
                      <input
                        type="date"
                        id="fecha_fin"
                        name="fecha_fin"
                        value={formData.fecha_fin || ''}
                        onChange={handleInputChange}
                        min={formData.fecha_inicio}
                        className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all [color-scheme:light]"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <label htmlFor="horas_totales" className="block text-sm font-medium text-gray-700 mb-1">Horas Totales *</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
                      <FiClock className="h-4 w-4" />
                    </div>
                    <input
                      type="number"
                      id="horas_totales"
                      name="horas_totales"
                      value={formData.horas_totales}
                      onChange={handleInputChange}
                      min="0"
                      required
                      placeholder="Número de horas"
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all"
                    />
                  </div>
                </div>
                
                {isEditing && (
                  <div className="relative">
                    <label htmlFor="activo" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                    <div className="relative">
                      <select
                        id="activo"
                        name="activo"
                        value={formData.activo ? "true" : "false"}
                        onChange={(e) => setFormData({...formData, activo: e.target.value === "true"})}
                        className="w-full appearance-none border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all pr-10"
                      >
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <FiChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-200">
                  {isEditing ? (
                    <>
                      {/* Button replaced with regular button + CSS for animation */}
                      <button
                        type="button"
                        onClick={resetForm}
                        disabled={isUpdating || isArchiving}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm border border-gray-200 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                        style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                      >
                        Cancelar
                      </button>
                      <div className="flex space-x-3">
                        {/* Archive Button */}
                        <button
                          type="button"
                          onClick={() => selectedProject && handleArchiveProject(selectedProject.id_proyecto)}
                          disabled={isUpdating || isArchiving}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm border border-red-100 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                          style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                        >
                          {isArchiving ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiTrash2 className="h-4 w-4" />
                          )}
                          <span>{isArchiving ? 'Archivando...' : 'Archivar'}</span>
                        </button>
                        {/* Save Button */}
                        <button
                          type="submit"
                          disabled={isUpdating || isArchiving}
                          className="px-5 py-2.5 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00D4] transition-colors flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                          style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                        >
                          {isUpdating ? (
                            <FiLoader className="h-4 w-4 animate-spin" />
                          ) : (
                            <FiSave className="h-4 w-4" />
                          )}
                          <span>{isUpdating ? 'Guardando...' : 'Guardar'}</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Create Button */}
                      <button
                        type="submit"
                        disabled={isCreating}
                        className="px-5 py-2.5 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00D4] transition-colors flex items-center gap-2 shadow-md ml-auto disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                        style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                      >
                        {isCreating ? (
                          <FiLoader className="h-4 w-4 animate-spin" />
                        ) : (
                          <FiPlus className="h-4 w-4" />
                        )}
                        <span>{isCreating ? 'Creando...' : 'Crear Proyecto'}</span>
                      </button>
                    </>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
          
          {/* Right Column - Project List */}
          <div>
            <AnimatePresence mode="wait">
              {filteredProjects.length === 0 ? (
                <motion.div 
                  key="empty"
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-10 text-center h-full flex flex-col justify-center items-center"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
                >
                  <div 
                    className="w-20 h-20 bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] rounded-full flex items-center justify-center mb-6 border-2 border-[#A100FF20] shadow-lg pulse-animation"
                  >
                    <FiInfo className="h-8 w-8 text-[#A100FF]" />
                  </div>
                  
                  <h2 
                    className="text-2xl font-semibold mb-3 text-gray-800"
                  >
                    No hay proyectos
                  </h2>
                  
                  <p 
                    className="text-gray-600 mb-8 max-w-md mx-auto"
                  >
                    No se encontraron proyectos. Para comenzar, utiliza el formulario de la izquierda para crear un nuevo proyecto.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="h-full flex flex-col"
                >
                  {/* Projects List Display */}
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col h-full">
                    <div className="border-b border-gray-100 p-4 bg-gradient-to-r from-gray-50 to-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <FiUsers className="mr-2 text-[#A100FF]" />
                        Lista de Proyectos
                      </h3>
                      <p className="text-sm text-gray-500">
                        Mostrando {filteredProjects.length} de {projects.length} proyectos
                      </p>
                    </div>
                    <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-[#A100FF20] scrollbar-track-gray-50">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-white sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Proyecto</th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha Inicio</th>
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                            <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {filteredProjects.map((project, index) => (
                            <tr 
                              key={project.id_proyecto} 
                              className={`cursor-pointer relative ${selectedProject?.id_proyecto === project.id_proyecto ? 'bg-[#F9F5FF]' : 'hover:bg-gray-50'}`}
                              style={{
                                opacity: 1,
                                transform: 'translateY(0px)',
                                transition: `opacity 0.2s, transform 0.2s ${index * 0.03}s`
                              }}
                            >
                              {/* Highlight for selected project */}
                              {selectedProject?.id_proyecto === project.id_proyecto && (
                                <div 
                                  className="absolute left-0 top-0 h-full w-1 bg-[#A100FF]"
                                ></div>
                              )}
                              
                              <td 
                                className="px-6 py-4 whitespace-nowrap"
                                onClick={() => handleSelectProject(project)}
                              >
                                <div className="text-sm font-medium text-gray-900 group-hover:text-[#A100FF] transition-colors">
                                  {project.titulo}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 flex items-center">
                                  <FiClock className="h-3 w-3 mr-1 text-[#A100FF]" />
                                  Horas: {project.horas_totales}
                                </div>
                              </td>
                              
                              <td 
                                className="px-6 py-4 whitespace-nowrap"
                                onClick={() => handleSelectProject(project)}
                              >
                                <div className="text-sm text-gray-600 flex items-center">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 mr-2 border border-gray-200">
                                    {project.cliente?.charAt(0) || 'C'}
                                  </div>
                                  {project.cliente}
                                </div>
                              </td>
                              
                              <td 
                                className="px-6 py-4 whitespace-nowrap"
                                onClick={() => handleSelectProject(project)}
                              >
                                <div className="text-sm text-gray-600 flex items-center">
                                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                  {new Date(project.fecha_inicio).toLocaleDateString('es-ES')}
                                </div>
                              </td>
                              
                              <td 
                                className="px-6 py-4 whitespace-nowrap"
                                onClick={() => handleSelectProject(project)}
                              >
                                {/* Replaced motion.span with regular span */}
                                <span 
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium hover:scale-105 ${
                                    project.activo 
                                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm' 
                                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 shadow-sm'
                                  }`}
                                  style={{
                                    transition: 'transform 0.2s ease',
                                  }}
                                >
                                  <span className={`w-2 h-2 rounded-full mr-1 ${project.activo ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  {project.activo ? 'Activo' : 'Inactivo'}
                                </span>
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex justify-end space-x-2">
                                  {/* Replaced motion.button with regular buttons */}
                                  <button
                                    onClick={() => handleSelectProject(project)}
                                    className="p-2 rounded-full bg-[#A100FF10] hover:bg-[#A100FF20] transition-colors shadow-sm hover:scale-110 hover:rotate-12 active:scale-90"
                                    style={{ 
                                      transition: 'transform 0.2s ease, background-color 0.2s ease, rotate 0.2s ease' 
                                    }}
                                  >
                                    <FiEdit className="h-4 w-4 text-[#A100FF]" />
                                  </button>
                                  <button
                                    onClick={() => handleArchiveProject(project.id_proyecto)}
                                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors shadow-sm hover:scale-110 active:scale-90"
                                    style={{ 
                                      transition: 'transform 0.2s ease, background-color 0.2s ease' 
                                    }}
                                  >
                                    <FiTrash2 className="h-4 w-4 text-red-500" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Scroll indicator */}
                    <div className="bg-gradient-to-b from-transparent to-gray-100 h-4 w-full opacity-50"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
