"use client";

import { useState } from "react";

// Sample cargabilidad data
const cargabilidadData = [
  {
    project: "Project Nova",
    allocation: 70,
    color: "emerald",
    startDate: "12/01/2023",
    endDate: "31/07/2024",
    client: "Telefónica"
  },
  {
    project: "Accenture Cloud First",
    allocation: 20,
    color: "blue",
    startDate: "01/01/2024",
    endDate: "31/12/2024",
    client: "Accenture Internal"
  },
  {
    project: "Digital Transformation",
    allocation: 10,
    color: "purple",
    startDate: "15/03/2024",
    endDate: "15/09/2024",
    client: "BBVA"
  }
];

export default function CargabilidadPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  // Calculate total allocation
  const totalAllocation = cargabilidadData.reduce((sum, item) => sum + item.allocation, 0);

  return (
    <div className="max-w-5xl mx-auto py-8">
      <header className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cargabilidad</h1>
        <p className="text-gray-600 mt-2">Visualiza y gestiona tu cargabilidad en proyectos actuales</p>
      </header>

      {/* Period selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Periodo</h2>
          <div className="flex gap-4">
            <select 
              className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {months.map((month, index) => (
                <option key={month} value={index}>{month}</option>
              ))}
            </select>
            <select 
              className="bg-white border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {[2023, 2024, 2025].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Allocation summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 pb-3 border-b border-gray-100">Resumen de Cargabilidad</h2>
        <div className="relative h-[30px] bg-gray-100 rounded-full overflow-hidden mb-4">
          {cargabilidadData.map((item, index) => {
            // Calculate the width and position
            const width = `${item.allocation}%`;
            const position = index === 0 ? '0' : 
                            cargabilidadData.slice(0, index).reduce((sum, i) => sum + i.allocation, 0) + '%';
            
            // Map color to actual class
            const colorClass = {
              emerald: "bg-emerald-500",
              blue: "bg-blue-500",
              purple: "bg-purple-500"
            }[item.color] || "bg-gray-500";
            
            return (
              <div 
                key={index}
                className={`absolute h-full ${colorClass}`}
                style={{ width, left: position }}
              ></div>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <div>
            <p className="text-gray-600">Cargabilidad total</p>
            <p className="text-2xl font-bold">{totalAllocation}%</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Disponibilidad</p>
            <p className="text-2xl font-bold">{100 - totalAllocation}%</p>
          </div>
        </div>
      </div>

      {/* Detailed allocation */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-xl font-bold mb-6 pb-3 border-b border-gray-100">Proyectos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha inicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha fin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargabilidad</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cargabilidadData.map((item, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.project}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.client}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.endDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-2">
                        <div className={`h-4 w-4 rounded-full ${
                          item.color === 'emerald' ? 'bg-emerald-500' :
                          item.color === 'blue' ? 'bg-blue-500' :
                          'bg-purple-500'
                        }`}></div>
                      </div>
                      <span className="font-medium">{item.allocation}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
