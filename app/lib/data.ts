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

// Datos detallados de proyectos
export const projectsData: Project[] = [
  {
    id: "p1",
    name: "Project Nova",
    client: "Telefónica",
    description: "Desarrollo de plataforma digital para servicios de telecomunicaciones avanzados.",
    cargabilidad: 70,
    color: "emerald",
    status: 'active',
    startDate: '2023-12-01',
    endDate: '2024-07-31',
    tasks: [
      { 
        id: 't1', 
        name: 'Diseño de arquitectura', 
        completed: true, 
        dueDate: '2023-12-15',
        description: 'Definición de la arquitectura tecnológica del proyecto.'
      },
      { 
        id: 't2', 
        name: 'Desarrollo frontend', 
        completed: true, 
        dueDate: '2024-02-20',
        assignedTo: 'carlos.rodriguez@accenture.com',
        description: 'Implementación de la interfaz de usuario.'
      },
      { 
        id: 't3', 
        name: 'Integración APIs', 
        completed: false, 
        dueDate: '2024-05-30',
        assignedTo: 'juan@accenture.com',
        description: 'Desarrollo de las APIs necesarias.'
      },
      { 
        id: 't4', 
        name: 'Testing y QA', 
        completed: false, 
        dueDate: '2024-06-30',
        assignedTo: 'ana@accenture.com',
        description: 'Realizar pruebas unitarias, de integración y end-to-end.'
      }
    ]
  },
  {
    id: "p2",
    name: "Accenture Cloud First",
    client: "Accenture Internal",
    description: "Migración de infraestructura a la nube y optimización de recursos.",
    cargabilidad: 20,
    color: "blue",
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    tasks: [
      { 
        id: 't1', 
        name: 'Auditoría de sistemas actuales', 
        completed: true, 
        dueDate: '2024-01-20',
        assignedTo: 'lucia@accenture.com',
        description: 'Evaluación completa de la infraestructura actual.'
      },
      { 
        id: 't2', 
        name: 'Planificación de migración', 
        completed: true, 
        dueDate: '2024-02-28',
        assignedTo: 'carlos.rodriguez@accenture.com',
        description: 'Desarrollo del plan de migración.'
      },
      { 
        id: 't3', 
        name: 'Implementación fase 1', 
        completed: false, 
        dueDate: '2024-07-15',
        assignedTo: 'pablo@accenture.com',
        description: 'Migración de los primeros sistemas no críticos.'
      },
      { 
        id: 't4', 
        name: 'Capacitación del personal', 
        completed: false, 
        dueDate: '2024-10-30',
        description: 'Preparación y ejecución de sesiones de formación.'
      }
    ]
  },
  {
    id: "p3",
    name: "Digital Transformation",
    client: "BBVA",
    description: "Transformación digital de procesos internos y experiencia de cliente.",
    cargabilidad: 10,
    color: "purple",
    status: 'active',
    startDate: '2024-03-15',
    endDate: '2024-09-15',
    tasks: [
      { 
        id: 't1', 
        name: 'Análisis de procesos', 
        completed: true, 
        dueDate: '2024-03-30',
        assignedTo: 'elena@accenture.com',
        description: 'Documentación y análisis de los procesos actuales.'
      },
      { 
        id: 't2', 
        name: 'Diseño de nuevos flujos', 
        completed: false, 
        dueDate: '2024-05-15',
        assignedTo: 'carlos.rodriguez@accenture.com',
        description: 'Diseño de los nuevos flujos de trabajo digitalizados.'
      },
      { 
        id: 't3', 
        name: 'Desarrollo e implementación', 
        completed: false, 
        dueDate: '2024-07-30',
        assignedTo: 'miguel@accenture.com',
        description: 'Desarrollo de las soluciones tecnológicas necesarias.'
      },
      { 
        id: 't4', 
        name: 'Evaluación y ajustes', 
        completed: false, 
        dueDate: '2024-08-30',
        description: 'Evaluación del impacto de los cambios implementados.'
      }
    ]
  },
  {
    id: "p4",
    name: "Smart City Initiative",
    client: "Ayuntamiento de Madrid",
    description: "Plataforma de gestión para ciudad inteligente con monitoreo en tiempo real.",
    cargabilidad: 0,
    color: "accenture",
    status: 'archived',
    startDate: '2023-04-01',
    endDate: '2024-01-30',
    tasks: [
      { 
        id: 't1', 
        name: 'Análisis de requisitos', 
        completed: true, 
        dueDate: '2023-05-10',
        assignedTo: 'sofia@accenture.com',
        description: 'Definición de los requisitos técnicos y funcionales.'
      },
      { 
        id: 't2', 
        name: 'Desarrollo de plataforma', 
        completed: true, 
        dueDate: '2023-09-20',
        assignedTo: 'carlos.rodriguez@accenture.com',
        description: 'Implementación de la plataforma de gestión centralizada.'
      },
      { 
        id: 't3', 
        name: 'Implementación de sensores', 
        completed: true, 
        dueDate: '2023-11-15',
        assignedTo: 'david@accenture.com',
        description: 'Instalación y configuración de la red de sensores IoT.'
      },
      { 
        id: 't4', 
        name: 'Entrega final', 
        completed: true, 
        dueDate: '2024-01-30',
        description: 'Finalización del proyecto y entrega de documentación.'
      }
    ]
  },
  {
    id: "p5",
    name: "E-commerce Replatform",
    client: "El Corte Inglés",
    description: "Migración y modernización de plataforma de comercio electrónico.",
    cargabilidad: 0,
    color: "emerald",
    status: 'archived',
    startDate: '2023-03-01',
    endDate: '2024-02-01',
    tasks: [
      { 
        id: 't1', 
        name: 'Auditoría técnica', 
        completed: true, 
        dueDate: '2023-04-15',
        assignedTo: 'javier@accenture.com',
        description: 'Evaluación de la plataforma actual.'
      },
      { 
        id: 't2', 
        name: 'Diseño de arquitectura', 
        completed: true, 
        dueDate: '2023-06-20',
        assignedTo: 'carlos.rodriguez@accenture.com',
        description: 'Diseño de la nueva arquitectura tecnológica.'
      },
      { 
        id: 't3', 
        name: 'Desarrollo e integración', 
        completed: true, 
        dueDate: '2023-10-30',
        assignedTo: 'laura@accenture.com',
        description: 'Implementación de la nueva plataforma.'
      },
      { 
        id: 't4', 
        name: 'Migración de datos', 
        completed: true, 
        dueDate: '2023-12-15',
        description: 'Transferencia de datos históricos y actuales.'
      },
      { 
        id: 't5', 
        name: 'Lanzamiento', 
        completed: true, 
        dueDate: '2024-02-01',
        description: 'Puesta en producción de la nueva plataforma.'
      }
    ]
  }
];

