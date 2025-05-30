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
            nombre
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

    // Transform the data to match the expected format
    const projects = userProjects.map(up => {
      // Handle the fact that Supabase returns arrays for related data
      const proyectos = up.proyectos as unknown;
      const roles = up.roles as unknown;
      
      const project = Array.isArray(proyectos) ? proyectos[0] : proyectos;
      const role = Array.isArray(roles) ? roles[0] : roles;
      
      // Handle nested relationships
      const clientes = project?.clientes as unknown;
      const usuarios = project?.usuarios as unknown;
      
      const cliente = Array.isArray(clientes) ? clientes[0] : clientes;
      const usuario = Array.isArray(usuarios) ? usuarios[0] : usuarios;
      
      return {
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
        project_lead: usuario ? {
          id_usuario: usuario.id_usuario,
          nombre: usuario.nombre,
          apellido: usuario.apellido
        } : null,
        user_role: role?.nombre,
        user_hours: up.horas
      };
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Unexpected error in user projects API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
