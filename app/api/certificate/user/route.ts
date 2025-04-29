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
    
    // Security check: normal users can only get their own certificates
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own certificates' },
        { status: 403 }
      );
    }
    
    // Get the certificates for this user
    const { data, error } = await supabase
      .from('certificados')
      .select(`
        *,
        tipos_certificado(*)
      `)
      .eq('id_usuario', userId)
      .order('fecha_emision', { ascending: false });
    
    if (error) {
      console.error('Error fetching user certificates:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user certificates' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Unexpected error in user certificates API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}