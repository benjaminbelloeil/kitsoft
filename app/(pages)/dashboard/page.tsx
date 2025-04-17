"use client";

import { useState, useEffect } from "react";
import { userData as staticUserData } from "@/app/lib/data";
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

  // Example data - this would come from the backend in a real app
  const myProjects = [
    {
      id: "p1",
      name: "Rediseño Web Corporativa", 
      progress: 68,
      dueDate: "2025-03-15",
      tasks: 12,
      completedTasks: 8,
      priority: "alta",
      color: "indigo"
    },
    {
      id: "p2",
      name: "App Móvil Gestión Interna",
      progress: 35,
      dueDate: "2025-04-22",
      tasks: 18,
      completedTasks: 6,
      priority: "media",
      color: "emerald"
    },
    {
      id: "p3",
      name: "Integración APIs de Proveedores",
      progress: 92,
      dueDate: "2025-03-02",
      tasks: 7,
      completedTasks: 6,
      priority: "alta",
      color: "blue"
    }
  ];

  const urgentTasks = [
    {
      id: "t1",
      title: "Completar documentación de usuario",
      projectName: "Rediseño Web Corporativa",
      dueDate: "2025-02-28",
      status: "in-progress",
      projectColor: "indigo"
    },
    {
      id: "t2",
      title: "Revisar test unitarios",
      projectName: "App Móvil Gestión Interna",
      dueDate: "2025-02-27",
      status: "not-started",
      projectColor: "emerald"
    },
    {
      id: "t3",
      title: "Actualizar dependencias",
      projectName: "Integración APIs de Proveedores",
      dueDate: "2025-03-01",
      status: "in-review",
      projectColor: "blue"
    }
  ];

  // Upcoming courses or certifications
  const upcomingCourses = [
    {
      id: "c1",
      name: "AWS Certified Developer Associate",
      date: "2025-03-10",
      completed: 65,
      image: "/courses/aws.svg",
      type: "certification" as const
    },
    {
      id: "c2",
      name: "React Advanced Patterns",
      date: "2025-03-15",
      completed: 30,
      image: "/courses/react.svg",
      type: "course" as const
    }
  ];

  // Get the upcoming week dates for the timeline
  const upcomingWeekDates = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(currentDate.getDate() + i);
    return date;
  });

  // Weekly workload data for the chart
  const weeklyWorkload = [
    { day: "Lun", hours: 8, color: "bg-indigo-500" },
    { day: "Mar", hours: 7.5, color: "bg-indigo-500" },
    { day: "Mié", hours: 9, color: "bg-indigo-500" },
    { day: "Jue", hours: 6.5, color: "bg-indigo-400" },
    { day: "Vie", hours: 8, color: "bg-indigo-500" },
    { day: "Sáb", hours: 0, color: "bg-gray-200" },
    { day: "Dom", hours: 0, color: "bg-gray-200" },
  ];

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
      case "amber": return "bg-amber-600";
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