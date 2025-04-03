import { FiFilter, FiPlus } from "react-icons/fi";
import { colorClasses } from "@/app/lib/data";

interface ProjectFilterProps {
  projects: Array<{ id: string; name: string; color: string }>;
  activeFilters: string[];
  toggleFilter: (projectId: string) => void;
  resetFilters: () => void;
}

export default function ProjectFilter({
  projects,
  activeFilters,
  toggleFilter,
  resetFilters
}: ProjectFilterProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 hover:border-[#A100FF20] transition-colors duration-300">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800 flex items-center">
          <FiFilter className="mr-1 text-[#A100FF]" size={14} />
          Filtrar por proyecto
        </h2>
        {activeFilters.length > 0 && (
          <button 
            onClick={resetFilters}
            className="text-xs text-[#A100FF] hover:underline"
          >
            Resetear
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {projects.map(project => (
          <div 
            key={project.id}
            className={`flex items-center p-2 rounded-md cursor-pointer fast-transition
              ${activeFilters.includes(project.id) ? colorClasses[project.color].light + ' ' + colorClasses[project.color].text : 'hover:bg-gray-50'}`}
            onClick={() => toggleFilter(project.id)}
          >
            <div className={`w-3 h-3 rounded-full ${colorClasses[project.color].bg} mr-2 shadow-sm`} />
            <span className="text-sm">{project.name}</span>
          </div>
        ))}
        
        <button className="mt-2 w-full px-3 py-1.5 border border-dashed border-gray-300 rounded-md text-xs text-gray-600 hover:border-[#A100FF] hover:text-[#A100FF] fast-transition flex items-center justify-center gap-1">
          <FiPlus size={14} />
          <span>Añadir proyecto</span>
        </button>
      </div>
    </div>
  );
}
