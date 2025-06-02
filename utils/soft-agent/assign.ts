// Simple assignment function for SOFT agent certificate path optimization

import { SOFTAgentSimulation } from './simulation';
import { softAgentDatabase } from '../database/soft-agent-db';
import type { OptimizationRequest, PathOptimizationResult } from '@/interfaces/soft-agent';

/**
 * Main assignment function for certificate path optimization
 * This follows the same pattern as the KIT agent's assign function
 */
export async function assignCertificatePath(
  usuarioId: string,
  trayectoriaId: string,
  options?: {
    numNiveles?: number;
    maxCertificadosPorNivel?: number;
    considerarTiempo?: boolean;
    considerarCosto?: boolean;
  }
): Promise<PathOptimizationResult> {
  
  console.log(`Starting SOFT certificate path assignment for user: ${usuarioId}, path: ${trayectoriaId}`);
  
  try {
    // Create optimization request
    const request: OptimizationRequest = {
      usuario_id: usuarioId,
      trayectoria_id: trayectoriaId,
      num_niveles: options?.numNiveles || 5,
      max_certificados_por_nivel: options?.maxCertificadosPorNivel || 4,
      considerar_tiempo: options?.considerarTiempo ?? true,
      considerar_costo: options?.considerarCosto ?? true
    };

    // Initialize and run simulation
    const simulation = new SOFTAgentSimulation(softAgentDatabase);
    const result = await simulation.optimizeCertificatePath(request);
    
    console.log(`SOFT assignment completed successfully:`);
    console.log(`- Generated ${result.niveles.length} learning levels`);
    console.log(`- Total certificates: ${result.niveles.reduce((sum, level) => sum + level.certificados.length, 0)}`);
    console.log(`- Optimization score: ${Math.round(result.score_total * 100)}%`);
    console.log(`- Estimated time: ${result.tiempo_estimado} hours`);
    console.log(`- Estimated cost: $${result.costo_estimado}`);
    
    return result;
    
  } catch (error) {
    console.error('Error in SOFT certificate path assignment:', error);
    throw new Error(`Failed to assign certificate path: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Batch assignment for multiple users and paths
 */
export async function batchAssignCertificatePaths(
  assignments: Array<{
    usuarioId: string;
    trayectoriaId: string;
    options?: {
      numNiveles?: number;
      maxCertificadosPorNivel?: number;
      considerarTiempo?: boolean;
      considerarCosto?: boolean;
    };
  }>
): Promise<PathOptimizationResult[]> {
  
  console.log(`Starting batch SOFT assignment for ${assignments.length} user-path combinations`);
  
  const results: PathOptimizationResult[] = [];
  const simulation = new SOFTAgentSimulation(softAgentDatabase);
  
  for (const assignment of assignments) {
    try {
      const request: OptimizationRequest = {
        usuario_id: assignment.usuarioId,
        trayectoria_id: assignment.trayectoriaId,
        num_niveles: assignment.options?.numNiveles || 5,
        max_certificados_por_nivel: assignment.options?.maxCertificadosPorNivel || 4,
        considerar_tiempo: assignment.options?.considerarTiempo ?? true,
        considerar_costo: assignment.options?.considerarCosto ?? true
      };
      
      const result = await simulation.optimizeCertificatePath(request);
      results.push(result);
      
      console.log(`✓ Completed assignment for user ${assignment.usuarioId}, path ${assignment.trayectoriaId}`);
      
    } catch (error) {
      console.error(`✗ Failed assignment for user ${assignment.usuarioId}, path ${assignment.trayectoriaId}:`, error);
      // Continue with other assignments
    }
  }
  
  console.log(`Batch SOFT assignment completed: ${results.length}/${assignments.length} successful`);
  return results;
}

/**
 * Quick assignment with default settings (similar to KIT agent pattern)
 */
export async function quickAssignCertificatePath(
  usuarioId: string,
  trayectoriaId: string
): Promise<PathOptimizationResult> {
  return assignCertificatePath(usuarioId, trayectoriaId, {
    numNiveles: 5,
    maxCertificadosPorNivel: 3,
    considerarTiempo: true,
    considerarCosto: false
  });
}

/**
 * Assignment with focus on time optimization
 */
export async function assignCertificatePathTimeOptimized(
  usuarioId: string,
  trayectoriaId: string
): Promise<PathOptimizationResult> {
  return assignCertificatePath(usuarioId, trayectoriaId, {
    numNiveles: 4,
    maxCertificadosPorNivel: 2,
    considerarTiempo: true,
    considerarCosto: false
  });
}

/**
 * Assignment with focus on comprehensive coverage
 */
export async function assignCertificatePathComprehensive(
  usuarioId: string,
  trayectoriaId: string
): Promise<PathOptimizationResult> {
  return assignCertificatePath(usuarioId, trayectoriaId, {
    numNiveles: 5,
    maxCertificadosPorNivel: 5,
    considerarTiempo: false,
    considerarCosto: false
  });
}
