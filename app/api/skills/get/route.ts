/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    // Get userId from query params
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Create authenticated client
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Retrieve user skills with join to get skill names
    const { data: skills, error } = await supabase
      .from('habilidades_usuarios')
      .select(`
        id,
        id_usuario,
        id_habilidad,
        nivel,
        habilidades(
          id,
          nombre,
          categoria
        )
      `)
      .eq('id_usuario', userId);
      
    if (error) {
      console.error('Error fetching skills:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to fetch skills' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ skills });
  } catch (error: any) {
    console.error('Unexpected error in get skills API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}