/* eslint-disable @typescript-eslint/no-explicit-any */
// Database functions for SOFT agent certificate path optimization
// This matches exactly the Python implementation structure

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * Get all available paths from the database
 * Matches Python function: get_available_paths()
 */
export async function getAvailablePaths() {
  const { data, error } = await supabase
    .from('paths')
    .select('*');
  
  if (error) throw error;
  return data || [];
}

/**
 * Get complete path data for a specific path
 * Matches Python function: get_path_data(id_path)
 */
export async function getPathData(idPath: string) {
  try {
    // Get path basic info
    const { data: pathData, error: pathError } = await supabase
      .from('paths')
      .select('*')
      .eq('id_path', idPath)
      .single();
    
    if (pathError || !pathData) {
      throw new Error(`Path with id ${idPath} not found`);
    }

    // Get path_habilidades
    const { data: pathHabilidades, error: pathHabError } = await supabase
      .from('path_habilidades')
      .select('*')
      .eq('id_path', idPath);
    
    if (pathHabError) throw pathHabError;

    // Get path_roles
    const { data: pathRoles, error: pathRolesError } = await supabase
      .from('path_roles')
      .select('*')
      .eq('id_path', idPath);
    
    if (pathRolesError) throw pathRolesError;

    // Get roles_habilidades for the roles in this path
    const rolesIds = (pathRoles || []).map(r => r.id_rol);
    let rolesHabilidades = [];
    if (rolesIds.length > 0) {
      const { data: rolesHabData, error: rolesHabError } = await supabase
        .from('roles_habilidades')
        .select('*')
        .in('id_rol', rolesIds);
      
      if (rolesHabError) throw rolesHabError;
      rolesHabilidades = rolesHabData || [];
    }

    // Get all certificados
    const { data: certificados, error: certError } = await supabase
      .from('certificados')
      .select('*');
    
    if (certError) throw certError;

    // Get certificados_habilidades
    const { data: certificadosHabilidades, error: certHabError } = await supabase
      .from('certificados_habilidades')
      .select('*');
    
    if (certHabError) throw certHabError;

    // Get user certificates and skills
    const { data: usuarioCertificados, error: userCertError } = await supabase
      .from('usuarios_certificados')
      .select('*')
      .eq('id_usuario', pathData.id_usuario);
    
    if (userCertError) throw userCertError;

    const { data: usuarioHabilidades, error: userSkillError } = await supabase
      .from('usuarios_habilidades')
      .select('*')
      .eq('id_usuario', pathData.id_usuario);
    
    if (userSkillError) throw userSkillError;

    // Combine requisitos (path_habilidades + roles_habilidades)
    const requisitos = [...(pathHabilidades || []), ...rolesHabilidades];

    return {
      path: pathData,
      path_habilidades: pathHabilidades || [],
      path_roles: pathRoles || [],
      certificados: certificados || [],
      certificados_habilidades: certificadosHabilidades || [],
      usuario_certificados: usuarioCertificados || [],
      usuario_habilidades: usuarioHabilidades || [],
      requisitos
    };
  } catch (error) {
    console.error('Error getting path data:', error);
    throw error;
  }
}

/**
 * Check if a path already has levels assigned
 * Matches Python function: get_path_levels(id_path)
 */
export async function getPathLevels(idPath: string) {
  const { data, error } = await supabase
    .from('path_nivel')
    .select('*')
    .eq('id_path', idPath);
  
  if (error) throw error;
  return data || [];
}

/**
 * Save simulation results to the database
 * Matches Python function: save_simulation_results(id_path, solution)
 */
export async function saveSimulationResults(idPath: string, solution: any[]) {
  try {
    // First, insert the levels into path_nivel
    for (const nivel of solution) {
      const { data: nivelData, error: nivelError } = await supabase
        .from('path_nivel')
        .insert({
          id_path: idPath,
          numero: nivel.nivel,
          status: 'pendiente'
        })
        .select()
        .single();
      
      if (nivelError) throw nivelError;

      // Then, insert the certificates for this level into nivel_certificados
      for (const certInfo of nivel.certificados) {
        const { error: certNivelError } = await supabase
          .from('nivel_certificados')
          .insert({
            id_nivel: nivelData.id_nivel,
            id_certificados: certInfo.certificado.id_certificado,
            completado: false
          });
        
        if (certNivelError) throw certNivelError;
      }
    }
  } catch (error) {
    console.error('Error saving simulation results:', error);
    throw error;
  }
}
