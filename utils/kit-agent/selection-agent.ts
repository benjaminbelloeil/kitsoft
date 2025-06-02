// Selection Agent for project team assignment
import type { 
  AgentWeights, 
  EmployeeData, 
  ProjectRole, 
  DatabaseFunctions,
  AgentEvaluationResult,
  ScoreBreakdown,
  EmployeeSkill,
  RequiredSkill
} from '@/interfaces/kit-agent';

export class AgenteSeleccion {
  public id: number;
  private pesos: AgentWeights;
  private intentosFallidos: Map<string, number>;

  constructor(id: number, pesos: AgentWeights) {
    this.id = id;
    this.pesos = pesos;
    this.intentosFallidos = new Map();
  }

  async calcularCompatibilidadAsync(
    empleado: EmployeeData,
    rolObjetivo: ProjectRole,
    proyecto: { id_cliente?: string },
    dbFuncs: DatabaseFunctions
  ): Promise<number> {
    console.log(`\nCalculando compatibilidad para ${empleado.nombre}:`);
    let score = 0;
    const scoresDesglosados: ScoreBreakdown = {};

    // 1. Get all necessary data
    const rolesUsuario = await dbFuncs.getRolesUsuario(empleado.id_usuario);
    const proyectos = await dbFuncs.getProyectosUsuario(empleado.id_usuario);
    const usuarioHabilidades = await dbFuncs.getHabilidadesUsuario(empleado.id_usuario);

    // 2. Calculate seniority (10%)
    const fechaIngreso = empleado.fecha_ingreso;
    if (fechaIngreso) {
      try {
        const fechaIngresoDate = new Date(fechaIngreso);
        const antiguedadDias = Math.floor((Date.now() - fechaIngresoDate.getTime()) / (1000 * 60 * 60 * 24));
        const scoreAntiguedad = Math.min(antiguedadDias / 1095, 1.0) * this.pesos.antiguedad; // Normalized to 3 years
        score += scoreAntiguedad;
        scoresDesglosados.antiguedad = scoreAntiguedad;
        console.log(`  Antigüedad: ${antiguedadDias} días → ${scoreAntiguedad.toFixed(3)}`);
      } catch {
        console.log(`  Antigüedad: fecha inválida`);
      }
    }

    // 3. Evaluate completed projects (10%)
    const numProyectos = proyectos.length;
    const scoreProyectos = Math.min(numProyectos / 10, 1.0) * this.pesos.proyectos_completados;
    score += scoreProyectos;
    scoresDesglosados.proyectos = scoreProyectos;
    console.log(`  Proyectos completados: ${numProyectos} → ${scoreProyectos.toFixed(3)}`);

    // 4. Check client experience (10%)
    if (proyecto.id_cliente && proyectos.some(p => p.id_cliente === proyecto.id_cliente)) {
      const scoreCliente = this.pesos.cliente_prev;
      score += scoreCliente;
      scoresDesglosados.cliente = scoreCliente;
      console.log(`  Ha trabajado con el cliente → +${scoreCliente.toFixed(3)}`);
    }

    // 5. Skills analysis
    const habilidadesUsuario = new Map<string, EmployeeSkill>();
    usuarioHabilidades.forEach(h => {
      habilidadesUsuario.set(h.id_habilidad, h);
    });

    const habilidadesRequeridas = rolObjetivo.habilidades_requeridas || [];
    const habilidadesRol = new Map<string, RequiredSkill>();
    habilidadesRequeridas.forEach(h => {
      habilidadesRol.set(h.id_habilidad, h);
    });

    console.log(`  Habilidades del usuario: ${Array.from(habilidadesUsuario.entries()).map(([id, data]) => `${id}:${data.nivel_experiencia}`)}`);
    console.log(`  Habilidades requeridas: ${Array.from(habilidadesRol.entries()).map(([id, data]) => `${id}:${data.nivel_requerido}`)}`);

    // 5.1 Skills matching and levels
    const requeridas = new Set(habilidadesRol.keys());
    const usuarioIds = new Set(habilidadesUsuario.keys());
    const habilidadesMatch = new Set([...usuarioIds].filter(id => requeridas.has(id)));

    if (requeridas.size > 0) {
      // Base score for having the skills
      const matchPonderado = Array.from(habilidadesMatch).reduce((sum, hid) => {
        const habilidad = habilidadesRol.get(hid);
        return sum + (habilidad?.peso || 1.0);
      }, 0) / Array.from(habilidadesRol.values()).reduce((sum, h) => sum + (h.peso || 1.0), 0);

      const scoreMatch = matchPonderado * this.pesos.match_habilidades;
      score += scoreMatch;
      scoresDesglosados.match_base = scoreMatch;
      console.log(`  Match ponderado de habilidades: ${matchPonderado.toFixed(2)} → ${scoreMatch.toFixed(3)}`);

      // 5.2 Detailed experience level evaluation
      if (habilidadesMatch.size > 0) {
        let nivelTotal = 0;
        let nivelMaximo = 0;
        
        for (const hid of habilidadesMatch) {
          const usuarioSkill = habilidadesUsuario.get(hid);
          const requiredSkill = habilidadesRol.get(hid);
          
          if (usuarioSkill && requiredSkill) {
            const nivelUsuario = usuarioSkill.nivel_experiencia;
            const nivelRequerido = requiredSkill.nivel_requerido;
            const peso = requiredSkill.peso || 1.0;
            
            // Score based on how much the user exceeds or meets the requirement
            const nivelScore = Math.min(nivelUsuario / nivelRequerido, 1.5) * peso; // Cap at 150% for exceeding requirements
            nivelTotal += nivelScore;
            nivelMaximo += 1.5 * peso; // Maximum possible score per skill
          }
        }
        
        const scoreNiveles = (nivelTotal / nivelMaximo) * this.pesos.nivel_experiencia;
        score += scoreNiveles;
        scoresDesglosados.niveles = scoreNiveles;
        console.log(`  Score de niveles de experiencia: ${(nivelTotal / nivelMaximo).toFixed(2)} → ${scoreNiveles.toFixed(3)}`);
      }
    }

    // 6. Complementary skills
    const habilidadesExtra = new Set([...usuarioIds].filter(id => !requeridas.has(id)));
    if (requeridas.size > 0) {
      const habilidadesValidadas = Array.from(habilidadesExtra).filter(hid => {
        const skill = habilidadesUsuario.get(hid);
        return skill?.validado !== false;
      }).length;
      
      const scoreComplementarias = Math.min(habilidadesValidadas / requeridas.size, 1.0) * this.pesos.habilidades_complementarias;
      score += scoreComplementarias;
      scoresDesglosados.complementarias = scoreComplementarias;
      console.log(`  Habilidades complementarias validadas: ${habilidadesValidadas} → ${scoreComplementarias.toFixed(3)}`);
    }

    // 7. Check similar roles (10%)
    const tieneRolSimilar = rolesUsuario.some(r => r.id_rol === rolObjetivo.id_rol);
    if (tieneRolSimilar) {
      const scoreRol = this.pesos.rol_similar;
      score += scoreRol;
      scoresDesglosados.rol = scoreRol;
      console.log(`  Tiene rol similar → +${scoreRol.toFixed(3)}`);
    }

    // 8. Certifications
    const certificaciones = usuarioHabilidades.filter(h => h.origen === 'certificacion' && h.validado !== false);
    const numCertificaciones = certificaciones.length;
    const scoreCert = Math.min(numCertificaciones / 3, 1.0) * this.pesos.certificaciones;
    score += scoreCert;
    scoresDesglosados.certificaciones = scoreCert;
    console.log(`  Certificaciones validadas: ${numCertificaciones} → ${scoreCert.toFixed(3)}`);

    // 9. General versatility
    const habilidadesValidadasTotal = usuarioHabilidades.filter(h => h.validado !== false).length;
    const scoreVersatilidad = Math.min(habilidadesValidadasTotal / 15, 1.0) * this.pesos.versatilidad;
    score += scoreVersatilidad;
    scoresDesglosados.versatilidad = scoreVersatilidad;
    console.log(`  Versatilidad (habilidades validadas): ${habilidadesValidadasTotal} → ${scoreVersatilidad.toFixed(3)}`);

    // 10. Multi-source skills
    const habilidadesMultiFuente = usuarioHabilidades.filter(h => (h.fuentes || 1) > 1 && h.validado !== false).length;
    if (habilidadesValidadasTotal > 0) {
      const scoreRep = (habilidadesMultiFuente / habilidadesValidadasTotal) * this.pesos.repeticion_habilidades;
      score += scoreRep;
      scoresDesglosados.repeticion = scoreRep;
      console.log(`  Habilidades multi-fuente validadas: ${habilidadesMultiFuente} → ${scoreRep.toFixed(3)}`);
    }

    console.log(`\n  Score total: ${score.toFixed(3)}`);
    console.log("  Desglose de scores:");
    Object.entries(scoresDesglosados).forEach(([criterio, valor]) => {
      console.log(`    - ${criterio}: ${valor?.toFixed(3)}`);
    });

    return score;
  }

  async votarAsync(
    candidatos: EmployeeData[],
    rol: ProjectRole,
    proyecto: { id_cliente?: string },
    dbFuncs: DatabaseFunctions
  ): Promise<AgentEvaluationResult | null> {
    if (!candidatos.length) {
      return null;
    }

    const puntuaciones: AgentEvaluationResult[] = [];
    for (const candidato of candidatos) {
      try {
        const score = await this.calcularCompatibilidadAsync(candidato, rol, proyecto, dbFuncs);
        puntuaciones.push({ empleado: candidato, score });
      } catch (error) {
        console.error(`Error evaluating candidate ${candidato.nombre}:`, error);
      }
    }

    if (!puntuaciones.length) {
      return null;
    }

    puntuaciones.sort((a, b) => b.score - a.score);
    return puntuaciones[0];
  }
}