// Shared data for user profile and calendar events
export const userData = {
  name: "Carlos Rodríguez",
  title: "Senior Software Engineer",
  location: "Madrid, España",
  email: "carlos.rodriguez@accenture.com",
  phone: "+34 612 345 678",
  bio: "Ingeniero de software con más de 7 años de experiencia en desarrollo fullstack. Especializado en React, Node.js y arquitecturas cloud.",
  avatar: "placeholder-avatar.png", 
  projects: [
    { id: "p1", name: "Project Nova", cargabilidad: 70, color: "emerald" },
    { id: "p2", name: "Accenture Cloud First", cargabilidad: 20, color: "blue" },
    { id: "p3", name: "Digital Transformation", cargabilidad: 10, color: "purple" }
  ],
  skills: ["JavaScript", "React", "TypeScript", "Node.js", "AWS", "Azure", "Docker", "CI/CD", "Agile"],
  experience: [
    {
      company: "Accenture",
      position: "Senior Software Engineer",
      period: "2020 - Presente",
      description: "Desarrollo de soluciones cloud-native para clientes del sector financiero."
    },
    {
      company: "Telefónica",
      position: "Developer",
      period: "2017 - 2020",
      description: "Implementación de aplicaciones web y móviles para servicios de telecomunicaciones."
    }
  ]
};

