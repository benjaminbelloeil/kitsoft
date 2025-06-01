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
    const { userProjectId, newUserId } = body;

    if (!userProjectId || !newUserId) {
      return NextResponse.json({ error: 'Missing userProjectId or newUserId' }, { status: 400 });
    }

    // Verify the user is the project lead for this project
    const { data: project, error: projectError } = await supabase
      .from('proyectos')
      .select('id_projectlead')
      .eq('id_proyecto', projectId)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.id_projectlead !== user.id) {
      return NextResponse.json({ error: 'Unauthorized - Not project lead' }, { status: 403 });
    }

    // Get the current user assignment details to preserve role and hours
    const { data: currentAssignment, error: currentError } = await supabase
      .from('usuarios_proyectos')
      .select('id_rol, horas')
      .eq('id_usuario_proyecto', userProjectId)
      .eq('id_proyecto', projectId)
      .single();

    if (currentError || !currentAssignment) {
      return NextResponse.json({ error: 'User assignment not found' }, { status: 404 });
    }

    // Check if the new user exists
    const { data: newUser, error: userError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_usuario', newUserId)
      .single();

    if (userError || !newUser) {
      return NextResponse.json({ error: 'New user not found' }, { status: 404 });
    }

    // Check if the new user is already assigned to this project with the same role
    const { data: existingAssignment } = await supabase
      .from('usuarios_proyectos')
      .select('id_usuario_proyecto')
      .eq('id_proyecto', projectId)
      .eq('id_usuario', newUserId)
      .eq('id_rol', currentAssignment.id_rol);

    if (existingAssignment && existingAssignment.length > 0) {
      return NextResponse.json({ 
        error: 'User is already assigned to this project with the same role' 
      }, { status: 400 });
    }

    // Update the user assignment
    const { data: updatedAssignment, error: updateError } = await supabase
      .from('usuarios_proyectos')
      .update({ id_usuario: newUserId })
      .eq('id_usuario_proyecto', userProjectId)
      .eq('id_proyecto', projectId)
      .select(`
        *,
        usuarios:id_usuario (
          nombre,
          apellido,
          url_avatar
        ),
        roles:id_rol (
          nombre
        )
      `)
      .single();

    if (updateError) {
      console.error('Error updating user assignment:', updateError);
      return NextResponse.json({ 
        error: 'Failed to update user assignment' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'User assignment updated successfully',
      assignment: updatedAssignment 
    });
  } catch (error) {
    console.error('Unexpected error in project-lead change-user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
