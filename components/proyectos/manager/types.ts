export interface Client {
  id_cliente: string;
  nombre: string;
  direccion: string | null;
  telefono: string | null;
  correo: string | null;
  url_logo: string | null;
}

export interface Project {
  id_proyecto: string;
  titulo: string;
  descripcion: string | null;
  id_cliente: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  activo: boolean;
  horas_totales: number;
  cliente?: string; // For UI display - will be populated from a separate API call or state
}
