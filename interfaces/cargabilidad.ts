
export interface Project {
  id_proyecto: string;
  titulo: string;
  name: string; // For backwards compatibility with existing components
  load: number; // Cargabilidad percentage (user_hours / total_project_hours * 100)
  deadline?: string;
  hoursPerWeek: number; // Calculated based on project duration
  color?: string | null; // Color del proyecto, opcional
  user_hours: number; // User's assigned hours for this project
  horas_totales: number; // Total project hours
  fecha_inicio: string;
  fecha_fin: string | null;
}
