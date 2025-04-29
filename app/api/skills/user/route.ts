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
    
    // Security check: normal users can only get their own skills
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own skills' },
        { status: 403 }
      );
    }
    
    // Get the skills for this user with a join to get the skill titles
    const { data, error } = await supabase
      .from('usuarios_habilidades')
      .select(`
        id_habilidad,
        id_usuario,
        nivel_experiencia,
        habilidades (
          id_habilidad,
          titulo
        )
      `)
      .eq('id_usuario', userId);
    
    if (error) {
      console.error('Error fetching user skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user skills' },
        { status: 500 }
      );
    }
    
    // Transform the data to include the skill title directly in the object
    const transformedData = data?.map(item => ({
      id_habilidad: item.id_habilidad,
      id_usuario: item.id_usuario,
      nivel_experiencia: item.nivel_experiencia,
      titulo: item.habilidades?.[0]?.titulo || 'Unknown skill'
    })) || [];
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error in user skills API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}