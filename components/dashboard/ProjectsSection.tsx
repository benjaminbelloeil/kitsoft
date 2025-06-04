"use client";

import Link from "next/link";
import { Briefcase, Clock, ChevronRight } from "lucide-react";
import { getProjectHexColor } from "../proyectos/utils/projectUtils";

interface Project {
  id: string;
  name: string;
  cargabilidad: number;
  dueDate: string | null;
  hoursPerWeek: number;
  priority: string;
  color: string;
}

interface ProjectsSectionProps {
  readonly projects: readonly Project[];
  readonly formatDate: (dateStr: string) => string;
}

export default function ProjectsSection({
  projects,
  formatDate
}: ProjectsSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Briefcase className="w-5 h-5 mr-2 text-[#A100FF]" />
          Mis Proyectos
        </h2>
        <Link href="/dashboard/proyectos" className="text-sm font-medium text-[#A100FF] hover:text-[#8A00FF] flex items-center">
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {projects.length > 0 ? (
            projects.map(project => (
              <div 
                key={project.id}
                className="p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-all bg-white shadow-sm hover:shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    {project.dueDate && (
                      <p className="text-sm text-gray-500 mt-1 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Fecha límite: <span className="ml-1 text-gray-500">{formatDate(project.dueDate)}</span>
                      </p>
                    )}
                    {!project.dueDate && (
                      <p className="text-sm text-gray-500 mt-1">Sin fecha límite definida</p>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Cargabilidad percentage */}
                  <div className="sm:w-1/2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Cargabilidad</span>
                      <span className="text-sm font-bold text-indigo-700">{project.cargabilidad}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${project.cargabilidad}%`,
                          backgroundColor: getProjectHexColor(null, project.id)
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Hours per week */}
                  <div className="sm:w-1/2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Horas/semana</span>
                      <span className="text-sm text-gray-600">{project.hoursPerWeek}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${Math.min((project.hoursPerWeek / 40) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mb-3 border border-purple-100">
                <Briefcase className="w-6 h-6 text-[#A100FF]" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No hay proyectos asignados</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                Aún no tienes proyectos asignados. Cuando se te asignen nuevos proyectos, aparecerán aquí.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
