/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userData as staticUserData } from "@/app/lib/data";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Sun, Moon, Sunrise } from "lucide-react";
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { createClient } from '@/utils/supabase/client';

// Import component sections
import Header from "@/components/dashboard/Header";
import GreetingCard from "@/components/dashboard/GreetingCard";
import AddNoteCard from "@/components/dashboard/AddNoteCard";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import TasksSection from "@/components/dashboard/TasksSection";
import WorkSummary from "@/components/dashboard/WorkSummary";
import PerformanceCard from "@/components/dashboard/PerformanceCard";
import TrainingCard from "@/components/dashboard/TrainingCard";

// Types for real project data
interface ApiProject {
  id_proyecto: string;
  titulo: string;
  user_hours: number;
  horas_totales: number;
  fecha_inicio: string;
  fecha_fin: string | null;
}

interface DashboardProject {
  id: string;
  name: string;
  cargabilidad: number;
  dueDate: string | null;
  hoursPerWeek: number;
  priority: string;
  color: string;
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

// Transform API project data to dashboard format
const transformProjectData = (apiProjects: ApiProject[]): DashboardProject[] => {
  return apiProjects.map((project) => {
    const workingDays = calculateProjectWorkingDays(project.fecha_inicio, project.fecha_fin);
    const hoursPerDay = project.user_hours / workingDays;
    const hoursPerWeek = hoursPerDay * 5; // 5 working days per week
    
    // Calculate cargabilidad percentage (user's percentage of the total project)
    const cargabilidadPercentage = project.user_hours && project.horas_totales > 0 
      ? Math.round((project.user_hours / project.horas_totales) * 100)
      : 0;

    // Determine priority based on cargabilidad percentage
    let priority: string;
    if (cargabilidadPercentage >= 70) {
      priority = 'alta';
    } else if (cargabilidadPercentage >= 40) {
      priority = 'media';
    } else {
      priority = 'baja';
    }

    return {
      id: project.id_proyecto,
      name: project.titulo,
      cargabilidad: cargabilidadPercentage, // User's percentage of the project
      dueDate: project.fecha_fin,
      hoursPerWeek: Math.round(hoursPerWeek), // Round to whole number
      priority: priority,
      color: project.id_proyecto, // Pass project ID for consistent color assignment
    };
  });
};

// Calculate daily hours for weekly load chart (distribute across Monday-Friday)
const calculateWeeklyWorkload = (dashboardProjects: DashboardProject[]) => {
  const totalWeeklyHours = dashboardProjects.reduce((sum, project) => sum + project.hoursPerWeek, 0);
  const dailyHours = totalWeeklyHours / 5; // Distribute across 5 working days (Mon-Fri)
  
  return [
    { day: "Lun", hours: dailyHours, color: "bg-indigo-500" },
    { day: "Mar", hours: dailyHours, color: "bg-indigo-500" },
    { day: "Mié", hours: dailyHours, color: "bg-indigo-500" },
    { day: "Jue", hours: dailyHours, color: "bg-indigo-500" },
    { day: "Vie", hours: dailyHours, color: "bg-indigo-500" },
    { day: "Sáb", hours: 0, color: "bg-gray-200" },
    { day: "Dom", hours: 0, color: "bg-gray-200" },
  ];
};

export default function DashboardPage() {
  // Update greeting state to include icon and class for animation
  const [greetingState, setGreetingState] = useState({
    text: "Buenos días",
    icon: <Sun className="h-6 w-6 text-amber-500" />,
    class: ""
  });
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeString, setTimeString] = useState("");
  
  // Store user data from the database
  const [userData, setUserData] = useState({
    ...staticUserData,
    avatar: null as string | null
  });

  // State for real project data
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [weeklyWorkload, setWeeklyWorkload] = useState<any[]>([]);

