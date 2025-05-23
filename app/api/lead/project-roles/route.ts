/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { isProjectLead } from '@/app/lib/auth';

// GET handler to fetch roles configured for a specific project
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Check if current user is a project lead
    const isUserProjectLead = await isProjectLead();
    
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
    
    // Check if current user is a project lead
    const isUserProjectLead = await isProjectLead();
    
    if (!isUserProjectLead) {
      return NextResponse.json(
        { error: 'No tienes permisos para acceder a esta ruta' }, 
        { status: 403 }
      );
    }
    
    // Get request body
    const body = await request.json();
    const { projectId, roleIds } = body;
    
    console.log('POST project-roles: Configuring roles for project', projectId);
    console.log('Role IDs:', roleIds);
    
    if (!projectId || !roleIds || !Array.isArray(roleIds)) {
      console.error('Missing required parameters:', { projectId, roleIds });
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
    
    console.log('Project exists, proceeding with role configuration');
    
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
    
    console.log('Successfully deleted existing roles for project');
    
    // If roleIds is empty, we're just removing all roles
    if (roleIds.length === 0) {
      console.log('No new roles to add');
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
    
    console.log('Inserting new role configurations:', projectRoles);
    
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
    
    console.log('Successfully inserted new role configurations:', insertedRoles);
    
    // Verify the inserted roles by querying the database again
    const { data: verifyRoles, error: verifyError } = await supabase
      .from('proyectos_roles')
      .select('id_rol')
      .eq('id_proyecto', projectId);
      
    if (verifyError) {
      console.error('Error verifying inserted roles:', verifyError);
    } else {
      console.log('Verified roles in database:', verifyRoles?.map(r => r.id_rol));
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
