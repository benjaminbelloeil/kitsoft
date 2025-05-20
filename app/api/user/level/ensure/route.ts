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
    
    // Security check: normal users can only ensure levels for themselves
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin levels
      return NextResponse.json(
        { error: 'You can only manage your own levels' },
        { status: 403 }
      );
    }
    
    // First get all level entries for this user to check if any exist
    const { data: existingLevels, error: levelsError } = await supabase
      .from('usuarios_roles')
      .select('id_nivel, nivel(numero)')
      .eq('id_usuario', userId);
      
    if (levelsError) {
      console.error('Error checking user levels:', levelsError);
      return NextResponse.json(
        { error: 'Error checking user levels' },
        { status: 500 }
      );
    }
    
    // If user already has levels, return the level number of the first one
    // In a proper implementation, we might need to handle multiple levels or level priority
    if (existingLevels && existingLevels.length > 0) {
      const levelNumber = existingLevels[0].nivel?.numero || 0;
      return NextResponse.json({ levelNumber });
    }
    
    // If no level exists, assign the default level (staff = 0)
    // First get the ID of the staff level
    const { data: staffLevel, error: staffError } = await supabase
      .from('nivel')
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
    
    // Assign the staff level to the user
    const { error: assignError } = await supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: userId,
        id_nivel: staffLevel.id_nivel
      });
      
    if (assignError) {
      console.error('Error assigning default level:', assignError);
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
