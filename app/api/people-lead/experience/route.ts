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
        { error: 'You can only access experience of your assigned team members' },
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
          // First, get the relation between experiences and skills
          const { data: expSkillsRelations, error: relError } = await supabase
            .from('experiencias_habilidades')
            .select('id_habilidad, nivel_experiencia')
            .eq('id_experiencia', exp.id_experiencia);
          
          if (relError || !expSkillsRelations) {
            console.error(`Error fetching skill relations for experience ${exp.id_experiencia}:`, relError);
            return {
              ...exp,
              habilidades: []
            };
          }
          
          // Now fetch the actual skill data for each skill ID
          const skills = await Promise.all(
            expSkillsRelations.map(async (relation) => {
              const { data: skillData, error: skillError } = await supabase
                .from('habilidades')
                .select('titulo')
                .eq('id_habilidad', relation.id_habilidad)
                .single();
              
              if (skillError || !skillData) {
                console.error(`Error fetching skill ${relation.id_habilidad}:`, skillError);
                return {
                  id_habilidad: relation.id_habilidad,
                  nivel_experiencia: relation.nivel_experiencia,
                  titulo: 'Unnamed skill'
                };
              }
              
              return {
                id_habilidad: relation.id_habilidad,
                nivel_experiencia: relation.nivel_experiencia,
                titulo: skillData.titulo
              };
            })
          );
          
          return {
            ...exp,
            habilidades: skills
          };
        } catch (skillError) {
          console.error(`Error processing skills for experience ${exp.id_experiencia}:`, skillError);
          return {
            ...exp,
            habilidades: []
          };
        }
      })
    );
    
    return NextResponse.json(experiencesWithSkills);
  } catch (error) {
    console.error('Unexpected error in people-lead experience API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}