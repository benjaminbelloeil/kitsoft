/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardTab } from '@/components/cargabilidad/DashboardTab';
import { LoadAlert } from '@/components/cargabilidad/LoadAlert';
import { HeaderCard } from '@/components/cargabilidad/EmployeeSummary';
import CargabilidadSkeleton from '@/components/cargabilidad/CargabilidadSkeleton';
import { Project } from '@/interfaces/cargabilidad';

// Type for API project data
interface ApiProject {
  id_proyecto: string;
  titulo: string;
  user_hours: number;
  horas_totales: number;
  fecha_inicio: string;
  fecha_fin: string | null;
}

// Calculate project duration in working days (Monday-Friday only)
const calculateProjectWorkingDays = (fechaInicio: string, fechaFin: string | null): number => {
  const startDate = new Date(fechaInicio);
  const endDate = fechaFin ? new Date(fechaFin) : new Date(); // Use current date if no end date
  
  let workingDays = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dayOfWeek = currentDate.getDay();
    // Count Monday (1) through Friday (5) only
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      workingDays++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return Math.max(workingDays, 1); // Minimum 1 working day
};

// Transform API project data to cargabilidad format
const transformProjectData = (apiProjects: ApiProject[]): Project[] => {
  return apiProjects.map((project) => {
    const workingDays = calculateProjectWorkingDays(project.fecha_inicio, project.fecha_fin);
    const hoursPerDay = project.user_hours / workingDays;
    const hoursPerWeek = hoursPerDay * 5; // 5 working days per week
    
    // Calculate cargabilidad percentage (user's percentage of the total project)
    const cargabilidadPercentage = project.user_hours && project.horas_totales > 0 
      ? Math.round((project.user_hours / project.horas_totales) * 100)
      : 0;

    return {
      id_proyecto: project.id_proyecto,
      titulo: project.titulo,
      name: project.titulo, // For backwards compatibility
      load: cargabilidadPercentage, // User's percentage of the project
      deadline: project.fecha_fin || undefined,
      hoursPerWeek: Math.round(hoursPerWeek), // Round to whole number
      color: null, // Let projectUtils.ts assign consistent colors based on project ID
      user_hours: project.user_hours,
      horas_totales: project.horas_totales,
      fecha_inicio: project.fecha_inicio,
      fecha_fin: project.fecha_fin
    };
  });
};

// Calculate daily hours for weekly load chart (distribute across Monday-Friday)
const calculateWeeklyLoadChart = (projects: Project[]): number[] => {
  const totalWeeklyHours = projects.reduce((sum, project) => sum + project.hoursPerWeek, 0);
  const dailyHours = totalWeeklyHours / 5; // Distribute across 5 working days (Mon-Fri)
  
  // Return array for Monday through Sunday (last 2 days will be 0 for weekend)
  return [
    dailyHours, // Monday
    dailyHours, // Tuesday  
    dailyHours, // Wednesday
    dailyHours, // Thursday
    dailyHours, // Friday
    0, // Saturday
    0  // Sunday
  ];
};

const PersonalLoadPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const employee = {
    name: "Carlos Rodríguez",
    role: "Desarrollador Full Stack",
    totalHoursPerWeek: 40
  };

  // Fetch real project data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/user/proyectos?status=active');
        if (response.ok) {
          const apiProjects = await response.json();
          const transformedProjects = transformProjectData(apiProjects);
          setProjects(transformedProjects);
        } else {
          console.error('Failed to fetch projects');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []); // No dependencies needed since transformProjectData is now outside component

  const totalUsedHours = projects.reduce((sum, p) => sum + p.hoursPerWeek, 0);
  const availableHours = employee.totalHoursPerWeek - totalUsedHours;
  const totalLoad = Math.min(100, Math.round((totalUsedHours / employee.totalHoursPerWeek) * 100));
  const weeklyLoad = calculateWeeklyLoadChart(projects);

  const AvailableHoursRatio = availableHours / employee.totalHoursPerWeek;

  const utilLabel = (u: number) =>
    u >= 90 ? 'Sobrecargado' : u >= 70 ? 'Nivel óptimo' : 'Baja ocupación';
  
  const utilColor = (u: number) =>
    u >= 90 ? 'text-rose-600' : u >= 70 ? 'text-emerald-600' : 'text-amber-600';
  
  const utilBgColor = (u: number) =>
    u >= 90
      ? 'bg-rose-200/30 border border-rose-200/50'
      : u >= 70
      ? 'bg-emerald-200/30 border border-emerald-200/50'
      : 'bg-amber-200/30 border border-amber-200/50';
  
  const utilBarColor = (u: number) =>
    u >= 90 ? '#F43F5E' : u >= 70 ? '#10B981' : '#F59E0B';

  // Show loading skeleton while fetching data
  if (isLoading) {
    return <CargabilidadSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        className="min-h-screen bg-gray-50 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header card with animation */}
        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
            <HeaderCard
              name={employee.name}
              position={employee.role}
              projects={projects}
              totalHours={employee.totalHoursPerWeek}
              assignedHours={totalUsedHours}
              totalLoad={totalLoad}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {/* Show alert only if overloaded */}
          {AvailableHoursRatio < 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <LoadAlert totalLoad={totalLoad} />
            </motion.div>
          )}
          
          {/* Dashboard content without tabs */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.01 }}
          >
            <motion.div 
              className="p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <DashboardTab
                projects={projects}
                weeklyLoad={weeklyLoad}
                availableHours={availableHours}
                totalHoursPerWeek={employee.totalHoursPerWeek}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  );
};

export default PersonalLoadPage;