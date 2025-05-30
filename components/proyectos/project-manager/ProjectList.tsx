/* eslint-disable @next/next/no-img-element */
'use client';

import { 
  FiUsers, 
  FiEdit, 
  FiArchive,
  FiInfo 
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { Project } from '@/interfaces/project';
import { useState } from 'react';
import ArchiveProjectModal from '@/components/proyectos//project-manager/ArchiveProjectModal';

interface ProjectListProps {
  projects: Project[];
  filteredProjects: Project[];
  handleSelectProject: (project: Project) => void;
  handleArchiveProject: (projectId: string) => Promise<void>;
  selectedProject: Project | null;
  isArchiving?: boolean;
}

export default function ProjectList({
  projects,
  filteredProjects,
  handleSelectProject,
  handleArchiveProject,
  selectedProject,
  isArchiving
}: ProjectListProps) {
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [projectToArchive, setProjectToArchive] = useState<{id: string, title?: string} | null>(null);
  // Add a state to track which project is currently being archived
  const [archivingProjectId, setArchivingProjectId] = useState<string | null>(null);

  const openArchiveModal = (projectId: string, projectTitle?: string) => {
    setProjectToArchive({ id: projectId, title: projectTitle });
    setArchiveModalOpen(true);
  };

  const handleConfirmArchive = async () => {
    if (projectToArchive) {
      // Set the archiving project ID before starting the archive process
      setArchivingProjectId(projectToArchive.id);
      await handleArchiveProject(projectToArchive.id);
      setArchiveModalOpen(false);
      setProjectToArchive(null);
      // Reset the archiving project ID when done
      setArchivingProjectId(null);
    }
  };
  
  if (filteredProjects.length === 0) {
    return (
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
    );
  }
  
  return (
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
        <div className="border-b border-gray-100 p-6">
          <div className="flex items-center mb-0">
            <div className="w-12 h-12 bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] rounded-full flex items-center justify-center mr-4 shadow-lg border border-[#A100FF20]">
              <FiUsers className="w-5 h-5 text-[#A100FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                Lista de Proyectos
              </h2>
              <p className="text-sm text-gray-500">
                Mostrando {filteredProjects.length} de {projects.length} proyectos
              </p>
            </div>
          </div>
        </div>
        <div className="overflow-y-auto max-h-[600px] scrollbar-thin scrollbar-thumb-[#A100FF20] scrollbar-track-gray-50">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0 z-10 shadow-sm">
              <tr>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Proyecto</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Cliente</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Project Lead</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Horas</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Roles</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Fecha Inicio</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Fecha Fin</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Estado</th>
                <th scope="col" className="px-6 py-3.5 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider align-middle">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProjects.map((project, index) => (
                <tr 
                  key={project.id_proyecto} 
                  className={`cursor-pointer relative ${selectedProject?.id_proyecto === project.id_proyecto ? 'bg-[#F9F5FF] border-l-4 border-l-[#A100FF]' : 'hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  style={{
                    opacity: 1,
                    transform: 'translateY(0px)',
                    transition: `opacity 0.2s, transform 0.2s ${index * 0.03}s`
                  }}
                >
                  {/* Removed absolute positioned highlight in favor of border-left styling */}
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm font-medium text-gray-900 group-hover:text-[#A100FF] transition-colors">
                      {project.titulo}
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle h-16"
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
                    className="px-6 py-3 whitespace-nowrap align-middle h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm text-gray-600 flex items-center">
                      {project.project_lead ? (
                        <>
                          <img
                            src={project.project_lead.url_avatar || '/placeholder-avatar.png'}
                            alt={`${project.project_lead.nombre} ${project.project_lead.apellido}`}
                            className="w-8 h-8 rounded-full object-cover border-2 border-[#A100FF30] shadow-sm mr-3"
                          />
                          <div>
                            <div className="font-medium text-gray-800">
                              {project.project_lead.nombre} {project.project_lead.apellido}
                            </div>
                            {project.project_lead.titulo && (
                              <div className="text-xs text-gray-500">{project.project_lead.titulo}</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center text-gray-400">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                            <FiUsers className="w-4 h-4" />
                          </div>
                          <span className="text-sm">Sin asignar</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle text-center h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm text-gray-600">
                      {project.horas_totales}
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle text-center h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm text-gray-600 flex items-center justify-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#A100FF10] to-[#A100FF20] text-[#A100FF] border border-[#A100FF30] shadow-sm">
                        <FiUsers className="w-3 h-3 mr-1" />
                        {project.roles?.length || 0}
                      </span>
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {new Date(project.fecha_inicio).toLocaleDateString('es-ES')}
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <div className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      {project.fecha_fin ? new Date(project.fecha_fin).toLocaleDateString('es-ES') : 'N/A'}
                    </div>
                  </td>
                  
                  <td 
                    className="px-6 py-3 whitespace-nowrap align-middle text-center h-16"
                    onClick={() => handleSelectProject(project)}
                  >
                    <span 
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        project.activo 
                          ? 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 shadow-sm' 
                          : 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 shadow-sm'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-1 ${project.activo ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      {project.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-3 whitespace-nowrap text-right align-middle h-16">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleSelectProject(project)}
                        className="p-2 rounded-full bg-[#A100FF10] hover:bg-[#A100FF20] transition-colors shadow-sm hover:scale-110 active:scale-90"
                        style={{ 
                          transition: 'transform 0.2s ease, background-color 0.2s ease' 
                        }}
                      >
                        <FiEdit className="h-4 w-4 text-[#A100FF]" />
                      </button>
                      <button
                        onClick={() => openArchiveModal(project.id_proyecto, project.titulo)}
                        disabled={archivingProjectId === project.id_proyecto}
                        className="p-2 rounded-full bg-amber-50 hover:bg-amber-100 transition-colors shadow-sm hover:scale-110 active:scale-90 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        style={{ 
                          transition: 'transform 0.2s ease, background-color 0.2s ease',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {archivingProjectId === project.id_proyecto ? (
                          <div className="animate-spin h-3.5 w-3.5 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                        ) : (
                          <FiArchive className="h-4 w-4 text-amber-500" />
                        )}
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
      
      {/* Archive Confirmation Modal */}
      <ArchiveProjectModal
        isOpen={archiveModalOpen}
        isArchiving={isArchiving || false}
        projectTitle={projectToArchive?.title}
        onClose={() => {
          setArchiveModalOpen(false);
          setProjectToArchive(null);
        }}
        onConfirm={handleConfirmArchive}
      />
    </motion.div>
  );
}
