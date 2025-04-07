export interface Project {
  ID_Proyecto?: string;
  name: string;
  cargabilidad: number;
  color: string;
  ID_Usuario?: string;
  Fecha_Inicio?: string;
  Fecha_Fin?: string | null;
  Descripcion?: string;
  Rol?: string;
  Cliente?: string;
  Tecnologias?: string[];
}

export interface CargabilidadSectionProps {
  projects: Project[];
}
