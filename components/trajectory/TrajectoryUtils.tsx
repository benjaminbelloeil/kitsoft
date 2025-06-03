// Tipos de datos
export interface Course {
    id: string;
    name: string;
    issuer: string;
    description: string;
    status: 'completed' | 'in-progress';
    category: string;
    completionDate?: string;
    expirationDate?: string | null;
    credentialID?: string;
    credentialURL?: string;
    relevanceScore: number;
    skills?: string[];
    modules?: CourseModule[];
  }
  
  export interface CourseModule {
    id: string;
    name: string;
    description: string;
    completed: boolean;
  }
  
  // Colores para las categorías de cursos
  export const colorClasses = {
    cloud: {
      bg: 'bg-blue-500',
      border: 'border-blue-200'
    },
    data: {
      bg: 'bg-green-500',
      border: 'border-green-200'
    },
    security: {
      bg: 'bg-red-500',
      border: 'border-red-200'
    },
    agile: {
      bg: 'bg-yellow-500',
      border: 'border-yellow-200'
    },
    development: {
      bg: 'bg-indigo-500',
      border: 'border-indigo-200'
    },
    methodology: {
      bg: 'bg-purple-500',
      border: 'border-purple-200'
    },
    accenture: {
      bg: 'bg-[#A100FF]',
      border: 'border-[#E9D5FF]'
    }
  };
  
  // Funciones de utilidad
  export function calculateProgress(course: Course): number {
    if (course.modules) {
      const completedModules = course.modules.filter(m => m.completed).length;
      return Math.round((completedModules / course.modules.length) * 100);
    }
    return 0;
  }
  
  export function sortCourses(courses: Course[], sortBy: 'date' | 'relevance'): Course[] {
    return [...courses].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.completionDate || b.expirationDate || '2099-12-31').getTime() - 
               new Date(a.completionDate || a.expirationDate || '2099-12-31').getTime();
      } else {
        return b.relevanceScore - a.relevanceScore;
      }
    });
  }