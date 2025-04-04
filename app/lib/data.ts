// Define types for navigation items
export interface DropdownItem {
  name: string;
  href: string;
}

export interface NavItem {
  name: string;
  icon: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: DropdownItem[];
}

const navLinks: NavItem[] = [
    {
        name: "Dashboard",
        icon: "dashboard",
        href: "/dashboard",
        hasDropdown: true,
        dropdownItems: [
            { name: "Resumen", href: "/dashboard" },
            { name: "Cargabilidad", href: "/dashboard/cargabilidad" },
            { name: "Retroalimentación", href: "/dashboard/retroalimentacion" }
        ]
    },
    {
        name: "Proyectos",
        icon: "projects",
        href: "/dashboard/proyectos",
        hasDropdown: true,
        dropdownItems: [
            { name: "Activos", href: "/dashboard/proyectos" },
            { name: "Archivados", href: "/dashboard/proyectos/archivados" }
        ]
    },
    {
        name: "Calendario",
        icon: "calendar",
        href: "/dashboard/calendario",
        hasDropdown: false
    },
    {
        name: "Perfil",
        icon: "profile",
        href: "/dashboard/perfil",
        hasDropdown: false
    },
]

export {navLinks}

// Shared data for user profile and calendar events

export const userData = {
  name: "Carlos Rodríguez",
  title: "Senior Software Engineer",
  location: "Madrid, España",
  email: "carlos.rodriguez@accenture.com",
  phone: "+34 612 345 678",
  bio: "Ingeniero de software con más de 7 años de experiencia en desarrollo fullstack. Especializado en React, Node.js y arquitecturas cloud.",
  avatar: "/profile_image.png", 
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

export const colorClasses: Record<string, { bg: string, light: string, border: string, text: string }> = {
  emerald: { 
    bg: "bg-emerald-500", 
    light: "bg-emerald-50", 
    border: "border-emerald-500",
    text: "text-emerald-700"
  },
  blue: { 
    bg: "bg-blue-500", 
    light: "bg-blue-50", 
    border: "border-blue-500",
    text: "text-blue-700"
  },
  purple: { 
    bg: "bg-purple-500", 
    light: "bg-purple-50", 
    border: "border-purple-500",
    text: "text-purple-700"
  },
  accenture: { 
    bg: "bg-[#A100FF]", 
    light: "bg-[#A100FF20]", 
    border: "border-[#A100FF]",
    text: "text-[#A100FF]"
  }
};