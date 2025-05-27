import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 401 }
      );
    }
    
    // Get the userId from query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the user is a people lead (nivel.numero === 2)
    const { data: userLevelData, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();

    if (levelError || !userLevelData) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get the level details to check if People Lead (numero === 2)
    const { data: levelDetails, error: detailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelData.id_nivel_actual)
      .single();

    if (detailsError || !levelDetails || levelDetails.numero !== 2) {
      return NextResponse.json(
        { error: 'Unauthorized - People Lead access required' },
        { status: 403 }
      );
    }

    // Check if the requested user is assigned to this People Lead
    const { data: targetUserData, error: targetUserError } = await supabase
      .from('usuarios')
      .select('id_peoplelead')
      .eq('id_usuario', userId)
      .single();

    if (targetUserError || !targetUserData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the requesting People Lead is assigned to the target user
    if (targetUserData.id_peoplelead !== user.id) {
      return NextResponse.json(
        { error: 'You can only access certificates of your assigned team members' },
        { status: 403 }
      );
    }

    // Get the certificates for this user using a manual join approach
    const { data: userCerts, error } = await supabase
      .from('usuarios_certificados')
      .select('fecha_inicio, fecha_fin, url_archivo, id_certificado')
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error fetching user certificates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user certificates' },
        { status: 500 }
      );
    }

    if (!userCerts || userCerts.length === 0) {
      return NextResponse.json([]);
    }

    // Get certificate details for all user certificates
    const certificateIds = userCerts.map(uc => uc.id_certificado);
    const { data: certificates, error: certError } = await supabase
      .from('certificados')
      .select('id_certificado, curso, descripcion, url_pagina_certificado, vigencia_meses')
      .in('id_certificado', certificateIds);

    if (certError) {
      console.error('Error fetching certificate details:', certError);
      return NextResponse.json(
        { error: 'Failed to fetch certificate details' },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format for ReadOnlyCertificatesSection
    const transformedData = userCerts.map(userCert => {
      const cert = certificates?.find(c => c.id_certificado === userCert.id_certificado);
      return {
        titulo: cert?.curso || 'Certificado sin título',
        institucion: 'Institución no especificada', // This field doesn't exist in the current schema
        fecha_obtencion: userCert.fecha_inicio,
        fecha_expiracion: userCert.fecha_fin,
        url: userCert.url_archivo || cert?.url_pagina_certificado
      };
    });
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error in people-lead certificates API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}