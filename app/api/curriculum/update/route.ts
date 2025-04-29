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
    const { userId, url } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }
    
    // Security check: users can only update curriculums for themselves unless they're admin
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only update curriculum for your own profile' },
        { status: 403 }
      );
    }
    
    // Update the database with new URL or null to remove curriculum reference
    const { error } = await supabase
      .from('usuarios')
      .update({ url_curriculum: url })
      .eq('id_usuario', userId);

    if (error) {
      console.error('Error updating curriculum in database:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update curriculum' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Unexpected error in update curriculum API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}