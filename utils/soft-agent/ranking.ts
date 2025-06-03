/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Certificate ranking utilities for SOFT agent system
 * Matches exactly the Python implementation in utils/ranking.py
 */

/**
 * Ranks certificates based on required skills coverage and difficulty
 * Matches exactly the Python function: rank_certificates(requisitos, data)
 */
export function rankCertificates(requisitos: any[], data: any) {
  const certificados = data.certificados;
  const certificadosHabilidades = data.certificados_habilidades;
  const usuarioCertificados = data.usuario_certificados;
  
  // Create dictionary of skills per certificate
  const certHabilidades: { [key: string]: any[] } = {};
  for (const ch of certificadosHabilidades) {
    if (!certHabilidades[ch.id_certificado]) {
      certHabilidades[ch.id_certificado] = [];
    }
    certHabilidades[ch.id_certificado].push({
      id_habilidad: ch.id_habilidad,
      nivel: ch.nivel_experiencia
    });
  }
  
  // Evaluate each certificate
  const certificadosRanked = [];
  for (const cert of certificados) {
    // Skip if user already has the certificate
    if (usuarioCertificados.some((uc: any) => uc.id_certificado === cert.id_certificado)) {
      continue;
    }
    
    // Calculate coverage of required skills
    let cobertura = 0;
    let dificultad = 0;
    let relevancia = 0;
    
    if (certHabilidades[cert.id_certificado]) {
      for (const hab of certHabilidades[cert.id_certificado]) {
        // Check if the skill is required
        for (const req of requisitos) {
          if (req.id_habilidad === hab.id_habilidad) {
            // Increase coverage based on level
            const nivelRequerido = req.nivel_experiencia || req.nivel_requerido || 1;
            cobertura += Math.min(hab.nivel, nivelRequerido) / nivelRequerido;
            dificultad += hab.nivel;
            relevancia += 1;
          }
        }
      }
    }
    
    if (relevancia > 0) {
      const score = (cobertura / relevancia) * 0.6 + (dificultad / (relevancia * 5)) * 0.4;
      certificadosRanked.push({
        certificado: cert,
        score: score,
        cobertura: cobertura,
        dificultad: dificultad,
        relevancia: relevancia
      });
    }
  }
  
  // Sort by score
  certificadosRanked.sort((a, b) => b.score - a.score);
  return certificadosRanked;
}
