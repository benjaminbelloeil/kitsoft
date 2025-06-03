/* eslint-disable @typescript-eslint/no-explicit-any */
// SOFT Agent system interfaces for certificate path optimization

export interface SOFTAgentWeights {
  // Skill coverage and relevance (40%)
  skill_coverage: number;        // How well certificate covers required skills
  skill_relevance: number;       // Relevance of certificate skills to career path
  skill_depth: number;           // Depth of skill coverage (level matching)

  // Certificate properties (30%)
  difficulty: number;            // Certificate difficulty level
  prerequisites: number;         // Prerequisites fulfillment
  duration: number;              // Time to complete consideration

  // Path optimization (20%)
  path_coherence: number;        // How well certificate fits in learning path
  level_distribution: number;    // Optimal distribution across levels
  progression_logic: number;     // Logical skill progression

  // Strategic value (10%)
  market_demand: number;         // Industry demand for certificate
  career_impact: number;         // Career advancement potential
}

export interface CertificateSkill {
  id_habilidad: string;
  nivel_experiencia: number;
  peso?: number;
  es_prerequisito?: boolean;
}

export interface RequiredPathSkill {
  id_habilidad: string;
  nivel_requerido: number;
  peso?: number;
  prioridad?: number;
}

export interface Certificate {
  id_certificado: string;
  nombre: string;
  descripcion?: string;
  proveedor?: string;
  dificultad: number;            // Scale 1-5
  duracion_estimada?: number;    // Hours
  costo?: number;
  fecha_actualizacion?: string;
  activo: boolean;
  habilidades: CertificateSkill[];
}

export interface CareerPath {
  id_trayectoria: string;
  nombre: string;
  descripcion?: string;
  nivel_inicial: number;         // Starting level requirement
  nivel_final: number;           // Target level
  duracion_estimada?: number;    // Total months
  habilidades_requeridas: RequiredPathSkill[];
}

export interface LearningLevel {
  nivel: number;                 // 1-5 learning progression level
  nombre: string;                // e.g., "Fundamentals", "Intermediate", etc.
  descripcion?: string;
  certificados: string[];        // Certificate IDs assigned to this level
  prerequisitos?: number[];      // Previous levels required
}

export interface PathOptimizationResult {
  trayectoria_id: string;
  trayectoria_nombre: string;
  niveles: LearningLevel[];
  score_total: number;
  num_evaluaciones: number;
  tiempo_estimado?: number;      // Total completion time
  costo_estimado?: number;       // Total cost
}

export interface AgentEvaluationResult {
  certificado: Certificate;
  nivel_asignado: number;
  score: number;
  breakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  skill_coverage?: number;
  skill_relevance?: number;
  skill_depth?: number;
  difficulty?: number;
  prerequisites?: number;
  duration?: number;
  path_coherence?: number;
  level_distribution?: number;
  progression_logic?: number;
  market_demand?: number;
  career_impact?: number;
}

export interface SOFTAgentCache {
  paths: Map<string, any>;
  certificates: Map<string, any>;
  skills: Map<string, any>;
  getOrFetch<T>(key: string, fetchFunc: () => Promise<T>): Promise<T>;
}

export interface SOFTDatabaseFunctions {
  getTrayectorias: () => Promise<CareerPath[]>;
  getCertificadosDisponibles: () => Promise<Certificate[]>;
  getHabilidadesCertificado: (certificadoId: string) => Promise<CertificateSkill[]>;
  getHabilidadesRequeridas: (trayectoriaId: string) => Promise<RequiredPathSkill[]>;
  getCertificadosUsuario: (usuarioId: string) => Promise<string[]>;
  savePathOptimization: (result: PathOptimizationResult) => Promise<void>;
}

export interface CertificateRanking {
  certificado: Certificate;
  score: number;
  cobertura: number;
  dificultad: number;
  relevancia: number;
  nivel_sugerido: number;
}

export interface OptimizationRequest {
  usuario_id: string;
  trayectoria_id: string;
  num_niveles?: number;          // Default: 5
  max_certificados_por_nivel?: number; // Default: 3-4
  considerar_tiempo?: boolean;   // Consider duration in optimization
  considerar_costo?: boolean;    // Consider cost in optimization
}
