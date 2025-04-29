import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
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
    
    // Get the request body
    const { certificateId, userId, certificateData } = await request.json();
    
    if (!certificateId || !userId || !certificateData) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only update their own certificates
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update certificates in your own profile' },
        { status: 403 }
      );
    }
    
    // First verify that this certificate belongs to the user
    const { data: certData, error: certError } = await supabase
      .from('certificados')
      .select('id_usuario')
      .eq('id_certificado_usuario', certificateId)
      .single();
      
    if (certError || !certData) {
      console.error('Error fetching certificate:', certError);
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }
    
    if (certData.id_usuario !== userId) {
      return NextResponse.json(
        { error: 'You can only update your own certificates' },
        { status: 403 }
      );
    }
    
    // Update the certificate
    const { error } = await supabase
      .from('certificados')
      .update({
        fecha_emision: certificateData.fecha_emision,
        fecha_expiracion: certificateData.fecha_expiracion,
        url_certificado: certificateData.url_certificado
      })
      .eq('id_certificado_usuario', certificateId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this certificate
    
    if (error) {
      console.error('Error updating certificate:', error);
      return NextResponse.json(
        { error: 'Failed to update certificate' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in update certificate API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}