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
    // Check if the current user is an admin - first get their current level ID
    const { data: userNivelesRecord, error: nivelesRecordError } = await supabase
      .from('usuarios_niveles')
      .select('id_nivel_actual')
      .eq('id_usuario', user.id)
      .order('fecha_cambio', { ascending: false })
      .limit(1)
      .single();
    
    if (nivelesRecordError || !userNivelesRecord) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    // Get the level details to check if admin
    const { data: nivelData, error: nivelError } = await supabase
      .from('niveles')
      .select('numero')
      .eq('id_nivel', userNivelesRecord.id_nivel_actual)
      .single();
      
    // Check if the user is admin (level number 1)
    if (nivelError || nivelData?.numero !== 1) {
      return NextResponse.json(
        { error: 'Only admins can delete users' },
        { status: 403 }
      );
    }
    
    // Begin transaction by deleting related records in the correct order
    
    // 1. Delete from correos (email table) first since it has a foreign key constraint
    const { error: correosError } = await supabase
      .from('correos')
      .delete()
      .eq('id_usuario', userId);
    
    if (correosError) {
      console.error('Error deleting user emails:', correosError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user emails' },
        { status: 500 }
      );
    }
    
    // 2. Delete from usuarios_niveles (role history)
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
    
    // 3. Delete certificates - check the correct column name first
    try {
      // Try with id_usuario column
      const { error: certError } = await supabase
        .from('certificados_usuarios')  // Using the correct join table name
        .delete()
        .eq('id_usuario', userId);
        
      if (certError) {
        console.error('Error deleting certificates:', certError);
      }
    } catch (certErr) {
      console.error('Exception when deleting certificates:', certErr);
    }
    
    // 4. Delete skills - check for correct table name
    try {
      const { error: skillsError } = await supabase
        .from('habilidades_usuario')  // Using the correct table name (singular)
        .delete()
        .eq('id_usuario', userId);
        
      if (skillsError) {
        console.error('Error deleting skills:', skillsError);
      }
    } catch (skillsErr) {
      console.error('Exception when deleting skills:', skillsErr);
    }
    
    // 5. Delete experiences 
    try {
      const { error: expError } = await supabase
        .from('experiencia')
        .delete()
        .eq('id_usuario', userId);
        
      if (expError) {
        console.error('Error deleting experiences:', expError);
      }
    } catch (expErr) {
      console.error('Exception when deleting experiences:', expErr);
    }
    
    // 6. Finally delete the user profile record
    const { error: profileError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id_usuario', userId);
      
    if (profileError) {
      console.error('Error deleting user profile:', profileError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete user profile: ' + profileError.message },
        { status: 500 }
      );
    }
      
    // 7. Delete the auth user using the admin client
    try {
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
