import { User, Briefcase, Rocket, Users, Lightbulb, FileText } from "lucide-react";

// Category definitions with icons and colors for Apple Notes style
export const categories = [
  { id: 'todas', name: 'Todas las notas', icon: FileText, count: 0, color: 'gray' },
  { id: 'personal', name: 'Personal', icon: User, count: 0, color: 'blue' },
  { id: 'trabajo', name: 'Trabajo', icon: Briefcase, count: 0, color: 'green' },
  { id: 'proyecto', name: 'Proyectos', icon: Rocket, count: 0, color: 'purple' },
  { id: 'reunión', name: 'Reuniones', icon: Users, count: 0, color: 'orange' },
  { id: 'idea', name: 'Ideas', icon: Lightbulb, count: 0, color: 'yellow' },
] as const;

export type CategoryId = 'todas' | 'personal' | 'trabajo' | 'proyecto' | 'reunión' | 'idea';
export type Priority = 'alta' | 'media' | 'baja';

// Helper function to get category color classes
export const getCategoryColors = (color: string) => {
  const colorMap: Record<string, {
    bg: string;
    border: string;
    text: string;
    icon: string;
    cardBg: string;
    cardBorder: string;
    cardHover: string;
    dot: string;
    dotBorder: string;
  }> = {
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      icon: 'text-gray-600',
      cardBg: 'bg-gray-50/50',
      cardBorder: 'border-gray-200',
      cardHover: 'hover:border-gray-300',
      dot: 'bg-gray-500',
      dotBorder: 'border-gray-300'
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
      cardBg: 'bg-blue-50/50',
      cardBorder: 'border-blue-200',
      cardHover: 'hover:border-blue-300',
      dot: 'bg-blue-500',
      dotBorder: 'border-blue-300'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      icon: 'text-green-600',
      cardBg: 'bg-green-50/50',
      cardBorder: 'border-green-200',
      cardHover: 'hover:border-green-300',
      dot: 'bg-green-500',
      dotBorder: 'border-green-300'
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
      cardBg: 'bg-purple-50/50',
      cardBorder: 'border-purple-200',
      cardHover: 'hover:border-purple-300',
      dot: 'bg-purple-500',
      dotBorder: 'border-purple-300'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600',
      cardBg: 'bg-orange-50/50',
      cardBorder: 'border-orange-200',
      cardHover: 'hover:border-orange-300',
      dot: 'bg-orange-500',
      dotBorder: 'border-orange-300'
    },
    yellow: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      icon: 'text-yellow-600',
      cardBg: 'bg-yellow-50/50',
      cardBorder: 'border-yellow-200',
      cardHover: 'hover:border-yellow-300',
      dot: 'bg-yellow-500',
      dotBorder: 'border-yellow-300'
    }
  };
  
  return colorMap[color] || colorMap.gray;
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "alta": return "text-red-700 bg-red-50";
    case "media": return "text-yellow-700 bg-yellow-50";
    case "baja": return "text-green-700 bg-green-50";
    default: return "text-gray-700 bg-gray-50";
  }
};

export const priorityOptions = [
  { id: 'alta', name: 'Alta', color: 'bg-red-500' },
  { id: 'media', name: 'Media', color: 'bg-yellow-500' },
  { id: 'baja', name: 'Baja', color: 'bg-green-500' }
] as const;
