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
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: normal users can only reset their own roles
    if (userId !== user.id) {
      // Check if the current user is an admin
      const { data: adminCheck, error: adminError } = await supabase
        .from('usuarios_roles')
        .select(`
          id_nivel,
          nivel!inner(
            numero
          )
        `)
        .eq('id_usuario', user.id)
        .eq('nivel.numero', 1);
        
      if (adminError || !adminCheck || adminCheck.length === 0) {
        return NextResponse.json(
          { error: 'Only admins can reset other users\' roles' },
          { status: 403 }
        );
      }
    }
    
    // First, get the ID of the staff role
    const { data: staffRole, error: staffError } = await supabase
      .from('nivel')
      .select('id_nivel')
      .eq('numero', 0)
      .single();
      
    if (staffError || !staffRole) {
      console.error('Error finding staff role:', staffError);
      return NextResponse.json(
        { error: 'Error finding staff role' },
        { status: 500 }
      );
    }
    
    // Delete all existing roles for this user
    const { error: deleteError } = await supabase
      .from('usuarios_roles')
      .delete()
      .eq('id_usuario', userId);
      
    if (deleteError) {
      console.error('Error deleting existing roles:', deleteError);
      return NextResponse.json(
        { error: 'Error deleting existing roles' },
        { status: 500 }
      );
    }
    
    // Assign the staff role to the user
    const { error: assignError } = await supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: userId,
        id_nivel: staffRole.id_nivel
      });
      
    if (assignError) {
      console.error('Error assigning staff role:', assignError);
      return NextResponse.json(
        { error: 'Error assigning staff role' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in reset user role API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}