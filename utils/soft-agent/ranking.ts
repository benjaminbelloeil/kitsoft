// Certificate ranking utilities for SOFT agent system

import type { 
  Certificate, 
  RequiredPathSkill, 
  CertificateRanking, 
  SOFTAgentWeights,
  ScoreBreakdown 
} from '@/interfaces/soft-agent';

export class CertificateRanker {
  private weights: SOFTAgentWeights;

  constructor(weights: SOFTAgentWeights) {
    this.weights = weights;
  }

  /**
   * Ranks certificates based on their relevance to required skills and path optimization
   */
  rankCertificates(
    certificates: Certificate[],
    requiredSkills: RequiredPathSkill[],
    userCertificates: string[] = [],
    userSkillLevels: Map<string, number> = new Map(),
    marketDemand: Map<string, number> = new Map()
  ): CertificateRanking[] {
    const rankings: CertificateRanking[] = [];

    for (const certificate of certificates) {
      // Skip if user already has this certificate
      if (userCertificates.includes(certificate.id_certificado)) {
        continue;
      }

      const ranking = this.evaluateCertificate(
        certificate,
        requiredSkills,
        userSkillLevels,
        marketDemand
      );

      if (ranking.score > 0) {
        rankings.push(ranking);
      }
    }

    // Sort by score in descending order
    rankings.sort((a, b) => b.score - a.score);
    return rankings;
  }

  /**
   * Evaluates a single certificate against required skills
   */
  private evaluateCertificate(
    certificate: Certificate,
    requiredSkills: RequiredPathSkill[],
    userSkillLevels: Map<string, number>,
    marketDemand: Map<string, number>
  ): CertificateRanking {
    const breakdown: ScoreBreakdown = {};
    let totalScore = 0;
    let relevantSkillsCount = 0;
    let totalCoverage = 0;
    let totalDifficulty = 0;

    // 1. Skill coverage and relevance (40%)
    for (const certSkill of certificate.habilidades) {
      const requiredSkill = requiredSkills.find(rs => rs.id_habilidad === certSkill.id_habilidad);
      
      if (requiredSkill) {
        relevantSkillsCount++;
        
        // Skill coverage: how well the certificate level matches required level
        const levelMatch = Math.min(certSkill.nivel_experiencia, requiredSkill.nivel_requerido) / 
                          requiredSkill.nivel_requerido;
        totalCoverage += levelMatch * (requiredSkill.peso || 1);

        // Skill depth: progression from user's current level
        const userCurrentLevel = userSkillLevels.get(certSkill.id_habilidad) || 0;
        const skillGap = Math.max(0, certSkill.nivel_experiencia - userCurrentLevel);
        const depthScore = skillGap > 0 ? Math.min(skillGap / 2, 1) : 0.1; // Reward skill advancement
        
        totalDifficulty += depthScore;

        // Market demand consideration
        const demandScore = marketDemand.get(certSkill.id_habilidad) || 0.5;
        breakdown.market_demand = (breakdown.market_demand || 0) + demandScore;
      }
    }

    if (relevantSkillsCount === 0) {
      return {
        certificado: certificate,
        score: 0,
        cobertura: 0,
        dificultad: 0,
        relevancia: 0,
        nivel_sugerido: 1
      };
    }

    // Normalize coverage and depth scores
    breakdown.skill_coverage = (totalCoverage / relevantSkillsCount) * this.weights.skill_coverage;
    breakdown.skill_depth = (totalDifficulty / relevantSkillsCount) * this.weights.skill_depth;
    breakdown.skill_relevance = (relevantSkillsCount / requiredSkills.length) * this.weights.skill_relevance;

    // 2. Certificate properties (30%)
    breakdown.difficulty = this.calculateDifficultyScore(certificate.dificultad) * this.weights.difficulty;
    breakdown.prerequisites = this.calculatePrerequisiteScore(certificate, userSkillLevels) * this.weights.prerequisites;
    breakdown.duration = this.calculateDurationScore(certificate.duracion_estimada) * this.weights.duration;

    // 3. Path optimization scores (20%) - will be enhanced by level assignment logic
    breakdown.path_coherence = this.calculatePathCoherence(certificate, requiredSkills) * this.weights.path_coherence;
    breakdown.level_distribution = 0.5 * this.weights.level_distribution; // Base score, enhanced during assignment
    breakdown.progression_logic = this.calculateProgressionLogic(certificate, userSkillLevels) * this.weights.progression_logic;

    // 4. Strategic value (10%)
    breakdown.market_demand = (breakdown.market_demand || 0) / relevantSkillsCount * this.weights.market_demand;
    breakdown.career_impact = this.calculateCareerImpact(certificate, requiredSkills) * this.weights.career_impact;

    // Calculate total score
    totalScore = Object.values(breakdown).reduce((sum, score) => sum + (score || 0), 0);

    // Suggest level based on difficulty and user progression
    const suggestedLevel = this.calculateSuggestedLevel(certificate, userSkillLevels, requiredSkills);

    return {
      certificado: certificate,
      score: totalScore,
      cobertura: totalCoverage,
      dificultad: certificate.dificultad,
      relevancia: relevantSkillsCount,
      nivel_sugerido: suggestedLevel
    };
  }

