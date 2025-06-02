// Main entry point for SOFT agent certificate path optimization system
// Simplified to match Python implementation

// Export main components
export { CertPathModel } from './model';
export { CertAnalyzerAgent } from './cert-analyzer-agent';
export { rankCertificates } from './ranking';
export { assignCertificates } from './assigner';
export { runSimulation, showAvailablePaths, printResultados } from './main';

// Export database functions
export {
  getAvailablePaths,
  getPathData,
  getPathLevels,
  saveSimulationResults
} from '../database/soft-agent-db';

// Convenience function for running a complete simulation
export async function optimizeCertificatePath(idPath: string) {
  const { runSimulation } = await import('./main');
  return runSimulation(idPath);
}
