/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { runSimulation } from '@/utils/soft-agent/main';

interface TrajectoryData {
  nombre: string;
  descripcion: string;
  fecha_inicio: string;
  roles: number[];
  habilidades: number[];
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify that the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const trajectoryData: TrajectoryData = await request.json();
    
    // Validate required fields
    if (!trajectoryData.nombre || !trajectoryData.descripcion) {
      return NextResponse.json(
        { error: 'Nombre y descripción son requeridos' },
        { status: 400 }
      );
    }

    if (!trajectoryData.roles || trajectoryData.roles.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos un rol' },
        { status: 400 }
      );
    }

    if (!trajectoryData.habilidades || trajectoryData.habilidades.length === 0) {
      return NextResponse.json(
        { error: 'Debe seleccionar al menos una habilidad' },
        { status: 400 }
      );
    }

    // Generate UUID for the new path
    const pathId = crypto.randomUUID();
    
    // Prepare path data
    const pathRecord = {
      id_path: pathId,
      meta: trajectoryData.nombre, // Using 'meta' field instead of 'nombre'
      descripcion: trajectoryData.descripcion,
      fecha_inicio: trajectoryData.fecha_inicio || new Date().toISOString().split('T')[0],
      id_usuario: user.id,
      completado: false // Using 'completado' instead of 'activo'
    };

    // Start transaction - Insert main path record
    const { error: pathError } = await supabase
      .from('paths')
      .insert(pathRecord);
    
    if (pathError) {
      console.error('Error creating path:', pathError);
      return NextResponse.json(
        { error: 'Error al crear la trayectoria', details: pathError.message },
        { status: 500 }
      );
    }

    // Insert path-roles relationships
    if (trajectoryData.roles.length > 0) {
      const pathRoleRecords = trajectoryData.roles.map(roleId => ({
        id_path: pathId,
        id_rol: roleId
      }));

      const { error: rolesError } = await supabase
        .from('path_roles')
        .insert(pathRoleRecords);

      if (rolesError) {
        console.error('Error creating path-roles relationships:', rolesError);
        // Try to rollback by deleting the path record
        await supabase.from('paths').delete().eq('id_path', pathId);
        return NextResponse.json(
          { error: 'Error al asignar roles a la trayectoria', details: rolesError.message },
          { status: 500 }
        );
      }
    }

    // Insert path-habilidades relationships
    if (trajectoryData.habilidades.length > 0) {
      const pathHabilidadRecords = trajectoryData.habilidades.map(habilidadId => ({
        id_path: pathId,
        id_habilidad: habilidadId
      }));

      const { error: habilidadesError } = await supabase
        .from('path_habilidades')
        .insert(pathHabilidadRecords);

      if (habilidadesError) {
        console.error('Error creating path-habilidades relationships:', habilidadesError);
        // Try to rollback by deleting the path and path_roles records
        await supabase.from('path_roles').delete().eq('id_path', pathId);
        await supabase.from('paths').delete().eq('id_path', pathId);
        return NextResponse.json(
          { error: 'Error al asignar habilidades a la trayectoria', details: habilidadesError.message },
          { status: 500 }
        );
      }
    }

    // Trigger SOFT agent simulation in the background (don't wait for it)
    runSOFTSimulationAsync(pathId).catch(error => {
      console.error('Background SOFT simulation failed:', error);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Trayectoria creada exitosamente',
      id_path: pathId
    });

  } catch (error: any) {
    console.error('Unexpected error in trajectory creation API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error.message },
      { status: 500 }
    );
  }
}

// Helper function to run SOFT agent simulation in background
async function runSOFTSimulationAsync(pathId: string) {
  try {
    const model = await runSimulation(pathId);
    
    if (model) {
      const mejorScore = model.getMejorScore();
      const mejorSolucion = model.getMejorSolucion();
      console.log(`✅ SOFT simulation completed successfully`);
      console.log(`📊 Best score achieved: ${mejorScore}`);
      console.log(`🎯 Solution levels generated: ${mejorSolucion?.length ?? 0}`);
    } else {
      console.warn(`⚠️ SOFT simulation failed - no model returned`);
    }
  } catch (error) {
    console.error(`❌ SOFT simulation error:`, error);
  }
}
