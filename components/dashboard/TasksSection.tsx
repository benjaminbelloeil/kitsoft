"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ChevronRight } from "lucide-react";
import { getProjectHexColor } from "../proyectos/utils/projectUtils";

interface Task {
  id: string;
  title: string;
  projectName: string;
  projectId: string;
  dueDate: string;
  status: string;
  projectColor: string;
}

interface TasksSectionProps {
  readonly tasks: Task[];
  readonly formatDate: (dateStr: string) => string;
  readonly getStatusColor: (status: string) => string;
  readonly getStatusText: (status: string) => string;
}

export default function TasksSection({
  tasks,
  formatDate,
  getStatusColor,
  getStatusText
}: TasksSectionProps) {
  const router = useRouter();

  const handleTaskClick = (task: Task) => {
    // Store the project ID in localStorage to open the specific project
    localStorage.setItem('openProjectId', task.projectId);
    router.push('/dashboard/proyectos');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
          Tareas Pendientes Prioritarias
        </h2>
        <Link href="/dashboard/proyectos" className="text-sm font-medium text-amber-500 hover:text-amber-600 flex items-center">
          Ver todos <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        <div className="space-y-3 max-h-[280px] overflow-y-auto">
          {tasks.length > 0 ? (
            tasks.map(task => (
              <button 
                key={task.id}
                className="flex items-center p-3 border border-gray-100 rounded-lg hover:border-gray-200 transition-all bg-white shadow-sm hover:shadow cursor-pointer text-left w-full"
                onClick={() => handleTaskClick(task)}
              >
                <div 
                  className="w-2 h-12 rounded-full mr-3"
                  style={{ backgroundColor: getProjectHexColor(null, task.projectId) }}
                ></div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{task.title}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                    <p className="text-sm text-gray-500">
                      {task.projectName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Vencimiento: {formatDate(task.dueDate)}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(task.status)}`}>
                      {getStatusText(task.status)}
                    </span>
                  </div>
                </div>
                <button 
                  className="ml-3 text-indigo-600 hover:text-indigo-800 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </button>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4">
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-3 border border-amber-100">
                <AlertCircle className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-2">No hay tareas pendientes</h3>
              <p className="text-sm text-gray-500 text-center max-w-sm">
                ¡Excelente trabajo! No tienes tareas pendientes prioritarias en este momento.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
