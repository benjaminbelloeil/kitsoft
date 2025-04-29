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
    const { experienceId, userId } = await request.json();
    
    if (!experienceId || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: verify this experience belongs to the authenticated user
    const { data: experienceOwner, error: ownerError } = await supabase
      .from('experiencia')
      .select('id_usuario')
      .eq('id_experiencia', experienceId)
      .single();
      
    if (ownerError || !experienceOwner) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }
    
    if (experienceOwner.id_usuario !== user.id || userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only delete your own experience records' },
        { status: 403 }
      );
    }
    
    // First delete associated skills
    const { error: skillsError } = await supabase
      .from('experiencias_habilidades')
      .delete()
      .eq('id_experiencia', experienceId);
      
    if (skillsError) {
      console.error('Error removing experience skills:', skillsError);
      // Continue anyway as we want to delete the experience
    }
    
    // Delete the experience
    const { error } = await supabase
      .from('experiencia')
      .delete()
      .eq('id_experiencia', experienceId)
      .eq('id_usuario', userId); // Extra security to ensure user owns this experience
    
    if (error) {
      console.error('Error deleting experience:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to delete experience' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in delete experience API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}