  private calculateDifficultyScore(difficulty: number): number {
    // Normalize difficulty (1-5) to a score where moderate difficulty is optimal
    // Sweet spot around 3, with diminishing returns for very easy or very hard
    const normalized = difficulty / 5;
    return 1 - Math.abs(normalized - 0.6) / 0.6; // Peak at difficulty 3
  }

  private calculatePrerequisiteScore(certificate: Certificate, userSkillLevels: Map<string, number>): number {
    // Score based on how well user meets the certificate's skill prerequisites
    let prerequisitesMet = 0;
    let totalPrerequisites = 0;

    for (const skill of certificate.habilidades) {
      if (skill.es_prerequisito) {
        totalPrerequisites++;
        const userLevel = userSkillLevels.get(skill.id_habilidad) || 0;
        if (userLevel >= skill.nivel_experiencia * 0.7) { // 70% of required level
          prerequisitesMet++;
        }
      }
    }

    return totalPrerequisites > 0 ? prerequisitesMet / totalPrerequisites : 1;
  }

  private calculateDurationScore(duration?: number): number {
    if (!duration) return 0.5; // Neutral score if no duration info
    
    // Optimal duration range: 20-80 hours
    const normalizedDuration = Math.min(duration / 100, 1);
    return 1 - Math.abs(normalizedDuration - 0.5) / 0.5;
  }

  private calculatePathCoherence(certificate: Certificate, requiredSkills: RequiredPathSkill[]): number {
    // Score based on how many of the certificate's skills are actually required
    const relevantSkillsRatio = certificate.habilidades.filter(skill => 
      requiredSkills.some(rs => rs.id_habilidad === skill.id_habilidad)
    ).length / certificate.habilidades.length;

    return relevantSkillsRatio;
  }

  private calculateProgressionLogic(certificate: Certificate, userSkillLevels: Map<string, number>): number {
    // Score based on logical skill progression from user's current levels
    let progressionScore = 0;
    let skillsEvaluated = 0;

    for (const skill of certificate.habilidades) {
      const userLevel = userSkillLevels.get(skill.id_habilidad) || 0;
      const skillGap = skill.nivel_experiencia - userLevel;
      
      if (skillGap > 0 && skillGap <= 2) {
        // Optimal progression: 1-2 levels above current
        progressionScore += 1;
      } else if (skillGap > 2) {
        // Too big a jump, but still possible
        progressionScore += 0.5;
      } else {
        // At or below current level, minimal value
        progressionScore += 0.1;
      }
      
      skillsEvaluated++;
    }

    return skillsEvaluated > 0 ? progressionScore / skillsEvaluated : 0;
  }

  private calculateCareerImpact(certificate: Certificate, requiredSkills: RequiredPathSkill[]): number {
    // Score based on the highest priority skills covered
    let maxPriority = 0;
    
    for (const skill of certificate.habilidades) {
      const requiredSkill = requiredSkills.find(rs => rs.id_habilidad === skill.id_habilidad);
      if (requiredSkill && requiredSkill.prioridad) {
        maxPriority = Math.max(maxPriority, requiredSkill.prioridad);
      }
    }

    return maxPriority / 5; // Normalize assuming max priority is 5
  }

  private calculateSuggestedLevel(
    certificate: Certificate, 
    userSkillLevels: Map<string, number>, 
    requiredSkills: RequiredPathSkill[]
  ): number {
    // Base level on difficulty
    let suggestedLevel = Math.ceil(certificate.dificultad);

    // Adjust based on user's current skill levels
    let avgUserLevel = 0;
    let relevantSkillsCount = 0;

    for (const skill of certificate.habilidades) {
      const requiredSkill = requiredSkills.find(rs => rs.id_habilidad === skill.id_habilidad);
      if (requiredSkill) {
        const userLevel = userSkillLevels.get(skill.id_habilidad) || 0;
        avgUserLevel += userLevel;
        relevantSkillsCount++;
      }
    }

    if (relevantSkillsCount > 0) {
      avgUserLevel = avgUserLevel / relevantSkillsCount;
      
      // If user is advanced, certificate can be in higher levels
      if (avgUserLevel >= 3) {
        suggestedLevel = Math.min(5, suggestedLevel + 1);
      } else if (avgUserLevel <= 1) {
        // If user is beginner, place in lower levels
        suggestedLevel = Math.max(1, suggestedLevel - 1);
      }
    }

    return Math.max(1, Math.min(5, suggestedLevel));
  }
}
