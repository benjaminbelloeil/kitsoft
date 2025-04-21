'use client';

import { useState } from 'react';
import { FiTrendingUp, FiCalendar, FiClock, FiActivity } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface HistoryEntry {
  week: string;
  totalHours: number;
  availableHours: number;
  projects: {
    name: string;
    hours: number;
  }[];
}

interface Props {
  historyData: HistoryEntry[];
  maxWeeklyHours: number;
}

export const HistoryTab = ({ historyData, maxWeeklyHours }: Props) => {
  const [timeframe, setTimeframe] = useState<'1m' | '3m' | '6m' | '1y'>('3m');
  
  // Filter data based on selected timeframe
  const filteredData = (() => {
    const currentDate = new Date();
    const monthsToSubtract = timeframe === '1m' ? 1 : timeframe === '3m' ? 3 : timeframe === '6m' ? 6 : 12;
    const cutoffDate = new Date(currentDate.setMonth(currentDate.getMonth() - monthsToSubtract));
    
    return historyData.filter(entry => new Date(entry.week) >= cutoffDate);
  })();
  
  // Calculate overall usage statistics
  const averageWeeklyHours = filteredData.reduce((sum, entry) => sum + entry.totalHours, 0) / filteredData.length;
  const averageUtilization = (averageWeeklyHours / maxWeeklyHours) * 100;
  
  // Find peak utilization
  const peakUtilization = Math.max(...filteredData.map(entry => (entry.totalHours / maxWeeklyHours) * 100));
  const peakWeek = filteredData.find(entry => (entry.totalHours / maxWeeklyHours) * 100 === peakUtilization)?.week;
  
  // Calculate overloaded weeks
  const overloadedWeeks = filteredData.filter(entry => entry.availableHours < 0).length;
  
  // Prepare data for project trends chart
  const projectNames = Array.from(
    new Set(filteredData.flatMap(entry => entry.projects.map(p => p.name)))
  );
  
  const projectTrends = filteredData.map(entry => {
    const result: Record<string, any> = { week: entry.week };
    
    projectNames.forEach(name => {
      const project = entry.projects.find(p => p.name === name);
      result[name] = project ? project.hours : 0;
    });
    
    return result;
  });
  
  // Generate colors for each project
  const colorPalette = [
    '#4F46E5', '#7C3AED', '#EC4899', '#F97316', '#FBBF24', 
    '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#F43F5E'
  ];
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Timeframe selector */}
      <div className="lg:col-span-3 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          {(['1m', '3m', '6m', '1y'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-4 py-2 text-sm font-medium ${
                timeframe === option
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              } ${
                option === '1m' ? 'rounded-l-md' : ''
              } ${
                option === '1y' ? 'rounded-r-md' : ''
              } border border-gray-300`}
            >
              {option === '1m' ? '1 Mes' : option === '3m' ? '3 Meses' : option === '6m' ? '6 Meses' : '1 Año'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main historical chart */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-indigo-600" />
          Historial de Carga Laboral
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="totalHours" 
                name="Horas Totales" 
                stroke="#4F46E5" 
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line 
                type="monotone" 
                dataKey={entry => maxWeeklyHours - entry.availableHours} 
                name="Capacidad Máxima" 
                stroke="#D1D5DB" 
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiClock className="text-indigo-600" />
          Promedio Semanal
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-indigo-600">
            {averageWeeklyHours.toFixed(1)}h
          </div>
          <div className="text-gray-500 mt-2">
            {averageUtilization.toFixed(1)}% de capacidad
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full" 
              style={{ width: `${Math.min(100, averageUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiActivity className="text-indigo-600" />
          Pico de Carga
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-rose-600">
            {peakUtilization.toFixed(1)}%
          </div>
          <div className="text-gray-500 mt-2">
            Semana del {peakWeek}
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${peakUtilization > 100 ? 'bg-rose-600' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, peakUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiCalendar className="text-indigo-600" />
          Semanas Sobrecargadas
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-amber-500">
            {overloadedWeeks}
          </div>
          <div className="text-gray-500 mt-2">
            de {filteredData.length} semanas
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-amber-500 h-2.5 rounded-full" 
              style={{ width: `${(overloadedWeeks / filteredData.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Project trends */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-indigo-600" />
          Tendencias por Proyecto
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              {projectNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};