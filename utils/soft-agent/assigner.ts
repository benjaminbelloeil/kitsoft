/* eslint-disable @typescript-eslint/no-unused-vars */
// Certificate assignment utilities for distributing certificates across learning levels

import type { 
  CertificateRanking, 
  LearningLevel, 
  Certificate,
} from '@/interfaces/soft-agent';

export class CertificateAssigner {
  
  /**
   * Assigns certificates to learning levels (1-5) based on difficulty and progression logic
   */
  assignCertificatesToLevels(
    rankedCertificates: CertificateRanking[],
    numLevels: number = 5,
    maxCertificatesPerLevel: number = 4
  ): LearningLevel[] {
    const levels: LearningLevel[] = this.initializeLevels(numLevels);
    
    // Filter and sort certificates by suggested level and score
    const sortedCertificates = rankedCertificates
      .filter(ranking => ranking.score > 0.3) // Minimum threshold
      .sort((a, b) => {
        // Primary sort: suggested level
        if (a.nivel_sugerido !== b.nivel_sugerido) {
          return a.nivel_sugerido - b.nivel_sugerido;
        }
        // Secondary sort: score (descending)
        return b.score - a.score;
      });

    // Assign certificates to levels
    for (const ranking of sortedCertificates) {
      const targetLevel = ranking.nivel_sugerido;
      const levelIndex = targetLevel - 1;
      
      if (levelIndex >= 0 && levelIndex < levels.length) {
        const currentLevel = levels[levelIndex];
        
        // Check if level has space
        if (currentLevel.certificados.length < maxCertificatesPerLevel) {
          currentLevel.certificados.push(ranking.certificado.id_certificado);
        } else {
          // Try to place in adjacent levels
          this.tryAlternativePlacement(ranking, levels, maxCertificatesPerLevel);
        }
      }
    }

    // Balance levels and ensure logical progression
    this.balanceLevels(levels, maxCertificatesPerLevel);
    this.ensureProgression(levels, sortedCertificates);
    
    return levels;
  }

  /**
   * Initialize learning levels with appropriate names and descriptions
   */
  private initializeLevels(numLevels: number): LearningLevel[] {
    const levelNames = [
      'Fundamentals',
      'Intermediate', 
      'Advanced',
      'Expert',
      'Specialist'
    ];

    const levelDescriptions = [
      'Foundation skills and basic concepts',
      'Building on fundamentals with practical applications',
      'Advanced techniques and complex problem solving',
      'Expert-level skills and leadership capabilities',
      'Specialized knowledge and cutting-edge practices'
    ];

    return Array.from({ length: numLevels }, (_, index) => ({
      nivel: index + 1,
      nombre: levelNames[index] || `Level ${index + 1}`,
      descripcion: levelDescriptions[index] || `Learning level ${index + 1}`,
      certificados: [],
      prerequisitos: index > 0 ? [index] : undefined
    }));
  }

  /**
   * Try to place certificate in adjacent levels if primary level is full
   */
  private tryAlternativePlacement(
    ranking: CertificateRanking,
    levels: LearningLevel[],
    maxCertificatesPerLevel: number
  ): boolean {
    const targetLevel = ranking.nivel_sugerido;
    
    // Try levels in order of preference: target-1, target+1, target-2, target+2, etc.
    const alternatives = this.getAlternativeLevels(targetLevel, levels.length);
    
    for (const altLevel of alternatives) {
      const levelIndex = altLevel - 1;
      if (levelIndex >= 0 && levelIndex < levels.length) {
        const level = levels[levelIndex];
        if (level.certificados.length < maxCertificatesPerLevel) {
          level.certificados.push(ranking.certificado.id_certificado);
          return true;
        }
      }
    }
    
    return false;
  }

  /**
   * Get alternative level placement options in order of preference
   */
  private getAlternativeLevels(targetLevel: number, maxLevels: number): number[] {
    const alternatives: number[] = [];
    
    for (let offset = 1; offset < maxLevels; offset++) {
      // Try lower level first (more conservative)
      if (targetLevel - offset >= 1) {
        alternatives.push(targetLevel - offset);
      }
      // Then try higher level
      if (targetLevel + offset <= maxLevels) {
        alternatives.push(targetLevel + offset);
      }
    }
    
    return alternatives;
  }

  /**
   * Balance certificate distribution across levels
   */
  private balanceLevels(levels: LearningLevel[], maxCertificatesPerLevel: number): void {
    const totalCertificates = levels.reduce((sum, level) => sum + level.certificados.length, 0);
    const avgPerLevel = Math.ceil(totalCertificates / levels.length);
    
    // Move certificates from overcrowded levels to underpopulated ones
    for (let i = 0; i < levels.length; i++) {
      const currentLevel = levels[i];
      
      if (currentLevel.certificados.length > maxCertificatesPerLevel) {
        const excess = currentLevel.certificados.length - maxCertificatesPerLevel;
        const toMove = currentLevel.certificados.splice(-excess, excess);
        
        // Try to redistribute to nearby levels
        this.redistributeCertificates(toMove, levels, i, maxCertificatesPerLevel);
      }
    }
  }

