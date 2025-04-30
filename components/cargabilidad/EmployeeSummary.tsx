'use client';

<<<<<<< Updated upstream
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Calendar, Users, Activity, AlertTriangle } from "lucide-react";
import { color } from "framer-motion";

=======
import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer} from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import { availableHours, totalLoad } from '@/app/(pages)/dashboard/cargabilidad/page';
import { Calendar, Users, Activity, AlertTriangle } from 'lucide-react';
import { ProgressCircle, CircularProgress, ColorRange } from '../ui/CircularProgress';
import { dummyProjects } from '@/app/(pages)/dashboard/cargabilidad/page';
>>>>>>> Stashed changes
// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface ProjectInfo {
  name: string;
  hours?: number;
  hoursPerWeek?: number;
  color: string; // hex / rgb / clase Tailwind
}
export interface CargabilidadProps {
  name?: string;
  position?: string;
  totalHours?: number;
  assignedHours?: number;
  dailyHours?: { day: string; hours: number }[];
  projects?: ProjectInfo[];
}

// -----------------------------------------------------------------------------
// DUMMY DATA
// -----------------------------------------------------------------------------
const dummyDaily = [
  { day: "L", hours: 8 },
  { day: "M", hours: 6 },
  { day: "X", hours: 7 },
  { day: "J", hours: 8 },
  { day: "V", hours: 3 },
];
<<<<<<< Updated upstream
const dummyProjects: ProjectInfo[] = [
  { name: "Expediente Alfa", hours: 20, color: "#6366F1" },
  { name: "Delta Zero", hours: 12, color: "#60A5FA" },
];
=======

