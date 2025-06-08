/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardSkeleton } from "@/components/dashboard/DashboardSkeleton";
import { Sun, Moon, Sunrise } from "lucide-react";
import { getUserCompleteProfile } from '@/utils/database/client/profileSync';
import { getFeedbackStats } from '@/utils/database/client/feedbackSync';
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
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Update greeting state to include icon and class for animation
  const [greetingState, setGreetingState] = useState({
    text: "Buenos días",
    icon: <Sun className="h-6 w-6 text-amber-500" />,
    class: ""
  });
  
  // Loading states - track each data source separately
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [feedbackDataLoaded, setFeedbackDataLoaded] = useState(false);
  const [notesDataLoaded, setNotesDataLoaded] = useState(false);
  const [minLoadingTimeElapsed, setMinLoadingTimeElapsed] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [timeString, setTimeString] = useState("");
  
  // Store user data from the database
  const [userData, setUserData] = useState({
    name: "Usuario",
    title: "Completar perfil",
    avatar: null as string | null
  });

  // State for real project data
  const [projects, setProjects] = useState<DashboardProject[]>([]);
  const [weeklyWorkload, setWeeklyWorkload] = useState<any[]>([]);
  
  // State for feedback data to pass to PerformanceCard
  const [feedbackStats, setFeedbackStats] = useState<any[]>([]);

  // Computed loading state - only false when all data is loaded AND minimum time has elapsed
  const loading = !userDataLoaded || !projectsLoaded || !feedbackDataLoaded || !notesDataLoaded || !minLoadingTimeElapsed;

  // Debug loading states
  // Loading state tracking removed for security

  // Minimum loading time to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTimeElapsed(true);
      // Minimum loading time completed
    }, 1200); // Minimum 1200ms loading time to ensure all data loads

    return () => clearTimeout(timer);
  }, []);

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
      } finally {
        setProjectsLoaded(true);
        // Projects data loading completed
      }
    };

    fetchProjects();
  }, []);

  // Fetch feedback data for dashboard loading state
  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // Actually fetch the feedback stats to ensure data is loaded
          const stats = await getFeedbackStats(user.id);
          setFeedbackStats(stats); // Store the stats for PerformanceCard
          // Dashboard feedback data loaded
        }
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setFeedbackDataLoaded(true);
        // Feedback data loading completed
      }
    };

    fetchFeedbackData();
  }, []);

  // Fetch notes data for dashboard loading state
  useEffect(() => {
    const fetchNotesData = async () => {
      try {
        // We can't import getUserNotes directly due to circular dependencies,
        // so we'll make a simple fetch or just set a timer to simulate the loading
        // In practice, we could create a lightweight endpoint for this
        setTimeout(() => {
          setNotesDataLoaded(true);
          // Notes data loading completed
        }, 200); // Small delay to simulate notes loading
      } catch (error) {
        console.error('Error fetching notes data:', error);
        setNotesDataLoaded(true);
      }
    };

    fetchNotesData();
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
            // Profile data fetched successfully
            // Update user data with fetched profile
            setUserData({
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || "Usuario",
              title: profileData.Titulo || "Completar perfil",
              avatar: profileData.URL_Avatar || null,
            });
            // Updated userData with avatar
          } else {
            // New user - set appropriate fallback values
            setUserData({
              name: "Usuario",
              title: "Completar perfil",
              avatar: null,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setUserDataLoaded(true);
        // User data loading completed
      }
    }
    
    fetchUserData();
  }, []);  // Update greeting based on time of day - improved with icons and live updating
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
    
    return () => {
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

  // Search filtering function
  const shouldShowComponent = (componentName: string, searchContent: string[]) => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      componentName.toLowerCase().includes(query) ||
      searchContent.some(content => content.toLowerCase().includes(query))
    );
  };

  // Filter components based on search
  const showProjects = shouldShowComponent("proyectos", [
    "proyectos", "mis proyectos", "carga", "horas", "trabajo", "deadlines", "projects",
    ...projects.map(p => p.name.toLowerCase())
  ]);

  const showTasks = shouldShowComponent("tareas", [
    "tareas", "pendientes", "urgentes", "trabajo", "asignaciones", "to-do", "tasks", "tareas urgentes"
  ]);

  const showWorkSummary = shouldShowComponent("resumen", [
    "resumen", "trabajo", "semanal", "carga", "horas", "rendimiento", "productividad",
    "resumen semanal", "work summary", "workload", "semana"
  ]);

  const showPerformance = shouldShowComponent("rendimiento", [
    "rendimiento", "performance", "métricas", "estadísticas", "kpis", "resultados",
    "feedback", "retroalimentacion", "retroalimentación", "desempeño"
  ]);

  const showTraining = shouldShowComponent("desarrollo", [
    "desarrollo", "entrenamiento", "capacitación", "cursos", "aprendizaje", "formación",
    "training", "capacitacion", "educacion", "educación"
  ]);

  const showNotes = shouldShowComponent("notas", [
    "notas", "mis notas", "apuntes", "recordatorios", "documentos", "notes", 
    "añadir nota", "crear nota", "note"
  ]);

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
          <Header 
            userData={userData} 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
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
            <AnimatePresence mode="wait">
              {showProjects && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -2 }}
                >
                  <ProjectsSection 
                    projects={priorityProjects}
                    formatDate={formatDate}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {showTasks && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <TasksSection 
                    tasks={urgentTasks}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusText={getStatusText}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <AnimatePresence mode="wait">
              {showWorkSummary && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ y: -2 }}
                  className="flex-grow"
                >
                  <WorkSummary workload={weeklyWorkload} projects={projects} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Right column - Skills, Timeline, Training */}
          <motion.div 
            className="space-y-6 flex flex-col"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {showPerformance && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <PerformanceCard feedbackStats={feedbackStats} />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {showTraining && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex-grow"
                >
                  <TrainingCard />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Add Note Card - Bottom placement */}
        <AnimatePresence mode="wait">
          {showNotes && (
            <motion.div 
              className="max-w-[1920px] mx-auto px-4 mt-6 mb-6"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <AddNoteCard />
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results message */}
        {searchQuery.trim() && !showProjects && !showTasks && !showWorkSummary && !showPerformance && !showTraining && !showNotes && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-[1920px] mx-auto px-4 mt-12"
          >
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-500 mb-4">
                No hay tarjetas que coincidan con &quot;{searchQuery}&quot;
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="inline-flex items-center px-4 py-2 bg-purple-600/20 text-purple-700 rounded-lg hover:bg-purple-600/30 transition-colors border border-purple-200"
              >
                Mostrar todas las tarjetas
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}