// Calendar events data
export const calendarEvents = [
  {
    id: "e1",
    projectId: "p1",
    title: "Project Nova Sprint Planning",
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    end: new Date(new Date().setDate(new Date().getDate() - 2)),
    allDay: true,
    description: "Planificación del sprint para el próximo mes del proyecto Nova",
    location: "Sala 3B, Madrid Office",
    attendees: ["maria@accenture.com", "juan@accenture.com", "ana@accenture.com"],
    color: "emerald"
  },
  {
    id: "e2",
    projectId: "p1",
    title: "Nova Team Sync",
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    allDay: false,
    description: "Daily sync con el equipo de Project Nova",
    location: "Microsoft Teams",
    color: "emerald"
  },
  {
    id: "e3",
    projectId: "p2",
    title: "Cloud First Architecture Review",
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    allDay: true,
    description: "Revisión de la arquitectura del proyecto Cloud First",
    location: "Sala 1A, Madrid Office",
    color: "blue"
  },
  {
    id: "e4",
    projectId: "p3",
    title: "Digital Transformation Demo",
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    allDay: false,
    description: "Presentación de avances del proyecto Digital Transformation",
    location: "Client Office",
    color: "purple"
  },
  {
    id: "e5",
    projectId: "p2",
    title: "Cloud First Team Meeting",
    start: new Date(new Date().setDate(new Date().getDate() - 1)),
    end: new Date(new Date().setDate(new Date().getDate() - 1)),
    allDay: false,
    description: "Reunión semanal con el equipo de Cloud First",
    location: "Microsoft Teams",
    color: "blue"
  },
  {
    id: "e6",
    projectId: "p1",
    title: "Project Nova Client Review",
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    allDay: true,
    description: "Revisión mensual con el cliente del Project Nova",
    location: "Online",
    color: "emerald"
  },
  {
    id: "e7",
    projectId: "p3",
    title: "Digital Transformation Workshop",
    start: new Date(new Date().setDate(new Date().getDate() + 4)),
    end: new Date(new Date().setDate(new Date().getDate() + 4)),
    allDay: true,
    description: "Workshop para definir próximos pasos del proyecto Digital Transformation",
    location: "Innovation Lab",
    color: "purple"
  }
];

//Courses Data
  // Datos de cursos de muestra
