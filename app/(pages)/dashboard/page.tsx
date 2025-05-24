/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { userData as staticUserData, projectsData, mockCourses } from "@/app/lib/data";
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
import EventsCard from "@/components/dashboard/EventsCard";

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
  const [userData, setUserData] = useState(staticUserData);

  // Función para adaptar los datos de projectsData al formato esperado por ProjectsSection
  const adaptProjectsData = (importedProjects: any[]) => {
    return importedProjects.map(project => ({
      id: project.id,
      name: project.name,
      progress: project.cargabilidad, // Mapear cargabilidad a progress
      dueDate: project.endDate, // Mapear endDate a dueDate
      tasks: project.tasks ? project.tasks.length : 0, // Contar tareas totales
      completedTasks: project.tasks ? project.tasks.filter((task: any) => task.completed).length : 0, // Contar tareas completadas
      priority: project.cargabilidad > 50 ? 'alta' : project.cargabilidad > 20 ? 'media' : 'baja', // Mapear cargabilidad a priority
      color: project.color
    }));
  };

  // Adaptar los datos de projectsData
  const myProjects = adaptProjectsData(projectsData.filter(project => project.status === 'active'));

  // Generar tareas urgentes desde los datos reales
  const urgentTasks = projectsData
    .filter(project => project.status === 'active')
    .flatMap(project => 
      project.tasks
        .filter(task => !task.completed)
        .slice(0, 2) // Tomar máximo 2 tareas por proyecto
        .map(task => ({
          id: task.id,
          title: task.name,
          projectName: project.name,
          dueDate: task.dueDate,
          status: task.assignedTo ? "in-progress" : "not-started",
          projectColor: project.color,
          description: task.description
        }))
    )
    .slice(0, 3); // Limitar a 3 tareas urgentes totales

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

  // Get the upcoming week dates for the timeline
  const upcomingWeekDates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  // Generar datos de carga de trabajo basados en los proyectos activos
  const generateWorkloadFromProjects = () => {
    const totalCargabilidad = projectsData
      .filter(project => project.status === 'active')
      .reduce((sum, project) => sum + project.cargabilidad, 0);
    
    const baseHours = Math.min(totalCargabilidad / 10, 9); // Convertir cargabilidad a horas (máximo 9h)
    
    return [
      { day: "Lun", hours: Math.max(baseHours - 1, 0), color: "bg-indigo-500" },
      { day: "Mar", hours: Math.max(baseHours - 0.5, 0), color: "bg-indigo-500" },
      { day: "Mié", hours: Math.min(baseHours + 1, 9), color: "bg-indigo-500" },
      { day: "Jue", hours: Math.max(baseHours - 1.5, 0), color: "bg-indigo-400" },
      { day: "Vie", hours: baseHours, color: "bg-indigo-500" },
      { day: "Sáb", hours: 0, color: "bg-gray-200" },
      { day: "Dom", hours: 0, color: "bg-gray-200" },
    ];
  };

  const weeklyWorkload = generateWorkloadFromProjects();

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
            // Update user data with fetched profile
            setUserData({
              ...staticUserData, // Keep static data for other properties
              name: `${profileData.Nombre || ''} ${profileData.Apellido || ''}`.trim() || staticUserData.name,
              title: profileData.Titulo || staticUserData.title,
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
    <div className="pb-12">
      <Header userData={userData} />
      
      <GreetingCard 
        greetingState={greetingState}
        userData={userData}
        currentDate={currentDate}
        timeString={timeString}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-[1920px] mx-auto px-4">
        {/* Left column - My Projects */}
        <div className="lg:col-span-2 space-y-6">
          <ProjectsSection 
            projects={myProjects}
            getDateColor={getDateColor}
            formatDate={formatDate}
            getProjectColor={getProjectColor}
          />
          
          <TasksSection 
            tasks={urgentTasks}
            getDateColor={getDateColor}
            formatDate={formatDate}
            getProjectColor={getProjectColor}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
          
          <WorkSummary workload={weeklyWorkload} />
        </div>
        
        {/* Right column - Skills, Timeline, Training */}
        <div className="space-y-6">
          <PerformanceCard />
          <TrainingCard courses={upcomingCourses} formatDate={formatDate} />
          <EventsCard upcomingWeekDates={upcomingWeekDates} />
        </div>
      </div>
    </div>
  );
}