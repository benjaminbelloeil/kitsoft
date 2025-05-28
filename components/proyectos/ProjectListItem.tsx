/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { FiChevronRight } from 'react-icons/fi';
import { getProjectColor } from './utils/projectUtils';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';

interface ProjectListItemProps {
  project: any;
  onProjectClick: (project: any) => void;
}

export default function ProjectListItem({ project, onProjectClick }: ProjectListItemProps) {
  const projectColor = getProjectColor(project.color);
  
  return (
    <div 
      onClick={() => onProjectClick(project)}
      className="bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 duration-300 overflow-hidden"
    >
      <div className={`${projectColor} p-4 rounded-t-xl`}>
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-green-800">
            Activo
          </span>
        </div>
        <p className="text-sm text-white opacity-90">Cliente: {project.client}</p>
      </div>
      
      <div className="p-5 flex items-center">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
          <div className="mt-4 flex justify-between">
            <div>
              <span className="text-sm text-gray-500 flex items-center">
                Cargabilidad: 
                <div className="flex items-center ml-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-1"></div>
                  <b>{project.cargabilidad}%</b>
                </div>
              </span>
            </div>
            <div>
              <span className="text-sm text-gray-500">
                Fecha fin: <b>{new Date(project.endDate).toLocaleDateString('es-ES')}</b>
              </span>
            </div>
          </div>
          
          {/* Team members */}
          <div className="mt-3 flex -space-x-2 overflow-hidden">
            {[1, 2, 3].map((member, index) => (
              <div key={index} className="inline-block h-7 w-7 rounded-full ring-2 ring-white">
                <img
                  src={`https://randomuser.me/api/portraits/${index % 2 ? 'men' : 'women'}/${index + 10}.jpg`}
                  alt={`Usuario ${index + 1}`}
                  className="h-full w-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden h-full w-full">
                  <PlaceholderAvatar size={28} />
                </div>
              </div>
            ))}
            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200 ring-2 ring-white text-xs font-medium text-gray-500">
              +2
            </div>
          </div>
        </div>
        <div className="ml-4">
          <FiChevronRight className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
