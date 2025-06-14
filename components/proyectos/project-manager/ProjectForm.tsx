/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import { 
  FiFileText, 
  FiUsers,
  FiCalendar,
  FiClock,
  FiChevronDown,
  FiPlus,
  FiSave,
  FiArchive,
  FiCheck,
  FiX,
  FiSearch
} from 'react-icons/fi';
import ArchiveProjectModal from '@/components/proyectos//project-manager/ArchiveProjectModal';
import { motion } from 'framer-motion';
import { Client, Project, Role, ProjectLead } from '@/interfaces/project';
import ClientDetails from './ClientDetails';

interface ProjectFormProps {
  formData: Partial<Project>;
  setFormData: (data: Partial<Project>) => void;
  clients: Client[];
  roles: Role[];
  selectedRoles: string[];
  setSelectedRoles: (roles: string[]) => void;
  isEditing: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isArchiving: boolean;
  selectedProject: Project | null;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleCreateProject: (e: React.FormEvent) => Promise<void>;
  handleUpdateProject: (e: React.FormEvent) => Promise<void>;
  handleArchiveProject: (projectId: string) => Promise<void>;
  resetForm: () => void;
}

export default function ProjectForm({
  formData,
  setFormData,
  clients,
  roles,
  selectedRoles,
  setSelectedRoles,
  isEditing,
  isCreating,
  isUpdating,
  isArchiving,
  selectedProject,
  handleInputChange,
  handleCreateProject,
  handleUpdateProject,
  handleArchiveProject,
  resetForm
}: ProjectFormProps) {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [projectLeads, setProjectLeads] = useState<ProjectLead[]>([]);
  const [selectedProjectLead, setSelectedProjectLead] = useState<ProjectLead | null>(null);
  const [loadingProjectLeads, setLoadingProjectLeads] = useState(false);

  // Fetch project leads
  const fetchProjectLeads = async () => {
    setLoadingProjectLeads(true);
    try {
      const response = await fetch('/api/project-lead/users');
      if (response.ok) {
        const leads = await response.json();
        setProjectLeads(leads);
      } else {
        console.error('Error fetching project leads');
      }
    } catch (error) {
      console.error('Error fetching project leads:', error);
    } finally {
      setLoadingProjectLeads(false);
    }
  };

  // Load project leads on component mount
  useEffect(() => {
    fetchProjectLeads();
  }, []);

  // Filter roles based on search query
  const filteredRoles = roles.filter(role =>
    role.nombre.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
    role.descripcion?.toLowerCase().includes(roleSearchQuery.toLowerCase())
  );

  // Update selected client when form data changes
  useEffect(() => {
    if (formData.id_cliente) {
      const client = clients.find(c => c.id_cliente === formData.id_cliente) || null;
      setSelectedClient(client);
    } else {
      setSelectedClient(null);
    }
  }, [formData.id_cliente, clients]);

  // Update selected project lead when form data changes
  useEffect(() => {
    if (formData.id_projectlead) {
      const lead = projectLeads.find(l => l.id_usuario === formData.id_projectlead) || null;
      setSelectedProjectLead(lead);
    } else {
      setSelectedProjectLead(null);
    }
  }, [formData.id_projectlead, projectLeads]);

  const handleProjectLeadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leadId = e.target.value;
    setFormData({ ...formData, id_projectlead: leadId });
  };

  return (
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
        </div>
        
        {/* Client details section */}
        {selectedClient && (
          <ClientDetails client={selectedClient} />
        )}
        
        {/* Project Lead Selection */}
        <div className="relative">
          <label htmlFor="id_projectlead" className="block text-sm font-medium text-gray-700 mb-1">
            Project Lead * 
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
              <FiUsers className="h-4 w-4" />
            </div>
            <select
              id="id_projectlead"
              name="id_projectlead"
              value={formData.id_projectlead || ''}
              onChange={handleProjectLeadChange}
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
                {loadingProjectLeads ? 'Cargando project leads...' : 'Selecciona un project lead'}
              </option>
              {projectLeads && projectLeads.length > 0 ? projectLeads.map((lead: ProjectLead) => (
                <option 
                  key={lead.id_usuario} 
                  value={lead.id_usuario}
                  className="py-2 font-medium text-gray-800"
                  style={{ 
                    padding: '10px', 
                    background: 'white',
                    borderBottom: '1px solid #f0f0f0'
                  }}
                >
                  {lead.nombre} {lead.apellido} {lead.titulo ? `- ${lead.titulo}` : ''}
                </option>
              )) : (
                <option value="" disabled>
                  {loadingProjectLeads ? 'Cargando...' : 'No hay project leads disponibles'}
                </option>
              )}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#A100FF]">
              <FiChevronDown className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Selected Project Lead Details */}
        {selectedProjectLead && (
          <div className="bg-gradient-to-r from-[#A100FF08] to-[#A100FF05] border border-[#A100FF20] rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src={selectedProjectLead.url_avatar || '/placeholder-avatar.png'}
                  alt={`${selectedProjectLead.nombre} ${selectedProjectLead.apellido}`}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#A100FF30] shadow-md"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#A100FF] rounded-full flex items-center justify-center">
                  <FiUsers className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">
                  {selectedProjectLead.nombre} {selectedProjectLead.apellido}
                </h4>
                {selectedProjectLead.titulo && (
                  <p className="text-sm text-gray-600">{selectedProjectLead.titulo}</p>
                )}
                <p className="text-xs text-[#A100FF] font-medium">Project Lead Asignado</p>
              </div>
            </div>
          </div>
        )}
        
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
        
        {/* Roles Section */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-3">Roles del Proyecto</label>
          
          {/* Combined Card for Search and Selected Roles */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
            {/* Role Search Bar */}
            <div className="relative mb-4">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A100FF]">
                <FiSearch className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Buscar y agregar roles..."
                value={roleSearchQuery}
                onChange={(e) => setRoleSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-lg shadow-sm py-2.5 pl-10 pr-4 bg-white focus:outline-none focus:ring-2 focus:ring-[#A100FF40] focus:border-[#A100FF] transition-all"
              />
              
              {/* Search Suggestions Dropdown */}
              {roleSearchQuery && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {filteredRoles.filter(role => !selectedRoles.includes(role.id_rol)).length > 0 ? (
                    filteredRoles.filter(role => !selectedRoles.includes(role.id_rol)).map((role) => (
                      <button
                        key={role.id_rol}
                        type="button"
                        onClick={() => {
                          setSelectedRoles([...selectedRoles, role.id_rol]);
                          setRoleSearchQuery('');
                        }}
                        className="w-full flex items-center space-x-3 p-3 hover:bg-[#A100FF10] transition-colors text-left border-b border-gray-100 last:border-b-0"
                      >
                        <FiPlus className="h-4 w-4 text-[#A100FF] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{role.nombre}</p>
                          {role.descripcion && (
                            <p className="text-xs text-gray-500 truncate">{role.descripcion}</p>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-sm text-gray-500 text-center">
                      {roleSearchQuery ? 'No se encontraron roles disponibles' : 'Todos los roles ya están seleccionados'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Selected Roles Display */}
            <div>
              <div className="min-h-[80px] max-h-48 overflow-y-auto">
                {selectedRoles.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRoles.map((roleId) => {
                      const role = roles.find(r => r.id_rol === roleId);
                      return role ? (
                        <div
                          key={role.id_rol}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{role.nombre}</p>
                            {role.descripcion && (
                              <p className="text-xs text-gray-500 truncate">{role.descripcion}</p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedRoles(selectedRoles.filter(id => id !== role.id_rol))}
                            className="ml-3 p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          >
                            <FiX className="h-4 w-4" />
                          </button>
                        </div>
                      ) : null;
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                    <FiUsers className="h-8 w-8 mb-2 text-gray-400" />
                    <p className="text-sm font-medium">No hay roles seleccionados</p>
                    <p className="text-xs text-gray-400 text-center">Usa la barra de búsqueda para agregar roles al proyecto</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="relative">
            <label htmlFor="activo" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <div className="flex gap-4 mt-1">
              <button
                type="button"
                onClick={() => setFormData({...formData, activo: true})}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  formData.activo 
                    ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 shadow-md text-green-700' 
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-green-50 hover:border-green-200 hover:text-green-700'
                }`}
              >
                {formData.activo && <FiCheck className="h-4 w-4" />}
                <span className="font-medium">Activo</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({...formData, activo: false})}
                className={`flex-1 py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                  !formData.activo 
                    ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 shadow-md text-red-700' 
                    : 'bg-white border border-gray-300 text-gray-600 hover:bg-red-50 hover:border-red-200 hover:text-red-700'
                }`}
              >
                {!formData.activo && <FiX className="h-4 w-4" />}
                <span className="font-medium">Inactivo</span>
              </button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          {isEditing ? (
            <>
              {/* Cancel Button */}
              <button
                type="button"
                onClick={resetForm}
                disabled={isUpdating || isArchiving}
                className="px-4 py-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors shadow-sm border border-red-200 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
              >
                Cancelar
              </button>
              
              <div className="flex space-x-2">
                {/* Archive Button */}
                <button
                  type="button"
                  onClick={() => setArchiveModalOpen(true)}
                  disabled={isUpdating || isArchiving}
                  className="px-4 py-2.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-2 shadow-sm border border-amber-200 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                  style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                >
                  <div className="flex items-center justify-center min-w-[90px]">
                    {isArchiving ? (
                      <div className="animate-spin h-5 w-5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <FiArchive className="h-4 w-4 mr-2" />
                        <span>Archivar</span>
                      </>
                    )}
                  </div>
                </button>
                {/* Save Button */}
                <button
                  type="submit"
                  disabled={isUpdating || isArchiving}
                  className="px-5 py-2.5 bg-[#A100FF20] text-[#A100FF] rounded-lg hover:bg-[#A100FF30] transition-colors flex items-center gap-2 shadow-sm border border-[#A100FF40] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                  style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
                >
                  <div className="flex items-center justify-center min-w-[90px]">
                    {isUpdating ? (
                      <div className="animate-spin h-5 w-5 border-2 border-[#A100FF] border-t-transparent rounded-full"></div>
                    ) : (
                      <>
                        <FiSave className="h-4 w-4 mr-2" />
                        <span>Guardar</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Empty div for spacing */}
              <div></div>
              {/* Create Button */}
              <button
                type="submit"
                disabled={isCreating}
                className="px-5 py-2.5 bg-[#A100FF20] text-[#A100FF] rounded-lg hover:bg-[#A100FF30] transition-colors flex items-center gap-2 shadow-sm border border-[#A100FF40] disabled:opacity-70 disabled:cursor-not-allowed hover:scale-103 active:scale-97"
                style={{ transition: 'transform 0.2s ease, background-color 0.2s ease' }}
              >
                <div className="flex items-center justify-center min-w-[120px]">
                  {isCreating ? (
                    <div className="animate-spin h-5 w-5 border-2 border-[#A100FF] border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <FiPlus className="h-4 w-4 mr-2" />
                      <span>Crear Proyecto</span>
                    </>
                  )}
                </div>
              </button>
            </>
          )}
        </div>
      </form>
      
      {/* Archive Confirmation Modal */}
      <ArchiveProjectModal
        isOpen={archiveModalOpen}
        isArchiving={isArchiving}
        projectTitle={selectedProject?.titulo}
        onClose={() => setArchiveModalOpen(false)}
        onConfirm={() => {
          if (selectedProject) {
            handleArchiveProject(selectedProject.id_proyecto);
            setArchiveModalOpen(false);
          }
        }}
      />
    </motion.div>
  );
}
