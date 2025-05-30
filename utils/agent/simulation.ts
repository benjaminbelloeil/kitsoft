// Main simulation logic for project team assignment
import { AgenteSeleccion } from './selection-agent';
import { agentDatabase } from '../database/agent-db';
import type { 
  AgentWeights, 
  AssignmentResult, 
  EmployeeData, 
  ProjectRole, 
  AgentCache,
  DatabaseFunctions 
} from '@/interfaces/agent';

// Weights for the scoring system
const PESOS: AgentWeights = {
  // Experience and trajectory (30%)
  antiguedad: 0.10,              // Time in company
  proyectos_completados: 0.10,   // Number of completed projects
  cliente_prev: 0.10,            // Previous client experience

  // Technical skills (40%)
  match_habilidades: 0.15,       // Base skill matching
  nivel_experiencia: 0.15,       // Experience level in required skills
  habilidades_complementarias: 0.10, // Additional relevant skills

  // Role and specialization (20%)
  rol_similar: 0.10,             // Similar role experience
  certificaciones: 0.10,         // Relevant certifications

  // Versatility (10%)
  versatilidad: 0.05,           // Total number of skills
  repeticion_habilidades: 0.05   // Skills validated in multiple sources
};

class Cache implements AgentCache {
  public roles = new Map();
  public projects = new Map();
  public skills = new Map();

  async getOrFetch<T>(key: string, fetchFunc: () => Promise<T>): Promise<T> {
    if (!this.roles.has(key) && !this.projects.has(key) && !this.skills.has(key)) {
      const result = await fetchFunc();
      if (key.startsWith('roles_')) this.roles.set(key, result);
      else if (key.startsWith('projects_')) this.projects.set(key, result);
      else if (key.startsWith('skills_')) this.skills.set(key, result);
      return result;
    }
    
    if (key.startsWith('roles_')) return this.roles.get(key);
    if (key.startsWith('projects_')) return this.projects.get(key);
    if (key.startsWith('skills_')) return this.skills.get(key);
    
    throw new Error(`Unknown cache key: ${key}`);
  }
}

function calcularNumAgentes(numEmpleados: number): number {
  // Scale logarithmically but with more agents for large groups
  return Math.max(4, Math.min(20, Math.floor(Math.log2(numEmpleados + 1) * 2)));
}

function dividirEmpleados(empleados: EmployeeData[], numGrupos: number): EmployeeData[][] {
  // Shuffle and divide employees into balanced groups
  const empleadosMezclados = [...empleados];
  
  // Simple shuffle algorithm
  for (let i = empleadosMezclados.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [empleadosMezclados[i], empleadosMezclados[j]] = [empleadosMezclados[j], empleadosMezclados[i]];
  }
  
  const grupos: EmployeeData[][] = Array.from({ length: numGrupos }, () => []);
  empleadosMezclados.forEach((empleado, index) => {
    grupos[index % numGrupos].push(empleado);
  });
  
  return grupos;
}

async function evaluarGrupoEmpleados(
  agente: AgenteSeleccion,
  empleadosGrupo: EmployeeData[],
  rol: ProjectRole,
  clienteId: string | undefined,
  dbFuncs: DatabaseFunctions
): Promise<{ empleado: EmployeeData; score: number } | null> {
  try {
    const puntuaciones: { empleado: EmployeeData; score: number }[] = [];
    
    for (const empleado of empleadosGrupo) {
      try {
        const score = await agente.calcularCompatibilidadAsync(
          empleado, 
          rol, 
          { id_cliente: clienteId }, 
          dbFuncs
        );
        puntuaciones.push({ empleado, score });
      } catch (error) {
        console.error(`Error evaluating employee ${empleado.nombre}:`, error);
      }
    }

    if (!puntuaciones.length) {
      return null;
    }

    puntuaciones.sort((a, b) => b.score - a.score);
    return puntuaciones[0]; // Return best candidate from this group
  } catch (error) {
    console.error(`Error in agent ${agente.id}:`, error);
    return null;
  }
}