  // Fetch real project data
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/user/proyectos?status=active');
        if (response.ok) {
          const apiProjects = await response.json();
          const transformedProjects = transformProjectData(apiProjects);
          setProjects(transformedProjects);
          setWeeklyWorkload(calculateWeeklyWorkload(transformedProjects));
        } else {
          console.error('Failed to fetch projects');
          setProjects([]);
          setWeeklyWorkload(calculateWeeklyWorkload([]));
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setWeeklyWorkload(calculateWeeklyWorkload([]));
      }
    };

    fetchProjects();
  }, []);

  // Sort projects by due date (closest first) and limit to 2
  const sortProjectsByDueDate = (projects: DashboardProject[]) => {
    return projects
      .filter(project => project.dueDate) // Only projects with due dates
      .sort((a, b) => {
        const dateA = new Date(a.dueDate!).getTime();
        const dateB = new Date(b.dueDate!).getTime();
        return dateA - dateB; // Ascending order (closest dates first)
      })
      .slice(0, 2); // Limit to 2 projects
  };

  // Get the 2 projects closest to their end dates
  const priorityProjects = sortProjectsByDueDate(projects);

  // Mock urgent tasks (since we don't have task API yet) - only for priority projects
  const urgentTasks = priorityProjects.map(project => ({
    id: `task-${project.id}`,
    title: `Revisar avances de ${project.name}`,
    projectName: project.name,
    projectId: project.id,
    dueDate: project.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "in-progress" as const,
    projectColor: project.color,
    description: `Revisión semanal del proyecto ${project.name}`
  }));

  // Fetch user data when component mounts
  useEffect(() => {
    async function fetchUserData() {
      try {
        const supabase = createClient();
        // Get current authenticated user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Get complete profile data for the user
          const profileData = await getUserCompleteProfile(user.id);
          
          if (profileData) {
            console.log('Profile data fetched:', profileData);
            // Update user data with fetched profile
            setUserData({
              ...staticUserData, // Keep static data for other properties
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || "Usuario",
              title: profileData.Titulo || "Completar perfil",
              avatar: profileData.URL_Avatar || null,
            });
            console.log('Updated userData with avatar:', profileData.URL_Avatar);
          } else {
            // New user - set appropriate fallback values
            setUserData({
              ...staticUserData, // Keep static data for other properties
              name: "Usuario",
              title: "Completar perfil",
              avatar: null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    
    fetchUserData();
  }, []);

  // Update greeting based on time of day - improved with icons and live updating
  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      let newGreeting = {
        text: "Buenos días",
        icon: <Sun className="h-6 w-6 text-amber-500" />,
        class: "animate-fadeIn"
      };
      
      if (hour >= 12 && hour < 18) {
        newGreeting = {
          text: "Buenas tardes",
          icon: <Sunrise className="h-6 w-6 text-orange-500" />,
          class: "animate-fadeIn"
        };
      } else if (hour >= 18 || hour < 6) {
        newGreeting = {
          text: "Buenas noches",
          icon: <Moon className="h-6 w-6 text-indigo-400" />,
          class: "animate-fadeIn"
        };
      }
      
      // Only update if text has changed
      if (newGreeting.text !== greetingState.text) {
        setGreetingState(newGreeting);
      }
      
      // Update current date
      setCurrentDate(new Date());
    };
    
    // Initial update
    updateGreeting();
    
    // Set up an interval to check every minute if greeting should change
    const greetingIntervalId = setInterval(updateGreeting, 60000);
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => {
      clearTimeout(timer);
      clearInterval(greetingIntervalId);
    };
  }, [greetingState.text]);

  // Add a separate effect for updating time every second
  useEffect(() => {
    // Function to update the time string
    const updateTimeString = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit'
        })
      );
    };

    // Update immediately
    updateTimeString();
    
    // Update every second
    const timeIntervalId = setInterval(updateTimeString, 1000);
    
    // Clear interval on unmount
    return () => clearInterval(timeIntervalId);
  }, []); // Empty dependency array means this runs once on mount

  // Utility functions
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "in-review": return "bg-purple-100 text-purple-800";
      case "not-started": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case "completed": return "Completada";
      case "in-progress": return "En curso";
      case "in-review": return "En revisión";
      case "not-started": return "No iniciada";
      default: return "Desconocido";
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div 
        className="pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Header userData={userData} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <GreetingCard 
            greetingState={greetingState}
            userData={userData}
            currentDate={currentDate}
            timeString={timeString}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4"
        >
          {/* Left column - My Projects */}
          <motion.div 
            className="lg:col-span-2 space-y-6 flex flex-col"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <ProjectsSection 
                projects={priorityProjects}
                formatDate={formatDate}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ y: -2 }}
            >
              <TasksSection 
                tasks={urgentTasks}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              whileHover={{ y: -2 }}
              className="flex-grow"
            >
              <WorkSummary workload={weeklyWorkload} projects={projects} />
            </motion.div>
          </motion.div>
          
          {/* Right column - Skills, Timeline, Training */}
          <motion.div 
            className="space-y-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
            >
              <PerformanceCard />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="flex-grow"
            >
              <TrainingCard />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Add Note Card - Bottom placement */}
        <motion.div 
          className="max-w-[1920px] mx-auto px-4 mt-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <AddNoteCard />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}