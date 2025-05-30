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

    // Get the project lead's ID from query params or use the current user's ID
    const { searchParams } = new URL(request.url);
    const projectLeadId = searchParams.get('id') || user.id;

    // Get projects where the user is the project lead and project is active
    const { data: projects, error: projectsError } = await supabase
      .from('proyectos')
      .select(`
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
          nombre
        )
      `)
      .eq('id_projectlead', projectLeadId)
      .eq('activo', true)
      .order('fecha_inicio', { ascending: false });

    if (projectsError) {
      console.error('Error fetching projects:', projectsError);
      return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
    }

    if (!projects || projects.length === 0) {
      return NextResponse.json([]);
    }

    // Get assigned users for each project
    const projectIds = projects.map(p => p.id_proyecto);
    
    const { data: projectUsers, error: usersError } = await supabase
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

    if (usersError) {
      console.error('Error fetching project users:', usersError);
      return NextResponse.json({ error: 'Failed to fetch project users' }, { status: 500 });
    }

    // Enhance projects with assigned users and calculate totals
    const enhancedProjects = projects.map(project => {
      const assignedUsers = (projectUsers || [])
        .filter(pu => pu.id_proyecto === project.id_proyecto)
        .map(pu => {
          // Handle the fact that Supabase returns arrays for related data
          const usuarios = pu.usuarios as unknown;
          const roles = pu.roles as unknown;
          
          const usuario = Array.isArray(usuarios) ? usuarios[0] : usuarios;
          const rol = Array.isArray(roles) ? roles[0] : roles;
          
          return {
            id_usuario_proyecto: pu.id_usuario_proyecto,
            id_usuario: pu.id_usuario,
            id_proyecto: pu.id_proyecto,
            id_rol: pu.id_rol,
            horas: pu.horas,
            nombre: usuario?.nombre || '',
            apellido: usuario?.apellido || '',
            url_avatar: usuario?.url_avatar || null,
            rol_nombre: rol?.nombre || ''
          };
        });

      const assignedHours = assignedUsers.reduce((total, user) => total + (user.horas || 0), 0);
      const assignedPercentage = project.horas_totales > 0 ? Math.round((assignedHours / project.horas_totales) * 100) : 0;

      // Handle clientes which might be an array
      const clientes = project.clientes as unknown;
      const cliente = Array.isArray(clientes) ? clientes[0] : clientes;

      return {
        ...project,
        cliente: cliente?.nombre || 'Cliente Desconocido',
        assignedUsers,
        assignedHours,
        assignedPercentage,
        availableHours: project.horas_totales - assignedHours
      };
    });

    return NextResponse.json(enhancedProjects);
  } catch (error) {
    console.error('Unexpected error in project-lead projects API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
