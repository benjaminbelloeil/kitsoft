/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
      {/* Enhanced timeframe selector */}
      <div className="lg:col-span-3 flex justify-end mb-2">
        <div className="p-1 bg-gray-50 inline-flex rounded-lg shadow-sm border border-gray-100">
          {(['1m', '3m', '6m', '1y'] as const).map((option) => (
            <button
              key={option}
              onClick={() => setTimeframe(option)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                timeframe === option
                  ? 'bg-white text-[#A100FF] shadow-sm border border-gray-200'
                  : 'bg-transparent text-gray-600 hover:bg-white/50 hover:text-[#A100FF]'
              }`}
            >
              {option === '1m' ? '1 Mes' : option === '3m' ? '3 Meses' : option === '6m' ? '6 Meses' : '1 Año'}
            </button>
          ))}
        </div>
      </div>
      
      {/* Main historical chart - enhanced */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#10B98108] flex items-center justify-center">
            <FiTrendingUp className="text-[#10B981]" />
          </div>
          Evolución de Carga Laboral
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{fontSize: 12}} stroke="#9CA3AF" />
              <YAxis tick={{fontSize: 12}} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  border: '1px solid #E5E7EB'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: 20
                }}
              />
              <Line 
                type="monotone" 
                dataKey="totalHours" 
                name="Horas Totales" 
                stroke="#A100FF" 
                strokeWidth={2}
                dot={{ stroke: '#A100FF', strokeWidth: 2, r: 3, fill: 'white' }}
                activeDot={{ r: 6, stroke: '#A100FF', strokeWidth: 1, fill: '#A100FF' }}
              />
              <Line 
                type="monotone" 
                dataKey={entry => maxWeeklyHours} 
                name="Capacidad Máxima" 
                stroke="#D1D5DB" 
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Statistics cards - enhanced */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#A100FF08] flex items-center justify-center">
            <FiClock className="text-[#A100FF]" />
          </div>
          Promedio Semanal
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-[#A100FF]">
            {averageWeeklyHours.toFixed(1)}h
          </div>
          <div className="text-gray-500 mt-2">
            {averageUtilization.toFixed(1)}% de capacidad
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-[#A100FF] h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, averageUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#F43F5E08] flex items-center justify-center">
            <FiActivity className="text-[#F43F5E]" />
          </div>
          Pico de Carga
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-[#F43F5E]">
            {peakUtilization.toFixed(1)}%
          </div>
          <div className="text-gray-500 mt-2">
            Semana del {peakWeek}
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${peakUtilization > 100 ? 'bg-[#F43F5E]' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, peakUtilization)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#F97316] flex items-center justify-center bg-opacity-10">
            <FiCalendar className="text-[#F97316]" />
          </div>
          Semanas Sobrecargadas
        </h3>
        <div className="flex flex-col items-center">
          <div className="text-4xl font-bold text-amber-500">
            {overloadedWeeks}
          </div>
          <div className="text-gray-500 mt-2">
            de {filteredData.length} semanas
          </div>
          <div className="w-full mt-4 bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${(overloadedWeeks / filteredData.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Project trends - enhanced */}
      <div className="lg:col-span-3 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-300">
        <h3 className="font-medium mb-4 inline-flex items-center gap-2 text-gray-800 pb-1 border-b border-gray-100 w-full">
          <div className="w-6 h-6 rounded-md bg-[#6366F108] flex items-center justify-center">
            <FiTrendingUp className="text-[#6366F1]" />
          </div>
          Tendencias por Proyecto
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={projectTrends}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="week" tick={{fontSize: 12}} stroke="#9CA3AF" />
              <YAxis tick={{fontSize: 12}} stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
                  border: '1px solid #E5E7EB'
                }}
              />
              <Legend 
                wrapperStyle={{
                  paddingTop: 20
                }}
              />
              {projectNames.map((name, index) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  name={name}
                  stroke={colorPalette[index % colorPalette.length]}
                  strokeWidth={2}
                  dot={{ stroke: colorPalette[index % colorPalette.length], strokeWidth: 2, r: 3, fill: 'white' }}
                  activeDot={{ r: 6, stroke: colorPalette[index % colorPalette.length], strokeWidth: 1, fill: colorPalette[index % colorPalette.length] }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};