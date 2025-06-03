/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Function to generate dynamic Unsplash images based on path title
function generateDynamicImage(pathTitle: string): string {
  // Curated list of high-quality technology-focused Unsplash images
  const technologyImages = [
    // Programming & Coding
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Code on laptop
    'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Web development
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Frontend code
    'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Programming setup
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Coding workspace
    
    // Data & Analytics
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Data analytics
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Charts dashboard
    'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Data visualization
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Analytics screen
    
    // Mobile & App Development
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Mobile app design
    'https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // App development
    'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Mobile interface
    
    // AI & Machine Learning
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // AI/ML concept
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Machine learning
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Technology concept
    
    // Cloud & DevOps
    'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Server/cloud
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Database/server
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // API development
    
    // Cybersecurity
    'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Cybersecurity
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Binary code security
    
    // General Technology
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Technology workspace
    'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Education tech
    'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', // Digital workspace
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'  // Programming environment
  ];
  
  // Generate a consistent seed based on the path title
  const seed = pathTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Select image based on seed for consistency
  const imageIndex = seed % technologyImages.length;
  
  return technologyImages[imageIndex];
}

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



    if (pathsError) {
      console.error('Error fetching paths:', pathsError);
      return NextResponse.json(
        { error: 'Error al obtener las trayectorias', details: pathsError.message },
        { status: 500 }
      );
    }

    const completedPathCards = [];
    
    for (const path of paths || []) {
      
      const levels = path.path_nivel || [];
      const allLevelsCompleted = levels.length > 0 && 
        levels.every((level: any) => level.status === 'completado');

      // Handle newly completed paths
      if (!path.completado && allLevelsCompleted) {
        
        // Mark the path as completed
        const { error: updateError } = await supabase
          .from('paths')
          .update({ completado: true })
          .eq('id_path', path.id_path);

        if (updateError) {
          console.error(`Error updating path ${path.id_path}:`, updateError);
        } else {
          path.completado = true; // Update local object
        }
      }

      // Process all completed paths (both newly completed and previously completed)
      if (path.completado || allLevelsCompleted) {
        
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
          imgUrl: generateDynamicImage(path.meta ?? 'Trayectoria Profesional'),
          certificate: {
            id: `path-cert-${path.id_path}`,
            issueDate: new Date().toISOString().split('T')[0],
            validUntil: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            credentialID: generateCredentialID()
          }
        };

        completedPathCards.push(pathCard);
      } else {
      }
    }
    
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
