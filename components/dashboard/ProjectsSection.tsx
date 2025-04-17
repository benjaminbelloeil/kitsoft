"use client";

import Link from "next/link";
import { Briefcase, Clock, ChevronRight } from "lucide-react";

interface Project {
  id: string;
  name: string;
  progress: number;
  dueDate: string;
  tasks: number;
  completedTasks: number;
  priority: string;
  color: string;
}

interface ProjectsSectionProps {
  projects: Project[];
  getDateColor: (dateStr: string) => string;
  formatDate: (dateStr: string) => string;
  getProjectColor: (color: string) => string;
}

export default function ProjectsSection({
  projects,
  getDateColor,
  formatDate,
  getProjectColor
}: ProjectsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-indigo-600" />
          Mis Proyectos
        </h2>
        <Link href="/dashboard/proyectos" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {projects.map(project => (
            <div 
              key={project.id}
              className="p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-all bg-white shadow-sm hover:shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Fecha límite: <span className={`ml-1 ${getDateColor(project.dueDate)}`}>{formatDate(project.dueDate)}</span>
                  </p>
                </div>
                <div className="mt-2 sm:mt-0">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    project.priority === 'alta' ? 'bg-red-100 text-red-800' : 
                    project.priority === 'media' ? 'bg-amber-100 text-amber-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    Prioridad {project.priority}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Project progress */}
                <div className="sm:w-1/2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Progreso</span>
                    <span className="text-sm font-bold text-indigo-700">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${getProjectColor(project.color)} h-2 rounded-full`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Tasks progress */}
                <div className="sm:w-1/2">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Tareas</span>
                    <span className="text-sm text-gray-600">{project.completedTasks}/{project.tasks}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gray-600 h-2 rounded-full" 
                      style={{ width: `${(project.completedTasks / project.tasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
