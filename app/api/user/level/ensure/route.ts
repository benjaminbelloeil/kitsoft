import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { randomUUID } from 'crypto';

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
    
    // Security check: normal users can only ensure levels for themselves
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin levels
      return NextResponse.json(
        { error: 'You can only manage your own levels' },
        { status: 403 }
      );
    }
    
    // Check if the user already has an entry in usuarios_niveles
    const { data: existingNivel, error: nivelError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', userId)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
      
    // If user already has a level assigned, get the level information
    if (!nivelError && existingNivel) {
      // Get the level details
      const { data: levelDetail, error: levelError } = await supabase
        .from('niveles')
        .select('numero')
        .eq('id_nivel', existingNivel.id_nivel_actual)
        .single();
        
      if (levelError) {
        console.error('Error fetching level details:', levelError);
        return NextResponse.json(
          { error: 'Error fetching level details' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ levelNumber: levelDetail.numero });
    }
    
    // If no level exists, assign the default level (staff = 0)
    // First get the ID of the staff level
    const { data: staffLevel, error: staffError } = await supabase
      .from('niveles')
      .select('id_nivel')
      .eq('numero', 0)
      .single();
      
    if (staffError || !staffLevel) {
      console.error('Error finding staff level:', staffError);
      return NextResponse.json(
        { error: 'Error finding default level' },
        { status: 500 }
      );
    }
    
    // Create a new entry in usuarios_niveles
    const timestamp = new Date().toISOString();
    const id_historial = randomUUID();
    
    const { error: insertError } = await supabase
      .from('usuarios_niveles')
      .insert([
        { 
          id_historial,
          id_usuario: userId,
          id_nivel_actual: staffLevel.id_nivel,
          id_nivel_previo: null,
          fecha_cambio: timestamp 
        }
      ]);
      
    if (insertError) {
      console.error('Error assigning default level:', insertError);
      return NextResponse.json(
        { error: 'Error assigning default level' },
        { status: 500 }
      );
    }
    
    // Return the default level number
    return NextResponse.json({ levelNumber: 0 });
  } catch (error) {
    console.error('Unexpected error in ensure user level API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
