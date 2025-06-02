/* eslint-disable @typescript-eslint/no-explicit-any */
// Main SOFT agent for certificate path optimization

import { CertificateRanker } from './ranking';
import { CertificateAssigner } from './assigner';
import type { 
  Certificate, 
  CareerPath, 
  RequiredPathSkill,
  CertificateRanking,
  LearningLevel,
  SOFTAgentWeights,
  AgentEvaluationResult,
  OptimizationRequest
} from '@/interfaces/soft-agent';

export class SOFTSelectionAgent {
  private ranker: CertificateRanker;
  private assigner: CertificateAssigner;
  private agentId: number;
  private weights: SOFTAgentWeights;

  constructor(agentId: number, weights: SOFTAgentWeights) {
    this.agentId = agentId;
    this.weights = weights;
    this.ranker = new CertificateRanker(weights);
    this.assigner = new CertificateAssigner();
  }

  /**
   * Analyzes certificates and generates a learning path optimization proposal
   */
  async analyzeCertificatesForPath(
    certificates: Certificate[],
    careerPath: CareerPath,
    request: OptimizationRequest,
    userSkillLevels: Map<string, number> = new Map(),
    userCertificates: string[] = [],
    marketDemand: Map<string, number> = new Map()
  ): Promise<{
    rankings: CertificateRanking[];
    levels: LearningLevel[];
    evaluation: AgentEvaluationResult[];
    metadata: {
      agentId: number;
      totalScore: number;
      certificatesAnalyzed: number;
      levelsGenerated: number;
      optimizationTime: number;
    };
  }> {
    const startTime = Date.now();

    // Add agent-specific variability to weights (like in the Python prototype)
    const adjustedWeights = this.introduceAgentVariability(this.weights);
    this.ranker = new CertificateRanker(adjustedWeights);

    // Rank certificates based on relevance to career path
    const rankings = this.ranker.rankCertificates(
      certificates,
      careerPath.habilidades_requeridas,
      userCertificates,
      userSkillLevels,
      marketDemand
    );

    // Assign certificates to learning levels
    const numLevels = request.num_niveles || 5;
    const maxPerLevel = request.max_certificados_por_nivel || 4;
    const levels = this.assigner.assignCertificatesToLevels(rankings, numLevels, maxPerLevel);

    // Generate individual evaluations for each certificate
    const evaluation = this.generateEvaluations(rankings, levels);

    // Calculate total optimization score
    const totalScore = this.calculateTotalOptimizationScore(rankings, levels, careerPath);

    const endTime = Date.now();

    return {
      rankings,
      levels,
      evaluation,
      metadata: {
        agentId: this.agentId,
        totalScore,
        certificatesAnalyzed: certificates.length,
        levelsGenerated: levels.length,
        optimizationTime: endTime - startTime
      }
    };
  }

  /**
   * Introduce agent-specific variability to weights (following Python prototype pattern)
   */
  private introduceAgentVariability(baseWeights: SOFTAgentWeights): SOFTAgentWeights {
    // Each agent has slight preferences (similar to Python prototype)
    const variability = 0.1; // 10% variability
    const skillFocus = Math.random(); // 0-1, determines if agent prefers coverage vs depth
    const difficultyTolerance = Math.random(); // 0-1, tolerance for difficult certificates
    
    return {
      // Skill coverage preferences
      skill_coverage: baseWeights.skill_coverage * (1 + (skillFocus - 0.5) * variability),
      skill_relevance: baseWeights.skill_relevance * (1 + (skillFocus - 0.3) * variability),
      skill_depth: baseWeights.skill_depth * (1 + (0.7 - skillFocus) * variability),

      // Certificate property preferences  
      difficulty: baseWeights.difficulty * (1 + (difficultyTolerance - 0.5) * variability),
      prerequisites: baseWeights.prerequisites * (1 + (0.6 - difficultyTolerance) * variability * 0.5),
      duration: baseWeights.duration,

      // Path optimization (less variable)
      path_coherence: baseWeights.path_coherence,
      level_distribution: baseWeights.level_distribution,
      progression_logic: baseWeights.progression_logic,

      // Strategic value
      market_demand: baseWeights.market_demand * (1 + (Math.random() - 0.5) * variability * 0.5),
      career_impact: baseWeights.career_impact
    };
  }

  /**
   * Generate individual evaluations for each certificate placement
   */
  private generateEvaluations(
    rankings: CertificateRanking[], 
    levels: LearningLevel[]
  ): AgentEvaluationResult[] {
    const evaluations: AgentEvaluationResult[] = [];
    
    // Create a map of certificate ID to assigned level
    const certToLevel = new Map<string, number>();
    levels.forEach(level => {
      level.certificados.forEach(certId => {
        certToLevel.set(certId, level.nivel);
      });
    });

    // Generate evaluation for each ranked certificate that was assigned
    for (const ranking of rankings) {
      const assignedLevel = certToLevel.get(ranking.certificado.id_certificado);
      
      if (assignedLevel !== undefined) {
        evaluations.push({
          certificado: ranking.certificado,
          nivel_asignado: assignedLevel,
          score: ranking.score,
          breakdown: this.calculateDetailedBreakdown(ranking, assignedLevel)
        });
      }
    }

    return evaluations.sort((a, b) => b.score - a.score);
  }

