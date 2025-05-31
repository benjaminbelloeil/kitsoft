// Project utility functions

// Extended color palette for projects
const PROJECT_COLORS = [
  'bg-emerald-500',    // Green
  'bg-blue-500',       // Blue
  'bg-purple-500',     // Purple
  'bg-amber-500',      // Amber/Orange
  'bg-red-500',        // Red
  'bg-indigo-500',     // Indigo
  'bg-cyan-500',       // Cyan
  'bg-pink-500',       // Pink
  'bg-teal-500',       // Teal
  'bg-orange-500',     // Orange
  'bg-violet-500',     // Violet
  'bg-rose-500',       // Rose
];

// Function to get a consistent color for a project based on its ID
export const getProjectColor = (color: string | null | undefined, projectId?: string) => {
  // If a specific color is provided and valid, use it
  if (color) {
    switch(color) {
      case 'emerald': return 'bg-emerald-500';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'amber': return 'bg-amber-500';
      case 'red': return 'bg-red-500';
      case 'indigo': return 'bg-indigo-500';
      case 'cyan': return 'bg-cyan-500';
      case 'pink': return 'bg-pink-500';
      case 'teal': return 'bg-teal-500';
      case 'orange': return 'bg-orange-500';
      case 'violet': return 'bg-violet-500';
      case 'rose': return 'bg-rose-500';
      case 'accenture': return 'bg-[#A100FF]';
    }
  }
  
  // If projectId is provided, generate a consistent color based on the ID
  if (projectId) {
    const hash = projectId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    const index = Math.abs(hash) % PROJECT_COLORS.length;
    return PROJECT_COLORS[index];
  }
  
  // Default fallback
  return 'bg-[#A100FF]';
};

// Function to get corresponding text color for contrast
export const getProjectTextColor = () => {
  // All our background colors are dark enough to need white text
  return 'text-white';
};

// Function to get the hex color value for non-Tailwind usage
export const getProjectHexColor = (color: string | null | undefined, projectId?: string) => {
  const bgClass = getProjectColor(color, projectId);
  
  switch(bgClass) {
    case 'bg-emerald-500': return '#10B981';
    case 'bg-blue-500': return '#3B82F6';
    case 'bg-purple-500': return '#8B5CF6';
    case 'bg-amber-500': return '#F59E0B';
    case 'bg-red-500': return '#EF4444';
    case 'bg-indigo-500': return '#6366F1';
    case 'bg-cyan-500': return '#06B6D4';
    case 'bg-pink-500': return '#EC4899';
    case 'bg-teal-500': return '#14B8A6';
    case 'bg-orange-500': return '#F97316';
    case 'bg-violet-500': return '#8B5CF6';
    case 'bg-rose-500': return '#F43F5E';
    case 'bg-[#A100FF]': return '#A100FF';
    default: return '#A100FF';
  }
};

// Function to get cargabilidad status and color
export const getCargabilidadStatus = (percentage: number) => {
  if (percentage >= 80) {
    return {
      status: 'Sobrecargado',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      dotColor: 'bg-red-500'
    };
  } else if (percentage >= 60 && percentage < 80) {
    return {
      status: 'Moderado',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      dotColor: 'bg-yellow-500'
    };
  } else if (percentage < 50) {
    return {
      status: 'Óptimo',
      color: 'text-green-600',
      bgColor: 'bg-green-100', 
      dotColor: 'bg-green-500'
    };
  } else {
    return {
      status: 'Moderado',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      dotColor: 'bg-yellow-500'
    };
  }
};
