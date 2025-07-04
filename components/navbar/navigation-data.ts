// Define types for navigation items
export interface DropdownItem {
  name: string;
  href: string;
  requiresAdmin?: boolean;
  requiresProjectLead?: boolean;
  requiresPeopleLead?: boolean;
  requiresProjectManager?: boolean;
}

export interface NavItem {
  name: string;
  icon: string;
  href: string;
  hasDropdown: boolean;
  requiresAdmin?: boolean;
  requiresProjectLead?: boolean;
  requiresPeopleLead?: boolean;
  requiresProjectManager?: boolean;
  dropdownItems?: DropdownItem[];
}

export const navLinks: NavItem[] = [
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
      { name: "Archivados", href: "/dashboard/proyectos/archivados" },
      { name: "Project Lead", href: "/dashboard/proyectos/project-lead", requiresProjectLead: true },
      { name: "People Lead", href: "/dashboard/proyectos/people-lead", requiresPeopleLead: true },
      { name: "Project Manager", href: "/dashboard/proyectos/project-manager", requiresProjectManager: true }
    ]
  },
  {
    name: "Trayectoria",
    icon: "certificates",
    href: "/dashboard/trayectoria",
    hasDropdown: false
  },
  {
    name: "Notas",
    icon: "notes",
    href: "/dashboard/notas",
    hasDropdown: false
  },
  {
    name: "Perfil",
    icon: "profile",
    href: "/dashboard/perfil",
    hasDropdown: false
  },
  {
    name: "Admin",
    icon: "settings",
    href: "/dashboard/admin",
    hasDropdown: false,
    requiresAdmin: true
  }
];
