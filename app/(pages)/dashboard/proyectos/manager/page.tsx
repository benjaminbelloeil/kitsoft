/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  FiAlertCircle
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectManagerHeader from '@/components/proyectos/manager/ProjectManagerHeader';
import ProjectManagerSkeleton from '@/components/proyectos/manager/ProjectManagerSkeleton';

// Define types for the project data
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
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
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
        const clientsResponse = await fetch('/api/clientes');
        const clientsData = await clientsResponse.json();
        
        setProjects(projectsData);
        setClients(clientsData);
        
        // Map client names to projects for display
        const enhancedProjects = projectsData.map((project: Project) => {
          const client = clientsData.find((c: any) => c.id_cliente === project.id_cliente);
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
      const client = clients.find((c: any) => c.id_cliente === newProject.id_cliente);
      newProject.cliente = client?.nombre || 'Cliente Desconocido';
      
      // Update projects list with new project
      setProjects(prev => [newProject, ...prev]);
      
      // Reset form for new entries
      resetForm();
      
      // Display success notification to user
      alert('Proyecto creado con éxito');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  };
  
  // Handle edit project form submission
  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) return;
    
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
      const client = clients.find((c: any) => c.id_cliente === updatedProject.id_cliente);
      updatedProject.cliente = client?.nombre || 'Cliente Desconocido';
      
      // Update projects list with the edited project
      setProjects(prev => prev.map(p => 
        p.id_proyecto === updatedProject.id_proyecto ? updatedProject : p
      ));
      
      // Reset form and clear selection
      resetForm();
      
      // Display success notification to user
      alert('Proyecto actualizado con éxito');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Error updating project. Please try again.');
    }
  };
  
  // Handle project archiving (marking as inactive)
  const handleArchiveProject = async (projectId: string) => {
    if (!confirm('¿Estás seguro que deseas archivar este proyecto? Los proyectos archivados no aparecerán en la lista de proyectos activos.')) {
      return;
    }
    
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
      
      // Display success notification to user
      alert('Proyecto archivado con éxito');
    } catch (error) {
      console.error('Error archiving project:', error);
      alert('Error archiving project. Please try again.');
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
                    <select
                      id="id_cliente"
                      name="id_cliente"
                      value={formData.id_cliente}
                      onChange={handleInputChange}
                      required
                      className="w-full appearance-none border border-gray-300 rounded-lg shadow-sm py-2.5 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all pr-10"
                    >
                      <option value="">Selecciona un cliente</option>
                      {clients.map((client: any) => (
                        <option key={client.id_cliente} value={client.id_cliente}>
                          {client.nombre}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <FiChevronDown className="w-4 h-4" />
                    </div>
                  </div>
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
                      <motion.button
                        type="button"
                        onClick={resetForm}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm border border-gray-200"
                      >
                        Cancelar
                      </motion.button>
                      <div className="flex space-x-3">
                        <motion.button
                          type="button"
                          onClick={() => selectedProject && handleArchiveProject(selectedProject.id_proyecto)}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2 shadow-sm border border-red-100"
                        >
                          <FiTrash2 className="h-4 w-4" />
                          <span>Archivar</span>
                        </motion.button>
                        <motion.button
                          type="submit"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="px-5 py-2.5 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00D4] transition-colors flex items-center gap-2 shadow-md"
                        >
                          <FiSave className="h-4 w-4" />
                          <span>Guardar</span>
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="px-5 py-2.5 bg-[#A100FF] text-white rounded-lg hover:bg-[#8A00D4] transition-colors flex items-center gap-2 shadow-md ml-auto"
                      >
                        <FiPlus className="h-4 w-4" />
                        <span>Crear Proyecto</span>
                      </motion.button>
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
                  <motion.div 
                    className="w-20 h-20 bg-gradient-to-br from-[#A100FF10] to-[#A100FF20] rounded-full flex items-center justify-center mb-6 border-2 border-[#A100FF20] shadow-lg"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, -5, 0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  >
                    <FiInfo className="h-8 w-8 text-[#A100FF]" />
                  </motion.div>
                  
                  <motion.h2 
                    className="text-2xl font-semibold mb-3 text-gray-800"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    No hay proyectos
                  </motion.h2>
                  
                  <motion.p 
                    className="text-gray-600 mb-8 max-w-md mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    No se encontraron proyectos. Para comenzar, utiliza el formulario de la izquierda para crear un nuevo proyecto.
                  </motion.p>
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
                            <motion.tr 
                              key={project.id_proyecto} 
                              className={`cursor-pointer relative ${selectedProject?.id_proyecto === project.id_proyecto ? 'bg-[#F9F5FF]' : 'hover:bg-gray-50'}`}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.03 }}
                              whileHover={{ backgroundColor: selectedProject?.id_proyecto === project.id_proyecto ? "#F0E6FF" : "#F9FAFB" }}
                            >
                              {/* Highlight for selected project */}
                              {selectedProject?.id_proyecto === project.id_proyecto && (
                                <motion.div 
                                  className="absolute left-0 top-0 h-full w-1 bg-[#A100FF]"
                                  layoutId="selectedIndicator"
                                />
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
                                <motion.span 
                                  whileHover={{ scale: 1.05 }}
                                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    project.activo 
                                      ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm' 
                                      : 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 border border-gray-200 shadow-sm'
                                  }`}
                                >
                                  <span className={`w-2 h-2 rounded-full mr-1 ${project.activo ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  {project.activo ? 'Activo' : 'Inactivo'}
                                </motion.span>
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                <div className="flex justify-end space-x-2">
                                  <motion.button
                                    onClick={() => handleSelectProject(project)}
                                    className="p-2 rounded-full bg-[#A100FF10] hover:bg-[#A100FF20] transition-colors shadow-sm"
                                    whileHover={{ scale: 1.1, rotate: 12 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiEdit className="h-4 w-4 text-[#A100FF]" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleArchiveProject(project.id_proyecto)}
                                    className="p-2 rounded-full bg-red-50 hover:bg-red-100 transition-colors shadow-sm"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <FiTrash2 className="h-4 w-4 text-red-500" />
                                  </motion.button>
                                </div>
                              </td>
                            </motion.tr>
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
      
      {/* Project View/Edit modals removed as they're now part of the main UI */}
    </div>
  );
}
