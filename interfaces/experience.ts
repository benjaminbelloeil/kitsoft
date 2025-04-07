export interface Experience {
  ID_Experiencia?: string;
  ID_Usuario?: string;
  Empresa: string;
  Titulo: string;
  Descripcion: string;
  Fecha_Inicio: string;
  Fecha_Fin?: string | null;
  Ubicacion?: string;
  Actual?: boolean;
}

export interface ExperienceSectionProps {
  initialExperiences: Experience[];
}
