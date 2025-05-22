/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

/**
 * POST handler for assigning a user to a project with a specific role and hours
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
      );
    }
    
    // Check if current user is a project lead directly
    // Get the user's current level ID
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError) {
      console.error('Error getting user level:', levelError);
      return NextResponse.json(
        { error: 'Error al verificar permisos' },
        { status: 500 }
      );
    }

    // Get the level details to check the numero
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError) {
      console.error('Error getting level details:', detailsError);
      return NextResponse.json(
        { error: 'Error al verificar permisos' },
        { status: 500 }
      );
    }

    // Check if numero equals 3 (Project Lead)
    const isUserProjectLead = levelDetails.numero === 3;
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const { userId, projectId, roleId, hours } = body;
    
    // Validate required fields
    if (!userId || !projectId || !roleId || !hours) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' }, 
        { status: 400 }
      );
    }
    
    if (hours <= 0) {
      return NextResponse.json(
        { error: 'Las horas deben ser un número positivo' }, 
        { status: 400 }
      );
    }
    
    // Check if project exists and is active
    const { data: project, error: projectError } = await supabase
      .from('proyectos')
      .select('*')
      .eq('id_proyecto', projectId)
      .eq('activo', true)
      .single();
      
    if (projectError) {
      console.error('Error fetching project:', projectError);
      return NextResponse.json(
        { error: 'Proyecto no encontrado o inactivo' }, 
        { status: 404 }
      );
    }
    
    // Check if user exists
    const { data: userExists, error: userError } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_usuario', userId)
      .single();
      
    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'Usuario no encontrado' }, 
        { status: 404 }
      );
    }
    
    // Check if role exists
    const { data: roleExists, error: roleError } = await supabase
      .from('roles')
      .select('id_rol')
      .eq('id_rol', roleId)
      .single();
      
    if (roleError) {
      console.error('Error fetching role:', roleError);
      return NextResponse.json(
        { error: 'Rol no encontrado' }, 
        { status: 404 }
      );
    }
    
    // Check if user is already assigned to this project with this role
    const { data: existingAssignment, error: existingError } = await supabase
      .from('usuarios_proyectos')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_proyecto', projectId)
      .eq('id_rol', roleId);
      
    if (existingError) {
      console.error('Error checking existing assignment:', existingError);
      return NextResponse.json(
        { error: 'Error al verificar asignación existente' }, 
        { status: 500 }
      );
    }
    
    // If assignment exists, update hours
    if (existingAssignment && existingAssignment.length > 0) {
      const { data: updated, error: updateError } = await supabase
        .from('usuarios_proyectos')
        .update({ horas: hours })
        .eq('id_usuario_proyecto', existingAssignment[0].id_usuario_proyecto)
        .select();
        
      if (updateError) {
        console.error('Error updating assignment:', updateError);
        return NextResponse.json(
          { error: 'Error al actualizar asignación' }, 
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        message: 'Asignación actualizada exitosamente',
        data: updated
      });
    }
    
    // Create new assignment
    const { data: newAssignment, error: insertError } = await supabase
      .from('usuarios_proyectos')
      .insert({
        id_usuario: userId,
        id_proyecto: projectId,
        id_rol: roleId,
        horas: hours,
        fecha_asignacion: new Date().toISOString()
      })
      .select();
      
    if (insertError) {
      console.error('Error creating assignment:', insertError);
      return NextResponse.json(
        { error: 'Error al crear asignación' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Usuario asignado exitosamente',
      data: newAssignment
    });
    
  } catch (error) {
    console.error('Error in POST assign-user:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