export const mockCourses = [
  {
    id: '1',
    name: 'AWS Certified Solutions Architect - Associate',
    issuer: 'Amazon Web Services',
    description: 'Validación de conocimientos técnicos para diseñar y desplegar arquitecturas seguras y robustas en la plataforma AWS.',
    status: 'completed',
    category: 'cloud',
    completionDate: '2024-02-15',
    expirationDate: '2027-02-15',
    credentialID: 'AWS-ASA-12345',
    credentialURL: 'https://aws.amazon.com/verification',
    relevanceScore: 85,
    skills: ['AWS', 'Cloud Architecture', 'EC2', 'S3', 'Lambda']
  },
  {
    id: '2',
    name: 'Certified Scrum Master (CSM)',
    issuer: 'Scrum Alliance',
    description: 'Certificación que acredita conocimientos de los principios de Scrum y la habilidad para facilitar sesiones de Scrum.',
    status: 'completed',
    category: 'agile',
    completionDate: '2023-11-10',
    expirationDate: '2025-11-10',
    credentialID: 'CSM-98765',
    credentialURL: 'https://www.scrumalliance.org/certification',
    relevanceScore: 75,
    skills: ['Scrum', 'Agile', 'Project Management', 'Team Facilitation']
  },
  {
    id: '3',
    name: 'Microsoft Azure Fundamentals (AZ-900)',
    issuer: 'Microsoft',
    description: 'Certificación que demuestra conocimientos básicos sobre servicios cloud en Azure, modelos de precios y facturación.',
    status: 'in-progress',
    category: 'cloud',
    expirationDate: '2025-12-31',
    relevanceScore: 80,
    modules: [
      {
        id: 'm1',
        name: 'Conceptos de Cloud',
        description: 'Introducción a los conceptos básicos de computación en la nube',
        completed: true
      },
      {
        id: 'm2',
        name: 'Servicios de Azure Core',
        description: 'Servicios principales y productos disponibles en Azure',
        completed: true
      },
      {
        id: 'm3',
        name: 'Seguridad, Privacidad y Cumplimiento',
        description: 'Aspectos de seguridad y privacidad en Azure',
        completed: false
      },
      {
        id: 'm4',
        name: 'Precios y Soporte de Azure',
        description: 'Modelos de precios, SLAs y ciclo de vida de servicios',
        completed: false
      }
    ]
  },
  {
    id: '4',
    name: 'Google Professional Data Engineer',
    issuer: 'Google Cloud',
    description: 'Certificación que valida la capacidad para diseñar e implementar soluciones de procesamiento de datos, ML y análisis de datos.',
    status: 'in-progress',
    category: 'data',
    expirationDate: '2026-01-20',
    relevanceScore: 90,
    modules: [
      {
        id: 'm1',
        name: 'Diseño de soluciones de datos',
        description: 'Arquitectura y diseño de soluciones de procesamiento de datos',
        completed: true
      },
      {
        id: 'm2',
        name: 'Construcción de soluciones de procesamiento de datos',
        description: 'Implementación de pipelines de datos y ETL',
        completed: false
      },
      {
        id: 'm3',
        name: 'Operación de soluciones de datos',
        description: 'Monitoreo, optimización y solución de problemas',
        completed: false
      }
    ]
  },
  {
    id: '5',
    name: 'ITIL 4 Foundation',
    issuer: 'Axelos',
    description: 'Certificación que proporciona una comprensión del marco de gestión de servicios ITIL y cómo puede mejorar el trabajo y servicios.',
    status: 'completed',
    category: 'methodology',
    completionDate: '2023-08-22',
    expirationDate: null, // No expira
    credentialID: 'ITIL-F-54321',
    credentialURL: 'https://www.axelos.com/certifications/itil-certifications',
    relevanceScore: 70,
    skills: ['ITSM', 'Service Management', 'ITIL Framework']
  }
];

// Feedback data types and mock data
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

