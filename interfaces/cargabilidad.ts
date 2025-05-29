// Colores disponibles para los proyectos
export const PROJECT_COLORS = [
  'bg-purple-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-pink-500',
  'bg-teal-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-red-500',
];

export interface Project {
  name: string;
  load: number;
  deadline?: string;
  hoursPerWeek: number;
  color?: string; // Color del proyecto, opcional
}

export interface HistoryEntry {
  week: string;
  totalLoad: number;
  totalHours: number;
  availableHours: number;
  projects: {
    name: string;
    hours: number;
  }[];
}
