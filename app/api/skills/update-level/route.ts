import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function PUT(request: NextRequest) {
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
    
    // Get the request body
    const { skillId, experienceId, userId, level } = await request.json();
    
    if (!skillId || !experienceId || !userId || level === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: verify this experience belongs to the authenticated user
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
    
    // Security check: users can only update skills in their own experiences
    if (experienceData.id_usuario !== user.id || userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update skills in your own experiences' },
        { status: 403 }
      );
    }
    
    // Update the skill level in the experience
    const { error: updateError } = await supabase
      .from('experiencias_habilidades')
      .update({ nivel_experiencia: level })
      .eq('id_habilidad', skillId)
      .eq('id_experiencia', experienceId);
    
    if (updateError) {
      console.error('Error updating skill level:', updateError);
      return NextResponse.json(
        { error: 'Failed to update skill level' },
        { status: 500 }
      );
    }
    
    // Update the user skill level if it exists
    const { data: userSkill } = await supabase
      .from('usuarios_habilidades')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_habilidad', skillId)
      .maybeSingle();
    
    if (userSkill) {
      const { error: userSkillError } = await supabase
        .from('usuarios_habilidades')
        .update({ nivel_experiencia: level })
        .eq('id_usuario', userId)
        .eq('id_habilidad', skillId);
      
      if (userSkillError) {
        console.error('Error updating user skill level:', userSkillError);
        // Continue anyway since the main operation succeeded
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in update skill level API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}