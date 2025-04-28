"use client";

import Link from "next/link";
import { AlertCircle, ChevronRight } from "lucide-react";

interface Task {
  id: string;
  title: string;
  projectName: string;
  dueDate: string;
  status: string;
  projectColor: string;
}

interface TasksSectionProps {
  tasks: Task[];
  getDateColor: (dateStr: string) => string;
  formatDate: (dateStr: string) => string;
  getProjectColor: (color: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

export default function TasksSection({
  tasks,
  formatDate,
  getProjectColor,
  getStatusColor,
  getStatusText
}: TasksSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
          Tareas Pendientes Prioritarias
        </h2>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {tasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-all bg-white shadow-sm hover:shadow"
            >
              <div className={`${getProjectColor(task.projectColor)} w-2 h-14 rounded-full mr-4`}></div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{task.title}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1">
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
              <button className="ml-4 text-indigo-600 hover:text-indigo-800 p-2">
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/dashboard/tasks" 
            className="inline-flex items-center text-sm font-medium text-[#A100FF] hover:text-[#8A00FF]"
          >
            Ver todas mis tareas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