  /**
   * Calculate detailed score breakdown for a certificate
   */
  private calculateDetailedBreakdown(
    ranking: CertificateRanking, 
    assignedLevel: number
  ): any {
    // This would include the detailed scoring breakdown
    // For now, return a simplified version
    return {
      skill_coverage: ranking.cobertura * this.weights.skill_coverage,
      difficulty_score: (ranking.dificultad / 5) * this.weights.difficulty,
      level_appropriateness: this.calculateLevelAppropriatenessScore(ranking, assignedLevel),
      relevance_score: ranking.relevancia * this.weights.skill_relevance,
      total_score: ranking.score
    };
  }

  /**
   * Calculate how appropriate the level assignment is for the certificate
   */
  private calculateLevelAppropriatenessScore(ranking: CertificateRanking, assignedLevel: number): number {
    const levelDifference = Math.abs(assignedLevel - ranking.nivel_sugerido);
    return Math.max(0, 1 - (levelDifference * 0.2)); // Penalty for each level difference
  }

  /**
   * Calculate overall optimization score for the path
   */
  private calculateTotalOptimizationScore(
    rankings: CertificateRanking[], 
    levels: LearningLevel[], 
    careerPath: CareerPath
  ): number {
    if (rankings.length === 0) return 0;

    // 1. Average certificate quality score (40%)
    const avgCertificateScore = rankings.reduce((sum, r) => sum + r.score, 0) / rankings.length;
    
    // 2. Level distribution balance (20%)
    const levelBalance = this.calculateLevelBalance(levels);
    
    // 3. Skill coverage completeness (25%)
    const skillCoverage = this.calculateSkillCoverageCompleteness(rankings, careerPath.habilidades_requeridas);
    
    // 4. Progression logic score (15%)
    const progressionScore = this.calculateProgressionScore(levels, rankings);

    return (
      avgCertificateScore * 0.4 +
      levelBalance * 0.2 +
      skillCoverage * 0.25 +
      progressionScore * 0.15
    );
  }

  /**
   * Calculate how well balanced the certificate distribution is across levels
   */
  private calculateLevelBalance(levels: LearningLevel[]): number {
    const certificateCounts = levels.map(level => level.certificados.length);
    const totalCertificates = certificateCounts.reduce((sum, count) => sum + count, 0);
    
    if (totalCertificates === 0) return 0;
    
    const avgPerLevel = totalCertificates / levels.length;
    const variance = certificateCounts.reduce((sum, count) => 
      sum + Math.pow(count - avgPerLevel, 2), 0
    ) / levels.length;
    
    // Lower variance = better balance (normalized)
    return Math.max(0, 1 - (variance / (avgPerLevel + 1)));
  }

  /**
   * Calculate how well the selected certificates cover required skills
   */
  private calculateSkillCoverageCompleteness(
    rankings: CertificateRanking[], 
    requiredSkills: RequiredPathSkill[]
  ): number {
    const coveredSkills = new Set<string>();
    let totalSkillWeight = 0;
    let coveredSkillWeight = 0;

    // Calculate which skills are covered by selected certificates
    rankings.forEach(ranking => {
      ranking.certificado.habilidades.forEach(skill => {
        coveredSkills.add(skill.id_habilidad);
      });
    });

    // Calculate coverage weighted by skill importance
    requiredSkills.forEach(skill => {
      const weight = skill.peso || 1;
      totalSkillWeight += weight;
      
      if (coveredSkills.has(skill.id_habilidad)) {
        coveredSkillWeight += weight;
      }
    });

    return totalSkillWeight > 0 ? coveredSkillWeight / totalSkillWeight : 0;
  }

  /**
   * Calculate progression logic score across levels
   */
  private calculateProgressionScore(levels: LearningLevel[], rankings: CertificateRanking[]): number {
    if (levels.length < 2) return 1;

    const certMap = new Map<string, Certificate>();
    rankings.forEach(ranking => {
      certMap.set(ranking.certificado.id_certificado, ranking.certificado);
    });

    let progressionScore = 0;
    let comparisons = 0;

    for (let i = 1; i < levels.length; i++) {
      const currentLevel = levels[i];
      const previousLevel = levels[i - 1];
      
      if (currentLevel.certificados.length > 0 && previousLevel.certificados.length > 0) {
        const currentAvgDifficulty = this.calculateAverageDifficulty(currentLevel.certificados, certMap);
        const previousAvgDifficulty = this.calculateAverageDifficulty(previousLevel.certificados, certMap);
        
        // Score based on logical progression (current should be >= previous)
        if (currentAvgDifficulty >= previousAvgDifficulty) {
          progressionScore += 1;
        } else {
          progressionScore += Math.max(0, 1 - (previousAvgDifficulty - currentAvgDifficulty) / 2);
        }
        
        comparisons++;
      }
    }

    return comparisons > 0 ? progressionScore / comparisons : 1;
  }

  /**
   * Calculate average difficulty for certificates in a level
   */
  private calculateAverageDifficulty(certificateIds: string[], certMap: Map<string, Certificate>): number {
    if (certificateIds.length === 0) return 0;
    
    const totalDifficulty = certificateIds.reduce((sum, id) => {
      const cert = certMap.get(id);
      return sum + (cert?.dificultad || 3);
    }, 0);
    
    return totalDifficulty / certificateIds.length;
  }

  /**
   * Get agent information
   */
  getAgentInfo(): { id: number; weights: SOFTAgentWeights } {
    return {
      id: this.agentId,
      weights: this.weights
    };
  }
}
