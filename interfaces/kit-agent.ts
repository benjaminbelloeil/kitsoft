// Agent system interfaces for project team assignment

export interface AgentWeights {
  // Experience and trajectory (30%)
  antiguedad: number;              // Time in company
  proyectos_completados: number;   // Number of completed projects
  cliente_prev: number;            // Previous client experience

  // Technical skills (40%)
  match_habilidades: number;       // Base skill matching
  nivel_experiencia: number;       // Experience level in required skills
  habilidades_complementarias: number; // Additional relevant skills

  // Role and specialization (20%)
  rol_similar: number;             // Similar role experience
  certificaciones: number;         // Relevant certifications

  // Versatility (10%)
  versatilidad: number;           // Total number of skills
  repeticion_habilidades: number;  // Skills validated in multiple sources
}

export interface EmployeeSkill {
  id_habilidad: string;
  nivel_experiencia: number;
  validado?: boolean;
  origen?: string;
  fuentes?: number;
}

export interface RequiredSkill {
  id_habilidad: string;
  nivel_requerido: number;
  peso?: number;
}

export interface ProjectRole {
  id_rol: string;
  nombre: string;
  descripcion?: string;
  habilidades_requeridas: RequiredSkill[];
  id_cliente?: string;
}

export interface EmployeeData {
  id_usuario: string;
  nombre: string;
  apellido?: string;
  email: string;
  KIT: boolean;
  fecha_ingreso?: string;
  activo: boolean;
  foto_url?: string;
}

export interface EmployeeProject {
  id_proyecto: string;
  id_cliente?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
}

export interface EmployeeRole {
  id_rol: string;
  nombre?: string;
}

export interface AssignmentResult {
  rol_id: string;
  rol_nombre: string;
  empleado_id: string;
  empleado_nombre: string;
  score: number;
  num_evaluaciones: number;
}

export interface AgentEvaluationResult {
  empleado: EmployeeData;
  score: number;
}

export interface ScoreBreakdown {
  antiguedad?: number;
  proyectos?: number;
  cliente?: number;
  match_base?: number;
  niveles?: number;
  complementarias?: number;
  rol?: number;
  certificaciones?: number;
  versatilidad?: number;
  repeticion?: number;
}

export interface DatabaseFunctions {
  getRolesProyecto: (idProyecto: string) => Promise<ProjectRole[]>;
  getEmpleadosDisponibles: () => Promise<EmployeeData[]>;
  getProyectosUsuario: (usuarioId: string) => Promise<EmployeeProject[]>;
  getHabilidadesUsuario: (usuarioId: string) => Promise<EmployeeSkill[]>;
  getHabilidadesRequeridasPorRol: (idRol: string) => Promise<RequiredSkill[]>;
  getRolesUsuario: (usuarioId: string) => Promise<EmployeeRole[]>;
  getDetallesRol: (idRol: string) => Promise<ProjectRole | null>;
}

export interface AgentCache {
  roles: Map<string, EmployeeRole[]>;
  projects: Map<string, EmployeeProject[]>;
  skills: Map<string, EmployeeSkill[]>;
}

export interface SimulationRequest {
  id_proyecto: string;
}

export interface SimulationResponse {
  success: boolean;
  assignments: AssignmentResult[];
  tiempo_total: number;
  error?: string;
}
