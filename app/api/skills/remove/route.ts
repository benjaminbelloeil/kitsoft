import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function DELETE(request: NextRequest) {
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
    const { skillId, experienceId, userId } = await request.json();
    
    if (!skillId || !experienceId || !userId) {
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
    
    // Security check: users can only remove skills from their own experiences
    if (experienceData.id_usuario !== user.id || userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only remove skills from your own experiences' },
        { status: 403 }
      );
    }
    
    // Remove the skill from the experience
    const { error: removeError } = await supabase
      .from('experiencias_habilidades')
      .delete()
      .eq('id_habilidad', skillId)
      .eq('id_experiencia', experienceId);
    
    if (removeError) {
      console.error('Error removing skill from experience:', removeError);
      return NextResponse.json(
        { error: 'Failed to remove skill from experience' },
        { status: 500 }
      );
    }
    
    // Check if this skill is used in any other experiences
    const { data: otherExperiences, error: checkError } = await supabase
      .from('experiencias_habilidades')
      .select('id_experiencia')
      .eq('id_habilidad', skillId)
      .eq('id_usuario', userId);
    
    if (checkError) {
      console.error('Error checking other experiences with this skill:', checkError);
      // Continue anyway since the main operation succeeded
    }
    
    // If not used in any other experiences, also remove from user_skills
    if (!otherExperiences || otherExperiences.length === 0) {
      const { error: userSkillError } = await supabase
        .from('usuarios_habilidades')
        .delete()
        .eq('id_habilidad', skillId)
        .eq('id_usuario', userId);
      
      if (userSkillError) {
        console.error('Error removing skill from user:', userSkillError);
        // Continue anyway since the main operation succeeded
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in remove skill API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}