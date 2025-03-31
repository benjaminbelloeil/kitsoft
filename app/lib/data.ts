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
            { name: "Overview", href: "/dashboard" },
            { name: "Analytics", href: "/dashboard/analytics" },
            { name: "Reports", href: "/dashboard/reports" }
        ]
    },
    {
        name: "Proyectos",
        icon: "projects",
        href: "/dashboard/proyectos",
        hasDropdown: true,
        dropdownItems: [
            { name: "Active", href: "/dashboard/proyectos" },
            { name: "Archived", href: "/dashboard/proyectos/archived" }
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