export const feedbackData: FeedbackItem[] = [
  {
    id: "f1",
    from: {
      id: "u2",
      name: "Ana Martínez",
      avatar: "/avatars/avatar-5.png",
      role: "Directora de Producto"
    },
    date: "2025-02-15",
    rating: 4.5,
    category: "Colaboración",
    message: "Gran trabajo en el último sprint. Tu colaboración con el equipo de diseño mejoró significativamente el resultado final del proyecto. Sigue así y considera compartir más tus conocimientos con el resto del equipo.",
    project: "Rediseño Web Corporativa"
  },
  {
    id: "f2",
    from: {
      id: "u3",
      name: "Carlos Rodríguez",
      avatar: "/avatars/avatar-3.png", 
      role: "Líder Técnico"
    },
    date: "2025-02-10",
    rating: 5,
    category: "Calidad del Código",
    message: "Excelente trabajo implementando patrones de diseño en el último módulo. Tu código es limpio, bien documentado y fácil de mantener. El equipo se beneficia mucho de tu atención al detalle.",
  },
  {
    id: "f3",
    from: {
      id: "u4",
      name: "Laura Sánchez",
      avatar: "/avatars/avatar-2.png",
      role: "Gerente de Proyecto"
    },
    date: "2025-02-05",
    rating: 4,
    category: "Cumplimiento de Plazos",
    message: "Has entregado consistentemente dentro de los plazos acordados. Para mejorar, podrías trabajar en comunicar antes cuando preveas posibles retrasos para ajustar mejor la planificación.",
    project: "App Móvil Gestión Interna"
  },
  {
    id: "f4",
    from: {
      id: "u5",
      name: "Miguel Torres",
      avatar: "/avatars/avatar-4.png",
      role: "Desarrollador Senior"
    },
    date: "2025-01-28",
    rating: 4.8,
    category: "Resolución de Problemas",
    message: "Tu capacidad para resolver problemas complejos es impresionante. El bug que arreglaste la semana pasada había estado causando problemas durante meses. Gracias por tu dedicación y perseverancia.",
    project: "Integración APIs de Proveedores"
  },
  {
    id: "f5",
    from: {
      id: "u6",
      name: "Elena Gómez",
      avatar: "/avatars/avatar-6.png",
      role: "Diseñadora UX/UI"
    },
    date: "2025-01-20",
    rating: 4.2,
    category: "Comunicación",
    message: "Aprecio mucho cómo integras los requisitos de diseño en tus implementaciones. Para mejorar, podrías pedir más aclaraciones al inicio del proceso para evitar revisiones posteriores.",
    project: "Rediseño Web Corporativa"
  }
];

export const feedbackStats = [
  { 
    title: "Promedio General", 
    value: "4.5", 
    trend: "+0.3",
    color: "blue" 
  },
  { 
    title: "Calidad de Código", 
    value: "4.8", 
    trend: "+0.2",
    color: "indigo" 
  },
  { 
    title: "Colaboración", 
    value: "4.6", 
    trend: "+0.4",
    color: "cyan" 
  },
  { 
    title: "Cumplimiento", 
    value: "4.2", 
    trend: "0.0",
    color: "emerald" 
  }
];

export const feedbackRecipients = [
  { id: "r1", name: "Carlos Rodríguez", role: "Líder Técnico", avatar: "/avatars/avatar-3.png" },
  { id: "r2", name: "Ana Martínez", role: "Directora de Producto", avatar: "/avatars/avatar-5.png" },
  { id: "r3", name: "Laura Sánchez", role: "Gerente de Proyecto", avatar: "/avatars/avatar-2.png" },
  { id: "r4", name: "Miguel Torres", role: "Desarrollador Senior", avatar: "/avatars/avatar-4.png" },
];

export const monthlyFeedbackProgress = [
  { month: "Ene", rating: 4.0 },
  { month: "Feb", rating: 4.2 },
  { month: "Mar", rating: 4.1 },
  { month: "Abr", rating: 4.3 },
  { month: "May", rating: 4.3 },
  { month: "Jun", rating: 4.4 },
  { month: "Jul", rating: 4.5 },
  { month: "Ago", rating: 4.7 },
  { month: "Sep", rating: 4.6 },
  { month: "Oct", rating: 4.5 },
  { month: "Nov", rating: 4.7 },
  { month: "Dic", rating: 4.8 },
];

// Helper functions for the calendar
export function getMonthDays(month: number, year: number) {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export function getMonthName(month: number) {
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return monthNames[month];
}

export function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

// Funciones auxiliares para proyectos
export function getProjectsByStatus(status: 'active' | 'archived'): Project[] {
  return projectsData.filter(project => project.status === status);
}

export function getProjectById(id: string): Project | undefined {
  return projectsData.find(project => project.id === id);
}

export function calculateProjectProgress(projectId: string): number {
  const project = getProjectById(projectId);
  if (!project || project.tasks.length === 0) return 0;
  
  const completedTasks = project.tasks.filter(task => task.completed).length;
  return Math.round((completedTasks / project.tasks.length) * 100);
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