/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiChevronRight, FiUsers } from 'react-icons/fi';
import { getProjectColor, getProjectHexColor, calculateCargabilidad, getCargabilidadStatus } from './utils/projectUtils';
import Image from 'next/image';

interface ProjectListItemProps {
  project: any;
  onProjectClick: (project: any) => void;
}

export default function ProjectListItem({ project, onProjectClick }: ProjectListItemProps) {
  const projectColor = getProjectColor(project.color || null, project.id_proyecto);
  const projectHexColor = getProjectHexColor(project.color || null, project.id_proyecto);
  const cargabilidadPercentage = calculateCargabilidad(project);
  const cargabilidadStatus = getCargabilidadStatus(cargabilidadPercentage);
  
  return (
    <div 
      onClick={() => onProjectClick(project)}
      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300 overflow-hidden"
    >
      <div className={`${projectColor} p-4 rounded-t-xl`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{project.titulo}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            project.activo 
              ? 'bg-white text-green-800' 
              : 'bg-white text-gray-600'
          }`}>
            {project.activo ? 'Activo' : 'Archivado'}
          </span>
        </div>
        <p className="text-sm text-white opacity-90">Cliente: {project.cliente}</p>
      </div>
      
      <div className="p-5 flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 line-clamp-2">{project.descripcion || 'Sin descripción'}</p>
          <div className="mt-4 flex justify-between">
            <div>
              <span className="text-sm text-gray-500 flex items-center">
                Rol: 
                <div className="flex items-center ml-1">
                  <div 
                    className="w-2.5 h-2.5 rounded-full mr-1"
                    style={{ backgroundColor: projectHexColor }}
                  ></div>
                  <b>{project.user_role || 'Sin rol'}</b>
                </div>
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500 flex items-center">
                Cargabilidad: 
                <div className="flex items-center ml-1">
                  <div 
                    className={`w-2.5 h-2.5 rounded-full mr-1 ${cargabilidadStatus.dotColor}`}
                  ></div>
                  <span className={cargabilidadStatus.color}>
                    <b>{cargabilidadPercentage}%</b>
                  </span>
                </div>
              </span>
            </div>
          </div>
          
          {/* Project lead and team info */}
          <div className="mt-3 flex items-center justify-between">
            {project.project_lead ? (
              <div className="flex items-center">
                {project.project_lead.url_avatar && (
                  <div className="w-6 h-6 rounded-full mr-2">
                    <Image
                      src={project.project_lead.url_avatar}
                      alt={`${project.project_lead.nombre} ${project.project_lead.apellido}`}
                      width={24}
                      height={24}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                )}
                <span className="text-sm text-gray-600">
                  {project.project_lead.nombre} {project.project_lead.apellido}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                  <FiUsers className="w-3 h-3 text-gray-400" />
                </div>
                <span className="text-sm text-gray-500">Sin project lead</span>
              </div>
            )}
            
            {/* Team size indicator */}
            {project.assignedUsers && project.assignedUsers.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <FiUsers className="w-4 h-4 mr-1" />
                <span>{project.assignedUsers.length} miembro{project.assignedUsers.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
        <div className="ml-4">
          <FiChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
