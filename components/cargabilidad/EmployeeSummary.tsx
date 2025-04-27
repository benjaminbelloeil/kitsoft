'use client';

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
const dummyProjects: ProjectInfo[] = [
  { name: "Expediente Alfa", hours: 20, color: "#6366F1" },
  { name: "Delta Zero", hours: 12, color: "#60A5FA" },
];
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
    projects,
  } = { ...dummyProps, ...props } as Required<CargabilidadProps>;

  const [expanded, setExpanded] = useState(false);
  const utilization = Math.round(pct(assignedHours, totalHours));
  const available = Math.max(totalHours - assignedHours, 0);

  return (
    <section className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* decorativos */}
      {/* <div className="absolute -top-10 -left-10 w-48 h-48 bg-violet-200 rounded-full blur-xl opacity-30 pointer-events-none" />
      <div className="absolute -bottom-16 right-0 w-60 h-60 bg-violet-300 rounded-full blur-2xl opacity-20 pointer-events-none" />
 */}
      {/* HEADER */}
      <header className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 py-2 border-b border-gray-200">
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
          <div className="text-center">
            <p className={`text-sm font-medium ${utilColor(utilization)}`}>
              {utilLabel(utilization)}
            </p>
          </div>
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
          <button
            onClick={() => setExpanded(!expanded)}
            className="absolute top-18 right-100 text-indigo-600 text-sm hover:underline"
          >
            {expanded ? "Contraer" : "Detalles"}
          </button>
        </div>
      </header>

      {/* BARRA FINO O AMPLIADA */}
      {expanded ? (
        <div className="relative z-10 overflow-visible">
            <p className="absolute left-6 -top-5 z-20 text-xs text-gray-500">
              Asignado: {assignedHours}h / {totalHours}h
            </p>
          <div className="h-6 overflow-hidden flex">
            {projects.map((p) => {
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
      
    </section>
  );
}

// alias para compatibilidad
export const EmployeeSummary = CargabilidadCard;
export default CargabilidadCard;
