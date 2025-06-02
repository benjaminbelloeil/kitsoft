/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// Main simulation logic for certificate path optimization using multiple SOFT agents

import { SOFTSelectionAgent } from './soft-selection-agent';
import { softAgentDatabase } from '../database/soft-agent-db';
import type { 
  SOFTAgentWeights, 
  PathOptimizationResult,
  Certificate,
  CareerPath,
  LearningLevel,
  OptimizationRequest,
  SOFTAgentCache,
  SOFTDatabaseFunctions 
} from '@/interfaces/soft-agent';

// Update the SOFTDatabaseFunctions type locally if it can't be modified in the original file
declare module '@/interfaces/soft-agent' {
  interface SOFTDatabaseFunctions {
    getUserSkillLevels?: (usuarioId: string) => Promise<Map<string, number>>;
    getMarketDemandData?: (params: any[]) => Promise<Map<string, number>>;
  }
}

// Default weights for the SOFT scoring system
const DEFAULT_SOFT_WEIGHTS: SOFTAgentWeights = {
  // Skill coverage and relevance (40%)
  skill_coverage: 0.15,        // How well certificate covers required skills
  skill_relevance: 0.15,       // Relevance of certificate skills to career path
  skill_depth: 0.10,           // Depth of skill coverage (level matching)

  // Certificate properties (30%)
  difficulty: 0.10,            // Certificate difficulty level
  prerequisites: 0.10,         // Prerequisites fulfillment
  duration: 0.10,              // Time to complete consideration

  // Path optimization (20%)
  path_coherence: 0.08,        // How well certificate fits in learning path
  level_distribution: 0.06,    // Optimal distribution across levels
  progression_logic: 0.06,     // Logical skill progression

  // Strategic value (10%)
  market_demand: 0.05,         // Industry demand for certificate
  career_impact: 0.05          // Career advancement potential
};

class SOFTCache implements SOFTAgentCache {
  public paths = new Map();
  public certificates = new Map();
  public skills = new Map();

  async getOrFetch<T>(key: string, fetchFunc: () => Promise<T>): Promise<T> {
    if (!this.paths.has(key) && !this.certificates.has(key) && !this.skills.has(key)) {
      const result = await fetchFunc();
      if (key.startsWith('paths_')) this.paths.set(key, result);
      else if (key.startsWith('certificates_')) this.certificates.set(key, result);
      else if (key.startsWith('skills_')) this.skills.set(key, result);
      return result;
    }
    
    if (key.startsWith('paths_')) return this.paths.get(key);
    if (key.startsWith('certificates_')) return this.certificates.get(key);
    if (key.startsWith('skills_')) return this.skills.get(key);
    
    throw new Error(`Cache key ${key} not found`);
  }

  clear(): void {
    this.paths.clear();
    this.certificates.clear();
    this.skills.clear();
  }
}

export class SOFTAgentSimulation {
  private agents: SOFTSelectionAgent[] = [];
  private cache: SOFTCache = new SOFTCache();
  private database: SOFTDatabaseFunctions;

  constructor(database: SOFTDatabaseFunctions = softAgentDatabase) {
    this.database = database;
    this.initializeAgents();
  }

  /**
   * Initialize 10 SOFT agents with slightly different weight preferences
   */
  private initializeAgents(): void {
    for (let i = 0; i < 10; i++) {
      const agentWeights = this.generateAgentWeights(i);
      this.agents.push(new SOFTSelectionAgent(i + 1, agentWeights));
    }
  }

  /**
   * Generate specialized weights for each agent
   */
  private generateAgentWeights(agentIndex: number): SOFTAgentWeights {
    const baseWeights = { ...DEFAULT_SOFT_WEIGHTS };
    
    // Create agent specializations
    switch (agentIndex % 5) {
      case 0: // Skill Coverage Specialist
        baseWeights.skill_coverage *= 1.3;
        baseWeights.skill_relevance *= 1.2;
        baseWeights.difficulty *= 0.8;
        break;
      
      case 1: // Progression Logic Specialist  
        baseWeights.progression_logic *= 1.5;
        baseWeights.level_distribution *= 1.4;
        baseWeights.path_coherence *= 1.3;
        break;
      
      case 2: // Difficulty Balance Specialist
        baseWeights.difficulty *= 1.4;
        baseWeights.prerequisites *= 1.3;
        baseWeights.skill_depth *= 1.2;
        break;
      
      case 3: // Market Strategy Specialist
        baseWeights.market_demand *= 1.6;
        baseWeights.career_impact *= 1.4;
        baseWeights.skill_relevance *= 1.1;
        break;
      
      case 4: // Efficiency Specialist
        baseWeights.duration *= 1.4;
        baseWeights.path_coherence *= 1.2;
        baseWeights.prerequisites *= 1.1;
        break;
    }

    return this.normalizeWeights(baseWeights);
  }

