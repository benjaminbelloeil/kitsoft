/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Certificate assignment utilities for distributing certificates across learning levels
 * Matches exactly the Python implementation in utils/assigner.py
 */

/**
 * Distributes certificates in 3-5 levels based on score and ensures adequate progression
 * Matches exactly the Python function: assign_certificates(certificados_ranked)
 */
export function assignCertificates(certificadosRanked: any[]) {
  if (!certificadosRanked || certificadosRanked.length === 0) {
    return [];
  }
  
  // Determine number of levels based on quantity of certificates and difficulty
  const numCerts = certificadosRanked.length;
  const maxDificultad = Math.max(...certificadosRanked.map(cert => cert.dificultad));
  
  let numNiveles: number;
  if (numCerts <= 5 || maxDificultad <= 3) {
    numNiveles = 3;
  } else if (numCerts <= 10 || maxDificultad <= 4) {
    numNiveles = 4;
  } else {
    numNiveles = 5;
  }
  
  // Calculate certificates per level
  const certsPorNivel = numCerts / numNiveles;
  
  // Distribute certificates
  const niveles = [];
  for (let i = 0; i < numNiveles; i++) {
    const startIdx = Math.floor(i * certsPorNivel);
    let endIdx = Math.floor((i + 1) * certsPorNivel);
    
    // Ensure that the last level includes the remaining certificates
    if (i === numNiveles - 1) {
      endIdx = numCerts;
    }
    
    const nivelCerts = certificadosRanked.slice(startIdx, endIdx);
    
    niveles.push({
      nivel: i + 1,
      certificados: nivelCerts
    });
  }
  
  return niveles;
}
