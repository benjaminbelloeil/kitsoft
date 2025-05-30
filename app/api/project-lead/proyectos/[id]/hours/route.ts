import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const resolvedParams = await params;
    const projectId = resolvedParams.id;

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { hourAssignments } = body;

    if (!hourAssignments || typeof hourAssignments !== 'object') {
      return NextResponse.json({ error: 'Invalid hour assignments data' }, { status: 400 });
    }

    // Verify the user is the project lead for this project
    const { data: project, error: projectError } = await supabase
      .from('proyectos')
      .select('id_projectlead, horas_totales')
      .eq('id_proyecto', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.id_projectlead !== user.id) {
      return NextResponse.json({ error: 'Unauthorized - Not project lead' }, { status: 403 });
    }

    // Validate total hours don't exceed project total
    const totalAssignedHours = Object.values(hourAssignments).reduce((sum: number, hours) => sum + (Number(hours) || 0), 0);
    if (totalAssignedHours > project.horas_totales) {
      return NextResponse.json({ 
        error: `Total assigned hours (${totalAssignedHours}) exceed project total (${project.horas_totales})` 
      }, { status: 400 });
    }

    // Update hour assignments for each user
    const updates = [];
    for (const [usuarioProyectoId, hours] of Object.entries(hourAssignments)) {
      const { data, error } = await supabase
        .from('usuarios_proyectos')
        .update({ horas: Number(hours) || 0 })
        .eq('id_usuario_proyecto', usuarioProyectoId)
        .eq('id_proyecto', projectId)
        .select();

      if (error) {
        console.error(`Error updating hours for user project ${usuarioProyectoId}:`, error);
        return NextResponse.json({ 
          error: `Failed to update hours for user assignment ${usuarioProyectoId}` 
        }, { status: 500 });
      }

      updates.push(data[0]);
    }

    return NextResponse.json({ 
      message: 'Hour assignments updated successfully',
      updates 
    });
  } catch (error) {
    console.error('Unexpected error in project-lead hour assignment API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
