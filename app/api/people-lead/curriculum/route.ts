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
        { error: 'You can only access curriculum of your assigned team members' },
        { status: 403 }
      );
    }

    // Get the curriculum URL for the specified user
    const { data, error } = await supabase
      .from('usuarios')
      .select('url_curriculum')
      .eq('id_usuario', userId)
      .single();
    
    if (error) {
      console.error('Error fetching curriculum URL:', error);
      return NextResponse.json(
        { error: 'Failed to fetch curriculum URL' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      url: data?.url_curriculum || null 
    });
  } catch (error) {
    console.error('Unexpected error in people-lead curriculum API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}