>>>>>>> Stashed changes
const dummyProps: Required<CargabilidadProps> = {
  name: "Carlos Rodríguez",
  position: "Desarrollador Full Stack",
  totalHours: 40,
  assignedHours: dummyProjects.reduce((sum, p) => sum + (p.hours ?? 0), 0),
  dailyHours: dummyDaily,
  projects: dummyProjects,
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------

// asignador de colores 
const colorMap = {
  red: "bg-red-50/2 border border-red-100/20",
  green: "bg-emerald-500/10 border border-green-100/20",
  yellow: "bg-yellow-50/2 border border-yellow-100/20",
};

const pct = (v: number, t: number) => (t <= 0 ? 0 : (v / t) * 100);
const utilLabel = (u: number) =>
  u >= 90 ? "Sobrecargado" : u >= 70 ? "Óptimo" : "Capacidad disponible";
const utilColor = (u: number) =>
  u >= 90 ? "text-red-600" : u >= 70 ? "text-green-600" : "text-yellow-600";
const isRawColor = (c?: string) =>
  !!c && (c.startsWith("#") || c.startsWith("rgb"));
const projectHours = (p: ProjectInfo) => p.hours ?? p.hoursPerWeek ?? 0;
const utilBgColor = (u: number) =>
  u >= 90 ? "bg-red-50/2 border border-red-100/20" : u >= 70 ? "bg-green-500/10 border border-green-100/20" : "bg-yellow-50/2 border border-yellow-100/20";
const utilBarColor = (u: number) =>
  u >= 90 ? "red-500" : u >= 70 ? "#10B981" : "yellow-500";

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export function CargabilidadCard(props: CargabilidadProps) {
  // fallback a dummy
  const {
    name,
    position,
    totalHours,
    assignedHours,
    dailyHours,
<<<<<<< Updated upstream
    projects,
  } = { ...dummyProps, ...props } as Required<CargabilidadProps>;
=======
  } = ({ ...dummyProps, ...props } as Required<CargabilidadProps>);
>>>>>>> Stashed changes

  const [expanded, setExpanded] = useState(false);
  const utilization = Math.round(pct(assignedHours, totalHours));
  const available = Math.max(totalHours - assignedHours, 0);

<<<<<<< Updated upstream
  return (
    <section className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* decorativos */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-violet-200 rounded-full blur-xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-16 right-0 w-60 h-60 bg-violet-300 rounded-full blur-2xl opacity-20 pointer-events-none" />

      {/* HEADER */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center">
            <Activity size={20} className="text-indigo-600" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-violet-800">Mi Cargabilidad</h1>
            <p className="text-sm text-gray-600">
              {name} — {position}
            </p>
          </div>
        </div>

        {/* UTIL DONUT + ASIGNACIÓN */}
        <div className={`flex items-center gap-6 mt-4 md:mt-0 `}>
          <div className={`relative w-[80px] h-[80px] ${utilBgColor(utilization)} rounded-full flex items-center justify-center`}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { value: utilization },
                    { value: 100 - utilization },
                  ]}
                  dataKey="value"
                  strokeWidth={0}
                  stroke="transparent"
                  cornerRadius={4}
                  cx="50%"
                  cy="50%"
                  innerRadius={22}
                  outerRadius={30}
                  startAngle={90}
                  endAngle={-270}
                >
                  <Cell fill={utilBarColor(utilization)} />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <span className="absolute inset-0 flex items-center justify-center text-md font-bold">
              {utilization}%
            </span>
          </div>
          <div className="text-center">
            <p className={`text-sm font-medium ${utilColor(utilization)}`}>
              {utilLabel(utilization)}
            </p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 text-sm hover:underline"
          >
            {expanded ? "Contraer" : "Detalles"}
          </button>
        </div>
      </header>

      {/* BARRA FINO O AMPLIADA */}
      {expanded ? (
        <div className="relative z-10 overflow-visible pb-2">
            <p className="absolute left-6 -top-5 z-20 text-xs text-gray-500">
              Asignado: {assignedHours}h / {totalHours}h
            </p>
          <div className="h-6 overflow-hidden flex">
            {projects.map((p) => {
=======
  const ChargabilityColorRange: ColorRange[] = [
    { threshold: 90, color: 'emerald' },
    { threshold: 70, color: 'blue' },
    { threshold: 0, color: 'red' },
  ];

  return (
    <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8">
      {/* HEADER (toggle expand/collapse) */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 pt-6 px-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 pb-6 justify-between items-center">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-[#A100FF20] to-[#A100FF10] p-3 rounded-lg mr-4 shadow-sm">
              <FiBarChart2 size={24} className="text-[#A100FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">
                Mi Cargabilidad
              </h1>
              <p className="text-gray-600 mt-2 max-w-2xl">
                Visualiza y gestiona tu cargabilidad por proyectos. Equilibra tus horas de trabajo para un rendimiento óptimo.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <p className={`text-sm font-medium ${utilColor(totalLoad)}`}>
              {utilLabel(totalLoad)}
            </p>
            <div
              className={`relative w-20 h-20 ${utilBgColor(totalLoad)} rounded-full flex items-center justify-center shadow-sm border border-gray-100`}
            >
              <CircularProgress 
                value={utilization}
                size="small"
                colorRanges={ChargabilityColorRange}
              />
            </div>
          </div>
        </div>
        {/* EXPANDED BAR */}
      
        <div className="relative z-10  overflow-visible">
          <p className="absolute left-6 -top-5 text-xs text-gray-500">
            Asignado: {assignedHours}h / {totalHours}h
          </p>
          <div className="h-6 w-full flex overflow-hidden rounded-lg transition-all duration-300">
            {dummyProjects.map((p) => {
>>>>>>> Stashed changes
              const h = projectHours(p);
              const width = `${pct(h, totalHours)}%`;
              const raw = isRawColor(p.color);
              return raw ? (
                <div
                  key={p.name}
                  style={{ width, backgroundColor: p.color }}
                  className="relative flex items-center justify-center"
                >
                  <span className="text-[10px] font-semibold text-white">
                    {pct(h, totalHours).toFixed(0)}%
                  </span>
                </div>
              ) : (
                <div
                  key={p.name}
                  className={`${p.color} relative flex items-center justify-center`}
                  style={{ width }}
                >
                  <span className="text-[10px] font-semibold text-white">
                    {pct(h, totalHours).toFixed(0)}%
                  </span>
                </div>
              );
            })}
            {available > 0 && (
              <div
                style={{ width: `${pct(available, totalHours)}%`, backgroundColor: "#E5E7EB" }}
                className="relative flex items-center justify-center"
              >
                <span className="text-[10px] font-semibold text-gray-700">
                  {pct(available, totalHours).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
<<<<<<< Updated upstream
      ) : (
        <footer className="relative z-10 flex h-1 w-full">
          {projects.map((p) => {
            const h = projectHours(p);
            const width = `${pct(h, totalHours)}%`;
            const raw = isRawColor(p.color);
            return raw ? (
              <div key={p.name} style={{ width, backgroundColor: p.color }} />
            ) : (
              <div key={p.name} className={p.color} style={{ width }} />
            );
          })}
          {available > 0 && (
            <div style={{ width: `${pct(available, totalHours)}%`, backgroundColor: "#E5E7EB" }} />
          )}
        </footer>
      )}

      {/* DETALLES */}
      {expanded && (
        <div className="relative z-10 px-6 pb-6 space-y-4">
          {/* Asignación total */}

          {/* Alerta si está sobrecargado */}
          {utilization > 90 && (
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-lg p-3 flex gap-2 items-center">
              <AlertTriangle size={16} className="shrink-0" />
              Cargabilidad alta. Considere redistribuir las horas.
            </div>
          )}

          {/* Resumen grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Semana */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} className="text-gray-500" /> Distribución semanal
              </div>
              <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyHours}
                    margin={{ top: 2, right: 0, left: 0, bottom: 0 }}
                  >
                    <Bar
                      dataKey="hours"
                      fill="#6366F1"
                      radius={[4, 4, 0, 0]}
                    />
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={[0, totalHours / 5]} />
                    <ReTooltip cursor={{ fill: "transparent" }} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <ul className="flex justify-between text-xs text-gray-500 px-1">
                {dailyHours.map((d) => (
                  <li key={d.day}>{d.day}</li>
                ))}
              </ul>
            </div>

            {/* Proyectos */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} className="text-gray-500" /> Proyectos ({projects.length})
              </div>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {projects.map((p) => {
                  const h = projectHours(p);
                  const raw = isRawColor(p.color);
                  return (
                    <div key={p.name} className="flex justify-between text-sm">
                      <div className="flex items-center gap-2 truncate">
                        {raw ? (
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: p.color }}
                          />
                        ) : (
                          <span className={`w-2 h-2 rounded-full ${p.color}`} />
                        )}
                        <span className="truncate max-w-[120px]">{p.name}</span>
                      </div>
                      <span className="font-medium">{h}h</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between text-xs text-gray-500 border-t pt-1">
                <span>Libre</span>
                <span>{available}h</span>
              </div>
            </div>
          </div>
        </div>
      )}
=======
      
      </div>

      
>>>>>>> Stashed changes
    </section>
  );
}

// alias para compatibilidad
export const EmployeeSummary = CargabilidadCard;
export default EmployeeSummary;
