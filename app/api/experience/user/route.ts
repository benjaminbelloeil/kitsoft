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
    
    // Security check: normal users can only get their own experiences
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only access your own experiences' },
        { status: 403 }
      );
    }
    
    // Fetch the experiences
    const { data: experiences, error } = await supabase
      .from('experiencia')
      .select('*')
      .eq('id_usuario', userId)
      .order('fecha_inicio', { ascending: false });
    
    if (error) {
      console.error('Error fetching user experiences:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user experiences' },
        { status: 500 }
      );
    }
    
    if (!experiences || experiences.length === 0) {
      return NextResponse.json([]);
    }
    
    // Fetch skills for each experience
    const experiencesWithSkills = await Promise.all(
      experiences.map(async (exp) => {
        // Get the skills for this experience
        try {
          const expSkills = await supabase
            .from('experiencias_habilidades')
            .select(`
              id_habilidad,
              nivel_experiencia,
              habilidades (
                id_habilidad,
                titulo
              )
            `)
            .eq('id_experiencia', exp.id_experiencia);
            
          // Transform skills to the format expected by the UI
          const skills = expSkills.data ? expSkills.data.map(skillRecord => ({
            id_habilidad: skillRecord.id_habilidad,
            nivel_experiencia: skillRecord.nivel_experiencia,
            titulo: skillRecord.habilidades ? skillRecord.habilidades.titulo : 'Unnamed skill'
          })) : [];
          
          return {
            ...exp,
            habilidades: skills
          };
        } catch (skillError) {
          console.error(`Error fetching skills for experience ${exp.id_experiencia}:`, skillError);
          return {
            ...exp,
            habilidades: []
          };
        }
      })
    );
    
    return NextResponse.json(experiencesWithSkills);
  } catch (error) {
    console.error('Unexpected error in user experiences API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}