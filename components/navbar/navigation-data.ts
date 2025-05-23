// Define types for navigation items
export interface DropdownItem {
  name: string;
  href: string;
  requiresAdmin?: boolean;
  requiresProjectLead?: boolean;
  requiresProjectManager?: boolean;
}

export interface NavItem {
  name: string;
  icon: string;
  href: string;
  hasDropdown: boolean;
  requiresAdmin?: boolean;
  requiresProjectLead?: boolean;
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
      { name: "Lead", href: "/dashboard/proyectos/lead", requiresProjectLead: true },
      { name: "Manager", href: "/dashboard/proyectos/manager", requiresProjectManager: true }
    ]
  },
  {
    name: "Trayectoria",
    icon: "certificates",
    href: "/dashboard/cursos",
    hasDropdown: false
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
  {
    name: "Admin",
    icon: "settings",
    href: "/dashboard/admin",
    hasDropdown: false,
    requiresAdmin: true
  }
];
