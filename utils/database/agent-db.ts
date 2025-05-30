// Database functions for the agent system
import { createClient } from '@/utils/supabase/server';
import type { 
  ProjectRole, 
  EmployeeData, 
  EmployeeProject, 
  EmployeeSkill, 
  RequiredSkill, 
  EmployeeRole,
  DatabaseFunctions 
} from '@/interfaces/agent';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (attempt + 1)));
      }
    }
  }
  
  throw lastError;
}

export const agentDatabase: DatabaseFunctions = {
  async getRolesProyecto(idProyecto: string): Promise<ProjectRole[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: roles, error } = await supabase
        .from('proyectos_roles')
        .select('*')
        .eq('id_proyecto', idProyecto)
        .eq('ocupado', false);

      if (error) throw error;
      
      console.log(`getRolesProyecto → ${roles?.length || 0} roles disponibles encontrados para proyecto ${idProyecto}`);
      
      // Get role details and required skills for each role
      const rolesWithDetails: ProjectRole[] = [];
      
      for (const rol of roles || []) {
        const roleDetails = await agentDatabase.getDetallesRol(rol.id_rol);
        const requiredSkills = await agentDatabase.getHabilidadesRequeridasPorRol(rol.id_rol);
        
        rolesWithDetails.push({
          id_rol: rol.id_rol,
          nombre: roleDetails?.nombre || rol.nombre || 'Unknown Role',
          descripcion: roleDetails?.descripcion,
          habilidades_requeridas: requiredSkills,
          id_cliente: rol.id_cliente
        });
      }
      
      return rolesWithDetails;
    });
  },

  async getEmpleadosDisponibles(): Promise<EmployeeData[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: empleados, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('KIT', true);

      if (error) throw error;
      
      console.log(`getEmpleadosDisponibles → ${empleados?.length || 0} empleados KIT encontrados`);
      return empleados || [];
    });
  },

  async getProyectosUsuario(usuarioId: string): Promise<EmployeeProject[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: proyectos, error } = await supabase
        .from('usuarios_proyectos')
        .select(`
          id_proyecto,
          proyectos!inner(id_cliente, fecha_inicio, fecha_fin)
        `)
        .eq('id_usuario', usuarioId);

      if (error) throw error;
      
      const formattedProjects: EmployeeProject[] = (proyectos || []).map(p => ({
        id_proyecto: p.id_proyecto,
        id_cliente: (p.proyectos as { id_cliente?: string; fecha_inicio?: string; fecha_fin?: string })?.id_cliente,
        fecha_inicio: (p.proyectos as { id_cliente?: string; fecha_inicio?: string; fecha_fin?: string })?.fecha_inicio,
        fecha_fin: (p.proyectos as { id_cliente?: string; fecha_inicio?: string; fecha_fin?: string })?.fecha_fin
      }));
      
      console.log(`getProyectosUsuario → ${formattedProjects.length} proyectos encontrados para usuario ${usuarioId}`);
      return formattedProjects;
    });
  },

  async getHabilidadesUsuario(usuarioId: string): Promise<EmployeeSkill[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      const habilidadesNiveles = new Map<string, EmployeeSkill>();

      // Skills from certificates
      const { data: certs } = await supabase
        .from('usuarios_certificados')
        .select('id_certificado')
        .eq('id_usuario', usuarioId);

      console.log(`Habilidades desde certificados: ${certs?.length || 0} certificados`);
      
      for (const cert of certs || []) {
        const { data: skills } = await supabase
          .from('certificados_habilidades')
          .select('*')
          .eq('id_certificado', cert.id_certificado);

        for (const skill of skills || []) {
          const habilidadId = skill.id_habilidad;
          const nivel = skill.nivel_experiencia || 1;
          const existing = habilidadesNiveles.get(habilidadId);
          
          if (!existing || existing.nivel_experiencia < nivel) {
            habilidadesNiveles.set(habilidadId, {
              id_habilidad: habilidadId,
              nivel_experiencia: nivel,
              validado: true,
              origen: 'certificacion',
              fuentes: (existing?.fuentes || 0) + 1
            });
          }
        }
      }

      // Skills from projects
      const { data: proyectos } = await supabase
        .from('usuarios_proyectos')
        .select('id_proyecto')
        .eq('id_usuario', usuarioId);

      console.log(`Habilidades desde proyectos: ${proyectos?.length || 0} proyectos`);
      
      for (const proyecto of proyectos || []) {
        const { data: skills } = await supabase
          .from('proyectos_habilidades')
          .select('*')
          .eq('id_proyecto', proyecto.id_proyecto);

        for (const skill of skills || []) {
          const habilidadId = skill.id_habilidad;
          const nivel = skill.nivel_experiencia || 2;
          const existing = habilidadesNiveles.get(habilidadId);
          
          if (!existing || existing.nivel_experiencia < nivel) {
            habilidadesNiveles.set(habilidadId, {
              id_habilidad: habilidadId,
              nivel_experiencia: Math.max(existing?.nivel_experiencia || 0, nivel),
              validado: true,
              origen: 'proyecto',
              fuentes: (existing?.fuentes || 0) + 1
            });
          }
        }
      }

      // Skills from experience
      const { data: experiencias } = await supabase
        .from('experiencia')
        .select('id_experiencia')
        .eq('id_usuario', usuarioId);

      console.log(`Habilidades desde experiencia: ${experiencias?.length || 0} experiencias`);
      
      for (const exp of experiencias || []) {
        const { data: skills } = await supabase
          .from('experiencias_habilidades')
          .select('*')
          .eq('id_experiencia', exp.id_experiencia);

        for (const skill of skills || []) {
          const habilidadId = skill.id_habilidad;
          const nivel = skill.nivel_experiencia || 3;
          const existing = habilidadesNiveles.get(habilidadId);
          
          if (!existing || existing.nivel_experiencia < nivel) {
            habilidadesNiveles.set(habilidadId, {
              id_habilidad: habilidadId,
              nivel_experiencia: Math.max(existing?.nivel_experiencia || 0, nivel),
              validado: true,
              origen: 'experiencia',
              fuentes: (existing?.fuentes || 0) + 1
            });
          }
        }
      }

      const result = Array.from(habilidadesNiveles.values());
      console.log(`Total habilidades recopiladas: ${result.length}`);
      return result;
    });
  },

  async getHabilidadesRequeridasPorRol(idRol: string): Promise<RequiredSkill[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: habilidades, error } = await supabase
        .from('roles_habilidades')
        .select('*')
        .eq('id_rol', idRol);

      if (error) throw error;
      
      console.log(`getHabilidadesRequeridasPorRol → ${habilidades?.length || 0} habilidades requeridas para rol ${idRol}`);
      
      return (habilidades || []).map(h => ({
        id_habilidad: h.id_habilidad,
        nivel_requerido: h.nivel_requerido || 1,
        peso: h.peso || 1.0
      }));
    });
  },

  async getRolesUsuario(usuarioId: string): Promise<EmployeeRole[]> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: roles, error } = await supabase
        .from('usuarios_roles')
        .select(`
          id_rol,
          roles(nombre)
        `)
        .eq('id_usuario', usuarioId);

      if (error) throw error;
      
      const formattedRoles: EmployeeRole[] = (roles || []).map(r => ({
        id_rol: r.id_rol,
        nombre: (r.roles as { nombre?: string })?.nombre
      }));
      
      console.log(`getRolesUsuario → ${formattedRoles.length} roles encontrados para usuario ${usuarioId}`);
      return formattedRoles;
    });
  },

  async getDetallesRol(idRol: string): Promise<ProjectRole | null> {
    return withRetry(async () => {
      const supabase = await createClient();
      
      const { data: role, error } = await supabase
        .from('roles')
        .select('*')
        .eq('id_rol', idRol)
        .single();

      if (error || !role) return null;
      
      return {
        id_rol: role.id_rol,
        nombre: role.nombre,
        descripcion: role.descripcion,
        habilidades_requeridas: [] // Will be populated separately
      };
    });
  }
};

export async function guardarAsignacion(idProyecto: string, idUsuario: string, idRol: string) {
  return withRetry(async () => {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('usuarios_proyectos')
      .insert({
        id_proyecto: idProyecto,
        id_usuario: idUsuario,
        id_rol: idRol,
        titulo: null,
        horas: null
      })
      .select();

    if (error) throw error;
    
    console.log(`Asignación guardada: Usuario ${idUsuario} → Proyecto ${idProyecto}, Rol ${idRol}`);
    return data;
  });
}
