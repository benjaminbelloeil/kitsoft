// Main entry point for SOFT agent certificate path optimization system

import { OptimizationRequest, PathOptimizationResult, SOFTAgentWeights } from '@/interfaces/soft-agent';

export { SOFTAgentSimulation } from './simulation';
export { SOFTSelectionAgent } from './soft-selection-agent';
export { CertificateRanker } from './ranking';
export { CertificateAssigner } from './assigner';
export { softAgentDatabase } from '../database/soft-agent-db';

// Export types
export type {
  SOFTAgentWeights,
  Certificate,
  CareerPath,
  CertificateSkill,
  RequiredPathSkill,
  LearningLevel,
  PathOptimizationResult,
  AgentEvaluationResult,
  CertificateRanking,
  OptimizationRequest,
  SOFTAgentCache,
  SOFTDatabaseFunctions,
  ScoreBreakdown
} from '@/interfaces/soft-agent';

// Convenience function for quick optimization
export async function optimizeLearningPath(
  usuarioId: string,
  trayectoriaId: string,
  options?: {
    numNiveles?: number;
    maxCertificadosPorNivel?: number;
    considerarTiempo?: boolean;
    considerarCosto?: boolean;
  }
): Promise<PathOptimizationResult> {
  const { SOFTAgentSimulation } = await import('./simulation');
  const { softAgentDatabase } = await import('../database/soft-agent-db');
  
  const simulation = new SOFTAgentSimulation(softAgentDatabase);
  
  const request: OptimizationRequest = {
    usuario_id: usuarioId,
    trayectoria_id: trayectoriaId,
    num_niveles: options?.numNiveles || 5,
    max_certificados_por_nivel: options?.maxCertificadosPorNivel || 4,
    considerar_tiempo: options?.considerarTiempo ?? true,
    considerar_costo: options?.considerarCosto ?? true
  };
  
  return simulation.optimizeCertificatePath(request);
}

// Default weights configuration
export const DEFAULT_SOFT_WEIGHTS: SOFTAgentWeights = {
  // Skill coverage and relevance (40%)
  skill_coverage: 0.15,
  skill_relevance: 0.15,
  skill_depth: 0.10,

  // Certificate properties (30%)
  difficulty: 0.10,
  prerequisites: 0.10,
  duration: 0.10,

  // Path optimization (20%)
  path_coherence: 0.08,
  level_distribution: 0.06,
  progression_logic: 0.06,

  // Strategic value (10%)
  market_demand: 0.05,
  career_impact: 0.05
};

// Utility function to validate optimization request
export function validateOptimizationRequest(request: Partial<OptimizationRequest>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!request.usuario_id) {
    errors.push('usuario_id is required');
  }
  
  if (!request.trayectoria_id) {
    errors.push('trayectoria_id is required');
  }
  
  if (request.num_niveles && (request.num_niveles < 2 || request.num_niveles > 10)) {
    errors.push('num_niveles must be between 2 and 10');
  }
  
  if (request.max_certificados_por_nivel && request.max_certificados_por_nivel < 1) {
    errors.push('max_certificados_por_nivel must be at least 1');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Utility function to format optimization results for display
export function formatOptimizationResult(result: PathOptimizationResult): {
  summary: string;
  details: {
    totalCertificates: number;
    averageCertificatesPerLevel: number;
    estimatedTimeMonths: number;
    estimatedCostUSD: number;
    optimizationScore: string;
  };
  levels: Array<{
    level: number;
    name: string;
    certificateCount: number;
    description?: string;
  }>;
} {
  const totalCertificates = result.niveles.reduce((sum, level) => sum + level.certificados.length, 0);
  const avgPerLevel = totalCertificates / result.niveles.length;
  
  return {
    summary: `Optimized learning path with ${totalCertificates} certificates across ${result.niveles.length} levels`,
    details: {
      totalCertificates,
      averageCertificatesPerLevel: Math.round(avgPerLevel * 10) / 10,
      estimatedTimeMonths: Math.round((result.tiempo_estimado || 0) / 40), // Assuming 40 hours per month
      estimatedCostUSD: result.costo_estimado || 0,
      optimizationScore: `${Math.round(result.score_total * 100)}%`
    },
    levels: result.niveles.map(level => ({
      level: level.nivel,
      name: level.nombre,
      certificateCount: level.certificados.length,
      description: level.descripcion
    }))
  };
}