  /**
   * Redistribute certificates to nearby levels
   */
  private redistributeCertificates(
    certificates: string[],
    levels: LearningLevel[],
    currentLevelIndex: number,
    maxCertificatesPerLevel: number
  ): void {
    const redistribution = this.getRedistributionOrder(currentLevelIndex, levels.length);
    
    for (const certId of certificates) {
      let placed = false;
      
      for (const levelIndex of redistribution) {
        if (levels[levelIndex].certificados.length < maxCertificatesPerLevel) {
          levels[levelIndex].certificados.push(certId);
          placed = true;
          break;
        }
      }
      
      // If still not placed, force into the least populated level
      if (!placed) {
        const leastPopulated = levels.reduce((min, level, index) => 
          level.certificados.length < levels[min].certificados.length ? index : min, 0
        );
        levels[leastPopulated].certificados.push(certId);
      }
    }
  }

  /**
   * Get level redistribution order (prefer nearby levels)
   */
  private getRedistributionOrder(currentIndex: number, totalLevels: number): number[] {
    const order: number[] = [];
    
    for (let offset = 1; offset < totalLevels; offset++) {
      if (currentIndex + offset < totalLevels) {
        order.push(currentIndex + offset);
      }
      if (currentIndex - offset >= 0) {
        order.push(currentIndex - offset);
      }
    }
    
    return order;
  }

  /**
   * Ensure logical skill progression across levels
   */
  private ensureProgression(levels: LearningLevel[], rankedCertificates: CertificateRanking[]): void {
    // Create a map for quick certificate lookup
    const certMap = new Map<string, Certificate>();
    rankedCertificates.forEach(ranking => {
      certMap.set(ranking.certificado.id_certificado, ranking.certificado);
    });

    // Check and adjust progression logic
    for (let i = 1; i < levels.length; i++) {
      const currentLevel = levels[i];
      const previousLevel = levels[i - 1];
      
      // Ensure higher levels have higher average difficulty
      const currentAvgDifficulty = this.calculateAverageDifficulty(currentLevel.certificados, certMap);
      const previousAvgDifficulty = this.calculateAverageDifficulty(previousLevel.certificados, certMap);
      
      // If progression is inverted, swap some certificates
      if (currentAvgDifficulty < previousAvgDifficulty - 0.5) {
        this.adjustProgression(currentLevel, previousLevel, certMap);
      }
    }
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
   * Adjust progression by swapping certificates between levels
   */
  private adjustProgression(
    currentLevel: LearningLevel, 
    previousLevel: LearningLevel, 
    certMap: Map<string, Certificate>
  ): void {
    // Find the easiest certificate in current level and hardest in previous level
    let easiestInCurrent = { id: '', difficulty: 5 };
    let hardestInPrevious = { id: '', difficulty: 1 };
    
    currentLevel.certificados.forEach(id => {
      const cert = certMap.get(id);
      if (cert && cert.dificultad < easiestInCurrent.difficulty) {
        easiestInCurrent = { id, difficulty: cert.dificultad };
      }
    });
    
    previousLevel.certificados.forEach(id => {
      const cert = certMap.get(id);
      if (cert && cert.dificultad > hardestInPrevious.difficulty) {
        hardestInPrevious = { id, difficulty: cert.dificultad };
      }
    });
    
    // Swap if it improves progression
    if (easiestInCurrent.difficulty < hardestInPrevious.difficulty) {
      const currentIndex = currentLevel.certificados.indexOf(easiestInCurrent.id);
      const previousIndex = previousLevel.certificados.indexOf(hardestInPrevious.id);
      
      if (currentIndex !== -1 && previousIndex !== -1) {
        currentLevel.certificados[currentIndex] = hardestInPrevious.id;
        previousLevel.certificados[previousIndex] = easiestInCurrent.id;
      }
    }
  }

  /**
   * Validate the final assignment for quality
   */
  validateAssignment(levels: LearningLevel[], rankedCertificates: CertificateRanking[]): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check for empty levels
    const emptyLevels = levels.filter(level => level.certificados.length === 0);
    if (emptyLevels.length > 0) {
      issues.push(`${emptyLevels.length} levels have no certificates assigned`);
      suggestions.push('Consider reducing the number of levels or finding more certificates');
    }
    
    // Check for overcrowded levels
    const overcrowdedLevels = levels.filter(level => level.certificados.length > 5);
    if (overcrowdedLevels.length > 0) {
      issues.push(`${overcrowdedLevels.length} levels have too many certificates`);
      suggestions.push('Consider increasing the number of levels or raising quality thresholds');
    }
    
    // Check progression logic
    const certMap = new Map<string, Certificate>();
    rankedCertificates.forEach(ranking => {
      certMap.set(ranking.certificado.id_certificado, ranking.certificado);
    });
    
    for (let i = 1; i < levels.length; i++) {
      const currentAvg = this.calculateAverageDifficulty(levels[i].certificados, certMap);
      const previousAvg = this.calculateAverageDifficulty(levels[i - 1].certificados, certMap);
      
      if (currentAvg < previousAvg - 0.3) {
        issues.push(`Level ${i + 1} has lower difficulty than Level ${i}`);
      }
    }
    
    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
}