  /**
   * Normalize weights to ensure they sum to 1
   */
  private normalizeWeights(weights: SOFTAgentWeights): SOFTAgentWeights {
    const total = Object.values(weights).reduce((sum, weight) => sum + weight, 0);
    
    return Object.fromEntries(
        Object.entries(weights).map(([key, value]) => [key, value / total])
    ) as unknown as SOFTAgentWeights;
  }

  /**
   * Main simulation function - optimize certificate path using all agents
   */
  async optimizeCertificatePath(request: OptimizationRequest): Promise<PathOptimizationResult> {
    const startTime = Date.now();

    // Load required data
    const [certificates, careerPath, userSkillLevels, userCertificates, marketDemand] = await Promise.all([
      this.getCertificatesForOptimization(),
      this.getCareerPath(request.trayectoria_id),
      this.getUserSkillLevels(request.usuario_id),
      this.getUserCertificates(request.usuario_id),
      this.getMarketDemandData(request.trayectoria_id)
    ]);

    // Run all agents in parallel
    const agentResults = await Promise.all(
      this.agents.map(agent => 
        agent.analyzeCertificatesForPath(
          certificates,
          careerPath,
          request,
          userSkillLevels,
          userCertificates,
          marketDemand
        )
      )
    );

    // Aggregate results from all agents
    const optimizedPath = this.aggregateAgentResults(agentResults, careerPath, request);

    // Calculate final metrics
    optimizedPath.num_evaluaciones = agentResults.reduce(
      (sum, result) => sum + result.evaluation.length, 0
    );

    const endTime = Date.now();
    console.log(`SOFT optimization completed in ${endTime - startTime}ms`);

    // Save optimization result
    await this.database.savePathOptimization(optimizedPath);

    return optimizedPath;
  }

  /**
   * Aggregate results from all agents using consensus and voting
   */
  private aggregateAgentResults(
    agentResults: any[],
    careerPath: CareerPath,
    request: OptimizationRequest
  ): PathOptimizationResult {
    // Collect all unique certificates suggested by agents
    const allCertificates = new Map<string, { 
      frequency: number; 
      avgScore: number; 
      levels: number[]; 
      certificate: Certificate;
    }>();

    // Aggregate certificate evaluations
    agentResults.forEach(result => {
      result.evaluation.forEach((evalItem: any) => {
        const certId = evalItem.certificado.id_certificado;
        
        if (!allCertificates.has(certId)) {
          allCertificates.set(certId, {
            frequency: 0,
            avgScore: 0,
            levels: [],
            certificate: evalItem.certificado
          });
        }
        
        const certData = allCertificates.get(certId)!;
        certData.frequency++;
        certData.avgScore += evalItem.score;
        certData.levels.push(evalItem.nivel_asignado);
      });
    });

    // Calculate consensus certificates (appeared in multiple agent solutions)
    const consensusCertificates = Array.from(allCertificates.entries())
      .filter(([_, data]) => data.frequency >= 3) // Minimum 3 agents must agree
      .map(([certId, data]) => ({
        certId,
        avgScore: data.avgScore / data.frequency,
        consensusLevel: this.calculateConsensusLevel(data.levels),
        frequency: data.frequency,
        certificate: data.certificate
      }))
      .sort((a, b) => b.avgScore - a.avgScore);

    // Create final level structure
    const numLevels = request.num_niveles || 5;
    const maxPerLevel = request.max_certificados_por_nivel || 4;
    const finalLevels = this.createFinalLevelStructure(
      consensusCertificates, 
      numLevels, 
      maxPerLevel
    );

    // Calculate aggregate score
    const totalScore = this.calculateAggregateScore(agentResults, finalLevels);

    // Calculate time and cost estimates
    const { timeEstimate, costEstimate } = this.calculateEstimates(finalLevels, allCertificates);

    return {
      trayectoria_id: request.trayectoria_id,
      trayectoria_nombre: careerPath.nombre,
      niveles: finalLevels,
      score_total: totalScore,
      num_evaluaciones: 0, // Will be set by caller
      tiempo_estimado: timeEstimate,
      costo_estimado: costEstimate
    };
  }

  /**
   * Calculate consensus level for a certificate based on agent votes
   */
  private calculateConsensusLevel(levels: number[]): number {
    if (levels.length === 0) return 1;
    
    // Use weighted average, giving more weight to frequent levels
    const levelCounts = new Map<number, number>();
    levels.forEach(level => {
      levelCounts.set(level, (levelCounts.get(level) || 0) + 1);
    });
    
    // Find mode (most frequent level)
    let modeLevel = 1;
    let maxCount = 0;
    levelCounts.forEach((count, level) => {
      if (count > maxCount) {
        maxCount = count;
        modeLevel = level;
      }
    });
    
    return modeLevel;
  }

