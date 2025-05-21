'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer} from 'recharts';
import { FiBarChart2 } from 'react-icons/fi';
import { availableHours, totalLoad } from '@/app/(pages)/dashboard/cargabilidad/page';
import { Calendar, Users, Activity, AlertTriangle } from 'lucide-react';
import { ProgressCircle, CircularProgress, ColorRange } from '../ui/CircularProgress';
import { dummyProjects } from '@/app/(pages)/dashboard/cargabilidad/page';
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
  } = ({ ...dummyProps, ...props } as Required<CargabilidadProps>);

  const [expanded, setExpanded] = useState(false);
  const utilization = Math.round(pct(assignedHours, totalHours));
  const available = Math.max(totalHours - assignedHours, 0);

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
      
      </div>

      
    </section>
  );
}

// alias para compatibilidad
export const EmployeeSummary = CargabilidadCard;
export default EmployeeSummary;
