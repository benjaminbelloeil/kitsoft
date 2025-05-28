/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProjectColor } from './utils/projectUtils';
import PlaceholderAvatar from '@/components/ui/placeholder-avatar';

interface ProjectCardProps {
  project: any;
  onProjectClick: (project: any) => void;
}

export default function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const projectColor = getProjectColor(project.color);
  
  return (
    <div 
      onClick={() => onProjectClick(project)}
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg"
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
      
      <div className="p-5">
        <p className="text-gray-700 text-sm mb-6 line-clamp-2">{project.description || 'Sin descripción'}</p>
        
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Cargabilidad</p>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
              <p className="font-medium">{project.cargabilidad}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Fecha inicio</p>
            <p className="font-medium">{new Date(project.startDate).toLocaleDateString('es-ES')}</p>
          </div>
        </div>
        
        {/* Equipo del proyecto */}
        <div className="flex -space-x-2 overflow-hidden">
          {/* Mostrar avatars (4 máximo) */}
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
    </div>
  );
}
