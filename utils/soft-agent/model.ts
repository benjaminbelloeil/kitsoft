/* eslint-disable @typescript-eslint/no-explicit-any */
// Main simulation model for certificate path optimization
// This matches exactly the Python implementation in model.py

import { getPathData, saveSimulationResults, getPathLevels } from '../database/soft-agent-db';
import { rankCertificates } from './ranking';
import { assignCertificates } from './assigner';
import { CertAnalyzerAgent } from './cert-analyzer-agent';

export class CertPathModel {
  private idPath: string;
  private agents: CertAnalyzerAgent[] = [];
  private paths: any;
  private requisitos: any[] = [];
  private mejorSolucion: any = null;
  private mejorScore: number = -Infinity;
  private meta: string = '';

  constructor(parameters: { steps: number; id_path: string }) {
    this.idPath = parameters.id_path;
  }

  async setup() {
    // Check if path already has assigned levels
    const nivelesExistentes = await getPathLevels(this.idPath);
    if (nivelesExistentes && nivelesExistentes.length > 0) {
      console.log(`Path ${this.idPath} already has assigned levels. Skipping simulation.`);
      return false; // Indicate setup failed due to existing levels
    }

    // Create group of analyzer agents
    const nAgents = 10;
    this.agents = [];
    for (let i = 0; i < nAgents; i++) {
      this.agents.push(new CertAnalyzerAgent(this));
    }

    // Get path data
    this.paths = await getPathData(this.idPath);
    this.requisitos = this.paths.requisitos;

    // Save meta for results display
    this.meta = this.paths.path.meta || 'Sin meta definida';
    
    return true; // Setup successful
  }

  /**
   * Returns ranked certificates based on path requirements
   * Matches Python method: buscar_certificados(agente)
   */
  buscarCertificados() {
    if (!this.requisitos || !this.requisitos.length || !this.paths.certificados || !this.paths.certificados.length) {
      console.log('No requirements or certificates found');
      return [];
    }

    const certificadosRanked = rankCertificates(this.requisitos, this.paths);

    if (!certificadosRanked || !certificadosRanked.length) {
      console.log('No ranked certificates found');
      return [];
    }

    return certificadosRanked;
  }

  /**
   * Assigns ranked certificates to different levels
   * Matches Python method: asignar_certificados(certificados_ranked)
   */
  asignarCertificados(certificadosRanked: any[]) {
    return assignCertificates(certificadosRanked);
  }

  /**
   * Evaluates a solution based on:
   * - Total skill coverage
   * - Balanced distribution of certificates per level
   * - Logical difficulty progression
   * Matches Python method: evaluar_solucion(solucion)
   */
  evaluarSolucion(solucion: any[]) {
    if (!solucion || !solucion.length || !solucion.some(nivel => nivel.certificados && nivel.certificados.length > 0)) {
      console.log('Invalid solution - no certificates in any level');
      return 0;
    }

    let score = 0;
    const numNiveles = solucion.length;

    // Evaluate difficulty progression
    for (let i = 0; i < numNiveles; i++) {
      const nivel = solucion[i];
      if (nivel.certificados && nivel.certificados.length > 0) {
        // Add points for having certificates in the level
        score += 10;

        // Add points for balanced distribution
        if (nivel.certificados.length >= 1 && nivel.certificados.length <= 5) {
          score += 5;
        }

        // Add points for difficulty progression (higher levels should be harder)
        const avgDificultad = nivel.certificados.reduce((sum: number, cert: any) => sum + (cert.dificultad || 1), 0) / nivel.certificados.length;
        if (i === 0 && avgDificultad <= 2) score += 5; // Easy for first level
        if (i === numNiveles - 1 && avgDificultad >= 3) score += 5; // Hard for last level
      }
    }

    return score;
  }

  /**
   * Single step of the simulation
   * Matches Python method: step()
   */
  async step() {
    // Make agents analyze
    for (const agent of this.agents) {
      await agent.step();
    }

    // Evaluate all solutions and find the best
    for (const agent of this.agents) {
      for (const solucion of agent.getSoluciones()) {
        const score = this.evaluarSolucion(solucion);
        if (score > this.mejorScore) {
          this.mejorScore = score;
          this.mejorSolucion = solucion;
        }
      }
    }
  }

  /**
   * End the simulation and save results
   * Matches Python method: end()
   */
  async end() {
    if (this.mejorSolucion && this.mejorScore > 0) {
      try {
        await saveSimulationResults(this.idPath, this.mejorSolucion);
        console.log(`Simulation completed for path ${this.idPath}. Best score: ${this.mejorScore}`);
      } catch (error) {
        console.error('Error saving simulation results:', error);
      }
    } else {
      console.log('No valid solution found');
    }
  }

  /**
   * Run the complete simulation
   * Matches Python model.run() behavior
   */
  async run() {
    const setupSuccess = await this.setup();
    if (!setupSuccess) {
      return; // Skip simulation if setup failed
    }

    // Run simulation steps
    const steps = 10; // Default from Python
    for (let i = 0; i < steps; i++) {
      await this.step();
    }

    await this.end();
  }

  // Getters for accessing simulation results
  getMejorSolucion() {
    return this.mejorSolucion;
  }

  getMejorScore() {
    return this.mejorScore;
  }

  getMeta() {
    return this.meta;
  }
}
