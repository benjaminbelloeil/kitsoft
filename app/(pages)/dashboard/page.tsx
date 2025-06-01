/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { userData as staticUserData, mockCourses } from "@/app/lib/data";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Sun, Moon, Sunrise } from "lucide-react";
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { createClient } from '@/utils/supabase/client';

// Import component sections
import Header from "@/components/dashboard/Header";
import GreetingCard from "@/components/dashboard/GreetingCard";
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
    const priority = cargabilidadPercentage >= 70 ? 'alta' : 
                    cargabilidadPercentage >= 40 ? 'media' : 'baja';

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

  // Mock urgent tasks (since we don't have task API yet)
  const urgentTasks = projects.slice(0, 2).map(project => ({
    id: `task-${project.id}`,
    title: `Revisar avances de ${project.name}`,
    projectName: project.name,
    dueDate: project.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: "in-progress" as const,
    projectColor: project.color,
    description: `Revisión semanal del proyecto ${project.name}`
  }));

  // Adaptar datos de cursos desde mockCourses
  const upcomingCourses = mockCourses
    .filter(course => course.status === 'in-progress')
    .slice(0, 2)
    .map(course => ({
      id: course.id,
      name: course.name,
      date: course.expirationDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Si no hay fecha, usar 30 días desde hoy
      completed: course.modules ? Math.round((course.modules.filter(m => m.completed).length / course.modules.length) * 100) : 0,
      image: course.category === 'cloud' ? "/courses/aws.svg" : "/courses/react.svg",
      type: "course" as const
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
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || staticUserData.name,
              title: profileData.Titulo || staticUserData.title,
              avatar: profileData.URL_Avatar || null,
            });
            console.log('Updated userData with avatar:', profileData.URL_Avatar);
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
  const getDateColor = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return "text-red-600";
    if (diffDays <= 2) return "text-amber-600";
    return "text-green-600";
  };
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  const getProjectColor = (color: string) => {
    switch(color) {
      case "indigo": return "bg-indigo-600";
      case "emerald": return "bg-emerald-600";
      case "blue": return "bg-blue-600";
      case "purple": return "bg-purple-600";
      case "amber": return "bg-amber-600";
      case "accenture": return "bg-purple-600"; // Fallback para accenture
      default: return "bg-indigo-600";
    }
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
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4 lg:items-stretch h-full"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Left column - My Projects */}
          <motion.div 
            className="lg:col-span-2 space-y-6 flex flex-col h-full"
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
                projects={projects}
                getDateColor={getDateColor}
                formatDate={formatDate}
                getProjectColor={getProjectColor}
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
                getDateColor={getDateColor}
                formatDate={formatDate}
                getProjectColor={getProjectColor}
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
            className="space-y-6 flex flex-col h-full"
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
              <TrainingCard courses={upcomingCourses} formatDate={formatDate} />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}