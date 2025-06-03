/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // Verify that the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all paths for the current user
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
          status
        )
      `)
      .eq('id_usuario', user.id);

    console.log('Fetched paths for user:', user.id, paths);

    if (pathsError) {
      console.error('Error fetching paths:', pathsError);
      return NextResponse.json(
        { error: 'Error al obtener las trayectorias', details: pathsError.message },
        { status: 500 }
      );
    }

    const completedPathCards = [];
    
    for (const path of paths || []) {
      console.log(`Checking path ${path.id_path}:`, {
        meta: path.meta,
        completado: path.completado,
        levels: path.path_nivel
      });
      
      const levels = path.path_nivel || [];
      const allLevelsCompleted = levels.length > 0 && 
        levels.every((level: any) => level.status === 'completado');

      // Handle newly completed paths
      if (!path.completado && allLevelsCompleted) {
        console.log(`🎉 Path ${path.id_path} is newly completed! Marking as completed...`);
        
        // Mark the path as completed
        const { error: updateError } = await supabase
          .from('paths')
          .update({ completado: true })
          .eq('id_path', path.id_path);

        if (updateError) {
          console.error(`Error updating path ${path.id_path}:`, updateError);
        } else {
          console.log(`Successfully marked path ${path.id_path} as completed`);
          path.completado = true; // Update local object
        }
      }

      // Process all completed paths (both newly completed and previously completed)
      if (path.completado || allLevelsCompleted) {
        console.log(`Processing completed path ${path.id_path}...`);
        
        // Get all certificates from all levels of this path and count completed ones
        const { data: pathCertificates, error: certError } = await supabase
          .from('path_nivel')
          .select(`
            id_nivel,
            numero,
            nivel_certificados (
              id_certificados,
              completado,
              certificados!inner (
                id_certificado,
                curso,
                descripcion
              )
            )
          `)
          .eq('id_path', path.id_path)
          .order('numero');

        if (certError) {
          console.error(`Error fetching certificates for path ${path.id_path}:`, certError);
        }

        // Count total certificates and completed certificates across all levels
        let totalCertificatesAvailable = 0;
        let completedCertificatesCount = 0;
        const obtainedCertificateNames: string[] = [];

        if (pathCertificates) {
          for (const level of pathCertificates) {
            if (level.nivel_certificados) {
              for (const cert of level.nivel_certificados) {
                totalCertificatesAvailable++;
                if (cert.completado) {
                  completedCertificatesCount++;
                  const certData = cert.certificados as any;
                  if (certData?.curso) {
                    obtainedCertificateNames.push(certData.curso);
                  }
                }
              }
            }
          }
        }

        console.log(`Path ${path.id_path} certificate stats:`, {
          totalAvailable: totalCertificatesAvailable,
          completed: completedCertificatesCount,
          certificateNames: obtainedCertificateNames
        });

        // Generate a realistic credential ID with shorter format
        const generateCredentialID = () => {
          const year = new Date().getFullYear();
          const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit number
          const pathCode = path.id_path.slice(-2).toUpperCase(); // Only last 2 chars
          return `ACC-${year}-${pathCode}${randomNum}`;
        };
        
        // Create a single card for this completed path
        const pathCard = {
          id: `path-completion-${path.id_path}`,
          title: path.meta ?? 'Trayectoria Profesional',
          description: path.descripcion ?? `Has completado exitosamente todos los niveles de la trayectoria: ${path.meta}`,
          progress: 100,
          status: 'completed',
          completionDate: new Date().toISOString().split('T')[0],
          category: 'Trayectoria Profesional',
          pathInfo: {
            id: path.id_path,
            name: path.meta,
            description: path.descripcion,
            startDate: path.fecha_inicio,
            totalLevels: levels.length,
            completedLevels: levels.filter((l: any) => l.status === 'completado').length,
            totalCertificatesAvailable: totalCertificatesAvailable, // Actual certificates available in this path
            certificatesObtained: completedCertificatesCount // Actual certificates the user completed
          },
          certificates: obtainedCertificateNames,
          levels: levels.map((level: any, index: number) => ({
            number: level.numero ?? index + 1,
            status: level.status,
            completed: level.status === 'completado'
          })),
          imgUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
          certificate: {
            id: `path-cert-${path.id_path}`,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            credentialID: generateCredentialID()
          }
        };

        completedPathCards.push(pathCard);
        console.log(`Created path completion card for ${path.id_path}:`, pathCard.title);
      } else {
        console.log(`Path ${path.id_path} not yet completed - ${levels.filter((l: any) => l.status === 'completado').length}/${levels.length} levels completed`);
      }
    }

    console.log(`Final result: Found ${completedPathCards.length} completed paths`);
    
    return NextResponse.json({
      success: true,
      completedPaths: completedPathCards.length,
      certificates: completedPathCards,
      debug: {
        userId: user.id,
        totalPaths: paths?.length ?? 0,
        pathsData: paths?.map(p => ({
          id: p.id_path,
          meta: p.meta,
          completado: p.completado,
          levelCount: p.path_nivel?.length ?? 0,
          levels: p.path_nivel?.map(l => ({ numero: l.numero, status: l.status }))
        }))
      }
    });

  } catch (error: unknown) {
    console.error('Unexpected error in path completion API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
