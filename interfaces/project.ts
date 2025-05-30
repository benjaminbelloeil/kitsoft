export interface Client {
  id_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  url_logo: string | null;
}

export interface ProjectTeamMember {
  id_usuario: string;
  nombre: string;
  apellido: string | null;
  email: string;
  foto_url: string | null;
  activo: boolean;
}

export interface Role {
  id_rol: string;
  nombre: string;
  descripcion: string | null;
}

export interface ProjectUser {
  id_usuario_proyecto: string;
  id_usuario: string;
  id_proyecto: string;
  id_rol: string;
  titulo?: string;
  horas: number;
  nombre?: string; // User name for display
  apellido?: string; // User last name for display
}

export interface Project {
  id_proyecto: string;
  titulo: string;
  descripcion: string | null;
  id_cliente: string;
  id_projectlead?: string; // Project Lead ID
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  horas_totales: number;
  cliente?: string; // For UI display - will be populated from a separate API call or state
  project_lead?: ProjectLead | null; // Project Lead details for display
  usuarios?: ProjectUser[]; // Assigned users
  roles?: Role[]; // Available roles for this project
}

export interface ProjectLead {
  id_usuario: string;
  nombre: string;
  apellido: string | null;
  titulo: string | null;
  url_avatar: string | null;
}
