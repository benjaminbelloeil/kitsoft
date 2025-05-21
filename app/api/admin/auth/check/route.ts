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
    
    // Get user level with admin information
    // Get the latest level from usuarios_niveles
    const { data: userLevelRecord, error: levelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
      
    if (levelError) {
      console.error('Error checking admin status:', levelError);
      return NextResponse.json(
        { error: 'Error checking admin status' },
        { status: 500 }
      );
    }
    
    // If user has no level, they're not an admin
    if (!userLevelRecord) {
      return NextResponse.json({ isAdmin: false });
    }
    
    // Now check if this level has numero = 1 (admin)
    const { data: levelDetails, error: levelDetailsError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userLevelRecord.id_nivel_actual)
      .single();
    
    if (levelDetailsError) {
      console.error('Error fetching level details:', levelDetailsError);
      return NextResponse.json(
        { error: 'Error checking admin status' },
        { status: 500 }
      );
    }
    
    console.log('User level data:', levelDetails); // For debugging
    
    // Check if the level has admin privileges (level number 1)
    const isAdmin = levelDetails.numero === 1;
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Unexpected error in admin check API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
