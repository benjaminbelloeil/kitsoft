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
    
    // Get user role with admin information
    const { data: roles, error } = await supabase
      .from('usuarios_roles')
      .select(`
        id_nivel,
        nivel!inner(
          numero
        )
      `)
      .eq('id_usuario', userId);
      
    if (error) {
      console.error('Error checking admin status:', error);
      return NextResponse.json(
        { error: 'Error checking admin status' },
        { status: 500 }
      );
    }
    
    // Check if any of the roles have admin privileges (role number 1)
    const isAdmin = (roles || []).some(role => 
      role.nivel && role.nivel.numero === 1
    );
    
    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error('Unexpected error in admin check API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}