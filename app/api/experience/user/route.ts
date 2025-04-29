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