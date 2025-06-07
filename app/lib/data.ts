// app/lib/data.ts
// Import navigation types from the nav folder instead of defining them here
import { NavItem, navLinks, DropdownItem } from "@/components/navbar/navigation-data";

// Definición de tipos para los proyectos y tareas
export interface Task {
  id: string;
  name: string;
  completed: boolean;
  dueDate: string;
  assignedTo?: string;
  description?: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description: string;
  cargabilidad: number;
  color: string;
  status: 'active' | 'archived';
  startDate: string;
  endDate: string;
  tasks: Task[];
}

// Re-export navLinks and types for backwards compatibility
export { navLinks };
export type { NavItem, DropdownItem };

// Feedback data types
export interface FeedbackItem {
  id: string;
  from: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  date: string;
  rating: number;
  category: string;
  message: string;
  project?: string;
}

export const colorClasses: Record<string, { bg: string, light: string, border: string, text: string, color: string }> = {
  emerald: { 
    color: "#10B981",
    bg: "bg-emerald-500", 
    light: "bg-emerald-50", 
    border: "border-emerald-500",
    text: "text-emerald-700"
  },
  blue: { 
    color: "blue",
    bg: "bg-blue-500", 
    light: "bg-blue-50", 
    border: "border-blue-500",
    text: "text-blue-700"
  },
  purple: { 
    color: "purple",
    bg: "bg-purple-500", 
    light: "bg-purple-50", 
    border: "border-purple-500",
    text: "text-purple-700"
  },
  accenture: { 
    color: "#A100FF",
    bg: "bg-[#A100FF]", 
    light: "bg-[#A100FF20]", 
    border: "border-[#A100FF]",
    text: "text-[#A100FF]"
  }
};