import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Verify that the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get paths for the current user with their levels and certificates
    const { data: paths, error: pathsError } = await supabase
      .from('paths')
      .select(`
        id_path,
        meta,
        descripcion,
        fecha_inicio,
        completado,
        path_nivel (
          id_nivel,
          numero,
          status,
          nivel_certificados (
            id_certificados,
            completado,
            certificados (
              id_certificado,
              curso,
              descripcion
            )
          )
        )
      `)
      .eq('id_usuario', user.id)
      .order('fecha_inicio', { ascending: false });

    if (pathsError) {
      console.error('Error fetching paths:', pathsError);
      return NextResponse.json(
        { error: 'Error al obtener las trayectorias', details: pathsError.message },
        { status: 500 }
      );
    }

    // Transform the data to match the UI expectations

    
    const transformedPaths = paths?.map((path, index) => ({
      id: index + 1, // Use sequential ID for UI
      id_path: path.id_path, // Keep the actual UUID
      title: path.meta || 'Trayectoria sin nombre',
      description: path.descripcion || 'Sin descripción',
      completed: path.completado || false,
      fecha_inicio: path.fecha_inicio, // Include start date
      levels: path.path_nivel?.sort((a, b) => (a.numero || 0) - (b.numero || 0)).map((nivel, levelIndex) => ({
        id: nivel.id_nivel,
        name: `Nivel ${nivel.numero || levelIndex + 1}`,
        completed: nivel.status === 'completado',
        current: nivel.status === 'en_progreso' || nivel.status === 'actual',
        certificates: nivel.nivel_certificados?.map(nc => ({
          id: nc.certificados?.id_certificado,
          name: nc.certificados?.curso,
          description: nc.certificados?.descripcion,
          completed: nc.completado
        })) || []
      })) || [],
      // Extract all certificates for the path
      allCertificates: path.path_nivel?.flatMap(nivel => 
        nivel.nivel_certificados?.map(nc => ({
          id: nc.certificados?.id_certificado,
          name: nc.certificados?.curso,
          description: nc.certificados?.descripcion,
          completed: nc.completado,
          level: nivel.numero
        })) || []
      ) || []
    })) || [];

    return NextResponse.json({
      success: true,
      paths: transformedPaths
    });

  } catch (error: unknown) {
    console.error('Unexpected error in trajectory list API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
