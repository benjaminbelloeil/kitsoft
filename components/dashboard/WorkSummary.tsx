"use client";

import { BarChart2 } from "lucide-react";

interface DayWork {
  day: string;
  hours: number;
  color: string;
}

interface WorkSummaryProps {
  workload: DayWork[];
}

export default function WorkSummary({ workload }: WorkSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BarChart2 className="w-5 h-5 mr-2 text-indigo-600" />
          Resumen Semanal de Trabajo
        </h2>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-7 gap-2">
          {workload.map((day, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs font-medium text-gray-500 mb-2">{day.day}</div>
              <div className="relative h-32 w-full">
                <div className="absolute bottom-0 left-0 right-0 rounded-t-sm transition-all duration-500" style={{
                  height: `${(day.hours / 10) * 100}%`,
                  backgroundColor: day.hours === 0 ? '#e5e7eb' : undefined
                }}>
                  <div className={`${day.color} h-full w-full rounded-t-sm`}></div>
                </div>
              </div>
              <div className="mt-2 text-xs font-medium">{day.hours}h</div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-indigo-50 rounded-lg p-4 border border-indigo-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Reporte Semanal</h4>
              <p className="text-sm text-gray-600 mt-1">20/02/2025 - 26/02/2025</p>
            </div>
            <div className="md:text-right mt-4 md:mt-0">
              <div className="text-lg font-bold text-indigo-700">39 horas</div>
              <div className="text-sm text-gray-600">de 40 horas totales (97.5%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
