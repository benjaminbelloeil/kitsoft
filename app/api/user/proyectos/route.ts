/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'active';
    const userId = searchParams.get('userId') || user.id;

    // Determine the active filter based on status
    const activoFilter = status === 'active' ? true : status === 'archived' ? false : undefined;

    // Get projects where the user is assigned and filter by status
    const { data: userProjects, error: userProjectsError } = await supabase
      .from('usuarios_proyectos')
      .select(`
        id_usuario_proyecto,
        id_usuario,
        id_proyecto,
        id_rol,
        horas,
        proyectos!inner (
          id_proyecto,
          titulo,
          descripcion,
          id_cliente,
          id_projectlead,
          fecha_inicio,
          fecha_fin,
          activo,
          horas_totales,
          clientes (
            id_cliente,
            nombre,
            correo,
            telefono,
            direccion,
            url_logo
          ),
          usuarios!id_projectlead (
            id_usuario,
            nombre,
            apellido
          )
        ),
        roles (
          id_rol,
          nombre
        )
      `)
      .eq('id_usuario', userId)
      .eq('proyectos.activo', activoFilter);

    if (userProjectsError) {
      console.error('Error fetching user projects:', userProjectsError);
      return NextResponse.json({ error: 'Failed to fetch user projects' }, { status: 500 });
    }

    if (!userProjects || userProjects.length === 0) {
      return NextResponse.json([]);
    }

    // Define a type for our project structure
    interface ProjectData {
      id_proyecto: string;
      titulo: string;
      descripcion: string;
      id_cliente: string;
      id_projectlead: string;
      fecha_inicio: string;
      fecha_fin: string | null;
      activo: boolean;
      horas_totales: number;
      cliente: string;
      clientData: Record<string, any> | null;
      project_lead: { id_usuario: string; nombre: string; apellido: string } | null;
      user_role: string;
      user_hours: number;
      assignedUsers: Array<{
        id_usuario_proyecto: string;
        id_usuario: string;
        id_proyecto: string;
        id_rol: string;
        horas: number;
        nombre: string;
        apellido: string;
        url_avatar: string | null;
        rol_nombre: string;
      }>;
    }

    // First transform projects to a unique map/object
    const uniqueProjects: { [key: string]: ProjectData } = {};
    
    userProjects.forEach(up => {
      // Handle the fact that Supabase returns arrays for related data
      const proyectos = up.proyectos as Record<string, any> | Record<string, any>[];
      const roles = up.roles as Record<string, any> | Record<string, any>[];
      
      const project = Array.isArray(proyectos) ? proyectos[0] : proyectos;
      const role = Array.isArray(roles) ? roles[0] : roles;
      
      // Handle nested relationships
      const clientes = project?.clientes as Record<string, any> | Record<string, any>[];
      const usuarios = project?.usuarios as Record<string, any> | Record<string, any>[];
      
      const cliente = Array.isArray(clientes) ? clientes[0] : clientes;
      const usuario = Array.isArray(usuarios) ? usuarios[0] : usuarios;
      
      // If this project isn't in our map yet, add it
      if (!uniqueProjects[project?.id_proyecto]) {
        uniqueProjects[project?.id_proyecto] = {
          id_proyecto: project?.id_proyecto,
          titulo: project?.titulo,
          descripcion: project?.descripcion,
          id_cliente: project?.id_cliente,
          id_projectlead: project?.id_projectlead,
          fecha_inicio: project?.fecha_inicio,
          fecha_fin: project?.fecha_fin,
          activo: project?.activo,
          horas_totales: project?.horas_totales,
          cliente: cliente?.nombre || 'Cliente Desconocido',
          clientData: cliente || null, // Include full client data
          project_lead: usuario ? {
            id_usuario: usuario.id_usuario,
            nombre: usuario.nombre,
            apellido: usuario.apellido
          } : null,
          user_role: role?.nombre,
          user_hours: up.horas,
          assignedUsers: [] // Initialize empty array for assigned users
        };
      }
    });
    
    // Fetch all assigned users for these projects
    const projectIds = Object.keys(uniqueProjects);
    
    if (projectIds.length > 0) {
      const { data: assignedUsers, error: assignedUsersError } = await supabase
        .from('usuarios_proyectos')
        .select(`
          id_usuario_proyecto,
          id_usuario,
          id_proyecto,
          id_rol,
          horas,
          usuarios (
            id_usuario,
            nombre,
            apellido,
            url_avatar
          ),
          roles (
            id_rol,
            nombre
          )
        `)
        .in('id_proyecto', projectIds);
      
      if (assignedUsersError) {
        console.error('Error fetching assigned users:', assignedUsersError);
      } else if (assignedUsers) {
        // Add the users to their respective projects
        assignedUsers.forEach(user => {
          const projectId = user.id_proyecto;
          if (uniqueProjects[projectId]) {
            // Process user data like in project-lead API
            const usuarios = user.usuarios as Record<string, any> | Record<string, any>[];
            const roles = user.roles as Record<string, any> | Record<string, any>[];
            
            const usuario = Array.isArray(usuarios) ? usuarios[0] : usuarios;
            const rol = Array.isArray(roles) ? roles[0] : roles;
            
            uniqueProjects[projectId].assignedUsers.push({
              id_usuario_proyecto: user.id_usuario_proyecto,
              id_usuario: user.id_usuario,
              id_proyecto: user.id_proyecto,
              id_rol: user.id_rol,
              horas: user.horas,
              nombre: usuario?.nombre || '',
              apellido: usuario?.apellido || '',
              url_avatar: usuario?.url_avatar || null,
              rol_nombre: rol?.nombre || ''
            });
          }
        });
      }
    }
    
    // Convert the map back to an array
    const projects = Object.values(uniqueProjects);

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Unexpected error in user projects API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
