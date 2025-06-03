"use client";

import Link from "next/link";
import { Award, Calendar, ChevronRight } from "lucide-react";

interface Course {
  id: string;
  name: string;
  date: string;
  completed: number;
  image: string;
  type: "certification" | "course";
}

interface TrainingCardProps {
  courses: Course[];
  formatDate: (dateStr: string) => string;
}

export default function TrainingCard({ courses, formatDate }: TrainingCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Award className="w-5 h-5 mr-2 text-amber-500" />
          Desarrollo Profesional
        </h2>
      </div>
      
      <div className="p-6 flex flex-col">
        {/* Upcoming Courses */}
        <h3 className="text-sm font-medium text-gray-500 uppercase mb-4">Próximas Formaciones</h3>
        
        <div className="space-y-4 flex-grow">
          {courses.map(course => (
            <div 
              key={course.id}
              className="border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all shadow-sm hover:shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex-1">{course.name}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  course.type === 'certification' ? 
                  'bg-purple-100 text-purple-800' : 
                  'bg-blue-100 text-blue-800'
                }`}>
                  {course.type === 'certification' ? 'Certificación' : 'Curso'}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(course.date)}
              </div>
              
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">Progreso</span>
                <span className="text-xs font-medium">{course.completed}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className={course.type === 'certification' ? "bg-purple-500 h-1.5 rounded-full" : "bg-blue-500 h-1.5 rounded-full"} 
                  style={{ width: `${course.completed}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end items-center pt-4">
          <Link 
            href="/dashboard/trayectoria" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 mt-4"
          >
            Ver todas
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