async function procesarRolParalelo(
  rol: ProjectRole,
  empleados: EmployeeData[],
  agentes: AgenteSeleccion[],
  dbFuncs: DatabaseFunctions
): Promise<AssignmentResult | null> {
  try {
    console.log(`\nProcesando rol: ${rol.nombre} (${rol.id_rol})`);
    console.log(`Habilidades requeridas: ${rol.habilidades_requeridas.map(h => `${h.id_habilidad}:${h.nivel_requerido}`).join(', ')}`);

    // Divide employees among agents for parallel evaluation
    const gruposEmpleados = dividirEmpleados(empleados, agentes.length);

    // Create tasks for each group of employees
    const tareas = gruposEmpleados.map((grupo, index) =>
      evaluarGrupoEmpleados(
        agentes[index],
        grupo,
        rol,
        rol.id_cliente,
        dbFuncs
      )
    );

    // Execute evaluations in parallel
    const resultados = await Promise.all(tareas);
    const resultadosValidos = resultados.filter(r => r !== null) as { empleado: EmployeeData; score: number }[];

    if (!resultadosValidos.length) {
      console.log(`No se obtuvieron resultados válidos para el rol ${rol.nombre}`);
      return null;
    }

    // Combine results from all agents
    const scoresCombinados = new Map<string, number[]>();
    
    for (const { empleado, score } of resultadosValidos) {
      if (!scoresCombinados.has(empleado.id_usuario)) {
        scoresCombinados.set(empleado.id_usuario, []);
      }
      scoresCombinados.get(empleado.id_usuario)!.push(score);
    }

    // Calculate average scores for each employee
    const promedios = new Map<string, number>();
    for (const [uid, scores] of scoresCombinados) {
      const promedio = scores.reduce((sum, s) => sum + s, 0) / scores.length;
      promedios.set(uid, promedio);
    }

    // Select the best candidate
    let ganadorId = '';
    let mejorScore = -1;
    
    for (const [uid, score] of promedios) {
      if (score > mejorScore) {
        mejorScore = score;
        ganadorId = uid;
      }
    }

    const empleadoAsignado = empleados.find(e => e.id_usuario === ganadorId);
    if (!empleadoAsignado) {
      console.log(`No se encontró el empleado ganador para el rol ${rol.nombre}`);
      return null;
    }

    console.log(`\nResultados para ${rol.nombre}:`);
    // Sort by average score
    const sortedResults = Array.from(promedios.entries())
      .sort(([, a], [, b]) => b - a);
    
    for (const [uid, scoreProm] of sortedResults) {
      const emp = empleados.find(e => e.id_usuario === uid);
      const numEvaluaciones = scoresCombinados.get(uid)?.length || 0;
      console.log(`  ${emp?.nombre}: ${scoreProm.toFixed(3)} (promedio de ${numEvaluaciones} evaluaciones)`);
    }

    const numEvaluaciones = scoresCombinados.get(ganadorId)?.length || 0;
    console.log(`\nMejor candidato: ${empleadoAsignado.nombre} con score ${mejorScore.toFixed(3)}`);

    return {
      rol_id: rol.id_rol,
      rol_nombre: rol.nombre,
      empleado_id: empleadoAsignado.id_usuario,
      empleado_nombre: empleadoAsignado.nombre,
      score: mejorScore,
      num_evaluaciones: numEvaluaciones
    };
  } catch (error) {
    console.error(`Error procesando rol ${rol.nombre}:`, error);
    return null;
  }
}

export async function simular(idProyecto: string): Promise<AssignmentResult[]> {
  console.log(`Simulando asignación para proyecto: ${idProyecto}`);
  
  try {
    const cache = new Cache();
    
    // Get project roles and their required skills
    const roles = await agentDatabase.getRolesProyecto(idProyecto);

    if (!roles.length) {
      console.log('No se encontraron roles disponibles en el proyecto.');
      return [];
    }

    // Get available employees
    const empleadosInicial = await agentDatabase.getEmpleadosDisponibles();

    // Create cached database functions
    const cachedDbFuncs: DatabaseFunctions = {
      getRolesProyecto: agentDatabase.getRolesProyecto,
      getEmpleadosDisponibles: agentDatabase.getEmpleadosDisponibles,
      getProyectosUsuario: (userId: string) => 
        cache.getOrFetch(`projects_${userId}`, () => agentDatabase.getProyectosUsuario(userId)),
      getHabilidadesUsuario: (userId: string) => 
        cache.getOrFetch(`skills_${userId}`, () => agentDatabase.getHabilidadesUsuario(userId)),
      getHabilidadesRequeridasPorRol: agentDatabase.getHabilidadesRequeridasPorRol,
      getRolesUsuario: (userId: string) => 
        cache.getOrFetch(`roles_${userId}`, () => agentDatabase.getRolesUsuario(userId)),
      getDetallesRol: agentDatabase.getDetallesRol
    };

    // Pre-load employee data
    for (const empleado of empleadosInicial) {
      await cachedDbFuncs.getRolesUsuario(empleado.id_usuario);
      await cachedDbFuncs.getProyectosUsuario(empleado.id_usuario);
      await cachedDbFuncs.getHabilidadesUsuario(empleado.id_usuario);
    }

    const numAgentes = calcularNumAgentes(empleadosInicial.length);
    console.log(`Roles encontrados: ${roles.length}`);
    console.log(`Empleados disponibles: ${empleadosInicial.length}`);
    console.log(`Número de agentes asignados: ${numAgentes}`);

    const asignados: AssignmentResult[] = [];
    const empleados = [...empleadosInicial];
    const agentes = Array.from({ length: numAgentes }, (_, i) => new AgenteSeleccion(i, PESOS));

    // Track assigned employees
    const empleadosAsignados = new Set<string>();

    // Process roles sequentially to avoid assigning the same employee to multiple roles
    for (const rol of roles) {
      // Filter out already assigned employees
      const empleadosDisponibles = empleados.filter(e => !empleadosAsignados.has(e.id_usuario));
      
      if (empleadosDisponibles.length === 0) {
        console.log(`No hay empleados disponibles para el rol ${rol.nombre}`);
        continue;
      }
      
      const resultado = await procesarRolParalelo(rol, empleadosDisponibles, agentes, cachedDbFuncs);
      
      if (resultado) {
        asignados.push(resultado);
        empleadosAsignados.add(resultado.empleado_id);
        console.log(`✅ Empleado ${resultado.empleado_nombre} asignado al rol ${resultado.rol_nombre}`);
      } else {
        console.log(`⚠️ No se pudo asignar empleado para el rol ${rol.nombre}`);
      }

      if (empleadosAsignados.size >= empleados.length) {
        console.log('Todos los empleados han sido asignados');
        break;
      }
    }

    return asignados;

  } catch (error) {
    console.error('Error en simulación:', error);
    return [];
  }
}
