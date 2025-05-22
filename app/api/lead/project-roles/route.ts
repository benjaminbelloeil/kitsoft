/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// GET handler to fetch roles configured for a specific project
export async function GET(request: Request) {
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
    
    // Get project ID from query params
    const url = new URL(request.url);
    const projectId = url.searchParams.get('projectId');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Se requiere ID del proyecto' }, 
        { status: 400 }
      );
    }
    
    // Fetch roles configured for this project
    const { data: projectRoles, error: rolesError } = await supabase
      .from('proyectos_roles')
      .select(`
        id_proyecto,
        id_rol,
        roles(id_rol, nombre, descripcion)
      `)
      .eq('id_proyecto', projectId);
      
    if (rolesError) {
      console.error('Error fetching project roles:', rolesError);
      return NextResponse.json(
        { error: 'Error al obtener roles del proyecto' }, 
        { status: 500 }
      );
    }
    
    // Format project roles
    const formattedRoles = projectRoles.map(item => {
      if (item.roles) {
        // Handle both array and object structures
        if (Array.isArray(item.roles)) {
          return item.roles[0] || { id_rol: item.id_rol, nombre: 'Rol sin nombre', descripcion: null };
        } else {
          return item.roles;
        }
      }
      return { id_rol: item.id_rol, nombre: 'Rol sin nombre', descripcion: null };
    });

    return NextResponse.json(formattedRoles);
  } catch (error) {
    console.error('Error in GET project-roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}

// POST handler to configure roles for a project
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
    
    // Check if current user is a project lead
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

    const isUserProjectLead = levelDetails.numero === 3;
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { projectId, roleIds } = body;
    
    if (!projectId || !roleIds || !Array.isArray(roleIds)) {
      return NextResponse.json(
        { error: 'Se requiere ID del proyecto y un array de roles' }, 
        { status: 400 }
      );
    }
    
    // Check if project exists
    const { data: projectExists, error: projectError } = await supabase
      .from('proyectos')
      .select('id_proyecto')
      .eq('id_proyecto', projectId)
      .single();
      
    if (projectError) {
      console.error('Error checking project:', projectError);
      return NextResponse.json(
        { error: 'Proyecto no encontrado' }, 
        { status: 404 }
      );
    }
    
    // Step 1: Delete existing role configurations for this project
    const { error: deleteError } = await supabase
      .from('proyectos_roles')
      .delete()
      .eq('id_proyecto', projectId);
      
    if (deleteError) {
      console.error('Error deleting existing roles:', deleteError);
      return NextResponse.json(
        { error: 'Error al actualizar roles del proyecto' }, 
        { status: 500 }
      );
    }
    
    // If roleIds is empty, we're just removing all roles
    if (roleIds.length === 0) {
      return NextResponse.json({
        message: 'Roles del proyecto actualizados exitosamente',
        data: []
      });
    }
    
    // Step 2: Insert new role configurations
    const projectRoles = roleIds.map(roleId => ({
      id_proyecto: projectId,
      id_rol: roleId
    }));
    
    const { data: insertedRoles, error: insertError } = await supabase
      .from('proyectos_roles')
      .insert(projectRoles)
      .select();
      
    if (insertError) {
      console.error('Error inserting roles:', insertError);
      return NextResponse.json(
        { error: 'Error al configurar roles del proyecto' }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Roles del proyecto configurados exitosamente',
      data: insertedRoles
    });
  } catch (error) {
    console.error('Error in POST project-roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
