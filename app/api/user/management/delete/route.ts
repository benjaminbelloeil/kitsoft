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
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Security check: only admins can delete users
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
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    // Start transaction to delete all user data in the correct order
    // We'll use supabase's function call to execute the deletion atomically
    const { data: deletionResult, error: deletionError } = await supabase.rpc(
      'delete_user_complete',
      { target_user_id: userId }
    );
    
    if (deletionError) {
      console.error('Error deleting user:', deletionError);
      return NextResponse.json(
        { success: false, error: deletionError.message || 'Failed to delete user' },
        { status: 500 }
      );
    }
    
    // If the function doesn't exist, implement the deletion manually
    if (!deletionResult) {
      // Begin with cleanup - first delete all related data in dependent tables
      
      // Delete certificates
      const { error: certError } = await supabase
        .from('certificados')
        .delete()
        .eq('id_usuario', userId);
      
      if (certError) console.error('Error deleting certificates:', certError);
      
      // Delete skills
      const { error: skillsError } = await supabase
        .from('habilidades_usuarios')
        .delete()
        .eq('id_usuario', userId);
        
      if (skillsError) console.error('Error deleting skills:', skillsError);
      
      // Delete experiences
      const { error: expError } = await supabase
        .from('experiencia')
        .delete()
        .eq('id_usuario', userId);
        
      if (expError) console.error('Error deleting experiences:', expError);
      
      // Delete user roles
      const { error: rolesError } = await supabase
        .from('usuarios_roles')
        .delete()
        .eq('id_usuario', userId);
        
      if (rolesError) console.error('Error deleting roles:', rolesError);
      
      // Delete user profile
      const { error: profileError } = await supabase
        .from('usuarios')
        .delete()
        .eq('id_usuario', userId);
        
      if (profileError) {
        console.error('Error deleting user profile:', profileError);
        return NextResponse.json(
          { success: false, error: 'Failed to delete user profile' },
          { status: 500 }
        );
      }
      
      // Delete user auth record - this might require admin access or a service role
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authDeleteError) {
        console.error('Error deleting user auth record:', authDeleteError);
        return NextResponse.json(
          { success: false, error: 'Failed to delete user authentication record' },
          { status: 500 }
        );
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Unexpected error in delete user API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}