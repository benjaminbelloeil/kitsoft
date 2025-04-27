'use client';

import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Calendar, Users, Activity, AlertTriangle } from 'lucide-react';

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------
export interface ProjectInfo {
  name: string;
  hours?: number;
  hoursPerWeek?: number;
  color: string;
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
  { day: 'L', hours: 8 },
  { day: 'M', hours: 6 },
  { day: 'X', hours: 7 },
  { day: 'J', hours: 8 },
  { day: 'V', hours: 3 },
];
const dummyProjects: ProjectInfo[] = [
  { name: 'Expediente Alfa', hours: 10, color: '#6366F1' },
  { name: 'Delta Zero', hours: 15, color: '#60A5FA' },
];
const dummyProps: Required<CargabilidadProps> = {
  name: 'Carlos Rodríguez',
  position: 'Desarrollador Full Stack',
  totalHours: 40,
  assignedHours: dummyProjects.reduce((sum, p) => sum + (p.hours ?? 0), 0),
  dailyHours: dummyDaily,
  projects: dummyProjects,
};

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
const pct = (v: number, t: number) => (t <= 0 ? 0 : (v / t) * 100);
const utilLabel = (u: number) =>
  u >= 90 ? 'Sobrecargado' : u >= 70 ? 'Óptimo' : 'Capacidad disponible';
const utilColor = (u: number) =>
  u >= 90 ? 'text-emerald-600' : u >= 70 ? 'text-indigo-600' : 'text-red-600';
const utilBgColor = (u: number) =>
  u >= 90
    ? 'bg-emerald-200/30 border border-emerald-200/50'
    : u >= 70
    ? 'bg-indigo-200/30 border border-indigo-200/50'
    : 'bg-red-200/30 border border-red-200/50';
const utilBarColor = (u: number) =>
  u >= 90 ? '#10B981' : u >= 70 ? '#221fcf' : '#EF4444';
const isRawColor = (c?: string) => !!c && (c.startsWith('#') || c.startsWith('rgb'));
const projectHours = (p: ProjectInfo) => p.hours ?? p.hoursPerWeek ?? 0;

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------
export function CargabilidadCard(props: CargabilidadProps) {
  const {
    name,
    position,
    totalHours,
    assignedHours,
    dailyHours,
    projects,
  } = ({ ...dummyProps, ...props } as Required<CargabilidadProps>);

  const [expanded, setExpanded] = useState(false);
  const utilization = Math.round(pct(assignedHours, totalHours));
  const available = Math.max(totalHours - assignedHours, 0);

  return (
    <section className="relative bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* HEADER (toggle expand/collapse) */}
      <header
        onClick={() => setExpanded(!expanded)}
        className={`relative z-10 flex items-center justify-between px-6 ${
          expanded ? 'py-6' : 'py-4'
        } border-b border-gray-100 bg-violet-50/60 cursor-pointer transition-all duration-300`}
      >
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
        <div className="flex items-center gap-6">
          <p className={`text-sm font-medium ${utilColor(utilization)}`}>
            {utilLabel(utilization)}
          </p>
          <div
            className={`relative w-20 h-20 ${utilBgColor(utilization)} rounded-full flex items-center justify-center`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: utilization }, { value: 100 - utilization }]}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                  innerRadius={22}
                  outerRadius={30}
                  stroke="transparent"
                  cornerRadius={4}
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
        </div>
      </header>

      {/* EXPANDED BAR */}
      {expanded ? (
        <div className="relative z-10 px-6 py-4 overflow-visible">
          <p className="absolute left-6 -top-5 text-xs text-gray-500">
            Asignado: {assignedHours}h / {totalHours}h
          </p>
          <div className="h-6 w-full flex overflow-hidden rounded-lg transition-all duration-300">
            {projects.map((p) => {
              const h = projectHours(p);
              const w = `${pct(h, totalHours)}%`;
              return isRawColor(p.color) ? (
                <div
                  key={p.name}
                  style={{ width: w, backgroundColor: p.color }}
                  className="flex items-center justify-center"
                >
                  <span className="text-[10px] font-semibold text-white">
                    {pct(h, totalHours).toFixed(0)}%
                  </span>
                </div>
              ) : (
                <div
                  key={p.name}
                  className={`${p.color} flex items-center justify-center`}
                  style={{ width: w }}
                >
                  <span className="text-[10px] font-semibold text-white">
                    {pct(h, totalHours).toFixed(0)}%
                  </span>
                </div>
              );
            })}
            {available > 0 && (
              <div
                style={{ width: `${pct(available, totalHours)}%`, backgroundColor: '#E5E7EB' }}
                className="flex items-center justify-center"
              >
                <span className="text-[10px] font-semibold text-gray-700">
                  {pct(available, totalHours).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* COLLAPSED FOOTER */
        <footer className="relative z-10 flex h-1 w-full transition-all duration-300">
          {projects.map((p) => {
            const h = projectHours(p);
            const w = `${pct(h, totalHours)}%`;
            return isRawColor(p.color) ? (
              <div key={p.name} style={{ width: w, backgroundColor: p.color }} />
            ) : (
              <div key={p.name} className={p.color} style={{ width: w }} />
            );
          })}
          {available > 0 && (
            <div style={{ width: `${pct(available, totalHours)}%`, backgroundColor: '#E5E7EB' }} />
          )}
        </footer>
      )}
    </section>
  );
}

export const EmployeeSummary = CargabilidadCard;
export default CargabilidadCard;
