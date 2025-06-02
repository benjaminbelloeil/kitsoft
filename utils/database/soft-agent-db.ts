/* eslint-disable @typescript-eslint/no-explicit-any */
// Database functions for SOFT agent certificate path optimization

import { createClient } from '@supabase/supabase-js';
import type { 
  Certificate, 
  CareerPath, 
  CertificateSkill, 
  RequiredPathSkill,
  PathOptimizationResult,
  SOFTDatabaseFunctions 
} from '@/interfaces/soft-agent';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

class SOFTAgentDatabase implements SOFTDatabaseFunctions {
  
  async getTrayectorias(): Promise<CareerPath[]> {
    const { data, error } = await supabase
      .from('trayectorias_carrera')
      .select(`
        id_trayectoria,
        nombre,
        descripcion,
        nivel_inicial,
        nivel_final,
        duracion_estimada,
        habilidades_requeridas:trayectoria_habilidades(
          id_habilidad,
          nivel_requerido,
          peso,
          prioridad
        )
      `)
      .eq('activo', true);

    if (error) throw error;
    return data || [];
  }

  async getCertificadosDisponibles(): Promise<Certificate[]> {
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        id_certificado,
        nombre,
        descripcion,
        proveedor,
        dificultad,
        duracion_estimada,
        costo,
        fecha_actualizacion,
        activo,
        habilidades:certificado_habilidades(
          id_habilidad,
          nivel_experiencia,
          peso,
          es_prerequisito
        )
      `)
      .eq('activo', true);

    if (error) throw error;
    return data || [];
  }

  async getHabilidadesCertificado(certificadoId: string): Promise<CertificateSkill[]> {
    const { data, error } = await supabase
      .from('certificado_habilidades')
      .select(`
        id_habilidad,
        nivel_experiencia,
        peso,
        es_prerequisito
      `)
      .eq('id_certificado', certificadoId);

    if (error) throw error;
    return data || [];
  }

  async getHabilidadesRequeridas(trayectoriaId: string): Promise<RequiredPathSkill[]> {
    const { data, error } = await supabase
      .from('trayectoria_habilidades')
      .select(`
        id_habilidad,
        nivel_requerido,
        peso,
        prioridad
      `)
      .eq('id_trayectoria', trayectoriaId);

    if (error) throw error;
    return data || [];
  }

  async getCertificadosUsuario(usuarioId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('usuario_certificados')
      .select('id_certificado')
      .eq('id_usuario', usuarioId)
      .eq('obtenido', true);

    if (error) throw error;
    return data?.map(item => item.id_certificado) || [];
  }

  async savePathOptimization(result: PathOptimizationResult): Promise<void> {
    const { error } = await supabase
      .from('optimizaciones_trayectoria')
      .insert({
        trayectoria_id: result.trayectoria_id,
        niveles: result.niveles,
        score_total: result.score_total,
        num_evaluaciones: result.num_evaluaciones,
        tiempo_estimado: result.tiempo_estimado,
        costo_estimado: result.costo_estimado,
        fecha_creacion: new Date().toISOString()
      });

    if (error) throw error;
  }

  // Additional helper functions
  async getSkillInfo(skillId: string): Promise<any> {
    const { data, error } = await supabase
      .from('habilidades')
      .select('*')
      .eq('id_habilidad', skillId)
      .single();

    if (error) throw error;
    return data;
  }

  async getCertificatePrerequisites(certificadoId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('certificado_prerequisitos')
      .select('id_certificado_prerequisito')
      .eq('id_certificado', certificadoId);

    if (error) throw error;
    return data?.map(item => item.id_certificado_prerequisito) || [];
  }

  async getMarketDemandData(skillIds: string[]): Promise<Map<string, number>> {
    const { data, error } = await supabase
      .from('demanda_mercado_habilidades')
      .select('id_habilidad, demanda_score')
      .in('id_habilidad', skillIds);

    if (error) throw error;
    
    const demandMap = new Map<string, number>();
    data?.forEach(item => {
      demandMap.set(item.id_habilidad, item.demanda_score || 0.5);
    });
    
    return demandMap;
  }

  async getUserSkillLevels(usuarioId: string): Promise<Map<string, number>> {
    const { data, error } = await supabase
      .from('usuario_habilidades')
      .select('id_habilidad, nivel_experiencia')
      .eq('id_usuario', usuarioId)
      .eq('validado', true);

    if (error) throw error;
    
    const skillMap = new Map<string, number>();
    data?.forEach(item => {
      skillMap.set(item.id_habilidad, item.nivel_experiencia);
    });
    
    return skillMap;
  }
}

export const softAgentDatabase = new SOFTAgentDatabase();
