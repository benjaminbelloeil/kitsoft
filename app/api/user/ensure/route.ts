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
    const { userId } = await request.json();
    
    // Security check: users can only ensure their own existence
    if (userId !== user.id) {
      // TODO: Add admin check here when implementing admin roles
      return NextResponse.json(
        { error: 'You can only ensure your own user record' },
        { status: 403 }
      );
    }
    
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('id_usuario')
      .eq('id_usuario', userId)
      .single();
    
    if (existingUser) {
      return NextResponse.json(true);  // User already exists
    }
    
    // If not, create the user
    const { error } = await supabase
      .from('usuarios')
      .insert({
        id_usuario: userId
      });
    
    if (error) {
      console.error('Error creating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(true);
  } catch (error) {
    console.error('Unexpected error in ensure user API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}