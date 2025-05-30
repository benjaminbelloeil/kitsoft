import { NextResponse } from 'next/server';
import { simular } from '@/utils/agent/simulation';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id_proyecto } = body;

    if (!id_proyecto) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required field: id_proyecto',
          assignments: [],
          tiempo_total: 0
        },
        { status: 400 }
      );
    }

    console.log(`🚀 Starting agent simulation for project: ${id_proyecto}`);
    const startTime = Date.now();
    
    // Run the agent simulation
    const assignments = await simular(id_proyecto);
    const totalTime = (Date.now() - startTime) / 1000;
    
    if (assignments.length === 0) {
      console.log(`⚠️ No assignments could be made for project: ${id_proyecto}`);
      return NextResponse.json({
        success: false,
        error: 'No suitable candidates found for project roles',
        assignments: [],
        tiempo_total: totalTime
      });
    }

    // Save assignments to database
    const supabase = await createClient();
    
    console.log(`💾 Saving ${assignments.length} assignments to database...`);
    
    const assignmentsToInsert = assignments.map(assignment => ({
      id_proyecto: id_proyecto,
      id_usuario: assignment.empleado_id,
      id_rol: assignment.rol_id,
      horas: 0, // Will be set by project lead later
      titulo: null // Project title will be set later if needed
    }));

    const { error: insertError } = await supabase
      .from('usuarios_proyectos')
      .insert(assignmentsToInsert);

    if (insertError) {
      console.error('Error saving assignments:', insertError);
      return NextResponse.json({
        success: false,
        error: 'Failed to save assignments to database',
        assignments: [],
        tiempo_total: totalTime
      }, { status: 500 });
    }

    // Mark project roles as occupied
    for (const assignment of assignments) {
      await supabase
        .from('proyectos_roles')
        .update({ ocupado: true })
        .eq('id_proyecto', id_proyecto)
        .eq('id_rol', assignment.rol_id);
    }

    console.log(`✅ Agent simulation completed successfully in ${totalTime.toFixed(2)} seconds`);
    console.log(`📋 Assignments made: ${assignments.length}`);
    
    return NextResponse.json({
      success: true,
      message: `Successfully assigned ${assignments.length} team members`,
      assignments,
      tiempo_total: totalTime
    });

  } catch (error) {
    console.error('❌ Agent simulation error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error during simulation',
        assignments: [],
        tiempo_total: 0
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ready',
    message: 'Agent system is ready for project assignments',
    version: '1.0.0'
  });
}
