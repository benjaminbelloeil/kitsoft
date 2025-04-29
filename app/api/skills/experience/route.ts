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
    
    // Get the experienceId from query parameters
    const { searchParams } = new URL(request.url);
    const experienceId = searchParams.get('experienceId');
    
    if (!experienceId) {
      return NextResponse.json(
        { error: 'Experience ID is required' },
        { status: 400 }
      );
    }
    
    // Check if this experience belongs to the authenticated user
    const { data: experienceData, error: expError } = await supabase
      .from('experiencia')
      .select('id_usuario')
      .eq('id_experiencia', experienceId)
      .single();
      
    if (expError || !experienceData) {
      console.error('Error fetching experience:', expError);
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    
    // Security check: users can only get skills for their own experiences
    if (experienceData.id_usuario !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own experience skills' },
        { status: 403 }
      );
    }
    
    // Get the skills for this experience with a join to get the skill titles
    const { data, error } = await supabase
      .from('experiencias_habilidades')
      .select(`
        id_habilidad,
        id_experiencia,
        nivel_experiencia,
        habilidades (
          id_habilidad,
          titulo
        )
      `)
      .eq('id_experiencia', experienceId);
    
    if (error) {
      console.error('Error fetching experience skills:', error);
      return NextResponse.json(
        { error: 'Failed to fetch experience skills' },
        { status: 500 }
      );
    }
    
    // Transform the data to include the skill title directly in the object
    const transformedData = data?.map(item => ({
      id_habilidad: item.id_habilidad,
      id_experiencia: item.id_experiencia,
      nivel_experiencia: item.nivel_experiencia,
      titulo: item.habilidades?.[0]?.titulo || 'Unknown skill'
    })) || [];
    
    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Unexpected error in experience skills API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}