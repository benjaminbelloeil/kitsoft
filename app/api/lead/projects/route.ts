/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { ProjectUser } from '@/interfaces/project';
import { isProjectLead } from '@/app/lib/auth';

/**
 * GET handler for fetching projects available for project lead users
 * It will fetch all active projects created by the project manager
 */
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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Usuario no autenticado' }, 
        { status: 401 }
      );
    }
    
    // Fetch all active projects
    const { data: projects, error: projectsError } = await supabase
      .from('proyectos')
      .select('*')
      .eq('activo', true)
      .order('fecha_inicio', { ascending: false });
      
    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json(
        { error: 'Error al obtener proyectos' }, 
        { status: 500 }
      );
    }
    
    // For each project, fetch assigned users
    for (const project of projects) {
      try {
        // Get assigned users for this project
        const { data: assignedUsers, error: usersError } = await supabase
          .from('usuarios_proyectos')
          .select(`
            id_usuario_proyecto,
            id_usuario,
            id_proyecto,
            id_rol,
            titulo,
            horas,
            usuarios:usuarios(nombre, apellido)
          `)
          .eq('id_proyecto', project.id_proyecto);
          
        if (usersError) {
          console.error(`Error fetching users for project ${project.id_proyecto}:`, usersError);
          project.usuarios = [];
          continue;
        }
        
        // Always ensure usuarios is an array, never undefined
        project.usuarios = [];
        
        // Log assigned users for debugging
        console.log(`Project ${project.id_proyecto} assigned users:`, 
          assignedUsers ? assignedUsers.length : 0);
        
        // ALWAYS initialize project.usuarios as an empty array
        project.usuarios = [];
        
        // Safely handle the data
        if (assignedUsers && assignedUsers.length > 0) {
          try {
            // Map assigned users to ProjectUser objects
            project.usuarios = assignedUsers.map(item => {
              // Extract user data from nested structure, with defaults for all fields
              const userData = {
                id_usuario_proyecto: item.id_usuario_proyecto || '',
                id_usuario: item.id_usuario || '',
                id_proyecto: item.id_proyecto || '',
                id_rol: item.id_rol || '',
                titulo: item.titulo || '',
                horas: item.horas || 0,
                nombre: '',
                apellido: ''
              };
              
              // Handle usuario details if present
              if (item.usuarios) {
                // In Supabase, foreign table data could be an object or array - check the structure
                if (Array.isArray(item.usuarios)) {
                  if (item.usuarios.length > 0) {
                    userData.nombre = item.usuarios[0]?.nombre || '';
                    userData.apellido = item.usuarios[0]?.apellido || '';
                  }
                } else {
                  // Type assertion to handle the object case
                  const userInfo = item.usuarios as { nombre?: string; apellido?: string };
                  userData.nombre = userInfo?.nombre || '';
                  userData.apellido = userInfo?.apellido || '';
                }
              }
              
              return userData;
            });
            
            console.log(`Processed ${project.usuarios.length} users for project ${project.id_proyecto}`);
          } catch (err) {
            console.error(`Error mapping users for project ${project.id_proyecto}:`, err);
            project.usuarios = []; // Reset to empty array on error
          }
        }
      } catch (err) {
        console.error(`Error formatting users for project ${project.id_proyecto}:`, err);
        project.usuarios = [];
      }
      
      try {
        // Get roles available for this project
        const { data: projectRoles, error: rolesError } = await supabase
          .from('proyectos_roles')
          .select(`
            id_proyecto,
            id_rol,
            roles(id_rol, nombre, descripcion)
          `)
          .eq('id_proyecto', project.id_proyecto);
          
        if (rolesError) {
          console.error(`Error fetching roles for project ${project.id_proyecto}:`, rolesError);
          project.roles = [];
          continue;
        }
        
        // ALWAYS initialize project.roles as an empty array
        project.roles = [];
        
        // Log project roles for debugging
        console.log(`Project ${project.id_proyecto} has ${projectRoles ? projectRoles.length : 0} configured roles`);
        
        if (projectRoles && projectRoles.length > 0) {
          try {
            // Map project roles to Role objects
            project.roles = projectRoles.map(item => {
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
            
            console.log(`Processed ${project.roles.length} roles for project ${project.id_proyecto}`);
          } catch (err) {
            console.error(`Error mapping roles for project ${project.id_proyecto}:`, err);
            project.roles = []; // Reset to empty array on error
          }
        }
      } catch (err) {
        console.error(`Error formatting roles for project ${project.id_proyecto}:`, err);
        project.roles = [];
      }
      
      // Get client info
      const { data: client, error: clientError } = await supabase
        .from('clientes')
        .select('nombre')
        .eq('id_cliente', project.id_cliente)
        .single();
        
      if (clientError) {
        console.error(`Error fetching client for project ${project.id_proyecto}:`, clientError);
      } else {
        project.cliente = client?.nombre || 'Cliente desconocido';
      }
    }

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET projects for lead:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    );
  }
}
