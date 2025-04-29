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
    const { userId, newRoleNumber } = await request.json();
    
    if (!userId || newRoleNumber === undefined) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }
    
    // Security check: normal users can't change roles
    // Only admins can change roles
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
          { error: 'Only admins can change user roles' },
          { status: 403 }
        );
      }
    }
    
    // Get the role ID for the new role number
    const { data: roleData, error: roleError } = await supabase
      .from('nivel')
      .select('id_nivel')
      .eq('numero', newRoleNumber)
      .single();
      
    if (roleError || !roleData) {
      console.error('Error finding role:', roleError);
      return NextResponse.json(
        { error: 'Invalid role number' },
        { status: 400 }
      );
    }
    
    // Delete all existing roles for this user first
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
    
    // Assign the new role
    const { error: assignError } = await supabase
      .from('usuarios_roles')
      .insert({
        id_usuario: userId,
        id_nivel: roleData.id_nivel
      });
      
    if (assignError) {
      console.error('Error assigning new role:', assignError);
      return NextResponse.json(
        { error: 'Error assigning new role' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in change role API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}