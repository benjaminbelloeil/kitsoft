"use client";

import Link from "next/link";
import { BarChart2, ChevronRight } from "lucide-react";

export default function PerformanceCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-green-600" />
          Mi Rendimiento
        </h2>
      </div>
      
      <div className="p-6">
        {/* Circular Progress Chart */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#e5e7eb" 
                strokeWidth="10"
              />
              <circle 
                cx="50" cy="50" r="45" 
                fill="none" 
                stroke="#4F46E5" 
                strokeWidth="10"
                strokeDasharray={`${2 * Math.PI * 45 * 87 / 100} ${2 * Math.PI * 45 * (100 - 87) / 100}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="text-2xl font-bold text-gray-900">87%</div>
              <div className="text-xs text-gray-500">Cargabilidad</div>
            </div>
          </div>
        </div>
        
        {/* Performance Metrics */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700">Puntualidad en entregas</div>
            <div className="text-sm font-bold text-gray-900">95%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '95%' }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700">Calidad del código</div>
            <div className="text-sm font-bold text-gray-900">92%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '92%' }}></div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-700">Colaboración en equipo</div>
            <div className="text-sm font-bold text-gray-900">88%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            href="/dashboard/retroalimentacion" 
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Ver retroalimentación completa
            <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
