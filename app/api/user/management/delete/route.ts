import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { adminClient } from '@/utils/supabase/server-admin';

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
    // Check if the current user is an admin using usuarios_niveles
    const { data: userRole, error: roleError } = await supabase
      .from('usuarios_niveles')
      .select(`
        niveles:id_nivel_actual(numero)
      `)
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (roleError || (userRole?.niveles?.numero !== 1)) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    console.log(`Admin user ${user.id} is attempting to delete user ${userId}`);
    
    // Begin transaction by deleting related records in the correct order
    
    // 1. Delete from usuarios_niveles (role history) first as it's dependent on usuarios
    const { error: nivelesDeletionError } = await supabase
      .from('usuarios_niveles')
      .delete()
      .eq('id_usuario', userId);
    
    if (nivelesDeletionError) {
      console.error('Error deleting user roles history:', nivelesDeletionError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user role history' },
        { status: 500 }
      );
    }
    
    // 2. Delete any other related data (certificates, skills, experiences)
    const { error: certError } = await supabase
      .from('certificados')
      .delete()
      .eq('id_usuario', userId);
    
    if (certError) console.error('Error deleting certificates:', certError);
    
    const { error: skillsError } = await supabase
      .from('habilidades_usuarios')
      .delete()
      .eq('id_usuario', userId);
      
    if (skillsError) console.error('Error deleting skills:', skillsError);
    
    const { error: expError } = await supabase
      .from('experiencia')
      .delete()
      .eq('id_usuario', userId);
      
    if (expError) console.error('Error deleting experiences:', expError);
    
    // 3. Finally delete the user profile record
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
      
    // 4. Delete the auth user using the admin client
    try {
      console.log(`Deleting auth user ${userId} with admin client`);
      const { error: authDeleteError } = await adminClient.auth.admin.deleteUser(userId);
      
      if (authDeleteError) {
        console.error('Error deleting user auth record:', authDeleteError);
        // We'll continue anyway even if auth deletion fails
        // This prevents orphaned profiles but allows auth cleanup to happen later
      }
    } catch (authError) {
      console.error('Exception during auth user deletion:', authError);
      // Continue anyway - the database records are the most important
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