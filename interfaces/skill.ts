export interface Skill {
  ID_Skill?: string;
  Nombre: string;
  ID_Usuario?: string;
  Nivel?: number;
  Categoria?: string;
}

export interface SkillsSectionProps {
  initialSkills: string[];
}