  /**
   * Create final level structure from consensus certificates
   */
  private createFinalLevelStructure(
    consensusCertificates: any[], 
    numLevels: number, 
    maxPerLevel: number
  ): LearningLevel[] {
    const levels: LearningLevel[] = Array.from({ length: numLevels }, (_, index) => ({
      nivel: index + 1,
      nombre: this.getLevelName(index + 1),
      descripcion: this.getLevelDescription(index + 1),
      certificados: [],
      prerequisitos: index > 0 ? [index] : undefined
    }));

    // Assign certificates to levels based on consensus
    for (const cert of consensusCertificates) {
      const targetLevel = cert.consensusLevel;
      const levelIndex = targetLevel - 1;
      
      if (levelIndex >= 0 && levelIndex < levels.length) {
        const level = levels[levelIndex];
        if (level.certificados.length < maxPerLevel) {
          level.certificados.push(cert.certId);
        } else {
          // Try adjacent levels
          this.tryAdjacentLevelPlacement(cert.certId, levels, targetLevel, maxPerLevel);
        }
      }
    }

    return levels;
  }

  /**
   * Try to place certificate in adjacent levels if primary is full
   */
  private tryAdjacentLevelPlacement(
    certId: string, 
    levels: LearningLevel[], 
    targetLevel: number, 
    maxPerLevel: number
  ): boolean {
    const alternatives = [targetLevel - 1, targetLevel + 1, targetLevel - 2, targetLevel + 2];
    
    for (const altLevel of alternatives) {
      const levelIndex = altLevel - 1;
      if (levelIndex >= 0 && levelIndex < levels.length) {
        const level = levels[levelIndex];
        if (level.certificados.length < maxPerLevel) {
          level.certificados.push(certId);
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Calculate aggregate optimization score
   */
  private calculateAggregateScore(agentResults: any[], finalLevels: LearningLevel[]): number {
    // Average the total scores from all agents
    const agentScores = agentResults.map(result => result.metadata.totalScore);
    const avgAgentScore = agentScores.reduce((sum, score) => sum + score, 0) / agentScores.length;
    
    // Bonus for consensus (more agents agreeing)
    const totalCertificates = finalLevels.reduce((sum, level) => sum + level.certificados.length, 0);
    const consensusBonus = totalCertificates > 0 ? Math.min(0.1, totalCertificates / 20) : 0;
    
    return Math.min(1, avgAgentScore + consensusBonus);
  }

  /**
   * Calculate time and cost estimates for the learning path
   */
  private calculateEstimates(finalLevels: LearningLevel[], allCertificates: Map<string, any>): {
    timeEstimate: number;
    costEstimate: number;
  } {
    let totalTime = 0;
    let totalCost = 0;
    
    finalLevels.forEach(level => {
      level.certificados.forEach(certId => {
        const certData = allCertificates.get(certId);
        if (certData?.certificate) {
          totalTime += certData.certificate.duracion_estimada || 40; // Default 40 hours
          totalCost += certData.certificate.costo || 500; // Default $500
        }
      });
    });
    
    return {
      timeEstimate: Math.round(totalTime),
      costEstimate: Math.round(totalCost)
    };
  }

  /**
   * Helper methods for level names and descriptions
   */
  private getLevelName(level: number): string {
    const names = ['Fundamentals', 'Intermediate', 'Advanced', 'Expert', 'Specialist'];
    return names[level - 1] || `Level ${level}`;
  }

  private getLevelDescription(level: number): string {
    const descriptions = [
      'Foundation skills and basic concepts',
      'Building on fundamentals with practical applications',
      'Advanced techniques and complex problem solving',
      'Expert-level skills and leadership capabilities',
      'Specialized knowledge and cutting-edge practices'
    ];
    return descriptions[level - 1] || `Learning level ${level}`;
  }

  /**
   * Data loading methods with caching
   */
  private async getCertificatesForOptimization(): Promise<Certificate[]> {
    return this.cache.getOrFetch('certificates_all', () => this.database.getCertificadosDisponibles());
  }

  private async getCareerPath(trayectoriaId: string): Promise<CareerPath> {
    const paths = await this.cache.getOrFetch(`paths_${trayectoriaId}`, () => this.database.getTrayectorias());
    const path = paths.find((p: CareerPath) => p.id_trayectoria === trayectoriaId);
    if (!path) throw new Error(`Career path ${trayectoriaId} not found`);
    return path;
  }

  private async getUserSkillLevels(usuarioId: string): Promise<Map<string, number>> {
    return this.cache.getOrFetch(`skills_${usuarioId}`, () => 
      this.database.getUserSkillLevels ? this.database.getUserSkillLevels(usuarioId) : Promise.resolve(new Map())
    );
  }

  private async getUserCertificates(usuarioId: string): Promise<string[]> {
    return this.cache.getOrFetch(`user_certs_${usuarioId}`, () => this.database.getCertificadosUsuario(usuarioId));
  }

  private async getMarketDemandData(trayectoriaId: string): Promise<Map<string, number>> {
    return this.cache.getOrFetch(`market_${trayectoriaId}`, () => 
      this.database.getMarketDemandData ? this.database.getMarketDemandData([]) : Promise.resolve(new Map())
    );
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get simulation statistics
   */
  getSimulationStats(): { agentCount: number; cacheSize: number } {
    return {
      agentCount: this.agents.length,
      cacheSize: this.cache.paths.size + this.cache.certificates.size + this.cache.skills.size
    };
  }
}
