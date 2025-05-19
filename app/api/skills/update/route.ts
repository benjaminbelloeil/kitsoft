/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const { userId, skillId, level } = await request.json();
    
    if (!userId || !skillId || level === undefined || level === null) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: users can only update skills for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update skills in your own profile' },
        { status: 403 }
      );
    }
    
    // Update the skill level
    const { error } = await supabase
      .from('usuarios_habilidades')
      .update({ nivel: level })
      .eq('id_usuario', userId)
      .eq('id_habilidad', skillId);
      
    if (error) {
      console.error('Error updating skill:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update skill' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in update skill API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}