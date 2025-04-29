/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: NextRequest) {
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
    const { userId, skillId, level } = await request.json();
    
    if (!userId || !skillId || level === undefined || level === null) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only add skills for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only add skills to your own profile' },
        { status: 403 }
      );
    }
    
    // Check if the skill already exists for this user
    const { data: existingSkill, error: checkError } = await supabase
      .from('habilidades_usuarios')
      .select('*')
      .eq('id_usuario', userId)
      .eq('id_habilidad', skillId)
      .single();
    
    if (checkError && !checkError.message.includes('No rows found')) {
      console.error('Error checking existing skill:', checkError);
      return NextResponse.json(
        { error: checkError.message || 'Failed to check existing skill' },
        { status: 500 }
      );
    }
    
    // If the skill already exists, update it instead of adding a new one
    if (existingSkill) {
      const { error: updateError } = await supabase
        .from('habilidades_usuarios')
        .update({ nivel: level })
        .eq('id_usuario', userId)
        .eq('id_habilidad', skillId);
        
      if (updateError) {
        console.error('Error updating skill:', updateError);
        return NextResponse.json(
          { error: updateError.message || 'Failed to update skill' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({ success: true, updated: true });
    }
    
    // Insert the new skill
    const { error: insertError } = await supabase
      .from('habilidades_usuarios')
      .insert({
        id_usuario: userId,
        id_habilidad: skillId,
        nivel: level,
      });
      
    if (insertError) {
      console.error('Error adding skill:', insertError);
      return NextResponse.json(
        { error: insertError.message || 'Failed to add skill' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true, added: true });
  } catch (error: any) {
    console.error('Unexpected error in add skill API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}