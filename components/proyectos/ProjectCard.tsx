/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProjectColor, getProjectHexColor, getCargabilidadStatus } from './utils/projectUtils';
import { FiUsers } from 'react-icons/fi';
import Image from 'next/image';

interface ProjectCardProps {
  project: any;
  onProjectClick: (project: any) => void;
}

export default function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const projectColor = getProjectColor(project.color || null, project.id_proyecto);
  const projectHexColor = getProjectHexColor(project.color || null, project.id_proyecto);
  
  // Calculate individual user cargabilidad for this specific project
  // This should show what percentage of the total project this user is responsible for
  const cargabilidadPercentage = project.user_hours && project.horas_totales > 0 
    ? Math.round((project.user_hours / project.horas_totales) * 100)
    : 0;
  
  const cargabilidadStatus = getCargabilidadStatus(cargabilidadPercentage);
  
  return (
    <div 
      onClick={() => onProjectClick(project)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
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
      
      <div className="p-5">
        <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.descripcion || 'Sin descripción'}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Rol</p>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
              <p className="font-medium">{project.user_role || 'Sin rol'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Cargabilidad</p>
            <div className="flex items-center">
              <div 
                className={`w-3 h-3 rounded-full mr-1.5 ${cargabilidadStatus.dotColor}`}
              ></div>
              <p className="font-medium">{cargabilidadPercentage}%</p>
            </div>
          </div>
        </div>
        
        {/* Team members section with improved styling */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <FiUsers className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-500">Equipo</span>
          </div>
          
          <div className="flex -space-x-2 overflow-hidden">
            {/* Project Lead Avatar */}                {project.project_lead && project.project_lead.url_avatar && (
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white" title={`Project Lead: ${project.project_lead.nombre} ${project.project_lead.apellido}`}>
                <Image
                  src={project.project_lead.url_avatar}
                  alt={`${project.project_lead.nombre} ${project.project_lead.apellido}`}
                  width={32}
                  height={32}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            )}
            
            {/* Additional Team Members */}
            {project.assignedUsers && project.assignedUsers.length > 0 && (
              <>
                {project.assignedUsers.slice(0, 3).map((user: any, index: number) => (
                  user.url_avatar ? (
                    <div key={user.id_usuario || index} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" title={`${user.nombre} ${user.apellido}`}>
                      <Image
                        src={user.url_avatar}
                        alt={`${user.nombre} ${user.apellido}`}
                        width={32}
                        height={32}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </div>
                  ) : null
                ))}
                {project.assignedUsers.length > 3 && (
                  <div className="h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center">
                    <span className="text-xs font-medium text-gray-600">
                      +{project.assignedUsers.length - 3}
                    </span>
                  </div>
                )}
              </>
            )}
            
            {/* Hours indicator with project color */}
            <div 
              className="flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-white text-xs font-medium text-white ml-1"
              style={{ backgroundColor: projectHexColor }}
              title={`${project.user_hours || 0}h asignadas`}
            >
              {project.user_hours || 0}h
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
